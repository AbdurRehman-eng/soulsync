"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, Loader2, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { TaskFormModal } from "./TaskFormModal";
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

interface Task {
  id: string;
  card_id: string;
  task_type: "daily" | "weekly" | "challenge";
  description: string;
  points_reward: number;
  expires_at: string | null;
  created_at: string;
  sort_order?: number;
  cards?: {
    id: string;
    title: string;
    type: string;
  };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "daily" | "weekly" | "challenge">("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          id,
          card_id,
          task_type,
          description,
          points_reward,
          expires_at,
          created_at,
          sort_order,
          cards (
            id,
            title,
            type
          )
        `)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks((data as any) || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex((task) => task.id === active.id);
    const newIndex = filteredTasks.findIndex((task) => task.id === over.id);

    const newOrder = arrayMove(filteredTasks, oldIndex, newIndex);

    // Update local state immediately
    setTasks((prev) => {
      const updatedTasks = [...prev];

      // Update sort_order for reordered items
      newOrder.forEach((task, index) => {
        const taskIndex = updatedTasks.findIndex((t) => t.id === task.id);
        if (taskIndex !== -1) {
          updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], sort_order: index };
        }
      });

      return updatedTasks;
    });

    // Update in database
    try {
      const updates = newOrder.map((task, index) => ({
        id: task.id,
        sort_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from("tasks")
          .update({ sort_order: update.sort_order })
          .eq("id", update.id);
      }

      toast.success("Order updated");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
      fetchTasks(); // Revert on error
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      toast.success("Task deleted");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleCreate = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleSuccess = () => {
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.task_type === filter;
    const matchesSearch =
      task.cards?.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-blue-500/20 text-blue-400";
      case "weekly":
        return "bg-purple-500/20 text-purple-400";
      case "challenge":
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
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Tasks</h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)]">
            Manage daily, weekly, and challenge tasks
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl transition-colors shadow-lg shadow-[var(--primary)]/20 w-full sm:w-auto"
        >
          <Plus size={20} />
          Create Task
        </button>
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
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["all", "daily", "weekly", "challenge"].map((t) => (
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

      {/* Tasks Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Total Tasks</p>
          <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
            {tasks.length}
          </p>
        </div>
        <div className="glass-card p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Daily</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-400">
            {tasks.filter((t) => t.task_type === "daily").length}
          </p>
        </div>
        <div className="glass-card p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Weekly</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-400">
            {tasks.filter((t) => t.task_type === "weekly").length}
          </p>
        </div>
        <div className="glass-card p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Challenges</p>
          <p className="text-xl sm:text-2xl font-bold text-orange-400">
            {tasks.filter((t) => t.task_type === "challenge").length}
          </p>
        </div>
      </div>

      {/* Tasks List - Desktop Table / Mobile Cards */}
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
                  <th className="px-6 py-3 w-12"></th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Points</th>
                  <th className="px-6 py-3">Expires</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <SortableContext
                  items={filteredTasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-[var(--muted-foreground)]"
                      >
                        No tasks found
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <SortableItem key={task.id} id={task.id}>
                        <tr className="border-b border-[var(--border)] hover:bg-[var(--secondary)]/30 transition-colors">
                          <td></td>
                          <td className="px-6 py-4 font-medium text-[var(--foreground)]">
                            {task.cards?.title || "Untitled"}
                          </td>
                          <td className="px-6 py-4 text-[var(--muted-foreground)] max-w-xs truncate">
                            {task.description || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                task.task_type
                              )}`}
                            >
                              {task.task_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[var(--accent)]">
                            {task.points_reward} pts
                          </td>
                          <td className="px-6 py-4 text-[var(--muted-foreground)]">
                            {task.expires_at
                              ? new Date(task.expires_at).toLocaleDateString()
                              : "Never"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(task)}
                                className="p-1.5 rounded-lg hover:bg-[var(--primary)]/20 text-[var(--primary)] transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(task.id)}
                                className="p-1.5 rounded-lg hover:bg-[var(--destructive)]/20 text-[var(--destructive)] transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </SortableItem>
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
              items={filteredTasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="divide-y divide-[var(--border)]">
                {filteredTasks.length === 0 ? (
                  <div className="p-8 text-center text-[var(--muted-foreground)]">
                    No tasks found
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <SortableItem key={task.id} id={task.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-[var(--foreground)] truncate">
                              {task.cards?.title || "Untitled"}
                            </h3>
                            {task.description && (
                              <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(task)}
                              className="p-2 rounded-lg hover:bg-[var(--primary)]/20 text-[var(--primary)] transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="p-2 rounded-lg hover:bg-[var(--destructive)]/20 text-[var(--destructive)] transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                              task.task_type
                            )}`}
                          >
                            {task.task_type}
                          </span>
                          <span className="text-xs text-[var(--accent)]">
                            {task.points_reward} pts
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)]">
                            {task.expires_at
                              ? `Expires ${new Date(task.expires_at).toLocaleDateString()}`
                              : "No expiration"}
                          </span>
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

      {/* Modal */}
      {showModal && (
        <TaskFormModal
          task={selectedTask}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
