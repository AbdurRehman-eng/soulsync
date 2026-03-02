"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, BookOpen, Gamepad2, Trophy, Shield, MessageCircle } from "lucide-react";
import Link from "next/link";

const faqSections = [
  {
    category: "Getting Started",
    icon: BookOpen,
    questions: [
      {
        q: "What is Soul Sync?",
        a: "Soul Sync is a faith-based daily devotional app that delivers personalised verses, devotionals, prayers, mini games, quizzes, and more — all in a TikTok-style scrollable feed.",
      },
      {
        q: "How does the daily feed work?",
        a: "Every day, Soul Sync builds a unique 20-card feed based on your mood, preferences, and reading history. Cards include verses, devotionals, prayers, games, quizzes, and more. Just scroll through like a social media feed!",
      },
      {
        q: "How do I track my mood?",
        a: "When you first open the app each day, you'll be prompted to select your current mood. This helps personalise your daily content. You can also tap the mood icon in the navigation to update it anytime.",
      },
    ],
  },
  {
    category: "Games & Quizzes",
    icon: Gamepad2,
    questions: [
      {
        q: "How do mini games work?",
        a: "Mini games play directly inside your feed card — no separate app needed! Tap 'Play Now' to start. Games include tap-to-catch, AR experiences, and Bible trivia. You earn points for completing them.",
      },
      {
        q: "What are AR games?",
        a: "AR (Augmented Reality) games use your camera to overlay game objects in your real environment. Tap floating objects to score points. You can play without a camera too — the game will use a fallback background.",
      },
    ],
  },
  {
    category: "Points & Rewards",
    icon: Trophy,
    questions: [
      {
        q: "How do I earn points?",
        a: "You earn points by: completing daily quizzes, playing mini games, maintaining login streaks, sharing content, journaling, and reaching milestones. Points contribute to your level progression.",
      },
      {
        q: "What are streaks?",
        a: "Your streak counts consecutive days you've opened Soul Sync. The longer your streak, the more bonus points you earn. Missing a day resets your streak to zero, so try to check in daily!",
      },
      {
        q: "What do membership levels unlock?",
        a: "Higher membership levels unlock exclusive content like premium devotionals, AR games, journal prompts, and unique themes. Check the Membership page for full details on each tier.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    icon: Shield,
    questions: [
      {
        q: "Is my data safe?",
        a: "Yes. Your data is stored securely with Supabase (hosted on AWS). We use Row Level Security (RLS) to ensure only you can access your personal data. We never sell your information to third parties.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. Go to Settings > Danger Zone > Delete Account. This permanently removes all your data including your profile, journal entries, progress, and streaks.",
      },
    ],
  },
];

export default function HelpPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="px-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Help Center</h1>
        <p className="text-sm text-muted-foreground">
          Frequently asked questions and guides
        </p>
      </div>

      {/* FAQ sections */}
      {faqSections.map((section, sIndex) => (
        <motion.section
          key={section.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sIndex * 0.08 }}
          className="mb-5"
        >
          <div className="flex items-center gap-2 mb-2 px-1">
            <section.icon className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-muted-foreground">
              {section.category}
            </h3>
          </div>

          <div className="glass-card overflow-hidden">
            {section.questions.map((item, qIndex) => {
              const key = `${sIndex}-${qIndex}`;
              const isOpen = openItems.has(key);

              return (
                <div key={key}>
                  <button
                    onClick={() => toggleItem(key)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors text-left"
                  >
                    <span className="flex-1 text-sm font-medium">{item.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {qIndex < section.questions.length - 1 && (
                    <div className="h-px bg-border mx-4" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>
      ))}

      {/* Still need help? */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5 text-center"
      >
        <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
        <h3 className="font-semibold mb-1">Still need help?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Our team is here to assist you
        </p>
        <Link
          href="/contact"
          className="inline-block px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Contact Us
        </Link>
      </motion.div>
    </div>
  );
}
