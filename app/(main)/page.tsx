"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useMoodStore } from "@/stores/moodStore";
import { useUserStore } from "@/stores/userStore";
import { MoodBadge } from "@/components/mood/MoodBadge";
import { FeedSkeleton } from "@/components/feed/FeedSkeleton";
import { getGreeting } from "@/lib/utils";
import type { Card } from "@/types";

// Lazy-load heavy components not needed on first paint
const Mascot = dynamic(() => import("@/components/mascot/Mascot").then(m => ({ default: m.Mascot })), { ssr: false });
const MoodCarousel = dynamic(() => import("@/components/feed/MoodCarousel").then(m => ({ default: m.MoodCarousel })), { ssr: false });
const CardFeed = dynamic(() => import("@/components/feed/CardFeed").then(m => ({ default: m.CardFeed })), { ssr: false });

// Use the layout's single MoodSelector instance via custom event
function openMoodSelector() {
  window.dispatchEvent(new CustomEvent("soul-sync-nav", { detail: { type: "mood-selector" } }));
}

export default function HomePage() {
  const { isSynced, currentMood } = useMoodStore();
  const { profile } = useUserStore();
  const [showFeed, setShowFeed] = useState(false);
  const [mascotState, setMascotState] = useState<"idle" | "power-up" | "happy">(
    "idle"
  );
  const [moodCards, setMoodCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  // Track whether MoodSelector already pre-fetched cards so we don't double-fetch
  const feedPreloadedRef = useRef(false);

  const greeting = getGreeting();
  const userName = profile?.display_name || profile?.username;

  // Listen for pre-fetched feed cards from MoodSelector
  useEffect(() => {
    const handler = (e: Event) => {
      const cards = (e as CustomEvent).detail?.cards;
      if (Array.isArray(cards)) {
        feedPreloadedRef.current = true;
        setMoodCards(cards);
        setLoadingCards(false);
      }
    };
    window.addEventListener("soul-sync-feed-ready", handler);
    return () => window.removeEventListener("soul-sync-feed-ready", handler);
  }, []);

  // Fetch cards from API when mood is synced (only if not already pre-loaded)
  const fetchMoodCards = useCallback(async () => {
    if (!isSynced) return;

    // Skip if MoodSelector already delivered the cards
    if (feedPreloadedRef.current) {
      feedPreloadedRef.current = false;
      return;
    }
    
    setLoadingCards(true);
    try {
      const url = new URL('/api/feed', window.location.origin);
      if (currentMood?.id) {
        url.searchParams.set('mood_id', currentMood.id);
      }
      
      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setMoodCards(data.cards || []);
      }
    } catch (error) {
      console.error("[HomePage] Failed to fetch cards:", error);
    } finally {
      setLoadingCards(false);
    }
  }, [isSynced, currentMood?.id]);

  // Fetch cards when mood changes or becomes synced
  useEffect(() => {
    if (isSynced) {
      fetchMoodCards();
    }
  }, [isSynced, currentMood?.id, fetchMoodCards]);

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

  if (!isSynced) {
    // Unsynced state - show mascot welcome
    return (
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <div className="flex-1 flex flex-col items-center justify-center px-3 text-center overflow-hidden animate-fade-in">
          {/* Mascot and speech bubble row */}
          <div className="relative flex items-start justify-start w-full max-w-xs sm:max-w-sm mx-auto mb-3 sm:mb-4">
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
          </div>

          <div className="w-full max-w-xs sm:max-w-sm px-2 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">Sync Your Soul</h1>
            <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mb-3 sm:mb-4">
              Tell us how you&apos;re feeling to get personalized content
            </p>

            <button
              onClick={openMoodSelector}
              className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm sm:text-base md:text-lg shadow-lg shadow-primary/25 active:scale-95 transition-transform animate-pulse-glow"
            >
              Select Your Mood
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showFeed) {
    // Full feed view
    return (
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <div className="flex-1 flex flex-col animate-fade-in">
          {/* Mood badge - fixed so it doesn't scroll with cards */}
          <div className="fixed top-28 left-0 right-0 z-30 px-2 sm:px-4 flex items-center justify-between bg-gradient-to-b from-background to-transparent pb-2 sm:pb-4">
            <MoodBadge onClick={openMoodSelector} />
            <button
              onClick={() => setShowFeed(false)}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back
            </button>
          </div>

          {/* Add top padding to account for fixed mood badge */}
          <div className="pt-16">
            <CardFeed initialCards={moodCards} />
          </div>
        </div>
      </div>
    );
  }

  // Synced state - show mood carousel
  return (
    <div className="flex-1 flex flex-col overflow-x-hidden">
      <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
        {/* Header with mood badge */}
        <div className="px-2 sm:px-4 mb-2 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <MoodBadge onClick={openMoodSelector} />
          <p className="text-xs sm:text-sm text-muted-foreground">
            Content curated for your mood
          </p>
        </div>

        {/* Mood-specific cards carousel */}
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
          {loadingCards ? (
            <FeedSkeleton />
          ) : moodCards.length > 0 ? (
            <MoodCarousel cards={moodCards} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
              <p className="text-lg font-semibold mb-2">No cards available</p>
              <p className="text-muted-foreground text-sm">
                Check back later for new content
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
