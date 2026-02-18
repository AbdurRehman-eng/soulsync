"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Smile,
    Files,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ListTodo,
    Trophy,
    FolderOpen,
    BookOpen,
    Pause,
    Shuffle,
    HelpCircle,
    Box,
    Music,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/moods", icon: Smile, label: "Moods" },
    { href: "/admin/cards", icon: Files, label: "Content" },
    { href: "/admin/categories", icon: FolderOpen, label: "Categories" },
    { href: "/admin/tasks", icon: ListTodo, label: "Tasks" },
    { href: "/admin/levels", icon: Trophy, label: "Levels" },
    { href: "/admin/feed-patterns", icon: Shuffle, label: "Feed Patterns" },
    { href: "/admin/pause-cards", icon: Pause, label: "Pause Cards" },
    { href: "/admin/daily-quiz", icon: HelpCircle, label: "Daily Quiz" },
    { href: "/admin/ar-assets", icon: Box, label: "AR Assets" },
    { href: "/admin/ar-music", icon: Music, label: "AR Music" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
    { href: "/admin/manual", icon: BookOpen, label: "Manual" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 glass-card text-[var(--foreground)]"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:m-4 md:h-[calc(100vh-2rem)]",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full glass-card flex flex-col overflow-hidden border border-[var(--border)]">
                    {/* Header */}
                    <div className="p-6 border-b border-[var(--border)] bg-[var(--card)]/50">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                            Soul Sync Admin
                        </h1>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                            Management Portal
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                                    )}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-[var(--border)] bg-[var(--card)]/50">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors"
                        >
                            <LogOut size={18} />
                            Exit Admin
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
