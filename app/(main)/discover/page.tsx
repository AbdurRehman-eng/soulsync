"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Star, ArrowLeft, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FeedCard } from "@/components/cards/FeedCard";
import { FeedSkeleton } from "@/components/feed/FeedSkeleton";
import type { Card, ContentCategory } from "@/types";

// Categories that have their own dedicated pages (to avoid loading heavy content inline)
const DEDICATED_PAGES: Record<string, string> = {
  arena: "/arena",
  "ar-world": "/ar-world",
  "ar-games": "/ar-games",
};

// Categories that render as horizontal scroll carousels instead of vertical lists
const HORIZONTAL_SCROLL_CATEGORIES = new Set(["share-cards", "joy-moments"]);

// Default categories with bento grid sizing
const CATEGORY_CONFIG: Record<string, { size: "large" | "medium" | "small"; row?: number }> = {
  "arena": { size: "large" },
  "ar-world": { size: "large" },
  "ar-games": { size: "large" },
  "mind-quests": { size: "medium" },
  "joy-moments": { size: "medium" },
  "share-cards": { size: "small" },
  "insights": { size: "large" },
  "deep-dive": { size: "medium" },
  "calm-corner": { size: "small" },
  "gems": { size: "small" },
  "enigmas": { size: "medium" },
  "light-hearts": { size: "small" },
  "reflections": { size: "medium" },
  "boosts": { size: "large" },
};

