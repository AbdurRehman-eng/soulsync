"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Profile } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: Profile | null;
    onSuccess: () => void;
}

export function UserEditModal({ isOpen, onClose, user, onSuccess }: UserEditModalProps) {
    const [displayName, setDisplayName] = useState("");
    const [membershipLevel, setMembershipLevel] = useState(1);
    const [points, setPoints] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        if (user) {
            setDisplayName(user.display_name || "");
            setMembershipLevel(user.membership_level);
            setPoints(user.points);
            setCurrentStreak(user.current_streak);
            setLongestStreak(user.longest_streak);
            setIsAdmin(user.is_admin);
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        setLoading(true);

        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    display_name: displayName.trim() || null,
                    membership_level: membershipLevel,
                    points,
                    current_streak: currentStreak,
                    longest_streak: longestStreak,
                    is_admin: isAdmin,
                })
                .eq("id", user.id);

            if (error) throw error;

            toast.success("User updated successfully");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error updating user:", error);
            toast.error(error.message || "Failed to update user");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card w-full max-w-md p-6 relative"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--foreground)]">Edit User</h2>
                                    <p className="text-sm text-[var(--muted-foreground)]">@{user.username}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Display Name */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Enter display name"
                                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                    />
                                </div>

                                {/* Membership Level */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                        Membership Level
                                    </label>
                                    <select
                                        value={membershipLevel}
                                        onChange={(e) => setMembershipLevel(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                    >
                                        <option value={1}>Free (1)</option>
                                        <option value={2}>Plus (2)</option>
                                        <option value={3}>Premium (3)</option>
                                    </select>
                                </div>

                                {/* Points */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                        Points
                                    </label>
                                    <input
                                        type="number"
                                        value={points}
                                        onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                    />
                                </div>

                                {/* Streaks */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Current Streak
                                        </label>
                                        <input
                                            type="number"
                                            value={currentStreak}
                                            onChange={(e) => setCurrentStreak(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Longest Streak
                                        </label>
                                        <input
                                            type="number"
                                            value={longestStreak}
                                            onChange={(e) => setLongestStreak(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                    </div>
                                </div>

                                {/* Admin Status */}
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--secondary)]/30 border border-[var(--border)]">
                                    <input
                                        type="checkbox"
                                        id="isAdmin"
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(e.target.checked)}
                                        className="w-4 h-4 rounded border-[var(--border)] text-red-500 focus:ring-2 focus:ring-red-500"
                                    />
                                    <label htmlFor="isAdmin" className="text-sm font-medium text-[var(--foreground)] flex-1">
                                        Administrator Access
                                    </label>
                                </div>

                                {/* User Info */}
                                <div className="bg-[var(--secondary)]/20 p-3 rounded-lg text-xs text-[var(--muted-foreground)] space-y-1">
                                    <div className="flex justify-between">
                                        <span>User ID:</span>
                                        <span className="font-mono">{user.id.substring(0, 8)}...</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Joined:</span>
                                        <span>{new Date(user.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {user.last_login && (
                                        <div className="flex justify-between">
                                            <span>Last Login:</span>
                                            <span>{new Date(user.last_login).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-[var(--foreground)] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
