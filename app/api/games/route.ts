import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/games?type=html|ar|all&ar_only=true&card_id=xxx
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const cardId = request.nextUrl.searchParams.get("card_id");
    const type = request.nextUrl.searchParams.get("type") || "all";
    const arOnly = request.nextUrl.searchParams.get("ar_only") === "true";

    // Single game lookup by card_id
    if (cardId) {
      console.log("[API /games] Lookup by card_id", cardId);

      const { data: gameData, error } = await supabase
        .from("games")
        .select("*")
        .eq("card_id", cardId)
        .single();

      if (error || !gameData) {
        console.error("[API /games] Game not found for card_id", {
          cardId,
          error,
        });
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
      }

      console.log("[API /games] Found game for card_id", {
        cardId,
        gameId: gameData.id,
      });
      return NextResponse.json({ game: gameData });
    }

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
      console.error("[API /games] Failed to fetch game cards", error);
      return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
    }

    if (!gameCards || gameCards.length === 0) {
      console.log("[API /games] No game cards found");
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
      .map((card) => {
        const game = gamesByCardId.get(card.id) || null;
        if (!game) return null;

        return {
          ...card,
          game: {
            id: game.id,
            card_id: game.card_id,
            html_content: game.html_content,
            difficulty: game.difficulty,
            instructions: game.instructions,
            max_score: game.max_score,
            is_ar_game: game.is_ar_game,
            ar_type: game.ar_type,
            ar_config: game.ar_config,
            created_at: game.created_at,
          },
          // Keep flat game fields for backward compatibility (ar-games page uses these directly)
          html_content: game.html_content,
          difficulty: game.difficulty,
          instructions: game.instructions,
          max_score: game.max_score,
          is_ar_game: game.is_ar_game,
          ar_type: game.ar_type,
          ar_config: game.ar_config,
        };
      })
      .filter((item): item is NonNullable<typeof item> => {
        if (!item) return false;
        const isAR = item.is_ar_game && item.ar_type && item.ar_config;

        // If ar_only is true, only return AR games
        if (arOnly) return !!isAR;

        // Otherwise, filter by type
        if (type === "html") return !isAR;
        if (type === "ar") return !!isAR;
        return true; // "all"
      });

    console.log("[API /games] Returning games list", {
      totalGameCards: gameCards.length,
      totalGames: games.length,
      type,
      arOnly,
    });

    return NextResponse.json({ games });
  } catch (error) {
    console.error("Games API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
