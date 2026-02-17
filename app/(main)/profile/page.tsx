"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
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
  CheckCircle2,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

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
      // Use API route for upload (handles storage permissions server-side)
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      // Update local state with new avatar URL
      setProfile({ ...profile, avatar_url: data.avatar_url });

      setSaveMessage({ type: "success", text: "Profile image updated!" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      console.error("Image upload error:", error);
      const errorMessage = error?.message || "Failed to upload image";
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

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile.id);

      if (error) throw error;

      // Update local state
      setProfile({ ...profile, ...updates });

      setSaveMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setSaveMessage(null), 3000);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Profile update error:", error);

      // Check if it's a unique constraint error
      if (error.code === "23505") {
        setSaveMessage({ type: "error", text: "Username already taken" });
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
    if (!profile?.referral_code) return;

    try {
      await navigator.clipboard.writeText(profile.referral_code);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    } catch (error) {
      console.error("Failed to copy referral code:", error);
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
      icon: Share2,
      label: "Shares",
      value: profile.total_shares || 0,
    },
    {
      icon: Target,
      label: "Referrals",
      value: profile.total_referrals || 0,
    },
    {
      icon: Calendar,
      label: "Joined",
      value: joinDate,
    },
  ];

  return (
    <div className="px-2 sm:px-4">
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
        <h1 className="text-xl sm:text-2xl font-bold">Profile</h1>
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
        <div className="space-y-3">
          {additionalStats.map((stat, index) => (
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
      </motion.div>

      {/* Referral Code Card */}
      {profile.referral_code && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 sm:p-6 mb-4"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3">
            Referral Code
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
            Share your code and earn rewards when friends join!
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-muted/50 font-mono text-sm sm:text-base">
              {profile.referral_code}
            </div>
            <button
              onClick={handleCopyReferralCode}
              className="p-2 sm:p-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {copiedReferral ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Progress Card (if XP system is enabled) */}
      {profile.xp !== undefined && profile.level && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold">Level Progress</h3>
            <span className="text-sm text-muted-foreground">
              Level {profile.level}
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {profile.xp?.toLocaleString() || 0} XP
          </p>
        </motion.div>
      )}
    </div>
  );
}
