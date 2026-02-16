"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Trophy, MoreHorizontal, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { SoulSyncButton } from "./SoulSyncButton";
import { useMoodStore } from "@/stores/moodStore";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/ranks", icon: Trophy, label: "Ranks" },
  { href: "/more", icon: MoreHorizontal, label: "More" },
];

// Custom event to communicate with the layout's MoodSelector/MascotChat
// This avoids rendering duplicate modal instances
function dispatchNavEvent(type: "mood-selector" | "mascot-chat") {
  window.dispatchEvent(new CustomEvent("soul-sync-nav", { detail: { type } }));
}

export const BottomNav = memo(function BottomNav() {
  const pathname = usePathname();
  const { isSynced } = useMoodStore();

  const handleSoulSyncClick = () => {
    dispatchNavEvent(isSynced ? "mascot-chat" : "mood-selector");
  };

  return (
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
        <div className="flex items-center justify-center">
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
  );
});

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem = memo(function NavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} className={cn("nav-item touch-feedback", isActive && "active")} prefetch={false}>
      <div className={cn("transition-transform duration-200", isActive && "scale-110")}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs font-medium">{label}</span>
      {isActive && (
        <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--active-icon-color)]" />
      )}
    </Link>
  );
});
