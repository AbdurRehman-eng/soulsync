"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Level {
  id: number;
  level_number: number;
  name: string;
  xp_required: number;
  points_reward: number;
  badge_icon: string | null;
  perks: any[];
}

interface LevelFormModalProps {
  level: Level | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function LevelFormModal({ level, onClose, onSuccess }: LevelFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    level_number: level?.level_number || 1,
    name: level?.name || "",
    xp_required: level?.xp_required || 0,
    points_reward: level?.points_reward || 0,
    badge_icon: level?.badge_icon || "",
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        level_number: formData.level_number,
        name: formData.name,
        xp_required: formData.xp_required,
        points_reward: formData.points_reward,
        badge_icon: formData.badge_icon || null,
      };

      if (level) {
        // Update existing level
        const { error } = await supabase
          .from("levels")
          .update(payload)
          .eq("id", level.id);

        if (error) throw error;
        toast.success("Level updated successfully");
      } else {
        // Create new level
        const { error } = await supabase.from("levels").insert([payload]);

        if (error) throw error;
        toast.success("Level created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving level:", error);
      toast.error(error.message || "Failed to save level");
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
            {level ? "Edit Level" : "Create Level"}
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
          {/* Level Number */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Level Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.level_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  level_number: parseInt(e.target.value) || 1,
                })
              }
              min={1}
              required
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="e.g., Seeker, Believer, Champion"
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
            />
          </div>

          {/* XP Required */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              XP Required <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.xp_required}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  xp_required: parseInt(e.target.value) || 0,
                })
              }
              min={0}
              required
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Total XP needed to reach this level
            </p>
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
              min={0}
              required
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Points awarded when user reaches this level
            </p>
          </div>

          {/* Badge Icon */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Badge Icon
            </label>
            <input
              type="text"
              value={formData.badge_icon}
              onChange={(e) =>
                setFormData({ ...formData, badge_icon: e.target.value })
              }
              placeholder="e.g., 🌱, ✨, 🏆"
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Emoji or icon to represent this level
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
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {level ? "Update" : "Create"} Level
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
