"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useMoodStore, defaultMoods } from "@/stores/moodStore";
import { useUserStore } from "@/stores/userStore";
import { Mascot } from "@/components/mascot/Mascot";
import { cn } from "@/lib/utils";
import { getGreeting } from "@/lib/utils";
import type { Mood } from "@/types";

interface MoodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onMoodSelected?: (mood: Mood) => void;
}

export function MoodSelector({
  isOpen,
  onClose,
  onMoodSelected,
}: MoodSelectorProps) {
  const { profile } = useUserStore();
  const { setCurrentMood, availableMoods, setAvailableMoods } = useMoodStore();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [mascotState, setMascotState] = useState<"idle" | "happy">("idle");
  const [syncing, setSyncing] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedMood(null);
      setMascotState("idle");
      setSyncing(false);
    }
  }, [isOpen]);

  // Fetch fresh moods when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchMoods = async () => {
        try {
          const response = await fetch("/api/mood");
          if (response.ok) {
            const data = await response.json();
            if (data.moods && data.moods.length > 0) {
              setAvailableMoods(data.moods);
            }
          }
        } catch (error) {
          console.error("Failed to fetch moods:", error);
        }
      };

      fetchMoods();
    }
  }, [isOpen, setAvailableMoods]);

  // Use available moods from store or fallback to defaults
  const moods = availableMoods.length > 0
    ? availableMoods
    : defaultMoods.map((m, i) => ({ ...m, id: `default-${i}`, created_at: new Date().toISOString() }));

  const handleMoodSelect = (mood: Mood) => {
    if (syncing) return; // Don't allow changing mood while syncing
    setSelectedMood(mood);
    setMascotState("happy");
  };

  const handleConfirm = async () => {
    if (!selectedMood || syncing) return;

    setSyncing(true);
    setMascotState("happy");

    try {
      // 1. Set mood in store immediately so isSynced becomes true
      setCurrentMood(selectedMood);

      // 2. Log mood to database + fetch feed in parallel
      const feedUrl = new URL("/api/feed", window.location.origin);
      feedUrl.searchParams.set("mood_id", selectedMood.id);

      const promises: Promise<any>[] = [fetch(feedUrl.toString())];

      if (profile) {
        promises.push(
          fetch("/api/mood", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mood_id: selectedMood.id }),
          })
        );
      }

      const [feedResponse] = await Promise.all(promises);

      // 3. Parse feed cards and broadcast them so HomePage picks them up
      if (feedResponse.ok) {
        const data = await feedResponse.json();
        window.dispatchEvent(
          new CustomEvent("soul-sync-feed-ready", {
            detail: { cards: data.cards || [] },
          })
        );
      }

      // 4. Notify parent and close
      onMoodSelected?.(selectedMood);
      onClose();
    } catch (error) {
      console.error("Failed to sync:", error);
      setSyncing(false);
    }
  };

  const greeting = getGreeting();
  const userName = profile?.display_name || profile?.username;

  // Build mascot speech text based on state
  let speechText: string;
  if (syncing) {
    speechText = "Syncing your soul... Finding the perfect content for you!";
  } else if (selectedMood) {
    speechText = `${selectedMood.name}? I understand. Let me find something perfect for you!`;
  } else if (userName) {
    speechText = `${greeting}, ${userName}! How are you feeling today?`;
  } else {
    speechText = `${greeting}! How are you feeling today?`;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-card w-full max-w-md p-6 relative max-h-[85vh] overflow-y-auto"
          >
            {/* Close button — hidden while syncing */}
            {!syncing && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Mascot */}
            <div className="flex justify-start mb-4">
              <Mascot
                state={syncing ? "happy" : mascotState}
                size="md"
                showSpeechBubble={true}
                speechText={speechText}
              />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-center mb-6">
              Sync Your Soul
            </h2>

            {/* Mood Grid — disabled while syncing */}
            <div className={cn("grid grid-cols-3 gap-3 mb-6", syncing && "opacity-50 pointer-events-none")}>
              {moods.filter(m => m.is_active).map((mood, index) => (
                <motion.button
                  key={mood.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleMoodSelect(mood as Mood)}
                  disabled={syncing}
                  className={cn(
                    "mood-btn",
                    selectedMood?.id === mood.id && "selected"
                  )}
                  style={{
                    borderColor:
                      selectedMood?.id === mood.id ? mood.color : undefined,
                    boxShadow:
                      selectedMood?.id === mood.id
                        ? `0 0 20px ${mood.color}40`
                        : undefined,
                  }}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-sm font-medium">{mood.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Confirm Button — shows spinner while syncing */}
            <motion.button
              onClick={handleConfirm}
              disabled={!selectedMood || syncing}
              className={cn(
                "w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3",
                syncing
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 opacity-90"
                  : selectedMood
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              whileTap={selectedMood && !syncing ? { scale: 0.98 } : {}}
            >
              {syncing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : selectedMood ? (
                "Sync My Soul"
              ) : (
                "Select a mood"
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
