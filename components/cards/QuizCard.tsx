"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HelpCircle, Trophy, ChevronRight } from "lucide-react";
import type { Card } from "@/types";

interface QuizCardProps {
  card: Card;
  isLocked: boolean;
}

/**
 * QuizCard — feed preview card.
 *
 * Shows the quiz title, subtitle, points, and a "Take Quiz" button.
 * Does NOT fetch quiz data from the DB (avoids the "Loading quiz..." issue).
 * When the user taps the button they navigate to /quiz/[id] where the
 * full quiz gameplay happens.
 */
export function QuizCard({ card, isLocked }: QuizCardProps) {
  const router = useRouter();

  const handleStartQuiz = () => {
    if (!isLocked) {
      router.push(`/quiz/${card.id}`);
    }
  };

  return (
    <div className="min-h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-purple-500">
            Quiz
          </span>
        </div>
      </div>

      {/* Quiz preview */}
      <div className="flex-1 flex flex-col justify-center items-center text-center min-h-0 px-2">
        {/* Trophy icon */}
        <motion.div
          className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Trophy className="w-7 sm:w-8 h-7 sm:h-8 text-white" />
        </motion.div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold mb-1">{card.title}</h3>
        {card.subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 max-w-xs">
            {card.subtitle}
          </p>
        )}

        {/* Points indicator */}
        {card.points_reward > 0 && (
          <div className="mb-3 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
            Earn +{card.points_reward} pts
          </div>
        )}

        {/* Take Quiz button */}
        <motion.button
          onClick={handleStartQuiz}
          disabled={isLocked}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          whileTap={{ scale: 0.95 }}
        >
          Take Quiz
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
