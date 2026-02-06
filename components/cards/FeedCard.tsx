"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { LikeButton } from "@/components/interactions/LikeButton";
import { ShareButton } from "@/components/interactions/ShareButton";
import { cn } from "@/lib/utils";
import type { Card } from "@/types";

// Card type components
import { VerseCard } from "./VerseCard";
import { DevotionalCard } from "./DevotionalCard";
import { ArticleCard } from "./ArticleCard";
import { QuizCard } from "./QuizCard";
import { GameCard } from "./GameCard";
import { TaskCard } from "./TaskCard";
import { PrayerCard } from "./PrayerCard";
import { MotivationalCard } from "./MotivationalCard";
import { MemeCard } from "./MemeCard";
import { FactCard } from "./FactCard";
import { RiddleCard } from "./RiddleCard";
import { JokeCard } from "./JokeCard";
import { ThoughtProvokingCard } from "./ThoughtProvokingCard";
import { VisualCard } from "./VisualCard";
import { ShareCard } from "./ShareCard";
import { MarketingCard } from "./MarketingCard";
import { MilestoneCard } from "./MilestoneCard";
import { UpgradeCard } from "./UpgradeCard";
import { JournalPromptCard } from "./JournalPromptCard";

interface FeedCardProps {
  card: Card;
  index: number;
  isLiked?: boolean;
  onLike?: () => void;
  onShare?: () => void;
  onView?: () => void;
}

export function FeedCard({
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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="feed-card relative"
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
          <CardContent card={card} isLocked={isLocked} />
        </div>

        {/* Bottom actions - always at the bottom */}
        <div className="mt-auto pt-2 sm:pt-3 flex items-end justify-between flex-shrink-0 h-14 sm:h-16">
          <LikeButton isLiked={isLiked} onLike={onLike} />
          <ShareButton onShare={onShare} />
        </div>
      </div>

      {/* Locked overlay */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lock className="w-12 h-12 text-accent mb-4" />
          </motion.div>
          <p className="text-lg font-semibold mb-2">Premium Content</p>
          <p className="text-sm text-muted-foreground text-center px-8">
            Upgrade to Level {card.min_membership_level} to unlock this content
          </p>
          <button className="mt-4 px-6 py-2 rounded-full bg-accent text-accent-foreground font-medium">
            Upgrade Now
          </button>
        </motion.div>
      )}

      {/* Points reward indicator */}
      {card.points_reward > 0 && !isLocked && (
        <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
          +{card.points_reward} pts
        </div>
      )}
    </motion.div>
  );
}

function getCardComponent(type: Card["type"]) {
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
