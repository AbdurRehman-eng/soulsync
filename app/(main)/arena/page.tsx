"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Gamepad2, Play, Trophy, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { GameModal } from "@/components/cards/GameModal";
import type { Card, Game } from "@/types";

interface GameWithMeta extends Card {
  game: Game | null;
}

export default function ArenaPage() {
  const [games, setGames] = useState<GameWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<GameWithMeta | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/games?type=html");
      if (response.ok) {
        const data = await response.json();
        setGames(data.games || []);
      }
    } catch (error) {
      console.error("[Arena] Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (game: GameWithMeta) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 pt-2 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/discover"
          className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/20">
            <Gamepad2 className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Arena</h1>
            <p className="text-xs text-muted-foreground">Play mini games & earn points</p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty state */}
      {!loading && games.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <Gamepad2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-semibold mb-1">No games yet</p>
          <p className="text-sm text-muted-foreground">
            New games are coming soon. Stay tuned!
          </p>
        </div>
      )}

      {/* Games Grid */}
      {!loading && games.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {games.map((game, index) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handlePlay(game)}
              className="relative overflow-hidden rounded-2xl text-left active:scale-[0.97] transition-transform"
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(239,68,68,0.15))",
                border: "1px solid rgba(249,115,22,0.2)",
              }}
            >
              <div className="p-3 flex flex-col gap-2">
                {/* Game icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold line-clamp-2">{game.title}</h3>
                {game.subtitle && (
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{game.subtitle}</p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-1">
                  {game.game?.difficulty && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 capitalize">
                      {game.game.difficulty}
                    </span>
                  )}
                  {game.points_reward > 0 && (
                    <span className="text-[10px] flex items-center gap-0.5 text-yellow-500">
                      <Trophy className="w-3 h-3" />
                      {game.points_reward}
                    </span>
                  )}
                </div>

                {/* Play button overlay */}
                <div className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold">
                  <Play className="w-3 h-3" />
                  Play
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Game Modal */}
      {selectedGame && (
        <GameModal
          card={selectedGame}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedGame(null);
          }}
          initialGameData={selectedGame.game}
        />
      )}
    </div>
  );
}
