"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Shuffle, Plus, Trash2, GripVertical, Loader2, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import type { FeedPattern, FeedSlotType } from "@/types";

const AVAILABLE_SLOT_TYPES: { value: FeedSlotType; label: string; emoji: string }[] = [
    { value: "game", label: "Game", emoji: "🎮" },
    { value: "inspiration", label: "Inspiration", emoji: "✨" },
    { value: "article", label: "Article", emoji: "📖" },
    { value: "riddle", label: "Riddle", emoji: "🧩" },
    { value: "motivation", label: "Motivation", emoji: "💪" },
    { value: "visual", label: "Visual", emoji: "🧘" },
    { value: "joke", label: "Joke", emoji: "😊" },
    { value: "milestone", label: "Milestone", emoji: "🏆" },
    { value: "thought_provoking", label: "Thought Provoking", emoji: "💭" },
    { value: "fact", label: "Fact", emoji: "💎" },
    { value: "meme", label: "Meme", emoji: "😄" },
];

export default function FeedPatternsPage() {
    const [patterns, setPatterns] = useState<FeedPattern[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPatternName, setNewPatternName] = useState("");
    const supabase = createClient();

    const fetchPatterns = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("feed_patterns")
                .select("*")
                .order("sort_order", { ascending: true });
            if (error) throw error;
            setPatterns(data || []);
        } catch (err) {
            console.error("Failed to fetch patterns:", err);
            toast.error("Failed to load feed patterns");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPatterns(); }, []);

    const handleSlotChange = (patternId: string, slotIndex: number, newType: FeedSlotType) => {
        setPatterns(prev => prev.map(p => {
            if (p.id !== patternId) return p;
            const newSlots = [...p.slots];
            newSlots[slotIndex] = newType;
            return { ...p, slots: newSlots };
        }));
    };

    const handleAddSlot = (patternId: string) => {
        setPatterns(prev => prev.map(p => {
            if (p.id !== patternId) return p;
            return { ...p, slots: [...p.slots, "inspiration" as FeedSlotType] };
        }));
    };

    const handleRemoveSlot = (patternId: string, slotIndex: number) => {
        setPatterns(prev => prev.map(p => {
            if (p.id !== patternId) return p;
            const newSlots = p.slots.filter((_, i) => i !== slotIndex);
            return { ...p, slots: newSlots };
        }));
    };

    const handleMoveSlot = (patternId: string, fromIndex: number, toIndex: number) => {
        if (toIndex < 0) return;
        setPatterns(prev => prev.map(p => {
            if (p.id !== patternId) return p;
            const newSlots = [...p.slots];
            if (toIndex >= newSlots.length) return p;
            const [moved] = newSlots.splice(fromIndex, 1);
            newSlots.splice(toIndex, 0, moved);
            return { ...p, slots: newSlots };
        }));
    };

    const handleSavePattern = async (pattern: FeedPattern) => {
        setSaving(pattern.id);
        try {
            const { error } = await supabase
                .from("feed_patterns")
                .update({ slots: pattern.slots })
                .eq("id", pattern.id);
            if (error) throw error;
            toast.success(`Pattern ${pattern.name} saved`);
        } catch (err) {
            console.error("Failed to save pattern:", err);
            toast.error("Failed to save");
        } finally {
            setSaving(null);
        }
    };

    const handleCreatePattern = async () => {
        if (!newPatternName.trim()) return;
        try {
            const slug = newPatternName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
            const defaultSlots: FeedSlotType[] = [
                "game", "inspiration", "article", "riddle", "motivation",
                "visual", "joke", "milestone", "inspiration", "thought_provoking",
                "fact", "meme", "game", "riddle", "motivation",
            ];
            const { error } = await supabase.from("feed_patterns").insert({
                name: newPatternName,
                slug,
                slots: defaultSlots,
                is_active: true,
                sort_order: patterns.length + 1,
            });
            if (error) throw error;
            toast.success(`Pattern "${newPatternName}" created successfully`);
            setNewPatternName("");
            setShowAddModal(false);
            fetchPatterns();
        } catch (err) {
            console.error("Failed to create:", err);
            toast.error(`Failed to create pattern "${newPatternName}"`);
        }
    };

    const handleToggleActive = async (pattern: FeedPattern) => {
        try {
            const { error } = await supabase
                .from("feed_patterns")
                .update({ is_active: !pattern.is_active })
                .eq("id", pattern.id);
            if (error) throw error;
            toast.success(`Pattern "${pattern.name}" ${!pattern.is_active ? "activated" : "deactivated"} successfully`);
            fetchPatterns();
        } catch {
            toast.error(`Failed to toggle pattern "${pattern.name}"`);
        }
    };

    const handleDeletePattern = async (id: string) => {
        const pattern = patterns.find((p) => p.id === id);
        if (!confirm(`Delete pattern "${pattern?.name || ""}"? This cannot be undone.`)) return;
        try {
            const { error } = await supabase.from("feed_patterns").delete().eq("id", id);
            if (error) throw error;
            toast.success(`Pattern "${pattern?.name}" deleted successfully`);
            fetchPatterns();
        } catch {
            toast.error(`Failed to delete pattern "${pattern?.name}"`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Feed Patterns</h1>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Configure the order of content types in slots 5-19 of the daily feed. Patterns rotate daily (A, B, C...).
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} />
                    New Pattern
                </button>
            </div>

            {/* Info box */}
            <div className="glass-card p-4 border border-blue-500/30 bg-blue-500/5">
                <p className="text-sm text-[var(--foreground)]">
                    <strong>How it works:</strong> Each day, one active pattern is selected (rotating by day-of-year).
                    Slots 1-4 are always fixed (Verse, Devotional, Prayer, Quiz). Slots 5-19 follow the pattern below.
                    Slot 20 is always the Pause Card.
                </p>
            </div>

            {/* Patterns */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                </div>
            ) : patterns.length === 0 ? (
                <div className="glass-card p-8 text-center">
                    <Shuffle size={48} className="mx-auto mb-4 text-[var(--muted-foreground)]" />
                    <p className="text-lg font-medium text-[var(--foreground)]">No feed patterns</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Create your first pattern</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {patterns.map((pattern) => (
                        <div key={pattern.id} className={`glass-card p-5 ${!pattern.is_active ? 'opacity-60' : ''}`}>
                            {/* Pattern header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-[var(--foreground)]">{pattern.name}</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-[var(--secondary)] text-xs text-[var(--muted-foreground)]">
                                        {pattern.slug}
                                    </span>
                                    {pattern.is_active ? (
                                        <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">Active</span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">Inactive</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleToggleActive(pattern)}
                                        className="px-3 py-1.5 rounded-lg bg-[var(--secondary)] text-xs hover:bg-[var(--secondary)]/80 text-[var(--foreground)]">
                                        {pattern.is_active ? "Deactivate" : "Activate"}
                                    </button>
                                    <button onClick={() => handleSavePattern(pattern)} disabled={saving === pattern.id}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs hover:opacity-90 disabled:opacity-50">
                                        {saving === pattern.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        Save
                                    </button>
                                    <button onClick={() => handleDeletePattern(pattern.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Slots grid */}
                            <div className="space-y-2">
                                <div className="grid grid-cols-[auto_1fr_auto_auto] gap-2 items-center text-xs font-semibold text-[var(--muted-foreground)] px-2">
                                    <span className="w-8">#</span>
                                    <span>Slot Type</span>
                                    <span className="w-16 text-center">Move</span>
                                    <span className="w-8"></span>
                                </div>
                                {pattern.slots.map((slot, i) => {
                                    const slotInfo = AVAILABLE_SLOT_TYPES.find(s => s.value === slot);
                                    return (
                                        <div key={i} className="grid grid-cols-[auto_1fr_auto_auto] gap-2 items-center px-2 py-1.5 rounded-lg hover:bg-[var(--secondary)]/50">
                                            <span className="w-8 text-xs text-[var(--muted-foreground)] font-mono">
                                                {i + 5}
                                            </span>
                                            <select
                                                value={slot}
                                                onChange={(e) => handleSlotChange(pattern.id, i, e.target.value as FeedSlotType)}
                                                className="px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)]"
                                            >
                                                {AVAILABLE_SLOT_TYPES.map(st => (
                                                    <option key={st.value} value={st.value}>
                                                        {st.emoji} {st.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="w-16 flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => handleMoveSlot(pattern.id, i, i - 1)}
                                                    disabled={i === 0}
                                                    className="p-1 rounded hover:bg-[var(--secondary)] disabled:opacity-30 text-[var(--muted-foreground)]"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    onClick={() => handleMoveSlot(pattern.id, i, i + 1)}
                                                    disabled={i === pattern.slots.length - 1}
                                                    className="p-1 rounded hover:bg-[var(--secondary)] disabled:opacity-30 text-[var(--muted-foreground)]"
                                                >
                                                    ↓
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveSlot(pattern.id, i)}
                                                className="w-8 p-1 rounded hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-400"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                                <button
                                    onClick={() => handleAddSlot(pattern.id)}
                                    className="w-full py-2 rounded-lg border border-dashed border-[var(--border)] text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
                                >
                                    + Add Slot
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Pattern Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card w-full max-w-md p-6">
                                <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">New Feed Pattern</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Pattern Name</label>
                                        <input type="text" value={newPatternName} onChange={(e) => setNewPatternName(e.target.value)}
                                            placeholder="e.g. Pattern D"
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]" />
                                    </div>
                                    <p className="text-xs text-[var(--muted-foreground)]">
                                        A new pattern will be created with the default slot order. You can then customize it.
                                    </p>
                                    <div className="flex gap-3">
                                        <button onClick={() => setShowAddModal(false)}
                                            className="flex-1 px-4 py-2 rounded-lg bg-[var(--secondary)] text-[var(--foreground)]">Cancel</button>
                                        <button onClick={handleCreatePattern} disabled={!newPatternName.trim()}
                                            className="flex-1 px-4 py-2 rounded-lg bg-[var(--primary)] text-white disabled:opacity-50">Create</button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
