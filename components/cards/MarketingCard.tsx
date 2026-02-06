"use client";

import { motion } from "framer-motion";
import type { Card } from "@/types";

interface MarketingCardProps {
  card: Card;
  isLocked: boolean;
}

export function MarketingCard({ card, isLocked }: MarketingCardProps) {
  const content = card.content || {};

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center overflow-hidden">
      {content.image_url && (
        <div className="w-full max-h-40 rounded-xl overflow-hidden mb-3">
          <img
            src={content.image_url}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <h3 className="text-lg font-bold mb-2">{card.title}</h3>
        {card.subtitle && (
          <p className="text-sm text-muted-foreground mb-3">{card.subtitle}</p>
        )}
        {content.body && (
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed max-w-sm">
            {content.body}
          </p>
        )}
      </motion.div>

      {content.cta_text && (
        <motion.a
          href={content.cta_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold shadow-lg"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => e.stopPropagation()}
        >
          {content.cta_text}
        </motion.a>
      )}

      <span className="text-[10px] text-muted-foreground/50 mt-2">Sponsored</span>
    </div>
  );
}
