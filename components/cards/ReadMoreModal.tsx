"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ReadMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string | null;
  body: string;
  author?: string | null;
  badge?: { label: string; icon?: React.ReactNode; color: string };
  meta?: string | null;
}

export function ReadMoreModal({
  isOpen,
  onClose,
  title,
  subtitle,
  body,
  author,
  badge,
  meta,
}: ReadMoreModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden"
            style={{ background: "var(--background)" }}
          >
            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-2 pb-1 sm:hidden flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] flex-shrink-0">
              <div className="flex items-center gap-2">
                {badge && (
                  <>
                    {badge.icon}
                    <span className={`text-xs font-medium ${badge.color}`}>{badge.label}</span>
                  </>
                )}
                {meta && (
                  <span className="text-[10px] text-muted-foreground ml-1">{meta}</span>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-2">{title}</h2>

              {subtitle && (
                <p className="text-sm text-accent mb-3">{subtitle}</p>
              )}

              {author && (
                <p className="text-xs text-muted-foreground mb-4">— {author}</p>
              )}

              <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed text-[var(--foreground)] [&_p]:mb-3 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_strong]:font-bold [&_em]:italic [&_a]:text-primary [&_a]:underline">
                <ReactMarkdown>{body}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;
  return createPortal(modalContent, document.body);
}
