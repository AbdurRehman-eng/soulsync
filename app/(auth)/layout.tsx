"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Capture referral code from URL (?ref=CODE)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref && ref.trim()) {
        localStorage.setItem("ss_referral_code", ref.trim().toUpperCase());
      }
    } catch {}
  }, []);

  return (
    <div className="app-container h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="relative z-10 p-4 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <span className="font-bold text-xl text-gradient">Soul Sync</span>
        </Link>
      </header>

      {/* Content - scrollable; bottom padding keeps form and "Sign up" link above the nav */}
      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-area px-4 pt-6 pb-nav-clearance">
        <div className="flex flex-col min-h-0 pb-8">
          {children}
        </div>
      </main>

      <BottomNav />

      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
