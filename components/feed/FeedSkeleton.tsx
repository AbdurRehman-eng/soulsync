"use client";

import { motion } from "framer-motion";

export function FeedSkeleton() {
  return (
    <div className="vertical-feed-container">
      {/* Show 3 skeleton cards stacked vertically */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="feed-snap-item">
          <motion.div
            className="feed-card"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          >
            <div className="h-full flex flex-col p-5">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg skeleton" />
                <div className="w-20 h-4 rounded skeleton" />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center space-y-4">
                <div className="w-3/4 h-8 rounded skeleton" />
                <div className="w-full h-4 rounded skeleton" />
                <div className="w-full h-4 rounded skeleton" />
                <div className="w-2/3 h-4 rounded skeleton" />
              </div>

              {/* Footer */}
              <div className="flex justify-between mt-auto pt-4">
                <div className="w-10 h-10 rounded-full skeleton" />
                <div className="w-10 h-10 rounded-full skeleton" />
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
