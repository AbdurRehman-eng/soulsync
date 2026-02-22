"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ContentCategory } from "@/types";
import {
  Plus, Edit2, Trash2, Loader2, Search, X, Save, FolderOpen,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("content_categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!confirm(`Are you sure you want to delete the category "${cat?.display_name || ""}"?`)) return;
    try {
      const { error } = await supabase.from("content_categories").delete().eq("id", id);
      if (error) throw error;
      toast.success(`Category "${cat?.display_name}" deleted successfully`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error: any) {
      toast.error(error.message || `Failed to delete category "${cat?.display_name}"`);
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEdit = (cat: ContentCategory) => {
    setSelectedCategory(cat);
    setShowModal(true);
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.display_name.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            Content Categories
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)]">
            Manage content categories for the discover page
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl transition-colors shadow-lg shadow-[var(--primary)]/20"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-3 sm:p-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="glass-card p-4 relative group"
            style={{
              borderLeft: `4px solid ${cat.color}`,
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <h3 className="font-bold text-[var(--foreground)]">{cat.display_name}</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-1.5 hover:bg-[var(--secondary)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 hover:bg-[var(--destructive)]/10 rounded-lg text-[var(--destructive)] transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {cat.description && (
              <p className="text-xs text-[var(--muted-foreground)] mt-2 line-clamp-2">
                {cat.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  cat.is_active
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {cat.is_active ? "Active" : "Inactive"}
              </span>
              <span className="text-[10px] text-[var(--muted-foreground)]">
                Order: {cat.sort_order}
              </span>
            </div>

            {/* Color preview */}
            <div className="flex gap-1 mt-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: cat.gradient_from }}
                title="Gradient from"
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: cat.gradient_to }}
                title="Gradient to"
              />
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="col-span-full text-center py-12 text-[var(--muted-foreground)]">
            <FolderOpen className="mx-auto mb-3 w-12 h-12 opacity-30" />
            <p>No categories found</p>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedCategory(null); }}
        category={selectedCategory}
        onSuccess={() => { fetchCategories(); setShowModal(false); setSelectedCategory(null); }}
      />
    </div>
  );
}

// ============================================
// Category Form Modal
// ============================================
function CategoryFormModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: ContentCategory | null;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [emoji, setEmoji] = useState("📁");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [gradientFrom, setGradientFrom] = useState("#6366f1");
  const [gradientTo, setGradientTo] = useState("#8b5cf6");
  const [iconName, setIconName] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setDisplayName(category.display_name);
      setEmoji(category.emoji || "📁");
      setDescription(category.description || "");
      setColor(category.color || "#6366f1");
      setGradientFrom(category.gradient_from || "#6366f1");
      setGradientTo(category.gradient_to || "#8b5cf6");
      setIconName(category.icon_name || "");
      setSortOrder(category.sort_order);
      setIsActive(category.is_active);
    } else {
      setName("");
      setSlug("");
      setDisplayName("");
      setEmoji("📁");
      setDescription("");
      setColor("#6366f1");
      setGradientFrom("#6366f1");
      setGradientTo("#8b5cf6");
      setIconName("");
      setSortOrder(0);
      setIsActive(true);
    }
  }, [category, isOpen]);

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
    if (!category) {
      setName(value.toLowerCase().replace(/\s+/g, "_"));
      setSlug(value.toLowerCase().replace(/\s+/g, "-"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !slug.trim()) {
      toast.error("Display name and slug are required");
      return;
    }

    setLoading(true);
    try {
      const data = {
        name: name.trim(),
        slug: slug.trim(),
        display_name: displayName.trim(),
        emoji,
        description: description.trim() || null,
        color,
        gradient_from: gradientFrom,
        gradient_to: gradientTo,
        icon_name: iconName.trim() || null,
        sort_order: sortOrder,
        is_active: isActive,
      };

      if (category) {
        const { error } = await supabase
          .from("content_categories")
          .update(data)
          .eq("id", category.id);
        if (error) throw error;
        toast.success(`Category "${displayName.trim()}" updated successfully`);
      } else {
        const { error } = await supabase.from("content_categories").insert(data);
        if (error) throw error;
        toast.success(`Category "${displayName.trim()}" created successfully`);
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg p-6 relative my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--foreground)]">
                  {category ? "Edit Category" : "New Category"}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-[80px_1fr] gap-4 items-start">
                  <div>
                    <label className="block text-sm font-medium mb-2">Emoji</label>
                    <input
                      type="text"
                      value={emoji}
                      onChange={(e) => setEmoji(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center text-2xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name *</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => handleDisplayNameChange(e.target.value)}
                      placeholder="e.g. Arena"
                      className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name (internal)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug *</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description..."
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Gradient From</label>
                    <input
                      type="color"
                      value={gradientFrom}
                      onChange={(e) => setGradientFrom(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Gradient To</label>
                    <input
                      type="color"
                      value={gradientTo}
                      onChange={(e) => setGradientTo(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div
                  className="rounded-xl p-4 flex items-center gap-3"
                  style={{
                    background: `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}30)`,
                    border: `1px solid ${color}20`,
                  }}
                >
                  <span className="text-3xl">{emoji}</span>
                  <div>
                    <h3 className="font-bold text-sm">{displayName || "Category Name"}</h3>
                    <p className="text-[10px] text-[var(--muted-foreground)]">{description || "Description"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort Order</label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon Name</label>
                    <input
                      type="text"
                      value={iconName}
                      onChange={(e) => setIconName(e.target.value)}
                      placeholder="Lucide icon name"
                      className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="catIsActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="catIsActive" className="text-sm font-medium">Active</label>
                </div>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-[var(--card)] pb-2">
                  <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 transition-colors">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {category ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
