"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
import type { Card, Game } from "@/types";
import { toast } from "react-hot-toast";

// Dynamically import ARGameViewer with SSR disabled to prevent Three.js from crashing on server
const ARGameViewer = dynamic(
  () =>
    import("@/components/ARGameViewer").then((mod) => ({
      default: mod.ARGameViewer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-white/70">Loading game engine...</p>
        </div>
      </div>
    ),
  }
);

export default function GamePage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [card, setCard] = useState<Card | null>(null);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameId, setGameId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const supabase = useMemo(() => createClient(), []);

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await Promise.resolve(params);
      setGameId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!gameId) return;

    const fetchGameData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch card
        const { data: cardData, error: cardError } = await supabase
          .from("cards")
          .select("*")
          .eq("id", gameId)
          .single();

        if (cardError) {
          console.error("Card fetch error:", cardError);
          throw new Error("Card not found");
        }
        setCard(cardData);

        // Fetch game data
        const { data: gameDataResult, error: gameError } = await supabase
          .from("games")
          .select("*")
          .eq("card_id", gameId)
          .single();

        if (gameError) {
          console.error("Game fetch error:", gameError);
          throw new Error("Game data not found");
        }
        setGameData(gameDataResult);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load game";
        console.error("Failed to fetch game data:", err);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId, supabase]);

  const handleGameComplete = async (finalScore: number) => {
    setScore(finalScore);
    setIsPlaying(false);

    // Award points to user
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && card) {
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
    } catch (err) {
      console.error("Failed to award points:", err);
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
  }, [card]);

  const goHome = () => router.push("/");

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error || !card || !gameData) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">
            {error || "Game not found"}
          </p>
          <button onClick={goHome} className="text-primary hover:underline">
            Go back home
          </button>
        </div>
      </div>
    );
  }

  // AR Game
  if (gameData.is_ar_game && gameData.ar_type && gameData.ar_config) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-border">
          <button
            onClick={goHome}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-semibold">{card.title}</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* Game Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          {!isPlaying ? (
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
              {card.subtitle && (
                <p className="text-muted-foreground mb-4">{card.subtitle}</p>
              )}
              <p className="mb-6">{gameData.instructions}</p>
              <button
                onClick={() => setIsPlaying(true)}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Start Game
              </button>
            </div>
          ) : null}
        </div>

        {/* AR Game Viewer - dynamically loaded, no SSR */}
        {isPlaying && (
          <ARGameViewer
            isOpen={isPlaying}
            onClose={() => {
              setIsPlaying(false);
              goHome();
            }}
            title={card.title}
            instructions={
              gameData.instructions || "Tap objects to score points!"
            }
            arType={gameData.ar_type}
            arConfig={gameData.ar_config}
            maxScore={gameData.max_score || 200}
            onGameComplete={handleGameComplete}
          />
        )}
      </div>
    );
  }

  // Regular HTML Game
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        <button
          onClick={goHome}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-semibold">{card.title}</h1>
        <div className="flex items-center gap-2">
          {score > 0 && (
            <div className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
              {score} pts
            </div>
          )}
        </div>
      </div>

      {/* Game iframe */}
      <div className="flex-1 bg-black">
        <iframe
          ref={iframeRef}
          srcDoc={gameData.html_content || getGameHTML()}
          sandbox="allow-scripts"
          className="w-full h-full border-0"
          title={card.title}
        />
      </div>
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
