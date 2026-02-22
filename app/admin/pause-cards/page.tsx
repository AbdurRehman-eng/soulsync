"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pause, Plus, Trash2, Star, Calendar, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface PauseCard {
    id: string;
    title: string;
    message: string;
    cta_text: string;
    pause_type: string;
    is_default: boolean;
    start_date: string | null;
    end_date: string | null;
    is_active: boolean;
    created_at: string;
}

export default function PauseCardsPage() {
    const [pauseCards, setPauseCards] = useState<PauseCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCard, setEditingCard] = useState<PauseCard | null>(null);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    // Form state
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [ctaText, setCtaText] = useState("Take a moment to breathe");
    const [pauseType, setPauseType] = useState("default");
    const [isDefault, setIsDefault] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isActive, setIsActive] = useState(true);

    const fetchPauseCards = async () => {
        setLoading(true);
        try {
            // Pause cards are stored in the cards table with type='pause'
            const { data, error } = await supabase
                .from("cards")
                .select("*")
                .eq("type", "pause")
                .order("sort_order", { ascending: true });

            if (error) throw error;

            const mapped: PauseCard[] = (data || []).map((c: any) => ({
                id: c.id,
                title: c.title,
                message: c.content?.pause_message || "",
                cta_text: c.content?.pause_cta_text || "",
                pause_type: c.content?.pause_type || "default",
                is_default: c.is_pinned, // Reuse is_pinned as "is_default" for pause cards
                start_date: c.pin_start,
                end_date: c.pin_end,
                is_active: c.is_active,
                created_at: c.created_at,
            }));
            setPauseCards(mapped);
        } catch (err) {
            console.error("Failed to fetch pause cards:", err);
            toast.error("Failed to load pause cards");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPauseCards(); }, []);

    const resetForm = () => {
        setTitle("");
        setMessage("");
        setCtaText("Take a moment to breathe");
        setPauseType("default");
        setIsDefault(false);
        setStartDate("");
        setEndDate("");
        setIsActive(true);
        setEditingCard(null);
    };

    const openEditForm = (card: PauseCard) => {
        setEditingCard(card);
        setTitle(card.title);
        setMessage(card.message);
        setCtaText(card.cta_text);
        setPauseType(card.pause_type);
        setIsDefault(card.is_default);
        setStartDate(card.start_date || "");
        setEndDate(card.end_date || "");
        setIsActive(card.is_active);
        setShowForm(true);
    };

    // Sync the pause_cards table (used by feed API) with the cards table
    const syncPauseCardsTable = async (cardId: string, isDefaultVal: boolean, start: string | null, end: string | null) => {
        // Upsert into pause_cards so the feed API picks it up
        const { error } = await supabase
            .from("pause_cards")
            .upsert({
                card_id: cardId,
                is_default: isDefaultVal,
                active_start: start || null,
                active_end: end || null,
            }, { onConflict: "card_id" });
        if (error) console.error("Failed to sync pause_cards table:", error);

        // If setting as default, unset others in pause_cards too
        if (isDefaultVal) {
            await supabase
                .from("pause_cards")
                .update({ is_default: false })
                .neq("card_id", cardId);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) {
            toast.error("Title and message are required");
            return;
        }

        setSaving(true);
        try {
            const cardData = {
                type: "pause" as const,
                title,
                subtitle: pauseType,
                content: {
                    pause_message: message,
                    pause_cta_text: ctaText,
                    pause_type: pauseType,
                },
                is_active: isActive,
                is_pinned: isDefault,
                pin_start: startDate || null,
                pin_end: endDate || null,
                points_reward: 0,
            };

            let savedCardId: string;

            if (editingCard) {
                const { error } = await supabase
                    .from("cards")
                    .update(cardData)
                    .eq("id", editingCard.id);
                if (error) throw error;
                savedCardId = editingCard.id;
                toast.success(`Pause card "${title}" updated successfully`);
            } else {
                const { data: inserted, error } = await supabase
                    .from("cards")
                    .insert(cardData)
                    .select("id")
                    .single();
                if (error) throw error;
                savedCardId = inserted.id;
                toast.success(`Pause card "${title}" created successfully`);
            }

            // If setting as default, unset other defaults in cards table
            if (isDefault) {
                const others = pauseCards.filter(c => c.id !== editingCard?.id && c.is_default);
                for (const other of others) {
                    await supabase
                        .from("cards")
                        .update({ is_pinned: false })
                        .eq("id", other.id);
                }
            }

            // Sync to pause_cards table so feed API picks it up
            await syncPauseCardsTable(savedCardId, isDefault, startDate || null, endDate || null);

            resetForm();
            setShowForm(false);
            fetchPauseCards();
        } catch (err) {
            console.error("Failed to save pause card:", err);
            toast.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const card = pauseCards.find((c) => c.id === id);
        if (!confirm(`Delete pause card "${card?.title || ""}"?`)) return;
        try {
            // Remove from pause_cards first (FK constraint)
            await supabase.from("pause_cards").delete().eq("card_id", id);
            const { error } = await supabase.from("cards").delete().eq("id", id);
            if (error) throw error;
            toast.success(`Pause card "${card?.title}" deleted successfully`);
            fetchPauseCards();
        } catch {
            toast.error(`Failed to delete pause card "${card?.title}"`);
        }
    };

    const handleSetDefault = async (id: string) => {
        const card = pauseCards.find((c) => c.id === id);
        try {
            // Unset all defaults in cards table
            await supabase
                .from("cards")
                .update({ is_pinned: false })
                .eq("type", "pause");
            // Set this one as default
            await supabase
                .from("cards")
                .update({ is_pinned: true })
                .eq("id", id);

            // Sync pause_cards table: unset all defaults, then set this one
            await supabase
                .from("pause_cards")
                .update({ is_default: false })
                .neq("card_id", id);
            await syncPauseCardsTable(id, true, null, null);

            toast.success(`"${card?.title}" set as default pause card`);
            fetchPauseCards();
        } catch {
            toast.error(`Failed to set "${card?.title}" as default`);
        }
    };

    const pauseTypes = [
        { value: "default", label: "Default" },
        { value: "christmas", label: "Christmas" },
        { value: "easter", label: "Easter" },
        { value: "new_year", label: "New Year" },
        { value: "seasonal", label: "Seasonal" },
        { value: "motivational", label: "Motivational" },
        { value: "gratitude", label: "Gratitude" },
    ];

    const defaultCard = pauseCards.find(c => c.is_default);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Pause Cards</h1>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Manage end-of-feed pause cards. The default card shows unless a scheduled card overrides it.
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} />
                    New Pause Card
                </button>
            </div>

            {/* Current Default */}
            {defaultCard && (
                <div className="glass-card p-4 border-2 border-[var(--primary)]">
                    <div className="flex items-center gap-2 mb-2">
                        <Star size={16} className="text-[var(--primary)]" />
                        <span className="text-sm font-semibold text-[var(--primary)]">Current Default</span>
                    </div>
                    <p className="font-medium text-[var(--foreground)]">{defaultCard.title}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{defaultCard.message}</p>
                </div>
            )}

            {/* Cards List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                </div>
            ) : pauseCards.length === 0 ? (
                <div className="glass-card p-8 text-center">
                    <Pause size={48} className="mx-auto mb-4 text-[var(--muted-foreground)]" />
                    <p className="text-lg font-medium text-[var(--foreground)]">No pause cards yet</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Create your first pause card</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pauseCards.map((card) => (
                        <div key={card.id} className={`glass-card p-4 ${card.is_default ? 'border-2 border-[var(--primary)]' : ''}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-[var(--foreground)]">{card.title}</h3>
                                        {card.is_default && (
                                            <span className="px-2 py-0.5 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-medium">
                                                Default
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 rounded-full bg-[var(--secondary)] text-xs capitalize">
                                            {card.pause_type}
                                        </span>
                                        {!card.is_active && (
                                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-[var(--muted-foreground)] mb-1">{card.message}</p>
                                    {(card.start_date || card.end_date) && (
                                        <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                                            <Calendar size={12} />
                                            {card.start_date} — {card.end_date || "ongoing"}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {!card.is_default && (
                                        <button
                                            onClick={() => handleSetDefault(card.id)}
                                            title="Set as default"
                                            className="p-2 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                                        >
                                            <Star size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openEditForm(card)}
                                        className="px-3 py-1.5 rounded-lg bg-[var(--secondary)] text-sm hover:bg-[var(--secondary)]/80 transition-colors text-[var(--foreground)]"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => { setShowForm(false); resetForm(); }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card w-full max-w-lg p-6"
                            >
                                <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">
                                    {editingCard ? "Edit Pause Card" : "New Pause Card"}
                                </h2>
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Title *</label>
                                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Time to Pause" required
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Message *</label>
                                        <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                                            placeholder="You've reached the end of today's feed..." rows={3} required
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">CTA Text</label>
                                        <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)}
                                            placeholder="Take a moment to breathe"
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Type</label>
                                            <select value={pauseType} onChange={(e) => setPauseType(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]">
                                                {pauseTypes.map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-end gap-3 pb-1">
                                            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                                                <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="w-4 h-4" />
                                                Set as Default
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                                                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4" />
                                                Active
                                            </label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
                                                Schedule Start <span className="text-xs text-[var(--muted-foreground)]">(optional)</span>
                                            </label>
                                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
                                                Schedule End <span className="text-xs text-[var(--muted-foreground)]">(optional)</span>
                                            </label>
                                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-[var(--muted-foreground)]">
                                        Scheduled pause cards override the default for the chosen duration, then revert back automatically.
                                    </p>
                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                                            className="flex-1 px-4 py-2 rounded-lg bg-[var(--secondary)] text-[var(--foreground)]">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={saving}
                                            className="flex-1 px-4 py-2 rounded-lg bg-[var(--primary)] text-white disabled:opacity-50 flex items-center justify-center gap-2">
                                            {saving ? <><Loader2 className="animate-spin" size={16} /> Saving...</> : editingCard ? "Update" : "Create"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
