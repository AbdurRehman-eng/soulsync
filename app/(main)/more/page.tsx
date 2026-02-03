"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Heart,
  Settings,
  Palette,
  Bell,
  Shield,
  HelpCircle,
  MessageCircle,
  LogOut,
  Crown,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useThemeStore, themes, ThemeSlug } from "@/stores/themeStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function MorePage() {
  const { profile, isAuthenticated, logout } = useUserStore();
  const { theme, setTheme } = useThemeStore();
  const [showThemes, setShowThemes] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side session
      await fetch("/api/auth/logout", { method: "POST" });

      // Also clear client-side Supabase session
      const supabase = createClient();
      await supabase.auth.signOut();

      // Clear local state
      logout();

      // Force a hard refresh to clear all client-side cache and cookies
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout anyway
      logout();
      window.location.href = "/";
    }
  };

  const menuItems = [
    {
      section: "Account",
      items: [
        { icon: User, label: "Profile", href: "/profile" },
        { icon: Heart, label: "Liked Content", href: "/likes" },
        { icon: Crown, label: "Membership", href: "/membership" },
      ],
    },
    {
      section: "Preferences",
      items: [
        {
          icon: Palette,
          label: "Theme",
          action: () => setShowThemes(!showThemes),
        },
        { icon: Bell, label: "Notifications", href: "/notifications" },
        { icon: Settings, label: "Settings", href: "/settings" },
      ],
    },
    {
      section: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", href: "/help" },
        { icon: MessageCircle, label: "Contact Us", href: "/contact" },
        { icon: Shield, label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  return (
    <div className="px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">More</h1>
      </div>

      {/* User card */}
      {isAuthenticated && profile ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {profile.display_name || profile.username || "User"}
              </h3>
              <p className="text-sm text-muted-foreground">
                @{profile.username || "anonymous"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {profile.membership_level > 1 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">
                    <Crown className="w-3 h-3" />
                    {profile.membership_level === 2 ? "Plus" : "Premium"}
                  </span>
                )}
              </div>
            </div>
            <Link href="/profile">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6 text-center"
        >
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold text-lg mb-2">Join Soul Sync</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to track your progress and unlock all features
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/login">
              <button className="px-6 py-2 rounded-full glass-card hover:bg-muted/50 transition-colors">
                Log in
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-2 rounded-full bg-primary text-primary-foreground">
                Sign up
              </button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Menu sections */}
      {menuItems.map((section, sectionIndex) => (
        <div key={section.section} className="mb-4">
          <h4 className="text-sm text-muted-foreground mb-2 px-2">
            {section.section}
          </h4>
          <div className="glass-card overflow-hidden">
            {section.items.map((item, itemIndex) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (sectionIndex * 3 + itemIndex) * 0.05 }}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.label === "Theme" && (
                      <span className="text-sm text-muted-foreground">
                        {themes[theme].name}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}

                {/* Theme selector (expanded) */}
                {item.label === "Theme" && showThemes && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className="overflow-hidden bg-muted/20"
                  >
                    <div className="p-4 space-y-2">
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
                          <span className="flex-1 text-left">
                            {themes[themeKey].name}
                          </span>
                          {theme === themeKey && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {itemIndex < section.items.length - 1 && (
                  <div className="h-px bg-border mx-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Logout button */}
      {isAuthenticated && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 p-4 glass-card text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </motion.button>
      )}

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground mt-4 mb-6">
        Soul Sync v1.0.0
      </p>
    </div>
  );
}
