"use client";

import { motion } from "framer-motion";
import { useMoodStore } from "@/stores/moodStore";

interface MoodBadgeProps {
  onClick?: () => void;
}

export function MoodBadge({ onClick }: MoodBadgeProps) {
  const { currentMood, isSynced } = useMoodStore();

  if (!isSynced || !currentMood) return null;

  const isClickable = !!onClick;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={isClickable ? { scale: 1.05 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={!isClickable}
      className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full glass-card transition-all ${
        isClickable ? "cursor-pointer hover:shadow-lg" : ""
      }`}
      style={{
        borderColor: currentMood.color,
        boxShadow: `0 0 12px ${currentMood.color}30`,
      }}
      title={isClickable ? "Click to change mood" : undefined}
    >
      <span className="text-base sm:text-lg">{currentMood.emoji}</span>
      <span className="text-xs sm:text-sm font-medium">{currentMood.name}</span>
    </motion.button>
  );
}
