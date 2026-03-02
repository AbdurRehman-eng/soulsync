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

    const catIds = (categories || []).map((c) => c.id);
    const allTypes = [...new Set(Object.values(typeMap).flat())];
    const today = new Date().toISOString().split("T")[0];

    // Batch: fetch junction counts, type counts, featured, and trending in parallel
    const [junctionResult, typeCountResult, featuredResult, trendingResult] = await Promise.all([
      catIds.length > 0
        ? supabase.from("card_categories").select("category_id").in("category_id", catIds)
        : Promise.resolve({ data: [] as any[] }),
      allTypes.length > 0
        ? supabase.from("cards").select("type").eq("is_active", true).in("type", allTypes)
        : Promise.resolve({ data: [] as any[] }),
      supabase
        .from("cards")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .or(`featured_start.is.null,featured_start.lte.${today}`)
        .or(`featured_end.is.null,featured_end.gte.${today}`)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("cards")
        .select("*")
        .eq("is_active", true)
        .eq("is_trending", true)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // Count junction rows per category
    const junctionCounts = new Map<string, number>();
    for (const row of (junctionResult.data || [])) {
      junctionCounts.set(row.category_id, (junctionCounts.get(row.category_id) || 0) + 1);
    }

    // Count cards per type
    const typeCounts = new Map<string, number>();
    for (const row of (typeCountResult.data || [])) {
      typeCounts.set(row.type, (typeCounts.get(row.type) || 0) + 1);
    }

    // Merge counts into categories
    const categoriesWithCounts = (categories || []).map((cat) => {
      const jCount = junctionCounts.get(cat.id) || 0;
      const types = typeMap[cat.slug] || [];
      const tCount = types.reduce((sum, t) => sum + (typeCounts.get(t) || 0), 0);
      return { ...cat, card_count: jCount + tCount };
    });

    return NextResponse.json({
      categories: categoriesWithCounts,
      featured: featuredResult.data || [],
      trending: trendingResult.data || [],
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
