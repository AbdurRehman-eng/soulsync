import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isToday, daysBetween } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    let reward = null;
    let pointsToAdd = 0;
    let newStreak = profile.current_streak;

    // Check for daily login reward
    if (action === "daily_login") {
      const lastLogin = profile.last_login
        ? new Date(profile.last_login)
        : null;
      const today = new Date();

      // Check if already logged in today
      if (lastLogin && isToday(lastLogin)) {
        return NextResponse.json({
          reward: null,
          message: "Already claimed today's reward",
        });
      }

      // Calculate streak
      if (lastLogin) {
        const daysSinceLogin = daysBetween(lastLogin, today);
        if (daysSinceLogin === 1) {
          // Consecutive day - increase streak
          newStreak = profile.current_streak + 1;
        } else if (daysSinceLogin > 1) {
          // Streak broken
          newStreak = 1;
        }
      } else {
        // First login
        newStreak = 1;
      }

      // Get daily login reward
      const { data: loginReward } = await supabase
        .from("rewards")
        .select("*")
        .eq("type", "daily_login")
        .eq("is_active", true)
        .single();

      if (loginReward) {
        reward = loginReward;
        pointsToAdd = loginReward.points;
      }

      // Check for streak milestone rewards
      const streakMilestones = [3, 7, 14, 30, 60, 100];
      if (streakMilestones.includes(newStreak)) {
        const { data: streakReward } = await supabase
          .from("rewards")
          .select("*")
          .eq("type", "streak")
          .eq("trigger_value", newStreak)
          .eq("is_active", true)
          .single();

        if (streakReward) {
          // Streak reward takes precedence
          reward = streakReward;
          pointsToAdd += streakReward.points;
        }
      }

      // Update profile
      await supabase
        .from("profiles")
        .update({
          last_login: today.toISOString().split("T")[0],
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, profile.longest_streak),
          points: profile.points + pointsToAdd,
        })
        .eq("id", user.id);

      // Record reward claim
      if (reward) {
        await supabase.from("user_rewards").insert({
          user_id: user.id,
          reward_id: reward.id,
        });
      }
    }

    // Check for milestone rewards based on points
    if (action === "check_milestones") {
      const newPoints = profile.points;
      const pointMilestones = [100, 500, 1000, 5000, 10000];

      for (const milestone of pointMilestones) {
        if (newPoints >= milestone) {
          // Check if already claimed
          const { data: claimed } = await supabase
            .from("user_rewards")
            .select("id")
            .eq("user_id", user.id)
            .eq("reward_id", (
              await supabase
                .from("rewards")
                .select("id")
                .eq("type", "milestone")
                .eq("trigger_value", milestone)
                .single()
            ).data?.id)
            .single();

          if (!claimed) {
            const { data: milestoneReward } = await supabase
              .from("rewards")
              .select("*")
              .eq("type", "milestone")
              .eq("trigger_value", milestone)
              .eq("is_active", true)
              .single();

            if (milestoneReward) {
              reward = milestoneReward;
              pointsToAdd = milestoneReward.points;

              // Update points and record claim
              await supabase
                .from("profiles")
                .update({ points: profile.points + pointsToAdd })
                .eq("id", user.id);

              await supabase.from("user_rewards").insert({
                user_id: user.id,
                reward_id: milestoneReward.id,
              });

              break; // Only award one milestone at a time
            }
          }
        }
      }
    }

    return NextResponse.json({
      reward,
      pointsAwarded: pointsToAdd,
      newStreak,
      newPoints: profile.points + pointsToAdd,
    });
  } catch (error) {
    console.error("Rewards API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user's rewards history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: userRewards, error } = await supabase
      .from("user_rewards")
      .select(
        `
        *,
        reward:rewards(*)
      `
      )
      .eq("user_id", user.id)
      .order("claimed_at", { ascending: false });

    if (error) {
      console.error("Error fetching rewards:", error);
      return NextResponse.json(
        { error: "Failed to fetch rewards" },
        { status: 500 }
      );
    }

    return NextResponse.json({ rewards: userRewards });
  } catch (error) {
    console.error("Rewards API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
