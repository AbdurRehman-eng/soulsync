"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardType, ContentCategory } from "@/types";
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

    // New content fields for extended card types
    const [memeTextTop, setMemeTextTop] = useState("");
    const [memeTextBottom, setMemeTextBottom] = useState("");
    const [factText, setFactText] = useState("");
    const [factSource, setFactSource] = useState("");
    const [riddleQuestion, setRiddleQuestion] = useState("");
    const [riddleAnswer, setRiddleAnswer] = useState("");
    const [riddleHint, setRiddleHint] = useState("");
    const [jokeSetup, setJokeSetup] = useState("");
    const [jokePunchline, setJokePunchline] = useState("");
    const [thoughtText, setThoughtText] = useState("");
    const [thoughtSource, setThoughtSource] = useState("");
    const [visualType, setVisualType] = useState("image");
    const [shareText, setShareText] = useState("");
    const [shareMood, setShareMood] = useState("happy");
    const [ctaText, setCtaText] = useState("");
    const [ctaUrl, setCtaUrl] = useState("");
    const [upgradeMessage, setUpgradeMessage] = useState("");
    const [journalPromptText, setJournalPromptText] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // Featured / Trending / Pin controls
    const [isFeatured, setIsFeatured] = useState(false);
    const [isTrending, setIsTrending] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [pinPosition, setPinPosition] = useState<number | null>(null);
    const [pinStart, setPinStart] = useState("");
    const [pinEnd, setPinEnd] = useState("");
    const [featuredStart, setFeaturedStart] = useState("");
    const [featuredEnd, setFeaturedEnd] = useState("");
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [categories, setCategories] = useState<ContentCategory[]>([]);

    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [aiTheme, setAiTheme] = useState("");
    const [showAiInput, setShowAiInput] = useState(false);
    const supabase = createClient();

    // Fetch categories for dropdown
    useEffect(() => {
        const fetchCats = async () => {
            const { data } = await supabase
                .from("content_categories")
                .select("*")
                .order("sort_order", { ascending: true });
            setCategories(data || []);
        };
        if (isOpen) fetchCats();
    }, [isOpen]);

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

            // Extended fields
            setMemeTextTop(content.meme_text_top || "");
            setMemeTextBottom(content.meme_text_bottom || "");
            setFactText(content.fact_text || "");
            setFactSource(content.fact_source || "");
            setRiddleQuestion(content.riddle_question || "");
            setRiddleAnswer(content.riddle_answer || "");
            setRiddleHint(content.riddle_hint || "");
            setJokeSetup(content.joke_setup || "");
            setJokePunchline(content.joke_punchline || "");
            setThoughtText(content.thought_text || "");
            setThoughtSource(content.thought_source || "");
            setVisualType(content.visual_type || "image");
            setShareText(content.share_text || "");
            setShareMood(content.share_mood || "happy");
            setCtaText(content.cta_text || "");
            setCtaUrl(content.cta_url || "");
            setUpgradeMessage(content.upgrade_message || "");
            setJournalPromptText(content.journal_prompt_text || "");
            setImageUrl(content.image_url || "");

            // Featured/trending/pin
            setIsFeatured(card.is_featured || false);
            setIsTrending(card.is_trending || false);
            setIsPinned(card.is_pinned || false);
            setPinPosition(card.pin_position || null);
            setPinStart(card.pin_start || "");
            setPinEnd(card.pin_end || "");
            setFeaturedStart(card.featured_start || "");
            setFeaturedEnd(card.featured_end || "");
            setCategoryId(card.category_id || null);
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
            setMemeTextTop("");
            setMemeTextBottom("");
            setFactText("");
            setFactSource("");
            setRiddleQuestion("");
            setRiddleAnswer("");
            setRiddleHint("");
            setJokeSetup("");
            setJokePunchline("");
            setThoughtText("");
            setThoughtSource("");
            setVisualType("image");
            setShareText("");
            setShareMood("happy");
            setCtaText("");
            setCtaUrl("");
            setUpgradeMessage("");
            setJournalPromptText("");
            setImageUrl("");
            setIsFeatured(false);
            setIsTrending(false);
            setIsPinned(false);
            setPinPosition(null);
            setPinStart("");
            setPinEnd("");
            setFeaturedStart("");
            setFeaturedEnd("");
            setCategoryId(null);
        }
    }, [card, isOpen]);

    const buildContent = () => {
        const content: any = {};

        // Always include image_url if set
        if (imageUrl) content.image_url = imageUrl;

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
            case "meme":
                content.meme_text_top = memeTextTop;
                content.meme_text_bottom = memeTextBottom;
                break;
            case "fact":
                content.fact_text = factText;
                content.fact_source = factSource;
                break;
            case "riddle":
                content.riddle_question = riddleQuestion;
                content.riddle_answer = riddleAnswer;
                content.riddle_hint = riddleHint;
                break;
            case "joke":
                content.joke_setup = jokeSetup;
                content.joke_punchline = jokePunchline;
                break;
            case "thought_provoking":
                content.thought_text = thoughtText;
                content.thought_source = thoughtSource;
                break;
            case "visual":
                content.visual_type = visualType;
                break;
            case "share_card":
                content.share_text = shareText;
                content.share_mood = shareMood;
                break;
            case "marketing":
                content.body = body;
                content.cta_text = ctaText;
                content.cta_url = ctaUrl;
                break;
            case "upgrade":
                content.upgrade_message = upgradeMessage;
                break;
            case "journal_prompt":
                content.journal_prompt_text = journalPromptText;
                break;
            case "milestone":
                content.body = body;
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
            const cardData: any = {
                type,
                title: title.trim(),
                subtitle: subtitle.trim() || null,
                content,
                is_active: isActive,
                points_reward: pointsReward,
                min_membership_level: minMembershipLevel,
                is_featured: isFeatured,
                is_trending: isTrending,
                is_pinned: isPinned,
                pin_position: isPinned ? pinPosition : null,
                pin_start: isPinned && pinStart ? pinStart : null,
                pin_end: isPinned && pinEnd ? pinEnd : null,
                featured_start: isFeatured && featuredStart ? featuredStart : null,
                featured_end: isFeatured && featuredEnd ? featuredEnd : null,
                category_id: categoryId || null,
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

            case "meme":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Top Text</label>
                            <input type="text" value={memeTextTop} onChange={(e) => setMemeTextTop(e.target.value)}
                                placeholder="Top meme text..." className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Bottom Text</label>
                            <input type="text" value={memeTextBottom} onChange={(e) => setMemeTextBottom(e.target.value)}
                                placeholder="Bottom meme text..." className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Image URL</label>
                            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://..." className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                        </div>
                    </>
                );

            case "fact":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Fact Text *</label>
                            <textarea value={factText} onChange={(e) => setFactText(e.target.value)}
                                placeholder="An interesting fact..." rows={4}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Source</label>
                            <input type="text" value={factSource} onChange={(e) => setFactSource(e.target.value)}
                                placeholder="Source or attribution" className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                        </div>
                    </>
                );

            case "riddle":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Riddle Question *</label>
                            <textarea value={riddleQuestion} onChange={(e) => setRiddleQuestion(e.target.value)}
                                placeholder="What has keys but no locks?" rows={3}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Answer *</label>
                            <input type="text" value={riddleAnswer} onChange={(e) => setRiddleAnswer(e.target.value)}
                                placeholder="A piano!" className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Hint (optional)</label>
                            <input type="text" value={riddleHint} onChange={(e) => setRiddleHint(e.target.value)}
                                placeholder="Think about music..." className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                        </div>
                    </>
                );

            case "joke":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Setup *</label>
                            <textarea value={jokeSetup} onChange={(e) => setJokeSetup(e.target.value)}
                                placeholder="Why did the chicken cross the road?" rows={2}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Punchline *</label>
                            <input type="text" value={jokePunchline} onChange={(e) => setJokePunchline(e.target.value)}
                                placeholder="To get to the other side!" className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" required />
                        </div>
                    </>
                );

            case "thought_provoking":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Thought Text *</label>
                            <textarea value={thoughtText} onChange={(e) => setThoughtText(e.target.value)}
                                placeholder="A thought provoking statement or question..." rows={4}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Source / Author</label>
                            <input type="text" value={thoughtSource} onChange={(e) => setThoughtSource(e.target.value)}
                                placeholder="Author or source" className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                        </div>
                    </>
                );

            case "visual":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Visual Type</label>
                            <select value={visualType} onChange={(e) => setVisualType(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]">
                                <option value="image">Image</option>
                                <option value="breathing">Breathing Exercise</option>
                                <option value="animation">Animation</option>
                            </select>
                        </div>
                        {visualType === "image" && (
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Image URL</label>
                                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://..." className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                            </div>
                        )}
                    </>
                );

            case "share_card":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Share Text *</label>
                            <textarea value={shareText} onChange={(e) => setShareText(e.target.value)}
                                placeholder="An encouraging message to share..." rows={3}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Mood</label>
                            <select value={shareMood} onChange={(e) => setShareMood(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]">
                                <option value="happy">Happy</option>
                                <option value="sad">Sad</option>
                                <option value="grateful">Grateful</option>
                                <option value="anxious">Anxious</option>
                                <option value="lonely">Lonely</option>
                                <option value="angry">Angry</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Image URL (optional)</label>
                            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://..." className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                        </div>
                    </>
                );

            case "marketing":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Body Text *</label>
                            <textarea value={body} onChange={(e) => setBody(e.target.value)}
                                placeholder="Marketing message..." rows={4}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">CTA Text</label>
                                <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)}
                                    placeholder="Learn More" className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">CTA URL</label>
                                <input type="url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)}
                                    placeholder="https://..." className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Image URL</label>
                            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://..." className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                        </div>
                    </>
                );

            case "upgrade":
                return (
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Upgrade Message</label>
                        <textarea value={upgradeMessage} onChange={(e) => setUpgradeMessage(e.target.value)}
                            placeholder="Support the movement and unlock everything..." rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none" />
                    </div>
                );

            case "journal_prompt":
                return (
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Journal Prompt *</label>
                        <textarea value={journalPromptText} onChange={(e) => setJournalPromptText(e.target.value)}
                            placeholder="What are you grateful for today?" rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none" required />
                    </div>
                );

            case "milestone":
                return (
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Milestone Message</label>
                        <textarea value={body} onChange={(e) => setBody(e.target.value)}
                            placeholder="Congratulations on reaching this milestone!" rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none" />
                    </div>
                );

            case "quiz":
            case "game":
                return (
                    <div className="text-center py-8 bg-[var(--secondary)]/30 rounded-lg border-2 border-dashed border-[var(--border)]">
                        <p className="text-[var(--muted-foreground)] mb-2">
                            {type.charAt(0).toUpperCase() + type.slice(1)} content requires a dedicated editor
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            Use the specialized {type} creator
                        </p>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-8 text-[var(--muted-foreground)]">
                        Content type &ldquo;{type}&rdquo; editor coming soon
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
                                        <optgroup label="Core Content">
                                            <option value="verse">Verse</option>
                                            <option value="devotional">Devotional</option>
                                            <option value="article">Article</option>
                                            <option value="prayer">Prayer</option>
                                            <option value="motivational">Motivational</option>
                                        </optgroup>
                                        <optgroup label="Interactive">
                                            <option value="quiz">Quiz</option>
                                            <option value="game">Game</option>
                                            <option value="task">Task</option>
                                            <option value="journal">Journal</option>
                                        </optgroup>
                                        <optgroup label="Fun &amp; Engagement">
                                            <option value="meme">Meme</option>
                                            <option value="fact">Fact</option>
                                            <option value="riddle">Riddle</option>
                                            <option value="joke">Joke</option>
                                            <option value="thought_provoking">Thought Provoking</option>
                                            <option value="visual">Visual / Relax</option>
                                            <option value="share_card">Share Card</option>
                                        </optgroup>
                                        <optgroup label="Special Cards">
                                            <option value="marketing">Marketing</option>
                                            <option value="milestone">Milestone</option>
                                            <option value="upgrade">Upgrade Prompt</option>
                                            <option value="journal_prompt">Journal Prompt</option>
                                        </optgroup>
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

                                {/* Category Selection */}
                                <div className="pt-4 border-t border-[var(--border)]">
                                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                        Category
                                    </label>
                                    <select
                                        value={categoryId || ""}
                                        onChange={(e) => setCategoryId(e.target.value || null)}
                                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                                    >
                                        <option value="">No category (auto-detect by type)</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.emoji} {cat.display_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Featured / Trending / Pin Controls */}
                                <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                                    <h4 className="text-sm font-semibold text-[var(--foreground)]">Visibility & Placement</h4>

                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
                                            className="w-4 h-4 rounded" />
                                        <label htmlFor="isFeatured" className="text-sm font-medium text-[var(--foreground)]">
                                            ⭐ Featured (shows in featured section)
                                        </label>
                                    </div>
                                    {isFeatured && (
                                        <div className="grid grid-cols-2 gap-4 pl-7">
                                            <div>
                                                <label className="block text-xs text-[var(--muted-foreground)] mb-1">Featured Start</label>
                                                <input type="date" value={featuredStart} onChange={(e) => setFeaturedStart(e.target.value)}
                                                    className="w-full px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[var(--muted-foreground)] mb-1">Featured End</label>
                                                <input type="date" value={featuredEnd} onChange={(e) => setFeaturedEnd(e.target.value)}
                                                    className="w-full px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="isTrending" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)}
                                            className="w-4 h-4 rounded" />
                                        <label htmlFor="isTrending" className="text-sm font-medium text-[var(--foreground)]">
                                            🔥 Trending (shows in trending section)
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="isPinned" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)}
                                            className="w-4 h-4 rounded" />
                                        <label htmlFor="isPinned" className="text-sm font-medium text-[var(--foreground)]">
                                            📌 Pin in Feed (set position and date range)
                                        </label>
                                    </div>
                                    {isPinned && (
                                        <div className="space-y-3 pl-7">
                                            <div>
                                                <label className="block text-xs text-[var(--muted-foreground)] mb-1">Pin Position (1 = top of feed)</label>
                                                <input type="number" min={1} max={30} value={pinPosition || ""} onChange={(e) => setPinPosition(parseInt(e.target.value) || null)}
                                                    placeholder="e.g. 3" className="w-full px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-[var(--muted-foreground)] mb-1">Pin Start</label>
                                                    <input type="date" value={pinStart} onChange={(e) => setPinStart(e.target.value)}
                                                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-[var(--muted-foreground)] mb-1">Pin End</label>
                                                    <input type="date" value={pinEnd} onChange={(e) => setPinEnd(e.target.value)}
                                                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
