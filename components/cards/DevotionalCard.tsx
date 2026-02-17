"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { ReadMoreModal } from "./ReadMoreModal";
import type { Card } from "@/types";

interface DevotionalCardProps {
  card: Card;
  isLocked: boolean;
}

export function DevotionalCard({ card }: DevotionalCardProps) {
  const { body, author } = card.content;
  const [showModal, setShowModal] = useState(false);

  const maxLength = 150;
  const truncatedBody =
    body && body.length > maxLength ? body.slice(0, maxLength) + "..." : body;

  return (
    <>
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

          {/* Read more button */}
          {body && body.length > maxLength && (
            <motion.button
              onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-sm text-primary mt-2 hover:underline text-left"
            >
              Read full →
            </motion.button>
          )}
        </div>

        {/* Author - always visible */}
        {author && (
          <p className="text-xs sm:text-sm text-accent mt-auto pt-1">— {author}</p>
        )}
      </div>

      <ReadMoreModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={card.title}
        subtitle={card.subtitle}
        body={body || ""}
        author={author}
        badge={{ label: "Devotional", icon: <Heart className="w-4 h-4 text-pink-500" />, color: "text-pink-500" }}
      />
    </>
  );
}
