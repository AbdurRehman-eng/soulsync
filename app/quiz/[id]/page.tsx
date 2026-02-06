"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Trophy,
  Clock,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Home,
  RotateCcw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Card, Quiz, QuizQuestion } from "@/types";
import { toast } from "react-hot-toast";

export default function QuizPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  // --- state ---
  const [cardId, setCardId] = useState<string | null>(null);
  const [card, setCard] = useState<Card | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // gameplay
  const [phase, setPhase] = useState<"intro" | "playing" | "complete">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  // Resolve params (Next.js 14+ can pass a Promise)
  useEffect(() => {
    const resolve = async () => {
      const resolved = await Promise.resolve(params);
      setCardId(resolved.id);
    };
    resolve();
  }, [params]);

  // Fetch card + quiz + questions
  useEffect(() => {
    if (!cardId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Card
        const { data: cardData, error: cardErr } = await supabase
          .from("cards")
          .select("*")
          .eq("id", cardId)
          .single();

        if (cardErr || !cardData) throw new Error("Quiz not found");
        setCard(cardData);

        // 2. Quiz
        const { data: quizData, error: quizErr } = await supabase
          .from("quizzes")
          .select("*")
          .eq("card_id", cardId)
          .single();

        if (quizErr || !quizData) throw new Error("Quiz data not found");
        setQuiz(quizData);

        // 3. Questions
        const { data: questionsData, error: qErr } = await supabase
          .from("quiz_questions")
          .select("*")
          .eq("quiz_id", quizData.id)
          .order("sort_order", { ascending: true });

        if (qErr) throw new Error("Failed to load questions");
        if (!questionsData || questionsData.length === 0)
          throw new Error("This quiz has no questions yet");

        setQuestions(questionsData);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load quiz";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cardId, supabase]);

  // --- handlers ---

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(index);
    setShowExplanation(true);

    if (index === questions[currentQuestion].correct_answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    setPhase("complete");

    // Award points
    if (pointsAwarded || !card) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Record interaction
      await supabase.from("card_interactions").insert({
        user_id: user.id,
        card_id: card.id,
        interaction_type: "complete",
      });

      // Award points
      if (card.points_reward > 0) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", user.id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({ points: profile.points + card.points_reward })
            .eq("id", user.id);

          toast.success(`You earned ${card.points_reward} points!`, {
            icon: "🎉",
          });
        }
      }

      setPointsAwarded(true);
    } catch (err) {
      console.error("Failed to award points:", err);
    }
  };

  const handleRetry = () => {
    setPhase("intro");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setPointsAwarded(false);
  };

  const goHome = () => router.push("/");
  const goBack = () => router.back();

  const estimatedTime = Math.ceil((questions.length * 30) / 60);
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // --- loading / error ---

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !card || !quiz || questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center px-6">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-semibold mb-2">
            {error || "Quiz not found"}
          </p>
          <button
            onClick={goHome}
            className="text-primary hover:underline"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  // ─── INTRO SCREEN ───────────────────────────────────────────────────

  if (phase === "intro") {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 flex items-center gap-3 border-b border-border">
          <button
            onClick={goBack}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-lg font-semibold flex-1 truncate">{card.title}</h1>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 text-center">
          {/* Animated trophy */}
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
          {card.subtitle && (
            <p className="text-muted-foreground mb-6 max-w-sm">{card.subtitle}</p>
          )}

          {/* Quiz info card */}
          <div className="glass-card p-4 mb-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm">
                <HelpCircle className="w-4 h-4 text-purple-500" />
                <span>
                  <span className="font-semibold">{questions.length}</span>{" "}
                  {questions.length === 1 ? "question" : "questions"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>~{estimatedTime} min</span>
              </div>
            </div>

            {quiz.difficulty && (
              <div className="text-sm mb-2">
                <span className="text-muted-foreground">Difficulty: </span>
                <span
                  className={`font-medium ${
                    quiz.difficulty === "easy"
                      ? "text-green-500"
                      : quiz.difficulty === "medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {quiz.difficulty.charAt(0).toUpperCase() +
                    quiz.difficulty.slice(1)}
                </span>
              </div>
            )}

            {quiz.instructions && (
              <p className="text-xs text-muted-foreground">{quiz.instructions}</p>
            )}
          </div>

          {/* Points */}
          {card.points_reward > 0 && (
            <div className="mb-6 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium">
              Earn +{card.points_reward} pts
            </div>
          )}

          {/* Start button */}
          <motion.button
            onClick={() => setPhase("playing")}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            Start Quiz
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    );
  }

  // ─── QUIZ COMPLETE SCREEN ───────────────────────────────────────────

  if (phase === "complete") {
    const emoji =
      percentage === 100
        ? "🎉"
        : percentage >= 70
        ? "👏"
        : percentage >= 50
        ? "👍"
        : "💪";

    return (
      <div className="min-h-[100dvh] bg-background flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 flex items-center gap-3 border-b border-border">
          <button
            onClick={goHome}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-lg font-semibold">Quiz Complete</h1>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-7xl mb-6"
          >
            {emoji}
          </motion.div>

          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>

          <p className="text-lg text-muted-foreground mb-1">
            You got{" "}
            <span className="text-foreground font-semibold">{score}</span> out of{" "}
            <span className="text-foreground font-semibold">
              {questions.length}
            </span>{" "}
            correct
          </p>

          <div className="mb-6">
            <span
              className={`text-2xl font-bold ${
                percentage >= 70
                  ? "text-green-500"
                  : percentage >= 50
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {percentage}%
            </span>
            <span className="text-muted-foreground ml-2">accuracy</span>
          </div>

          {/* Score bar */}
          <div className="w-full max-w-xs mb-6">
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-full rounded-full ${
                  percentage >= 70
                    ? "bg-green-500"
                    : percentage >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
            </div>
          </div>

          {card.points_reward > 0 && pointsAwarded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium"
            >
              +{card.points_reward} points earned!
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              onClick={handleRetry}
              className="flex items-center gap-2 px-6 py-3 rounded-full glass-card text-sm font-medium"
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </motion.button>
            <motion.button
              onClick={goHome}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold shadow-lg"
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4" />
              Home
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAYING PHASE ──────────────────────────────────────────────────

  const question = questions[currentQuestion];
  const hasAnswered = selectedAnswer !== null;
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="h-[100dvh] bg-background flex flex-col">
      {/* Fixed header */}
      <div className="flex-shrink-0 p-4 flex items-center gap-3 border-b border-border">
        <button
          onClick={() => {
            if (confirm("Leave the quiz? Your progress will be lost.")) {
              goHome();
            }
          }}
          className="p-2 rounded-full hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold truncate">{card.title}</h1>
          <p className="text-xs text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        <div className="flex-shrink-0 px-3 py-1 rounded-full bg-purple-500/20 text-purple-500 text-xs font-medium">
          {score}/{currentQuestion + (hasAnswered ? 1 : 0)}
        </div>
      </div>

      {/* Fixed progress bar */}
      <div className="flex-shrink-0 flex gap-1 px-4 pt-3 pb-1">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              i < currentQuestion
                ? "bg-green-500"
                : i === currentQuestion
                ? "bg-purple-500"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Scrollable question area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 max-w-lg mx-auto w-full space-y-4">
          {/* Question */}
          <motion.h2
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg sm:text-xl font-semibold"
          >
            {question.question}
          </motion.h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correct_answer;

              let optionStyle =
                "glass-card hover:border-purple-500/50 active:scale-[0.98]";
              if (hasAnswered) {
                if (isCorrect) {
                  optionStyle = "bg-green-500/20 border border-green-500";
                } else if (isSelected && !isCorrect) {
                  optionStyle = "bg-red-500/20 border border-red-500";
                } else {
                  optionStyle = "glass-card opacity-50";
                }
              }

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleAnswer(index)}
                  disabled={hasAnswered}
                  className={`w-full p-3.5 sm:p-4 rounded-xl text-left transition-all text-sm sm:text-base flex items-center gap-3 ${optionStyle}`}
                >
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      hasAnswered && isCorrect
                        ? "bg-green-500 text-white"
                        : hasAnswered && isSelected && !isCorrect
                        ? "bg-red-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {hasAnswered && isCorrect ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : hasAnswered && isSelected && !isCorrect ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  <span className="flex-1">{option}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && question.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-4 rounded-xl"
              >
                <p className="font-medium text-purple-500 mb-1 text-sm">
                  Explanation:
                </p>
                <p className="text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spacer so content isn't hidden behind the fixed bottom bar */}
          {hasAnswered && <div className="h-20" />}
        </div>
      </div>

      {/* Fixed bottom Next button — only visible after answering */}
      <AnimatePresence>
        {hasAnswered && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex-shrink-0 p-4 border-t border-border bg-background/80 backdrop-blur-lg"
          >
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold shadow-lg active:scale-[0.98] transition-transform"
            >
              {isLastQuestion ? "See Results" : "Next Question"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
