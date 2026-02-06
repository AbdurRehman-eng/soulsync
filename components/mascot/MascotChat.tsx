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
  ChevronDown,
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

// ============================================
// Voice helpers
// ============================================
const VOICE_STORAGE_KEY = "soul-sync-tts-voice";

function getStoredVoiceName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(VOICE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeVoiceName(name: string) {
  try {
    localStorage.setItem(VOICE_STORAGE_KEY, name);
  } catch {
    // ignore
  }
}

/** Score a voice so we can sort the list — higher = better default */
function scoreVoice(v: SpeechSynthesisVoice): number {
  let s = 0;
  const n = v.name.toLowerCase();
  // Prefer English
  if (v.lang.startsWith("en")) s += 100;
  // Prefer online / high-quality voices
  if (!v.localService) s += 50;
  // Prefer voices with "Google", "Microsoft", "Samantha", "Natural", "Neural"
  if (/google|microsoft|natural|neural|samantha|zira|david|aria|jenny|guy/i.test(n)) s += 30;
  // Prefer female-ish names (warmer tone for a buddy)
  if (/samantha|zira|aria|jenny|karen|moira|fiona|tessa|victoria/i.test(n)) s += 10;
  // De-prioritise novelty / compact
  if (/compact|espeak/i.test(n)) s -= 40;
  return s;
}

function sortVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
}

