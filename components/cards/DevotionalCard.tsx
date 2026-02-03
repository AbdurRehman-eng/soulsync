"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Card } from "@/types";

interface DevotionalCardProps {
  card: Card;
  isLocked: boolean;
}

export function DevotionalCard({ card }: DevotionalCardProps) {
  const { body, author } = card.content;

  const maxLength = 150;
  const truncatedBody =
    body && body.length > maxLength ? body.slice(0, maxLength) + "..." : body;

  return (
    <div className="min-h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <div className="p-1.5 sm:p-2 rounded-lg bg-pink-500/20">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
        </div>
        <span className="text-xs sm:text-sm font-medium text-pink-500">Devotional</span>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold mb-2">{card.title}</h3>

      {/* Content preview */}
      <div className="flex-1 flex flex-col min-h-0">
        <p className="text-xs sm:text-sm text-muted-foreground leading-snug sm:leading-relaxed line-clamp-3">
          {truncatedBody}
        </p>

        {/* Read more link */}
        {body && body.length > maxLength && (
          <motion.a
            href={`/devotional/${card.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-primary mt-2 hover:underline"
          >
            Read full →
          </motion.a>
        )}
      </div>

      {/* Author - always visible */}
      {author && (
        <p className="text-xs sm:text-sm text-accent mt-auto pt-1">— {author}</p>
      )}
    </div>
  );
}
