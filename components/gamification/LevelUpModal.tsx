"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Trophy, Gift } from "lucide-react";
import { LevelBadge } from "./LevelBadge";
import { useEffect, useState } from "react";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldLevel: number;
  newLevel: number;
  levelName: string;
  levelIcon?: string;
  pointsReward?: number;
  perks?: string[];
}

export function LevelUpModal({
  isOpen,
  onClose,
  oldLevel,
  newLevel,
  levelName,
  levelIcon,
  pointsReward = 0,
  perks = [],
}: LevelUpModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-md w-full bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            initial={{ scale: 0.5, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 100 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-[url('/patterns/stars.png')] opacity-20 animate-pulse" />

            {/* Confetti effect */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{
                      x: "50%",
                      y: "50%",
                      scale: 0,
                    }}
                    animate={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      scale: [0, 1, 0],
                      rotate: Math.random() * 360,
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <Sparkles
                      className="w-4 h-4"
                      style={{
                        color: [
                          "#fbbf24",
                          "#f97316",
                          "#a855f7",
                          "#ec4899",
                        ][i % 4],
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="relative z-10 p-8 text-center space-y-6">
              {/* Title */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent mb-2">
                  Level Up!
                </h2>
                <p className="text-white/80 text-lg">
                  Congratulations! You've leveled up!
                </p>
              </motion.div>

              {/* Level transition animation */}
              <motion.div
                className="flex items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-center">
                  <LevelBadge
                    level={oldLevel}
                    levelName="Previous"
                    size="md"
                    showName={false}
                    animated={false}
                  />
                  <p className="text-xs text-white/60 mt-2">Level {oldLevel}</p>
                </div>

                <motion.div
                  animate={{
                    x: [0, 10, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                  }}
                >
                  <div className="text-4xl">→</div>
                </motion.div>

                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.6,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <LevelBadge
                      level={newLevel}
                      levelName={levelName}
                      icon={levelIcon}
                      size="lg"
                      showName={false}
                      animated={true}
                    />
                  </motion.div>
                  <p className="text-sm font-bold text-white mt-2">
                    Level {newLevel}
                  </p>
                  <p className="text-xs text-yellow-300">{levelName}</p>
                </div>
              </motion.div>

              {/* Rewards */}
              {pointsReward > 0 && (
                <motion.div
                  className="flex items-center justify-center gap-2 p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Gift className="w-6 h-6 text-yellow-300" />
                  <span className="text-lg font-semibold text-white">
                    +{pointsReward} Points Bonus!
                  </span>
                </motion.div>
              )}

              {/* Perks */}
              {perks.length > 0 && (
                <motion.div
                  className="space-y-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center justify-center gap-2 text-white/80">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">New Perks Unlocked</span>
                  </div>
                  <div className="space-y-1">
                    {perks.map((perk, i) => (
                      <motion.div
                        key={i}
                        className="text-sm text-white/70 bg-white/5 rounded-lg p-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 + i * 0.1 }}
                      >
                        ✨ {perk}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Continue button */}
              <motion.button
                className="w-full py-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                onClick={onClose}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
