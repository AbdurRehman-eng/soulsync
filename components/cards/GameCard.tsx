"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Play, X, Info, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ARGameViewer } from "@/components/ARGameViewer";
import type { Card, Game } from "@/types";
import { toast } from "react-hot-toast";

interface GameCardProps {
  card: Card;
  isLocked: boolean;
}

export function GameCard({ card, isLocked }: GameCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const supabase = createClient();

  // Fetch game data on mount
  useEffect(() => {
    fetchGameData();
  }, [card.id]);

  const fetchGameData = async () => {
    try {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("card_id", card.id)
        .single();

      if (error) throw error;
      setGameData(data);
    } catch (error) {
      console.error("Failed to fetch game data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = async (finalScore: number) => {
    setScore(finalScore);
    setIsPlaying(false);

    // Award points to user
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Record interaction
        await supabase.from("card_interactions").insert({
          user_id: user.id,
          card_id: card.id,
          interaction_type: "complete",
        });

        // Award points
        const { data: profile } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", user.id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({ points: profile.points + card.points_reward })
            .eq("id", user.id);

          toast.success(`You earned ${card.points_reward} points!`, {
            icon: "🎉",
          });
        }
      }
    } catch (error) {
      console.error("Failed to award points:", error);
    }
  };

  // Handle messages from the game iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "GAME_SCORE") {
        setScore(event.data.score);
      }
      if (event.data.type === "GAME_COMPLETE") {
        handleGameComplete(event.data.score);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Show AR Game Viewer if this is an AR game
  if (gameData?.is_ar_game && gameData.ar_type && gameData.ar_config) {
    return (
      <>
        <div className="min-h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-blue-500">AR Game</span>
            </div>
            {score > 0 && (
              <div className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                {score}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center min-h-0">
            {/* Game icon */}
            <motion.div
              className="w-14 sm:w-18 h-14 sm:h-18 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-7 sm:w-9 h-7 sm:h-9 text-white" />
            </motion.div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold mb-1">{card.title}</h3>
            {card.subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">{card.subtitle}</p>
            )}

            {/* Description */}
            <div className="glass-card p-3 mb-3 text-xs text-muted-foreground text-left max-w-xs">
              <div className="flex items-start gap-2 mb-2">
                <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span>{gameData.instructions || "Tap objects to score points!"}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted-foreground">Target: </span>
                  <span className="font-semibold text-foreground">{gameData.ar_config.targetScore} pts</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Time: </span>
                  <span className="font-semibold text-foreground">{gameData.ar_config.gameTime}s</span>
                </div>
              </div>
            </div>

            {/* Play Now button */}
            <motion.button
              onClick={() => setIsPlaying(true)}
              disabled={isLocked}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-4 h-4" />
              Play Now
            </motion.button>

            {/* Difficulty badge */}
            <div className="mt-2 px-2 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
              {gameData.difficulty?.charAt(0).toUpperCase() + gameData.difficulty?.slice(1)} Difficulty
            </div>
          </div>
        </div>

        {/* AR Game Viewer */}
        <ARGameViewer
          isOpen={isPlaying}
          onClose={() => setIsPlaying(false)}
          title={card.title}
          instructions={gameData.instructions || "Tap objects to score points!"}
          arType={gameData.ar_type}
          arConfig={gameData.ar_config}
          maxScore={gameData.max_score || 200}
          onGameComplete={handleGameComplete}
        />
      </>
    );
  }

  // Regular HTML game
  return (
    <div className="min-h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/20">
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-orange-500">
            {loading ? "Loading..." : "Mini Game"}
          </span>
        </div>
        {score > 0 && (
          <div className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
            {score}
          </div>
        )}
      </div>

      {!isPlaying ? (
        <div className="flex-1 flex flex-col justify-center items-center text-center min-h-0">
          {/* Game icon */}
          <motion.div
            className="w-14 sm:w-18 h-14 sm:h-18 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-3"
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

          {/* Description */}
          <div className="glass-card p-3 mb-3 text-xs text-muted-foreground text-left max-w-xs">
            <div className="flex items-start gap-2">
              <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span>{gameData?.instructions || "Play to earn points!"}</span>
            </div>
          </div>

          {/* Play Now button */}
          <motion.button
            onClick={() => setIsPlaying(true)}
            disabled={isLocked || loading}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-4 h-4" />
            {loading ? "Loading..." : "Play Now"}
          </motion.button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Close button */}
          <button
            onClick={() => setIsPlaying(false)}
            className="self-end p-2 rounded-full hover:bg-muted/50 transition-colors mb-2"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Game iframe - sandboxed for security */}
          <div className="flex-1 rounded-xl overflow-hidden bg-black">
            <iframe
              ref={iframeRef}
              srcDoc={gameData?.html_content || getGameHTML()}
              sandbox="allow-scripts"
              className="w-full h-full border-0"
              title={card.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Sample game HTML - in production, this would come from the database
function getGameHTML() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #1a0a2e;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-family: system-ui, sans-serif;
          color: white;
        }
        .game {
          text-align: center;
        }
        .score {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .target {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #7c3aed, #fbbf24);
          border-radius: 50%;
          cursor: pointer;
          position: absolute;
          transition: transform 0.1s;
        }
        .target:hover {
          transform: scale(1.1);
        }
        .message {
          font-size: 18px;
          color: #a78bfa;
        }
      </style>
    </head>
    <body>
      <div class="game">
        <div class="score">Score: <span id="score">0</span></div>
        <div class="message">Tap the glowing orbs!</div>
        <div id="target" class="target" style="display:none;"></div>
      </div>
      <script>
        let score = 0;
        const target = document.getElementById('target');
        const scoreEl = document.getElementById('score');

        function moveTarget() {
          const x = Math.random() * (window.innerWidth - 80) + 10;
          const y = Math.random() * (window.innerHeight - 80) + 10;
          target.style.left = x + 'px';
          target.style.top = y + 'px';
          target.style.display = 'block';
        }

        target.addEventListener('click', () => {
          score++;
          scoreEl.textContent = score;
          parent.postMessage({ type: 'GAME_SCORE', score }, '*');
          moveTarget();

          if (score >= 10) {
            parent.postMessage({ type: 'GAME_COMPLETE', score }, '*');
          }
        });

        moveTarget();
        setInterval(moveTarget, 2000);
      </script>
    </body>
    </html>
  `;
}
