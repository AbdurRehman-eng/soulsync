"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Target, Clock, Coins } from "lucide-react";
import type { Card } from "@/types";

interface TaskCardProps {
  card: Card;
  isLocked: boolean;
}

export function TaskCard({ card, isLocked }: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      // In real app, would call API to mark task complete and award points
    }
  };

  return (
    <div className="min-h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/20">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-cyan-500">Daily Task</span>
        </div>
        {card.points_reward > 0 && (
          <div className="flex items-center gap-1 text-xs text-accent">
            <Coins className="w-3 h-3" />
            <span>+{card.points_reward}</span>
          </div>
        )}
      </div>

      {/* Task content */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold mb-1">{card.title}</h3>

        {/* Description */}
        {card.subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">{card.subtitle}</p>
        )}

        {/* Task checkbox */}
        <motion.button
          onClick={handleComplete}
          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
            isCompleted
              ? "bg-green-500/20 border-2 border-green-500"
              : "glass-card hover:border-primary"
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={isCompleted ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground" />
            )}
          </motion.div>
          <div className="text-left">
            <p
              className={`text-sm font-medium ${
                isCompleted ? "text-green-500 line-through" : ""
              }`}
            >
              {isCompleted ? "Done!" : "Complete"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isCompleted
                ? `+${card.points_reward}`
                : "Tap when done"}
            </p>
          </div>
        </motion.button>

        {/* Completion animation */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-center"
          >
            <span className="text-3xl">🎉</span>
            <p className="text-green-500 text-xs font-medium mt-1">Great!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
