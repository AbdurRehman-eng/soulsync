"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Play, Loader2, X, ExternalLink, RotateCcw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SandboxedIframe } from "@/components/sandbox/SandboxedIframe";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import type { Card, Game } from "@/types";

const ARGameViewer = dynamic(
  () =>
    import("@/components/ARGameViewer").then((mod) => ({
      default: mod.ARGameViewer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    ),
  }
);

interface GameCardProps {
  card: Card;
  isLocked: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

export function GameCard({ card, isLocked, onPlayingChange }: GameCardProps) {
  const [showGame, setShowGame] = useState(false);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const initialGameDataRef = useRef<Game | null | undefined>(card.game_data);

  useEffect(() => {
    initialGameDataRef.current = card.game_data;
  }, [card.game_data]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;
        const { data } = await supabase
          .from("card_interactions")
          .select("id")
          .eq("user_id", user.id)
          .eq("card_id", card.id)
          .eq("interaction_type", "complete")
          .limit(1);
        if (!cancelled && data && data.length > 0) setHasPlayed(true);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [card.id, supabase]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked || loading) return;
    setShowGame(true);
    onPlayingChange?.(true);
    loadGame();
  };

  const loadGame = useCallback(() => {
    const prefetched = initialGameDataRef.current;

    if (prefetched) {
      setGameData(prefetched);
      setLoading(false);
      setError(null);
      const isAR = prefetched.is_ar_game && prefetched.ar_type && prefetched.ar_config;
      if (!isAR) setIsPlaying(true);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        cancelled = true;
        setError("Game took too long to load");
        setLoading(false);
      }
    }, 8000);

    (async () => {
      try {
        const response = await fetch(`/api/games?card_id=${card.id}`);
        if (cancelled) return;
        if (!response.ok) {
          setError("Game data not found");
        } else {
          const data = await response.json();
          if (data.game) {
            setGameData(data.game);
            const isAR = data.game.is_ar_game && data.game.ar_type && data.game.ar_config;
            if (!isAR) setIsPlaying(true);
          } else {
            setError("Game data not found");
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load game");
      } finally {
        clearTimeout(timeoutId);
        if (!cancelled) setLoading(false);
      }
    })();
  }, [card.id]);

  const handleGameComplete = useCallback(
    async (finalScore: number) => {
      setScore(finalScore);
      setIsPlaying(false);
      setCompleted(true);
      setHasPlayed(true);

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
      if (data.type === "GAME_SCORE") setScore(data.score);
      if (data.type === "GAME_COMPLETE") handleGameComplete(data.score);
    },
    [handleGameComplete]
  );

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowGame(false);
    setIsPlaying(false);
    setGameData(null);
    setLoading(false);
    setError(null);
    setScore(0);
    setCompleted(false);
    onPlayingChange?.(false);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCompleted(false);
    setScore(0);
    setIsPlaying(false);
    setGameData(null);
    loadGame();
  };

  const isARGame = gameData?.is_ar_game && gameData.ar_type && gameData.ar_config;

  return (
    <div className="min-h-full flex flex-col overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!showGame ? (
          /* ---------- Preview state ---------- */
          <motion.div
            key="preview"
            className="flex flex-col h-full"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
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
              <motion.div
                className="w-14 sm:w-18 h-14 sm:h-18 rounded-2xl flex items-center justify-center mb-3 bg-gradient-to-br from-orange-500 to-red-500"
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gamepad2 className="w-7 sm:w-9 h-7 sm:h-9 text-white" />
              </motion.div>

              <h3 className="text-base sm:text-lg font-bold mb-1">{card.title}</h3>
              {card.subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  {card.subtitle}
                </p>
              )}

              <motion.button
                onClick={handlePlayClick}
                disabled={isLocked || loading}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg bg-gradient-to-r from-orange-500 to-red-500"
                whileTap={{ scale: 0.95 }}
              >
                {hasPlayed ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Play Now
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* ---------- Game state (inline) ---------- */
          <motion.div
            key="game"
            className="absolute inset-0 flex flex-col z-10 bg-background rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            {/* Inline header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 flex-shrink-0">
              <span className="text-sm font-semibold truncate flex-1 mr-2">
                {card.title}
              </span>
              <div className="flex items-center gap-2">
                {score > 0 && (
                  <span className="text-xs font-medium text-orange-500">
                    {score} pts
                  </span>
                )}
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                  aria-label="Close game"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-orange-500" />
                  <p className="text-xs text-muted-foreground">Loading game...</p>
                </div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex-1 flex items-center justify-center p-3">
                <div className="text-center">
                  <p className="text-sm font-semibold mb-1">{error}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Try the full game page instead.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <a
                      href={`/game/${card.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Full page
                    </a>
                    <button
                      onClick={handleClose}
                      className="px-3 py-1.5 rounded-full border border-border text-xs font-medium hover:bg-muted"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Completed */}
            {!loading && !error && completed && (
              <div className="flex-1 flex items-center justify-center p-3">
                <div className="text-center">
                  <p className="text-3xl mb-2">🎉</p>
                  <h3 className="text-base font-bold mb-1">Game Complete!</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Score: {score}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleReplay}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Play Again
                    </button>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 rounded-full border border-border text-xs font-medium hover:bg-muted"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* AR Game: start screen */}
            {!loading && !error && gameData && isARGame && !isPlaying && !completed && (
              <div className="flex-1 flex items-center justify-center p-3">
                <div className="text-center">
                  <h3 className="text-base font-bold mb-1">{card.title}</h3>
                  {gameData.instructions && (
                    <p className="text-xs text-muted-foreground mb-3">
                      {gameData.instructions}
                    </p>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsPlaying(true); }}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold"
                  >
                    Start Game
                  </button>
                </div>
              </div>
            )}

            {/* AR Game: playing */}
            {!loading && !error && gameData && isARGame && isPlaying && (
              <ARGameViewer
                isOpen={isPlaying}
                onClose={() => handleClose()}
                title={card.title}
                instructions={gameData.instructions || "Tap objects to score points!"}
                arType={gameData.ar_type!}
                arConfig={gameData.ar_config!}
                maxScore={gameData.max_score || 200}
                onGameComplete={handleGameComplete}
                inline
              />
            )}

            {/* HTML Game: playing */}
            {!loading && !error && gameData && !isARGame && isPlaying && !completed && (
              <div className="flex-1 min-h-0 bg-black">
                <SandboxedIframe
                  htmlContent={gameData.html_content || getFallbackGameHTML()}
                  title={card.title}
                  onMessage={handleIframeMessage}
                  className="w-full h-full"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
