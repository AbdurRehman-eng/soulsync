import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET - Fetch leaderboard rankings
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "allTime"; // weekly, monthly, allTime
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, points, current_streak, level, xp")
      .order("points", { ascending: false })
      .limit(limit);

    // Filter by time period if needed
    if (type === "weekly" || type === "monthly") {
      // For weekly/monthly, we'd need to use leaderboard_snapshots table
      // or filter by a time-based points_transactions
      // For now, we'll use all-time data
    }

    const { data: profiles, error } = await query;

    if (error) throw error;

    // Add rank to each profile
    const leaderboard = (profiles || []).map((profile, index) => ({
      id: profile.id,
      rank: index + 1,
      username: profile.username,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
      points: profile.points,
      streak: profile.current_streak,
      level: profile.level,
      xp: profile.xp,
    }));

    // Get current user's position if authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let userRank = null;
    if (user) {
      const userProfile = leaderboard.find((entry) => entry.id === user.id);
      if (userProfile) {
        userRank = {
          ...userProfile,
          rank: userProfile.rank,
        };
      } else {
        // User not in top rankings, get their actual position
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, points, current_streak, level, xp")
          .eq("id", user.id)
          .single();

        if (userProfile) {
          // Count how many users have more points
          const { count } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .gt("points", userProfile.points);

          userRank = {
            id: userProfile.id,
            rank: (count || 0) + 1,
            username: userProfile.username,
            display_name: userProfile.display_name,
            avatar_url: userProfile.avatar_url,
            points: userProfile.points,
            streak: userProfile.current_streak,
            level: userProfile.level,
            xp: userProfile.xp,
          };
        }
      }
    }

    return NextResponse.json({
      leaderboard,
      userRank,
      type,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
