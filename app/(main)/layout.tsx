"use client";

import { useEffect, useState } from "react";
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
  const { isSynced, checkSyncStatus, setAvailableMoods } = useMoodStore();
  const { setProfile, setLoading, updateStreak } = useUserStore();

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
          // Check daily login after profile is set (fire-and-forget)
          fetch("/api/daily-login")
            .then((r) => r.ok ? r.json() : null)
            .then((data) => { if (data?.currentStreak !== undefined) updateStreak(data.currentStreak); })
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

  // Handle Soul Sync button click
  const handleSoulSyncClick = () => {
    if (!isSynced) {
      setShowMoodSelector(true);
    } else {
      setShowChat(true);
    }
  };

  return (
    <div className="app-container h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 min-h-0 pt-[clamp(80px,20vw,96px)] pb-nav-clearance flex flex-col overflow-x-hidden overflow-y-auto scroll-area">{children}</main>

      <BottomNav />

      {/* Mood Selector Modal */}
      <MoodSelector
        isOpen={showMoodSelector}
        onClose={() => setShowMoodSelector(false)}
      />

      {/* AI Chat Modal */}
      <MascotChat isOpen={showChat} onClose={() => setShowChat(false)} />

      {/* Reward Popup */}
      <RewardPopup />
    </div>
  );
}
