"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { Game } from "@/types";
import { ArrowLeft, Gamepad2, Zap, Clock } from "lucide-react";

// Dynamically import ARGameViewer for better performance
const ARGameViewer = dynamic(
  () => import("@/components/ar/ARGameViewer").then((mod) => ({ default: mod.ARGameViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-500 to-blue-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Loading AR Game...</p>
        </div>
      </div>
    ),
  }
);

export default function ARGamesPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchARGames();
  }, []);

  const fetchARGames = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/games?ar_only=true");
      if (response.ok) {
        const data = await response.json();
        setGames(data.games || []);
      } else {
        setError("Failed to load AR games");
      }
    } catch (err) {
      console.error("Failed to fetch AR games:", err);
      setError("Failed to load AR games. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGameEnd = (score: number) => {
    console.log("Game ended with score:", score);
    // Here you could save the score to the database
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "⭐";
      case "medium":
        return "⭐⭐";
      case "hard":
        return "⭐⭐⭐";
      default:
        return "⭐";
    }
  };

  if (selectedGame && selectedGame.ar_config) {
    return (
      <div className="fixed inset-0">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-500 to-blue-500">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
            </div>
          }
        >
          <ARGameViewer
            gameType={selectedGame.ar_type!}
            config={selectedGame.ar_config}
            title={selectedGame.html_content || "AR Game"}
            instructions={selectedGame.instructions || "Tap objects to score points!"}
            onClose={() => setSelectedGame(null)}
            onGameEnd={handleGameEnd}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Gamepad2 className="text-white" size={24} />
            <div>
              <h1 className="text-xl font-bold text-white">AR Games</h1>
              <p className="text-xs text-white/80">Play interactive AR games</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-sm">Loading AR games...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">Oops!</h2>
            <p className="text-white/80 mb-4">{error}</p>
            <button
              onClick={fetchARGames}
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : games.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-white mb-2">No AR Games Yet</h2>
            <p className="text-white/80 mb-4">
              AR games are being prepared. Check back soon for exciting experiences!
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Game</h2>
              <p className="text-white/80 text-sm">Tap any game to start playing</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl p-5 text-left transition-all active:scale-[0.98] border border-white/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {game.html_content || "AR Game"}
                      </h3>
                      {game.instructions && (
                        <p className="text-sm text-white/70 line-clamp-2">
                          {game.instructions}
                        </p>
                      )}
                    </div>
                    <span className="text-3xl flex-shrink-0">🎯</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getDifficultyColor(
                        game.difficulty
                      )}`}
                    >
                      {getDifficultyIcon(game.difficulty)} {game.difficulty}
                    </span>

                    {game.ar_config && (
                      <>
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-700 flex items-center gap-1">
                          <Clock size={12} />
                          {game.ar_config.gameTime}s
                        </span>

                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-purple-100 text-purple-700 flex items-center gap-1">
                          <Zap size={12} />
                          {game.ar_config.targetScore} points
                        </span>
                      </>
                    )}

                    {game.ar_type && (
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-cyan-100 text-cyan-700">
                        {game.ar_type.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
