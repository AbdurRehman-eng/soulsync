"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Circle, Coins, Calendar, Clock } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

interface Task {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "challenge";
  points_reward: number;
  completed: boolean;
  expires_at?: string;
}

export default function TasksPage() {
  const { isAuthenticated } = useUserStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "challenge">(
    "daily"
  );

  const filteredTasks = tasks.filter((task) => task.type === activeTab);
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalPoints = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.points_reward, 0);

  // Load tasks on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    }
  }, [isAuthenticated]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        // Combine all task types into one array
        const allTasks = [
          ...data.daily,
          ...data.weekly,
          ...data.challenge,
        ];
        setTasks(allTasks);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    // Optimistically update UI
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      // Reload tasks to get updated points
      await loadTasks();
    } catch (error) {
      console.error("Failed to toggle task:", error);
      // Revert optimistic update on error
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <Target className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Sign in to view tasks</h2>
        <p className="text-muted-foreground">
          Complete daily tasks to earn points and grow spiritually
        </p>
      </div>
    );
  }

  return (
    <div className="px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Tasks</h1>
        <p className="text-muted-foreground">
          Complete tasks to earn points and build healthy habits
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm">Completed</span>
          </div>
          <p className="text-2xl font-bold">
            {completedCount}/{tasks.length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Coins className="w-4 h-4" />
            <span className="text-sm">Points Earned</span>
          </div>
          <p className="text-2xl font-bold text-accent">{totalPoints}</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["daily", "weekly", "challenge"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "glass-card hover:bg-muted/50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-muted-foreground text-sm">Loading tasks...</p>
          </div>
        ) : filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`glass-card p-4 ${
              task.completed ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => handleToggleTask(task.id)}
                className="mt-1 touch-feedback"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    task.completed ? "line-through" : ""
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-accent">
                    <Coins className="w-3 h-3" />
                    {task.points_reward} pts
                  </span>
                  {task.expires_at && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Ends {task.expires_at}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {!isLoading && filteredTasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No {activeTab} tasks available
          </div>
        )}
      </div>
    </div>
  );
}
