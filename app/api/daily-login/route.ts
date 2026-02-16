import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/** Get today's date string in UK time (Europe/London) */
function getUKDateString(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" }); // "YYYY-MM-DD"
}

/** Get current day of week in UK time (0=Sun, 6=Sat) */
function getUKDayOfWeek(): number {
  const ukDay = new Date().toLocaleDateString("en-US", { timeZone: "Europe/London", weekday: "short" });
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return dayMap[ukDay] ?? new Date().getDay();
}

// ============================================
// POST - Process daily login and award rewards
// ============================================
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    const today = getUKDateString();
    const lastLoginDate = profile.last_login_date;

    // Check if already logged in today
    if (lastLoginDate === today) {
      return NextResponse.json({
        alreadyLoggedIn: true,
        currentStreak: profile.current_streak || 0,
        message: "You've already received your daily login reward today!",
      });
    }

    // Calculate streak
    let newStreak = profile.current_streak || 0;
    let consecutiveLogins = profile.consecutive_logins || 0;
    let streakBroken = false;

    if (lastLoginDate) {
      const lastDate = new Date(lastLoginDate);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        newStreak += 1;
        consecutiveLogins += 1;
      } else if (diffDays > 1) {
        // Streak broken
        newStreak = 1;
        consecutiveLogins = 1;
        streakBroken = true;
      }
    } else {
      // First login
      newStreak = 1;
      consecutiveLogins = 1;
    }

    const longestStreak = Math.max(
      profile.longest_streak || 0,
      newStreak
    );

    // Get reward settings from database
    const { data: settingsData } = await supabase
      .from("app_settings")
      .select("key, value")
      .in("key", [
        "daily_login_points",
        "daily_login_xp",
        "streak_bonus_points",
        "weekend_bonus_points",
        "weekend_bonus_xp",
        "streak_multiplier_threshold",
        "streak_multiplier_increment",
      ]);

    // Convert to object for easy access
    const settings: Record<string, number> = {};
    settingsData?.forEach((s) => {
      settings[s.key] = parseFloat(s.value);
    });

    // Calculate rewards
    const rewards: any[] = [];
    let totalPoints = 0;
    let totalXP = 0;
    let multiplier = 1.0;

    // Base daily login reward (from settings)
    const baseDailyReward = settings.daily_login_points || 10;
    const baseDailyXP = settings.daily_login_xp || 20;

    // Streak multiplier (increases every N days from settings)
    const streakThreshold = settings.streak_multiplier_threshold || 7;
    const streakIncrement = settings.streak_multiplier_increment || 0.1;
    const streakMultiplier = 1 + Math.floor(newStreak / streakThreshold) * streakIncrement;
    multiplier = streakMultiplier;

    // Check for weekend bonus (UK time)
    const dayOfWeek = getUKDayOfWeek();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let weekendBonus = 0;
    let weekendXP = 0;

    if (isWeekend && !profile.weekend_bonus_claimed_this_week) {
      weekendBonus = settings.weekend_bonus_points || 50;
      weekendXP = settings.weekend_bonus_xp || 25;
      totalXP += weekendXP;

      rewards.push({
        type: "bonus",
        name: "Weekend Warrior",
        message: "Weekend bonus activated! 🎉",
        points: weekendBonus,
        xp: weekendXP,
        icon: "🎉",
      });

      // Update weekend bonus claim
      await supabase
        .from("profiles")
        .update({ weekend_bonus_claimed_this_week: true })
        .eq("id", user.id);
    }

    // Calculate daily login points with multiplier
    const dailyPoints = Math.floor(baseDailyReward * multiplier);
    const dailyXP = Math.floor(baseDailyXP * multiplier);
    totalPoints += dailyPoints + weekendBonus;
    totalXP += dailyXP;

    rewards.push({
      type: "daily_login",
      name: "Daily Login",
      message: `Welcome back! +${dailyPoints} points`,
      points: dailyPoints,
      xp: dailyXP,
      multiplier: multiplier.toFixed(1),
      icon: "🌟",
    });

    // Get streak milestone settings
    const { data: streakSettings } = await supabase
      .from("app_settings")
      .select("key, value")
      .or(
        "key.like.streak_%_days_points,key.like.streak_%_days_xp"
      );

    // Parse streak milestones from settings
    const streakMilestones = [
      {
        days: 3,
        points: parseFloat(streakSettings?.find(s => s.key === "streak_3_days_points")?.value || "25"),
        xp: parseFloat(streakSettings?.find(s => s.key === "streak_3_days_xp")?.value || "50"),
        name: "3-Day Streak",
        icon: "🔥"
      },
      {
        days: 7,
        points: parseFloat(streakSettings?.find(s => s.key === "streak_7_days_points")?.value || "50"),
        xp: parseFloat(streakSettings?.find(s => s.key === "streak_7_days_xp")?.value || "100"),
        name: "7-Day Streak",
        icon: "💪"
      },
      {
        days: 14,
        points: parseFloat(streakSettings?.find(s => s.key === "streak_14_days_points")?.value || "100"),
        xp: parseFloat(streakSettings?.find(s => s.key === "streak_14_days_xp")?.value || "200"),
        name: "14-Day Streak",
        icon: "🛡️"
      },
      {
        days: 30,
        points: parseFloat(streakSettings?.find(s => s.key === "streak_30_days_points")?.value || "250"),
        xp: parseFloat(streakSettings?.find(s => s.key === "streak_30_days_xp")?.value || "500"),
        name: "30-Day Streak",
        icon: "👑"
      },
      {
        days: 60,
        points: parseFloat(streakSettings?.find(s => s.key === "streak_60_days_points")?.value || "500"),
        xp: parseFloat(streakSettings?.find(s => s.key === "streak_60_days_xp")?.value || "1000"),
        name: "60-Day Streak",
        icon: "🔥"
      },
      {
        days: 100,
        points: parseFloat(streakSettings?.find(s => s.key === "streak_100_days_points")?.value || "1000"),
        xp: parseFloat(streakSettings?.find(s => s.key === "streak_100_days_xp")?.value || "2000"),
        name: "100-Day Streak",
        icon: "💎"
      },
    ];

    for (const milestone of streakMilestones) {
      if (newStreak === milestone.days) {
        totalPoints += milestone.points;
        totalXP += milestone.xp;

        rewards.push({
          type: "streak",
          name: milestone.name,
          message: `Amazing! ${milestone.days}-day streak! 🎉`,
          points: milestone.points,
          xp: milestone.xp,
          icon: milestone.icon,
        });

        // Check if there's a badge for this streak
        const { data: badge } = await supabase
          .from("badges")
          .select("*")
          .ilike("name", `%${milestone.days}%streak%`)
          .single();

        if (badge) {
          // Award badge if not already owned
          const { error: badgeError } = await supabase
            .from("user_badges")
            .insert({
              user_id: user.id,
              badge_id: badge.id,
            });

          if (!badgeError) {
            rewards.push({
              type: "badge",
              name: badge.name,
              message: `New badge unlocked: ${badge.name}!`,
              badge,
              icon: badge.icon || "🏅",
            });
          }
        }
      }
    }

    // Get perfect week and comeback settings
    const { data: bonusSettings } = await supabase
      .from("app_settings")
      .select("key, value")
      .in("key", ["perfect_week_points", "perfect_week_xp", "comeback_bonus_points"]);

    const perfectWeekPoints = parseFloat(bonusSettings?.find(s => s.key === "perfect_week_points")?.value || "200");
    const perfectWeekXP = parseFloat(bonusSettings?.find(s => s.key === "perfect_week_xp")?.value || "100");
    const comebackPoints = parseFloat(bonusSettings?.find(s => s.key === "comeback_bonus_points")?.value || "30");

    // Check for perfect week (login every day this week)
    if (consecutiveLogins >= 7 && consecutiveLogins % 7 === 0) {
      totalPoints += perfectWeekPoints;
      totalXP += perfectWeekXP;

      rewards.push({
        type: "perfect_week",
        name: "Perfect Week",
        message: "You logged in every day this week! 🏅",
        points: perfectWeekPoints,
        xp: perfectWeekXP,
        icon: "🏅",
      });
    }

    // Check for comeback (after streak was broken)
    if (streakBroken && profile.longest_streak >= 7) {
      totalPoints += comebackPoints;

      rewards.push({
        type: "comeback",
        name: "Comeback",
        message: "Welcome back! Here's a comeback bonus! 💪",
        points: comebackPoints,
        icon: "💪",
      });
    }

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        last_login_date: today,
        current_streak: newStreak,
        longest_streak: longestStreak,
        consecutive_logins: consecutiveLogins,
        points: profile.points + totalPoints,
        xp: (profile.xp || 0) + totalXP,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // Log all transactions
    for (const reward of rewards) {
      if (reward.points > 0) {
        await supabase.from("points_transactions").insert({
          user_id: user.id,
          amount: reward.points,
          source: "daily_login",
          description: reward.message,
          multiplier: reward.multiplier || 1.0,
        });
      }

      if (reward.xp > 0) {
        await supabase.from("xp_transactions").insert({
          user_id: user.id,
          amount: reward.xp,
          source: "daily_login",
          description: reward.message,
        });
      }
    }

    // Check if user leveled up
    const newXP = (profile.xp || 0) + totalXP;
    const { data: newLevelData } = await supabase
      .from("levels")
      .select("level_number")
      .lte("xp_required", newXP)
      .order("level_number", { ascending: false })
      .limit(1)
      .single();

    const newLevel = newLevelData?.level_number || 1;
    const levelUp = newLevel > (profile.level || 1);

    if (levelUp) {
      await supabase
        .from("profiles")
        .update({ level: newLevel })
        .eq("id", user.id);

      // Get level reward
      const { data: levelReward } = await supabase
        .from("levels")
        .select("*")
        .eq("level_number", newLevel)
        .single();

      if (levelReward && levelReward.points_reward > 0) {
        rewards.push({
          type: "level_up",
          name: `Level ${newLevel}`,
          message: `Congratulations! You reached level ${newLevel}! ${levelReward.badge_icon}`,
          points: levelReward.points_reward,
          icon: levelReward.badge_icon,
          levelName: levelReward.name,
        });

        await supabase.from("points_transactions").insert({
          user_id: user.id,
          amount: levelReward.points_reward,
          source: "level_up",
          description: `Level ${newLevel} reward`,
          multiplier: 1.0,
        });

        totalPoints += levelReward.points_reward;

        await supabase
          .from("profiles")
          .update({
            points: profile.points + totalPoints,
          })
          .eq("id", user.id);
      }
    }

    return NextResponse.json({
      success: true,
      newStreak,
      longestStreak,
      totalPoints,
      totalXP,
      multiplier,
      levelUp,
      newLevel: levelUp ? newLevel : profile.level,
      rewards,
      streakBroken,
      isWeekend,
      consecutiveLogins,
    });
  } catch (error) {
    console.error("Error processing daily login:", error);
    return NextResponse.json(
      { error: "Failed to process daily login" },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Check daily login status
// ============================================
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const today = getUKDateString();
    const alreadyLoggedIn = profile?.last_login_date === today;

    return NextResponse.json({
      alreadyLoggedIn,
      currentStreak: profile?.current_streak || 0,
      longestStreak: profile?.longest_streak || 0,
      lastLoginDate: profile?.last_login_date,
    });
  } catch (error) {
    console.error("Error checking login status:", error);
    return NextResponse.json(
      { error: "Failed to check login status" },
      { status: 500 }
    );
  }
}
