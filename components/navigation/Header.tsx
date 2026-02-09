"use client";

import { memo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Flame, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

export const Header = memo(function Header() {
  const { profile, isAuthenticated, loading, logout } = useUserStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-safe">
      <div className="glass-card mx-2 sm:mx-4 mt-2 sm:mt-4 px-3 sm:px-4 py-2 sm:py-3 overflow-visible">
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

                {/* Spark Button with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#fbbf24] text-black font-black text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1 active:scale-95 transition-transform"
                    style={{ boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)' }}
                  >
                    Spark
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu — CSS transition instead of AnimatePresence */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 sm:w-48 glass-card rounded-xl overflow-hidden z-50 animate-scale-in">
                      {/* Admin option - only for admins */}
                      {profile.is_admin && (
                        <Link
                          href="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-purple-500" />
                          <span>Admin</span>
                        </Link>
                      )}

                      {/* Profile option */}
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
                      >
                        <User className="w-4 h-4 text-primary" />
                        <span>Profile</span>
                      </Link>

                      {/* Logout option */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors text-red-500"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : loading ? (
            <>
              {/* Loading skeleton */}
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
                <Link href="/login" className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full hover:bg-muted/50 transition-colors active:scale-95">
                  Log in
                </Link>
                <Link href="/signup" className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full bg-[#fbbf24] text-black hover:opacity-90 transition-opacity active:scale-95">
                  Sign up
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
});
