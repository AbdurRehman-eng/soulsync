"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Gamepad2, Play, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Card, Game } from "@/types";

interface GameCardProps {
  card: Card;
  isLocked: boolean;
}

export function GameCard({ card, isLocked }: GameCardProps) {
  const router = useRouter();
  const [gameData, setGameData] = useState<Game | null>(null);
  const supabase = createClient();

  // Fetch game data on mount
  useEffect(() => {
    let mounted = true;

    const fetchGameData = async () => {
      try {
        const { data, error } = await supabase
          .from("games")
          .select("*")
          .eq("card_id", card.id)
          .single();

        if (error) {
          console.error("Failed to fetch game data:", error);
          return;
        }

        if (mounted) {
          setGameData(data);
        }
      } catch (error) {
        console.error("Failed to fetch game data:", error);
      }
    };

    fetchGameData();

    return () => {
      mounted = false;
    };
  }, [card.id]);

  const handlePlayClick = () => {
    if (!isLocked) {
      router.push(`/game/${card.id}`);
    }
  };

  // Determine if this is an AR game
  const isARGame = gameData?.is_ar_game && gameData.ar_type && gameData.ar_config;

  return (
    <div className="min-h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 sm:p-2 rounded-lg ${isARGame ? 'bg-blue-500/20' : 'bg-orange-500/20'}`}>
            {isARGame ? (
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            ) : (
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            )}
          </div>
          <span className={`text-xs sm:text-sm font-medium ${isARGame ? 'text-blue-500' : 'text-orange-500'}`}>
            {isARGame ? 'AR Game' : 'Mini Game'}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center min-h-0">
        {/* Game icon */}
        <motion.div
          className={`w-14 sm:w-18 h-14 sm:h-18 rounded-2xl flex items-center justify-center mb-3 ${
            isARGame
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
              : 'bg-gradient-to-br from-orange-500 to-red-500'
          }`}
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isARGame ? (
            <Sparkles className="w-7 sm:w-9 h-7 sm:h-9 text-white" />
          ) : (
            <Gamepad2 className="w-7 sm:w-9 h-7 sm:h-9 text-white" />
          )}
        </motion.div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold mb-1">{card.title}</h3>
        {card.subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">{card.subtitle}</p>
        )}

        {/* Play Now button */}
        <motion.button
          onClick={handlePlayClick}
          disabled={isLocked}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
            isARGame
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
              : 'bg-gradient-to-r from-orange-500 to-red-500'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-4 h-4" />
          Play Now
        </motion.button>

        {/* Difficulty badge */}
        {gameData?.difficulty && (
          <div className="mt-2 px-2 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
            {gameData.difficulty.charAt(0).toUpperCase() + gameData.difficulty.slice(1)} Difficulty
          </div>
        )}
      </div>
    </div>
  );
}
