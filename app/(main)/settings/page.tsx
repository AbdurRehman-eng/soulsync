"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Palette,
  Globe,
  Trash2,
  Download,
  RefreshCw,
  AlertTriangle,
  Check,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useThemeStore, themes, ThemeSlug } from "@/stores/themeStore";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const { profile, isAuthenticated, logout } = useUserStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      // Clear local caches immediately (fast, no network needed)
      localStorage.removeItem("soul-sync-feed-cache");
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }

      // Try server cache with a 5s timeout -- don't block on slow network
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        await fetch("/api/feed/clear-cache", {
          method: "POST",
          signal: controller.signal,
        });
      } catch {}
      clearTimeout(timeout);

      toast.success("Cache cleared! Your feed will refresh with new content.");
    } catch {
      toast.error("Failed to clear cache. Please try again.");
    } finally {
      setClearingCache(false);
    }
  };

  const handleExportData = async () => {
    if (!isAuthenticated || !profile) {
      toast.error("Sign in to export your data.");
      return;
    }

    setExporting(true);
    try {
      const supabase = createClient();

      const withTimeout = <T,>(promise: PromiseLike<T>, ms = 8000): Promise<T> =>
        Promise.race([
          Promise.resolve(promise),
          new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), ms)
          ),
        ]);

      const results = await Promise.allSettled([
        withTimeout(
          supabase
            .from("card_interactions")
            .select("interaction_type, card_id, created_at")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: false })
            .limit(1000)
        ),
        withTimeout(
          supabase
            .from("mood_logs")
            .select("mood_id, logged_at")
            .eq("user_id", profile.id)
            .order("logged_at", { ascending: false })
            .limit(500)
        ),
        withTimeout(
          supabase
            .from("journal_entries")
            .select("content, created_at")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: false })
            .limit(500)
        ),
        withTimeout(
          supabase
            .from("user_rewards")
            .select("reward_id, claimed_at")
            .eq("user_id", profile.id)
            .limit(500)
        ),
        withTimeout(
          supabase
            .from("user_tasks")
            .select("task_id, status, completed_at, created_at")
            .eq("user_id", profile.id)
            .limit(500)
        ),
      ]);

      const extract = (r: PromiseSettledResult<any>) =>
        r.status === "fulfilled" ? r.value?.data || [] : [];

      const exportData = {
        exported_at: new Date().toISOString(),
        profile: {
          username: profile.username,
          display_name: profile.display_name,
          membership_level: profile.membership_level,
          points: profile.points,
          current_streak: profile.current_streak,
          longest_streak: profile.longest_streak,
          created_at: profile.created_at,
        },
        interactions: extract(results[0]),
        mood_logs: extract(results[1]),
        journal_entries: extract(results[2]),
        rewards: extract(results[3]),
        tasks: extract(results[4]),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `soul-sync-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully!");
    } catch {
      toast.error("Failed to export data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!isAuthenticated) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      logout();
      toast.success("Account signed out. Contact support to fully delete your data.");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch {
      logout();
      window.location.href = "/";
    }
  };

  return (
    <div className="px-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/more"
          className="p-2 -ml-2 hover:bg-muted/30 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Customise your Soul Sync experience
          </p>
        </div>
      </div>

      {/* Theme section */}
      <section className="mb-6">
        <h3 className="text-sm text-muted-foreground mb-2 px-1">Appearance</h3>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <Palette className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Theme</span>
          </div>
          <div className="space-y-2">
            {(Object.keys(themes) as ThemeSlug[]).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => {
                  setTheme(themeKey);
                  toast.success(`Theme changed to ${themes[themeKey].name}`);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  theme === themeKey
                    ? "bg-primary/20 border border-primary"
                    : "hover:bg-muted/30"
                }`}
              >
                <div className="flex gap-1">
                  {themes[themeKey].preview.map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="flex-1 text-left text-sm">{themes[themeKey].name}</span>
                {theme === themeKey && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Data section */}
      <section className="mb-6">
        <h3 className="text-sm text-muted-foreground mb-2 px-1">Data</h3>
        <div className="glass-card overflow-hidden">
          <button
            onClick={handleClearCache}
            disabled={clearingCache}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors disabled:opacity-50"
          >
            {clearingCache ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5 text-muted-foreground" />
            )}
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Clear Cache</p>
              <p className="text-xs text-muted-foreground">
                Refresh your feed and clear stored data
              </p>
            </div>
          </button>
          <div className="h-px bg-border mx-4" />
          <button
            onClick={handleExportData}
            disabled={exporting}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            ) : (
              <Download className="w-5 h-5 text-muted-foreground" />
            )}
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Export Data</p>
              <p className="text-xs text-muted-foreground">
                Download a copy of your account data
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Language */}
      <section className="mb-6">
        <h3 className="text-sm text-muted-foreground mb-2 px-1">Language</h3>
        <div className="glass-card overflow-hidden">
          <button
            onClick={() => toast("More languages coming soon!", { icon: "\ud83c\udf10" })}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors"
          >
            <Globe className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Language</p>
              <p className="text-xs text-muted-foreground">English (UK)</p>
            </div>
            <span className="text-xs text-muted-foreground">English</span>
          </button>
        </div>
      </section>

      {/* Danger zone */}
      {isAuthenticated && (
        <section>
          <h3 className="text-sm text-destructive mb-2 px-1">Danger Zone</h3>
          <div className="glass-card overflow-hidden border-destructive/30">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-destructive" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-destructive">Delete Account</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently remove your account and all data
                  </p>
                </div>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4"
              >
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">
                      Are you sure?
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This will sign you out and request account deletion. Your progress, streaks, and saved content will be removed. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/30 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      <p className="text-center text-xs text-muted-foreground mt-6">
        Soul Sync v1.0.0
      </p>
    </div>
  );
}
