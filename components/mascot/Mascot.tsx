"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type MascotState = "idle" | "power-up" | "happy" | "thinking" | "talking" | "sad";

interface MascotProps {
  state?: MascotState;
  size?: "sm" | "md" | "lg";
  showSpeechBubble?: boolean;
  speechText?: string;
  onSpeechComplete?: () => void;
  className?: string;
}

const sizeClasses = {
  sm: "w-16 h-16 sm:w-20 sm:h-20",
  md: "w-24 h-24 sm:w-32 sm:h-32",
  lg: "w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44",
};

// Map states to mascot images
const stateToImage: Record<MascotState, string> = {
  idle: "/mascot/mascot-idle.png",
  "power-up": "/mascot/mascot-talking.png",
  happy: "/mascot/mascot-happy.png",
  thinking: "/mascot/mascot-thinking.png",
  talking: "/mascot/mascot-talking.png",
  sad: "/mascot/mascot-thinking.png", // Use thinking for sad as fallback
};

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

  const mascotImage = stateToImage[state];

  return (
    <div className={cn("relative", className)}>
      {/* Speech Bubble - positioned to the right of mascot */}
      <AnimatePresence>
        {showSpeechBubble && speechText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute z-10 top-0 left-full ml-1 sm:ml-2"
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

      {/* Mascot Container */}
      <div className={cn("relative", sizeClasses[size])}>
        {/* Energy/Plasma Effect Background */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
          animate={
            state === "power-up"
              ? {
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }
              : {
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }
          }
          transition={{
            duration: state === "power-up" ? 0.5 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Electric arc effects */}
        {(state === "power-up" || state === "talking") && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(from ${i * 120}deg, transparent, var(--accent), transparent)`,
                  borderRadius: "50%",
                  filter: "blur(4px)",
                }}
                animate={{
                  rotate: 360,
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  rotate: {
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  opacity: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />
            ))}
          </>
        )}

        {/* Mascot Image */}
        <motion.div
          className="relative w-full h-full z-10"
          animate={getAnimationForState(state)}
          transition={{
            duration: getAnimationDuration(state),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src={mascotImage}
            alt="Soul Sync Mascot"
            fill
            className="object-contain drop-shadow-2xl"
            priority
            sizes="(max-width: 768px) 150px, 224px"
          />
        </motion.div>

        {/* Particle effects */}
        {state === "happy" && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-accent"
                style={{
                  left: `${50 + Math.cos((i * Math.PI * 2) / 8) * 40}%`,
                  top: `${50 + Math.sin((i * Math.PI * 2) / 8) * 40}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
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
    default:
      return 2;
  }
}
