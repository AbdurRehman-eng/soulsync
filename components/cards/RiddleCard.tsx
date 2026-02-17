"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Card } from "@/types";

interface RiddleCardProps {
  card: Card;
  isLocked: boolean;
}

export function RiddleCard({ card, isLocked }: RiddleCardProps) {
  const content = card.content || {};
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-center overflow-visible">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-purple-500/20">
          <span className="text-lg">🧩</span>
        </div>
        <span className="text-xs font-medium text-purple-400">Enigma</span>
      </div>

      <h3 className="text-sm sm:text-base font-bold mb-2">{card.title}</h3>

      <div className="glass-card p-3 rounded-xl mb-2">
        <p className="text-xs sm:text-sm leading-relaxed font-medium">
          {content.riddle_question || content.body}
        </p>
      </div>

      {content.riddle_hint && !showHint && !showAnswer && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowHint(true); }}
          className="text-xs text-purple-400 hover:text-purple-300 mb-2 self-start"
        >
          💡 Need a hint?
        </button>
      )}

      <AnimatePresence>
        {showHint && !showAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2"
          >
            <p className="text-xs text-muted-foreground italic px-3 py-2 rounded-lg bg-purple-500/10">
              Hint: {content.riddle_hint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!showAnswer ? (
        <button
          onClick={(e) => { e.stopPropagation(); setShowAnswer(true); }}
          className="mt-auto px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold self-center"
        >
          Reveal Answer
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-auto p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-center"
        >
          <p className="text-sm font-bold text-purple-300">
            {content.riddle_answer}
          </p>
        </motion.div>
      )}
    </div>
  );
}
