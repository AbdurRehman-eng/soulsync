"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ReadMoreModal } from "./ReadMoreModal";
import type { Card } from "@/types";

interface MotivationalCardProps {
  card: Card;
  isLocked: boolean;
}

export function MotivationalCard({ card }: MotivationalCardProps) {
  const { quote, quote_author } = card.content;
  const [showModal, setShowModal] = useState(false);

  if (!quote) return null;

  const maxQuoteLength = 200;
  const quoteDisplay = quote.length > maxQuoteLength
    ? quote.substring(0, maxQuoteLength) + "..."
    : quote;

  return (
    <>
      <div className="min-h-full flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Decorative sparkles */}
        <motion.div
          className="mb-3 sm:mb-4"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-8 sm:w-10 h-8 sm:h-10 text-accent" />
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-2xl font-bold leading-tight sm:leading-relaxed mb-3 sm:mb-4 line-clamp-3"
        >
          &ldquo;{quoteDisplay}&rdquo;
        </motion.blockquote>

        {/* Author - always visible */}
        {quote_author && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base text-accent font-medium mb-2"
          >
            — {quote_author}
          </motion.p>
        )}

        {/* Read more button */}
        {quote.length > maxQuoteLength && (
          <motion.button
            onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs sm:text-sm text-primary hover:underline"
          >
            Read full →
          </motion.button>
        )}

        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        </div>
      </div>

      <ReadMoreModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={card.title || "Motivational"}
        body={quote}
        author={quote_author}
        badge={{ label: "Motivation", icon: <Sparkles className="w-4 h-4 text-accent" />, color: "text-accent" }}
      />
    </>
  );
}
