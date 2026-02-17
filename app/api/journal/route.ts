import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/journal — fetch user's journal entries
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "30");
    const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");

    const { data: entries, error, count } = await supabase
      .from("journal_entries")
      .select("*, mood:moods(name, emoji, color), prompt_card:cards(title, content)", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ entries: entries || [], total: count || 0 });
  } catch (error) {
    console.error("Journal GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/journal — save a new journal entry
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, prompt_card_id, mood_id } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const { data: entry, error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: user.id,
        content: content.trim(),
        prompt_card_id: prompt_card_id || null,
        mood_id: mood_id || null,
        is_private: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("Journal POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
