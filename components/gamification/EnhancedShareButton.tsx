"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Instagram,
  Link2,
  X,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

interface EnhancedShareButtonProps {
  cardId: string;
  cardTitle: string;
  cardType: string;
}

const platformIcons = {
  facebook: Facebook,
  twitter: Twitter,
  whatsapp: MessageCircle,
  instagram: Instagram,
  copy_link: Link2,
};

const platformNames = {
  facebook: "Facebook",
  twitter: "Twitter",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  copy_link: "Copy Link",
};

const platformColors = {
  facebook: "bg-blue-600 hover:bg-blue-700",
  twitter: "bg-sky-500 hover:bg-sky-600",
  whatsapp: "bg-green-600 hover:bg-green-700",
  instagram: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600",
  copy_link: "bg-gray-600 hover:bg-gray-700",
};

export function EnhancedShareButton({
  cardId,
  cardTitle,
  cardType,
}: EnhancedShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);

  const handleShare = async (platform: keyof typeof platformIcons) => {
    setSharing(true);

    try {
      // Track the share
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId,
          platform,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Show reward animation
        setRewardData(data);
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3000);

        // Open share dialog or copy link
        if (platform === "copy_link") {
          await navigator.clipboard.writeText(data.shareUrl);
          toast.success("Link copied to clipboard!");
        } else {
          window.open(data.shareUrl, "_blank", "width=600,height=400");
        }

        setIsOpen(false);
      } else {
        toast.error("Failed to track share");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share");
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      {/* Share button */}
      <motion.button
        className="relative p-2 rounded-full bg-accent/20 hover:bg-accent/30 transition-colors"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Share2 className="w-5 h-5 text-accent" />
      </motion.button>

      {/* Share modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-md bg-gradient-to-br from-purple-900/95 to-pink-900/95 rounded-3xl shadow-2xl overflow-hidden border border-white/20"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Share & Earn
                    </h3>
                    <p className="text-sm text-white/60 mt-1">
                      Share this {cardType} and earn rewards!
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Reward info */}
              <div className="px-6 py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-white/10">
                <div className="flex items-center gap-2 text-yellow-300">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    Earn +5 Points & +10 XP per share!
                  </span>
                </div>
              </div>

              {/* Platform buttons */}
              <div className="p-6 space-y-3">
                {Object.entries(platformIcons).map(([key, Icon]) => (
                  <motion.button
                    key={key}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl ${
                      platformColors[key as keyof typeof platformColors]
                    } text-white font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={() =>
                      handleShare(key as keyof typeof platformIcons)
                    }
                    disabled={sharing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-6 h-6" />
                    <span>
                      Share on{" "}
                      {platformNames[key as keyof typeof platformNames]}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward notification */}
      <AnimatePresence>
        {showReward && rewardData && (
          <motion.div
            className="fixed top-20 right-4 z-50 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-2xl max-w-xs"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold">Reward Earned!</h4>
                <p className="text-sm opacity-90 mt-1">
                  +{rewardData.pointsReward} Points & +{rewardData.xpReward} XP
                </p>
                {rewardData.multiplier > 1 && (
                  <p className="text-xs opacity-75 mt-1">
                    {rewardData.multiplier}x Bonus Active! 🔥
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
