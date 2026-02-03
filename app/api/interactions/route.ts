import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    const { card_id, type } = await request.json();

    if (!card_id || !type) {
      return NextResponse.json(
        { error: "card_id and type are required" },
        { status: 400 }
      );
    }

    if (!["view", "like", "share", "complete"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid interaction type" },
        { status: 400 }
      );
    }

    // Check if interaction already exists for likes (toggle behavior)
    if (type === "like") {
      const { data: existing } = await supabase
        .from("card_interactions")
        .select("id")
        .eq("user_id", user.id)
        .eq("card_id", card_id)
        .eq("interaction_type", "like")
        .single();

      if (existing) {
        // Unlike - delete the interaction
        console.log(`[Interactions API] Unliking card ${card_id} for user ${user.id}`);
        await supabase
          .from("card_interactions")
          .delete()
          .eq("id", existing.id);

        return NextResponse.json({ success: true, liked: false });
      } else {
        console.log(`[Interactions API] Liking card ${card_id} for user ${user.id}`);
      }
    }

    // Create the interaction
    const { error } = await supabase.from("card_interactions").insert({
      user_id: user.id,
      card_id,
      interaction_type: type,
    });

    if (error) {
      console.error("Error creating interaction:", error);
      return NextResponse.json(
        { error: "Failed to record interaction" },
        { status: 500 }
      );
    }

    // Award points for certain interactions
    let pointsAwarded = 0;
    if (type === "share") {
      pointsAwarded = 5;
    } else if (type === "complete") {
      // Get card's points reward
      const { data: card } = await supabase
        .from("cards")
        .select("points_reward")
        .eq("id", card_id)
        .single();

      if (card) {
        pointsAwarded = card.points_reward;
      }
    }

    if (pointsAwarded > 0) {
      // Update user's points
      const { data: profile } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", user.id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ points: profile.points + pointsAwarded })
          .eq("id", user.id);
      }
    }

    return NextResponse.json({
      success: true,
      liked: type === "like",
      pointsAwarded,
    });
  } catch (error) {
    console.error("Interactions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user's liked cards
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

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "like";
    const limit = parseInt(searchParams.get("limit") || "50");

    const { data: interactions, error } = await supabase
      .from("card_interactions")
      .select(
        `
        *,
        card:cards(*)
      `
      )
      .eq("user_id", user.id)
      .eq("interaction_type", type)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching interactions:", error);
      return NextResponse.json(
        { error: "Failed to fetch interactions" },
        { status: 500 }
      );
    }

    const cards = interactions
      ?.map((i) => i.card)
      .filter((c) => c !== null);

    console.log(`[Interactions API] GET request - returning ${cards?.length || 0} ${type} interactions for user ${user.id}`);

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Interactions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
