"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, X, Loader2, ChevronDown } from "lucide-react";
import { useMoodStore } from "@/stores/moodStore";

interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
  mood: { name: string; emoji: string; color: string } | null;
  prompt_card: { title: string; content: Record<string, any> } | null;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const { currentMood } = useMoodStore();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async (offset = 0) => {
    try {
      const res = await fetch(`/api/journal?limit=20&offset=${offset}`);
      if (res.ok) {
        const data = await res.json();
        if (offset === 0) {
          setEntries(data.entries || []);
        } else {
          setEntries((prev) => [...prev, ...(data.entries || [])]);
        }
        setTotal(data.total || 0);
        setHasMore((data.entries?.length || 0) + offset < (data.total || 0));
      }
    } catch (error) {
      console.error("Failed to fetch journal entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!text.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text,
          mood_id: currentMood?.id || null,
        }),
      });
      if (res.ok) {
        setText("");
        setShowCompose(false);
        setLoading(true);
        fetchEntries();
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 pt-2 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Journal</h1>
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "reflection" : "reflections"}
          </p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          Write
        </button>
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-md p-5 relative"
            >
              <button
                onClick={() => setShowCompose(false)}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold">Free Write</h2>
              </div>

              {currentMood && (
                <div className="flex items-center gap-1.5 mb-3 text-sm text-muted-foreground">
                  <span>{currentMood.emoji}</span>
                  <span>Feeling {currentMood.name.toLowerCase()}</span>
                </div>
              )}

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your heart today?"
                className="w-full h-40 px-3 py-2.5 rounded-xl bg-[var(--secondary)]/50 border border-[var(--border)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[var(--foreground)] placeholder-[var(--muted-foreground)]"
                autoFocus
              />

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">
                  {text.length} characters
                </span>
                <button
                  onClick={handleSave}
                  disabled={!text.trim() || saving}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : entries.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <p className="text-lg font-semibold mb-1">No reflections yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Start journaling to capture your thoughts and growth.
          </p>
          <button
            onClick={() => setShowCompose(true)}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold"
          >
            Write your first reflection
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card p-4 rounded-xl"
            >
              {/* Entry header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatDate(entry.created_at)}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">
                    {formatTime(entry.created_at)}
                  </span>
                </div>
                {entry.mood && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${entry.mood.color}20`, color: entry.mood.color }}
                  >
                    {entry.mood.emoji} {entry.mood.name}
                  </span>
                )}
              </div>

              {/* Prompt reference */}
              {entry.prompt_card && (
                <div className="mb-2 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-xs italic text-indigo-300/80">
                    {entry.prompt_card.content?.journal_prompt_text || entry.prompt_card.content?.prompt || entry.prompt_card.title}
                  </p>
                </div>
              )}

              {/* Entry content */}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
            </motion.div>
          ))}

          {/* Load More */}
          {hasMore && (
            <button
              onClick={() => fetchEntries(entries.length)}
              className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
            >
              <ChevronDown className="w-4 h-4" />
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
