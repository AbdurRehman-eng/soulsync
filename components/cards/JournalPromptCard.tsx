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
    <div className="flex-1 flex flex-col justify-center overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-indigo-500/20">
          <span className="text-lg">✨</span>
        </div>
        <span className="text-xs font-medium text-indigo-400">Reflection</span>
      </div>

      <h3 className="text-base font-bold mb-2">{card.title || "Time to Reflect"}</h3>

      <div className="glass-card p-4 rounded-xl mb-3">
        <p className="text-sm leading-relaxed italic text-muted-foreground">
          {content.journal_prompt_text || content.prompt || "What's on your mind today?"}
        </p>
      </div>

      {!submitted ? (
        <>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Start writing your thoughts..."
            className="w-full h-20 px-3 py-2 rounded-xl bg-[var(--secondary)]/50 border border-[var(--border)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] placeholder-[var(--muted-foreground)]"
          />
          <button
            onClick={handleSubmit}
            disabled={saving || !journalText.trim()}
            className="mt-3 self-center px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Reflection"}
          </button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <span className="text-3xl mb-2 block">🌟</span>
          <p className="text-sm font-medium text-accent">Reflection saved!</p>
          <p className="text-xs text-muted-foreground mt-1">
            Keep reflecting, keep growing.
          </p>
        </motion.div>
      )}
    </div>
  );
}
