"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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
    setSelectedMood(mood);
    setMascotState("happy");
  };

  const handleConfirm = async () => {
    if (!selectedMood) return;

    setCurrentMood(selectedMood);
    onMoodSelected?.(selectedMood);

    // Log mood to database if user is authenticated
    if (profile) {
      try {
        await fetch("/api/mood", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood_id: selectedMood.id }),
        });
      } catch (error) {
        console.error("Failed to log mood:", error);
      }
    }

    onClose();
  };

  const greeting = getGreeting();
  const userName = profile?.display_name || profile?.username;

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
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mascot */}
            <div className="flex justify-start mb-4">
              <Mascot
                state={mascotState}
                size="md"
                showSpeechBubble={true}
                speechText={
                  selectedMood
                    ? `${selectedMood.name}? I understand. Let me find something perfect for you!`
                    : userName
                    ? `${greeting}, ${userName}! How are you feeling today?`
                    : `${greeting}! How are you feeling today?`
                }
              />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-center mb-6">
              Sync Your Soul
            </h2>

            {/* Mood Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {moods.filter(m => m.is_active).map((mood, index) => (
                <motion.button
                  key={mood.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleMoodSelect(mood as Mood)}
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

            {/* Confirm Button */}
            <motion.button
              onClick={handleConfirm}
              disabled={!selectedMood}
              className={cn(
                "w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300",
                selectedMood
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              whileTap={selectedMood ? { scale: 0.98 } : {}}
            >
              {selectedMood ? "Sync My Soul" : "Select a mood"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
