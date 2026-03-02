"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Bell,
  BellOff,
  BellRing,
  BookOpen,
  Gamepad2,
  Trophy,
  Heart,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Send,
} from "lucide-react";

const STORAGE_KEY = "soul-sync-notif-prefs";

interface NotifPref {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const NOTIF_OPTIONS: NotifPref[] = [
  {
    id: "daily_verse",
    label: "Daily Verse",
    description: "Get your daily verse reminder each morning",
    icon: BookOpen,
  },
  {
    id: "devotional",
    label: "Devotional Reminders",
    description: "Reminders for new devotional content",
    icon: Heart,
  },
  {
    id: "games",
    label: "New Games",
    description: "Be notified when new games are added",
    icon: Gamepad2,
  },
  {
    id: "streak",
    label: "Streak Reminders",
    description: "Don't lose your streak — get evening reminders",
    icon: Trophy,
  },
  {
    id: "community",
    label: "Community Updates",
    description: "Updates on community activity and milestones",
    icon: MessageCircle,
  },
];

const DEFAULT_ENABLED = new Set(["daily_verse", "devotional", "streak"]);

type PermissionState = "default" | "granted" | "denied" | "unsupported";

function getPermission(): PermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission as PermissionState;
}

async function showNotification(title: string, body: string) {
  // Try service worker first (required for mobile / PWA)
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, {
          body,
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-96x96.png",
        } as NotificationOptions);
        return true;
      }
    } catch {}
  }

  // Fallback: Notification constructor (works on desktop without SW)
  try {
    new Notification(title, {
      body,
      icon: "/icons/icon-192x192.png",
    });
    return true;
  } catch {}

  return false;
}

export default function NotificationsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [permissionState, setPermissionState] = useState<PermissionState>("default");
  const [requesting, setRequesting] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEnabled(JSON.parse(saved));
      } else {
        const defaults: Record<string, boolean> = {};
        for (const opt of NOTIF_OPTIONS) {
          defaults[opt.id] = DEFAULT_ENABLED.has(opt.id);
        }
        setEnabled(defaults);
      }
    } catch {
      const defaults: Record<string, boolean> = {};
      for (const opt of NOTIF_OPTIONS) {
        defaults[opt.id] = DEFAULT_ENABLED.has(opt.id);
      }
      setEnabled(defaults);
    }

    setPermissionState(getPermission());
  }, []);

  useEffect(() => {
    if (Object.keys(enabled).length === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));
    } catch {}
  }, [enabled]);

  const handleToggle = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    setRequesting(true);
    try {
      const result = await Notification.requestPermission();
      setPermissionState(result as PermissionState);
      if (result === "granted") {
        toast.success("Notifications enabled!");
      } else if (result === "denied") {
        toast.error("Notifications were blocked");
      }
    } catch {
      setPermissionState("denied");
      toast.error("Could not request notification permission");
    }
    setRequesting(false);
  }, []);

  const sendTestNotification = useCallback(async () => {
    const currentPerm = getPermission();
    if (currentPerm !== "granted") {
      toast.error("Please enable notifications first");
      return;
    }

    setTestSent(true);
    const sent = await showNotification(
      "Soul Sync",
      "Notifications are working! You'll receive reminders here."
    );

    if (sent) {
      toast.success("Test notification sent!");
    } else {
      toast("Check your system notification settings — the browser may be silencing them.", {
        icon: "⚠️",
        duration: 5000,
      });
    }
    setTimeout(() => setTestSent(false), 3000);
  }, []);

  const anyEnabled = Object.values(enabled).some(Boolean);

  return (
    <div className="px-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Choose what you want to be notified about
        </p>
      </div>

      {/* Permission banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 mb-6"
      >
        {permissionState === "unsupported" ? (
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-muted">
              <BellOff className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Not Supported</p>
              <p className="text-xs text-muted-foreground">
                Your browser doesn&apos;t support notifications
              </p>
            </div>
          </div>
        ) : permissionState === "granted" ? (
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/20">
              <BellRing className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-400">Notifications Enabled</p>
              <p className="text-xs text-muted-foreground">
                You&apos;ll receive alerts based on your preferences below
              </p>
            </div>
            <button
              onClick={sendTestNotification}
              disabled={testSent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30 transition-colors disabled:opacity-50"
            >
              {testSent ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sent!
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Test
                </>
              )}
            </button>
          </div>
        ) : permissionState === "denied" ? (
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-destructive/20">
              <BellOff className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-destructive">Notifications Blocked</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                You&apos;ve blocked notifications for this site. To re-enable, click the lock icon
                in your browser&apos;s address bar and allow notifications.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Enable Notifications</p>
              <p className="text-xs text-muted-foreground">
                Allow Soul Sync to send you reminders and updates
              </p>
            </div>
            <button
              onClick={requestPermission}
              disabled={requesting}
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {requesting ? "..." : "Allow"}
            </button>
          </div>
        )}
      </motion.div>

      {/* Preference toggles */}
      <div className="glass-card overflow-hidden">
        {NOTIF_OPTIONS.map((opt, index) => {
          const isOn = !!enabled[opt.id];
          const isDisabled = permissionState !== "granted" && permissionState !== "default";

          return (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={`flex items-center gap-3 px-4 py-4 ${isDisabled ? "opacity-50" : ""}`}>
                <div className="p-2 rounded-lg bg-muted/50">
                  <opt.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {opt.description}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle(opt.id)}
                  disabled={isDisabled}
                  className={`relative w-11 h-6 rounded-full transition-colors disabled:cursor-not-allowed ${
                    isOn ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                    animate={{ left: isOn ? "calc(100% - 22px)" : "2px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
              {index < NOTIF_OPTIONS.length - 1 && <div className="h-px bg-border mx-4" />}
            </motion.div>
          );
        })}
      </div>

      {/* Hint when all off */}
      {permissionState === "granted" && !anyEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-2 mt-4 px-1"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-400">
            All notifications are turned off. Enable at least one to receive reminders.
          </p>
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Preferences are saved to your device automatically.
      </p>
    </div>
  );
}
