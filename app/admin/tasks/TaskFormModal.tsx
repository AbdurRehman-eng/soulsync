"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Task {
  id: string;
  card_id: string;
  task_type: "daily" | "weekly" | "challenge";
  description: string;
  points_reward: number;
  expires_at: string | null;
}

interface Card {
  id: string;
  title: string;
  type: string;
}

interface TaskFormModalProps {
  task: Task | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function TaskFormModal({ task, onClose, onSuccess }: TaskFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [formData, setFormData] = useState({
    card_id: task?.card_id || "",
    task_type: task?.task_type || "daily",
    description: task?.description || "",
    points_reward: task?.points_reward || 10,
    expires_at: task?.expires_at || "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from("cards")
        .select("id, title, type")
        .eq("is_active", true)
        .order("title");

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast.error("Failed to load cards");
    } finally {
      setLoadingCards(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        card_id: formData.card_id,
        task_type: formData.task_type,
        description: formData.description || null,
        points_reward: formData.points_reward,
        expires_at: formData.expires_at || null,
      };

      if (task) {
        // Update existing task
        const { error } = await supabase
          .from("tasks")
          .update(payload)
          .eq("id", task.id);

        if (error) throw error;
        const taskTitle = cards.find((c) => c.id === formData.card_id)?.title || "Task";
        toast.success(`Task "${taskTitle}" updated successfully`);
      } else {
        // Create new task
        const { error } = await supabase.from("tasks").insert([payload]);

        if (error) throw error;
        const taskTitle = cards.find((c) => c.id === formData.card_id)?.title || "Task";
        toast.success(`Task "${taskTitle}" created successfully`);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving task:", error);
      toast.error(error.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h3 className="text-xl font-bold text-[var(--foreground)]">
            {task ? "Edit Task" : "Create Task"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Card Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Card <span className="text-red-500">*</span>
            </label>
            {loadingCards ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : (
              <select
                value={formData.card_id}
                onChange={(e) =>
                  setFormData({ ...formData, card_id: e.target.value })
                }
                required
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
              >
                <option value="">Select a card...</option>
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.title} ({card.type})
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              The card this task is associated with
            </p>
          </div>

          {/* Task Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Task Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.task_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  task_type: e.target.value as "daily" | "weekly" | "challenge",
                })
              }
              required
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="challenge">Challenge</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder="Optional task description..."
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
            />
          </div>

          {/* Points Reward */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Points Reward <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.points_reward}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  points_reward: parseInt(e.target.value) || 0,
                })
              }
              min={1}
              required
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            />
          </div>

          {/* Expires At */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Expires At
            </label>
            <input
              type="datetime-local"
              value={formData.expires_at}
              onChange={(e) =>
                setFormData({ ...formData, expires_at: e.target.value })
              }
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Leave empty for tasks that don't expire
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-[var(--foreground)] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.card_id}
              className="flex-1 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {task ? "Update" : "Create"} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
