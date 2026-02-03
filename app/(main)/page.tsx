"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMoodStore } from "@/stores/moodStore";
import { useUserStore } from "@/stores/userStore";
import { Mascot } from "@/components/mascot/Mascot";
import { MoodSelector } from "@/components/mood/MoodSelector";
import { MoodBadge } from "@/components/mood/MoodBadge";
import { MoodCarousel } from "@/components/feed/MoodCarousel";
import { CardFeed } from "@/components/feed/CardFeed";
import { getGreeting } from "@/lib/utils";
import type { Card } from "@/types";

// Sample cards for demo - in production, these come from the API
const sampleMoodCards: Card[] = [
  {
    id: "verse-1",
    type: "verse",
    title: "Today's Verse",
    subtitle: null,
    content: {
      verse_text:
        "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
      verse_reference: "Jeremiah 29:11",
    },
    thumbnail_url: null,
    background_url: null,
    min_membership_level: 1,
    points_reward: 5,
    is_active: true,
    is_pinned: false,
    pin_position: null,
    pin_start: null,
    pin_end: null,
    publish_date: null,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "devotional-1",
    type: "devotional",
    title: "Finding Peace in Uncertainty",
    subtitle: "A moment of reflection",
    content: {
      body: "In times of uncertainty, it's easy to feel overwhelmed. But remember, every storm eventually passes. Take a deep breath, center yourself in faith, and trust that you are being guided toward better days. Your current situation is not your final destination.",
      author: "Soul Sync Team",
      read_time: 2,
    },
    thumbnail_url: null,
    background_url: null,
    min_membership_level: 1,
    points_reward: 10,
    is_active: true,
    is_pinned: false,
    pin_position: null,
    pin_start: null,
    pin_end: null,
    publish_date: null,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prayer-1",
    type: "prayer",
    title: "Morning Prayer",
    subtitle: null,
    content: {
      prayer_text:
        "Dear Lord, thank you for this new day. Guide my thoughts, words, and actions. Help me to be a light to others and to walk in your ways. Give me strength to face whatever comes my way, and remind me that I am never alone.",
    },
    thumbnail_url: null,
    background_url: null,
    min_membership_level: 1,
    points_reward: 5,
    is_active: true,
    is_pinned: false,
    pin_position: null,
    pin_start: null,
    pin_end: null,
    publish_date: null,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const sampleFeedCards: Card[] = [
  ...sampleMoodCards,
  {
    id: "motivational-1",
    type: "motivational",
    title: "Daily Inspiration",
    subtitle: null,
    content: {
      quote:
        "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
      quote_author: "Steve Jobs",
    },
    thumbnail_url: null,
    background_url: null,
    min_membership_level: 1,
    points_reward: 5,
    is_active: true,
    is_pinned: false,
    pin_position: null,
    pin_start: null,
    pin_end: null,
    publish_date: null,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "quiz-1",
    type: "quiz",
    title: "Test Your Faith Knowledge",
    subtitle: "A fun quiz to test what you know",
    content: {},
    thumbnail_url: null,
    background_url: null,
    min_membership_level: 1,
    points_reward: 20,
    is_active: true,
    is_pinned: false,
    pin_position: null,
    pin_start: null,
    pin_end: null,
    publish_date: null,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "task-1",
    type: "task",
    title: "Practice Gratitude",
    subtitle: "Write down 3 things you're grateful for today",
    content: {},
    thumbnail_url: null,
    background_url: null,
    min_membership_level: 1,
    points_reward: 15,
    is_active: true,
    is_pinned: false,
    pin_position: null,
    pin_start: null,
    pin_end: null,
    publish_date: null,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "game-1",
    type: "game",
    title: "Calm Orbs",
    subtitle: "A relaxing mini game",
    content: {},
    thumbnail_url: null,
    background_url: null,
    min_membership_level: 1,
    points_reward: 25,
    is_active: true,
    is_pinned: false,
    pin_position: null,
    pin_start: null,
    pin_end: null,
    publish_date: null,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "article-1",
    type: "article",
    title: "5 Ways to Start Your Day Right",
    subtitle: "Morning routines for a positive mindset",
    content: {
      body: "Starting your day with intention can transform your entire outlook. Here are five simple practices that can help you begin each morning with purpose and positivity...",
      author: "Soul Sync Team",
      read_time: 4,
    },
    thumbnail_url: null,
    background_url: null,
    min_membership_level: 1,
    points_reward: 10,
    is_active: true,
    is_pinned: false,
    pin_position: null,
    pin_start: null,
    pin_end: null,
    publish_date: null,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function HomePage() {
  const { isSynced, currentMood } = useMoodStore();
  const { profile } = useUserStore();
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showFeed, setShowFeed] = useState(false);
  const [mascotState, setMascotState] = useState<"idle" | "power-up" | "happy">(
    "idle"
  );

  const greeting = getGreeting();
  const userName = profile?.display_name || profile?.username;

  // Power up mascot animation on mount
  useEffect(() => {
    setMascotState("power-up");
    const timer = setTimeout(() => setMascotState("idle"), 2000);
    return () => clearTimeout(timer);
  }, []);

  // When mood is synced, show happy state
  useEffect(() => {
    if (isSynced && currentMood) {
      setMascotState("happy");
      const timer = setTimeout(() => setMascotState("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSynced, currentMood]);

  const handleMoodSelected = () => {
    setMascotState("happy");
  };

  const handleSwipeToFeed = () => {
    setShowFeed(true);
  };

  return (
    <div className="flex-1 flex flex-col overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!isSynced ? (
          // Unsynced state - show mascot welcome
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-4 text-center"
          >
            <Mascot
              state={mascotState}
              size="lg"
              showSpeechBubble={true}
              speechText={
                userName
                  ? `${greeting}, ${userName}! How are you feeling today?`
                  : `${greeting}! Welcome to Soul Sync. How are you feeling today?`
              }
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 sm:mt-8 px-4"
            >
              <h1 className="text-xl sm:text-2xl font-bold mb-2">Sync Your Soul</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                Tell us how you're feeling to get personalized content
              </p>

              <motion.button
                onClick={() => setShowMoodSelector(true)}
                className="px-5 sm:px-8 py-2.5 sm:py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm sm:text-lg shadow-lg shadow-primary/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(124, 58, 237, 0.3)",
                    "0 0 40px rgba(124, 58, 237, 0.5)",
                    "0 0 20px rgba(124, 58, 237, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Select Your Mood
              </motion.button>
            </motion.div>
          </motion.div>
        ) : showFeed ? (
          // Full feed view
          <motion.div
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            {/* Mood badge - fixed so it doesn't scroll with cards */}
            <div className="fixed top-28 left-0 right-0 z-30 px-2 sm:px-4 flex items-center justify-between bg-gradient-to-b from-background to-transparent pb-2 sm:pb-4">
              <MoodBadge onClick={() => setShowMoodSelector(true)} />
              <button
                onClick={() => setShowFeed(false)}
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back
              </button>
            </div>

            {/* Add top padding to account for fixed mood badge */}
            <div className="pt-16">
              <CardFeed initialCards={sampleFeedCards} />
            </div>
          </motion.div>
        ) : (
          // Synced state - show mood carousel
          <motion.div
            key="mood-cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col overflow-x-hidden"
          >
            {/* Header with mood badge */}
            <div className="px-2 sm:px-4 mb-2 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <MoodBadge onClick={() => setShowMoodSelector(true)} />
              <p className="text-xs sm:text-sm text-muted-foreground">
                Content curated for your mood
              </p>
            </div>

            {/* Mood-specific cards carousel */}
            <div className="flex-1 flex flex-col justify-center overflow-x-hidden">
              <MoodCarousel cards={sampleMoodCards} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood Selector Modal */}
      <MoodSelector
        isOpen={showMoodSelector}
        onClose={() => setShowMoodSelector(false)}
        onMoodSelected={handleMoodSelected}
      />
    </div>
  );
}
