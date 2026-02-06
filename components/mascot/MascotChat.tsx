"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  X,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Mascot, MascotState } from "./Mascot";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MascotChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MascotChat({ isOpen, onClose }: MascotChatProps) {
  const { isAuthenticated } = useUserStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, error]);

  // Load chat history when opening the chat (if authenticated)
  useEffect(() => {
    if (isOpen && isAuthenticated && !historyLoaded) {
      loadChatHistory();
    } else if (isOpen && !isAuthenticated) {
      // Not authenticated - mark as loaded so input is enabled
      setHistoryLoaded(true);
    }
  }, [isOpen, isAuthenticated, historyLoaded]);

  // Focus input when ready
  useEffect(() => {
    if (isOpen && historyLoaded && !isLoadingHistory && inputRef.current) {
      // Small delay to let animation finish
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, historyLoaded, isLoadingHistory]);

  // Reset state when chat closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setLastFailedMessage(null);
    }
  }, [isOpen]);

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      setError(null);
      const response = await fetch("/api/chat?limit=50");

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated - that's fine, just skip history
          setHistoryLoaded(true);
          return;
        }
        throw new Error("Failed to load chat history");
      }

      const data = await response.json();
      const historyMessages = (data.messages || []).map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
      }));
      setMessages(historyMessages);
      setHistoryLoaded(true);
    } catch (err) {
      console.error("Failed to load chat history:", err);
      // Still allow the user to chat even if history fails
      setHistoryLoaded(true);
      setError("Couldn't load your chat history, but you can still chat.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const clearChatHistory = async () => {
    if (
      !confirm(
        "Are you sure you want to clear your chat history? This cannot be undone."
      )
    )
      return;

    try {
      if (isAuthenticated) {
        const response = await fetch("/api/chat", { method: "DELETE" });
        if (!response.ok) {
          throw new Error("Failed to delete chat history");
        }
      }
      setMessages([]);
      setError(null);
      setLastFailedMessage(null);
    } catch (err) {
      console.error("Failed to clear chat history:", err);
      setError("Failed to clear chat history. Please try again.");
    }
  };

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isLoading) return;

      setError(null);
      setLastFailedMessage(null);

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageText.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setMascotState("thinking");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || `Request failed with status ${response.status}`
          );
        }

        if (!data.message) {
          throw new Error("Received an empty response from the AI");
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setMascotState("talking");

        // Text-to-speech
        if (ttsEnabled && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(data.message);
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => {
            setIsSpeaking(false);
            setMascotState("idle");
          };
          speechSynthesis.speak(utterance);
        } else {
          setTimeout(() => setMascotState("idle"), 2000);
        }
      } catch (err: any) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        setError(errorMsg);
        setLastFailedMessage(messageText.trim());
        setMascotState("idle");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, ttsEnabled]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      setError(null);
      sendMessage(lastFailedMessage);
    }
  };

  const dismissError = () => {
    setError(null);
    setLastFailedMessage(null);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setMascotState("idle");
    }
  };

  // Determine if input should be disabled
  const inputDisabled = isLoading || (isLoadingHistory && !historyLoaded);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 h-[85vh] glass-card rounded-t-3xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Mascot state={mascotState} size="sm" />
                <div>
                  <h3 className="font-semibold">Soul Buddy</h3>
                  <p className="text-xs text-muted-foreground">
                    {isLoadingHistory
                      ? "Loading history..."
                      : isLoading
                      ? "Thinking..."
                      : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && isAuthenticated && (
                  <button
                    onClick={clearChatHistory}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                    title="Clear chat history"
                    disabled={isLoading || isLoadingHistory}
                  >
                    <Trash2
                      className={cn(
                        "w-5 h-5 text-muted-foreground",
                        (isLoading || isLoadingHistory) && "opacity-40"
                      )}
                    />
                  </button>
                )}
                <button
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                  title={ttsEnabled ? "Disable voice" : "Enable voice"}
                >
                  {ttsEnabled ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                    title="Stop speaking"
                  >
                    <MicOff className="w-5 h-5 text-destructive" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                  title="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {isLoadingHistory ? (
                <div className="text-center py-8">
                  <Mascot state="thinking" size="lg" className="mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Loading your chat history...
                  </p>
                </div>
              ) : messages.length === 0 && !error ? (
                <div className="text-center py-8 px-4">
                  <Mascot state="happy" size="lg" className="mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    Hi! I'm Soul Buddy
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Your AI companion powered by Google Gemini
                  </p>
                  <div className="text-left max-w-sm mx-auto space-y-2 text-sm text-muted-foreground">
                    <p>I can help you with:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Bible verses and spiritual guidance</li>
                      <li>Daily motivation and encouragement</li>
                      <li>Faith-based mental wellness support</li>
                      <li>Uplifting stories and inspiration</li>
                    </ul>
                    <p className="mt-4 text-xs">
                      {isAuthenticated
                        ? "Your conversation history is saved automatically."
                        : "Sign in to save your conversation history."}
                    </p>
                  </div>
                </div>
              ) : null}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-3 rounded-2xl",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "glass-card rounded-bl-md"
                    )}
                  >
                    <div className="text-sm prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-muted-foreground"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="max-w-[90%] px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-destructive">{error}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {lastFailedMessage && (
                            <button
                              onClick={handleRetry}
                              disabled={isLoading}
                              className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Retry
                            </button>
                          )}
                          <button
                            onClick={dismissError}
                            className="text-xs text-muted-foreground hover:underline"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-border pb-safe"
            >
              <div className="flex items-center gap-2 bg-input/80 rounded-full px-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isLoadingHistory
                      ? "Loading chat..."
                      : isLoading
                      ? "Waiting for response..."
                      : "Type a message..."
                  }
                  className="flex-1 px-4 py-3 rounded-full bg-background border border-border focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground text-black dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={inputDisabled}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || inputDisabled}
                  className="p-3 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
