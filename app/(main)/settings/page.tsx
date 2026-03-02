"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Globe,
  Trash2,
  Download,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Check,
} from "lucide-react";
import { useThemeStore, themes, ThemeSlug } from "@/stores/themeStore";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const { profile, isAuthenticated, logout } = useUserStore();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      await fetch("/api/feed/clear-cache", { method: "POST" });
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      localStorage.removeItem("soul-sync-feed-cache");
    } catch {}
    setClearingCache(false);
  };

  const handleDeleteAccount = async () => {
    if (!isAuthenticated) return;
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      logout();
      window.location.href = "/";
    } catch {
      logout();
      window.location.href = "/";
    }
  };

  return (
    <div className="px-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Customise your Soul Sync experience
        </p>
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
                onClick={() => setTheme(themeKey)}
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
            <RefreshCw className={`w-5 h-5 text-muted-foreground ${clearingCache ? "animate-spin" : ""}`} />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Clear Cache</p>
              <p className="text-xs text-muted-foreground">
                Refresh your feed and clear stored data
              </p>
            </div>
          </button>
          <div className="h-px bg-border mx-4" />
          <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors">
            <Download className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Export Data</p>
              <p className="text-xs text-muted-foreground">
                Download a copy of your account data
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Language */}
      <section className="mb-6">
        <h3 className="text-sm text-muted-foreground mb-2 px-1">Language</h3>
        <div className="glass-card overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Language</p>
              <p className="text-xs text-muted-foreground">English (UK)</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
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
                      This will permanently delete your account, progress, streaks, and all saved content. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/30"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90"
                  >
                    Delete Account
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
