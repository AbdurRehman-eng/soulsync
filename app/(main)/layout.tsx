"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { useMoodStore } from "@/stores/moodStore";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/lib/supabase/client";

// Lazy load modal/overlay components — they're never needed on initial paint
const MoodSelector = dynamic(() => import("@/components/mood/MoodSelector").then(m => ({ default: m.MoodSelector })), { ssr: false });
const MascotChat = dynamic(() => import("@/components/mascot/MascotChat").then(m => ({ default: m.MascotChat })), { ssr: false });
const RewardPopup = dynamic(() => import("@/components/gamification/RewardPopup").then(m => ({ default: m.RewardPopup })), { ssr: false });

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { checkSyncStatus, setAvailableMoods } = useMoodStore();
  const { setProfile, setLoading, updateStreak } = useUserStore();

  // Capture referral code from URL (?ref=CODE) and persist to localStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref && ref.trim()) {
        localStorage.setItem("ss_referral_code", ref.trim().toUpperCase());
      }
    } catch {}
  }, []);

  // Listen for navigation events from BottomNav (single modal instance pattern)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type === "mood-selector") setShowMoodSelector(true);
      else if (detail?.type === "mascot-chat") setShowChat(true);
    };
    window.addEventListener("soul-sync-nav", handler);
    return () => window.removeEventListener("soul-sync-nav", handler);
  }, []);

  // Check authentication and load user profile + moods in parallel
  useEffect(() => {
    const supabase = createClient();

    const clearSession = () => {
      setProfile(null);
      setLoading(false);
    };

    const loadUser = async () => {
      try {
        // Use getUser() instead of getSession() — it validates with the server
        // and won't return stale/expired sessions from local storage
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          // If the refresh token is invalid, sign out to clear stale cookies/storage
          if (userError?.message?.includes("Refresh Token") || userError?.message?.includes("refresh_token")) {
            await supabase.auth.signOut();
          }
          clearSession();
          return;
        }

        // Load profile and moods in parallel
        const [profileResult, moodsResult] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          fetch("/api/mood"),
        ]);

        if (profileResult.data) {
          setProfile(profileResult.data);
          // Process daily login and update streak (fire-and-forget)
          fetch("/api/daily-login", { method: "POST" })
            .then((r) => r.ok ? r.json() : null)
            .then((data) => {
              if (data?.newStreak !== undefined) updateStreak(data.newStreak);
              else if (data?.currentStreak !== undefined) updateStreak(data.currentStreak);
            })
            .catch(() => {});

          // Process any pending referral code
          try {
            const pendingRef = localStorage.getItem("ss_referral_code");
            if (pendingRef && profileResult.data.referred_by) {
              // Already referred — just clean up the stale key
              localStorage.removeItem("ss_referral_code");
            } else if (pendingRef && !profileResult.data.referred_by) {
              fetch("/api/referral", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ referralCode: pendingRef }),
              })
                .then(async (r) => {
                  if (r.ok) {
                    localStorage.removeItem("ss_referral_code");
                    const data = await r.json().catch(() => null);
                    // Refresh profile to show updated points/XP
                    const { data: refreshed } = await supabase
                      .from("profiles")
                      .select("*")
                      .eq("id", user!.id)
                      .single();
                    if (refreshed) setProfile(refreshed);
                  } else {
                    const data = await r.json().catch(() => ({}));
                    console.error("Referral processing failed:", r.status, data);
                    // Clear on definitive client errors (won't succeed on retry)
                    if (r.status === 400 || r.status === 404) {
                      localStorage.removeItem("ss_referral_code");
                    }
                  }
                })
                .catch((err) => console.error("Referral fetch error:", err));
            }
          } catch {}
        } else {
          setProfile(null);
        }

        if (moodsResult.ok) {
          const data = await moodsResult.json();
          if (data.moods?.length > 0) setAvailableMoods(data.moods);
        }
      } catch (error) {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profile) {
          setProfile(profile);

          // Process any pending referral code stored during signup
          try {
            const pendingRef = localStorage.getItem("ss_referral_code");
            if (pendingRef && !profile.referred_by) {
              fetch("/api/referral", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ referralCode: pendingRef }),
              })
                .then(async (r) => {
                  if (r.ok) {
                    localStorage.removeItem("ss_referral_code");
                    // Refresh profile to show updated points/XP
                    const { data: refreshed } = await supabase
                      .from("profiles")
                      .select("*")
                      .eq("id", session.user.id)
                      .single();
                    if (refreshed) setProfile(refreshed);
                  } else {
                    const data = await r.json().catch(() => ({}));
                    console.error("Referral processing failed:", r.status, data);
                    if (r.status === 400 || r.status === 404) {
                      localStorage.removeItem("ss_referral_code");
                    }
                  }
                })
                .catch((err) => console.error("Referral fetch error:", err));
            }
          } catch {}
        }
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
      } else if (event === "TOKEN_REFRESHED" && !session) {
        // Token refresh failed — clear everything
        clearSession();
      }
    });

    return () => subscription.unsubscribe();
  }, [setProfile, setLoading, setAvailableMoods, updateStreak]);

  // Check mood sync status on mount
  useEffect(() => {
    const synced = checkSyncStatus();
    if (!synced) {
      // Show mood selector after a brief delay on first visit
      const timer = setTimeout(() => setShowMoodSelector(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [checkSyncStatus]);

  const closeMoodSelector = useCallback(() => setShowMoodSelector(false), []);
  const closeChat = useCallback(() => setShowChat(false), []);

  return (
    <div className="app-container h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 min-h-0 pt-[calc(env(safe-area-inset-top,20px)+76px)] pb-nav-clearance flex flex-col overflow-x-hidden overflow-y-auto scroll-area">{children}</main>

      <BottomNav />

      {/* Single modal instances for the entire app */}
      {showMoodSelector && (
        <MoodSelector isOpen={showMoodSelector} onClose={closeMoodSelector} />
      )}

      {showChat && (
        <MascotChat isOpen={showChat} onClose={closeChat} />
      )}

      {/* Reward Popup */}
      <RewardPopup />
    </div>
  );
}
