"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Play, Trophy, Loader2, Camera } from "lucide-react";
import Link from "next/link";
import { GameModal } from "@/components/cards/GameModal";
import type { Card, Game } from "@/types";

interface GameWithMeta extends Card {
  game: Game | null;
}

export default function ARPage() {
  const [games, setGames] = useState<GameWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<GameWithMeta | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchARGames();
  }, []);

  const fetchARGames = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/games?type=ar");
      if (response.ok) {
        const data = await response.json();
        setGames(data.games || []);
      }
    } catch (error) {
      console.error("[AR] Failed to fetch AR games:", error);
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
          <div className="p-2 rounded-xl bg-blue-500/20">
            <Sparkles className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AR Experiences</h1>
            <p className="text-xs text-muted-foreground">Augmented reality games & content</p>
          </div>
        </div>
      </div>

      {/* Camera notice */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
        <Camera className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <p className="text-[11px] text-blue-300/80">
          AR experiences use your device camera. Make sure to allow camera access when prompted.
        </p>
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
          <Sparkles className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-semibold mb-1">No AR experiences yet</p>
          <p className="text-sm text-muted-foreground">
            Augmented reality content is coming soon. Stay tuned!
          </p>
        </div>
      )}

      {/* AR Games Grid */}
      {!loading && games.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {games.map((game, index) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handlePlay(game)}
              className="relative overflow-hidden rounded-2xl text-left active:scale-[0.98] transition-transform"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.15))",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <div className="p-4 flex items-center gap-4">
                {/* AR icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold line-clamp-1">{game.title}</h3>
                  {game.subtitle && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{game.subtitle}</p>
                  )}

                  <div className="flex items-center gap-2 mt-1.5">
                    {game.game?.difficulty && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 capitalize">
                        {game.game.difficulty}
                      </span>
                    )}
                    {game.game?.ar_type && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 capitalize">
                        {game.game.ar_type.replace("_", " ")}
                      </span>
                    )}
                    {game.points_reward > 0 && (
                      <span className="text-[10px] flex items-center gap-0.5 text-yellow-500">
                        <Trophy className="w-3 h-3" />
                        {game.points_reward}
                      </span>
                    )}
                  </div>
                </div>

                {/* Play button */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 text-white ml-0.5" />
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
          initialGameData={selectedGame.game}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedGame(null);
          }}
        />
      )}
    </div>
  );
}
