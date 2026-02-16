import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/games?type=html|ar|all
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const type = request.nextUrl.searchParams.get("type") || "all";

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

    const today = new Date().toISOString().split("T")[0];

    // Fetch game cards
    let query = supabase
      .from("cards")
      .select("*")
      .eq("is_active", true)
      .eq("type", "game")
      .lte("min_membership_level", membershipLevel)
      .or(`publish_date.is.null,publish_date.lte.${today}`)
      .order("created_at", { ascending: false });

    const { data: gameCards, error } = await query;

    if (error) {
      console.error("Games API error:", error);
      return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
    }

    if (!gameCards || gameCards.length === 0) {
      return NextResponse.json({ games: [] });
    }

    // Fetch game metadata for all cards
    const cardIds = gameCards.map((c) => c.id);
    const { data: gamesData } = await supabase
      .from("games")
      .select("*")
      .in("card_id", cardIds);

    const gamesByCardId = new Map((gamesData || []).map((g) => [g.card_id, g]));

    // Filter by type and attach game metadata
    const games = gameCards
      .map((card) => ({
        ...card,
        game: gamesByCardId.get(card.id) || null,
      }))
      .filter((card) => {
        if (!card.game) return false;
        const isAR = card.game.is_ar_game && card.game.ar_type && card.game.ar_config;
        if (type === "html") return !isAR;
        if (type === "ar") return !!isAR;
        return true; // "all"
      });

    return NextResponse.json({ games });
  } catch (error) {
    console.error("Games API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
