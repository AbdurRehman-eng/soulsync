"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type MascotState =
  | "idle"
  | "power-up"
  | "happy"
  | "thinking"
  | "talking"
  | "sad"
  | "celebrate"
  | "wrong";

interface MascotProps {
  state?: MascotState;
  size?: "xs" | "sm" | "md" | "lg";
  showSpeechBubble?: boolean;
  speechText?: string;
  onSpeechComplete?: () => void;
  className?: string;
}

const sizeClasses = {
  xs: "w-12 h-12 sm:w-14 sm:h-14",
  sm: "w-16 h-16 sm:w-20 sm:h-20",
  md: "w-24 h-24 sm:w-32 sm:h-32",
  lg: "w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44",
};

// Map states to mascot images
const stateToImage: Record<MascotState, string> = {
  idle: "/mascot/blinking.gif",
  "power-up": "/mascot/mascot-talking.png",
  happy: "/mascot/jump-celebrations.gif",
  thinking: "/mascot/thinking-loading.gif",
  talking: "/mascot/mascot-talking.png",
  sad: "/mascot/sad-disappointed.gif",
  celebrate: "/mascot/jump-celebrations.gif",
  wrong: "/mascot/sad-disappointed.gif",
};

// Sparkle colors for celebrate state
const sparkleColors = [
  "#FFD700", "#FF6B6B", "#4ECDC4", "#A78BFA",
  "#F472B6", "#34D399", "#FBBF24", "#60A5FA",
];

interface Sparkle {
  id: number;
  x: number;
  y: number;
  tx: string;
  ty: string;
  color: string;
  delay: number;
  size: number;
}

export function Mascot({
  state = "idle",
  size = "md",
  showSpeechBubble = false,
  speechText = "",
  onSpeechComplete,
  className,
}: MascotProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [showRing, setShowRing] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Typing effect for speech bubble
  useEffect(() => {
    if (showSpeechBubble && speechText) {
      setIsTyping(true);
      setDisplayedText("");
      let index = 0;

      const interval = setInterval(() => {
        if (index < speechText.length) {
          setDisplayedText(speechText.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
          onSpeechComplete?.();
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [speechText, showSpeechBubble, onSpeechComplete]);

  // Celebration particles
  const triggerCelebration = useCallback(() => {
    const newSparkles: Sparkle[] = Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      const distance = 40 + Math.random() * 30;
      return {
        id: Date.now() + i,
        x: 50,
        y: 50,
        tx: `${Math.cos(angle) * distance}px`,
        ty: `${Math.sin(angle) * distance}px`,
        color: sparkleColors[i % sparkleColors.length],
        delay: Math.random() * 0.2,
        size: 6 + Math.random() * 6,
      };
    });
    setSparkles(newSparkles);
    setShowRing(true);

    setTimeout(() => {
      setSparkles([]);
      setShowRing(false);
    }, 1000);
  }, []);

  // Wrong answer shake
  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  // React to state changes
  useEffect(() => {
    if (state === "celebrate") {
      triggerCelebration();
    } else if (state === "wrong") {
      triggerShake();
    }
  }, [state, triggerCelebration, triggerShake]);

  const mascotImage = stateToImage[state];

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "mx-auto flex items-start justify-between",
          showSpeechBubble && speechText ? "w-full max-w-[260px] gap-3" : "w-fit"
        )}
      >
        {/* Mascot Container */}
        <div className={cn("relative flex-shrink-0", sizeClasses[size])}>
        {/* Energy glow — active states */}
        {state === "power-up" && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
              filter: "blur(16px)",
            }}
            animate={{ opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Shiny radial glow for happy/celebrate — lit-up feel */}
        {(state === "happy" || state === "celebrate") && (
          <>
            {/* Outer soft glow */}
            <motion.div
              className="absolute -inset-3 sm:-inset-4 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255,215,0,0.25) 0%, rgba(255,165,0,0.1) 40%, transparent 70%)",
                filter: "blur(12px)",
              }}
              animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Inner bright core */}
            <motion.div
              className="absolute -inset-1 sm:-inset-2 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255,220,50,0.4) 0%, rgba(255,180,0,0.15) 50%, transparent 75%)",
                filter: "blur(8px)",
              }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}

        {/* Wrong answer red flash */}
        {state === "wrong" && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, #EF4444 0%, transparent 70%)",
              filter: "blur(16px)",
            }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* Celebration ring burst */}
        {showRing && <div className="mascot-ring-burst" />}

        {/* Celebration sparkle particles */}
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="mascot-sparkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              backgroundColor: s.color,
              "--tx": s.tx,
              "--ty": s.ty,
              animationDelay: `${s.delay}s`,
            } as React.CSSProperties}
          />
        ))}

        {/* Mascot Image */}
        <motion.div
          className={cn("relative w-full h-full z-10", shaking && "mascot-shake")}
          animate={getAnimationForState(state)}
          transition={{
            duration: getAnimationDuration(state),
            repeat: state === "celebrate" || state === "wrong" ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src={mascotImage}
            alt="Soul Sync Mascot"
            fill
            unoptimized={mascotImage.endsWith(".gif")}
            className={cn(
              "object-contain drop-shadow-2xl transition-all duration-300",
              state === "celebrate" && "drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]",
              state === "wrong" && "drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            )}
            priority
            sizes="(max-width: 768px) 150px, 224px"
          />
        </motion.div>
        </div>

        {/* Speech Bubble - to the right of mascot */}
        <AnimatePresence>
          {showSpeechBubble && speechText && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="relative z-10 flex-shrink-0"
            >
              <div className="glass-card px-2 py-1.5 sm:px-3 sm:py-2 w-[120px] sm:w-[150px] md:w-[170px]">
                <p className="text-[10px] sm:text-xs md:text-sm text-foreground leading-relaxed">
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      |
                    </motion.span>
                  )}
                </p>
                {/* Speech bubble pointer - points left toward mascot */}
                <div className="absolute top-4 sm:top-5 -left-2">
                  <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[6px] border-t-transparent border-b-transparent border-r-[var(--card)]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getAnimationForState(state: MascotState) {
  switch (state) {
    case "idle":
      return {
        y: [0, -5, 0],
        rotate: [0, 1, -1, 0],
      };
    case "power-up":
      return {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      };
    case "happy":
      return {
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 1],
      };
    case "thinking":
      return {
        rotate: [0, -5, 0],
        x: [0, -5, 0],
      };
    case "talking":
      return {
        scale: [1, 1.02, 1],
      };
    case "sad":
      return {
        y: [0, 2, 0],
        rotate: [0, -2, 2, 0],
      };
    case "celebrate":
      return {
        y: [0, -20, 0],
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0],
      };
    case "wrong":
      return {
        scale: [1, 0.92, 1],
        y: [0, 3, 0],
      };
    default:
      return {};
  }
}

function getAnimationDuration(state: MascotState): number {
  switch (state) {
    case "power-up":
      return 0.5;
    case "talking":
      return 0.3;
    case "celebrate":
      return 0.6;
    case "wrong":
      return 0.4;
    default:
      return 2;
  }
}
