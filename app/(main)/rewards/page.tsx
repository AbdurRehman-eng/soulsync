"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Zap,
  TrendingUp,
  Gift,
  Target,
  Calendar,
  Share2,
  Award,
} from "lucide-react";
import { XPBar } from "@/components/gamification/XPBar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { AchievementCard } from "@/components/gamification/AchievementCard";
import { BadgeCard } from "@/components/gamification/BadgeCard";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import type {
  UserGamificationStats,
  AchievementProgress,
  UserBadge,
  XPTransaction,
  PointsTransaction,
} from "@/types";
import { format } from "date-fns";

export default function RewardsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "achievements" | "badges" | "history"
  >("overview");

  useEffect(() => {
    fetchGamificationStats();
  }, []);

  const fetchGamificationStats = async () => {
    try {
      const response = await fetch("/api/gamification");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  const { profile, currentLevel, nextLevel, xpProgress, achievements, badges } =
    stats || {};

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-gradient-from to-gradient-to backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Rewards & Progress
          </h1>
          <p className="text-text-secondary">
            Track your achievements, badges, and rewards
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            className="glass-card p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-text-secondary">Total Points</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {profile?.points?.toLocaleString() || 0}
            </p>
          </motion.div>

          <motion.div
            className="glass-card p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-text-secondary">Total XP</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {profile?.xp?.toLocaleString() || 0}
            </p>
          </motion.div>

          <motion.div
            className="glass-card p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-text-secondary">Achievements</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {stats?.stats?.completedAchievements || 0}/
              {stats?.stats?.totalAchievements || 0}
            </p>
          </motion.div>

          <motion.div
            className="glass-card p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-5 h-5 text-pink-400" />
              <span className="text-sm text-text-secondary">Total Shares</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {profile?.total_shares || 0}
            </p>
          </motion.div>
        </div>

        {/* Level Progress */}
        <motion.div
          className="glass-card p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-6 mb-4">
            <LevelBadge
              level={profile?.level || 1}
              levelName={currentLevel?.name || "Seeker"}
              icon={currentLevel?.badge_icon}
              size="lg"
              showName={false}
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Level Progress
              </h3>
              {xpProgress && (
                <XPBar
                  currentXP={xpProgress.current}
                  requiredXP={xpProgress.required}
                  currentLevel={profile?.level || 1}
                  levelName={currentLevel?.name || "Seeker"}
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Streak Card */}
        <motion.div
          className="glass-card p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-text-primary">
              Current Streak
            </h3>
            <Calendar className="w-6 h-6 text-accent" />
          </div>
          <div className="flex items-center gap-6">
            <StreakBadge
              streak={profile?.current_streak || 0}
            />
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary">Current</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {profile?.current_streak || 0} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Longest</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {profile?.longest_streak || 0} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: "overview", label: "Overview", icon: Target },
            { key: "achievements", label: "Achievements", icon: Trophy },
            { key: "badges", label: "Badges", icon: Award },
            { key: "history", label: "History", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-white"
                  : "bg-white/5 text-text-secondary hover:bg-white/10"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Recent Achievements */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  Recent Achievements
                </h3>
                <div className="grid gap-4">
                  {achievements
                    ?.filter((a: any) => a.completed)
                    .slice(0, 3)
                    .map((achievement: any, i: number) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        index={i}
                      />
                    ))}
                </div>
              </div>

              {/* Recent Badges */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  Latest Badges
                </h3>
                <div className="flex flex-wrap gap-4">
                  {badges?.slice(0, 6).map((badge: any, i: number) => (
                    <BadgeCard key={badge.id} userBadge={badge} index={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "achievements" && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4"
            >
              {achievements?.map((achievement: any, i: number) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  index={i}
                />
              ))}
            </motion.div>
          )}

          {activeTab === "badges" && (
            <motion.div
              key="badges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6 rounded-xl"
            >
              <h3 className="text-lg font-bold text-text-primary mb-4">
                Your Badge Collection ({badges?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-6">
                {badges?.map((badge: any, i: number) => (
                  <BadgeCard key={badge.id} userBadge={badge} index={i} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* XP History */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  Recent XP Gains
                </h3>
                <div className="space-y-2">
                  {stats?.recentXPGains?.map((transaction: XPTransaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {transaction.description || transaction.source}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {format(
                            new Date(transaction.created_at),
                            "MMM d, yyyy h:mm a"
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-purple-400">
                          +{transaction.amount} XP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Points History */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  Recent Point Gains
                </h3>
                <div className="space-y-2">
                  {stats?.recentPointsGains?.map(
                    (transaction: PointsTransaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            {transaction.description || transaction.source}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {format(
                              new Date(transaction.created_at),
                              "MMM d, yyyy h:mm a"
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-yellow-400">
                            +{transaction.amount} Points
                          </p>
                          {transaction.multiplier > 1 && (
                            <p className="text-xs text-orange-400">
                              {transaction.multiplier}x
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