// ============================================
// Component
// ============================================
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
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const voicePickerRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------
  // Load available TTS voices
  // ------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(sortVoices(voices));
        // Restore saved preference
        const stored = getStoredVoiceName();
        if (stored && voices.some((v) => v.name === stored)) {
          setSelectedVoiceName(stored);
        } else {
          // Pick best default
          const sorted = sortVoices(voices);
          if (sorted.length > 0) {
            setSelectedVoiceName(sorted[0].name);
          }
        }
      }
    };

    loadVoices();
    // Chrome fires this event async
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // Close voice picker when clicking outside
  useEffect(() => {
    if (!showVoicePicker) return;
    const handleClick = (e: MouseEvent) => {
      if (voicePickerRef.current && !voicePickerRef.current.contains(e.target as Node)) {
        setShowVoicePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showVoicePicker]);

  // ------------------------------------------
  // Cancel speech on close or unmount
  // ------------------------------------------
  useEffect(() => {
    if (!isOpen) {
      cancelSpeech();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => cancelSpeech();
  }, []);

  // ------------------------------------------
  // Scroll, focus, history
  // ------------------------------------------
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, error]);

  useEffect(() => {
    if (isOpen && isAuthenticated && !historyLoaded) {
      loadChatHistory();
    } else if (isOpen && !isAuthenticated) {
      setHistoryLoaded(true);
    }
  }, [isOpen, isAuthenticated, historyLoaded]);

  useEffect(() => {
    if (isOpen && historyLoaded && !isLoadingHistory && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, historyLoaded, isLoadingHistory]);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setLastFailedMessage(null);
    }
  }, [isOpen]);

  // ------------------------------------------
  // Speech helpers
  // ------------------------------------------
  const cancelSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    // Only reset mascot if it was talking
    setMascotState((prev) => (prev === "talking" ? "idle" : prev));
  };

  const speak = (text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // Always cancel any ongoing speech first
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Apply selected voice
    if (selectedVoiceName) {
      const voice = availableVoices.find((v) => v.name === selectedVoiceName);
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setMascotState("talking");
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setMascotState("idle");
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setMascotState("idle");
    };

    speechSynthesis.speak(utterance);
  };

  // ------------------------------------------
  // Voice selection
  // ------------------------------------------
  const handleVoiceSelect = (voiceName: string) => {
    setSelectedVoiceName(voiceName);
    storeVoiceName(voiceName);
    setShowVoicePicker(false);

    // Preview the voice with a short sample
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const preview = new SpeechSynthesisUtterance("Hi, I'm Soul Buddy!");
      const voice = availableVoices.find((v) => v.name === voiceName);
      if (voice) preview.voice = voice;
      preview.rate = 0.95;
      preview.pitch = 1.05;
      preview.onstart = () => setIsSpeaking(true);
      preview.onend = () => setIsSpeaking(false);
      preview.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(preview);
    }
  };

  const selectedVoice = availableVoices.find((v) => v.name === selectedVoiceName);

  // ------------------------------------------
  // Chat history
  // ------------------------------------------
  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      setError(null);
      const response = await fetch("/api/chat?limit=50");
      if (!response.ok) {
        if (response.status === 401) {
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
      setHistoryLoaded(true);
      setError("Couldn't load your chat history, but you can still chat.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const clearChatHistory = async () => {
    if (!confirm("Are you sure you want to clear your chat history? This cannot be undone."))
      return;
    try {
      if (isAuthenticated) {
        const response = await fetch("/api/chat", { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete chat history");
      }
      setMessages([]);
      setError(null);
      setLastFailedMessage(null);
    } catch (err) {
      console.error("Failed to clear chat history:", err);
      setError("Failed to clear chat history. Please try again.");
    }
  };

  // ------------------------------------------
  // Send message
  // ------------------------------------------
  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isLoading) return;

      // Stop any ongoing speech when user sends a new message
      cancelSpeech();

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
          throw new Error(data.error || `Request failed with status ${response.status}`);
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

        // Speak the response
        speak(data.message);

        if (!ttsEnabled) {
          setMascotState("talking");
          setTimeout(() => setMascotState("idle"), 2000);
        }
      } catch (err: any) {
        const errorMsg =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setError(errorMsg);
        setLastFailedMessage(messageText.trim());
        setMascotState("idle");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, ttsEnabled, selectedVoiceName, availableVoices]
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

  const handleClose = () => {
    cancelSpeech();
    onClose();
  };

  const inputDisabled = isLoading || (isLoadingHistory && !historyLoaded);

  // Group voices by language for the picker
  const englishVoices = availableVoices.filter((v) => v.lang.startsWith("en"));
  const otherVoices = availableVoices.filter((v) => !v.lang.startsWith("en"));

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
                      : isSpeaking
                      ? "Speaking..."
                      : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
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

                {/* Voice toggle + picker */}
                <div className="relative" ref={voicePickerRef}>
                  <button
                    onClick={() => {
                      if (!ttsEnabled) {
                        setTtsEnabled(true);
                      } else if (showVoicePicker) {
                        setShowVoicePicker(false);
                      } else {
                        setShowVoicePicker(true);
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setTtsEnabled(!ttsEnabled);
                    }}
                    className={cn(
                      "p-2 rounded-full hover:bg-muted/50 transition-colors relative",
                      ttsEnabled && "ring-1 ring-primary/50"
                    )}
                    title={ttsEnabled ? "Voice on — tap to pick voice, long press to disable" : "Enable voice"}
                  >
                    {ttsEnabled ? (
                      <Volume2 className="w-5 h-5 text-primary" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {/* Voice picker dropdown */}
                  <AnimatePresence>
                    {showVoicePicker && ttsEnabled && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-72 max-h-80 glass-card rounded-xl border border-border shadow-xl overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-border">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold">Choose Voice</h4>
                            <button
                              onClick={() => setTtsEnabled(false)}
                              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                            >
                              Disable voice
                            </button>
                          </div>
                          {selectedVoice && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              Current: {selectedVoice.name}
                            </p>
                          )}
                        </div>

                        <div className="overflow-y-auto max-h-60">
                          {/* English voices */}
                          {englishVoices.length > 0 && (
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 pt-2 pb-1 font-medium">
                                English
                              </p>
                              {englishVoices.map((voice) => (
                                <button
                                  key={voice.name}
                                  onClick={() => handleVoiceSelect(voice.name)}
                                  className={cn(
                                    "w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center justify-between gap-2",
                                    selectedVoiceName === voice.name && "bg-primary/10"
                                  )}
                                >
                                  <div className="min-w-0 flex-1">
                                    <p
                                      className={cn(
                                        "truncate text-sm",
                                        selectedVoiceName === voice.name
                                          ? "font-semibold text-primary"
                                          : "text-foreground"
                                      )}
                                    >
                                      {voice.name.replace(/Microsoft |Google |Apple /, "")}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground truncate">
                                      {voice.lang}
                                      {!voice.localService && " · Cloud"}
                                    </p>
                                  </div>
                                  {selectedVoiceName === voice.name && (
                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Other voices */}
                          {otherVoices.length > 0 && (
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 pt-2 pb-1 font-medium">
                                Other Languages
                              </p>
                              {otherVoices.map((voice) => (
                                <button
                                  key={voice.name}
                                  onClick={() => handleVoiceSelect(voice.name)}
                                  className={cn(
                                    "w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center justify-between gap-2",
                                    selectedVoiceName === voice.name && "bg-primary/10"
                                  )}
                                >
                                  <div className="min-w-0 flex-1">
                                    <p
                                      className={cn(
                                        "truncate text-sm",
                                        selectedVoiceName === voice.name
                                          ? "font-semibold text-primary"
                                          : "text-foreground"
                                      )}
                                    >
                                      {voice.name.replace(/Microsoft |Google |Apple /, "")}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground truncate">
                                      {voice.lang}
                                      {!voice.localService && " · Cloud"}
                                    </p>
                                  </div>
                                  {selectedVoiceName === voice.name && (
                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}

                          {availableVoices.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4 px-3">
                              No voices available on this device.
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isSpeaking && (
                  <button
                    onClick={cancelSpeech}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                    title="Stop speaking"
                  >
                    <MicOff className="w-5 h-5 text-destructive" />
                  </button>
                )}
                <button
                  onClick={handleClose}
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
              ) : messages.length === 0 && !error ? (
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
            <form onSubmit={handleSubmit} className="p-4 border-t border-border pb-safe">
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
