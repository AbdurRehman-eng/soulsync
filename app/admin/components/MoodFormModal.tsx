"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Mood } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

interface MoodFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    mood?: Mood | null;
    onSuccess: () => void;
}

export function MoodFormModal({ isOpen, onClose, mood, onSuccess }: MoodFormModalProps) {
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("");
    const [color, setColor] = useState("#fbbf24");
    const [description, setDescription] = useState("");
    const [sortOrder, setSortOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        if (mood) {
            setName(mood.name);
            setEmoji(mood.emoji || "");
            setColor(mood.color || "#fbbf24");
            setDescription(mood.description || "");
            setSortOrder(mood.sort_order);
            setIsActive(mood.is_active ?? true);
        } else {
            // Reset form for new mood
            setName("");
            setEmoji("");
            setColor("#fbbf24");
            setDescription("");
            setSortOrder(0);
            setIsActive(true);
        }
    }, [mood, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !emoji.trim()) {
            toast.error("Name and emoji are required");
            return;
        }

        setLoading(true);

        try {
            if (mood) {
                // Update existing mood
                const { error } = await supabase
                    .from("moods")
                    .update({
                        name: name.trim(),
                        emoji: emoji.trim(),
                        color,
                        description: description.trim(),
                        sort_order: sortOrder,
                        is_active: isActive,
                    })
                    .eq("id", mood.id);

                if (error) throw error;
                toast.success("Mood updated successfully");
            } else {
                // Create new mood
                const { error } = await supabase.from("moods").insert({
                    name: name.trim(),
                    emoji: emoji.trim(),
                    color,
                    description: description.trim(),
                    sort_order: sortOrder,
                    is_active: isActive,
                });

                if (error) throw error;
                toast.success("Mood created successfully");
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error saving mood:", error);
            toast.error(error.message || "Failed to save mood");
        } finally {
            setLoading(false);
        }
    };

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
                                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                                    {mood ? "Edit Mood" : "Create New Mood"}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Happy, Sad, Grateful"
                                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        required
                                    />
                                </div>

                                {/* Emoji */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                        Emoji *
                                    </label>
                                    <input
                                        type="text"
                                        value={emoji}
                                        onChange={(e) => setEmoji(e.target.value)}
                                        placeholder="😊"
                                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-2xl"
                                        maxLength={4}
                                        required
                                    />
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                        Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="w-16 h-10 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            placeholder="#fbbf24"
                                            className="flex-1 px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                        Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe this mood..."
                                        rows={3}
                                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
                                    />
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                    />
                                </div>

                                {/* Active Status */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium text-[var(--foreground)]">
                                        Active (visible to users)
                                    </label>
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
                                            mood ? "Update" : "Create"
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
