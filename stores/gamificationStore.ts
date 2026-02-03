import { create } from "zustand";
import type { Reward } from "@/types";

interface GamificationState {
  pendingReward: Reward | null;
  showRewardPopup: boolean;
  recentPointsChange: { amount: number; message: string } | null;
  triggerReward: (reward: Reward) => void;
  dismissReward: () => void;
  showPointsChange: (amount: number, message: string) => void;
  clearPointsChange: () => void;
}

export const useGamificationStore = create<GamificationState>()((set) => ({
  pendingReward: null,
  showRewardPopup: false,
  recentPointsChange: null,
  triggerReward: (reward) =>
    set({
      pendingReward: reward,
      showRewardPopup: true,
    }),
  dismissReward: () =>
    set({
      pendingReward: null,
      showRewardPopup: false,
    }),
  showPointsChange: (amount, message) =>
    set({
      recentPointsChange: { amount, message },
    }),
  clearPointsChange: () =>
    set({
      recentPointsChange: null,
    }),
}));
