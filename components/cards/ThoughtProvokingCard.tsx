"use client";

import type { Card } from "@/types";

interface ThoughtProvokingCardProps {
  card: Card;
  isLocked: boolean;
}

export function ThoughtProvokingCard({ card, isLocked }: ThoughtProvokingCardProps) {
  const content = card.content || {};

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center overflow-hidden">
      <div className="flex items-center gap-2 mb-4 self-start">
        <div className="p-1.5 rounded-lg bg-indigo-500/20">
          <span className="text-lg">💭</span>
        </div>
        <span className="text-xs font-medium text-indigo-400">Deep Dive</span>
      </div>

      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center mb-4">
        <span className="text-2xl">💭</span>
      </div>

      <blockquote className="text-base font-bold leading-relaxed mb-3 max-w-sm">
        &ldquo;{content.thought_text || content.body || card.title}&rdquo;
      </blockquote>

      {content.thought_source && (
        <p className="text-sm text-accent font-medium">
          &mdash; {content.thought_source}
        </p>
      )}

      {card.subtitle && (
        <p className="text-xs text-muted-foreground mt-3">
          {card.subtitle}
        </p>
      )}
    </div>
  );
}
