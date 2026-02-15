"use client";

import { Heart } from "lucide-react";
import type { Card } from "@/types";

interface InspirationCardProps {
  card: Card;
  isLocked: boolean;
}

export function InspirationCard({ card }: InspirationCardProps) {
  const { inspiration_text, inspiration_author, quote, quote_author, image_url } = card.content;

  const text = inspiration_text || quote || "";
  const author = inspiration_author || quote_author;

  if (!text) return null;

  const maxLength = 220;
  const displayText = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  return (
    <div className="min-h-full flex flex-col justify-center items-center text-center overflow-hidden px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Icon */}
      <div className="mb-3 sm:mb-4">
        <Heart className="w-8 sm:w-10 h-8 sm:h-10 text-accent" />
      </div>

      {/* Label */}
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-accent/80 mb-3 sm:mb-4 font-medium">
        Inspiration
      </span>

      {/* Text */}
      <blockquote className="text-base sm:text-xl font-semibold leading-snug sm:leading-relaxed mb-3 sm:mb-4 line-clamp-4">
        &ldquo;{displayText}&rdquo;
      </blockquote>

      {/* Author */}
      {author && (
        <p className="text-sm sm:text-base text-accent font-medium">
          &mdash; {author}
        </p>
      )}
    </div>
  );
}
