"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      {/* Content - scrollable when needed */}
      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto px-4 py-6">
        <div className="flex flex-col justify-center min-h-full">
          {children}
        </div>
      </main>

      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
