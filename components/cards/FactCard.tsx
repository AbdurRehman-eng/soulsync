"use client";

import type { Card } from "@/types";

interface FactCardProps {
  card: Card;
  isLocked: boolean;
}

export function FactCard({ card, isLocked }: FactCardProps) {
  const content = card.content || {};

  return (
    <div className="flex-1 flex flex-col justify-center overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-cyan-500/20">
          <span className="text-lg">💎</span>
        </div>
        <span className="text-xs font-medium text-cyan-400">Gem</span>
      </div>

      <div className="relative mb-3">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
        <div className="pl-4">
          <h3 className="text-base font-bold mb-2">{card.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {content.fact_text || content.body}
          </p>
        </div>
      </div>

      {content.fact_source && (
        <p className="text-xs text-muted-foreground mt-auto">
          Source: {content.fact_source}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
          Did you know?
        </span>
      </div>
    </div>
  );
}
