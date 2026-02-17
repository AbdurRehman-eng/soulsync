"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { ReadMoreModal } from "./ReadMoreModal";
import type { Card } from "@/types";

interface VerseCardProps {
  card: Card;
  isLocked: boolean;
}

export function VerseCard({ card }: VerseCardProps) {
  const { verse_text, verse_reference } = card.content;
  const [showModal, setShowModal] = useState(false);

  if (!verse_text) return null;

  const maxVerseLength = 200;
  const verseDisplay = verse_text.length > maxVerseLength
    ? verse_text.substring(0, maxVerseLength) + "..."
    : verse_text;

  return (
    <>
      <div className="min-h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/20">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-primary">Daily Verse</span>
        </div>

        {/* Verse content */}
        <div className="flex-1 flex flex-col justify-center min-h-0">
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl font-serif leading-tight sm:leading-relaxed mb-2 sm:mb-4 line-clamp-4"
          >
            "{verseDisplay}"
          </motion.blockquote>

          {/* Reference - always visible */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base text-accent font-medium mt-auto"
          >
            — {verse_reference}
          </motion.p>

          {/* Read more button */}
          {verse_text.length > maxVerseLength && (
            <motion.button
              onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs sm:text-sm text-primary mt-2 hover:underline text-left"
            >
              Read full verse →
            </motion.button>
          )}
        </div>
      </div>

      <ReadMoreModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={card.title || verse_reference || "Verse"}
        body={verse_text}
        author={verse_reference}
        badge={{ label: "Daily Verse", icon: <BookOpen className="w-4 h-4 text-primary" />, color: "text-primary" }}
      />
    </>
  );
}
