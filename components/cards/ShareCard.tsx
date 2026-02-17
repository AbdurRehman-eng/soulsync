"use client";

import type { Card } from "@/types";

interface ShareCardProps {
  card: Card;
  isLocked: boolean;
}

export function ShareCard({ card, isLocked }: ShareCardProps) {
  const content = card.content || {};

  const moodColors: Record<string, string> = {
    happy: "from-yellow-500/30 to-orange-500/30",
    sad: "from-blue-500/30 to-indigo-500/30",
    grateful: "from-green-500/30 to-emerald-500/30",
    anxious: "from-orange-500/30 to-red-500/30",
    lonely: "from-purple-500/30 to-violet-500/30",
    angry: "from-red-500/30 to-pink-500/30",
  };

  const moodEmojis: Record<string, string> = {
    happy: "😊",
    sad: "💙",
    grateful: "🙏",
    anxious: "🌟",
    lonely: "💜",
    angry: "🔥",
  };

  const mood = content.share_mood?.toLowerCase() || "happy";
  const gradient = moodColors[mood] || moodColors.happy;
  const emoji = moodEmojis[mood] || "✨";

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center overflow-hidden">
      <div className="flex items-center gap-2 mb-2 sm:mb-3 self-start">
        <div className="p-1.5 rounded-lg bg-pink-500/20">
          <span className="text-base sm:text-lg">💌</span>
        </div>
        <span className="text-[10px] sm:text-xs font-medium text-pink-400">Share Card</span>
      </div>

      <div className={`w-full flex-1 rounded-2xl bg-gradient-to-br ${gradient} p-4 sm:p-6 mb-2 sm:mb-3 flex flex-col items-center justify-center`}>
        {content.image_url ? (
          <img
            src={content.image_url}
            alt={card.title}
            className="w-full h-28 sm:h-36 object-cover rounded-xl mb-2 sm:mb-3"
          />
        ) : (
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{emoji}</div>
        )}

        <p className="text-sm sm:text-lg md:text-xl font-bold leading-snug sm:leading-relaxed mb-1 sm:mb-2">
          {content.share_text || card.title}
        </p>

        {card.subtitle && (
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {card.subtitle}
          </p>
        )}
      </div>

      <p className="text-[10px] sm:text-xs text-muted-foreground">
        Swipe to share with someone who needs this
      </p>
    </div>
  );
}
