"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ListTodo, Trophy, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { SoulSyncButton } from "./SoulSyncButton";
import { MoodSelector } from "@/components/mood/MoodSelector";
import { MascotChat } from "@/components/mascot/MascotChat";
import { useMoodStore } from "@/stores/moodStore";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/tasks", icon: ListTodo, label: "Tasks" },
  { href: "/ranks", icon: Trophy, label: "Ranks" },
  { href: "/more", icon: MoreHorizontal, label: "More" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { isSynced } = useMoodStore();

  const handleSoulSyncClick = () => {
    if (!isSynced) {
      setShowMoodSelector(true);
    } else {
      setShowChat(true);
    }
  };

  return (
    <>
      <nav className="bottom-nav pb-safe">
        <div className="bottom-nav-inner">
          {/* Left nav items */}
          {navItems.slice(0, 2).map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}

          {/* Center Soul Sync Button */}
          <div className="flex items-center">
            <SoulSyncButton onClick={handleSoulSyncClick} />
          </div>

          {/* Right nav items */}
          {navItems.slice(2).map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </nav>

      {/* Mood Selector Modal */}
      <MoodSelector
        isOpen={showMoodSelector}
        onClose={() => setShowMoodSelector(false)}
      />

      {/* AI Chat Modal */}
      <MascotChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} className={cn("nav-item touch-feedback", isActive && "active")}>
      <motion.div
        initial={false}
        animate={isActive ? { scale: 1.1 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Icon className="w-6 h-6" />
      </motion.div>
      <span className="text-xs font-medium">{label}</span>
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--active-icon-color)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </Link>
  );
}
