import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Mood } from "@/types";

interface MoodState {
  currentMood: Mood | null;
  isSynced: boolean;
  lastSyncDate: string | null;
  availableMoods: Mood[];
  setCurrentMood: (mood: Mood) => void;
  setAvailableMoods: (moods: Mood[]) => void;
  clearMood: () => void;
  checkSyncStatus: () => boolean;
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      currentMood: null,
      isSynced: false,
      lastSyncDate: null,
      availableMoods: [],
      setCurrentMood: (mood) => {
        const today = new Date().toISOString().split("T")[0];
        set({
          currentMood: mood,
          isSynced: true,
          lastSyncDate: today,
        });
      },
      setAvailableMoods: (moods) => set({ availableMoods: moods }),
      clearMood: () =>
        set({
          currentMood: null,
          isSynced: false,
          lastSyncDate: null,
        }),
      checkSyncStatus: () => {
        const { lastSyncDate } = get();
        const today = new Date().toISOString().split("T")[0];
        const synced = lastSyncDate === today;
        if (!synced) {
          set({ isSynced: false, currentMood: null });
        }
        return synced;
      },
    }),
    {
      name: "soul-sync-mood",
      onRehydrateStorage: () => (state) => {
        // Check if mood is still valid on hydration
        if (state) {
          state.checkSyncStatus();
        }
      },
    }
  )
);

// Default moods (fallback if not loaded from DB)
export const defaultMoods: Omit<Mood, "id" | "created_at">[] = [
  {
    name: "Happy",
    emoji: "😊",
    color: "#fbbf24",
    description: "Feeling joyful and content",
    sort_order: 1,
    is_active: true,
  },
  {
    name: "Sad",
    emoji: "😢",
    color: "#60a5fa",
    description: "Feeling down or melancholic",
    sort_order: 2,
    is_active: true,
  },
  {
    name: "Lonely",
    emoji: "🥺",
    color: "#a78bfa",
    description: "Feeling isolated or alone",
    sort_order: 3,
    is_active: true,
  },
  {
    name: "Anxious",
    emoji: "😰",
    color: "#f97316",
    description: "Feeling worried or nervous",
    sort_order: 4,
    is_active: true,
  },
  {
    name: "Grateful",
    emoji: "🙏",
    color: "#34d399",
    description: "Feeling thankful and blessed",
    sort_order: 5,
    is_active: true,
  },
  {
    name: "Angry",
    emoji: "😤",
    color: "#ef4444",
    description: "Feeling frustrated or upset",
    sort_order: 6,
    is_active: true,
  },
];
