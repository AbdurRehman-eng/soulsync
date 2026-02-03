"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { MoodSelector } from "@/components/mood/MoodSelector";
import { MascotChat } from "@/components/mascot/MascotChat";
import { RewardPopup } from "@/components/gamification/RewardPopup";
import { useMoodStore } from "@/stores/moodStore";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/lib/supabase/client";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { isSynced, checkSyncStatus, setAvailableMoods } = useMoodStore();
  const { setProfile, setLoading, updateStreak } = useUserStore();

  // Check authentication and load user profile
  useEffect(() => {
    const supabase = createClient();

    const loadUser = async () => {
      try {
        // First, try to refresh the session to ensure it's valid
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setProfile(null);
          setLoading(false);
          return;
        }

        if (!session?.user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        // If we have a valid session, load the profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          setProfile(null);
        } else if (profile) {
          setProfile(profile);
        }
      } catch (error) {
        console.error("Load user error:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setProfile(profile);
        }
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setProfile, setLoading]);

  // Check daily login and update streak
  useEffect(() => {
    const checkDailyLogin = async () => {
      try {
        const response = await fetch("/api/daily-login");
        if (response.ok) {
          const data = await response.json();
          if (data.currentStreak !== undefined) {
            updateStreak(data.currentStreak);
          }
        }
      } catch (error) {
        console.error("Failed to check daily login:", error);
      }
    };

    const { profile } = useUserStore.getState();
    if (profile) {
      checkDailyLogin();
    }
  }, [updateStreak]);

  // Load available moods from database
  useEffect(() => {
    const loadMoods = async () => {
      try {
        const response = await fetch("/api/mood");
        if (response.ok) {
          const data = await response.json();
          if (data.moods && data.moods.length > 0) {
            setAvailableMoods(data.moods);
          }
        }
      } catch (error) {
        console.error("Failed to load moods:", error);
      }
    };

    loadMoods();
  }, [setAvailableMoods]);

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
