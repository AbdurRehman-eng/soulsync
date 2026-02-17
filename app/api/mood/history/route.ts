import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch last 90 days of mood logs with mood details
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: logs, error } = await supabase
      .from("mood_logs")
      .select("mood_id, logged_at, mood:moods(name, emoji, color)")
      .eq("user_id", user.id)
      .gte("logged_at", ninetyDaysAgo.toISOString())
      .order("logged_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ logs: logs || [] });
  } catch (error) {
    console.error("Mood history error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
