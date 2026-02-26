"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Play, Loader2 } from "lucide-react";
import { GameModal } from "./GameModal";
import type { Card } from "@/types";

interface GameCardProps {
  card: Card;
  isLocked: boolean;
}

const LAUNCH_SAFETY_MS = 12_000; // Force button back to "Play Now" after this if modal never resolves

export function GameCard({ card, isLocked }: GameCardProps) {
  const [showGame, setShowGame] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLaunching = () => {
    setIsLaunching(false);
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  };

  // Safety: if modal stays open but never calls onLoaded/onError, reset button after LAUNCH_SAFETY_MS
  useEffect(() => {
    if (!showGame || !isLaunching) return;
    safetyTimerRef.current = setTimeout(() => {
      safetyTimerRef.current = null;
      setIsLaunching(false);
    }, LAUNCH_SAFETY_MS);
    return () => {
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }
    };
  }, [showGame, isLaunching]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked || isLaunching) return;

    console.log("[GameCard] Play clicked", {
      cardId: card.id,
      hasGameData: !!card.game_data,
      title: card.title,
    });

    setIsLaunching(true);
    setShowGame(true);
  };

  return (
    <>
      <div className="min-h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/20">
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-orange-500">
              Mini Game
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center min-h-0">
          {/* Game icon */}
          <motion.div
            className="w-14 sm:w-18 h-14 sm:h-18 rounded-2xl flex items-center justify-center mb-3 bg-gradient-to-br from-orange-500 to-red-500"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Gamepad2 className="w-7 sm:w-9 h-7 sm:h-9 text-white" />
          </motion.div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold mb-1">{card.title}</h3>
          {card.subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">{card.subtitle}</p>
          )}

          {/* Action button */}
          <motion.button
            onClick={handlePlayClick}
            disabled={isLocked || isLaunching}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg bg-gradient-to-r from-orange-500 to-red-500"
            whileTap={{ scale: 0.95 }}
          >
            {isLaunching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play Now
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Game modal - uses pre-fetched game data from feed API */}
      <GameModal
        card={card}
        isOpen={showGame}
        onClose={() => {
          console.log("[GameCard] Modal closed", { cardId: card.id });
          setShowGame(false);
          clearLaunching();
        }}
        initialGameData={card.game_data || null}
        onLoaded={() => {
          console.log("[GameCard] Game loaded", { cardId: card.id });
          clearLaunching();
        }}
        onError={(message) => {
          console.error("[GameCard] Game failed to load", {
            cardId: card.id,
            message,
          });
          clearLaunching();
        }}
      />
    </>
  );
}
