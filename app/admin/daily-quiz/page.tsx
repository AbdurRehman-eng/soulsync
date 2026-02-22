"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { HelpCircle, Calendar, Plus, Trash2, Loader2, Star, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface QuizCandidate {
    id: string;
    card_id: string;
    scheduled_date: string | null;
    is_candidate: boolean;
    created_at: string;
    card?: {
        id: string;
        title: string;
        subtitle: string | null;
        is_active: boolean;
    };
}

interface QuizCard {
    id: string;
    title: string;
    subtitle: string | null;
    is_active: boolean;
    points_reward: number;
    created_at: string;
    // Whether it's in the candidate pool
    isCandidate?: boolean;
    candidateId?: string;
    scheduledDate?: string | null;
}

export default function DailyQuizPage() {
    const [candidates, setCandidates] = useState<QuizCandidate[]>([]);
    const [allQuizCards, setAllQuizCards] = useState<QuizCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [scheduleDate, setScheduleDate] = useState("");
    const supabase = createClient();

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch quiz candidates
            const { data: candidateData, error: candidateError } = await supabase
                .from("daily_quiz_candidates")
                .select("*, card:cards(id, title, subtitle, is_active)")
                .order("created_at", { ascending: false });

            if (candidateError) throw candidateError;
            setCandidates(candidateData || []);

            // Fetch all quiz cards
            const { data: quizCards, error: quizError } = await supabase
                .from("cards")
                .select("id, title, subtitle, is_active, points_reward, created_at")
                .eq("type", "quiz")
                .eq("is_active", true)
                .order("created_at", { ascending: false });

            if (quizError) throw quizError;

            // Map candidate status onto quiz cards
            const candidateMap = new Map<string, QuizCandidate>();
            (candidateData || []).forEach((c: QuizCandidate) => {
                candidateMap.set(c.card_id, c);
            });

            const mapped: QuizCard[] = (quizCards || []).map((q: any) => {
                const cand = candidateMap.get(q.id);
                return {
                    ...q,
                    isCandidate: !!cand?.is_candidate,
                    candidateId: cand?.id,
                    scheduledDate: cand?.scheduled_date,
                };
            });
            setAllQuizCards(mapped);
        } catch (err) {
            console.error("Failed to fetch quiz data:", err);
            toast.error("Failed to load quiz data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleToggleCandidate = async (quizCard: QuizCard) => {
        try {
            if (quizCard.isCandidate && quizCard.candidateId) {
                // Remove from pool
                const { error } = await supabase
                    .from("daily_quiz_candidates")
                    .delete()
                    .eq("id", quizCard.candidateId);
                if (error) throw error;
                toast.success(`"${quizCard.title}" removed from daily quiz pool`);
            } else {
                // Add to pool
                const { error } = await supabase
                    .from("daily_quiz_candidates")
                    .insert({
                        card_id: quizCard.id,
                        is_candidate: true,
                    });
                if (error) throw error;
                toast.success(`"${quizCard.title}" added to daily quiz pool`);
            }
            fetchData();
        } catch {
            toast.error(`Failed to update "${quizCard.title}"`);
        }
    };

    const handleSchedule = async () => {
        if (!selectedCardId || !scheduleDate) {
            toast.error("Select a quiz and date");
            return;
        }
        try {
            // Check if there's already a quiz scheduled for this date
            const existing = candidates.find(c => c.scheduled_date === scheduleDate);
            if (existing) {
                // Update existing
                await supabase
                    .from("daily_quiz_candidates")
                    .update({ scheduled_date: null })
                    .eq("id", existing.id);
            }

            // Check if this card is already a candidate
            const existingCandidate = candidates.find(c => c.card_id === selectedCardId);
            if (existingCandidate) {
                // Update the schedule date
                const { error } = await supabase
                    .from("daily_quiz_candidates")
                    .update({ scheduled_date: scheduleDate })
                    .eq("id", existingCandidate.id);
                if (error) throw error;
            } else {
                // Create new candidate with schedule
                const { error } = await supabase
                    .from("daily_quiz_candidates")
                    .insert({
                        card_id: selectedCardId,
                        is_candidate: true,
                        scheduled_date: scheduleDate,
                    });
                if (error) throw error;
            }

            const quizTitle = allQuizCards.find(q => q.id === selectedCardId)?.title || "Quiz";
            toast.success(`"${quizTitle}" scheduled for ${scheduleDate}`);
            setShowScheduleModal(false);
            setSelectedCardId(null);
            setScheduleDate("");
            fetchData();
        } catch (err) {
            console.error("Failed to schedule:", err);
            toast.error("Failed to schedule quiz");
        }
    };

    const handleRemoveSchedule = async (candidateId: string) => {
        const cand = candidates.find(c => c.id === candidateId);
        const quizTitle = cand?.card?.title || "Quiz";
        try {
            const { error } = await supabase
                .from("daily_quiz_candidates")
                .update({ scheduled_date: null })
                .eq("id", candidateId);
            if (error) throw error;
            toast.success(`Schedule removed for "${quizTitle}"`);
            fetchData();
        } catch {
            toast.error(`Failed to remove schedule for "${quizTitle}"`);
        }
    };

    const scheduledQuizzes = candidates.filter(c => c.scheduled_date);
    const poolQuizzes = candidates.filter(c => c.is_candidate && !c.scheduled_date);
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Daily Quiz Management</h1>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Manage the daily quiz rotation pool and schedule specific quizzes for future dates.
                    </p>
                </div>
                <button
                    onClick={() => setShowScheduleModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
                >
                    <Calendar size={18} />
                    Schedule Quiz
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-[var(--foreground)]">{allQuizCards.length}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Total Quizzes</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-[var(--primary)]">{poolQuizzes.length}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">In Rotation Pool</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">{scheduledQuizzes.length}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Scheduled</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                </div>
            ) : (
                <>
                    {/* Scheduled Quizzes */}
                    {scheduledQuizzes.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">Scheduled Quizzes</h2>
                            <div className="space-y-2">
                                {scheduledQuizzes
                                    .sort((a, b) => (a.scheduled_date || "").localeCompare(b.scheduled_date || ""))
                                    .map((cand) => (
                                        <div key={cand.id} className={`glass-card p-3 flex items-center justify-between ${cand.scheduled_date === today ? 'border-2 border-[var(--primary)]' : ''}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-purple-500/20">
                                                    <Calendar size={16} className="text-purple-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[var(--foreground)]">
                                                        {cand.card?.title || "Unknown Quiz"}
                                                    </p>
                                                    <p className="text-xs text-[var(--muted-foreground)]">
                                                        {cand.scheduled_date}
                                                        {cand.scheduled_date === today && (
                                                            <span className="ml-2 px-1.5 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--primary)] text-[10px] font-medium">TODAY</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveSchedule(cand.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* All Quiz Cards with toggle */}
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                            All Quiz Cards
                            <span className="text-sm text-[var(--muted-foreground)] font-normal ml-2">
                                Toggle to add/remove from daily rotation pool
                            </span>
                        </h2>
                        {allQuizCards.length === 0 ? (
                            <div className="glass-card p-8 text-center">
                                <HelpCircle size={48} className="mx-auto mb-4 text-[var(--muted-foreground)]" />
                                <p className="text-lg font-medium text-[var(--foreground)]">No quizzes found</p>
                                <p className="text-sm text-[var(--muted-foreground)]">Create quizzes in the Content section first</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {allQuizCards.map((quiz) => (
                                    <div key={quiz.id} className="glass-card p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleToggleCandidate(quiz)}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    quiz.isCandidate
                                                        ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                                                        : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'
                                                }`}
                                            >
                                                {quiz.isCandidate ? <Check size={16} /> : <Plus size={16} />}
                                            </button>
                                            <div>
                                                <p className="font-medium text-[var(--foreground)]">{quiz.title}</p>
                                                {quiz.subtitle && (
                                                    <p className="text-xs text-[var(--muted-foreground)]">{quiz.subtitle}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {quiz.isCandidate && (
                                                <span className="px-2 py-0.5 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs">
                                                    In Pool
                                                </span>
                                            )}
                                            {quiz.scheduledDate && (
                                                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                                                    {quiz.scheduledDate}
                                                </span>
                                            )}
                                            <span className="text-xs text-[var(--muted-foreground)]">
                                                {quiz.points_reward} pts
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Schedule Modal */}
            <AnimatePresence>
                {showScheduleModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowScheduleModal(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card w-full max-w-md p-6">
                                <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">Schedule Daily Quiz</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Select Quiz</label>
                                        <select
                                            value={selectedCardId || ""}
                                            onChange={(e) => setSelectedCardId(e.target.value || null)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]"
                                        >
                                            <option value="">Choose a quiz...</option>
                                            {allQuizCards.map(q => (
                                                <option key={q.id} value={q.id}>{q.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Date</label>
                                        <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                                            min={today}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]" />
                                    </div>
                                    <p className="text-xs text-[var(--muted-foreground)]">
                                        This quiz will be shown as the Daily Quiz on the selected date, overriding the auto-rotation.
                                    </p>
                                    <div className="flex gap-3">
                                        <button onClick={() => setShowScheduleModal(false)}
                                            className="flex-1 px-4 py-2 rounded-lg bg-[var(--secondary)] text-[var(--foreground)]">Cancel</button>
                                        <button onClick={handleSchedule} disabled={!selectedCardId || !scheduleDate}
                                            className="flex-1 px-4 py-2 rounded-lg bg-[var(--primary)] text-white disabled:opacity-50">Schedule</button>
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
