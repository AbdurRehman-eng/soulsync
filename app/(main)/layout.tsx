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

    const loadUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        // Load profile and moods in parallel
        const [profileResult, moodsResult] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", session.user.id).single(),
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
        } else {
          setProfile(null);
        }

        if (moodsResult.ok) {
          const data = await moodsResult.json();
          if (data.moods?.length > 0) setAvailableMoods(data.moods);
        }
      } catch (error) {
        setProfile(null);
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
        if (profile) setProfile(profile);
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
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
