"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Twitter, Facebook, MessageCircle, X } from "lucide-react";
import toast from "react-hot-toast";

interface ShareButtonProps {
  onShare?: () => void;
  shareUrl?: string;
  shareTitle?: string;
  shareText?: string;
}

export function ShareButton({
  onShare,
  shareUrl,
  shareTitle = "Check out Soul Sync!",
  shareText = "I found this inspiring content on Soul Sync",
}: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "");

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: url,
        });
        onShare?.();
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name !== "AbortError") {
          setShowMenu(true);
        }
      }
    } else {
      setShowMenu(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
      onShare?.();
      setShowMenu(false);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
    onShare?.();
    setShowMenu(false);
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookUrl, "_blank");
    onShare?.();
    setShowMenu(false);
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareText} ${url}`
    )}`;
    window.open(whatsappUrl, "_blank");
    onShare?.();
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleNativeShare}
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full glass-card touch-feedback transition-all duration-200 backdrop-blur-md hover:bg-white/10"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" />
      </motion.button>

      {/* Share menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-full right-0 mb-2 glass-card p-2 z-50 min-w-[180px]"
            >
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-sm font-medium">Share</span>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-1 rounded-full hover:bg-muted/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ShareMenuItem
                icon={Copy}
                label="Copy link"
                onClick={handleCopyLink}
              />
              <ShareMenuItem
                icon={Twitter}
                label="Twitter"
                onClick={shareToTwitter}
              />
              <ShareMenuItem
                icon={Facebook}
                label="Facebook"
                onClick={shareToFacebook}
              />
              <ShareMenuItem
                icon={MessageCircle}
                label="WhatsApp"
                onClick={shareToWhatsApp}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ShareMenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

function ShareMenuItem({ icon: Icon, label, onClick }: ShareMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
