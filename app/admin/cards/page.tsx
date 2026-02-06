"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardType } from "@/types";
import { Plus, Edit2, Trash2, Loader2, Search, Eye, Sparkles, Gamepad2, X, Smartphone, Code2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { CardFormModal } from "../components/CardFormModal";
import { QuizGeneratorModal } from "../components/QuizGeneratorModal";
import { ARGameGeneratorModal } from "../components/ARGameGeneratorModal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "../components/SortableItem";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

// Table row component with sortable functionality
function TableRow({
  card,
  onEdit,
  onDelete,
  onView,
  getTypeColor,
}: {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
  onView: (card: Card) => void;
  getTypeColor: (type: string) => string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="hover:bg-[var(--secondary)]/30 transition-colors group"
    >
      <td className="px-3 py-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-[var(--secondary)] rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors touch-none"
          title="Drag to reorder"
        >
          <GripVertical size={18} />
        </button>
      </td>
      <td className="px-6 py-4 font-medium text-[var(--foreground)]">
        <div className="flex items-center gap-3">
          {card.thumbnail_url && (
            <img
              src={card.thumbnail_url}
              alt=""
              className="w-10 h-10 object-cover rounded-lg bg-[var(--secondary)]"
            />
          )}
          <div>
            <div className="line-clamp-1">{card.title}</div>
            {card.subtitle && (
              <div className="text-xs text-[var(--muted-foreground)] font-normal line-clamp-1">
                {card.subtitle}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getTypeColor(
            card.type
          )}`}
        >
          {card.type}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`flex items-center gap-1.5 text-xs ${
            card.is_active ? "text-green-400" : "text-gray-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              card.is_active ? "bg-green-400" : "bg-gray-400"
            }`}
          />
          {card.is_active ? "Published" : "Draft"}
        </span>
      </td>
      <td className="px-6 py-4 text-[var(--muted-foreground)] whitespace-nowrap">
        {new Date(card.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(card)}
            className="p-1.5 hover:bg-[var(--secondary)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(card)}
            className="p-1.5 hover:bg-[var(--secondary)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="p-1.5 hover:bg-[var(--destructive)]/10 rounded-lg text-[var(--destructive)] transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ContentPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CardType | "all">("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [viewCard, setViewCard] = useState<Card | null>(null);
  const [showQuizGenerator, setShowQuizGenerator] = useState(false);
  const [showARGameGenerator, setShowARGameGenerator] = useState(false);
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = filteredCards.findIndex((card) => card.id === active.id);
    const newIndex = filteredCards.findIndex((card) => card.id === over.id);

    const newOrder = arrayMove(filteredCards, oldIndex, newIndex);

    // Update local state immediately
    setCards((prev) => {
      const updatedCards = [...prev];
      const filtered = updatedCards.filter((card) => {
        const matchesFilter = filter === "all" || card.type === filter;
        const matchesSearch = card.title.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      });

      // Update sort_order for reordered items
      newOrder.forEach((card, index) => {
        const cardIndex = updatedCards.findIndex((c) => c.id === card.id);
        if (cardIndex !== -1) {
          updatedCards[cardIndex] = { ...updatedCards[cardIndex], sort_order: index };
        }
      });

      return updatedCards;
    });

    // Update in database
    try {
      const updates = newOrder.map((card, index) => ({
        id: card.id,
        sort_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from("cards")
          .update({ sort_order: update.sort_order })
          .eq("id", update.id);
      }

      toast.success("Order updated");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
      fetchCards(); // Revert on error
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      const { error } = await supabase.from("cards").delete().eq("id", id);
      if (error) throw error;
      toast.success("Content deleted");
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      toast.error("Failed to delete content");
    }
  };

  const handleCreate = () => {
    setSelectedCard(null);
    setShowModal(true);
  };

  const handleEdit = (card: Card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const handleView = (card: Card) => {
    setViewCard(card);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  const handleSuccess = () => {
    fetchCards();
  };

  const filteredCards = cards.filter((card) => {
    const matchesFilter = filter === "all" || card.type === filter;
    const matchesSearch = card.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "verse":
        return "bg-blue-500/20 text-blue-400";
      case "devotional":
        return "bg-purple-500/20 text-purple-400";
      case "quiz":
        return "bg-pink-500/20 text-pink-400";
      case "game":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

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
            Content
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)]">
            Manage app content and cards
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowARGameGenerator(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white rounded-xl transition-opacity shadow-lg w-full sm:w-auto"
          >
            <Gamepad2 size={20} />
            AR Game Generator
          </button>
          <button
            onClick={() => setShowQuizGenerator(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white rounded-xl transition-opacity shadow-lg w-full sm:w-auto"
          >
            <Sparkles size={20} />
            AI Quiz Generator
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl transition-colors shadow-lg shadow-[var(--primary)]/20 w-full sm:w-auto"
        >
          <Plus size={20} />
          Create Content
        </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["all", "verse", "devotional", "quiz", "game", "task"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                filter === t
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content List - Desktop Table / Mobile Cards */}
      <div className="glass-card overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-[var(--secondary)]/50 text-[var(--muted-foreground)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-4 font-medium w-12"></th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <SortableContext
                  items={filteredCards.map((card) => card.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredCards.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-[var(--muted-foreground)]"
                      >
                        No content found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCards.map((card) => (
                      <TableRow key={card.id} card={card}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                        getTypeColor={getTypeColor}
                      />
                    ))
                  )}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredCards.map((card) => card.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="divide-y divide-[var(--border)]">
                {filteredCards.length === 0 ? (
                  <div className="p-8 text-center text-[var(--muted-foreground)]">
                    No content found matching your filters.
                  </div>
                ) : (
                  filteredCards.map((card) => (
                    <SortableItem key={card.id} id={card.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          {card.thumbnail_url && (
                            <img
                              src={card.thumbnail_url}
                              alt=""
                              className="w-16 h-16 object-cover rounded-lg bg-[var(--secondary)] flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-[var(--foreground)] truncate">
                              {card.title}
                            </h3>
                            {card.subtitle && (
                              <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mt-1">
                                {card.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getTypeColor(
                                card.type
                              )}`}
                            >
                              {card.type}
                            </span>
                            <span
                              className={`flex items-center gap-1.5 text-xs ${
                                card.is_active ? "text-green-400" : "text-gray-400"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  card.is_active ? "bg-green-400" : "bg-gray-400"
                                }`}
                              />
                              {card.is_active ? "Published" : "Draft"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleView(card)}
                              className="p-2 hover:bg-[var(--secondary)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(card)}
                              className="p-2 hover:bg-[var(--secondary)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(card.id)}
                              className="p-2 hover:bg-[var(--destructive)]/10 rounded-lg text-[var(--destructive)] transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-[var(--muted-foreground)]">
                          {new Date(card.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </SortableItem>
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Card Form Modal */}
      <CardFormModal
        isOpen={showModal}
        onClose={handleModalClose}
        card={selectedCard}
        onSuccess={handleSuccess}
      />

      {/* Quiz Generator Modal */}
      <QuizGeneratorModal
        isOpen={showQuizGenerator}
        onClose={() => setShowQuizGenerator(false)}
        onSuccess={handleSuccess}
      />

      {/* AR Game Generator Modal */}
      <ARGameGeneratorModal
        isOpen={showARGameGenerator}
        onClose={() => setShowARGameGenerator(false)}
        onSuccess={handleSuccess}
      />

      {/* Preview Card Modal */}
      {viewCard && (
        <ContentPreviewModal
          card={viewCard}
          onClose={() => setViewCard(null)}
          getTypeColor={getTypeColor}
        />
      )}
    </div>
  );
}

// ============================================
// Content Preview Modal
// ============================================
function ContentPreviewModal({
  card,
  onClose,
  getTypeColor,
}: {
  card: Card;
  onClose: () => void;
  getTypeColor: (type: string) => string;
}) {
  const [tab, setTab] = useState<"preview" | "data">("preview");

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-4xl p-4 sm:p-6 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-xl font-bold text-[var(--foreground)] truncate">
              Preview: {card.title}
            </h2>
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium capitalize flex-shrink-0 ${getTypeColor(
                card.type
              )}`}
            >
              {card.type}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 flex-shrink-0">
          <button
            onClick={() => setTab("preview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "preview"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Smartphone size={16} />
            Phone Preview
          </button>
          <button
            onClick={() => setTab("data")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "data"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Code2 size={16} />
            Raw Data
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {tab === "preview" ? (
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Phone Frame Preview */}
              <div className="mx-auto flex-shrink-0">
                <div className="relative">
                  {/* Phone frame */}
                  <div className="w-[320px] h-[580px] rounded-[2.5rem] border-[6px] border-gray-700 bg-[var(--background)] shadow-2xl overflow-hidden relative">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-700 rounded-b-2xl z-20" />

                    {/* Screen content */}
                    <div className="h-full pt-8 pb-4 px-1 overflow-hidden">
                      <div className="h-full relative">
                        {/* Use actual FeedCard rendering */}
                        <div className="feed-card relative h-full rounded-2xl overflow-hidden">
                          {card.background_url && (
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url(${card.background_url})` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            </div>
                          )}
                          <div className="relative h-full flex flex-col p-3 z-10 overflow-hidden">
                            <div className="flex-1 overflow-hidden flex flex-col justify-center min-h-0">
                              <CardPreviewContent card={card} />
                            </div>
                            {/* Points reward indicator */}
                            {card.points_reward > 0 && (
                              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                                +{card.points_reward} pts
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-500 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Card Details Sidebar */}
              <div className="flex-1 w-full space-y-4">
                <div className="glass-card p-4 space-y-3">
                  <h3 className="font-semibold text-[var(--foreground)]">Card Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[var(--muted-foreground)]">Status</p>
                      <p className={`font-medium ${card.is_active ? "text-green-400" : "text-gray-400"}`}>
                        {card.is_active ? "Published" : "Draft"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--muted-foreground)]">Points</p>
                      <p className="font-medium text-[var(--foreground)]">{card.points_reward} pts</p>
                    </div>
                    <div>
                      <p className="text-[var(--muted-foreground)]">Min Level</p>
                      <p className="font-medium text-[var(--foreground)]">
                        {card.min_membership_level === 1 ? "Free" : card.min_membership_level === 2 ? "Plus" : "Premium"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--muted-foreground)]">Created</p>
                      <p className="font-medium text-[var(--foreground)]">
                        {new Date(card.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {card.subtitle && (
                    <div>
                      <p className="text-[var(--muted-foreground)] text-sm">Subtitle</p>
                      <p className="text-sm text-[var(--foreground)]">{card.subtitle}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Raw Data Tab */
            <div className="space-y-4">
              <div className="glass-card p-4">
                <h3 className="font-semibold text-[var(--foreground)] mb-3">Card Metadata</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-[var(--muted-foreground)]">ID</p>
                    <p className="font-mono text-xs text-[var(--foreground)] truncate">{card.id}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted-foreground)]">Type</p>
                    <p className="capitalize text-[var(--foreground)]">{card.type}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted-foreground)]">Status</p>
                    <p className={card.is_active ? "text-green-400" : "text-gray-400"}>
                      {card.is_active ? "Published" : "Draft"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--muted-foreground)]">Points</p>
                    <p className="text-[var(--foreground)]">{card.points_reward}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted-foreground)]">Min Level</p>
                    <p className="text-[var(--foreground)]">{card.min_membership_level}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted-foreground)]">Sort Order</p>
                    <p className="text-[var(--foreground)]">{card.sort_order}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4">
                <h3 className="font-semibold text-[var(--foreground)] mb-3">Content JSON</h3>
                <pre className="bg-[var(--secondary)]/50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                  {JSON.stringify(card.content, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Card Preview Content (renders content per type)
