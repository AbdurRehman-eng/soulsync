"use client";

import { Coffee, Moon, Sun } from "lucide-react";
import type { Card } from "@/types";

interface PauseCardProps {
  card: Card;
  isLocked: boolean;
}

export function PauseCard({ card }: PauseCardProps) {
  const {
    pause_message,
    pause_type,
    pause_cta_text,
    image_url,
  } = card.content;

  const message = pause_message || "Take a moment to breathe and reflect.";
  const ctaText = pause_cta_text || "See you tomorrow";

  const getIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return <Sun className="w-10 sm:w-12 h-10 sm:h-12 text-accent" />;
    if (hour < 18) return <Coffee className="w-10 sm:w-12 h-10 sm:h-12 text-accent" />;
    return <Moon className="w-10 sm:w-12 h-10 sm:h-12 text-accent" />;
  };

  return (
    <div className="min-h-full flex flex-col justify-center items-center text-center overflow-hidden px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Icon */}
      <div className="mb-4 sm:mb-6 animate-fade-in">
        {getIcon()}
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 animate-fade-in">
        {card.title || "Time to Pause"}
      </h3>

      {/* Message */}
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6 max-w-[280px] animate-fade-in">
        {message}
      </p>

      {/* CTA */}
      <div className="px-5 py-2 rounded-full bg-accent/20 text-accent text-xs sm:text-sm font-medium animate-fade-in">
        {ctaText}
      </div>

      {/* Pause type badge */}
      {pause_type && pause_type !== "default" && (
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-primary/20 text-primary text-[10px] sm:text-xs font-medium">
          {pause_type}
        </div>
      )}
    </div>
  );
}
