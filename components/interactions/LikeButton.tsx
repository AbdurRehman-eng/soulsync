"use client";

import { memo, useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  isLiked?: boolean;
  onLike?: () => void;
  showCount?: boolean;
  count?: number;
}

export const LikeButton = memo(function LikeButton({
  isLiked = false,
  onLike,
  showCount = false,
  count = 0,
}: LikeButtonProps) {
  const [showHearts, setShowHearts] = useState(false);

  const handleLike = useCallback(() => {
    const willBeLiked = !isLiked;
    onLike?.();

    if (willBeLiked) {
      setShowHearts(true);
      // Clean up after animation
      setTimeout(() => setShowHearts(false), 1200);
    }
  }, [isLiked, onLike]);

  return (
    <div className="relative">
      <button
        onClick={handleLike}
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full glass-card touch-feedback transition-all duration-200 hover:bg-white/10"
      >
        <Heart
          className={cn(
            "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200",
            isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white/70 scale-100"
          )}
        />
        {showCount && (
          <span className="absolute -bottom-1 -right-1 text-xs font-medium bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{count}</span>
        )}
      </button>

      {/* CSS-only floating hearts */}
      {showHearts && (
        <div className="absolute bottom-0 left-1/2 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute floating-heart-css text-red-500"
              style={{
                animationDelay: `${i * 0.15}s`,
                left: `${(i - 1) * 16}px`,
                fontSize: `${12 + i * 3}px`,
              }}
            >
              &#10084;
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
