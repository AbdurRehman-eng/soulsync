"use client";

import { motion } from "framer-motion";
import { Crown, Check, Zap, Star, Shield, Sparkles } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";

const tiers = [
  {
    level: 1,
    name: "Free",
    price: "Free",
    color: "from-gray-500 to-gray-600",
    badge: "bg-gray-500/20 text-gray-400",
    features: [
      "Daily verse, devotional & prayer",
      "Basic mini games & quizzes",
      "3 themes",
      "Mood tracking",
      "Community feed",
    ],
  },
  {
    level: 2,
    name: "Plus",
    price: "£2.99/mo",
    color: "from-blue-500 to-cyan-500",
    badge: "bg-blue-500/20 text-blue-400",
    features: [
      "Everything in Free",
      "Exclusive devotionals & articles",
      "AR games & experiences",
      "Journal prompts",
      "Priority support",
      "Ad-free experience",
    ],
  },
  {
    level: 3,
    name: "Premium",
    price: "£5.99/mo",
    color: "from-amber-500 to-orange-500",
    badge: "bg-amber-500/20 text-amber-400",
    features: [
      "Everything in Plus",
      "All premium content unlocked",
      "Exclusive themes & customisation",
      "Early access to new features",
      "Direct pastor chat access",
      "Offline content downloads",
      "Family sharing (up to 5)",
    ],
  },
];

export default function MembershipPage() {
  const { profile } = useUserStore();
  const router = useRouter();
  const currentLevel = profile?.membership_level ?? 1;

  return (
    <div className="px-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Membership</h1>
        <p className="text-sm text-muted-foreground">
          Upgrade to unlock more spiritual content
        </p>
      </div>

      {/* Current plan badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 mb-6 flex items-center gap-3"
      >
        <div className="p-2.5 rounded-xl bg-accent/20">
          <Crown className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Current plan</p>
          <p className="text-lg font-bold">
            {tiers.find((t) => t.level === currentLevel)?.name || "Free"}
          </p>
        </div>
        {currentLevel > 1 && (
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
            Active
          </span>
        )}
      </motion.div>

      {/* Tier cards */}
      <div className="space-y-4">
        {tiers.map((tier, index) => {
          const isCurrent = tier.level === currentLevel;
          const isUpgrade = tier.level > currentLevel;

          return (
            <motion.div
              key={tier.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card overflow-hidden ${isCurrent ? "ring-2 ring-accent" : ""}`}
            >
              {/* Tier header */}
              <div className={`bg-gradient-to-r ${tier.color} p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                    <p className="text-white/80 text-sm">{tier.price}</p>
                  </div>
                  {isCurrent && (
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
                      Current
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="p-4">
                <ul className="space-y-2.5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isUpgrade && (
                  <button className={`w-full mt-4 py-3 rounded-xl bg-gradient-to-r ${tier.color} text-white font-semibold text-sm hover:opacity-90 transition-opacity`}>
                    Upgrade to {tier.name}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-muted-foreground">
          Cancel anytime. All plans include a 7-day free trial.
        </p>
      </motion.div>
    </div>
  );
}
