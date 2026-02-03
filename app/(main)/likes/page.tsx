"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Search } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { FeedCard } from "@/components/cards/FeedCard";
import type { Card } from "@/types";

export default function LikesPage() {
  const { isAuthenticated } = useUserStore();
  const [likedCards, setLikedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchLikedCards();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchLikedCards = async () => {
    try {
      const response = await fetch("/api/interactions?type=like");
      if (response.ok) {
        const data = await response.json();
        console.log(`[Likes Page] Loaded ${data.cards?.length || 0} liked cards`);
        setLikedCards(data.cards || []);
      } else {
        console.error("[Likes Page] Failed to fetch:", response.status);
      }
    } catch (error) {
      console.error("[Likes Page] Failed to fetch liked cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = likedCards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <Heart className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Sign in to view likes</h2>
        <p className="text-muted-foreground">
          Your liked content will be saved here
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Liked Content</h1>
        <p className="text-muted-foreground">
          {likedCards.length} items saved
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search liked content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <Heart className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchQuery
              ? "No matching content found"
              : "No liked content yet"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 pb-4">
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="h-[300px]"
            >
              <FeedCard
                card={card}
                index={index}
                isLiked={true}
                onLike={() => {
                  // Remove from liked cards when unliked
                  console.log(`[Likes Page] Unliking card: ${card.id}`);
                  setLikedCards((prev) => prev.filter((c) => c.id !== card.id));
                  
                  // Call API to persist the unlike
                  fetch("/api/interactions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ card_id: card.id, type: "like" }),
                  }).catch(console.error);
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
