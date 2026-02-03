"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Flame } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

export function Header() {
  const { profile, isAuthenticated, loading } = useUserStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pt-safe">
      <div className="glass-card mx-2 sm:mx-4 mt-2 sm:mt-4 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {isAuthenticated && profile ? (
            <>
              {/* Left side - Spark Points */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-[#fbbf24] fill-[#fbbf24]" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] sm:text-[10px] text-cyan-400 font-bold uppercase tracking-wider leading-tight">
                    Spark Points
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#fbbf24] leading-none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    {profile.points}
                  </span>
                </div>
              </div>

              {/* Right side - Streak + Membership Button */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Streak */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] sm:text-[10px] text-cyan-400 font-bold uppercase tracking-wider leading-tight">
                      Streak
                    </span>
                    <span className="text-base sm:text-lg font-black text-orange-500 leading-none">
                      {profile.current_streak || 0} {profile.current_streak === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>

                {/* Membership Level Button */}
                <Link href="/profile">
                  <motion.button
                    className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#fbbf24] text-black font-black text-xs sm:text-sm uppercase tracking-wide"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)' }}
                  >
                    Spark
                  </motion.button>
                </Link>
              </div>
            </>
          ) : loading ? (
            <>
              {/* Loading skeleton - only show when loading and no profile */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-muted/30 rounded-full animate-pulse" />
                <div className="flex flex-col gap-1">
                  <div className="h-2 w-16 bg-muted/30 rounded animate-pulse" />
                  <div className="h-6 w-12 bg-muted/30 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-24 bg-muted/30 rounded-full animate-pulse" />
              </div>
            </>
          ) : (
            <>
              {/* Logged out state */}
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <motion.button
                    className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full hover:bg-muted/50 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    Log in
                  </motion.button>
                </Link>
                <Link href="/signup">
                  <motion.button
                    className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full bg-[#fbbf24] text-black hover:opacity-90 transition-opacity"
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign up
                  </motion.button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
