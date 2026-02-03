"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BarChart3, User, FileText, Smile, Loader2, ListTodo, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DashboardStats {
    totalUsers: number;
    activeCards: number;
    totalMoods: number;
    totalInteractions: number;
    totalTasks: number;
    totalLevels: number;
}

interface RecentActivity {
    id: string;
    type: "user" | "card" | "mood";
    message: string;
    timestamp: string;
}

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        activeCards: 0,
        totalMoods: 0,
        totalInteractions: 0,
        totalTasks: 0,
        totalLevels: 0,
    });
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch stats in parallel
            const [usersResult, cardsResult, moodsResult, interactionsResult, tasksResult, levelsResult, recentUsersResult] = await Promise.all([
                supabase.from("profiles").select("*", { count: "exact", head: true }),
                supabase.from("cards").select("*", { count: "exact", head: true }).eq("is_active", true),
                supabase.from("moods").select("*", { count: "exact", head: true }),
                supabase.from("interactions").select("*", { count: "exact", head: true }),
                supabase.from("tasks").select("*", { count: "exact", head: true }),
                supabase.from("levels").select("*", { count: "exact", head: true }),
                supabase.from("profiles").select("username, created_at").order("created_at", { ascending: false }).limit(5),
            ]);

            setStats({
                totalUsers: usersResult.count || 0,
                activeCards: cardsResult.count || 0,
                totalMoods: moodsResult.count || 0,
                totalInteractions: interactionsResult.count || 0,
                totalTasks: tasksResult.count || 0,
                totalLevels: levelsResult.count || 0,
            });

            // Format recent activity
            const activities: RecentActivity[] = (recentUsersResult.data || []).map((user) => ({
                id: user.created_at,
                type: "user" as const,
                message: `New user registered: @${user.username || "Anonymous"}`,
                timestamp: user.created_at,
            }));

            setRecentActivity(activities);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (action: string) => {
        switch (action) {
            case "mood":
                router.push("/admin/moods");
                break;
            case "content":
                router.push("/admin/cards");
                break;
            case "tasks":
                router.push("/admin/tasks");
                break;
            case "levels":
                router.push("/admin/levels");
                break;
            case "users":
                router.push("/admin/users");
                break;
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
            </div>
        );
    }

    const engagementRate = stats.totalUsers > 0
        ? Math.round((stats.totalInteractions / stats.totalUsers) * 100)
        : 0;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-[var(--foreground)]">Dashboard</h2>
                <p className="text-[var(--muted-foreground)]">Welcome back, Admin.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    change={`${stats.totalUsers} total`}
                    icon={User}
                    color="text-blue-400"
                />
                <StatCard
                    title="Active Content"
                    value={stats.activeCards.toString()}
                    change={`${stats.activeCards} published`}
                    icon={FileText}
                    color="text-purple-400"
                />
                <StatCard
                    title="Total Moods"
                    value={stats.totalMoods.toString()}
                    change={`${stats.totalMoods} available`}
                    icon={Smile}
                    color="text-pink-400"
                />
                <StatCard
                    title="Total Tasks"
                    value={stats.totalTasks.toString()}
                    change={`${stats.totalTasks} tasks`}
                    icon={ListTodo}
                    color="text-green-400"
                />
                <StatCard
                    title="Levels"
                    value={stats.totalLevels.toString()}
                    change={`${stats.totalLevels} ranks`}
                    icon={Trophy}
                    color="text-amber-400"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <p className="text-sm text-[var(--muted-foreground)] text-center py-8">
                                No recent activity
                            </p>
                        ) : (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--secondary)]/50">
                                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">
                                        <User size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[var(--foreground)]">{activity.message}</p>
                                        <p className="text-xs text-[var(--muted-foreground)]">
                                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleQuickAction("mood")}
                            className="p-4 rounded-xl bg-[var(--secondary)] hover:bg-[var(--primary)]/20 transition-all border border-[var(--border)] text-left group"
                        >
                            <Smile className="w-6 h-6 mb-2 text-[var(--muted-foreground)] group-hover:text-[var(--accent)]" />
                            <span className="text-sm font-medium block text-[var(--foreground)]">Manage Moods</span>
                        </button>
                        <button
                            onClick={() => handleQuickAction("content")}
                            className="p-4 rounded-xl bg-[var(--secondary)] hover:bg-[var(--primary)]/20 transition-all border border-[var(--border)] text-left group"
                        >
                            <FileText className="w-6 h-6 mb-2 text-[var(--muted-foreground)] group-hover:text-[var(--accent)]" />
                            <span className="text-sm font-medium block text-[var(--foreground)]">Manage Content</span>
                        </button>
                        <button
                            onClick={() => handleQuickAction("tasks")}
                            className="p-4 rounded-xl bg-[var(--secondary)] hover:bg-[var(--primary)]/20 transition-all border border-[var(--border)] text-left group"
                        >
                            <ListTodo className="w-6 h-6 mb-2 text-[var(--muted-foreground)] group-hover:text-[var(--accent)]" />
                            <span className="text-sm font-medium block text-[var(--foreground)]">Manage Tasks</span>
                        </button>
                        <button
                            onClick={() => handleQuickAction("levels")}
                            className="p-4 rounded-xl bg-[var(--secondary)] hover:bg-[var(--primary)]/20 transition-all border border-[var(--border)] text-left group"
                        >
                            <Trophy className="w-6 h-6 mb-2 text-[var(--muted-foreground)] group-hover:text-[var(--accent)]" />
                            <span className="text-sm font-medium block text-[var(--foreground)]">Manage Levels</span>
                        </button>
                        <button
                            onClick={() => handleQuickAction("users")}
                            className="p-4 rounded-xl bg-[var(--secondary)] hover:bg-[var(--primary)]/20 transition-all border border-[var(--border)] text-left group"
                        >
                            <User className="w-6 h-6 mb-2 text-[var(--muted-foreground)] group-hover:text-[var(--accent)]" />
                            <span className="text-sm font-medium block text-[var(--foreground)]">Manage Users</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
    return (
        <div className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={64} />
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-[var(--secondary)] flex items-center justify-center ${color} border border-[var(--border)]`}>
                    <Icon size={24} />
                </div>
                <span className="text-sm font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{change}</span>
            </div>
            <h3 className="text-2xl font-bold text-[var(--foreground)]">{value}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">{title}</p>
        </div>
    );
}
