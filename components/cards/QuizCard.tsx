"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Trophy, Info, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Card, Quiz, QuizQuestion } from "@/types";

interface QuizCardProps {
  card: Card;
  isLocked: boolean;
}

export function QuizCard({ card, isLocked }: QuizCardProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizData() {
      const supabase = createClient();

      // Fetch quiz
      const { data: quizData } = await supabase
        .from("quizzes")
        .select("*")
        .eq("card_id", card.id)
        .single();

      if (quizData) {
        setQuiz(quizData);

        // Fetch questions
        const { data: questionsData } = await supabase
          .from("quiz_questions")
          .select("*")
          .eq("quiz_id", quizData.id)
          .order("sort_order", { ascending: true });

        if (questionsData) {
          setQuestions(questionsData);
        }
      }

      setLoading(false);
    }

    fetchQuizData();
  }, [card.id]);

  return (
    <div className="min-h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-purple-500">Quiz</span>
        </div>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="p-1 sm:p-2 rounded-full hover:bg-muted/50 transition-colors"
        >
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Instructions popup */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-2 mb-2 text-xs"
          >
            <p className="text-muted-foreground">
              Answer all questions correctly to earn points.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz preview */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading quiz...</div>
        </div>
      ) : !isStarted ? (
        <div className="flex-1 flex flex-col justify-center items-center text-center min-h-0">
          {/* Trophy icon */}
          <motion.div
            className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="w-7 sm:w-8 h-7 sm:h-8 text-white" />
          </motion.div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold mb-1">{card.title}</h3>
          {card.subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">{card.subtitle}</p>
          )}

          {/* Quiz info */}
          {questions.length > 0 && (
            <div className="mb-2 text-xs text-muted-foreground">
              {questions.length} {questions.length === 1 ? "question" : "questions"}
              {quiz?.difficulty && ` • ${quiz.difficulty}`}
            </div>
          )}

          {/* Points indicator */}
          {card.points_reward > 0 && (
            <div className="mb-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
              +{card.points_reward} pts
            </div>
          )}

          {/* Start button */}
          <motion.button
            onClick={() => setIsStarted(true)}
            disabled={questions.length === 0}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.95 }}
          >
            Start
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      ) : (
        <QuizGame questions={questions} card={card} />
      )}
    </div>
  );
}

// Simple quiz game component
function QuizGame({ questions, card }: { questions: QuizQuestion[]; card: Card }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setIsComplete(true);
      }
    }, 2500);
  };

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl mb-4"
        >
          {percentage === 100 ? "🎉" : percentage >= 70 ? "👏" : percentage >= 50 ? "👍" : "💪"}
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
        <p className="text-muted-foreground mb-1">
          You got {score} out of {questions.length} correct
        </p>
        <p className="text-sm text-muted-foreground">
          {percentage}% accuracy
        </p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-full flex flex-col overflow-hidden">
      {/* Progress */}
      <div className="flex gap-1 mb-4">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full ${
              i < currentQuestion
                ? "bg-green-500"
                : i === currentQuestion
                ? "bg-primary"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <h4 className="text-base sm:text-lg font-semibold mb-4">{question.question}</h4>

      {/* Options */}
      <div className="space-y-2 sm:space-y-3 mb-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => selectedAnswer === null && handleAnswer(index)}
            className={`w-full p-3 sm:p-4 rounded-xl text-left transition-all text-sm sm:text-base ${
              selectedAnswer === null
                ? "glass-card hover:border-primary"
                : selectedAnswer === index
                ? index === question.correct_answer
                  ? "bg-green-500/20 border-green-500"
                  : "bg-red-500/20 border-red-500"
                : index === question.correct_answer
                ? "bg-green-500/20 border-green-500"
                : "glass-card opacity-50"
            }`}
            whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && question.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-3 text-xs sm:text-sm"
          >
            <p className="font-medium text-primary mb-1">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
