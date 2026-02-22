"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mood } from "@/types";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { MoodFormModal } from "../components/MoodFormModal";

export default function MoodsPage() {
    const [moods, setMoods] = useState<Mood[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchMoods();
    }, []);

    const fetchMoods = async () => {
        try {
            const { data, error } = await supabase
                .from("moods")
                .select("*")
                .order("sort_order", { ascending: true });

            if (error) throw error;
            setMoods(data || []);
        } catch (error) {
            console.error("Error fetching moods:", error);
            toast.error("Failed to load moods");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const mood = moods.find((m) => m.id === id);
        if (!confirm(`Are you sure you want to delete the mood "${mood?.name || ""}"?`)) return;

        try {
            const { error } = await supabase.from("moods").delete().eq("id", id);
            if (error) throw error;
            toast.success(`Mood "${mood?.name}" deleted successfully`);
            fetchMoods();
        } catch (error) {
            toast.error(`Failed to delete mood "${mood?.name}"`);
        }
    };

    const handleCreate = () => {
        setSelectedMood(null);
        setShowModal(true);
    };

    const handleEdit = (mood: Mood) => {
        setSelectedMood(mood);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedMood(null);
    };

    const handleSuccess = () => {
        fetchMoods();
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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--foreground)]">Moods</h2>
                    <p className="text-[var(--muted-foreground)]">Manage available moods</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl transition-colors shadow-lg shadow-[var(--primary)]/20"
                >
                    <Plus size={20} />
                    Add Mood
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moods.map((mood) => (
                    <div
                        key={mood.id}
                        className="glass-card p-6 relative group border border-[var(--border)] hover:border-[var(--accent)] transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
                                style={{ backgroundColor: mood.color + "20" }} // 20% opacity
                            >
                                {mood.emoji}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(mood)}
                                    className="p-2 hover:bg-[var(--secondary)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                    title="Edit"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(mood.id)}
                                    className="p-2 hover:bg-[var(--destructive)]/10 rounded-lg text-[var(--destructive)]"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-1">{mood.name}</h3>
                        <p className="text-sm text-[var(--muted-foreground)] mb-4 h-10 overflow-hidden text-ellipsis md:line-clamp-2">
                            {mood.description || "No description provided."}
                        </p>

                        <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mt-4 pt-4 border-t border-[var(--border)]">
                            <span className={`px-2 py-1 rounded-full ${mood.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {mood.is_active ? "Active" : "Inactive"}
                            </span>
                            <span>Order: {mood.sort_order}</span>
                        </div>

                        <div
                            className="absolute top-0 left-0 w-1 h-full rounded-l-2xl transition-all"
                            style={{ backgroundColor: mood.color }}
                        />
                    </div>
                ))}

                {/* Empty State / Add New Card Placeholder */}
                <button
                    onClick={handleCreate}
                    className="glass-card p-6 flex flex-col items-center justify-center border border-dashed border-[var(--muted-foreground)] opacity-50 hover:opacity-100 hover:border-[var(--accent)] transition-all cursor-pointer min-h-[200px]"
                >
                    <div className="w-16 h-16 rounded-full bg-[var(--secondary)] flex items-center justify-center mb-4 text-[var(--muted-foreground)]">
                        <Plus size={32} />
                    </div>
                    <span className="font-medium text-[var(--foreground)]">Create New Mood</span>
                </button>
            </div>

            {/* Mood Form Modal */}
            <MoodFormModal
                isOpen={showModal}
                onClose={handleModalClose}
                mood={selectedMood}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
