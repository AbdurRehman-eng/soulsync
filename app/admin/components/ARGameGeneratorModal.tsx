"use client";

import { useState } from "react";
import { X, Loader2, Sparkles, Gamepad2, AlertCircle, Lightbulb, Code2, Eye } from "lucide-react";
import { SandboxedIframe } from "@/components/sandbox/SandboxedIframe";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";
import type { ARGameConfig, ARGameType } from "@/types";

interface ARGameGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface GameSuggestion {
  title: string;
  description: string;
  arType: ARGameType;
}

export function ARGameGeneratorModal({
  isOpen,
  onClose,
  onSuccess,
}: ARGameGeneratorModalProps) {
  const [step, setStep] = useState<"input" | "review" | "suggestions" | "raw_html">("input");
  const [theme, setTheme] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Raw HTML game mode
  const [rawHtmlContent, setRawHtmlContent] = useState("");
  const [showRawPreview, setShowRawPreview] = useState(false);
  const [rawMaxScore, setRawMaxScore] = useState(200);

  // Generated content
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [arType, setArType] = useState<ARGameType>("balloon_pop");
  const [arConfig, setArConfig] = useState<ARGameConfig>({
    objectType: "balloon",
    objectColor: "#fbbf24",
    spawnRate: 5,
    gameTime: 60,
    targetScore: 100,
    difficulty: "medium",
    soundEnabled: true,
    hapticEnabled: true,
    theme: "colorful",
    specialEffects: ["particles"],
  });
  const [pointsReward, setPointsReward] = useState(20);
  const [maxScore, setMaxScore] = useState(200);

  // Too complex
  const [complexityReason, setComplexityReason] = useState("");
  const [suggestions, setSuggestions] = useState<GameSuggestion[]>([]);

  const supabase = createClient();

  const handleGenerate = async () => {
    if (!theme.trim()) {
      toast.error("Please enter a game theme");
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch("/api/admin/generate-ar-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          difficulty,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate AR game");
      }

      // Check if game is too complex
      if (result.tooComplex) {
        setComplexityReason(result.reason);
        setSuggestions(result.suggestions || []);
        setStep("suggestions");
        toast("Game is too complex. Check out simpler alternatives!", {
          icon: "💡",
        });
      } else {
        // Game successfully generated
        setTitle(result.data.title);
        setSubtitle(result.data.subtitle);
        setInstructions(result.data.instructions);
        setArType(result.data.arType);
        setArConfig(result.data.arConfig);
        setPointsReward(result.data.pointsReward);
        setMaxScore(result.data.maxScore);
        setStep("review");
        toast.success("AR game generated! Review and edit as needed.");
      }
    } catch (error: any) {
      console.error("AR game generation error:", error);
      toast.error(error.message || "Failed to generate AR game");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !instructions.trim()) {
      toast.error("Title and instructions are required");
      return;
    }

    setSaving(true);

    try {
      // Create the card
      const { data: card, error: cardError } = await supabase
        .from("cards")
        .insert({
          type: "game",
          title: title.trim(),
          subtitle: subtitle.trim() || null,
          content: {
            description: instructions,
          },
          points_reward: pointsReward,
          min_membership_level: 1,
          is_active: true,
        })
        .select()
        .single();

      if (cardError) throw cardError;

      // Create the game entry
      const { error: gameError } = await supabase
        .from("games")
        .insert({
          card_id: card.id,
          html_content: "", // Not used for AR games
          difficulty,
          instructions,
          max_score: maxScore,
          is_ar_game: true,
          ar_type: arType,
          ar_config: arConfig,
        });

      if (gameError) throw gameError;

      toast.success("AR game created successfully!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("AR game save error:", error);
      toast.error(error.message || "Failed to save AR game");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRawHtml = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!rawHtmlContent.trim()) {
      toast.error("HTML content is required");
      return;
    }

    setSaving(true);

    try {
      const { data: card, error: cardError } = await supabase
        .from("cards")
        .insert({
          type: "game",
          title: title.trim(),
          subtitle: subtitle.trim() || null,
          content: { description: instructions || "Play the game!" },
          points_reward: pointsReward,
          min_membership_level: 1,
          is_active: true,
        })
        .select()
        .single();

      if (cardError) throw cardError;

      const { error: gameError } = await supabase.from("games").insert({
        card_id: card.id,
        html_content: rawHtmlContent,
        difficulty,
        instructions: instructions || null,
        max_score: rawMaxScore,
        is_ar_game: false,
        ar_type: null,
        ar_config: null,
      });

      if (gameError) throw gameError;

      toast.success("HTML game created successfully!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("Raw HTML game save error:", error);
      toast.error(error.message || "Failed to save game");
    } finally {
      setSaving(false);
    }
  };

  const handleSuggestionSelect = (suggestion: GameSuggestion) => {
    setTheme(suggestion.title);
    setStep("input");
    toast("Try generating this game instead!", { icon: "✨" });
  };

  const handleClose = () => {
    setStep("input");
    setTheme("");
    setTitle("");
    setSubtitle("");
    setInstructions("");
    setArType("balloon_pop");
    setDifficulty("medium");
    setComplexityReason("");
    setSuggestions([]);
    setRawHtmlContent("");
    setShowRawPreview(false);
    setRawMaxScore(200);
    onClose();
  };

  const updateArConfig = (field: keyof ARGameConfig, value: any) => {
    setArConfig({ ...arConfig, [field]: value });
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-4xl p-6 relative my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Gamepad2 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--foreground)]">
                      AR Game Generator
                    </h2>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {step === "input" && "Generate a simple AR game with AI"}
                      {step === "review" && "Review and edit your AR game"}
                      {step === "suggestions" && "Game too complex - try these alternatives"}
                      {step === "raw_html" && "Create a game from raw HTML/JS"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Input Step */}
              {step === "input" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                      Game Theme *
                    </label>
                    <input
                      type="text"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      placeholder="E.g., Pop gratitude balloons, Catch blessings from heaven..."
                      className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                      autoFocus
                    />
                    <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                      Keep it simple! Complex games will be flagged with simpler alternatives.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) =>
                        setDifficulty(e.target.value as "easy" | "medium" | "hard")
                      }
                      className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                    >
                      <option value="easy">Easy - Slow pace, low targets</option>
                      <option value="medium">Medium - Moderate challenge</option>
                      <option value="hard">Hard - Fast pace, high targets</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-500 mb-1">Simple AR Games Only</h3>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          Our AI generates simple, tap-based AR games like balloon popping, target tapping,
                          and object catching. Complex games requiring 3D navigation or detailed animations
                          will be flagged with simpler alternatives.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={generating || !theme.trim()}
                    className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Generating AR Game...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Generate AR Game with AI
                      </>
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[var(--border)]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-[var(--card)] px-2 text-[var(--muted-foreground)]">or</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("raw_html")}
                    className="w-full px-6 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)]/30 transition-colors flex items-center justify-center gap-2 text-[var(--muted-foreground)]"
                  >
                    <Code2 size={20} />
                    Create from Raw HTML / JavaScript
                  </button>
                </div>
              )}

              {/* Raw HTML Game Step */}
              {step === "raw_html" && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm">
                    <p className="text-blue-400 font-medium mb-1">Sandboxed HTML Game</p>
                    <p className="text-[var(--muted-foreground)] text-xs">
                      The HTML runs in an isolated Blob URL iframe with strict CSP. Use
                      <code className="bg-[var(--secondary)] px-1 rounded mx-1">SoulSync.postScore(n)</code> and
                      <code className="bg-[var(--secondary)] px-1 rounded mx-1">SoulSync.complete(n)</code> to
                      report score/completion.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Game Title *</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        placeholder="My Custom Game" className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Points Reward</label>
                      <input type="number" value={pointsReward} onChange={(e) => setPointsReward(parseInt(e.target.value) || 20)}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Subtitle</label>
                    <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-[var(--foreground)]">Game HTML *</label>
                      <button type="button" onClick={() => setShowRawPreview(!showRawPreview)}
                        className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline">
                        {showRawPreview ? <Code2 size={14} /> : <Eye size={14} />}
                        {showRawPreview ? "Code" : "Preview"}
                      </button>
                    </div>
                    {showRawPreview ? (
                      <div className="w-full h-72 rounded-lg overflow-hidden border border-[var(--border)]">
                        <SandboxedIframe htmlContent={rawHtmlContent} title="Game Preview" className="w-full h-full" />
                      </div>
                    ) : (
                      <textarea
                        value={rawHtmlContent}
                        onChange={(e) => setRawHtmlContent(e.target.value)}
                        placeholder={'<!DOCTYPE html>\n<html>\n<head><style>/* styles */</style></head>\n<body>\n  <!-- game -->\n  <script>\n    // SoulSync.postScore(n)\n    // SoulSync.complete(n)\n  </script>\n</body>\n</html>'}
                        rows={14}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] font-mono text-xs resize-none"
                        spellCheck={false}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Difficulty</label>
                      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Max Score</label>
                      <input type="number" value={rawMaxScore} onChange={(e) => setRawMaxScore(parseInt(e.target.value) || 200)}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Instructions</label>
                      <input type="text" value={instructions} onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Tap to score!" className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 sticky bottom-0 bg-[var(--card)] pb-2">
                    <button onClick={() => setStep("input")}
                      className="flex-1 px-4 py-3 rounded-lg bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-[var(--foreground)] transition-colors">
                      Back
                    </button>
                    <button onClick={handleSaveRawHtml} disabled={saving}
                      className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {saving ? (
                        <><Loader2 className="animate-spin" size={18} /> Saving...</>
                      ) : (
                        "Create HTML Game"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Suggestions Step (Too Complex) */}
              {step === "suggestions" && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-orange-500 mb-1">Game Too Complex</h3>
                        <p className="text-sm text-[var(--foreground)]">{complexityReason}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-semibold text-[var(--foreground)]">
                        Try These Simpler Alternatives Instead
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className="w-full p-4 rounded-lg bg-[var(--secondary)]/30 border border-[var(--border)] hover:bg-[var(--secondary)]/50 transition-colors text-left"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-[var(--foreground)] mb-1">
                                {suggestion.title}
                              </h4>
                              <p className="text-sm text-[var(--muted-foreground)] mb-2">
                                {suggestion.description}
                              </p>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-500">
                                {suggestion.arType.replace(/_/g, " ").toUpperCase()}
                              </span>
                            </div>
                            <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep("input")}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-[var(--foreground)] transition-colors"
                  >
                    Back to Input
                  </button>
                </div>
              )}

              {/* Review Step */}
              {step === "review" && (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                        Game Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                        Points Reward
                      </label>
                      <input
                        type="number"
                        value={pointsReward}
                        onChange={(e) => setPointsReward(parseInt(e.target.value) || 20)}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                      Instructions *
                    </label>
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
                    />
                  </div>

                  {/* AR Configuration */}
                  <div className="p-4 rounded-lg bg-[var(--secondary)]/30 border border-[var(--border)]">
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">AR Configuration</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                          AR Type
                        </label>
                        <select
                          value={arType}
                          onChange={(e) => setArType(e.target.value as ARGameType)}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm"
                        >
                          <option value="balloon_pop">Balloon Pop</option>
                          <option value="target_tap">Target Tap</option>
                          <option value="catch_game">Catch Game</option>
                          <option value="memory_match">Memory Match</option>
                          <option value="reaction_time">Reaction Time</option>
                          <option value="spatial_puzzle">Spatial Puzzle</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                          Object Type
                        </label>
                        <select
                          value={arConfig.objectType}
                          onChange={(e) => updateArConfig("objectType", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm"
                        >
                          <option value="balloon">Balloon</option>
                          <option value="target">Target</option>
                          <option value="coin">Coin</option>
                          <option value="star">Star</option>
                          <option value="gift">Gift</option>
                          <option value="heart">Heart</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                          Object Color
                        </label>
                        <input
                          type="color"
                          value={arConfig.objectColor}
                          onChange={(e) => updateArConfig("objectColor", e.target.value)}
                          className="w-full h-10 rounded-lg bg-[var(--background)] border border-[var(--border)] cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                          Theme
                        </label>
                        <select
                          value={arConfig.theme}
                          onChange={(e) => updateArConfig("theme", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm"
                        >
                          <option value="colorful">Colorful</option>
                          <option value="minimal">Minimal</option>
                          <option value="nature">Nature</option>
                          <option value="spiritual">Spiritual</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                          Spawn Rate (1-10)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={arConfig.spawnRate}
                          onChange={(e) => updateArConfig("spawnRate", parseInt(e.target.value))}
                          className="w-full"
                        />
                        <span className="text-sm text-[var(--muted-foreground)]">
                          {arConfig.spawnRate}
                        </span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                          Game Time (seconds)
                        </label>
                        <input
                          type="number"
                          min="30"
                          max="120"
                          value={arConfig.gameTime}
                          onChange={(e) => updateArConfig("gameTime", parseInt(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                          Target Score
                        </label>
                        <input
                          type="number"
                          min="50"
                          max="1000"
                          value={arConfig.targetScore}
                          onChange={(e) => updateArConfig("targetScore", parseInt(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                          Max Score
                        </label>
                        <input
                          type="number"
                          value={maxScore}
                          onChange={(e) => setMaxScore(parseInt(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={arConfig.soundEnabled}
                          onChange={(e) => updateArConfig("soundEnabled", e.target.checked)}
                          className="rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                        <span className="text-sm text-[var(--foreground)]">Sound Enabled</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={arConfig.hapticEnabled}
                          onChange={(e) => updateArConfig("hapticEnabled", e.target.checked)}
                          className="rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                        <span className="text-sm text-[var(--foreground)]">Haptic Feedback</span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 sticky bottom-0 bg-[var(--card)] pb-2">
                    <button
                      onClick={() => setStep("input")}
                      className="flex-1 px-4 py-3 rounded-lg bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-[var(--foreground)] transition-colors"
                    >
                      Back to Input
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Saving...
                        </>
                      ) : (
                        "Create AR Game"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
