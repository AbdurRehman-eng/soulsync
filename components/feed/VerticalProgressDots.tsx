"use client";

import { cn } from "@/lib/utils";

interface VerticalProgressDotsProps {
  total: number;
  current: number;
}

export function VerticalProgressDots({ total, current }: VerticalProgressDotsProps) {
  // Show max 7 dots, centered around current
  const maxDots = 7;
  const halfDots = Math.floor(maxDots / 2);

  let startIndex = Math.max(0, current - halfDots);
  let endIndex = Math.min(total, startIndex + maxDots);

  // Adjust if we're near the end
  if (endIndex - startIndex < maxDots) {
    startIndex = Math.max(0, endIndex - maxDots);
  }

  const dots = Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i);

  return (
    <div className="vertical-progress-dots">
      {dots.map((index) => (
        <div
          key={index}
          className={cn(
            "progress-dot",
            index === current && "active"
          )}
        />
      ))}
    </div>
  );
}
