"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Card } from "@/types";

interface JournalPromptCardProps {
  card: Card;
  isLocked: boolean;
}

export function JournalPromptCard({ card, isLocked }: JournalPromptCardProps) {
  const content = card.content || {};
  const [journalText, setJournalText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!journalText.trim() || saving) return;

    setSaving(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: journalText,
          prompt_card_id: card.id,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to save journal entry:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
        <div className="p-1 rounded-lg bg-indigo-500/20">
          <span className="text-sm">✨</span>
        </div>
        <span className="text-xs font-medium text-indigo-400">Reflection</span>
      </div>

      <h3 className="text-sm font-bold mb-1 flex-shrink-0">{card.title || "Time to Reflect"}</h3>

      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar-hide">
        <div className="glass-card p-2.5 rounded-xl mb-2">
          <p className="text-[11px] sm:text-xs leading-relaxed italic text-muted-foreground">
            {content.journal_prompt_text || content.prompt || "What's on your mind today?"}
          </p>
        </div>

        {!submitted ? (
          <div className="flex flex-col flex-shrink-0">
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Start writing your thoughts..."
              className="w-full h-14 px-2.5 py-1.5 rounded-xl bg-black/30 border border-[var(--border)] text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-white placeholder-white/40"
            />
            <button
              onClick={handleSubmit}
              disabled={saving || !journalText.trim()}
              className="mt-1.5 self-center px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-semibold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Reflection"}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-3"
          >
            <span className="text-2xl mb-1.5 block">🌟</span>
            <p className="text-xs font-medium text-accent">Reflection saved!</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Keep reflecting, keep growing.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
