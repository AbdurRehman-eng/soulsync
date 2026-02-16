"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Heart, HandHeart, ChevronUp, Sparkles } from "lucide-react";
import { useMoodStore } from "@/stores/moodStore";
import type { Card } from "@/types";

interface MoodCheckinCarouselProps {
  /** The mood-based verse card from the feed (contains devotional, prayer, note in content) */
  verseCard: Card | null;
  /** Called when user skips or swipes up to proceed to the main feed */
  onDismiss: () => void;
}

/**
 * 3-card horizontal carousel shown after mood check-in:
 *   Left:   Note + Devotional
 *   Center: Verse (default/starting position)
 *   Right:  Prayer
 *
 * User can swipe horizontally between cards, scroll up or tap "Skip" to dismiss.
 */
export function MoodCheckinCarousel({ verseCard, onDismiss }: MoodCheckinCarouselProps) {
  const { currentMood } = useMoodStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1); // Start on verse (center)
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const content = verseCard?.content || {};
  const verseText = content.verse_text || content.short_text || "";
  const verseRef = content.verse_reference || "";
  const devotional = content.devotional || "";
  const note = content.note || "";
  const prayer = content.prayer || "";

  // Scroll to center card (verse) on mount
  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth * 0.72;
      const gap = 12;
      scrollRef.current.scrollLeft = cardWidth + gap;
    }
  }, []);

  // Track horizontal scroll position to update dots
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = container.offsetWidth * 0.72;
      const gap = 12;
      const scrollPos = container.scrollLeft;
      const index = Math.round(scrollPos / (cardWidth + gap));
      setActiveIndex(Math.min(2, Math.max(0, index)));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect swipe up to dismiss (touch for mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    if (deltaY > 80) {
      onDismiss();
    }
    setTouchStartY(null);
  };

  // Detect swipe up via mouse drag (desktop)
  const [mouseStartY, setMouseStartY] = useState<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartY(e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartY === null) return;
    const deltaY = mouseStartY - e.clientY;
    if (deltaY > 60) {
      onDismiss();
    }
    setMouseStartY(null);
  };

  // Detect scroll wheel up to dismiss (desktop)
  useEffect(() => {
    let wheelAccum = 0;
    let wheelTimer: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
      // Only respond to vertical scroll (negative deltaX means horizontal)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      if (e.deltaY < 0) {
        // Scrolling up
        wheelAccum += Math.abs(e.deltaY);
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => { wheelAccum = 0; }, 300);

        if (wheelAccum > 120) {
          wheelAccum = 0;
          onDismiss();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(wheelTimer);
    };
  }, [onDismiss]);

  const moodColor = currentMood?.color || "#a78bfa";
  const moodEmoji = currentMood?.emoji || "✨";
  const moodName = currentMood?.name || "Your Mood";

  if (!verseCard) {
    // No verse data available, skip directly
    return null;
  }

  const cards = [
    {
      key: "devotional",
      icon: <Heart className="w-4 h-4" />,
      label: "Devotional",
      content: (
        <>
          {note && (
            <p className="text-sm sm:text-base font-semibold mb-3 leading-snug">
              {note}
            </p>
          )}
          {devotional && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {devotional}
            </p>
          )}
          {!note && !devotional && (
            <p className="text-sm text-muted-foreground italic">No devotional for this verse</p>
          )}
        </>
      ),
    },
    {
      key: "verse",
      icon: <BookOpen className="w-4 h-4" />,
      label: "Verse",
      content: (
        <>
          <blockquote className="text-sm sm:text-base md:text-lg font-serif leading-relaxed mb-2 sm:mb-3">
            &ldquo;{verseText}&rdquo;
          </blockquote>
          {verseRef && (
            <p className="text-sm font-medium" style={{ color: moodColor }}>
              — {verseRef}
            </p>
          )}
        </>
      ),
    },
    {
      key: "prayer",
      icon: <HandHeart className="w-4 h-4" />,
      label: "Prayer",
      content: (
        <>
          {prayer ? (
            <p className="text-sm sm:text-base leading-relaxed italic">
              {prayer}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No prayer for this verse</p>
          )}
        </>
      ),
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="flex-1 flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.4 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Header */}
        <div className="px-4 pt-2 pb-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl">{moodEmoji}</span>
            <h2 className="text-base sm:text-lg font-semibold">
              Feeling {moodName}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Swipe to explore your mood content
          </p>
        </div>

        {/* Horizontal carousel */}
        <div className="flex-1 flex flex-col justify-center min-h-0 px-2 overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {/* Left spacer for centering */}
            <div className="flex-shrink-0" style={{ width: "14%" }} />

            {cards.map((item, i) => (
              <motion.div
                key={item.key}
                className="flex-shrink-0 snap-center rounded-2xl p-3 sm:p-4 md:p-5 flex flex-col border overflow-hidden"
                style={{
                  width: "72%",
                  maxWidth: "320px",
                  height: "clamp(150px, 32vh, 300px)",
                  background: `linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, ${moodColor} 8%, var(--card)) 100%)`,
                  borderColor: `color-mix(in srgb, ${moodColor} 20%, var(--border))`,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.2 }}
              >
                {/* Card type badge */}
                <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                  <div
                    className="p-1 sm:p-1.5 rounded-lg"
                    style={{ backgroundColor: `color-mix(in srgb, ${moodColor} 20%, transparent)` }}
                  >
                    <span style={{ color: moodColor }}>{item.icon}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium" style={{ color: moodColor }}>
                    {item.label}
                  </span>
                </div>

                {/* Card content */}
                <div className="flex-1 flex flex-col justify-center overflow-y-auto scrollbar-hide min-h-0">
                  {item.content}
                </div>
              </motion.div>
            ))}

            {/* Right spacer for centering */}
            <div className="flex-shrink-0" style={{ width: "14%" }} />
          </div>

          {/* Horizontal dots indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            {cards.map((item, i) => (
              <div
                key={item.key}
                className="rounded-full transition-all duration-300"
                style={{
                  width: activeIndex === i ? 20 : 6,
                  height: 6,
                  backgroundColor: activeIndex === i ? moodColor : "var(--muted)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="px-4 pb-3 pt-1 flex flex-col items-center">
          {/* Swipe up hint */}
          <motion.div
            className="flex flex-col items-center text-muted-foreground cursor-pointer"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            onClick={onDismiss}
          >
            <ChevronUp className="w-5 h-5" />
            <span className="text-[10px]">Swipe up</span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MoodCheckinCarousel;