// ============================================
function CardPreviewContent({ card }: { card: Card }) {
  const content = card.content || {};

  switch (card.type) {
    case "verse":
      return (
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-primary">Daily Verse</span>
          </div>
          <blockquote className="text-sm font-serif leading-relaxed mb-3 line-clamp-5">
            &ldquo;{content.verse_text}&rdquo;
          </blockquote>
          {content.verse_reference && (
            <p className="text-sm text-accent font-medium mt-auto">
              &mdash; {content.verse_reference}
            </p>
          )}
        </div>
      );

    case "devotional":
      return (
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-pink-500/20">
              <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-pink-500">Devotional</span>
          </div>
          <h3 className="text-base font-bold mb-2">{card.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
            {content.body}
          </p>
          {content.author && (
            <p className="text-xs text-accent mt-auto pt-1">&mdash; {content.author}</p>
          )}
        </div>
      );

    case "article":
      return (
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/20">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <span className="text-xs font-medium text-blue-500">Article</span>
            </div>
            {content.read_time && (
              <span className="text-[10px] text-muted-foreground">{content.read_time}m read</span>
            )}
          </div>
          <h3 className="text-base font-bold mb-1">{card.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {content.body}
          </p>
          {content.author && (
            <p className="text-xs text-muted-foreground mt-auto pt-1">By {content.author}</p>
          )}
        </div>
      );

    case "prayer":
      return (
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-green-500/20">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-500">Prayer</span>
          </div>
          <h3 className="text-base font-bold mb-2">{card.title}</h3>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-transparent rounded-full" />
            <p className="pl-3 text-xs leading-relaxed italic text-muted-foreground line-clamp-5">
              {content.prayer_text}
            </p>
          </div>
          <p className="text-lg font-serif text-accent text-center mt-auto pt-2">Amen</p>
        </div>
      );

    case "motivational":
      return (
        <div className="flex flex-col justify-center items-center text-center overflow-hidden">
          <div className="text-accent mb-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </div>
          <blockquote className="text-base font-bold leading-relaxed mb-3 line-clamp-4">
            &ldquo;{content.quote}&rdquo;
          </blockquote>
          {content.quote_author && (
            <p className="text-sm text-accent font-medium">&mdash; {content.quote_author}</p>
          )}
        </div>
      );

    case "task":
      return (
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20">
              <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <span className="text-xs font-medium text-cyan-500">Daily Task</span>
          </div>
          <h3 className="text-base font-bold mb-1">{card.title}</h3>
          {card.subtitle && (
            <p className="text-xs text-muted-foreground mb-2">{card.subtitle}</p>
          )}
          <div className="flex items-center gap-3 p-3 rounded-xl glass-card mt-2">
            <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
            <div className="text-left">
              <p className="text-sm font-medium">Complete</p>
              <p className="text-xs text-muted-foreground">Tap when done</p>
            </div>
          </div>
        </div>
      );

    case "quiz":
      return (
        <div className="flex flex-col justify-center items-center text-center overflow-hidden">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <h3 className="text-base font-bold mb-1">{card.title}</h3>
          {card.subtitle && (
            <p className="text-xs text-muted-foreground mb-3">{card.subtitle}</p>
          )}
          <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold">
            Take Quiz
          </div>
        </div>
      );

    case "game":
      return (
        <div className="flex flex-col justify-center items-center text-center overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <line x1="6" y1="12" x2="18" y2="12" />
              <line x1="12" y1="6" x2="12" y2="18" />
              <rect x="2" y="6" width="20" height="12" rx="2" />
            </svg>
          </div>
          <h3 className="text-base font-bold mb-1">{card.title}</h3>
          {card.subtitle && (
            <p className="text-xs text-muted-foreground mb-3">{card.subtitle}</p>
          )}
          <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Play Now
          </div>
        </div>
      );

    default:
      return (
        <div className="flex flex-col justify-center">
          <h3 className="text-base font-bold mb-2">{card.title}</h3>
          {card.subtitle && (
            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
          )}
        </div>
      );
  }
}
