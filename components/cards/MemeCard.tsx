"use client";

import type { Card } from "@/types";

interface MemeCardProps {
  card: Card;
  isLocked: boolean;
}

export function MemeCard({ card, isLocked }: MemeCardProps) {
  const content = card.content || {};

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center overflow-hidden">
      <div className="flex items-center gap-2 mb-3 self-start">
        <div className="p-1.5 rounded-lg bg-yellow-500/20">
          <span className="text-lg">😄</span>
        </div>
        <span className="text-xs font-medium text-yellow-400">Joy Moment</span>
      </div>

      {content.meme_text_top && (
        <p className="text-sm font-bold uppercase tracking-wide text-white mb-2 drop-shadow-lg">
          {content.meme_text_top}
        </p>
      )}

      {content.image_url && (
        <div className="w-full max-h-48 rounded-xl overflow-hidden mb-2">
          <img
            src={content.image_url}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {!content.image_url && (
        <div className="w-full h-32 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mb-2">
          <span className="text-5xl">😄</span>
        </div>
      )}

      {content.meme_text_bottom && (
        <p className="text-sm font-bold uppercase tracking-wide text-white drop-shadow-lg">
          {content.meme_text_bottom}
        </p>
      )}

      <h3 className="text-base font-bold mt-2">{card.title}</h3>
    </div>
  );
}
