"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardType } from "@/types";
import { Plus, Edit2, Trash2, Loader2, Search, Eye, Sparkles, Gamepad2 } from "lucide-react";
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

      {/* View Card Modal */}
      {viewCard && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setViewCard(null)}
        >
          <div
            className="glass-card w-full max-w-2xl p-4 sm:p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-1 break-words">
                  {viewCard.title}
                </h2>
                {viewCard.subtitle && (
                  <p className="text-sm sm:text-base text-[var(--muted-foreground)] break-words">
                    {viewCard.subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={() => setViewCard(null)}
                className="ml-4 p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {viewCard.thumbnail_url && (
              <img
                src={viewCard.thumbnail_url}
                alt={viewCard.title}
                className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4"
              />
            )}

            <div className="space-y-4 text-sm sm:text-base">
              <div>
                <span className="text-[var(--muted-foreground)]">Type:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getTypeColor(
                    viewCard.type
                  )}`}
                >
                  {viewCard.type}
                </span>
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Status:</span>{" "}
                <span className={viewCard.is_active ? "text-green-400" : "text-gray-400"}>
                  {viewCard.is_active ? "Published" : "Draft"}
                </span>
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Created:</span>{" "}
                {new Date(viewCard.created_at).toLocaleDateString()}
              </div>
              {viewCard.content && typeof viewCard.content === "object" && (
                <div>
                  <span className="text-[var(--muted-foreground)] block mb-2">Content:</span>
                  <pre className="bg-[var(--secondary)]/50 p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
                    {JSON.stringify(viewCard.content, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