export default function DiscoverPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [trendingCards, setTrendingCards] = useState<Card[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);
  const [categoryCards, setCategoryCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDiscoverData();
    fetchLikedCards();
  }, []);

  const fetchDiscoverData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        setFeaturedCards(data.featured || []);
        setTrendingCards(data.trending || []);
      }
    } catch (error) {
      console.error("[Discover] Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedCards = async () => {
    try {
      const response = await fetch("/api/interactions?type=like&limit=500");
      if (response.ok) {
        const data = await response.json();
        setLikedCards(new Set(data.cards?.map((c: Card) => c.id) || []));
      }
    } catch (error) {
      console.error("[Discover] Failed to fetch likes:", error);
    }
  };

  const handleCategoryClick = async (category: ContentCategory) => {
    // Redirect to dedicated page if one exists
    const dedicatedPage = DEDICATED_PAGES[category.slug];
    if (dedicatedPage) {
      router.push(dedicatedPage);
      return;
    }

    setSelectedCategory(category);
    setCategoryLoading(true);
    try {
      const response = await fetch(`/api/feed/category/${category.slug}`);
      if (response.ok) {
        const data = await response.json();
        setCategoryCards(data.cards || []);
      }
    } catch (error) {
      console.error("[Discover] Failed to fetch category cards:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleLike = useCallback((cardId: string) => {
    setLikedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) newSet.delete(cardId);
      else newSet.add(cardId);
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

  const filteredCategories = searchQuery
    ? categories.filter(
        (c) =>
          c.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col px-4 pt-2 pb-20 overflow-y-auto">
        <div className="mb-5">
          <div className="h-8 w-32 rounded-lg skeleton mb-2" />
          <div className="h-4 w-48 rounded skeleton" />
        </div>
        <div className="relative mb-5">
          <div className="h-11 w-full rounded-2xl skeleton" />
        </div>
        <FeedSkeleton />
      </div>
    );
  }

  // Category detail view
  if (selectedCategory) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-2 pb-3 flex items-center gap-3 border-b border-[var(--border)]/50 bg-[var(--background)]/80 backdrop-blur-sm sticky top-0 z-10">
          <button
            onClick={() => { setSelectedCategory(null); setCategoryCards([]); }}
            className="p-2.5 -ml-1 rounded-xl bg-[var(--secondary)]/60 hover:bg-[var(--secondary)] active:scale-95 transition-all"
            aria-label="Back to Discover"
          >
            <ArrowLeft size={20} className="text-[var(--foreground)]" />
          </button>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="text-2xl flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--secondary)]/60">
              {selectedCategory.emoji}
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold truncate">{selectedCategory.display_name}</h2>
              <p className="text-xs text-muted-foreground line-clamp-1">{selectedCategory.description}</p>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="flex-1 overflow-y-auto px-4 pb-20">
          {categoryLoading ? (
            <FeedSkeleton />
          ) : categoryCards.length > 0 ? (
            HORIZONTAL_SCROLL_CATEGORIES.has(selectedCategory.slug) ? (
              /* Horizontal scroll carousel for share cards & memes */
              <div className="relative -mx-4">
                <div className="flex overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {categoryCards.map((card, index) => (
                    <div
                      key={card.id}
                      className="flex-shrink-0 w-screen snap-center px-3 [&_.feed-card]:max-w-none [&_.feed-card]:aspect-auto"
                      style={{ maxWidth: "480px" }}
                    >
                      <div className="h-[65vh] max-h-[520px]">
                        <FeedCard
                          card={card}
                          index={index}
                          isLiked={likedCards.has(card.id)}
                          onLike={() => handleLike(card.id)}
                          onShare={() => handleShare(card.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Swipe hint — only shown when more than 1 card */}
                {categoryCards.length > 1 && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 2.5, duration: 0.6 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <motion.div
                      animate={{ x: [0, 6, 0] }}
                      transition={{ repeat: 3, duration: 0.8, ease: "easeInOut" }}
                      className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-sm"
                    >
                      <span className="text-[10px] text-white/80 font-medium">Swipe</span>
                      <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Standard vertical list for other categories */
              <div className="space-y-4">
                {categoryCards.map((card, index) => (
                  <div key={card.id} className="h-[400px]">
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
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
              <span className="text-5xl mb-4 flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--secondary)]/60">
                {selectedCategory.emoji}
              </span>
              <p className="text-lg font-semibold mb-1">No content yet</p>
              <p className="text-sm text-muted-foreground max-w-[260px]">
                Stay tuned! New {selectedCategory.display_name.toLowerCase()} content is coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 pt-2 pb-20">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] via-[var(--foreground)] to-[var(--muted-foreground)]">
          Discover
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Explore content by category</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[var(--secondary)]/60 border border-[var(--border)]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] text-[var(--foreground)] placeholder:text-muted-foreground/70 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)] transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Featured Section */}
      {featuredCards.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/20">
              <Star className="w-4 h-4 text-amber-400" />
            </span>
            <h2 className="text-base font-bold">Featured</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
            {featuredCards.map((card) => (
              <motion.div
                key={card.id}
                className="flex-shrink-0 w-[280px] h-36 rounded-2xl overflow-hidden relative cursor-pointer snap-center border border-white/10 shadow-lg shadow-black/20"
                whileTap={{ scale: 0.98 }}
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/50 to-[var(--accent)]/40" />
                {card.background_url && (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${card.background_url})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                )}
                <div className="relative h-full p-4 flex flex-col justify-end">
                  <span className="text-[10px] font-semibold text-amber-300/90 uppercase tracking-wider mb-1">Featured</span>
                  <h3 className="text-sm font-bold line-clamp-2 drop-shadow-sm">{card.title}</h3>
                  {card.subtitle && (
                    <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">{card.subtitle}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Section */}
      {trendingCards.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500/20">
              <TrendingUp className="w-4 h-4 text-orange-400" />
            </span>
            <h2 className="text-base font-bold">Trending</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
            {trendingCards.map((card, i) => (
              <motion.div
                key={card.id}
                className="flex-shrink-0 w-52 rounded-2xl overflow-hidden relative cursor-pointer glass-card p-4 snap-center border border-white/10"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-orange-400 tabular-nums">#{i + 1}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/25 text-orange-300 capitalize font-medium">
                    {card.type.replace("_", " ")}
                  </span>
                </div>
                <h3 className="text-sm font-semibold line-clamp-2 leading-snug">{card.title}</h3>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Categories Bento Grid */}
      <section className="pb-4">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-bold">Categories</h2>
          {filteredCategories.length > 0 && (
            <span className="text-xs text-muted-foreground font-medium">
              {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filteredCategories.map((category, index) => {
            const config = CATEGORY_CONFIG[category.slug] || { size: "small" };
            const isLarge = config.size === "large";
            const isMedium = config.size === "medium";

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.3), ease: "easeOut" }}
                onClick={() => handleCategoryClick(category)}
                className={`group relative overflow-hidden rounded-2xl text-left transition-all duration-200 active:scale-[0.98] border ${
                  isLarge ? "col-span-2 h-36" : isMedium ? "col-span-1 h-32" : "col-span-1 h-28"
                }`}
                style={{
                  background: `linear-gradient(145deg, ${category.gradient_from}25, ${category.gradient_to}35)`,
                  borderColor: `${category.color}30`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {/* Decorative background */}
                <div
                  className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-20 blur-sm transition-opacity group-active:opacity-30"
                  style={{ backgroundColor: category.color }}
                />
                <div
                  className="absolute right-2 top-2 w-8 h-8 rounded-full opacity-10"
                  style={{ backgroundColor: category.color }}
                />

                <div className="relative h-full p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className={`${isLarge ? "text-3xl" : "text-2xl"} drop-shadow-sm`}>{category.emoji}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/60 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-[var(--foreground)] ${isLarge ? "text-lg" : "text-sm"}`}>
                      {category.display_name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                      {category.description}
                    </p>
                    {category.card_count !== undefined && category.card_count > 0 && (
                      <span
                        className="text-[10px] mt-1.5 inline-block px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: `${category.color}25`, color: category.color }}
                      >
                        {category.card_count} items
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
