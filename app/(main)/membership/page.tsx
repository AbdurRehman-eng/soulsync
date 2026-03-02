"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, Crown, Check, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/lib/supabase/client";

const tiers = [
  {
    level: 1,
    name: "Free",
    price: "Free",
    period: "",
    color: "from-gray-500 to-gray-600",
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
    price: "\u00a32.99",
    period: "/mo",
    color: "from-blue-500 to-cyan-500",
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
    price: "\u00a35.99",
    period: "/mo",
    color: "from-amber-500 to-orange-500",
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

interface SubscriptionInfo {
  status: string;
  plan_name: string;
  current_period_end: string | null;
}

export default function MembershipPage() {
  const { profile } = useUserStore();
  const currentLevel = profile?.membership_level ?? 1;
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loadingSub, setLoadingSub] = useState(false);

  useEffect(() => {
    if (!profile || currentLevel <= 1) return;

    async function fetchSubscription() {
      setLoadingSub(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("subscriptions")
          .select("status, current_period_end, membership_plans(name)")
          .eq("user_id", profile!.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          setSubscription({
            status: data.status,
            plan_name: (data as any).membership_plans?.name || "Plus",
            current_period_end: data.current_period_end,
          });
        }
      } catch {}
      setLoadingSub(false);
    }
    fetchSubscription();
  }, [profile, currentLevel]);

  const handleUpgrade = (tierName: string) => {
    toast("Membership upgrades are coming soon! Stay tuned.", {
      icon: "\u2728",
      duration: 4000,
    });
  };

  const handleManageSubscription = () => {
    toast("Subscription management is coming soon.", {
      icon: "\u2139\ufe0f",
      duration: 3000,
    });
  };

  return (
    <div className="px-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/more"
          className="p-2 -ml-2 hover:bg-muted/30 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Membership</h1>
          <p className="text-sm text-muted-foreground">
            Upgrade to unlock more spiritual content
          </p>
        </div>
      </div>

      {/* Current plan badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/20">
            <Crown className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
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
        </div>

        {/* Subscription details for paid users */}
        {currentLevel > 1 && subscription && (
          <div className="mt-3 pt-3 border-t border-border">
            {subscription.current_period_end && (
              <p className="text-xs text-muted-foreground mb-2">
                Renews {new Date(subscription.current_period_end).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
            <button
              onClick={handleManageSubscription}
              className="text-xs text-primary font-medium hover:underline"
            >
              Manage subscription
            </button>
          </div>
        )}
        {currentLevel > 1 && loadingSub && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Loading subscription details...</p>
          </div>
        )}
      </motion.div>

      {/* Tier cards */}
      <div className="space-y-4">
        {tiers.map((tier, index) => {
          const isCurrent = tier.level === currentLevel;
          const isUpgrade = tier.level > currentLevel;
          const isDowngrade = tier.level < currentLevel;

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
                    <p className="text-white/80 text-sm">
                      {tier.price}
                      {tier.period && <span className="text-white/60">{tier.period}</span>}
                    </p>
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
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDowngrade ? "text-muted-foreground" : "text-green-400"}`} />
                      <span className={`text-sm ${isDowngrade ? "text-muted-foreground" : ""}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isUpgrade && (
                  <button
                    onClick={() => handleUpgrade(tier.name)}
                    className={`w-full mt-4 py-3 rounded-xl bg-gradient-to-r ${tier.color} text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                  >
                    Upgrade to {tier.name}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

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
