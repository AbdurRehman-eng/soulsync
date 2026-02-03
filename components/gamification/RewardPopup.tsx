"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Gift, Coins, X } from "lucide-react";
import { useGamificationStore } from "@/stores/gamificationStore";

export function RewardPopup() {
  const { pendingReward, showRewardPopup, dismissReward } =
    useGamificationStore();

  return (
    <AnimatePresence>
      {showRewardPopup && pendingReward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="reward-popup"
          onClick={dismissReward}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="reward-card relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={dismissReward}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Icon */}
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Gift className="w-10 h-10 text-white" />
            </motion.div>

            {/* Content */}
            <h3 className="text-2xl font-bold mb-2">{pendingReward.name}</h3>
            {pendingReward.message && (
              <p className="text-muted-foreground mb-4">
                {pendingReward.message}
              </p>
            )}

            {/* Points */}
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent to-primary text-background font-bold text-xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Coins className="w-6 h-6" />
              <span>+{pendingReward.points}</span>
            </motion.div>

            {/* Confetti effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: ["#fbbf24", "#7c3aed", "#ec4899", "#22c55e"][
                      i % 4
                    ],
                    left: `${Math.random() * 100}%`,
                    top: "-10px",
                  }}
                  animate={{
                    y: [0, 400],
                    x: [0, (Math.random() - 0.5) * 100],
                    rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    delay: Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* Claim button */}
            <motion.button
              onClick={dismissReward}
              className="mt-6 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              whileTap={{ scale: 0.95 }}
            >
              Awesome!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
