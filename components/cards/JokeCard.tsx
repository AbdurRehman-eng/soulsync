"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Card } from "@/types";

interface JokeCardProps {
  card: Card;
  isLocked: boolean;
}

export function JokeCard({ card, isLocked }: JokeCardProps) {
  const content = card.content || {};
  const [showPunchline, setShowPunchline] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center overflow-hidden">
      <div className="flex items-center gap-2 mb-4 self-start">
        <div className="p-1.5 rounded-lg bg-amber-500/20">
          <span className="text-lg">😊</span>
        </div>
        <span className="text-xs font-medium text-amber-400">Light Heart</span>
      </div>

      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center mb-4">
        <span className="text-3xl">{showPunchline ? "😂" : "🤔"}</span>
      </div>

      <p className="text-base font-semibold leading-relaxed mb-4">
        {content.joke_setup || card.title}
      </p>

      {!showPunchline ? (
        <button
          onClick={(e) => { e.stopPropagation(); setShowPunchline(true); }}
          className="mt-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-semibold"
        >
          Show Punchline 😄
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto"
        >
          <p className="text-lg font-bold text-amber-300 mb-2">
            {content.joke_punchline}
          </p>
          <span className="text-3xl">😂</span>
        </motion.div>
      )}
    </div>
  );
}
