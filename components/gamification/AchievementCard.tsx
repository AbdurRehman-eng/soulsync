"use client";

import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import type { AchievementProgress } from "@/types";

interface AchievementCardProps {
  achievement: AchievementProgress;
  index?: number;
}

const rarityColors = {
  common: "from-gray-500 to-gray-600",
  rare: "from-blue-500 to-blue-600",
  epic: "from-purple-500 to-purple-600",
  legendary: "from-yellow-500 to-orange-600",
};

const rarityBorders = {
  common: "border-gray-400",
  rare: "border-blue-400",
  epic: "border-purple-400",
  legendary: "border-yellow-400",
};

const rarityGlow = {
  common: "shadow-gray-500/20",
  rare: "shadow-blue-500/30",
  epic: "shadow-purple-500/40",
  legendary: "shadow-yellow-500/50",
};

export function AchievementCard({
  achievement,
  index = 0,
}: AchievementCardProps) {
  const isCompleted = achievement.completed;
  const progress = achievement.progress_percentage || 0;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border-2 ${
        isCompleted
          ? `${rarityBorders[achievement.rarity]} ${rarityGlow[achievement.rarity]} shadow-lg`
          : "border-white/10"
      } ${isCompleted ? "bg-white/5" : "bg-black/20"} backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Rarity gradient background */}
      {isCompleted && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${rarityColors[achievement.rarity]} opacity-10`}
        />
      )}

      <div className="relative p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                isCompleted
                  ? `bg-gradient-to-br ${rarityColors[achievement.rarity]}`
                  : "bg-white/5"
              }`}
            >
              {isCompleted ? (
                achievement.badge_icon || "🏆"
              ) : (
                <Lock className="w-6 h-6 text-white/30" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold ${
                  isCompleted ? "text-text-primary" : "text-white/40"
                } line-clamp-1`}
              >
                {achievement.name}
              </h3>
              <p
                className={`text-sm ${
                  isCompleted ? "text-text-secondary" : "text-white/30"
                } line-clamp-2`}
              >
                {achievement.description}
              </p>
            </div>
          </div>

          {/* Completion badge */}
          {isCompleted && (
            <motion.div
              className={`p-2 rounded-full bg-gradient-to-br ${rarityColors[achievement.rarity]}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </div>

        {/* Progress bar (if not completed) */}
        {!isCompleted && achievement.requirement_value && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">
                {achievement.progress} / {achievement.requirement_value}
              </span>
              <span className="text-white/50">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${rarityColors[achievement.rarity]}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Rewards */}
        <div className="flex items-center gap-3 text-sm">
          {achievement.xp_reward > 0 && (
            <div
              className={`flex items-center gap-1 ${
                isCompleted ? "text-purple-300" : "text-white/30"
              }`}
            >
              <span className="font-semibold">+{achievement.xp_reward}</span>
              <span>XP</span>
            </div>
          )}
          {achievement.points_reward > 0 && (
            <div
              className={`flex items-center gap-1 ${
                isCompleted ? "text-yellow-300" : "text-white/30"
              }`}
            >
              <span className="font-semibold">
                +{achievement.points_reward}
              </span>
              <span>Points</span>
            </div>
          )}
          <div
            className={`ml-auto px-2 py-1 rounded-full text-xs font-semibold capitalize ${
              isCompleted
                ? `bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white`
                : "bg-white/5 text-white/30"
            }`}
          >
            {achievement.rarity}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
