"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Mascot } from "@/components/mascot/Mascot";
import type { MascotState } from "@/components/mascot/Mascot";
import type { Card, QuizQuestion } from "@/types";

const PREVIEW_LIMIT = 3;

const correctMessages = [
  "Amazing!",
  "You got it!",
  "Brilliant!",
  "Nailed it!",
  "Well done!",
  "Awesome!",
  "Perfect!",
];

const wrongMessages = [
  "Keep going!",
  "Almost!",
  "Don't give up!",
  "Next one!",
  "You'll get it!",
];

function randomFrom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface QuizCardProps {
  card: Card;
  isLocked: boolean;
}

type Phase = "preview" | "loading" | "playing" | "prompt";

export function QuizCard({ card, isLocked }: QuizCardProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [phase, setPhase] = useState<Phase>("preview");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const prefetchedRef = useRef(false);

  // Mascot state
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotSpeech, setMascotSpeech] = useState("");
  const mascotTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear mascot timer on unmount
  useEffect(() => {
    return () => {
      if (mascotTimerRef.current) clearTimeout(mascotTimerRef.current);
    };
  }, []);

  // Reset mascot to thinking when a new question appears
  useEffect(() => {
    if (phase === "playing" && selectedAnswer === null) {
      setMascotState("thinking");
      setMascotSpeech("");
    }
  }, [phase, currentQuestion, selectedAnswer]);

  // Prefetch quiz data on mount so it's ready when user clicks
  useEffect(() => {
    if (isLocked || prefetchedRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("quizzes")
          .select("id, quiz_questions(*)")
          .eq("card_id", card.id)
          .order("sort_order", {
            ascending: true,
            referencedTable: "quiz_questions",
          })
          .limit(PREVIEW_LIMIT, { referencedTable: "quiz_questions" })
          .single();

        if (cancelled || error || !data) return;

        const fetched = (data as any).quiz_questions as QuizQuestion[];
        if (!fetched || fetched.length === 0) return;

        supabase
          .from("quiz_questions")
          .select("*", { count: "exact", head: true })
          .eq("quiz_id", data.id)
          .then(({ count }) => {
            if (!cancelled) setTotalQuestions(count ?? fetched.length);
          });

        if (!cancelled) {
          setQuestions(fetched);
          prefetchedRef.current = true;
        }
      } catch {
        // Prefetch failed silently
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [card.id, isLocked, supabase]);

  const handleStartPreview = async () => {
    if (isLocked) return;

    if (prefetchedRef.current && questions.length > 0) {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setScore(0);
      setPhase("playing");
      return;
    }

    setPhase("loading");

    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("id, quiz_questions(*)")
        .eq("card_id", card.id)
        .order("sort_order", {
          ascending: true,
          referencedTable: "quiz_questions",
        })
        .limit(PREVIEW_LIMIT, { referencedTable: "quiz_questions" })
        .single();

      if (error || !data) throw new Error("Quiz not found");

      const fetched = (data as any).quiz_questions as QuizQuestion[];
      if (!fetched || fetched.length === 0) throw new Error("No questions");

      const { count } = await supabase
        .from("quiz_questions")
        .select("*", { count: "exact", head: true })
        .eq("quiz_id", data.id);

      setTotalQuestions(count ?? fetched.length);
      setQuestions(fetched);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setScore(0);
      setPhase("playing");
    } catch {
      router.push(`/quiz/${card.id}`);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = index === questions[currentQuestion].correct_answer;

    if (isCorrect) {
      setScore((s) => s + 1);
      setMascotState("celebrate");
      setMascotSpeech(randomFrom(correctMessages));
    } else {
      setMascotState("wrong");
      setMascotSpeech(randomFrom(wrongMessages));
    }

    // Return mascot to idle after feedback
    if (mascotTimerRef.current) clearTimeout(mascotTimerRef.current);
    mascotTimerRef.current = setTimeout(() => {
      setMascotState("idle");
      setMascotSpeech("");
    }, 2000);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
    } else {
      setPhase("prompt");
    }
  };

  const handleReset = () => {
    setPhase("preview");
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setMascotState("idle");
    setMascotSpeech("");
  };

  const goToFullQuiz = () => {
    router.push(`/quiz/${card.id}`);
  };

  // ─── LOADING ────────────────────────────────────────────────────────

  if (phase === "loading") {
    return (
      <div className="min-h-full flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-purple-500">
            Quiz
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Mascot state="thinking" size="sm" showSpeechBubble speechText="Loading..." />
        </div>
      </div>
    );
  }

  // ─── PLAYING (inline preview questions) ─────────────────────────────

  if (phase === "playing") {
    const question = questions[currentQuestion];
    const hasAnswered = selectedAnswer !== null;

    return (
      <div className="min-h-full flex flex-col overflow-hidden">
        {/* Header with progress + mascot */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-purple-500">
              Quick Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Mascot in header — small, reactive */}
            <div className="flex-shrink-0">
              <Mascot
                state={mascotState}
                size="sm"
                showSpeechBubble={!!mascotSpeech}
                speechText={mascotSpeech}
              />
            </div>
            <div className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-500 text-xs font-medium">
              {score}/{currentQuestion + (hasAnswered ? 1 : 0)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-3">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-colors ${
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
        <div className="flex-1 overflow-y-auto min-h-0 px-1">
          {/* Question */}
          <motion.p
            key={currentQuestion}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm sm:text-base font-semibold mb-3"
          >
            {question.question}
          </motion.p>

          {/* Options */}
          <div className="space-y-2">
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
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => handleAnswer(index)}
                  disabled={hasAnswered}
                  className={`w-full p-2.5 sm:p-3 rounded-xl text-left transition-all text-xs sm:text-sm flex items-center gap-2 ${optionStyle}`}
                >
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      hasAnswered && isCorrect
                        ? "bg-green-500 text-white"
                        : hasAnswered && isSelected && !isCorrect
                        ? "bg-red-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {hasAnswered && isCorrect ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : hasAnswered && isSelected && !isCorrect ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  <span className="flex-1 leading-snug">{option}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {hasAnswered && question.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-3 rounded-xl mt-2"
              >
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  <span className="font-medium text-purple-500">Why? </span>
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Next button */}
        <AnimatePresence>
          {hasAnswered && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="pt-2 flex-shrink-0"
            >
              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold shadow-lg active:scale-[0.98] transition-transform"
              >
                {currentQuestion < questions.length - 1
                  ? "Next"
                  : "See Results"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── PROMPT (post-preview summary) ──────────────────────────────────

  if (phase === "prompt") {
    const percentage = Math.round((score / questions.length) * 100);
    const hasMore = totalQuestions > questions.length;

    const promptMascotState: MascotState =
      percentage === 100
        ? "celebrate"
        : percentage >= 70
        ? "happy"
        : percentage >= 50
        ? "idle"
        : "sad";

    const promptSpeech =
      percentage === 100
        ? "Perfect score!"
        : percentage >= 70
        ? "Great job!"
        : percentage >= 50
        ? "Not bad! Keep going!"
        : "Don't worry, try the full quiz!";

    return (
      <div className="min-h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-purple-500">
            Quiz Preview
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center min-h-0 px-2">
          {/* Mascot with reaction */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-2"
          >
            <Mascot
              state={promptMascotState}
              size="sm"
              showSpeechBubble
              speechText={promptSpeech}
            />
          </motion.div>

          {/* Score */}
          <div
            className={`px-4 py-1.5 rounded-full text-sm font-bold mb-1 ${
              percentage >= 70
                ? "bg-green-500/20 text-green-500"
                : percentage >= 50
                ? "bg-yellow-500/20 text-yellow-500"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {score}/{questions.length} — {percentage}%
          </div>

          {hasMore && (
            <p className="text-xs text-muted-foreground mb-3 max-w-[200px]">
              That was just a preview! The full quiz has{" "}
              <span className="font-semibold text-foreground">
                {totalQuestions} questions
              </span>{" "}
              and you can earn{" "}
              <span className="font-semibold text-accent">
                +{card.points_reward} pts
              </span>
            </p>
          )}

          {!hasMore && (
            <p className="text-xs text-muted-foreground mb-3">
              Take the full quiz to earn{" "}
              <span className="font-semibold text-accent">
                +{card.points_reward} pts
              </span>
            </p>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col gap-2 w-full max-w-[220px]">
            <motion.button
              onClick={goToFullQuiz}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold shadow-lg"
              whileTap={{ scale: 0.95 }}
            >
              Take Full Quiz
              <ChevronRight className="w-4 h-4" />
            </motion.button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── PREVIEW (default — original card) ──────────────────────────────

  return (
    <div className="min-h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-purple-500">
            Quiz
          </span>
        </div>
      </div>

      {/* Quiz preview */}
      <div className="flex-1 flex flex-col justify-center items-center text-center min-h-0 px-2">
        {/* Mascot replaces trophy */}
        <div className="mb-3">
          <Mascot
            state="power-up"
            size="sm"
            showSpeechBubble
            speechText="Ready to test your knowledge?"
          />
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold mb-1">{card.title}</h3>
        {card.subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 max-w-xs">
            {card.subtitle}
          </p>
        )}

        {/* Points indicator */}
        {card.points_reward > 0 && (
          <div className="mb-3 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
            Earn +{card.points_reward} pts
          </div>
        )}

        {/* Take Quiz button */}
        <motion.button
          onClick={handleStartPreview}
          disabled={isLocked}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          whileTap={{ scale: 0.95 }}
        >
          Take Quiz
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
