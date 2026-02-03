"use client";

import { motion } from "framer-motion";
import { FileText, Clock } from "lucide-react";
import Image from "next/image";
import type { Card } from "@/types";

interface ArticleCardProps {
  card: Card;
  isLocked: boolean;
}

export function ArticleCard({ card }: ArticleCardProps) {
  const { body, author, read_time, image_url } = card.content;

  const maxLength = 120;
  const excerpt = body && body.length > maxLength ? body.slice(0, maxLength) + "..." : body;

  return (
    <div className="min-h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-blue-500">Article</span>
        </div>
        {read_time && (
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{read_time}m</span>
          </div>
        )}
      </div>

      {/* Featured image */}
      {(image_url || card.thumbnail_url) && (
        <div className="relative h-24 sm:h-28 rounded-lg overflow-hidden mb-2">
          <Image
            src={image_url || card.thumbnail_url!}
            alt={card.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold mb-1 line-clamp-2">{card.title}</h3>

      {/* Subtitle */}
      {card.subtitle && (
        <p className="text-[11px] sm:text-xs text-accent mb-1">{card.subtitle}</p>
      )}

      {/* Excerpt */}
      <p className="text-muted-foreground text-xs leading-snug line-clamp-2 flex-1">
        {excerpt}
      </p>

      {/* Read more link */}
      <motion.a
        href={`/article/${card.id}`}
        className="text-xs sm:text-sm text-primary mt-2 hover:underline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Read full →
      </motion.a>

      {/* Author - always visible */}
      {author && (
        <p className="text-xs text-muted-foreground mt-auto pt-1">By {author}</p>
      )}
    </div>
  );
}
