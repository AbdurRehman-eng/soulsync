"use client";

import { motion } from "framer-motion";
import type { Card } from "@/types";

interface UpgradeCardProps {
  card: Card;
  isLocked: boolean;
}

export function UpgradeCard({ card, isLocked }: UpgradeCardProps) {
  const content = card.content || {};
  const features = content.upgrade_features || [
    "Unlock all content",
    "Ad-free experience",
    "Exclusive devotionals",
    "Priority support",
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center overflow-hidden">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <span className="text-3xl">✨</span>
        </div>
      </motion.div>

      <h3 className="text-lg font-bold mb-1">
        {content.upgrade_message || card.title || "Support the Movement"}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {card.subtitle || "Unlock the full Soul Sync experience"}
      </p>

      <div className="w-full max-w-xs space-y-2 mb-4 text-left">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex items-center gap-2 text-sm"
          >
            <span className="text-accent">✓</span>
            <span className="text-muted-foreground">{feature}</span>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold shadow-lg shadow-primary/25"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(124, 58, 237, 0.3)",
            "0 0 40px rgba(124, 58, 237, 0.5)",
            "0 0 20px rgba(124, 58, 237, 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={(e) => e.stopPropagation()}
      >
        Upgrade Now
      </motion.button>
    </div>
  );
}
