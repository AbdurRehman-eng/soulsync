"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Crown, Medal, User } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  display_name: string;
  avatar_url: string | null;
  points: number;
  streak: number;
  level?: number;
  xp?: number;
}
export default function RanksPage() {
  const { profile, isAuthenticated } = useUserStore();
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "allTime">(
    "allTime"
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/leaderboard?type=${activeTab}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
        setUserRank(data.userRank);
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">
            {rank}
          </span>
        );
    }
  };

  const formatPoints = (points: number) => {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points.toString();
  };

  return (
    <div className="px-4">
      {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Compete with others and climb the ranks
          </p>
        </div>

        {/* User's rank card (if logged in) */}
        {isAuthenticated && profile && userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mb-4 border-2 border-primary"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                  {userRank.avatar_url ? (
                    <img
                      src={userRank.avatar_url}
                      alt={userRank.display_name || "You"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">
                    {userRank.display_name || userRank.username || "You"}
                  </p>
                  <p className="text-sm text-muted-foreground">Your Position</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-primary">#{userRank.rank}</p>
                <div className="flex items-center justify-end gap-2 text-sm">
                  <span className="text-accent whitespace-nowrap">
                    {formatPoints(userRank.points)} pts
                  </span>
                  <span className="flex items-center gap-1 text-orange-500">
                    <Flame className="w-3 h-3" />
                    {userRank.streak}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["weekly", "monthly", "allTime"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "glass-card hover:bg-muted/50"
              }`}
            >
              {tab === "allTime"
                ? "All Time"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading / empty / content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="flex items-center justify-center text-muted-foreground py-12">
            <p>No rankings available yet</p>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            <div className="flex justify-center items-end gap-4 mb-4">
              {leaderboard.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-400/20 flex items-center justify-center mb-2 border-2 border-gray-400">
                    {leaderboard[1].avatar_url ? (
                      <img
                        src={leaderboard[1].avatar_url}
                        alt={leaderboard[1].display_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm font-medium truncate max-w-[80px]">
                    {leaderboard[1].display_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPoints(leaderboard[1].points)}
                  </p>
                  <div className="w-20 h-16 bg-gray-400/20 rounded-t-lg mt-2 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">2</span>
                  </div>
                </motion.div>
              )}

              {leaderboard.length >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center"
                >
                  <Crown className="w-8 h-8 text-yellow-500 mb-1" />
                  <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mb-2 border-2 border-yellow-500">
                    {leaderboard[0].avatar_url ? (
                      <img
                        src={leaderboard[0].avatar_url}
                        alt={leaderboard[0].display_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium truncate max-w-[80px]">
                    {leaderboard[0].display_name}
                  </p>
                  <p className="text-xs text-accent">
                    {formatPoints(leaderboard[0].points)}
                  </p>
                  <div className="w-24 h-20 bg-yellow-500/20 rounded-t-lg mt-2 flex items-center justify-center">
                    <span className="text-3xl font-bold text-yellow-500">1</span>
                  </div>
                </motion.div>
              )}

              {leaderboard.length >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-amber-600/20 flex items-center justify-center mb-2 border-2 border-amber-600">
                    {leaderboard[2].avatar_url ? (
                      <img
                        src={leaderboard[2].avatar_url}
                        alt={leaderboard[2].display_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-amber-600" />
                    )}
                  </div>
                  <p className="text-sm font-medium truncate max-w-[80px]">
                    {leaderboard[2].display_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPoints(leaderboard[2].points)}
                  </p>
                  <div className="w-20 h-12 bg-amber-600/20 rounded-t-lg mt-2 flex items-center justify-center">
                    <span className="text-2xl font-bold text-amber-600">3</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Rest of leaderboard */}
            <div className="space-y-2">
              {leaderboard.slice(3).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-3 flex items-center gap-3"
                >
                  {getRankIcon(entry.rank)}
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {entry.avatar_url ? (
                      <img
                        src={entry.avatar_url}
                        alt={entry.display_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{entry.display_name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{entry.username}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-accent">
                      {formatPoints(entry.points)}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-xs text-orange-500">
                      <Flame className="w-3 h-3" />
                      {entry.streak}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
    </div>
  );
}
