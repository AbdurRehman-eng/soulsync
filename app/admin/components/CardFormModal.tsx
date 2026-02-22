"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Loader2, Sparkles, Eye, Code2, Upload, Maximize2, Minimize2, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardType, CardContent, ContentCategory } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { SandboxedIframe } from "@/components/sandbox/SandboxedIframe";
import { FeedCard } from "@/components/cards/FeedCard";
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

    // Raw HTML / JSON for games and quizzes
    const [rawHtmlContent, setRawHtmlContent] = useState("");
    const [rawQuizJson, setRawQuizJson] = useState("");
    const [gameDifficulty, setGameDifficulty] = useState<"easy" | "medium" | "hard">("medium");
    const [gameInstructions, setGameInstructions] = useState("");
    const [gameMaxScore, setGameMaxScore] = useState(200);
    const [showGamePreview, setShowGamePreview] = useState(false);
    const [gamePreviewFullscreen, setGamePreviewFullscreen] = useState(false);
    const [quizJsonError, setQuizJsonError] = useState<string | null>(null);

    // Handle HTML file upload for games
    const handleGameFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.endsWith('.html') && !file.name.endsWith('.htm') && file.type !== 'text/html') {
            toast.error("Please upload an HTML file (.html or .htm)");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File too large. Max 5MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                setRawHtmlContent(content);
                // Auto-extract title from <title> tag if title field is empty
                if (!title) {
                    const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i);
                    if (titleMatch?.[1]) setTitle(titleMatch[1].trim());
                }
                toast.success(`Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
            }
        };
        reader.onerror = () => toast.error("Failed to read file");
        reader.readAsText(file);
        // Reset input so same file can be re-uploaded
        e.target.value = "";
    }, [title]);

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
    const [showLivePreview, setShowLivePreview] = useState(false);
    const supabase = createClient();

    // Build a mock Card object from current form state for live preview
    const buildPreviewCard = useCallback((): Card => {
        const content: CardContent = {};
        switch (type) {
            case "verse":
                content.verse_text = verseText; content.verse_reference = verseReference;
                break;
            case "devotional": case "article":
                content.body = body; content.author = author; content.read_time = readTime;
                break;
            case "prayer":
                content.prayer_text = prayerText;
                break;
            case "motivational":
                content.quote = quote; content.quote_author = quoteAuthor;
                break;
            case "meme":
                content.meme_text_top = memeTextTop; content.meme_text_bottom = memeTextBottom; content.image_url = imageUrl;
                break;
            case "fact":
                content.fact_text = factText; content.fact_source = factSource;
                break;
            case "riddle":
                content.riddle_question = riddleQuestion; content.riddle_answer = riddleAnswer; content.riddle_hint = riddleHint;
                break;
            case "joke":
                content.joke_setup = jokeSetup; content.joke_punchline = jokePunchline;
                break;
            case "thought_provoking":
                content.thought_text = thoughtText; content.thought_source = thoughtSource;
                break;
            case "inspiration":
                content.inspiration_text = body; content.inspiration_author = author;
                break;
            case "task":
                content.description = taskDescription;
                break;
            case "journal":
                content.prompt = journalPrompt;
                break;
            case "visual":
                content.visual_type = visualType;
                break;
            case "share_card":
                content.share_text = shareText; content.share_mood = shareMood;
                break;
            case "milestone":
                content.body = body;
                break;
            case "marketing":
                content.cta_text = ctaText; content.cta_url = ctaUrl; content.image_url = imageUrl;
                break;
            case "upgrade":
                content.upgrade_message = upgradeMessage;
                break;
            case "journal_prompt":
                content.journal_prompt_text = journalPromptText;
                break;
        }
        if (imageUrl) content.image_url = imageUrl;

        return {
            id: card?.id || "preview-card",
            type,
            title: title || "Untitled",
            subtitle: subtitle || null,
            content,
            thumbnail_url: null,
            background_url: null,
            min_membership_level: minMembershipLevel,
            points_reward: pointsReward,
            is_active: isActive,
            is_pinned: isPinned,
            pin_position: pinPosition,
            pin_start: pinStart || null,
            pin_end: pinEnd || null,
            publish_date: null,
            sort_order: 0,
            is_featured: isFeatured,
            is_trending: isTrending,
            featured_start: featuredStart || null,
            featured_end: featuredEnd || null,
            category_id: categoryId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
    }, [type, title, subtitle, verseText, verseReference, body, author, readTime, prayerText, quote, quoteAuthor, memeTextTop, memeTextBottom, factText, factSource, riddleQuestion, riddleAnswer, riddleHint, jokeSetup, jokePunchline, thoughtText, thoughtSource, ctaText, ctaUrl, upgradeMessage, journalPromptText, imageUrl, taskDescription, journalPrompt, visualType, shareText, shareMood, isActive, isPinned, pinPosition, pinStart, pinEnd, isFeatured, isTrending, featuredStart, featuredEnd, categoryId, pointsReward, minMembershipLevel, card]);

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

            // Load inspiration-specific fields into shared body/author state
            if (card.type === "inspiration") {
                setBody(content.inspiration_text || "");
                setAuthor(content.inspiration_author || "");
            }

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

            // Raw HTML / JSON fields - fetched separately for game/quiz types
            setRawHtmlContent("");
            setRawQuizJson("");
            setGameDifficulty("medium");
            setGameInstructions("");
            setGameMaxScore(200);
            setShowGamePreview(false);
            setQuizJsonError(null);

            // If editing a game card, fetch game data
            if (card.type === "game") {
                (async () => {
                    const { data: gameData } = await supabase
                        .from("games")
                        .select("*")
                        .eq("card_id", card.id)
                        .single();
                    if (gameData) {
                        setRawHtmlContent(gameData.html_content || "");
                        setGameDifficulty(gameData.difficulty || "medium");
                        setGameInstructions(gameData.instructions || "");
                        setGameMaxScore(gameData.max_score || 200);
                    }
                })();
            }

            // If editing a quiz card, fetch quiz + questions as JSON
            if (card.type === "quiz") {
                (async () => {
                    const { data: quizData } = await supabase
                        .from("quizzes")
                        .select("*, quiz_questions:quiz_questions(*)")
                        .eq("card_id", card.id)
                        .single();
                    if (quizData) {
                        setGameDifficulty(quizData.difficulty || "medium");
                        setGameInstructions(quizData.instructions || "");
                        const questions = (quizData.quiz_questions || [])
                            .sort((a: any, b: any) => a.sort_order - b.sort_order)
                            .map((q: any) => ({
                                question: q.question,
                                options: q.options,
                                correct_answer: q.correct_answer,
                                explanation: q.explanation,
                                points: q.points,
                            }));
                        setRawQuizJson(JSON.stringify({ questions }, null, 2));
                    }
                })();
            }
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
            setRawHtmlContent("");
            setRawQuizJson("");
            setGameDifficulty("medium");
            setGameInstructions("");
            setGameMaxScore(200);
            setShowGamePreview(false);
            setQuizJsonError(null);
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
            case "inspiration":
                content.inspiration_text = body;
                content.inspiration_author = author;
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

        // Validate quiz JSON before saving
        if (type === "quiz") {
            if (!rawQuizJson.trim()) {
                toast.error("Quiz JSON is required. Paste questions JSON or use the AI Quiz Generator.");
                return;
            }
            try {
                const parsed = JSON.parse(rawQuizJson);
                if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
                    toast.error("Quiz JSON must have a non-empty 'questions' array");
                    return;
                }
            } catch {
                toast.error("Invalid JSON format for quiz");
                return;
            }
        }

        // Validate game HTML before saving
        if (type === "game" && !rawHtmlContent.trim()) {
            toast.error("Game HTML content is required. Paste HTML or upload an .html file.");
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

            let savedCardId: string;

            if (card) {
                // Update existing card
                const { error } = await supabase
                    .from("cards")
                    .update(cardData)
                    .eq("id", card.id);

                if (error) throw error;
                savedCardId = card.id;
                toast.success(`"${title.trim()}" updated successfully`);
            } else {
                // Create new card
                const { data: newCard, error } = await supabase
                    .from("cards")
                    .insert(cardData)
                    .select()
                    .single();

                if (error) throw error;
                savedCardId = newCard.id;
                toast.success(`"${title.trim()}" created successfully`);
            }

            // --- Save game data (raw HTML) ---
            if (type === "game" && rawHtmlContent.trim()) {
                // Upsert: delete existing game record then insert fresh
                await supabase.from("games").delete().eq("card_id", savedCardId);

                const { error: gameError } = await supabase.from("games").insert({
                    card_id: savedCardId,
                    html_content: rawHtmlContent,
                    difficulty: gameDifficulty,
                    instructions: gameInstructions || null,
                    max_score: gameMaxScore,
                    is_ar_game: false,
                    ar_type: null,
                    ar_config: null,
                });
                if (gameError) {
                    console.error("Error saving game data:", gameError);
                    toast.error("Card saved, but game HTML failed to save");
                }
            }

            // --- Save quiz data (raw JSON) ---
            if (type === "quiz" && rawQuizJson.trim()) {
                const parsed = JSON.parse(rawQuizJson);
                const questions = parsed.questions || [];

                // Delete existing quiz + questions
                const { data: existingQuiz } = await supabase
                    .from("quizzes")
                    .select("id")
                    .eq("card_id", savedCardId)
                    .single();

                if (existingQuiz) {
                    await supabase.from("quiz_questions").delete().eq("quiz_id", existingQuiz.id);
                    await supabase.from("quizzes").delete().eq("id", existingQuiz.id);
                }

                // Create new quiz
                const { data: quiz, error: quizError } = await supabase
                    .from("quizzes")
                    .insert({
                        card_id: savedCardId,
                        difficulty: gameDifficulty,
                        instructions: gameInstructions || subtitle || null,
                    })
                    .select()
                    .single();

                if (quizError) {
                    console.error("Error saving quiz:", quizError);
                    toast.error("Card saved, but quiz data failed to save");
                } else if (questions.length > 0) {
                    const questionsData = questions.map((q: any, i: number) => ({
                        quiz_id: quiz.id,
                        question: q.question,
                        options: q.options,
                        correct_answer: q.correct_answer ?? 0,
                        explanation: q.explanation || null,
                        points: q.points ?? Math.ceil(pointsReward / questions.length),
                        sort_order: i,
                    }));

                    const { error: qError } = await supabase
                        .from("quiz_questions")
                        .insert(questionsData);

                    if (qError) {
                        console.error("Error saving quiz questions:", qError);
                        toast.error("Quiz saved, but some questions failed");
                    }
                }
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
            case "inspiration":
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

            case "game":
                return (
                    <>
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm">
                            <p className="text-blue-400 font-medium mb-1">HTML5 Game Editor</p>
                            <p className="text-[var(--muted-foreground)] text-xs">
                                Upload an HTML file or paste raw HTML/CSS/JS. Games run in a sandboxed iframe.
                                Use <code className="bg-[var(--secondary)] px-1 rounded">SoulSync.postScore(n)</code> and
                                <code className="bg-[var(--secondary)] px-1 rounded ml-1">SoulSync.complete(n)</code> to
                                communicate score back to the app.
                            </p>
                        </div>

                        {/* Upload + paste toggle */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-[var(--foreground)]">
                                    Game HTML *
                                </label>
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline cursor-pointer">
                                        <Upload size={14} />
                                        Upload .html
                                        <input
                                            type="file"
                                            accept=".html,.htm,text/html"
                                            onChange={handleGameFileUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    <span className="text-[var(--muted-foreground)] text-xs">|</span>
                                    <button
                                        type="button"
                                        onClick={() => { setShowGamePreview(!showGamePreview); setGamePreviewFullscreen(false); }}
                                        className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                                    >
                                        {showGamePreview ? <Code2 size={14} /> : <Eye size={14} />}
                                        {showGamePreview ? "Code" : "Preview"}
                                    </button>
                                    {showGamePreview && (
                                        <button
                                            type="button"
                                            onClick={() => setGamePreviewFullscreen(!gamePreviewFullscreen)}
                                            className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                                        >
                                            {gamePreviewFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {showGamePreview ? (
                                gamePreviewFullscreen ? (
                                    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
                                        <div className="flex items-center justify-between px-4 py-2 bg-[var(--background)] border-b border-[var(--border)]">
                                            <span className="text-sm font-medium text-[var(--foreground)]">Game Preview (Fullscreen)</span>
                                            <button type="button" onClick={() => setGamePreviewFullscreen(false)}
                                                className="p-1.5 rounded-lg hover:bg-[var(--secondary)] text-[var(--foreground)]">
                                                <Minimize2 size={18} />
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <SandboxedIframe
                                                htmlContent={rawHtmlContent}
                                                title="Game Preview"
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-80 rounded-lg overflow-hidden border border-[var(--border)]">
                                        <SandboxedIframe
                                            htmlContent={rawHtmlContent}
                                            title="Game Preview"
                                            className="w-full h-full"
                                        />
                                    </div>
                                )
                            ) : (
                                <textarea
                                    value={rawHtmlContent}
                                    onChange={(e) => setRawHtmlContent(e.target.value)}
                                    placeholder={'<!DOCTYPE html>\n<html>\n<head>\n  <style>/* styles */</style>\n</head>\n<body>\n  <!-- game content -->\n  <script>\n    // Use SoulSync.postScore(n) and SoulSync.complete(n)\n  </script>\n</body>\n</html>'}
                                    rows={12}
                                    className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] font-mono text-xs resize-none"
                                    spellCheck={false}
                                />
                            )}

                            {rawHtmlContent && (
                                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                    {(new Blob([rawHtmlContent]).size / 1024).toFixed(1)} KB loaded
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Difficulty</label>
                                <select value={gameDifficulty} onChange={(e) => setGameDifficulty(e.target.value as any)}
                                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm">
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Max Score</label>
                                <input type="number" value={gameMaxScore} onChange={(e) => setGameMaxScore(parseInt(e.target.value) || 200)}
                                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Instructions</label>
                                <input type="text" value={gameInstructions} onChange={(e) => setGameInstructions(e.target.value)}
                                    placeholder="Tap objects to score!" className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm" />
                            </div>
                        </div>
                    </>
                );

            case "quiz":
                return (
                    <>
                        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-sm">
                            <p className="text-purple-400 font-medium mb-1">Raw JSON Quiz Editor</p>
                            <p className="text-[var(--muted-foreground)] text-xs">
                                Paste quiz JSON or use the AI Quiz Generator. Format:
                                <code className="block bg-[var(--secondary)] p-2 rounded mt-1 text-[10px] whitespace-pre">
{`{ "questions": [
  { "question": "...", "options": ["A","B","C","D"],
    "correct_answer": 0, "explanation": "..." }
]}`}
                                </code>
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                                Quiz JSON *
                            </label>
                            <textarea
                                value={rawQuizJson}
                                onChange={(e) => {
                                    setRawQuizJson(e.target.value);
                                    try {
                                        if (e.target.value.trim()) {
                                            JSON.parse(e.target.value);
                                            setQuizJsonError(null);
                                        }
                                    } catch (err: any) {
                                        setQuizJsonError(err.message);
                                    }
                                }}
                                placeholder={'{\n  "questions": [\n    {\n      "question": "What is the first book of the Bible?",\n      "options": ["Genesis", "Exodus", "Leviticus", "Numbers"],\n      "correct_answer": 0,\n      "explanation": "Genesis is the first book."\n    }\n  ]\n}'}
                                rows={10}
                                className={`w-full px-4 py-2 rounded-lg bg-[var(--background)] border focus:outline-none focus:ring-2 text-[var(--foreground)] font-mono text-xs resize-none ${
                                    quizJsonError
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-[var(--border)] focus:ring-[var(--primary)]"
                                }`}
                                spellCheck={false}
                            />
                            {quizJsonError && (
                                <p className="text-xs text-red-400 mt-1">JSON Error: {quizJsonError}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Difficulty</label>
                                <select value={gameDifficulty} onChange={(e) => setGameDifficulty(e.target.value as any)}
                                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm">
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Instructions</label>
                                <input type="text" value={gameInstructions} onChange={(e) => setGameInstructions(e.target.value)}
                                    placeholder="Answer all questions correctly" className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm" />
                            </div>
                        </div>
                    </>
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
                                            <option value="inspiration">Inspiration</option>
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

                                {/* Live Preview */}
                                <div className="pt-4 border-t border-[var(--border)]">
                                    <button
                                        type="button"
                                        onClick={() => setShowLivePreview(!showLivePreview)}
                                        className="flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:underline mb-3"
                                    >
                                        <Smartphone size={16} />
                                        {showLivePreview ? "Hide Live Preview" : "Show Live Preview"}
                                    </button>

                                    {showLivePreview && (
                                        <div className="flex justify-center">
                                            <div
                                                className="relative rounded-2xl overflow-hidden border-2 border-[var(--border)] shadow-xl"
                                                style={{ width: 320, height: 460 }}
                                            >
                                                {/* Phone frame header */}
                                                <div className="absolute top-0 left-0 right-0 h-6 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center">
                                                    <div className="w-16 h-1 rounded-full bg-white/30" />
                                                </div>
                                                {/* Card preview */}
                                                <div className="w-full h-full" style={{ background: "var(--background)" }}>
                                                    <div className="w-full h-full p-2 pt-8">
                                                        <div className="feed-card" style={{ height: "100%" }}>
                                                            <FeedCard
                                                                card={buildPreviewCard()}
                                                                index={0}
                                                                isLiked={false}
                                                                onLike={() => {}}
                                                                onShare={() => {}}
                                                                onView={() => {}}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
