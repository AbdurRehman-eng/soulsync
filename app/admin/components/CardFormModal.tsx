"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardType } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

interface CardFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    card?: Card | null;
    onSuccess: () => void;
}

export function CardFormModal({ isOpen, onClose, card, onSuccess }: CardFormModalProps) {
    const [type, setType] = useState<CardType>("verse");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [pointsReward, setPointsReward] = useState(5);
    const [minMembershipLevel, setMinMembershipLevel] = useState(1);

    // Content fields based on type
    const [verseText, setVerseText] = useState("");
    const [verseReference, setVerseReference] = useState("");
    const [body, setBody] = useState("");
    const [author, setAuthor] = useState("");
    const [readTime, setReadTime] = useState(2);
    const [prayerText, setPrayerText] = useState("");
    const [quote, setQuote] = useState("");
    const [quoteAuthor, setQuoteAuthor] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [journalPrompt, setJournalPrompt] = useState("");
    const [adText, setAdText] = useState("");
    const [adUrl, setAdUrl] = useState("");

    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [aiTheme, setAiTheme] = useState("");
    const [showAiInput, setShowAiInput] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        if (card) {
            setType(card.type);
            setTitle(card.title);
            setSubtitle(card.subtitle || "");
            setIsActive(card.is_active);
            setPointsReward(card.points_reward);
            setMinMembershipLevel(card.min_membership_level);

            // Set content fields based on type
            const content = card.content || {};
            setVerseText(content.verse_text || "");
            setVerseReference(content.verse_reference || "");
            setBody(content.body || "");
            setAuthor(content.author || "");
            setReadTime(content.read_time || 2);
            setPrayerText(content.prayer_text || "");
            setQuote(content.quote || "");
            setQuoteAuthor(content.quote_author || "");
            setJournalPrompt(content.prompt || "");
            setAdText(content.body || "");
            setAdUrl(content.url || "");
        } else {
            // Reset form
            setType("verse");
            setTitle("");
            setSubtitle("");
            setIsActive(true);
            setPointsReward(5);
            setMinMembershipLevel(1);
            setVerseText("");
            setVerseReference("");
            setBody("");
            setAuthor("");
            setReadTime(2);
            setPrayerText("");
            setQuote("");
            setQuoteAuthor("");
            setTaskDescription("");
            setJournalPrompt("");
            setAdText("");
            setAdUrl("");
        }
    }, [card, isOpen]);

    const buildContent = () => {
        const content: any = {};

        switch (type) {
            case "verse":
                content.verse_text = verseText;
                content.verse_reference = verseReference;
                break;
            case "devotional":
            case "article":
                content.body = body;
                content.author = author;
                content.read_time = readTime;
                break;
            case "prayer":
                content.prayer_text = prayerText;
                break;
            case "motivational":
                content.quote = quote;
                content.quote_author = quoteAuthor;
                break;
            case "task":
                content.description = taskDescription;
                break;
            case "journal":
                content.prompt = journalPrompt;
                break;
            case "ad":
                content.body = adText;
                content.url = adUrl;
                break;
        }

        return content;
    };

    const handleGenerateWithAI = async () => {
        if (!aiTheme.trim()) {
            toast.error("Please enter a theme or topic");
            return;
        }

        if (type === "quiz" || type === "game") {
            toast.error(`AI generation for ${type} coming soon!`);
            return;
        }

        setGenerating(true);

        try {
            const response = await fetch("/api/admin/generate-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, theme: aiTheme }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to generate content");
            }

            // Populate form with generated content
            const generated = result.data;
            setTitle(generated.title || "");
            setSubtitle(generated.subtitle || "");

            const content = generated.content || {};
            setVerseText(content.verse_text || "");
            setVerseReference(content.verse_reference || "");
            setBody(content.body || "");
            setAuthor(content.author || "Soul Sync Team");
            setReadTime(content.read_time || 2);
            setPrayerText(content.prayer_text || "");
            setQuote(content.quote || "");
            setQuoteAuthor(content.quote_author || "");
            setTaskDescription(content.description || "");

            toast.success("Content generated! Review and edit as needed.");
            setShowAiInput(false);
            setAiTheme("");
        } catch (error: any) {
            console.error("AI generation error:", error);
            toast.error(error.message || "Failed to generate content");
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        // Prevent creating quiz/game types (they need dedicated editors)
        if (type === "quiz" || type === "game") {
            toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} content requires a dedicated editor. Coming soon!`);
            return;
        }

        setLoading(true);

        try {
            const content = buildContent();
            const cardData = {
                type,
                title: title.trim(),
                subtitle: subtitle.trim() || null,
                content,
                is_active: isActive,
                points_reward: pointsReward,
                min_membership_level: minMembershipLevel,
            };

            if (card) {
                // Update existing card
                const { error } = await supabase
                    .from("cards")
                    .update(cardData)
                    .eq("id", card.id);

                if (error) throw error;
                toast.success("Content updated successfully");
            } else {
                // Create new card
                const { error } = await supabase.from("cards").insert(cardData);

                if (error) throw error;
                toast.success("Content created successfully");
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error saving card:", error);
            toast.error(error.message || "Failed to save content");
        } finally {
            setLoading(false);
        }
    };

    const renderContentFields = () => {
        switch (type) {
            case "verse":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                Verse Text *
                            </label>
                            <textarea
                                value={verseText}
                                onChange={(e) => setVerseText(e.target.value)}
                                placeholder="For I know the plans I have for you..."
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                Verse Reference *
                            </label>
                            <input
                                type="text"
                                value={verseReference}
                                onChange={(e) => setVerseReference(e.target.value)}
                                placeholder="Jeremiah 29:11"
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                required
                            />
                        </div>
                    </>
                );

            case "devotional":
            case "article":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                Body *
                            </label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Write the devotional content here..."
                                rows={6}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="Soul Sync Team"
                                    className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                    Read Time (min)
                                </label>
                                <input
                                    type="number"
                                    value={readTime}
                                    onChange={(e) => setReadTime(parseInt(e.target.value) || 2)}
                                    className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                />
                            </div>
                        </div>
                    </>
                );

            case "prayer":
                return (
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                            Prayer Text *
                        </label>
                        <textarea
                            value={prayerText}
                            onChange={(e) => setPrayerText(e.target.value)}
                            placeholder="Dear Lord, thank you for this new day..."
                            rows={6}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
                            required
                        />
                    </div>
                );

            case "motivational":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                Quote *
                            </label>
                            <textarea
                                value={quote}
                                onChange={(e) => setQuote(e.target.value)}
                                placeholder="The only way to do great work is to love what you do."
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                Quote Author
                            </label>
                            <input
                                type="text"
                                value={quoteAuthor}
                                onChange={(e) => setQuoteAuthor(e.target.value)}
                                placeholder="Steve Jobs"
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                            />
                        </div>
                    </>
                );

            case "task":
                return (
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                            Task Description *
                        </label>
                        <textarea
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            placeholder="Write down 3 things you are grateful for today"
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
                            required
                        />
                    </div>
                );

            case "journal":
                return (
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                            Journal Prompt *
                        </label>
                        <textarea
                            value={journalPrompt}
                            onChange={(e) => setJournalPrompt(e.target.value)}
                            placeholder="What are three things you're grateful for today?"
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
                            required
                        />
                    </div>
                );

            case "ad":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                Ad Text *
                            </label>
                            <textarea
                                value={adText}
                                onChange={(e) => setAdText(e.target.value)}
                                placeholder="Upgrade to Premium for exclusive features..."
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                Link URL
                            </label>
                            <input
                                type="url"
                                value={adUrl}
                                onChange={(e) => setAdUrl(e.target.value)}
                                placeholder="https://example.com/upgrade"
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                            />
                        </div>
                    </>
                );

            case "quiz":
            case "game":
                return (
                    <div className="text-center py-8 bg-[var(--secondary)]/30 rounded-lg border-2 border-dashed border-[var(--border)]">
                        <p className="text-[var(--muted-foreground)] mb-2">
                            {type.charAt(0).toUpperCase() + type.slice(1)} content requires a dedicated editor
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            Use the specialized {type} creator (coming soon)
                        </p>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-8 text-[var(--muted-foreground)]">
                        Content type "{type}" editor coming soon
                    </div>
                );
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card w-full max-w-2xl p-6 relative my-8"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                                    {card ? "Edit Content" : "Create New Content"}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* AI Generation Section */}
                            {!card && (
                                <div className="mb-4 glass-card p-4 border-2 border-dashed border-[var(--primary)]">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                                            <h3 className="font-semibold text-[var(--foreground)]">
                                                Generate with AI
                                            </h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowAiInput(!showAiInput)}
                                            className="text-sm text-[var(--primary)] hover:underline"
                                        >
                                            {showAiInput ? "Hide" : "Show"}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {showAiInput && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-xs text-[var(--muted-foreground)] mb-3">
                                                    Describe the theme, topic, or mood you want to generate content for.
                                                </p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={aiTheme}
                                                        onChange={(e) => setAiTheme(e.target.value)}
                                                        placeholder="E.g., hope, gratitude, overcoming anxiety..."
                                                        className="flex-1 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm"
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                handleGenerateWithAI();
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleGenerateWithAI}
                                                        disabled={generating || !aiTheme.trim()}
                                                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                                                    >
                                                        {generating ? (
                                                            <>
                                                                <Loader2 className="animate-spin" size={16} />
                                                                Generating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Sparkles size={16} />
                                                                Generate
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                        Content Type *
                                    </label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value as CardType)}
                                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] capitalize"
                                        disabled={!!card}
                                    >
                                        <option value="verse">Verse</option>
                                        <option value="devotional">Devotional</option>
                                        <option value="article">Article</option>
                                        <option value="prayer">Prayer</option>
                                        <option value="motivational">Motivational</option>
                                        <option value="task">Task</option>
                                        <option value="quiz">Quiz</option>
                                        <option value="game">Game</option>
                                        <option value="journal">Journal</option>
                                    </select>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Daily Verse"
                                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        required
                                    />
                                </div>

                                {/* Subtitle */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        placeholder="A moment of reflection"
                                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                    />
                                </div>

                                {/* Content Fields (dynamic based on type) */}
                                {renderContentFields()}

                                {/* Settings Grid */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Points Reward
                                        </label>
                                        <input
                                            type="number"
                                            value={pointsReward}
                                            onChange={(e) => setPointsReward(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                            Min Membership Level
                                        </label>
                                        <select
                                            value={minMembershipLevel}
                                            onChange={(e) => setMinMembershipLevel(parseInt(e.target.value))}
                                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                        >
                                            <option value={1}>Free (1)</option>
                                            <option value={2}>Plus (2)</option>
                                            <option value={3}>Premium (3)</option>
                                        </select>
                                    </div>
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
                                        Published (visible to users)
                                    </label>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4 sticky bottom-0 bg-[var(--card)] pb-2">
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
                                            card ? "Update" : "Create"
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
