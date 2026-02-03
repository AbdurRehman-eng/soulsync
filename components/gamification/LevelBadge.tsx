"use client";

import { motion } from "framer-motion";
import { Crown, Sparkles } from "lucide-react";

interface LevelBadgeProps {
  level: number;
  levelName: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  animated?: boolean;
}

export function LevelBadge({
  level,
  levelName,
  icon,
  size = "md",
  showName = true,
  animated = true,
}: LevelBadgeProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-xs",
    md: "w-16 h-16 text-sm",
    lg: "w-24 h-24 text-lg",
  };

  const iconSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const Badge = animated ? motion.div : "div";

  return (
    <div className="flex flex-col items-center gap-2">
      <Badge
        className={`${sizeClasses[size]} relative rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 shadow-lg flex items-center justify-center`}
        {...(animated && {
          whileHover: { scale: 1.1, rotate: 5 },
          whileTap: { scale: 0.95 },
        })}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/50 to-transparent blur-md" />

        {/* Inner circle */}
        <div className="relative z-10 w-[90%] h-[90%] rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center border-2 border-yellow-200/50">
          {icon ? (
            <span className={iconSizes[size]}>{icon}</span>
          ) : (
            <Crown className="w-1/2 h-1/2 text-yellow-100" />
          )}
        </div>

        {/* Level number badge */}
        <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-md">
          {level}
        </div>

        {/* Sparkle effects */}
        {animated && (
          <>
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
            <motion.div
              className="absolute -bottom-1 -left-1"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [360, 180, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </motion.div>
          </>
        )}
      </Badge>

      {showName && (
        <div className="text-center">
          <p className="text-sm font-semibold text-text-primary">
            Level {level}
          </p>
          <p className="text-xs text-text-secondary">{levelName}</p>
        </div>
      )}
    </div>
  );
}
