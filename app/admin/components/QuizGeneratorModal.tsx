"use client";

import { useState } from "react";
import { X, Loader2, Sparkles, Plus, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

interface QuizGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function QuizGeneratorModal({
  isOpen,
  onClose,
  onSuccess,
}: QuizGeneratorModalProps) {
  const [step, setStep] = useState<"input" | "review">("input");
  const [theme, setTheme] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Generated content
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [pointsReward, setPointsReward] = useState(20);

  const supabase = createClient();

  const handleGenerate = async () => {
    if (!theme.trim()) {
      toast.error("Please enter a theme or topic");
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch("/api/admin/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          numQuestions,
          difficulty,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate quiz");
      }

      setTitle(result.data.title);
      setSubtitle(result.data.subtitle);
      setQuestions(result.data.questions);
      setStep("review");
      toast.success("Quiz generated! Review and edit as needed.");
    } catch (error: any) {
      console.error("Quiz generation error:", error);
      toast.error(error.message || "Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || questions.length === 0) {
      toast.error("Title and at least one question are required");
      return;
    }

    setSaving(true);

    try {
      // Create the card
      const { data: card, error: cardError } = await supabase
        .from("cards")
        .insert({
          type: "quiz",
          title: title.trim(),
          subtitle: subtitle.trim() || null,
          content: {},
          points_reward: pointsReward,
          min_membership_level: 1,
          is_active: true,
        })
        .select()
        .single();

      if (cardError) throw cardError;

      // Create the quiz entry
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          card_id: card.id,
          difficulty,
          instructions: subtitle,
        })
        .select()
        .single();

      if (quizError) throw quizError;

      // Create quiz questions
      const questionsData = questions.map((q, index) => ({
        quiz_id: quiz.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation || null,
        points: Math.ceil(pointsReward / questions.length),
        sort_order: index,
      }));

      const { error: questionsError } = await supabase
        .from("quiz_questions")
        .insert(questionsData);

      if (questionsError) throw questionsError;

      toast.success("Quiz created successfully!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("Quiz save error:", error);
      toast.error(error.message || "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setStep("input");
    setTheme("");
    setTitle("");
    setSubtitle("");
    setQuestions([]);
    setNumQuestions(5);
    setDifficulty("medium");
    onClose();
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correct_answer: 0,
        explanation: "",
      },
    ]);
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
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--foreground)]">
                      AI Quiz Generator
                    </h2>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {step === "input"
                        ? "Generate a quiz with AI"
                        : "Review and edit your quiz"}
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
                      Quiz Theme/Topic *
                    </label>
                    <input
                      type="text"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      placeholder="E.g., Bible knowledge, Christian history, faith basics..."
                      className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                        Number of Questions
                      </label>
                      <select
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                      >
                        <option value={3}>3 questions</option>
                        <option value={5}>5 questions</option>
                        <option value={7}>7 questions</option>
                        <option value={10}>10 questions</option>
                      </select>
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
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={generating || !theme.trim()}
                    className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Generating Quiz...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Generate Quiz with AI
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Review Step */}
              {step === "review" && (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                  {/* Title & Subtitle */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                        Quiz Title *
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

                  {/* Questions */}
                  {questions.map((q, qIndex) => (
                    <div
                      key={qIndex}
                      className="p-4 rounded-lg bg-[var(--secondary)]/30 border border-[var(--border)]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <label className="text-sm font-medium text-[var(--foreground)]">
                          Question {qIndex + 1}
                        </label>
                        <button
                          onClick={() => deleteQuestion(qIndex)}
                          className="p-1 hover:bg-[var(--destructive)]/20 rounded transition-colors"
                        >
                          <Trash2 size={16} className="text-[var(--destructive)]" />
                        </button>
                      </div>

                      <textarea
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(qIndex, "question", e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] mb-3 text-sm resize-none"
                      />

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {q.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={q.correct_answer === oIndex}
                              onChange={() =>
                                updateQuestion(qIndex, "correct_answer", oIndex)
                              }
                              className="text-[var(--primary)] focus:ring-[var(--primary)]"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                updateOption(qIndex, oIndex, e.target.value)
                              }
                              placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm"
                            />
                            {q.correct_answer === oIndex && (
                              <Check size={16} className="text-green-500" />
                            )}
                          </div>
                        ))}
                      </div>

                      <input
                        type="text"
                        value={q.explanation || ""}
                        onChange={(e) =>
                          updateQuestion(qIndex, "explanation", e.target.value)
                        }
                        placeholder="Explanation (optional)"
                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] text-sm"
                      />
                    </div>
                  ))}

                  <button
                    onClick={addQuestion}
                    className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-[var(--border)] hover:bg-[var(--secondary)]/30 transition-colors flex items-center justify-center gap-2 text-[var(--muted-foreground)]"
                  >
                    <Plus size={20} />
                    Add Question
                  </button>

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
                      className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Saving...
                        </>
                      ) : (
                        "Create Quiz"
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
