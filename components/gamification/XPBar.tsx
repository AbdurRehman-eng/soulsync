"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  requiredXP: number;
  currentLevel: number;
  levelName: string;
  showLabel?: boolean;
}

export function XPBar({
  currentXP,
  requiredXP,
  currentLevel,
  levelName,
  showLabel = true,
}: XPBarProps) {
  const percentage = Math.min(100, (currentXP / requiredXP) * 100);
  const xpToNextLevel = requiredXP - currentXP;

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="font-semibold text-text-primary">
              Level {currentLevel} - {levelName}
            </span>
          </div>
          <span className="text-text-secondary">
            {xpToNextLevel.toLocaleString()} XP to level {currentLevel + 1}
          </span>
        </div>
      )}

      <div className="relative h-8 bg-background/30 rounded-full overflow-hidden border border-white/10">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />

        {/* Progress bar */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* XP text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
          </span>
        </div>
      </div>

      {/* Progress percentage */}
      {showLabel && (
        <div className="text-right">
          <span className="text-xs text-text-secondary">
            {percentage.toFixed(1)}% Complete
          </span>
        </div>
      )}
    </div>
  );
}
