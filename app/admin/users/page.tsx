"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { Search, Edit2, Trash2, Loader2, Shield, Crown, User as UserIcon, TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";
import { UserEditModal } from "../components/UserEditModal";

export default function UsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [membershipFilter, setMembershipFilter] = useState<number | "all">("all");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: Profile) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDelete = async (id: string, username: string | null) => {
        if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) return;

        try {
            const { error } = await supabase.from("profiles").delete().eq("id", id);
            if (error) throw error;
            toast.success("User deleted");
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const handleModalClose = () => {
        setShowEditModal(false);
        setSelectedUser(null);
    };

    const handleSuccess = () => {
        fetchUsers();
    };

    const filteredUsers = users.filter((user) => {
        const matchesMembership = membershipFilter === "all" || user.membership_level === membershipFilter;
        const matchesSearch =
            user.username?.toLowerCase().includes(search.toLowerCase()) ||
            user.display_name?.toLowerCase().includes(search.toLowerCase()) ||
            user.id.toLowerCase().includes(search.toLowerCase());
        return matchesMembership && matchesSearch;
    });

    const getMembershipBadge = (level: number) => {
        switch (level) {
            case 1:
                return <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-500/20 text-gray-400">Free</span>;
            case 2:
                return <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-400">Plus</span>;
            case 3:
                return <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-500/20 text-purple-400">Premium</span>;
            default:
                return <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-500/20 text-gray-400">Unknown</span>;
        }
    };

    const getStats = () => {
        return {
            total: users.length,
            admins: users.filter(u => u.is_admin).length,
            premium: users.filter(u => u.membership_level === 3).length,
            plus: users.filter(u => u.membership_level === 2).length,
        };
    };

    const stats = getStats();

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
                <h2 className="text-3xl font-bold text-[var(--foreground)]">Users</h2>
                <p className="text-[var(--muted-foreground)]">Manage user accounts and permissions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/20 flex items-center justify-center">
                            <UserIcon size={20} className="text-[var(--primary)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">Total Users</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <Shield size={20} className="text-red-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.admins}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">Admins</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <Crown size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.premium}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">Premium</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <TrendingUp size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.plus}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">Plus</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                    {["all", 1, 2, 3].map((level) => (
                        <button
                            key={level}
                            onClick={() => setMembershipFilter(level as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                                membershipFilter === level
                                    ? "bg-[var(--primary)] text-white"
                                    : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                            }`}
                        >
                            {level === "all" ? "All" : level === 1 ? "Free" : level === 2 ? "Plus" : "Premium"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-[var(--secondary)]/50 text-[var(--muted-foreground)] border-b border-[var(--border)]">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Membership</th>
                                <th className="px-6 py-4 font-medium">Points</th>
                                <th className="px-6 py-4 font-medium">Streak</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-[var(--muted-foreground)]">
                                        No users found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-[var(--secondary)]/30 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-[var(--foreground)]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-bold">
                                                    {user.display_name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="line-clamp-1">{user.display_name || user.username || "Anonymous"}</span>
                                                        {user.is_admin && (
                                                            <span title="Admin">
                                                                <Shield size={14} className="text-red-400" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-[var(--muted-foreground)] font-normal">
                                                        @{user.username || "no-username"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getMembershipBadge(user.membership_level)}</td>
                                        <td className="px-6 py-4 text-[var(--foreground)]">
                                            <span className="font-semibold">{user.points.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <span className="text-[var(--foreground)] font-medium">{user.current_streak}</span>
                                                <span className="text-[var(--muted-foreground)] text-xs">days</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.last_login ? (
                                                <span className="text-xs text-green-400">Active</span>
                                            ) : (
                                                <span className="text-xs text-gray-400">New</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-[var(--muted-foreground)] whitespace-nowrap">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-1.5 hover:bg-[var(--secondary)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id, user.username)}
                                                    className="p-1.5 hover:bg-[var(--destructive)]/10 rounded-lg text-[var(--destructive)] transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <UserEditModal
                isOpen={showEditModal}
                onClose={handleModalClose}
                user={selectedUser}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
