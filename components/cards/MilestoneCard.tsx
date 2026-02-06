"use client";

import { motion } from "framer-motion";
import type { Card } from "@/types";

interface MilestoneCardProps {
  card: Card;
  isLocked: boolean;
}

export function MilestoneCard({ card, isLocked }: MilestoneCardProps) {
  const content = card.content || {};

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center overflow-hidden">
      <motion.div
        animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="text-5xl mb-4"
      >
        🏆
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-bold mb-1">
          {content.milestone_message || card.title}
        </h3>
        {card.subtitle && (
          <p className="text-sm text-muted-foreground mb-3">{card.subtitle}</p>
        )}
      </motion.div>

      {content.milestone_value && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/30 to-amber-500/30 flex items-center justify-center mb-3"
        >
          <span className="text-2xl font-bold text-yellow-400">
            {content.milestone_value}
          </span>
        </motion.div>
      )}

      <div className="flex items-center gap-1 mt-2">
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="text-yellow-400"
          >
            ⭐
          </motion.span>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Keep going! You're doing amazing!
      </p>
    </div>
  );
}
