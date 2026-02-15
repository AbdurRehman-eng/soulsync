"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { FeedCard } from "@/components/cards/FeedCard";
import { VerticalProgressDots } from "./VerticalProgressDots";
import type { Card } from "@/types";

// How many cards above/below the current one to keep rendered
const RENDER_WINDOW = 2;

interface MoodCarouselProps {
  cards: Card[];
  onSwipeUp?: () => void;
}

export function MoodCarousel({ cards, onSwipeUp }: MoodCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const viewedCardsRef = useRef<Set<string>>(new Set());

  // Fetch liked cards on mount to show correct like state
  useEffect(() => {
    fetchLikedCards();
  }, []);

  const fetchLikedCards = async () => {
    try {
      // Reduced limit from 500 to 50 — user won't have 500 liked cards visible
      const response = await fetch("/api/interactions?type=like&limit=50");
      if (response.ok) {
        const data = await response.json();
        const likedCardIds = new Set<string>(data.cards?.map((c: Card) => c.id) ?? []);
        setLikedCards(likedCardIds);
      }
    } catch {
      // Non-critical — silently fail
    }
  };

  // Set up Intersection Observer for scroll tracking
  useEffect(() => {
    if (!scrollContainerRef.current || cards.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setCurrentIndex(index);

            // Track view only once per card per session
            const cardId = entry.target.getAttribute("data-card-id");
            if (cardId && !viewedCardsRef.current.has(cardId)) {
              viewedCardsRef.current.add(cardId);
              handleView(cardId);
            }
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

  const handleLike = useCallback((cardId: string) => {
    // Update local state immediately for responsive UI
    setLikedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });

    // Persist to API
    fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card_id: cardId, type: "like" }),
    }).catch(console.error);
  }, []);

  const handleShare = useCallback((cardId: string) => {
    fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card_id: cardId, type: "share" }),
    }).catch(console.error);
  }, []);

  const handleView = useCallback((cardId: string) => {
    fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card_id: cardId, type: "view" }),
    }).catch(console.error);
  }, []);

  // Only render cards within the visible window
  const visibleRange = useMemo(() => {
    const start = Math.max(0, currentIndex - RENDER_WINDOW);
    const end = Math.min(cards.length - 1, currentIndex + RENDER_WINDOW);
    return { start, end };
  }, [currentIndex, cards.length]);

  return (
    <div className="relative flex-1 flex flex-col w-full max-w-[100vw] overflow-x-hidden">
      {/* Vertical scroll container */}
      <div ref={scrollContainerRef} className="vertical-feed-container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            data-index={index}
            data-card-id={card.id}
            className="feed-snap-item"
          >
            {index >= visibleRange.start && index <= visibleRange.end ? (
              <FeedCard
                card={card}
                index={index}
                isLiked={likedCards.has(card.id)}
                onLike={() => handleLike(card.id)}
                onShare={() => handleShare(card.id)}
                onView={() => handleView(card.id)}
              />
            ) : (
              <div className="feed-card" />
            )}
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

export default MoodCarousel;
