"use client";

import type { Card } from "@/types";

interface ThoughtProvokingCardProps {
  card: Card;
  isLocked: boolean;
}

export function ThoughtProvokingCard({ card, isLocked }: ThoughtProvokingCardProps) {
  const content = card.content || {};

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center min-w-0 w-full">
      <div className="flex items-center gap-2 mb-4 self-start flex-shrink-0 min-w-0 max-w-full">
        <div className="p-1.5 rounded-lg bg-indigo-500/20">
          <span className="text-lg">💭</span>
        </div>
        <span className="text-xs font-medium text-indigo-400 truncate">Deep Dive</span>
      </div>

      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center mb-4 flex-shrink-0">
        <span className="text-2xl">💭</span>
      </div>

      <blockquote className="text-base font-bold leading-relaxed mb-3 w-full min-w-0 max-w-sm break-words">
        &ldquo;{content.thought_text || content.body || card.title}&rdquo;
      </blockquote>

      {content.thought_source && (
        <p className="text-sm text-accent font-medium w-full min-w-0 break-words">
          &mdash; {content.thought_source}
        </p>
      )}

      {card.subtitle && (
        <p className="text-xs text-muted-foreground mt-3 w-full min-w-0 break-words">
          {card.subtitle}
        </p>
      )}
    </div>
  );
}
