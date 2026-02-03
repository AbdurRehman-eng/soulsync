import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET - Fetch today's challenges
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

    const today = new Date().toISOString().split("T")[0];

    // Get today's challenges
    const { data: challenges, error: challengesError } = await supabase
      .from("daily_challenges")
      .select("*")
      .eq("challenge_date", today)
      .eq("is_active", true);

    if (challengesError) throw challengesError;

    // If no challenges exist for today, generate them
    if (!challenges || challenges.length === 0) {
      const generatedChallenges = await generateDailyChallenges(supabase, today);

      // Get user's progress for these challenges
      const { data: userProgress } = await supabase
        .from("user_daily_challenges")
        .select("*")
        .eq("user_id", user.id)
        .in("challenge_id", generatedChallenges.map((c: any) => c.id));

      const challengesWithProgress = generatedChallenges.map((challenge: any) => {
        const progress = userProgress?.find((p) => p.challenge_id === challenge.id);
        return {
          ...challenge,
          userProgress: progress || null,
        };
      });

      return NextResponse.json({ challenges: challengesWithProgress });
    }

    // Get user's progress for today's challenges
    const { data: userProgress } = await supabase
      .from("user_daily_challenges")
      .select("*")
      .eq("user_id", user.id)
      .in("challenge_id", challenges.map((c) => c.id));

    const challengesWithProgress = challenges.map((challenge) => {
      const progress = userProgress?.find((p) => p.challenge_id === challenge.id);
      return {
        ...challenge,
        userProgress: progress || null,
      };
    });

    return NextResponse.json({ challenges: challengesWithProgress });
  } catch (error) {
    console.error("Error fetching daily challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily challenges" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Update challenge progress
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
    const { challengeId, progress } = body;

    // Get challenge details
    const { data: challenge, error: challengeError } = await supabase
      .from("daily_challenges")
      .select("*")
      .eq("id", challengeId)
      .single();

    if (challengeError) throw challengeError;

    // Check if user has progress record
    const { data: existingProgress } = await supabase
      .from("user_daily_challenges")
      .select("*")
      .eq("user_id", user.id)
      .eq("challenge_id", challengeId)
      .single();

    const newProgress = progress;
    const completed = newProgress >= challenge.requirement_count;

    if (existingProgress) {
      // Update existing progress
      await supabase
        .from("user_daily_challenges")
        .update({
          progress: newProgress,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq("id", existingProgress.id);
    } else {
      // Create new progress record
      await supabase.from("user_daily_challenges").insert({
        user_id: user.id,
        challenge_id: challengeId,
        progress: newProgress,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      });
    }

    // If completed, award rewards
    if (completed && !existingProgress?.completed) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        // Calculate rewards with multiplier
        const pointsReward = Math.floor(
          challenge.points_reward * challenge.multiplier
        );
        const xpReward = Math.floor(
          challenge.xp_reward * challenge.multiplier
        );

        // Award points
        await supabase.from("points_transactions").insert({
          user_id: user.id,
          amount: pointsReward,
          source: "challenge",
          source_id: challengeId,
          description: `Completed: ${challenge.title}`,
          multiplier: challenge.multiplier,
        });

        // Award XP
        await supabase.from("xp_transactions").insert({
          user_id: user.id,
          amount: xpReward,
          source: "challenge",
          source_id: challengeId,
          description: `Completed: ${challenge.title}`,
        });

        // Update profile
        await supabase
          .from("profiles")
          .update({
            points: profile.points + pointsReward,
            xp: (profile.xp || 0) + xpReward,
          })
          .eq("id", user.id);

        return NextResponse.json({
          success: true,
          completed: true,
          rewards: {
            points: pointsReward,
            xp: xpReward,
            multiplier: challenge.multiplier,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      completed,
      progress: newProgress,
    });
  } catch (error) {
    console.error("Error updating challenge progress:", error);
    return NextResponse.json(
      { error: "Failed to update challenge progress" },
      { status: 500 }
    );
  }
}

// ============================================
// Helper: Generate daily challenges
// ============================================
async function generateDailyChallenges(supabase: any, date: string) {
  // Define challenge types pool
  const challengeTypes = [
    {
      type: "mood_sync",
      title: "Morning Mood Check",
      description: "Sync your mood to start the day",
      requirement_count: 1,
      xp_reward: 30,
      points_reward: 15,
      multiplier: 1.5,
      icon: "😊",
    },
    {
      type: "share_card",
      title: "Spread the Love",
      description: "Share 2 cards with friends",
      requirement_count: 2,
      xp_reward: 50,
      points_reward: 25,
      multiplier: 2.0,
      icon: "📤",
    },
    {
      type: "complete_task",
      title: "Task Master",
      description: "Complete 3 cards today",
      requirement_count: 3,
      xp_reward: 60,
      points_reward: 30,
      multiplier: 1.8,
      icon: "✅",
    },
    {
      type: "chat_message",
      title: "Soul Talk",
      description: "Chat with Soul Buddy 5 times",
      requirement_count: 5,
      xp_reward: 40,
      points_reward: 20,
      multiplier: 1.5,
      icon: "💬",
    },
    {
      type: "streak_maintain",
      title: "Keep the Streak",
      description: "Maintain your login streak",
      requirement_count: 1,
      xp_reward: 50,
      points_reward: 25,
      multiplier: 2.0,
      icon: "🔥",
    },
  ];

  // Select 3 random challenges for today
  const shuffled = challengeTypes.sort(() => 0.5 - Math.random());
  const selectedChallenges = shuffled.slice(0, 3);

  // Insert challenges into database
  const { data: insertedChallenges, error } = await supabase
    .from("daily_challenges")
    .insert(
      selectedChallenges.map((challenge) => ({
        challenge_date: date,
        ...challenge,
      }))
    )
    .select();

  if (error) {
    console.error("Error creating daily challenges:", error);
    return [];
  }

  return insertedChallenges || [];
}
