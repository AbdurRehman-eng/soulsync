"use client";

import { memo } from "react";
import { Sparkles } from "lucide-react";
import { useMoodStore } from "@/stores/moodStore";
import { cn } from "@/lib/utils";

interface SoulSyncButtonProps {
  onClick?: () => void;
}

export const SoulSyncButton = memo(function SoulSyncButton({ onClick }: SoulSyncButtonProps) {
  const isSynced = useMoodStore((state) => state.isSynced);

  return (
    <button
      onClick={onClick}
      className={cn("soul-sync-btn active:scale-95 transition-transform", isSynced ? "synced" : "unsynced")}
    >
      {/* Icon */}
      <div className={cn(!isSynced && "animate-bounce-subtle")}>
        <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </div>

      {/* Synced checkmark overlay */}
      {isSynced && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center animate-scale-in">
          <svg
            className="w-3 h-3 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </button>
  );
});
