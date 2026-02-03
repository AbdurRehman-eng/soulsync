import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Clear feed cache for the current user
 * Useful during development when you add new cards
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split("T")[0];

    // Delete today's cached feed for this user
    const { error } = await supabase
      .from("daily_feed")
      .delete()
      .eq("user_id", user.id)
      .eq("feed_date", today);

    if (error) {
      console.error("Error clearing cache:", error);
      return NextResponse.json(
        { error: "Failed to clear cache" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feed cache cleared successfully",
    });
  } catch (error) {
    console.error("Cache clear error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Admin endpoint to clear all users' cache
 * Only accessible by admins
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const today = new Date().toISOString().split("T")[0];

    // Delete all cached feeds for today
    const { error } = await supabase
      .from("daily_feed")
      .delete()
      .eq("feed_date", today);

    if (error) {
      console.error("Error clearing all caches:", error);
      return NextResponse.json(
        { error: "Failed to clear cache" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "All feed caches cleared successfully",
    });
  } catch (error) {
    console.error("Cache clear error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
