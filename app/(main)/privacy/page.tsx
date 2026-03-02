"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect information you provide when creating an account (email, display name, username), your mood selections, journal entries, quiz/game scores, content interactions (likes, views, shares), and login streaks. We also collect basic device and usage data to improve the app experience.",
  },
  {
    title: "How We Use Your Data",
    content:
      "Your data is used to personalise your daily feed, track your progress and streaks, deliver mood-based content recommendations, maintain your account, and improve Soul Sync. We never sell your personal data to third parties.",
  },
  {
    title: "Data Storage & Security",
    content:
      "Your data is securely stored using Supabase (hosted on AWS infrastructure). We use Row Level Security (RLS) policies to ensure only you can access your personal data. All data is transmitted over encrypted HTTPS connections.",
  },
  {
    title: "Journal Entries",
    content:
      "Your journal entries are private and encrypted. They are only accessible by you through your authenticated account. Soul Sync team members cannot read your journal entries.",
  },
  {
    title: "Cookies & Local Storage",
    content:
      "We use cookies for authentication sessions and local storage for app preferences (theme, mood state). These are essential for the app to function and are not used for advertising or tracking.",
  },
  {
    title: "Third-Party Services",
    content:
      "We use Supabase for authentication and data storage, and Vercel for hosting. These services have their own privacy policies. We do not integrate any advertising or analytics tracking services.",
  },
  {
    title: "Camera & Device Access",
    content:
      "AR games may request camera access for the augmented reality experience. Camera data is processed locally on your device and is never uploaded or stored on our servers. You can play games without granting camera access.",
  },
  {
    title: "Data Deletion",
    content:
      "You can delete your account at any time through Settings > Delete Account. This permanently removes all your data from our servers, including your profile, journal entries, progress, and interaction history.",
  },
  {
    title: "Children's Privacy",
    content:
      "Soul Sync is designed for users aged 13 and above. We do not knowingly collect data from children under 13. If you believe a child has provided us with personal information, please contact us so we can remove it.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this privacy policy from time to time. We will notify you of significant changes through the app. Continued use of Soul Sync after changes indicates acceptance of the updated policy.",
  },
  {
    title: "Contact Us",
    content:
      "If you have questions about this privacy policy or your data, please contact us at support@soulsync.app or through the Contact page in the app.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="px-4 pb-20">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Last updated: March 2026
        </p>
      </div>

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 mb-6"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          Soul Sync values your privacy. This policy explains what data we collect,
          how we use it, and how we protect it. We are committed to transparency
          and keeping your personal information safe.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="glass-card p-4"
          >
            <h3 className="text-sm font-semibold mb-2">{section.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
