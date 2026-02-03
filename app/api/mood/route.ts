import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Log mood selection
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

    const { mood_id } = await request.json();

    if (!mood_id) {
      return NextResponse.json(
        { error: "mood_id is required" },
        { status: 400 }
      );
    }

    // Log the mood
    const { error: logError } = await supabase.from("mood_logs").insert({
      user_id: user.id,
      mood_id,
    });

    if (logError) {
      console.error("Error logging mood:", logError);
      return NextResponse.json(
        { error: "Failed to log mood" },
        { status: 500 }
      );
    }

    // Update user's last mood sync time
    await supabase
      .from("profiles")
      .update({ last_mood_sync: new Date().toISOString() })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mood API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get available moods
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: moods, error } = await supabase
      .from("moods")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching moods:", error);
      return NextResponse.json(
        { error: "Failed to fetch moods" },
        { status: 500 }
      );
    }

    return NextResponse.json({ moods });
  } catch (error) {
    console.error("Mood API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
