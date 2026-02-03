"use client";

import { motion } from "framer-motion";
import type { UserBadge } from "@/types";
import { format } from "date-fns";

interface BadgeCardProps {
  userBadge: UserBadge;
  index?: number;
}

export function BadgeCard({ userBadge, index = 0 }: BadgeCardProps) {
  const badge = userBadge.badge;

  if (!badge) return null;

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.1 }}
    >
      {/* Badge container */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
        style={{
          background: badge.color || "#7c3aed",
          boxShadow: `0 4px 20px ${badge.color || "#7c3aed"}40`,
        }}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
            repeatDelay: 5,
          }}
        />

        {/* Icon */}
        <span className="text-3xl relative z-10">{badge.icon || "🏅"}</span>
      </div>

      {/* Badge name (visible on hover) */}
      <motion.div
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 p-2 bg-black/90 rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20"
        initial={false}
      >
        <p className="text-xs font-semibold text-white text-center">
          {badge.name}
        </p>
        {badge.description && (
          <p className="text-[10px] text-white/70 text-center mt-1">
            {badge.description}
          </p>
        )}
        <p className="text-[10px] text-white/50 text-center mt-1">
          Earned {format(new Date(userBadge.earned_at), "MMM d, yyyy")}
        </p>
      </motion.div>
    </motion.div>
  );
}
