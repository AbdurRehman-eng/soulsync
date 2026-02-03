"use client";

import { useRef, useState, useEffect } from "react";
import { FeedCard } from "@/components/cards/FeedCard";
import { VerticalProgressDots } from "./VerticalProgressDots";
import type { Card } from "@/types";

interface MoodCarouselProps {
  cards: Card[];
  onSwipeUp?: () => void;
}

export function MoodCarousel({ cards, onSwipeUp }: MoodCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up Intersection Observer for scroll tracking
  useEffect(() => {
    if (!scrollContainerRef.current || cards.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setCurrentIndex(index);
          }
        });
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    // Observe all card items
    const cardElements = scrollContainerRef.current.querySelectorAll(".feed-snap-item");
    cardElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [cards]);

  const handleLike = (cardId: string) => {
    setLikedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleShare = (cardId: string) => {
    // API call to track share
    fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card_id: cardId, type: "share" }),
    }).catch(console.error);
  };

  return (
    <div className="relative flex-1 flex flex-col">
      {/* Vertical scroll container */}
      <div ref={scrollContainerRef} className="vertical-feed-container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            data-index={index}
            data-card-id={card.id}
            className="feed-snap-item"
          >
            <FeedCard
              card={card}
              index={index}
              isLiked={likedCards.has(card.id)}
              onLike={() => handleLike(card.id)}
              onShare={() => handleShare(card.id)}
            />
          </div>
        ))}
      </div>

      {/* Vertical progress dots */}
      <VerticalProgressDots
        total={cards.length}
        current={currentIndex}
      />
    </div>
  );
}
