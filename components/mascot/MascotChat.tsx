"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Mic, MicOff, Volume2, VolumeX, Trash2 } from "lucide-react";
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
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when opening the chat (if authenticated)
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadChatHistory();
    }
  }, [isOpen, isAuthenticated]);

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch("/api/chat?limit=50");
      if (response.ok) {
        const data = await response.json();
        const historyMessages = data.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at),
        }));
        setMessages(historyMessages);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const clearChatHistory = async () => {
    if (!confirm("Are you sure you want to clear your chat history? This cannot be undone.")) return;

    try {
      if (isAuthenticated) {
        const response = await fetch("/api/chat", { method: "DELETE" });
        if (!response.ok) {
          throw new Error("Failed to delete chat history");
        }
      }
      setMessages([]);
    } catch (error) {
      console.error("Failed to clear chat history:", error);
      alert("Failed to clear chat history. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
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

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

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
    } catch {
      setMascotState("sad");
      setTimeout(() => setMascotState("idle"), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setMascotState("idle");
    }
  };

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
                    {isLoading ? "Thinking..." : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && isAuthenticated && (
                  <button
                    onClick={clearChatHistory}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                    title="Clear chat history"
                  >
                    <Trash2 className="w-5 h-5 text-muted-foreground" />
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
                  <p className="text-muted-foreground">Loading your chat history...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <Mascot state="happy" size="lg" className="mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Hi! I'm Soul Buddy</h3>
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
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
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

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-border pb-safe"
            >
              <div className="flex items-center gap-2 bg-input/80 rounded-full px-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-full bg-background border border-border focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground text-black dark:text-white"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
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
