"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, Loader2, Search, Trophy } from "lucide-react";
import { toast } from "react-hot-toast";
import { LevelFormModal } from "./LevelFormModal";

interface Level {
  id: number;
  level_number: number;
  name: string;
  xp_required: number;
  points_reward: number;
  badge_icon: string | null;
  perks: any[];
  created_at: string;
}

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const { data, error } = await supabase
        .from("levels")
        .select("*")
        .order("level_number", { ascending: true });

      if (error) throw error;
      setLevels(data || []);
    } catch (error) {
      console.error("Error fetching levels:", error);
      toast.error("Failed to load levels");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const level = levels.find((l) => l.id === id);
    if (!confirm(`Are you sure you want to delete level "${level?.name || ""}"?`)) return;

    try {
      const { error } = await supabase.from("levels").delete().eq("id", id);
      if (error) throw error;
      toast.success(`Level "${level?.name}" deleted successfully`);
      setLevels((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      toast.error(`Failed to delete level "${level?.name}"`);
    }
  };

  const handleCreate = () => {
    setSelectedLevel(null);
    setShowModal(true);
  };

  const handleEdit = (level: Level) => {
    setSelectedLevel(level);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedLevel(null);
  };

  const handleSuccess = () => {
    fetchLevels();
  };

  const filteredLevels = levels.filter((level) =>
    level.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[var(--foreground)]">Levels & Ranks</h2>
          <p className="text-[var(--muted-foreground)]">
            Manage user progression levels and rewards
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl transition-colors shadow-lg shadow-[var(--primary)]/20 self-start md:self-auto"
        >
          <Plus size={20} />
          Create Level
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-[var(--muted-foreground)]">Total Levels</p>
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {levels.length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-[var(--muted-foreground)]">Max Level</p>
          <p className="text-2xl font-bold text-purple-400">
            {levels.length > 0 ? Math.max(...levels.map((l) => l.level_number)) : 0}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-[var(--muted-foreground)]">Total XP Required</p>
          <p className="text-2xl font-bold text-blue-400">
            {levels.length > 0
              ? levels[levels.length - 1]?.xp_required.toLocaleString()
              : 0}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative w-full md:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search levels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>

      {/* Levels Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-[var(--secondary)]/50 text-[var(--muted-foreground)] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Icon</th>
                <th className="px-6 py-3">XP Required</th>
                <th className="px-6 py-3">Points Reward</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLevels.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-[var(--muted-foreground)]"
                  >
                    No levels found
                  </td>
                </tr>
              ) : (
                filteredLevels.map((level) => (
                  <tr
                    key={level.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--secondary)]/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-[var(--primary)]" />
                        <span className="font-bold text-[var(--foreground)]">
                          {level.level_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--foreground)]">
                      {level.name}
                    </td>
                    <td className="px-6 py-4 text-2xl">{level.badge_icon}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">
                      {level.xp_required.toLocaleString()} XP
                    </td>
                    <td className="px-6 py-4 text-[var(--accent)]">
                      {level.points_reward} pts
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(level)}
                          className="p-1.5 rounded-lg hover:bg-[var(--primary)]/20 text-[var(--primary)] transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(level.id)}
                          className="p-1.5 rounded-lg hover:bg-[var(--destructive)]/20 text-[var(--destructive)] transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <LevelFormModal
          level={selectedLevel}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
