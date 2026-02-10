"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { SandboxedIframe } from "@/components/sandbox/SandboxedIframe";
import dynamic from "next/dynamic";
import type { Card, Game } from "@/types";
import { toast } from "react-hot-toast";

const ARGameViewer = dynamic(
  () =>
    import("@/components/ARGameViewer").then((mod) => ({
      default: mod.ARGameViewer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-white/70">Loading game engine...</p>
        </div>
      </div>
    ),
  }
);

interface GameModalProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
}

export function GameModal({ card, isOpen, onClose }: GameModalProps) {
  const [gameData, setGameData] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  // Fetch game data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const fetchGameData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("games")
          .select("*")
          .eq("card_id", card.id)
          .single();

        if (!mounted) return;

        if (fetchError) {
          console.error("Game fetch error:", fetchError);
          setError("Game data not found");
          return;
        }

        setGameData(data);
      } catch (err) {
        if (mounted) {
          setError("Failed to load game");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchGameData();

    return () => {
      mounted = false;
    };
  }, [isOpen, card.id, supabase]);

  // Auto-start HTML games once data is loaded
  useEffect(() => {
    if (!gameData || !isOpen) return;
    const isAR = gameData.is_ar_game && gameData.ar_type && gameData.ar_config;
    if (!isAR) {
      setIsPlaying(true);
    }
  }, [gameData, isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setGameData(null);
      setLoading(true);
      setError(null);
      setIsPlaying(false);
      setScore(0);
      setCompleted(false);
    }
  }, [isOpen]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  const handleGameComplete = useCallback(
    async (finalScore: number) => {
      setScore(finalScore);
      setIsPlaying(false);
      setCompleted(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && card) {
          await supabase.from("card_interactions").insert({
            user_id: user.id,
            card_id: card.id,
            interaction_type: "complete",
          });

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
      } catch (err) {
        console.error("Failed to award points:", err);
      }
    },
    [card, supabase]
  );

  const handleIframeMessage = useCallback(
    (data: any) => {
      if (data.type === "GAME_SCORE") {
        setScore(data.score);
      }
      if (data.type === "GAME_COMPLETE") {
        handleGameComplete(data.score);
      }
    },
    [handleGameComplete]
  );

  const handleClose = () => {
    setIsPlaying(false);
    onClose();
  };

  if (!isOpen) return null;
  if (typeof window === "undefined") return null;

  const isARGame = gameData?.is_ar_game && gameData.ar_type && gameData.ar_config;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-background"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
            <h1 className="text-lg font-semibold truncate flex-1 mr-3">
              {card.title}
            </h1>
            <div className="flex items-center gap-3">
              {score > 0 && (
                <div className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                  {score} pts
                </div>
              )}
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                aria-label="Close game"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading game...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">{error}</p>
                <button
                  onClick={handleClose}
                  className="text-primary hover:underline"
                >
                  Go back
                </button>
              </div>
            </div>
          )}

          {/* Game content */}
          {!loading && !error && gameData && (
            <>
              {isARGame ? (
                <>
                  {!isPlaying && !completed && (
                    <div className="flex-1 flex items-center justify-center p-4">
                      <div className="text-center max-w-md">
                        <h2 className="text-2xl font-bold mb-2">
                          {card.title}
                        </h2>
                        {card.subtitle && (
                          <p className="text-muted-foreground mb-4">
                            {card.subtitle}
                          </p>
                        )}
                        <p className="mb-6">{gameData.instructions}</p>
                        <button
                          onClick={() => setIsPlaying(true)}
                          className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
                        >
                          Start Game
                        </button>
                      </div>
                    </div>
                  )}

                  {isPlaying && (
                    <ARGameViewer
                      isOpen={isPlaying}
                      onClose={handleClose}
                      title={card.title}
                      instructions={
                        gameData.instructions || "Tap objects to score points!"
                      }
                      arType={gameData.ar_type!}
                      arConfig={gameData.ar_config!}
                      maxScore={gameData.max_score || 200}
                      onGameComplete={handleGameComplete}
                    />
                  )}

                  {completed && (
                    <div className="flex-1 flex items-center justify-center p-4">
                      <div className="text-center">
                        <p className="text-4xl mb-3">🎉</p>
                        <h2 className="text-2xl font-bold mb-2">
                          Game Complete!
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6">
                          Final Score: {score}
                        </p>
                        <button
                          onClick={handleClose}
                          className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                        >
                          Back to Feed
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* HTML game - renders immediately in iframe */
                <div className="flex-1 bg-black min-h-0">
                  <SandboxedIframe
                    htmlContent={
                      gameData.html_content || getFallbackGameHTML()
                    }
                    title={card.title}
                    onMessage={handleIframeMessage}
                    className="w-full h-full"
                  />
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

function getFallbackGameHTML() {
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
        .game { text-align: center; }
        .score { font-size: 24px; margin-bottom: 20px; }
        .target {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #7c3aed, #fbbf24);
          border-radius: 50%;
          cursor: pointer;
          position: absolute;
          transition: transform 0.1s;
        }
        .target:hover { transform: scale(1.1); }
        .message { font-size: 18px; color: #a78bfa; }
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
