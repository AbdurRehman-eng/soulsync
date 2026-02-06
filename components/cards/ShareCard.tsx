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
      <div className="flex items-center gap-2 mb-3 self-start">
        <div className="p-1.5 rounded-lg bg-pink-500/20">
          <span className="text-lg">💌</span>
        </div>
        <span className="text-xs font-medium text-pink-400">Share Card</span>
      </div>

      <div className={`w-full rounded-2xl bg-gradient-to-br ${gradient} p-6 mb-3`}>
        {content.image_url ? (
          <img
            src={content.image_url}
            alt={card.title}
            className="w-full h-32 object-cover rounded-xl mb-3"
          />
        ) : (
          <div className="text-4xl mb-3">{emoji}</div>
        )}

        <p className="text-base font-bold leading-relaxed mb-2">
          {content.share_text || card.title}
        </p>

        {card.subtitle && (
          <p className="text-xs text-muted-foreground">
            {card.subtitle}
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Swipe to share with someone who needs this
      </p>
    </div>
  );
}
