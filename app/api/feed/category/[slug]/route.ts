import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Mapping from category slug to card types
const CATEGORY_TYPE_MAP: Record<string, string[]> = {
  "arena": ["game"],
  "mind-quests": ["quiz"],
  "joy-moments": ["meme"],
  "share-cards": ["share_card"],
  "insights": ["article", "devotional"],
  "deep-dive": ["thought_provoking", "motivational"],
  "calm-corner": ["visual"],
  "gems": ["fact"],
  "enigmas": ["riddle"],
  "light-hearts": ["joke"],
  "reflections": ["journal", "journal_prompt"],
  "boosts": ["prayer"],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const { slug } = await params;

    // Get current user membership level
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let membershipLevel = 1;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_level")
        .eq("id", user.id)
        .single();
      if (profile) membershipLevel = profile.membership_level;
    }

    // Look up the category
    const { data: category, error: catError } = await supabase
      .from("content_categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (catError || !category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    // Get cards that are explicitly linked to this category via card_categories
    const { data: linkedCardIds } = await supabase
      .from("card_categories")
      .select("card_id")
      .eq("category_id", category.id);

    const linkedIds = (linkedCardIds || []).map((lc) => lc.card_id);

    // Get cards by type mapping
    const types = CATEGORY_TYPE_MAP[slug] || [];

    let cards: any[] = [];

    // Fetch by type
    if (types.length > 0) {
      const { data: typeCards } = await supabase
        .from("cards")
        .select("*")
        .eq("is_active", true)
        .in("type", types)
        .lte("min_membership_level", membershipLevel)
        .or(`publish_date.is.null,publish_date.lte.${today}`)
        .order("created_at", { ascending: false })
        .limit(50);

      cards = typeCards || [];
    }

    // Fetch explicitly linked cards
    if (linkedIds.length > 0) {
      const { data: linkedCards } = await supabase
        .from("cards")
        .select("*")
        .eq("is_active", true)
        .in("id", linkedIds)
        .lte("min_membership_level", membershipLevel)
        .or(`publish_date.is.null,publish_date.lte.${today}`)
        .order("created_at", { ascending: false });

      if (linkedCards) {
        // Merge without duplicates
        const existingIds = new Set(cards.map((c) => c.id));
        for (const lc of linkedCards) {
          if (!existingIds.has(lc.id)) {
            cards.push(lc);
          }
        }
      }
    }

    return NextResponse.json({
      category,
      cards,
    });
  } catch (error) {
    console.error("Category feed API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
