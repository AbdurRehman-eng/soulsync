"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Play, X, Info } from "lucide-react";
import type { Card } from "@/types";

interface GameCardProps {
  card: Card;
  isLocked: boolean;
}

export function GameCard({ card, isLocked }: GameCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle messages from the game iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "GAME_SCORE") {
        setScore(event.data.score);
      }
      if (event.data.type === "GAME_COMPLETE") {
        // Handle game completion - award points, etc.
        setIsPlaying(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="min-h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/20">
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-orange-500">Mini Game</span>
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

          {/* Instructions */}
          <div className="glass-card p-2 mb-2 text-xs text-muted-foreground flex items-start gap-1 text-left">
            <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span>Play to earn points!</span>
          </div>

          {/* Play button */}
          <motion.button
            onClick={() => setIsPlaying(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold"
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-4 h-4" />
            Play
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
              srcDoc={getGameHTML()}
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
