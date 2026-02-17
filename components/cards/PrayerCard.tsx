"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HandHeart } from "lucide-react";
import { ReadMoreModal } from "./ReadMoreModal";
import type { Card } from "@/types";

interface PrayerCardProps {
  card: Card;
  isLocked: boolean;
}

export function PrayerCard({ card }: PrayerCardProps) {
  const { prayer_text } = card.content;
  const [showModal, setShowModal] = useState(false);

  if (!prayer_text) return null;

  const maxLength = 200;
  const prayerDisplay = prayer_text.length > maxLength
    ? prayer_text.substring(0, maxLength) + "..."
    : prayer_text;

  return (
    <>
      <div className="min-h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/20">
            <HandHeart className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-green-500">Prayer</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold mb-2 line-clamp-2">{card.title}</h3>

        {/* Prayer content */}
        <div className="flex-1 flex flex-col justify-center min-h-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Decorative line */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-transparent rounded-full" />

            <p className="pl-2 sm:pl-4 text-xs sm:text-sm leading-snug sm:leading-relaxed italic text-muted-foreground line-clamp-4">
              {prayerDisplay}
            </p>
          </motion.div>

          {/* Read more button */}
          {prayer_text.length > maxLength && (
            <motion.button
              onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs sm:text-sm text-primary mt-2 hover:underline text-left"
            >
              Read full →
            </motion.button>
          )}
        </div>

        {/* Amen prompt - always visible */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-auto pt-2 text-center"
        >
          <span className="text-lg sm:text-2xl font-serif text-accent">Amen</span>
        </motion.div>
      </div>

      <ReadMoreModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={card.title}
        body={prayer_text}
        badge={{ label: "Prayer", icon: <HandHeart className="w-4 h-4 text-green-500" />, color: "text-green-500" }}
      />
    </>
  );
}
