import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateDailySeed, shuffleWithSeed } from "@/lib/utils";
import type { Card } from "@/types";

// Card types that should NOT appear in the main feed unless pinned
const SPECIAL_TYPES = ["marketing", "milestone", "upgrade"];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const moodId = request.nextUrl.searchParams.get("mood_id");
    const today = new Date().toISOString().split("T")[0];

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    let membershipLevel = 1;

    if (user) {
      // Get profile and check cache in parallel
      const [profileResult, cachedFeedResult] = await Promise.all([
        supabase.from("profiles").select("membership_level").eq("id", user.id).single(),
        moodId
          ? supabase
              .from("daily_feed")
              .select("*, card:cards(*)")
              .eq("user_id", user.id)
              .eq("feed_date", today)
              .order("position", { ascending: true })
          : Promise.resolve({ data: null }),
      ]);

      if (profileResult.data) {
        membershipLevel = profileResult.data.membership_level;
      }

      // Return cached feed immediately if available
      if (cachedFeedResult.data && cachedFeedResult.data.length > 0) {
        const cards = cachedFeedResult.data
          .map((item) => item.card)
          .filter((card): card is Card => card !== null);

        // Log mood asynchronously without blocking response
        if (moodId) {
          Promise.all([
            supabase.from("mood_logs").insert({ user_id: user.id, mood_id: moodId }),
            supabase.from("profiles").update({ last_mood_sync: new Date().toISOString() }).eq("id", user.id),
          ]).catch(() => {});
        }

        return NextResponse.json({ cards }, {
          headers: { "Cache-Control": "private, max-age=300, stale-while-revalidate=60" },
        });
      }

      // Log mood asynchronously without blocking card fetching
      if (moodId) {
        Promise.all([
          supabase.from("mood_logs").insert({ user_id: user.id, mood_id: moodId }),
          supabase.from("profiles").update({ last_mood_sync: new Date().toISOString() }).eq("id", user.id),
        ]).catch(() => {});
      }
    }

    // Fetch all card queries in parallel
    const [
      allCardsResult,
      pinnedCardsResult,
      featuredResult,
      trendingResult,
      upgradeResult,
      journalCheckResult,
    ] = await Promise.all([
      supabase
        .from("cards")
        .select(`*, card_moods!left(mood_id, weight)`)
        .eq("is_active", true)
        .lte("min_membership_level", membershipLevel)
        .or(`publish_date.is.null,publish_date.lte.${today}`),
      supabase
        .from("cards")
        .select("*")
        .eq("is_active", true)
        .eq("is_pinned", true)
        .lte("min_membership_level", membershipLevel)
        .or(`pin_start.is.null,pin_start.lte.${today}`)
        .or(`pin_end.is.null,pin_end.gte.${today}`)
        .order("pin_position", { ascending: true }),
      supabase
        .from("cards")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .lte("min_membership_level", membershipLevel)
        .or(`featured_start.is.null,featured_start.lte.${today}`)
        .or(`featured_end.is.null,featured_end.gte.${today}`)
        .limit(3),
      supabase
        .from("cards")
        .select("*")
        .eq("is_active", true)
        .eq("is_trending", true)
        .lte("min_membership_level", membershipLevel)
        .limit(3),
      membershipLevel === 1
        ? supabase.from("cards").select("*").eq("is_active", true).eq("type", "upgrade").eq("is_pinned", true).limit(1)
        : Promise.resolve({ data: [] as any[] }),
      user
        ? supabase
            .from("journal_entries")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", `${today}T00:00:00`)
        : Promise.resolve({ count: 1 }),
    ]);

    const { data: allCards, error } = allCardsResult;
    const pinnedCards = pinnedCardsResult.data;
    const featuredInFeed = featuredResult.data;
    const trendingInFeed = trendingResult.data;
    const upgradeCards = upgradeResult.data || [];
    const journalCount = journalCheckResult.count;

    // Fetch journal prompt only if user hasn't journaled today
    let journalPromptCards: any[] = [];
    if (user && (!journalCount || journalCount === 0)) {
      const { data: jpc } = await supabase
        .from("cards")
        .select("*")
        .eq("is_active", true)
        .in("type", ["journal_prompt", "journal"])
        .limit(1);
      journalPromptCards = jpc || [];
    }

    if (error) {
      console.error("Error fetching cards:", error);
      return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
    }

    // Filter out special types from regular feed (they're injected separately)
    let feedCards = (allCards || []).filter(
      (card) => !SPECIAL_TYPES.includes(card.type)
    );

    if (feedCards.length === 0 && !pinnedCards?.length && !featuredInFeed?.length) {
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

    // Insert pinned cards at their positions (includes marketing cards with dates)
    if (pinnedCards) {
      for (const pinned of pinnedCards) {
        const pos = pinned.pin_position;
        if (pos && pos <= 30) {
          finalCards.splice(Math.min(pos - 1, finalCards.length), 0, pinned);
        } else {
          // No position specified, append
          finalCards.push(pinned);
        }
      }
    }

    // Insert featured cards near the top (positions 2-4)
    if (featuredInFeed) {
      const existingIds = new Set(finalCards.map((c) => c.id));
      let insertAt = 1;
      for (const fc of featuredInFeed) {
        if (!existingIds.has(fc.id)) {
          finalCards.splice(Math.min(insertAt, finalCards.length), 0, fc);
          insertAt += 3; // Space them out
        }
      }
    }

    // Insert trending cards in middle of feed
    if (trendingInFeed) {
      const existingIds = new Set(finalCards.map((c) => c.id));
      let insertAt = Math.floor(finalCards.length / 2);
      for (const tc of trendingInFeed) {
        if (!existingIds.has(tc.id)) {
          finalCards.splice(Math.min(insertAt, finalCards.length), 0, tc);
          insertAt += 2;
        }
      }
    }

    // Insert upgrade card for free users (around position 8)
    if (upgradeCards.length > 0) {
      const existingIds = new Set(finalCards.map((c) => c.id));
      for (const uc of upgradeCards) {
        if (!existingIds.has(uc.id)) {
          finalCards.splice(Math.min(7, finalCards.length), 0, uc);
        }
      }
    }

    // Insert journal prompt if user hasn't journaled today (around position 5)
    if (journalPromptCards.length > 0) {
      const existingIds = new Set(finalCards.map((c) => c.id));
      for (const jp of journalPromptCards) {
        if (!existingIds.has(jp.id)) {
          finalCards.splice(Math.min(4, finalCards.length), 0, jp);
        }
      }
    }

    // Deduplicate (in case of overlaps between pinned/featured/regular)
    const seen = new Set<string>();
    finalCards = finalCards.filter((card) => {
      if (seen.has(card.id)) return false;
      seen.add(card.id);
      return true;
    });

    // Limit to 25 cards
    finalCards = finalCards.slice(0, 25);

    // Cache the feed for logged-in users asynchronously (don't block response)
    if (user && moodId && finalCards.length > 0) {
      const feedItems = finalCards.map((card, index) => ({
        user_id: user.id,
        card_id: card.id,
        position: index + 1,
        feed_date: today,
      }));

      supabase.from("daily_feed").delete().eq("user_id", user.id).eq("feed_date", today)
        .then(() => supabase.from("daily_feed").insert(feedItems))
        .catch(() => {});
    }

    // Clean up card_moods from response
    const cleanedCards = finalCards.map(({ card_moods, ...card }) => card);

    return NextResponse.json({ cards: cleanedCards }, {
      headers: { "Cache-Control": "private, max-age=300, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error("Feed API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
