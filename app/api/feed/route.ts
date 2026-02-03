import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateDailySeed, shuffleWithSeed } from "@/lib/utils";
import type { Card } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user (optional - feed works for anonymous users too)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get user's current mood from query or profile
    const searchParams = request.nextUrl.searchParams;
    let moodId = searchParams.get("mood_id");

    // Get user's membership level and last mood
    let membershipLevel = 1;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_level")
        .eq("id", user.id)
        .single();

      if (profile) {
        membershipLevel = profile.membership_level;
      }

      // If mood is provided, log it to mood_logs
      if (moodId) {
        await supabase.from("mood_logs").insert({
          user_id: user.id,
          mood_id: moodId,
        });

        // Update profile's last_mood_sync
        await supabase
          .from("profiles")
          .update({ last_mood_sync: new Date().toISOString() })
          .eq("id", user.id);
      }
    }

    // Check if we have a cached daily feed for this user
    // NOTE: Cache is currently global per day, not mood-specific
    // This means if user changes mood, cache is cleared and regenerated
    const today = new Date().toISOString().split("T")[0];

    if (user && moodId) {
      // Check for mood-specific cache
      const { data: cachedFeed } = await supabase
        .from("daily_feed")
        .select("*, card:cards(*)")
        .eq("user_id", user.id)
        .eq("feed_date", today)
        .order("position", { ascending: true });

      if (cachedFeed && cachedFeed.length > 0) {
        console.log(`[FEED API] Returning ${cachedFeed.length} cached cards from daily_feed table`);
        const cards = cachedFeed
          .map((item) => item.card)
          .filter((card): card is Card => card !== null);

        return NextResponse.json({ cards });
      } else {
        console.log("[FEED API] No cached feed found, generating new feed");
      }
    }

    // Build query for cards
    let query = supabase
      .from("cards")
      .select(
        `
        *,
        card_moods!left(mood_id, weight)
      `
      )
      .eq("is_active", true)
      .lte("min_membership_level", membershipLevel)
      .or(`publish_date.is.null,publish_date.lte.${today}`);

    // Get pinned cards first
    const { data: pinnedCards } = await supabase
      .from("cards")
      .select("*")
      .eq("is_active", true)
      .eq("is_pinned", true)
      .lte("min_membership_level", membershipLevel)
      .lte("pin_start", today)
      .gte("pin_end", today)
      .order("pin_position", { ascending: true });

    // Get all eligible cards
    const { data: allCards, error } = await query;

    if (error) {
      console.error("Error fetching cards:", error);
      return NextResponse.json(
        { error: "Failed to fetch feed" },
        { status: 500 }
      );
    }

    console.log(`[FEED API] Fetched ${allCards?.length || 0} cards from database`);

    // Filter and sort cards
    let feedCards = allCards || [];

    if (feedCards.length === 0) {
      console.log("[FEED API] No active cards found in database");
      return NextResponse.json({ cards: [] });
    }

    // If mood is specified, prioritize mood-relevant cards
    if (moodId) {
      feedCards = feedCards.sort((a, b) => {
        const aMoodWeight =
          a.card_moods?.find((cm: { mood_id: string }) => cm.mood_id === moodId)?.weight || 0;
        const bMoodWeight =
          b.card_moods?.find((cm: { mood_id: string }) => cm.mood_id === moodId)?.weight || 0;
        return bMoodWeight - aMoodWeight;
      });
    }

    // Generate daily seed for consistent randomness
    const seed = generateDailySeed(user?.id || "anonymous");

    // Shuffle with seed (excluding top mood-relevant cards)
    const topMoodCards = moodId ? feedCards.slice(0, 5) : [];
    const remainingCards = moodId ? feedCards.slice(5) : feedCards;
    const shuffledRemaining = shuffleWithSeed(remainingCards, seed);

    // Combine cards
    let finalCards = [...topMoodCards, ...shuffledRemaining];

    // Insert pinned cards at their positions
    if (pinnedCards) {
      for (const pinned of pinnedCards) {
        if (pinned.pin_position && pinned.pin_position <= 20) {
          finalCards.splice(pinned.pin_position - 1, 0, pinned);
        }
      }
    }

    // Limit to 20 cards
    finalCards = finalCards.slice(0, 20);

    console.log(`[FEED API] Returning ${finalCards.length} cards to client (after mood sorting and shuffling)`);

    // Cache the feed for logged-in users (only if mood is selected)
    // This prevents caching general feeds and ensures mood-specific caching
    if (user && moodId && finalCards.length > 0) {
      console.log(`[FEED API] Caching ${finalCards.length} cards to daily_feed table`);

      // Clear existing cache for today
      await supabase
        .from("daily_feed")
        .delete()
        .eq("user_id", user.id)
        .eq("feed_date", today);

      const feedItems = finalCards.map((card, index) => ({
        user_id: user.id,
        card_id: card.id,
        position: index + 1,
        feed_date: today,
      }));

      await supabase.from("daily_feed").insert(feedItems);
    }

    // Clean up card_moods from response
    const cleanedCards = finalCards.map(({ card_moods, ...card }) => card);

    return NextResponse.json({ cards: cleanedCards });
  } catch (error) {
    console.error("Feed API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
