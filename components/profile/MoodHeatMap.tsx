"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface MoodLog {
  mood_id: string;
  logged_at: string;
  mood: { name: string; emoji: string; color: string } | null;
}

interface DayData {
  date: string;
  moods: { name: string; emoji: string; color: string }[];
  dominant: { name: string; emoji: string; color: string } | null;
}

export function MoodHeatMap() {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month, -1 = last month, etc.

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      const res = await fetch("/api/mood/history");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  // Build day map for the selected month
  const { daysGrid, monthLabel, totalSyncs } = useMemo(() => {
    const now = new Date();
    const targetMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun

    // Build lookup: date string -> mood entries
    const dayMap = new Map<string, DayData>();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      dayMap.set(dateStr, { date: dateStr, moods: [], dominant: null });
    }

    let syncs = 0;
    for (const log of logs) {
      const logDate = new Date(log.logged_at);
      const dateStr = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, "0")}-${String(logDate.getDate()).padStart(2, "0")}`;
      const day = dayMap.get(dateStr);
      if (day && log.mood) {
        day.moods.push(log.mood);
        syncs++;
      }
    }

    // Calculate dominant mood per day
    for (const day of dayMap.values()) {
      if (day.moods.length > 0) {
        // Most frequent mood of the day
        const freq = new Map<string, { count: number; mood: typeof day.moods[0] }>();
        for (const m of day.moods) {
          const existing = freq.get(m.name) || { count: 0, mood: m };
          existing.count++;
          freq.set(m.name, existing);
        }
        let max = 0;
        for (const entry of freq.values()) {
          if (entry.count > max) {
            max = entry.count;
            day.dominant = entry.mood;
          }
        }
      }
    }

    // Build grid: 7 columns (Sun-Sat), fill leading blanks
    const grid: (DayData | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      grid.push(dayMap.get(dateStr) || null);
    }

    const label = targetMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return { daysGrid: grid, monthLabel: label, totalSyncs: syncs };
  }, [logs, monthOffset]);

  const today = new Date().toISOString().split("T")[0];
  const canGoForward = monthOffset < 0;

  if (loading) {
    return (
      <div className="glass-card p-4 sm:p-6 mb-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-card p-3 sm:p-4 mb-4"
    >
      {/* Header row: title + month nav + syncs */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Mood History</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMonthOffset((o) => o - 1)}
            className="p-1 rounded-md hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-medium min-w-[100px] text-center">{monthLabel}</span>
          <button
            onClick={() => setMonthOffset((o) => o + 1)}
            disabled={!canGoForward}
            className="p-1 rounded-md hover:bg-muted/50 transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {totalSyncs} {totalSyncs === 1 ? "sync" : "syncs"}
        </span>
      </div>

      {/* Day labels + Calendar grid */}
      <div className="grid grid-cols-7 gap-[3px]">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center text-[9px] text-muted-foreground/60 font-medium pb-0.5">
            {d}
          </div>
        ))}
        {daysGrid.map((day, i) => {
          if (!day) {
            return <div key={`blank-${i}`} className="h-[28px] sm:h-[32px]" />;
          }

          const isToday = day.date === today;
          const hasMood = !!day.dominant;
          const dayNum = parseInt(day.date.split("-")[2]);

          return (
            <div
              key={day.date}
              className={`h-[28px] sm:h-[32px] rounded-[4px] flex items-center justify-center transition-colors ${
                isToday ? "ring-1 ring-primary/60" : ""
              } ${hasMood ? "" : "bg-muted/15"}`}
              style={
                hasMood
                  ? { backgroundColor: `${day.dominant!.color}35` }
                  : undefined
              }
              title={
                hasMood
                  ? `${day.date}: ${day.dominant!.name} (${day.moods.length} ${day.moods.length === 1 ? "sync" : "syncs"})`
                  : day.date
              }
            >
              {hasMood ? (
                <span className="text-xs leading-none">{day.dominant!.emoji}</span>
              ) : (
                <span className="text-[9px] text-muted-foreground/30">
                  {dayNum}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
