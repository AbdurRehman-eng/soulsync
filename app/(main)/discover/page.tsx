"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Star, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FeedCard } from "@/components/cards/FeedCard";
import { FeedSkeleton } from "@/components/feed/FeedSkeleton";
import type { Card, ContentCategory } from "@/types";

// Categories that have their own dedicated pages (to avoid loading heavy content inline)
const DEDICATED_PAGES: Record<string, string> = {
  arena: "/arena",
};

// Categories that render as horizontal scroll carousels instead of vertical lists
const HORIZONTAL_SCROLL_CATEGORIES = new Set(["share-cards", "joy-moments"]);

// Default categories with bento grid sizing
const CATEGORY_CONFIG: Record<string, { size: "large" | "medium" | "small"; row?: number }> = {
  "arena": { size: "large" },
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
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Discover</h1>
          <p className="text-sm text-muted-foreground">Explore content by category</p>
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
        <div className="px-4 pt-2 pb-3 flex items-center gap-3">
          <button
            onClick={() => { setSelectedCategory(null); setCategoryCards([]); }}
            className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedCategory.emoji}</span>
            <div>
              <h2 className="text-lg font-bold">{selectedCategory.display_name}</h2>
              <p className="text-xs text-muted-foreground">{selectedCategory.description}</p>
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
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
                {categoryCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="flex-shrink-0 w-[85vw] max-w-[360px] h-[420px] snap-center"
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
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <span className="text-4xl mb-3">{selectedCategory.emoji}</span>
              <p className="text-lg font-semibold mb-1">No content yet</p>
              <p className="text-sm text-muted-foreground">
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
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Discover</h1>
        <p className="text-sm text-muted-foreground">Explore content by category</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--secondary)]/50 border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Featured Section */}
      {featuredCards.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-400" />
            <h2 className="text-base font-bold">Featured</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {featuredCards.map((card) => (
              <motion.div
                key={card.id}
                className="flex-shrink-0 w-56 h-32 rounded-2xl overflow-hidden relative cursor-pointer"
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40" />
                {card.background_url && (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${card.background_url})` }}
                  >
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                )}
                <div className="relative h-full p-3 flex flex-col justify-end">
                  <span className="text-[10px] font-medium text-accent/80 uppercase tracking-wider">Featured</span>
                  <h3 className="text-sm font-bold line-clamp-2">{card.title}</h3>
                  {card.subtitle && (
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{card.subtitle}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Section */}
      {trendingCards.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <h2 className="text-base font-bold">Trending</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {trendingCards.map((card, i) => (
              <motion.div
                key={card.id}
                className="flex-shrink-0 w-48 rounded-xl overflow-hidden relative cursor-pointer glass-card p-3"
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-orange-400">#{i + 1}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 capitalize">
                    {card.type.replace("_", " ")}
                  </span>
                </div>
                <h3 className="text-sm font-semibold line-clamp-2">{card.title}</h3>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Categories Bento Grid */}
      <section>
        <h2 className="text-base font-bold mb-3">Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {filteredCategories.map((category, index) => {
            const config = CATEGORY_CONFIG[category.slug] || { size: "small" };
            const isLarge = config.size === "large";
            const isMedium = config.size === "medium";

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCategoryClick(category)}
                className={`relative overflow-hidden rounded-2xl text-left transition-all active:scale-[0.97] ${
                  isLarge ? "col-span-2 h-32" : isMedium ? "col-span-1 h-36" : "col-span-1 h-28"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${category.gradient_from}20, ${category.gradient_to}30)`,
                  border: `1px solid ${category.color}20`,
                }}
              >
                {/* Decorative background circle */}
                <div
                  className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10"
                  style={{ backgroundColor: category.color }}
                />

                <div className="relative h-full p-4 flex flex-col justify-between">
                  <div>
                    <span className={`${isLarge ? "text-3xl" : "text-2xl"}`}>{category.emoji}</span>
                  </div>
                  <div>
                    <h3 className={`font-bold ${isLarge ? "text-lg" : "text-sm"}`}>
                      {category.display_name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                      {category.description}
                    </p>
                    {category.card_count !== undefined && category.card_count > 0 && (
                      <span className="text-[10px] mt-1 inline-block px-1.5 py-0.5 rounded-full bg-white/10">
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
