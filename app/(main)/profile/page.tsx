"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Camera,
  Edit2,
  Save,
  X,
  Trophy,
  Flame,
  Zap,
  Crown,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Share2,
  Heart,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { MoodHeatMap } from "@/components/profile/MoodHeatMap";

export default function ProfilePage() {
  const { profile, setProfile, isAuthenticated } = useUserStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [editForm, setEditForm] = useState({
    username: profile?.username || "",
    display_name: profile?.display_name || "",
  });
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [referralCode, setReferralCode] = useState(profile?.referral_code || "");
  const [referralRewards, setReferralRewards] = useState<{
    referrerPoints: number;
    referrerXP: number;
    newUserPoints: number;
    newUserXP: number;
  } | null>(null);
  const [activityStats, setActivityStats] = useState<{
    likes: number;
    completed: number;
    shares: number;
    referrals: number;
  } | null>(null);
  const [activityLoading, setActivityLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const fetchActivityStats = useCallback(async () => {
    if (!profile?.id) {
      setActivityLoading(false);
      return;
    }
    setActivityLoading(true);
    try {
      const supabase = createClient();

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 8000)
      );

      const queries = Promise.allSettled([
        supabase
          .from("card_interactions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", profile.id)
          .eq("interaction_type", "like"),
        supabase
          .from("card_interactions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", profile.id)
          .eq("interaction_type", "complete"),
        supabase
          .from("share_tracking")
          .select("*", { count: "exact", head: true })
          .eq("user_id", profile.id),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("referred_by", profile.id),
      ]);

      const [likesRes, completedRes, sharesRes, referralsRes] =
        await Promise.race([queries, timeout]) as Awaited<typeof queries>;

      setActivityStats({
        likes:
          likesRes.status === "fulfilled" ? likesRes.value.count ?? 0 : 0,
        completed:
          completedRes.status === "fulfilled"
            ? completedRes.value.count ?? 0
            : 0,
        shares:
          sharesRes.status === "fulfilled" ? sharesRes.value.count ?? 0 : 0,
        referrals:
          referralsRes.status === "fulfilled"
            ? referralsRes.value.count ?? 0
            : 0,
      });
    } catch {
      setActivityStats({
        likes: 0,
        completed: 0,
        shares: profile.total_shares || 0,
        referrals: profile.total_referrals || 0,
      });
    } finally {
      setActivityLoading(false);
    }
  }, [profile?.id, profile?.total_shares, profile?.total_referrals]);

  useEffect(() => {
    fetchActivityStats();
  }, [fetchActivityStats]);

  // Fetch/generate referral code + reward settings
  useEffect(() => {
    if (!profile?.id) return;

    // Always fetch reward settings
    fetch("/api/referral")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.referralCode) {
          setReferralCode(data.referralCode);
          if (!profile.referral_code) {
            setProfile({ ...profile!, referral_code: data.referralCode });
          }
        }
        if (data?.rewards) {
          setReferralRewards(data.rewards);
        }
      })
      .catch(() => {});
  }, [profile?.id]);

  useEffect(() => {
    if (profile) {
      setEditForm({
        username: profile.username || "",
        display_name: profile.display_name || "",
      });
    }
  }, [profile]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    // Reset input so same file can be selected again
    e.target.value = "";

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSaveMessage({ type: "error", text: "Please select an image file" });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({
        type: "error",
        text: "Image size must be less than 5MB",
      });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setProfile({ ...profile, avatar_url: data.avatar_url });

      setSaveMessage({ type: "success", text: "Profile image updated!" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      console.error("Image upload error:", error);
      const errorMessage =
        error?.name === "AbortError"
          ? "Upload timed out. Please try again."
          : error?.message || "Failed to upload image";
      setSaveMessage({ type: "error", text: errorMessage });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    // Validate username
    if (editForm.username && editForm.username.length < 3) {
      setSaveMessage({
        type: "error",
        text: "Username must be at least 3 characters",
      });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();

      const updates = {
        username: editForm.username || null,
        display_name: editForm.display_name || null,
      };

      const result = await Promise.race([
        supabase.from("profiles").update(updates).eq("id", profile.id),
        new Promise<{ error: { code: string; message: string } }>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 8000)
        ),
      ]);

      if (result.error) throw result.error;

      setProfile({ ...profile, ...updates });

      setSaveMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setSaveMessage(null), 3000);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Profile update error:", error);

      if (error.code === "23505") {
        setSaveMessage({ type: "error", text: "Username already taken" });
      } else if (error.message === "timeout") {
        setSaveMessage({ type: "error", text: "Save timed out. Please try again." });
      } else {
        setSaveMessage({ type: "error", text: "Failed to update profile" });
      }
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      username: profile?.username || "",
      display_name: profile?.display_name || "",
    });
    setIsEditing(false);
  };

  const handleCopyReferralCode = async () => {
    if (!referralCode) return;

    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    } catch (error) {
      console.error("Failed to copy referral code:", error);
    }
  };

  const handleCopyReferralLink = async () => {
    if (!referralCode) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const shareUrl = `${baseUrl}/signup?ref=${referralCode}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    } catch (error) {
      console.error("Failed to copy referral link:", error);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const stats = [
    {
      icon: Zap,
      label: "Points",
      value: profile.points.toLocaleString(),
      color: "text-accent",
      bgColor: "bg-accent/20",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${profile.current_streak} ${
        profile.current_streak === 1 ? "day" : "days"
      }`,
      color: "text-orange-500",
      bgColor: "bg-orange-500/20",
    },
    {
      icon: Trophy,
      label: "Longest Streak",
      value: `${profile.longest_streak} ${
        profile.longest_streak === 1 ? "day" : "days"
      }`,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
    },
    {
      icon: TrendingUp,
      label: "Level",
      value: profile.level || 1,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
    },
  ];

  const additionalStats = [
    {
      icon: Heart,
      label: "Liked",
      value: activityStats?.likes ?? 0,
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: activityStats?.completed ?? 0,
    },
    {
      icon: Share2,
      label: "Shares",
      value: activityStats?.shares ?? (profile.total_shares || 0),
    },
    {
      icon: Target,
      label: "Referrals",
      value: activityStats?.referrals ?? (profile.total_referrals || 0),
    },
    {
      icon: Calendar,
      label: "Joined",
      value: joinDate,
    },
  ];

  return (
    <div className="px-2 sm:px-4 pb-20">
      {/* Save message toast */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-card px-4 py-3 flex items-center gap-2 ${
              saveMessage.type === "success"
                ? "border-green-500"
                : "border-destructive"
            }`}
          >
            {saveMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <X className="w-5 h-5 text-destructive" />
            )}
            <span className="text-sm">{saveMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/more"
            className="p-2 -ml-2 hover:bg-muted/30 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">Profile</h1>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancelEdit}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 sm:p-6 mb-4 sm:mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-muted ring-2 ring-primary/30">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name || "Profile"}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Upload button */}
            <button
              onClick={handleImageClick}
              disabled={isUploadingImage}
              className="absolute bottom-0 right-0 p-1.5 sm:p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isUploadingImage ? (
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left w-full">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editForm.display_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, display_name: e.target.value })
                    }
                    placeholder="Your display name"
                    className="w-full px-3 py-2 rounded-lg glass-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value })
                    }
                    placeholder="username"
                    className="w-full px-3 py-2 rounded-lg glass-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg sm:text-2xl font-bold mb-1">
                  {profile.display_name || profile.username || "User"}
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  @{profile.username || "anonymous"}
                </p>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  {profile.membership_level > 1 && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                      <Crown className="w-3 h-3" />
                      {profile.membership_level === 2 ? "Plus" : "Premium"}
                    </span>
                  )}
                  {profile.is_admin && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/20 text-purple-500 text-xs font-medium">
                      <Award className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-3 sm:p-4"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">
                  {stat.label}
                </p>
                <p className="text-base sm:text-lg font-bold truncate">
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mood Heat Map */}
      <MoodHeatMap />

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4 sm:p-6 mb-4"
      >
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          Activity
        </h3>
        {activityLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {additionalStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <span className="text-sm sm:text-base">{stat.label}</span>
                </div>
                <span className="text-sm sm:text-base font-semibold">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Referral Code Card */}
      {referralCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 sm:p-6 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold">
              Referral Code
            </h3>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/20 text-accent">
              <Target className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">
                {activityStats?.referrals ?? 0} referral{(activityStats?.referrals ?? 0) !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
            Share your code with friends. When they sign up, you both earn rewards!
          </p>

          {/* Reward info */}
          {referralRewards && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-center">
                <p className="text-xs text-muted-foreground">You earn</p>
                <p className="text-sm font-bold text-green-500">
                  +{referralRewards.referrerPoints} pts
                </p>
                <p className="text-[10px] text-muted-foreground">
                  +{referralRewards.referrerXP} XP
                </p>
              </div>
              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-2 text-center">
                <p className="text-xs text-muted-foreground">Friend gets</p>
                <p className="text-sm font-bold text-blue-500">
                  +{referralRewards.newUserPoints} pts
                </p>
                <p className="text-[10px] text-muted-foreground">
                  +{referralRewards.newUserXP} XP
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-muted/50 font-mono text-sm sm:text-base">
              {referralCode}
            </div>
            <button
              onClick={handleCopyReferralCode}
              className="p-2 sm:p-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              title="Copy code"
            >
              {copiedReferral ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
          <button
            onClick={handleCopyReferralLink}
            className="w-full mt-2 py-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors text-xs sm:text-sm text-muted-foreground"
          >
            {copiedReferral ? "Copied!" : "Copy signup link"}
          </button>
        </motion.div>
      )}

      {/* Progress Card (if XP system is enabled) */}
      {profile.xp !== undefined && profile.level && (
        <XPProgressCard xp={profile.xp || 0} level={profile.level} />
      )}
    </div>
  );
}

function XPProgressCard({ xp, level }: { xp: number; level: number }) {
  const [nextLevelXP, setNextLevelXP] = useState<number | null>(null);
  const [currentLevelXP, setCurrentLevelXP] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase
        .from("levels")
        .select("xp_required")
        .eq("level_number", level)
        .maybeSingle(),
      supabase
        .from("levels")
        .select("xp_required")
        .eq("level_number", level + 1)
        .maybeSingle(),
    ]).then(([currentRes, nextRes]) => {
      setCurrentLevelXP(currentRes.data?.xp_required || 0);
      setNextLevelXP(nextRes.data?.xp_required ?? null);
    }).catch(() => {});
  }, [level]);

  const progress = useMemo(() => {
    if (nextLevelXP === null) return 100;
    const range = nextLevelXP - currentLevelXP;
    if (range <= 0) return 100;
    return Math.min(100, Math.max(0, ((xp - currentLevelXP) / range) * 100));
  }, [xp, currentLevelXP, nextLevelXP]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-semibold">Level Progress</h3>
        <span className="text-sm text-muted-foreground">
          Level {level}
        </span>
      </div>

      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        {xp.toLocaleString()} {nextLevelXP !== null ? `/ ${nextLevelXP.toLocaleString()}` : ""} XP
      </p>
    </motion.div>
  );
}
