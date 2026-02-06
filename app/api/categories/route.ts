import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/categories - Returns all categories with card counts, plus featured/trending cards
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Fetch all active categories
    const { data: categories, error: catError } = await supabase
      .from("content_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (catError) {
      console.error("Error fetching categories:", catError);
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    // Get card counts per category using card_categories junction table
    const categoriesWithCounts = await Promise.all(
      (categories || []).map(async (cat) => {
        const { count } = await supabase
          .from("card_categories")
          .select("*", { count: "exact", head: true })
          .eq("category_id", cat.id);

        // Also count cards that match the category by type mapping
        const typeMap: Record<string, string[]> = {
          "arena": ["game"],
          "mind-quests": ["quiz"],
          "joy-moments": ["meme"],
          "share-cards": ["share_card"],
          "insights": ["article", "devotional"],
          "deep-dive": ["thought_provoking"],
          "calm-corner": ["visual"],
          "gems": ["fact"],
          "enigmas": ["riddle"],
          "light-hearts": ["joke"],
          "reflections": ["journal", "journal_prompt"],
          "boosts": ["prayer"],
        };

        const types = typeMap[cat.slug] || [];
        let typeCount = 0;
        if (types.length > 0) {
          const { count: tc } = await supabase
            .from("cards")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true)
            .in("type", types);
          typeCount = tc || 0;
        }

        return {
          ...cat,
          card_count: (count || 0) + typeCount,
        };
      })
    );

    // Fetch featured cards (within date range)
    const today = new Date().toISOString().split("T")[0];
    const { data: featuredCards } = await supabase
      .from("cards")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .or(`featured_start.is.null,featured_start.lte.${today}`)
      .or(`featured_end.is.null,featured_end.gte.${today}`)
      .order("created_at", { ascending: false })
      .limit(10);

    // Fetch trending cards
    const { data: trendingCards } = await supabase
      .from("cards")
      .select("*")
      .eq("is_active", true)
      .eq("is_trending", true)
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      categories: categoriesWithCounts,
      featured: featuredCards || [],
      trending: trendingCards || [],
    });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, display_name, emoji, description, color, gradient_from, gradient_to, icon_name, sort_order } = body;

    if (!name || !slug || !display_name) {
      return NextResponse.json(
        { error: "name, slug, and display_name are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("content_categories")
      .insert({
        name,
        slug,
        display_name,
        emoji: emoji || "📁",
        description,
        color: color || "#6366f1",
        gradient_from: gradient_from || "#6366f1",
        gradient_to: gradient_to || "#8b5cf6",
        icon_name,
        sort_order: sort_order || 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ category: data });
  } catch (error) {
    console.error("Categories POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
