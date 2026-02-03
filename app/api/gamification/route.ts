import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET - Fetch user gamification stats
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get comprehensive gamification stats
    const [
      profileData,
      achievementsData,
      badgesData,
      challengesData,
      bonusEventsData,
      recentXPData,
      recentPointsData,
    ] = await Promise.all([
      // Profile with level info
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single(),

      // Achievements progress
      supabase
        .from("user_achievements")
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq("user_id", user.id)
        .order("completed", { ascending: false })
        .order("progress", { ascending: false }),

      // Badges
      supabase
        .from("user_badges")
        .select(`
          *,
          badge:badges(*)
        `)
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false }),

      // Today's challenges
      supabase
        .from("user_daily_challenges")
        .select(`
          *,
          challenge:daily_challenges(*)
        `)
        .eq("user_id", user.id)
        .gte("challenge.challenge_date", new Date().toISOString().split("T")[0])
        .order("completed", { ascending: true }),

      // Active bonus events
      supabase
        .from("bonus_events")
        .select("*")
        .eq("is_active", true)
        .or(
          `start_date.is.null,start_date.lte.${new Date().toISOString().split("T")[0]}`
        )
        .or(
          `end_date.is.null,end_date.gte.${new Date().toISOString().split("T")[0]}`
        ),

      // Recent XP transactions (last 10)
      supabase
        .from("xp_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),

      // Recent points transactions (last 10)
      supabase
        .from("points_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    if (profileData.error) throw profileData.error;

    // Get current level info
    const { data: currentLevel } = await supabase
      .from("levels")
      .select("*")
      .eq("level_number", profileData.data.level || 1)
      .single();

    // Get next level info
    const { data: nextLevel } = await supabase
      .from("levels")
      .select("*")
      .eq("level_number", (profileData.data.level || 1) + 1)
      .single();

    // Calculate XP progress to next level
    const xpProgress =
      currentLevel && nextLevel
        ? {
            current: profileData.data.xp || 0,
            required: nextLevel.xp_required,
            percentage: Math.min(
              100,
              ((profileData.data.xp || 0) / nextLevel.xp_required) * 100
            ),
          }
        : null;

    return NextResponse.json({
      profile: profileData.data,
      currentLevel,
      nextLevel,
      xpProgress,
      achievements: achievementsData.data || [],
      badges: badgesData.data || [],
      dailyChallenges: challengesData.data || [],
      bonusEvents: bonusEventsData.data || [],
      recentXPGains: recentXPData.data || [],
      recentPointsGains: recentPointsData.data || [],
      stats: {
        totalAchievements: achievementsData.data?.length || 0,
        completedAchievements:
          achievementsData.data?.filter((a) => a.completed).length || 0,
        totalBadges: badgesData.data?.length || 0,
        completedChallenges:
          challengesData.data?.filter((c) => c.completed).length || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching gamification stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch gamification stats" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Award XP/Points and check for rewards
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

    const body = await request.json();
    const {
      action,
      xp,
      points,
      source,
      sourceId,
      description,
      multiplier = 1.0,
    } = body;

    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    const oldLevel = profile.level || 1;
    const oldXP = profile.xp || 0;
    const oldPoints = profile.points || 0;

    let newXP = oldXP;
    let newPoints = oldPoints;
    let levelUp = false;
    let newLevel = oldLevel;

    // Add XP if provided
    if (xp && xp > 0) {
      newXP = oldXP + xp;

      // Calculate new level
      const { data: levels } = await supabase
        .from("levels")
        .select("*")
        .lte("xp_required", newXP)
        .order("level_number", { ascending: false })
        .limit(1);

      if (levels && levels.length > 0) {
        newLevel = levels[0].level_number;
        levelUp = newLevel > oldLevel;
      }

      // Log XP transaction
      await supabase.from("xp_transactions").insert({
        user_id: user.id,
        amount: xp,
        source: source || "complete",
        source_id: sourceId,
        description,
      });
    }

    // Add points if provided (with multiplier)
    if (points && points > 0) {
      const finalPoints = Math.floor(points * multiplier);
      newPoints = oldPoints + finalPoints;

      // Log points transaction
      await supabase.from("points_transactions").insert({
        user_id: user.id,
        amount: finalPoints,
        source: source || "complete",
        source_id: sourceId,
        description,
        multiplier,
      });
    }

    // Update profile
    await supabase
      .from("profiles")
      .update({
        xp: newXP,
        level: newLevel,
        points: newPoints,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    // Check for new achievements
    const newAchievements = await checkAchievements(supabase, user.id, {
      ...profile,
      xp: newXP,
      level: newLevel,
      points: newPoints,
    });

    // If level up, award level up rewards
    if (levelUp) {
      const { data: levelReward } = await supabase
        .from("levels")
        .select("points_reward")
        .eq("level_number", newLevel)
        .single();

      if (levelReward && levelReward.points_reward > 0) {
        await supabase
          .from("points_transactions")
          .insert({
            user_id: user.id,
            amount: levelReward.points_reward,
            source: "level_up",
            description: `Level ${newLevel} reward`,
            multiplier: 1.0,
          });

        newPoints += levelReward.points_reward;

        await supabase
          .from("profiles")
          .update({ points: newPoints })
          .eq("id", user.id);
      }
    }

    return NextResponse.json({
      success: true,
      xpGained: xp || 0,
      pointsGained: points ? Math.floor(points * multiplier) : 0,
      levelUp,
      newLevel,
      oldLevel,
      newXP,
      newPoints,
      achievements: newAchievements,
      multiplier,
    });
  } catch (error) {
    console.error("Error processing gamification:", error);
    return NextResponse.json(
      { error: "Failed to process gamification" },
      { status: 500 }
    );
  }
}

// ============================================
// Helper: Check achievements
// ============================================
async function checkAchievements(
  supabase: any,
  userId: string,
  profile: any
): Promise<any[]> {
  const newAchievements: any[] = [];

  // Get all active achievements
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .eq("is_active", true);

  if (!achievements) return newAchievements;

  // Get user's current achievement progress
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", userId);

  const userAchievementMap = new Map(
    userAchievements?.map((ua: any) => [ua.achievement_id, ua]) || []
  );

  for (const achievement of achievements) {
    const userAchievement = userAchievementMap.get(achievement.id) as any;

    // Skip if already completed
    if (userAchievement?.completed) continue;

    let progress = 0;
    let completed = false;

    // Calculate progress based on requirement type
    switch (achievement.requirement_type) {
      case "streak_days":
        progress = profile.current_streak || 0;
        break;
      case "total_shares":
        progress = profile.total_shares || 0;
        break;
      case "total_points":
        progress = profile.points || 0;
        break;
      case "level_reached":
        progress = profile.level || 1;
        break;
      case "referrals":
        progress = profile.total_referrals || 0;
        break;
      case "cards_completed":
        const { count: cardsCount } = await supabase
          .from("card_interactions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("interaction_type", "complete");
        progress = cardsCount || 0;
        break;
      case "moods_logged":
        const { count: moodsCount } = await supabase
          .from("mood_logs")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        progress = moodsCount || 0;
        break;
      case "chat_messages":
        const { count: chatCount } = await supabase
          .from("chat_messages")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("role", "user");
        progress = chatCount || 0;
        break;
    }

    // Check if completed
    if (
      achievement.requirement_value &&
      progress >= achievement.requirement_value
    ) {
      completed = true;
    }

    // Update or insert user achievement
    if (!userAchievement) {
      await supabase.from("user_achievements").insert({
        user_id: userId,
        achievement_id: achievement.id,
        progress,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      });
    } else if (completed && !userAchievement.completed) {
      await supabase
        .from("user_achievements")
        .update({
          progress,
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", userAchievement.id);
    } else if (progress !== userAchievement.progress) {
      await supabase
        .from("user_achievements")
        .update({ progress })
        .eq("id", userAchievement.id);
    }

    // If newly completed, add rewards
    if (completed && !userAchievement?.completed) {
      newAchievements.push(achievement);

      // Award XP and points
      if (achievement.xp_reward > 0) {
        await supabase.from("xp_transactions").insert({
          user_id: userId,
          amount: achievement.xp_reward,
          source: "achievement",
          source_id: achievement.id,
          description: `Achievement: ${achievement.name}`,
        });

        await supabase.rpc("add_xp", {
          p_user_id: userId,
          p_amount: achievement.xp_reward,
          p_source: "achievement",
          p_source_id: achievement.id,
          p_description: `Achievement: ${achievement.name}`,
        });
      }

      if (achievement.points_reward > 0) {
        await supabase.from("points_transactions").insert({
          user_id: userId,
          amount: achievement.points_reward,
          source: "achievement",
          source_id: achievement.id,
          description: `Achievement: ${achievement.name}`,
          multiplier: 1.0,
        });

        await supabase
          .from("profiles")
          .update({
            points: profile.points + achievement.points_reward,
          })
          .eq("id", userId);
      }
    }
  }

  return newAchievements;
}
