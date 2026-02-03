import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET - Fetch active bonus events
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

    // Get active bonus events
    const { data: events, error: eventsError } = await supabase
      .from("bonus_events")
      .select("*")
      .eq("is_active", true)
      .or(`start_date.is.null,start_date.lte.${today}`)
      .or(`end_date.is.null,end_date.gte.${today}`);

    if (eventsError) throw eventsError;

    // Get user profile to check eligibility
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Check eligibility for each event
    const eventsWithEligibility = await Promise.all(
      (events || []).map(async (event) => {
        let eligible = false;
        let progress = 0;
        let requirementText = "";

        switch (event.event_type) {
          case "weekend_bonus":
            const dayOfWeek = new Date().getDay();
            eligible = (dayOfWeek === 0 || dayOfWeek === 6) &&
                      !profile?.weekend_bonus_claimed_this_week;
            requirementText = "Login on weekend";
            progress = eligible ? 0 : 1;
            break;

          case "perfect_week":
            eligible = profile?.perfect_week_eligible || false;
            const consecutiveLogins = profile?.consecutive_logins || 0;
            progress = Math.min(consecutiveLogins, 7);
            requirementText = "Login every day for 7 days";
            break;

          case "mood_variety":
            // Check how many different moods logged this week
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - 7);

            const { data: moodLogs } = await supabase
              .from("mood_logs")
              .select("mood_id")
              .eq("user_id", user.id)
              .gte("logged_at", weekStart.toISOString());

            const uniqueMoods = new Set(moodLogs?.map((log) => log.mood_id));
            progress = uniqueMoods.size;
            eligible = progress >= 5;
            requirementText = "Log 5 different moods this week";
            break;

          case "social_surge":
            eligible = true; // Always active, affects share rewards
            requirementText = "Bonus multiplier on all shares";
            break;

          case "content_sprint":
            // Check cards completed today
            const { count: todayCompleted } = await supabase
              .from("card_interactions")
              .select("*", { count: "exact", head: true })
              .eq("user_id", user.id)
              .eq("interaction_type", "complete")
              .gte("created_at", new Date().toISOString().split("T")[0]);

            progress = todayCompleted || 0;
            eligible = progress >= (event.requirements?.count || 5);
            requirementText = `Complete ${event.requirements?.count || 5} cards today`;
            break;
        }

        return {
          ...event,
          eligible,
          progress,
          requirementText,
        };
      })
    );

    return NextResponse.json({ events: eventsWithEligibility });
  } catch (error) {
    console.error("Error fetching bonus events:", error);
    return NextResponse.json(
      { error: "Failed to fetch bonus events" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Claim bonus event reward
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
    const { eventId } = body;

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from("bonus_events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError) throw eventError;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    // Check eligibility based on event type
    let canClaim = false;
    let updateProfile: any = {};

    switch (event.event_type) {
      case "weekend_bonus":
        const dayOfWeek = new Date().getDay();
        canClaim = (dayOfWeek === 0 || dayOfWeek === 6) &&
                  !profile.weekend_bonus_claimed_this_week;
        if (canClaim) {
          updateProfile.weekend_bonus_claimed_this_week = true;
        }
        break;

      case "perfect_week":
        canClaim = profile.consecutive_logins >= 7 && profile.perfect_week_eligible;
        if (canClaim) {
          updateProfile.perfect_week_eligible = false;
        }
        break;

      case "mood_variety":
        // Check mood variety
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);

        const { data: moodLogs } = await supabase
          .from("mood_logs")
          .select("mood_id")
          .eq("user_id", user.id)
          .gte("logged_at", weekStart.toISOString());

        const uniqueMoods = new Set(moodLogs?.map((log) => log.mood_id));
        canClaim = uniqueMoods.size >= 5;
        break;

      case "content_sprint":
        const { count: todayCompleted } = await supabase
          .from("card_interactions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("interaction_type", "complete")
          .gte("created_at", new Date().toISOString().split("T")[0]);

        canClaim = (todayCompleted || 0) >= (event.requirements?.count || 5);
        break;
    }

    if (!canClaim) {
      return NextResponse.json(
        { error: "Not eligible to claim this bonus" },
        { status: 400 }
      );
    }

    // Award rewards
    const pointsReward = event.bonus_points || 0;
    const xpReward = event.bonus_xp || 0;

    // Log transactions
    if (pointsReward > 0) {
      await supabase.from("points_transactions").insert({
        user_id: user.id,
        amount: pointsReward,
        source: "bonus_event",
        source_id: eventId,
        description: `Bonus Event: ${event.name}`,
        multiplier: event.multiplier || 1.0,
      });
    }

    if (xpReward > 0) {
      await supabase.from("xp_transactions").insert({
        user_id: user.id,
        amount: xpReward,
        source: "bonus_event",
        source_id: eventId,
        description: `Bonus Event: ${event.name}`,
      });
    }

    // Update profile
    await supabase
      .from("profiles")
      .update({
        points: profile.points + pointsReward,
        xp: (profile.xp || 0) + xpReward,
        ...updateProfile,
      })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      rewards: {
        points: pointsReward,
        xp: xpReward,
        multiplier: event.multiplier,
      },
      event: event.name,
    });
  } catch (error) {
    console.error("Error claiming bonus event:", error);
    return NextResponse.json(
      { error: "Failed to claim bonus event" },
      { status: 500 }
    );
  }
}
