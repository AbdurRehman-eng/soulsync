import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Profile } from "@/types";

interface UserState {
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  updatePoints: (points: number) => void;
  updateStreak: (streak: number) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      isAuthenticated: false,
      loading: true,
      setProfile: (profile) =>
        set({
          profile,
          isAuthenticated: !!profile,
          loading: false,
        }),
      setLoading: (loading) => set({ loading }),
      updatePoints: (points) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, points } : null,
        })),
      updateStreak: (streak) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                current_streak: streak,
                longest_streak: Math.max(streak, state.profile.longest_streak),
              }
            : null,
        })),
      logout: () =>
        set({
          profile: null,
          isAuthenticated: false,
          loading: false,
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist the profile and isAuthenticated, not the loading state
      partialize: (state) => ({
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
