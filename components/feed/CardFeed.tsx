"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { FeedCard } from "@/components/cards/FeedCard";
import { FeedSkeleton } from "./FeedSkeleton";
import { VerticalProgressDots } from "./VerticalProgressDots";
import { useMoodStore } from "@/stores/moodStore";
import type { Card } from "@/types";

// How many cards above/below the current one to keep rendered
const RENDER_WINDOW = 2;

interface CardFeedProps {
  initialCards?: Card[];
}

export function CardFeed({ initialCards = [] }: CardFeedProps) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(initialCards.length === 0);
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const viewedCardsRef = useRef<Set<string>>(new Set());

  // Get current mood from store
  const { currentMood } = useMoodStore();

  // Fetch liked cards on mount to show correct like state
  useEffect(() => {
    fetchLikedCards();
  }, []);

  const fetchLikedCards = async () => {
    try {
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

  // Fetch cards on mount and when mood changes
  useEffect(() => {
    if (initialCards.length === 0) {
      fetchCards();
    }
  }, [currentMood?.id]); // Re-fetch when mood changes

  // Set up Intersection Observer for scroll tracking
  useEffect(() => {
    if (!scrollContainerRef.current || cards.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setCurrentIndex(index);

            // Auto-track view (deduplicate - only track once per session)
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

  const fetchCards = async () => {
    setLoading(true);
    try {
      // Build URL with mood parameter if mood is selected
      const url = new URL('/api/feed', window.location.origin);
      if (currentMood?.id) {
        url.searchParams.set('mood_id', currentMood.id);
      }

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setCards(data.cards);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleLike = useCallback((cardId: string) => {
    setLikedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });

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

  // Only render cards within the visible window (±RENDER_WINDOW of currentIndex)
  const visibleRange = useMemo(() => {
    const start = Math.max(0, currentIndex - RENDER_WINDOW);
    const end = Math.min(cards.length - 1, currentIndex + RENDER_WINDOW);
    return { start, end };
  }, [currentIndex, cards.length]);

  if (loading) {
    return <FeedSkeleton />;
  }

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-xl font-semibold mb-2">No cards yet</p>
        <p className="text-muted-foreground">
          Select your mood to get personalized content
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex-1">
      {/* Vertical scroll container */}
      <div ref={scrollContainerRef} className="vertical-feed-container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            data-index={index}
            data-card-id={card.id}
            className="feed-snap-item"
          >
            {/* Only render FeedCard for items within the visible window */}
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
        total={Math.min(cards.length, 20)}
        current={currentIndex}
      />
    </div>
  );
}
