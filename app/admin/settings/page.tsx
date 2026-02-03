"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Database, Users, FileText, Smile, Zap, Settings as SettingsIcon, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface SystemStats {
    totalUsers: number;
    totalCards: number;
    totalMoods: number;
    activeCards: number;
    premiumUsers: number;
    totalPoints: number;
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [stats, setStats] = useState<SystemStats>({
        totalUsers: 0,
        totalCards: 0,
        totalMoods: 0,
        activeCards: 0,
        premiumUsers: 0,
        totalPoints: 0,
    });

    // App Settings
    const [defaultPoints, setDefaultPoints] = useState(10);
    const [dailyLoginBonus, setDailyLoginBonus] = useState(10);
    const [dailyLoginXP, setDailyLoginXP] = useState(20);
    const [streakBonus, setStreakBonus] = useState(5);
    const [defaultMembershipLevel, setDefaultMembershipLevel] = useState(1);
    const [weekendBonusPoints, setWeekendBonusPoints] = useState(50);
    const [weekendBonusXP, setWeekendBonusXP] = useState(25);
    const [sharePoints, setSharePoints] = useState(5);
    const [shareXP, setShareXP] = useState(10);

    // Streak Milestones
    const [streak3Points, setStreak3Points] = useState(25);
    const [streak7Points, setStreak7Points] = useState(50);
    const [streak14Points, setStreak14Points] = useState(100);
    const [streak30Points, setStreak30Points] = useState(250);
    const [perfectWeekPoints, setPerfectWeekPoints] = useState(200);

    const supabase = createClient();

    useEffect(() => {
        fetchSystemStats();
        loadSettings();
    }, []);

    const fetchSystemStats = async () => {
        try {
            // Fetch multiple stats in parallel
            const [usersResult, cardsResult, moodsResult, activeCardsResult, premiumUsersResult, pointsResult] = await Promise.all([
                supabase.from("profiles").select("*", { count: "exact", head: true }),
                supabase.from("cards").select("*", { count: "exact", head: true }),
                supabase.from("moods").select("*", { count: "exact", head: true }),
                supabase.from("cards").select("*", { count: "exact", head: true }).eq("is_active", true),
                supabase.from("profiles").select("*", { count: "exact", head: true }).eq("membership_level", 3),
                supabase.from("profiles").select("points"),
            ]);

            const totalPoints = pointsResult.data?.reduce((sum, user) => sum + (user.points || 0), 0) || 0;

            setStats({
                totalUsers: usersResult.count || 0,
                totalCards: cardsResult.count || 0,
                totalMoods: moodsResult.count || 0,
                activeCards: activeCardsResult.count || 0,
                premiumUsers: premiumUsersResult.count || 0,
                totalPoints,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadSettings = async () => {
        try {
            const response = await fetch("/api/settings");
            const data = await response.json();

            if (data.settings) {
                setDefaultPoints(data.settings.default_card_points || 10);
                setDailyLoginBonus(data.settings.daily_login_points || 10);
                setDailyLoginXP(data.settings.daily_login_xp || 20);
                setStreakBonus(data.settings.streak_bonus_points || 5);
                setDefaultMembershipLevel(data.settings.default_membership_level || 1);
                setWeekendBonusPoints(data.settings.weekend_bonus_points || 50);
                setWeekendBonusXP(data.settings.weekend_bonus_xp || 25);
                setSharePoints(data.settings.share_points || 5);
                setShareXP(data.settings.share_xp || 10);
                setStreak3Points(data.settings.streak_3_days_points || 25);
                setStreak7Points(data.settings.streak_7_days_points || 50);
                setStreak14Points(data.settings.streak_14_days_points || 100);
                setStreak30Points(data.settings.streak_30_days_points || 250);
                setPerfectWeekPoints(data.settings.perfect_week_points || 200);
            }
        } catch (error) {
            console.error("Error loading settings:", error);
            toast.error("Failed to load settings");
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    settings: {
                        default_card_points: defaultPoints,
                        daily_login_points: dailyLoginBonus,
                        daily_login_xp: dailyLoginXP,
                        streak_bonus_points: streakBonus,
                        default_membership_level: defaultMembershipLevel,
                        weekend_bonus_points: weekendBonusPoints,
                        weekend_bonus_xp: weekendBonusXP,
                        share_points: sharePoints,
                        share_xp: shareXP,
                        streak_3_days_points: streak3Points,
                        streak_7_days_points: streak7Points,
                        streak_14_days_points: streak14Points,
                        streak_30_days_points: streak30Points,
                        perfect_week_points: perfectWeekPoints,
                    },
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Settings saved successfully");
            } else {
                throw new Error(data.error || "Failed to save settings");
            }
        } catch (error: any) {
            console.error("Error saving settings:", error);
            toast.error(error.message || "Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const handleRefreshStats = () => {
        setLoading(true);
        fetchSystemStats();
        toast.success("Stats refreshed");
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-[var(--foreground)]">Settings</h2>
                <p className="text-[var(--muted-foreground)]">System configuration and statistics</p>
            </div>

            {/* System Statistics */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">System Statistics</h3>
                    <button
                        onClick={handleRefreshStats}
                        className="px-3 py-1.5 text-sm rounded-lg bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-[var(--foreground)] transition-colors"
                    >
                        Refresh
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card p-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                                <Users size={24} className="text-blue-400" />
                            </div>
                            <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                                {stats.totalUsers.toLocaleString()}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)] mb-1">Total Users</p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                                {stats.premiumUsers} Premium
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                                <FileText size={24} className="text-purple-400" />
                            </div>
                            <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                                {stats.totalCards.toLocaleString()}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)] mb-1">Content Cards</p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                                {stats.activeCards} published
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-3">
                                <Smile size={24} className="text-pink-400" />
                            </div>
                            <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                                {stats.totalMoods}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)] mb-1">Moods</p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                                Active moods
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center mb-3">
                                <Zap size={24} className="text-amber-400" />
                            </div>
                            <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                                {stats.totalPoints.toLocaleString()}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)] mb-1">Total Points</p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                                All users
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
                                <Database size={24} className="text-green-400" />
                            </div>
                            <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                                {stats.totalUsers > 0 ? Math.round(stats.totalPoints / stats.totalUsers).toLocaleString() : 0}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)] mb-1">Avg Points</p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                                Per user
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3">
                                <SettingsIcon size={24} className="text-cyan-400" />
                            </div>
                            <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                                {stats.totalUsers > 0 ? (stats.totalCards / stats.totalUsers).toFixed(1) : 0}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)] mb-1">Card Ratio</p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                                Per user
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* App Configuration */}
            <div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">App Configuration</h3>

                <div className="glass-card p-6 space-y-6">
                    {/* Gamification Settings */}
                    <div>
                        <h4 className="text-lg font-medium text-[var(--foreground)] mb-4 flex items-center gap-2">
                            <Zap size={18} className="text-[var(--primary)]" />
                            Gamification Settings
                        </h4>

                        <div className="space-y-6">
                            {/* Daily Rewards */}
                            <div>
                                <h5 className="font-semibold text-[var(--foreground)] mb-3">Daily Login Rewards</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Daily Login Points
                                        </label>
                                        <input
                                            type="number"
                                            value={dailyLoginBonus}
                                            onChange={(e) => setDailyLoginBonus(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                            Points for logging in each day
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Daily Login XP
                                        </label>
                                        <input
                                            type="number"
                                            value={dailyLoginXP}
                                            onChange={(e) => setDailyLoginXP(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                            XP for logging in each day
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Weekend Bonus */}
                            <div>
                                <h5 className="font-semibold text-[var(--foreground)] mb-3">Weekend Bonus</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Weekend Bonus Points
                                        </label>
                                        <input
                                            type="number"
                                            value={weekendBonusPoints}
                                            onChange={(e) => setWeekendBonusPoints(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                            Bonus points for weekend login
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Weekend Bonus XP
                                        </label>
                                        <input
                                            type="number"
                                            value={weekendBonusXP}
                                            onChange={(e) => setWeekendBonusXP(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                            Bonus XP for weekend login
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Share Rewards */}
                            <div>
                                <h5 className="font-semibold text-[var(--foreground)] mb-3">Share Rewards</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Share Points
                                        </label>
                                        <input
                                            type="number"
                                            value={sharePoints}
                                            onChange={(e) => setSharePoints(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                            Points for sharing content
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Share XP
                                        </label>
                                        <input
                                            type="number"
                                            value={shareXP}
                                            onChange={(e) => setShareXP(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                            XP for sharing content
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Streak Milestones */}
                            <div>
                                <h5 className="font-semibold text-[var(--foreground)] mb-3">Streak Milestones (Points Only)</h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            3-Day Streak
                                        </label>
                                        <input
                                            type="number"
                                            value={streak3Points}
                                            onChange={(e) => setStreak3Points(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            7-Day Streak
                                        </label>
                                        <input
                                            type="number"
                                            value={streak7Points}
                                            onChange={(e) => setStreak7Points(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            14-Day Streak
                                        </label>
                                        <input
                                            type="number"
                                            value={streak14Points}
                                            onChange={(e) => setStreak14Points(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            30-Day Streak
                                        </label>
                                        <input
                                            type="number"
                                            value={streak30Points}
                                            onChange={(e) => setStreak30Points(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Perfect Week */}
                            <div>
                                <h5 className="font-semibold text-[var(--foreground)] mb-3">Perfect Week Bonus</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Perfect Week Points
                                        </label>
                                        <input
                                            type="number"
                                            value={perfectWeekPoints}
                                            onChange={(e) => setPerfectWeekPoints(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                            Bonus for logging in 7 days straight
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* General Settings */}
                            <div>
                                <h5 className="font-semibold text-[var(--foreground)] mb-3">General Settings</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Default Card Points
                                        </label>
                                        <input
                                            type="number"
                                            value={defaultPoints}
                                            onChange={(e) => setDefaultPoints(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                            Points earned per content card interaction
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Default Membership Level
                                        </label>
                                        <select
                                            value={defaultMembershipLevel}
                                            onChange={(e) => setDefaultMembershipLevel(parseInt(e.target.value))}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        >
                                            <option value={1}>Free (1)</option>
                                            <option value={2}>Plus (2)</option>
                                            <option value={3}>Premium (3)</option>
                                        </select>
                                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                            New user membership level
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-[var(--border)]">
                        <button
                            onClick={handleSaveSettings}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Settings
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Database Info */}
            <div className="glass-card p-6">
                <h4 className="text-lg font-medium text-[var(--foreground)] mb-4 flex items-center gap-2">
                    <Database size={18} className="text-[var(--primary)]" />
                    Database Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between p-3 rounded-lg bg-[var(--secondary)]/30">
                        <span className="text-[var(--muted-foreground)]">Supabase URL:</span>
                        <span className="text-[var(--foreground)] font-mono text-xs">
                            {process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...
                        </span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-[var(--secondary)]/30">
                        <span className="text-[var(--muted-foreground)]">Environment:</span>
                        <span className="text-[var(--foreground)] font-medium">
                            {process.env.NODE_ENV || "development"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
