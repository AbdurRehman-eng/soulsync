"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Card } from "@/types";

interface VisualCardProps {
  card: Card;
  isLocked: boolean;
}

export function VisualCard({ card, isLocked }: VisualCardProps) {
  const content = card.content || {};
  const visualType = content.visual_type || "image";
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");

  useEffect(() => {
    if (visualType !== "breathing") return;

    const phases = [
      { phase: "inhale" as const, duration: 4000 },
      { phase: "hold" as const, duration: 4000 },
      { phase: "exhale" as const, duration: 6000 },
    ];

    let phaseIndex = 0;
    let timeout: NodeJS.Timeout;

    const cycle = () => {
      setBreathPhase(phases[phaseIndex].phase);
      timeout = setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % phases.length;
        cycle();
      }, phases[phaseIndex].duration);
    };

    cycle();
    return () => clearTimeout(timeout);
  }, [visualType]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center overflow-hidden">
      <div className="flex items-center gap-2 mb-3 self-start">
        <div className="p-1.5 rounded-lg bg-emerald-500/20">
          <span className="text-lg">🧘</span>
        </div>
        <span className="text-xs font-medium text-emerald-400">Calm Corner</span>
      </div>

      <h3 className="text-base font-bold mb-3">{card.title}</h3>

      {visualType === "breathing" ? (
        <div className="flex flex-col items-center justify-center my-4">
          <motion.div
            animate={{
              scale: breathPhase === "inhale" ? 1.4 : breathPhase === "hold" ? 1.4 : 0.8,
              opacity: breathPhase === "hold" ? 0.8 : 1,
            }}
            transition={{ duration: breathPhase === "exhale" ? 6 : 4, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/40 to-teal-500/40 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: breathPhase === "inhale" ? 1.3 : breathPhase === "hold" ? 1.3 : 0.7,
              }}
              transition={{ duration: breathPhase === "exhale" ? 6 : 4, ease: "easeInOut" }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/60 to-teal-500/60"
            />
          </motion.div>
          <p className="text-sm font-medium text-emerald-400 mt-4 capitalize">
            {breathPhase === "inhale" ? "Breathe In..." : breathPhase === "hold" ? "Hold..." : "Breathe Out..."}
          </p>
        </div>
      ) : content.image_url ? (
        <div className="w-full max-h-52 rounded-xl overflow-hidden mb-3">
          <img
            src={content.image_url}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-40 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-3">
          <motion.span
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-5xl"
          >
            🧘
          </motion.span>
        </div>
      )}

      {card.subtitle && (
        <p className="text-xs text-muted-foreground">{card.subtitle}</p>
      )}
    </div>
  );
}
