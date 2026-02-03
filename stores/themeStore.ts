import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeSlug = "dark-purple" | "pink-pastel" | "baby-blue";

interface ThemeState {
  theme: ThemeSlug;
  setTheme: (theme: ThemeSlug) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark-purple",
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", theme);
        }
      },
    }),
    {
      name: "soul-sync-theme",
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state && typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", state.theme);
        }
      },
    }
  )
);

// Theme metadata for UI
export const themes: Record<ThemeSlug, { name: string; preview: string[] }> = {
  "dark-purple": {
    name: "Dark Purple",
    preview: ["#1a0a2e", "#7c3aed", "#fbbf24"],
  },
  "pink-pastel": {
    name: "Pink Pastel",
    preview: ["#2d1f25", "#ec4899", "#f9a8d4"],
  },
  "baby-blue": {
    name: "Baby Blue",
    preview: ["#1e3a5f", "#38bdf8", "#7dd3fc"],
  },
};
