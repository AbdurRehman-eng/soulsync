"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  isLiked?: boolean;
  onLike?: () => void;
  showCount?: boolean;
  count?: number;
}

export function LikeButton({
  isLiked = false,
  onLike,
  showCount = false,
  count = 0,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(isLiked);
  const [hearts, setHearts] = useState<number[]>([]);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    onLike?.();

    if (newLiked) {
      // Spawn floating hearts
      const newHearts = Array.from({ length: 5 }, () => Date.now() + Math.random());
      setHearts((prev) => [...prev, ...newHearts]);

      // Clean up hearts after animation
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => !newHearts.includes(h)));
      }, 1500);
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleLike}
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full glass-card touch-feedback transition-all duration-200 backdrop-blur-md hover:bg-white/10"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          animate={liked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={cn(
              "w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200",
              liked ? "fill-red-500 text-red-500" : "text-white/70"
            )}
          />
        </motion.div>
        {showCount && (
          <span className="absolute -bottom-1 -right-1 text-xs font-medium bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{count + (liked && !isLiked ? 1 : 0)}</span>
        )}
      </motion.button>

      {/* Floating hearts */}
      <AnimatePresence>
        {hearts.map((id) => (
          <FloatingHeart key={id} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function FloatingHeart() {
  const randomX = (Math.random() - 0.5) * 60;
  const randomRotate = (Math.random() - 0.5) * 40;
  const size = 12 + Math.random() * 8;

  return (
    <motion.div
      className="absolute bottom-0 left-1/2 pointer-events-none"
      initial={{
        opacity: 1,
        scale: 0,
        x: 0,
        y: 0,
      }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0, 1, 1.2],
        x: randomX,
        y: -80,
        rotate: randomRotate,
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 1,
        ease: "easeOut",
      }}
    >
      <Heart
        className="fill-red-500 text-red-500"
        style={{ width: size, height: size }}
      />
    </motion.div>
  );
}
