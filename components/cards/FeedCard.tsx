"use client";

import { memo, lazy, Suspense, type ComponentType } from "react";
import { Lock } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { LikeButton } from "@/components/interactions/LikeButton";
import { ShareButton } from "@/components/interactions/ShareButton";
import type { Card } from "@/types";

// Lazy-load all card type components — they are only loaded when needed
// This prevents all 18 card types from being bundled into the initial JS
const VerseCard = lazy(() => import("./VerseCard").then(m => ({ default: m.VerseCard })));
const DevotionalCard = lazy(() => import("./DevotionalCard").then(m => ({ default: m.DevotionalCard })));
const ArticleCard = lazy(() => import("./ArticleCard").then(m => ({ default: m.ArticleCard })));
const QuizCard = lazy(() => import("./QuizCard").then(m => ({ default: m.QuizCard })));
const GameCard = lazy(() => import("./GameCard").then(m => ({ default: m.GameCard })));
const TaskCard = lazy(() => import("./TaskCard").then(m => ({ default: m.TaskCard })));
const PrayerCard = lazy(() => import("./PrayerCard").then(m => ({ default: m.PrayerCard })));
const MotivationalCard = lazy(() => import("./MotivationalCard").then(m => ({ default: m.MotivationalCard })));
const MemeCard = lazy(() => import("./MemeCard").then(m => ({ default: m.MemeCard })));
const FactCard = lazy(() => import("./FactCard").then(m => ({ default: m.FactCard })));
const RiddleCard = lazy(() => import("./RiddleCard").then(m => ({ default: m.RiddleCard })));
const JokeCard = lazy(() => import("./JokeCard").then(m => ({ default: m.JokeCard })));
const ThoughtProvokingCard = lazy(() => import("./ThoughtProvokingCard").then(m => ({ default: m.ThoughtProvokingCard })));
const VisualCard = lazy(() => import("./VisualCard").then(m => ({ default: m.VisualCard })));
const ShareCard = lazy(() => import("./ShareCard").then(m => ({ default: m.ShareCard })));
const MarketingCard = lazy(() => import("./MarketingCard").then(m => ({ default: m.MarketingCard })));
const MilestoneCard = lazy(() => import("./MilestoneCard").then(m => ({ default: m.MilestoneCard })));
const UpgradeCard = lazy(() => import("./UpgradeCard").then(m => ({ default: m.UpgradeCard })));
const JournalPromptCard = lazy(() => import("./JournalPromptCard").then(m => ({ default: m.JournalPromptCard })));
const PauseCard = lazy(() => import("./PauseCard").then(m => ({ default: m.PauseCard })));
const InspirationCard = lazy(() => import("./InspirationCard").then(m => ({ default: m.InspirationCard })));

interface FeedCardProps {
  card: Card;
  index: number;
  isLiked?: boolean;
  onLike?: () => void;
  onShare?: () => void;
  onView?: () => void;
}

// Lightweight card content skeleton while lazy component loads
function CardContentSkeleton() {
  return (
    <div className="flex-1 flex flex-col justify-center gap-3 animate-pulse">
      <div className="h-6 w-3/4 bg-muted/30 rounded" />
      <div className="h-4 w-full bg-muted/30 rounded" />
      <div className="h-4 w-2/3 bg-muted/30 rounded" />
    </div>
  );
}

export const FeedCard = memo(function FeedCard({
  card,
  index,
  isLiked = false,
  onLike,
  onShare,
  onView,
}: FeedCardProps) {
  const { profile } = useUserStore();
  const membershipLevel = profile?.membership_level ?? 1;
  const isLocked = card.min_membership_level > membershipLevel;

  const CardContent = getCardComponent(card.type);

  return (
    <div
      className="feed-card relative animate-fade-in"
      style={{ animationDelay: `${Math.min(index * 50, 200)}ms` }}
      onClick={onView}
    >
      {/* Background image if available */}
      {card.background_url && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${card.background_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      )}

      {/* Card content */}
      <div className="relative h-full flex flex-col p-2 sm:p-4 z-10 overflow-hidden">
        {/* Content area with max height */}
        <div className="flex-1 overflow-hidden flex flex-col justify-center min-h-0">
          <Suspense fallback={<CardContentSkeleton />}>
            <CardContent card={card} isLocked={isLocked} />
          </Suspense>
        </div>

        {/* Bottom actions - always at the bottom */}
        <div className="mt-auto pt-2 sm:pt-3 flex items-end justify-between flex-shrink-0 h-14 sm:h-16">
          <LikeButton isLiked={isLiked} onLike={onLike} />
          <ShareButton onShare={onShare} />
        </div>
      </div>

      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl animate-fade-in">
          <div className="animate-bounce-subtle">
            <Lock className="w-12 h-12 text-accent mb-4" />
          </div>
          <p className="text-lg font-semibold mb-2">Premium Content</p>
          <p className="text-sm text-muted-foreground text-center px-8">
            Upgrade to Level {card.min_membership_level} to unlock this content
          </p>
          <button className="mt-4 px-6 py-2 rounded-full bg-accent text-accent-foreground font-medium">
            Upgrade Now
          </button>
        </div>
      )}

      {/* Points reward indicator */}
      {card.points_reward > 0 && !isLocked && (
        <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
          +{card.points_reward} pts
        </div>
      )}
    </div>
  );
});

function getCardComponent(type: Card["type"]): ComponentType<{ card: Card; isLocked: boolean }> {
  switch (type) {
    case "verse":
      return VerseCard;
    case "devotional":
      return DevotionalCard;
    case "article":
      return ArticleCard;
    case "quiz":
      return QuizCard;
    case "game":
      return GameCard;
    case "task":
      return TaskCard;
    case "prayer":
      return PrayerCard;
    case "motivational":
      return MotivationalCard;
    case "meme":
      return MemeCard;
    case "fact":
      return FactCard;
    case "riddle":
      return RiddleCard;
    case "joke":
      return JokeCard;
    case "thought_provoking":
      return ThoughtProvokingCard;
    case "visual":
      return VisualCard;
    case "share_card":
      return ShareCard;
    case "marketing":
      return MarketingCard;
    case "milestone":
      return MilestoneCard;
    case "upgrade":
      return UpgradeCard;
    case "journal_prompt":
    case "journal":
      return JournalPromptCard;
    case "pause":
      return PauseCard;
    case "inspiration":
      return InspirationCard;
    default:
      return DefaultCard;
  }
}

function DefaultCard({ card }: { card: Card; isLocked: boolean }) {
  return (
    <div className="flex-1 flex flex-col justify-center">
      <h3 className="text-base sm:text-lg font-bold mb-2">{card.title}</h3>
      {card.subtitle && (
        <p className="text-xs sm:text-sm text-muted-foreground">{card.subtitle}</p>
      )}
    </div>
  );
}
