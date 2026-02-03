"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";
import { formatPoints } from "@/lib/utils";
import { useGamificationStore } from "@/stores/gamificationStore";

interface PointsDisplayProps {
  points: number;
}

export function PointsDisplay({ points }: PointsDisplayProps) {
  const [displayPoints, setDisplayPoints] = useState(points);
  const [isAnimating, setIsAnimating] = useState(false);
  const recentPointsChange = useGamificationStore(
    (state) => state.recentPointsChange
  );
  const clearPointsChange = useGamificationStore(
    (state) => state.clearPointsChange
  );

  useEffect(() => {
    if (points !== displayPoints) {
      setIsAnimating(true);
      const duration = 500;
      const startTime = Date.now();
      const startValue = displayPoints;
      const endValue = points;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentValue = Math.round(
          startValue + (endValue - startValue) * easeProgress
        );

        setDisplayPoints(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [points, displayPoints]);

  useEffect(() => {
    if (recentPointsChange) {
      const timer = setTimeout(() => {
        clearPointsChange();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [recentPointsChange, clearPointsChange]);

  return (
    <div className="relative">
      <motion.div
        className="points-badge"
        animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>{formatPoints(displayPoints)}</span>
      </motion.div>

      {/* Points change popup */}
      <AnimatePresence>
        {recentPointsChange && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span
              className={`text-xs sm:text-sm font-bold ${
                recentPointsChange.amount > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {recentPointsChange.amount > 0 ? "+" : ""}
              {recentPointsChange.amount}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
