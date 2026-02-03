"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useMoodStore } from "@/stores/moodStore";
import { cn } from "@/lib/utils";

interface SoulSyncButtonProps {
  onClick?: () => void;
}

export function SoulSyncButton({ onClick }: SoulSyncButtonProps) {
  const isSynced = useMoodStore((state) => state.isSynced);

  return (
    <motion.button
      onClick={onClick}
      className={cn("soul-sync-btn", isSynced ? "synced" : "unsynced")}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Glow effect rings */}
      {!isSynced && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "inherit",
              opacity: 0.5,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "inherit",
              opacity: 0.3,
            }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </>
      )}

      {/* Icon */}
      <motion.div
        animate={
          isSynced
            ? { rotate: 0 }
            : {
                rotate: [0, 10, -10, 0],
              }
        }
        transition={{
          duration: 2,
          repeat: isSynced ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </motion.div>

      {/* Synced checkmark overlay */}
      {isSynced && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center"
        >
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
        </motion.div>
      )}
    </motion.button>
  );
}
