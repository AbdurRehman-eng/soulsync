import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateDailySeed } from "@/lib/utils";
import type { Card, CardType } from "@/types";

// ============================================
// Feed System Constants
// ============================================

// Card types that are ONLY injected as bonus cards (never in regular slots)
const BONUS_TYPES: CardType[] = ["marketing", "upgrade", "journal_prompt"];

// Cooldown periods in days per card type
const COOLDOWN_DAYS: Record<string, number> = {
  game: 7,
  quiz: 7,
  riddle: 7,
  joke: 7,
  article: 365, // Never repeats for same user
  inspiration: 14,
  motivational: 14,
  thought_provoking: 14,
  visual: 10,
  meme: 10,
  fact: 10,
  journal_prompt: 30,
};

// Map feed pattern slot names to actual card types
const SLOT_TYPE_MAP: Record<string, CardType[]> = {
  game: ["game"],
  inspiration: ["inspiration", "motivational"], // Fallback to motivational if no inspiration cards
  article: ["article"],
  riddle: ["riddle"],
  motivation: ["motivational", "inspiration"], // Fallback to inspiration if no motivational cards
  visual: ["visual"],
  joke: ["joke"],
  milestone: ["milestone"],
  thought_provoking: ["thought_provoking"],
  fact: ["fact"],
  meme: ["meme"],
};

// Default Pattern A if database patterns aren't available
const DEFAULT_PATTERN_SLOTS = [
  "game", "inspiration", "article", "riddle", "motivation",
  "visual", "joke", "milestone", "inspiration", "thought_provoking",
  "fact", "meme", "game", "riddle", "motivation",
];

// ============================================
// Helper: Get UK midnight date string (UTC+0 for simplicity)
// ============================================
function getUKToday(): string {
  // Use UK timezone for daily reset
  const ukDate = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
  return ukDate; // Returns YYYY-MM-DD
}

// ============================================
// Helper: Pick a card by type, respecting cooldowns
// ============================================
function pickCardByType(
  cardsByType: Map<string, Card[]>,
  slotTypes: CardType[],
  usedCardIds: Set<string>,
  seenCardIds: Set<string>,
  seed: number,
  slotIndex: number
): Card | null {
  for (const cardType of slotTypes) {
    const available = cardsByType.get(cardType) || [];
    // Prefer unseen cards, then fall back to seen but not-yet-used-today
    const unseen = available.filter((c) => !usedCardIds.has(c.id) && !seenCardIds.has(c.id));
    const notUsedToday = available.filter((c) => !usedCardIds.has(c.id));

    const pool = unseen.length > 0 ? unseen : notUsedToday;
    if (pool.length > 0) {
      // Use seeded random to pick consistently for the day
      const idx = (seed + slotIndex * 7919) % pool.length; // 7919 is a prime for variation
      const card = pool[Math.abs(idx) % pool.length];
      usedCardIds.add(card.id);
      return card;
    }
  }
  return null;
}

// ============================================
// Main Feed Endpoint
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const moodId = request.nextUrl.searchParams.get("mood_id");
    const today = getUKToday();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    let membershipLevel = 1;

    if (user) {
      // Get profile and check cache in parallel
      const [profileResult, cachedFeedResult] = await Promise.all([
        supabase.from("profiles").select("membership_level").eq("id", user.id).single(),
        supabase
          .from("daily_feed")
          .select("*, card:cards(*)")
          .eq("user_id", user.id)
          .eq("feed_date", today)
          .order("position", { ascending: true }),
      ]);

      if (profileResult.data) {
        membershipLevel = profileResult.data.membership_level;
      }

      // Return cached feed if available
      if (cachedFeedResult.data && cachedFeedResult.data.length > 0) {
        const cards = cachedFeedResult.data
          .map((item) => item.card)
          .filter((card): card is Card => card !== null);

        // Log mood asynchronously
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

      // Log mood asynchronously
      if (moodId) {
        Promise.all([
          supabase.from("mood_logs").insert({ user_id: user.id, mood_id: moodId }),
          supabase.from("profiles").update({ last_mood_sync: new Date().toISOString() }).eq("id", user.id),
        ]).catch(() => {});
      }
    }

    // ============================================
    // Build the universal 20-card feed
    // ============================================

    // Fetch all data in parallel
    const [
      allCardsResult,
      patternsResult,
      dailyQuizResult,
      pauseCardResult,
      pinnedCardsResult,
      journalCheckResult,
      seenContentResult,
      upgradeResult,
    ] = await Promise.all([
      // All active cards
      supabase
        .from("cards")
        .select("*")
        .eq("is_active", true)
        .lte("min_membership_level", membershipLevel)
        .or(`publish_date.is.null,publish_date.lte.${today}`),
      // Feed patterns
      supabase
        .from("feed_patterns")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      // Daily quiz: check for scheduled quiz first, then candidates
      supabase
        .from("daily_quiz_candidates")
        .select("*, card:cards(*)")
        .eq("is_candidate", true)
        .or(`scheduled_date.is.null,scheduled_date.eq.${today}`)
        .order("scheduled_date", { ascending: false, nullsFirst: false })
        .limit(10),
      // Pause card: check for date-specific first, then default
      supabase
        .from("pause_cards")
        .select("*, card:cards(*)")
        .order("is_default", { ascending: false }),
      // Pinned cards (marketing, featured, etc.)
      supabase
        .from("cards")
        .select("*")
        .eq("is_active", true)
        .eq("is_pinned", true)
        .lte("min_membership_level", membershipLevel)
        .or(`pin_start.is.null,pin_start.lte.${today}`)
        .or(`pin_end.is.null,pin_end.gte.${today}`)
        .order("pin_position", { ascending: true }),
      // Journal check
      user
        ? supabase
            .from("journal_entries")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", `${today}T00:00:00`)
        : Promise.resolve({ count: 1 }),
      // User's seen content for cooldown
      user
        ? supabase
            .from("user_seen_content")
            .select("card_id, card_type, seen_at")
            .eq("user_id", user.id)
        : Promise.resolve({ data: [] as any[] }),
      // Upgrade card for free users
      membershipLevel === 1
        ? supabase.from("cards").select("*").eq("is_active", true).eq("type", "upgrade").limit(1)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const allCards = allCardsResult.data || [];
    const patterns = patternsResult.data || [];
    const dailyQuizCandidates = dailyQuizResult.data || [];
    const pauseCards = pauseCardResult.data || [];
    const pinnedCards = pinnedCardsResult.data || [];
    const journalCount = journalCheckResult.count;
    const seenContent = seenContentResult.data || [];
    const upgradeCards = upgradeResult.data || [];

    if (allCards.length === 0) {
      return NextResponse.json({ cards: [] });
    }

    // ============================================
    // Build seen content map for cooldowns
    // ============================================
    const seenMap = new Map<string, Date>();
    for (const sc of seenContent) {
      seenMap.set(sc.card_id, new Date(sc.seen_at));
    }

    // Build set of cards still in cooldown
    const now = new Date();
    const cooledDownCardIds = new Set<string>();
    seenMap.forEach((seenAt, cardId) => {
      const card = allCards.find((c) => c.id === cardId);
      if (!card) return;
      const cooldownDays = COOLDOWN_DAYS[card.type] || 7;
      const cooldownEnd = new Date(seenAt);
      cooldownEnd.setDate(cooldownEnd.getDate() + cooldownDays);
      if (now < cooldownEnd) {
        cooledDownCardIds.add(cardId);
      }
    });

    // ============================================
    // Organize cards by type
    // ============================================
    const cardsByType = new Map<string, Card[]>();
    for (const card of allCards) {
      if (BONUS_TYPES.includes(card.type)) continue; // Skip bonus types from regular pool
      if (card.type === "pause") continue; // Pause cards handled separately

      const existing = cardsByType.get(card.type) || [];
      existing.push(card);
      cardsByType.set(card.type, existing);
    }

    const seed = generateDailySeed(user?.id || "universal");
    const usedCardIds = new Set<string>();

    // ============================================
    // SLOT 1: Verse of the Day
    // ============================================
    const verseOfDay = pickCardByType(
      cardsByType, ["verse"], usedCardIds, cooledDownCardIds, seed, 1
    );

    // ============================================
    // SLOT 2: Devotional of the Day (note + devotional)
    // ============================================
    const devotionalOfDay = pickCardByType(
      cardsByType, ["devotional"], usedCardIds, cooledDownCardIds, seed, 2
    );

    // ============================================
    // SLOT 3: Prayer of the Day
    // ============================================
    const prayerOfDay = pickCardByType(
      cardsByType, ["prayer"], usedCardIds, cooledDownCardIds, seed, 3
    );

    // ============================================
    // SLOT 4: Quiz of the Day (from separate pool)
    // ============================================
    let quizOfDay: Card | null = null;
    // First: check for a quiz scheduled specifically for today
    const scheduledQuiz = dailyQuizCandidates.find(
      (dq) => dq.scheduled_date === today && dq.card
    );
    if (scheduledQuiz?.card) {
      quizOfDay = scheduledQuiz.card;
    } else {
      // Fallback: pick from candidate pool using daily seed
      const candidateQuizzes = dailyQuizCandidates
        .filter((dq) => !dq.scheduled_date && dq.card)
        .map((dq) => dq.card)
        .filter((c): c is Card => c !== null);
      if (candidateQuizzes.length > 0) {
        const idx = Math.abs(seed) % candidateQuizzes.length;
        quizOfDay = candidateQuizzes[idx];
      } else {
        // Final fallback: pick any quiz from regular cards
        quizOfDay = pickCardByType(
          cardsByType, ["quiz"], usedCardIds, cooledDownCardIds, seed, 4
        );
      }
    }
    if (quizOfDay) usedCardIds.add(quizOfDay.id);

    // ============================================
    // SLOTS 5-19: Pattern-based dynamic content
    // ============================================

    // Select pattern based on day rotation
    const dayOfYear = Math.floor(
      (new Date(today).getTime() - new Date(new Date(today).getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
    );
    const activePatterns = patterns.length > 0 ? patterns : null;
    let patternSlots: string[];

    if (activePatterns && activePatterns.length > 0) {
      const patternIndex = dayOfYear % activePatterns.length;
      const selectedPattern = activePatterns[patternIndex];
      patternSlots = Array.isArray(selectedPattern.slots)
        ? selectedPattern.slots
        : JSON.parse(selectedPattern.slots as string);
    } else {
      patternSlots = DEFAULT_PATTERN_SLOTS;
    }

    // Build slots 5-19 (15 slots)
    const dynamicCards: (Card | null)[] = [];
    for (let i = 0; i < 15; i++) {
      const slotName = patternSlots[i] || "motivational";
      const slotTypes = SLOT_TYPE_MAP[slotName] || ["motivational"];

      // Slot 8 in pattern (position 12 in feed) is milestone placement
      if (slotName === "milestone") {
        // Check if user hit a milestone — if so, show milestone card
        const milestoneCard = pickCardByType(
          cardsByType, ["milestone"], usedCardIds, cooledDownCardIds, seed, i + 5
        );
        if (milestoneCard) {
          dynamicCards.push(milestoneCard);
          continue;
        }
        // No milestone card available, fill with motivational
        const fallback = pickCardByType(
          cardsByType, ["motivational", "inspiration"], usedCardIds, cooledDownCardIds, seed, i + 5
        );
        dynamicCards.push(fallback);
        continue;
      }

      const card = pickCardByType(
        cardsByType, slotTypes, usedCardIds, cooledDownCardIds, seed, i + 5
      );
      dynamicCards.push(card);
    }

    // ============================================
    // SLOT 20: Pause Card (always last)
    // ============================================
    let pauseCard: Card | null = null;
    // Check for date-specific pause card first
    const datePauseCard = pauseCards.find((pc) => {
      if (!pc.card) return false;
      const start = pc.active_start;
      const end = pc.active_end;
      if (start && today < start) return false;
      if (end && today > end) return false;
      return !pc.is_default;
    });

    if (datePauseCard?.card) {
      pauseCard = datePauseCard.card;
    } else {
      // Fallback to default pause card
      const defaultPause = pauseCards.find((pc) => pc.is_default && pc.card);
      if (defaultPause?.card) {
        pauseCard = defaultPause.card;
      } else {
        // Synthesize a pause card if none exist in DB
        pauseCard = pickCardByType(
          cardsByType, ["pause" as CardType], usedCardIds, cooledDownCardIds, seed, 20
        );
      }
    }

    // ============================================
    // Assemble the 20-card feed
    // ============================================
    const feedCards: Card[] = [];

    // Slots 1-4 (fixed)
    if (verseOfDay) feedCards.push(verseOfDay);
    if (devotionalOfDay) feedCards.push(devotionalOfDay);
    if (prayerOfDay) feedCards.push(prayerOfDay);
    if (quizOfDay) feedCards.push(quizOfDay);

    // Slots 5-19 (dynamic, filter nulls)
    for (const card of dynamicCards) {
      if (card) feedCards.push(card);
    }

    // Slot 20: Pause card (always last in the main feed)
    if (pauseCard) feedCards.push(pauseCard);

    // Limit to 20 cards total
    const mainFeed = feedCards.slice(0, 20);

    // ============================================
    // Bonus Cards (after slot 20)
    // ============================================
    const bonusCards: Card[] = [];

    // Marketing cards (if admin pinned, with date range)
    if (pinnedCards.length > 0) {
      for (const pc of pinnedCards) {
        if (pc.type === "marketing" && !mainFeed.some((c) => c.id === pc.id)) {
          // If pinned with a specific position, inject into main feed
          if (pc.pin_position && pc.pin_position <= 20) {
            const pos = Math.min(pc.pin_position - 1, mainFeed.length);
            mainFeed.splice(pos, 0, pc);
          } else {
            bonusCards.push(pc);
          }
        }
        // Featured/trending pinned cards inject into feed at their position
        if (!BONUS_TYPES.includes(pc.type) && pc.type !== "marketing") {
          if (pc.pin_position && pc.pin_position <= 20 && !mainFeed.some((c) => c.id === pc.id)) {
            const pos = Math.min(pc.pin_position - 1, mainFeed.length);
            mainFeed.splice(pos, 0, pc);
          }
        }
      }
    }

    // Upgrade card for free users (inject into feed)
    if (upgradeCards.length > 0 && membershipLevel === 1) {
      const uc = upgradeCards[0];
      if (!mainFeed.some((c) => c.id === uc.id)) {
        // Insert around position 8
        const pos = Math.min(7, mainFeed.length);
        mainFeed.splice(pos, 0, uc);
      }
    }

    // Journal prompt if user hasn't journaled today
    if (user && (!journalCount || journalCount === 0)) {
      const journalCards = allCards.filter(
        (c) => (c.type === "journal_prompt" || c.type === "journal") && !mainFeed.some((mc) => mc.id === c.id)
      );
      if (journalCards.length > 0) {
        const jp = journalCards[Math.abs(seed) % journalCards.length];
        // Insert around position 5
        const pos = Math.min(4, mainFeed.length);
        mainFeed.splice(pos, 0, jp);
      }
    }

    // Combine main feed + bonus cards
    const finalCards = [...mainFeed, ...bonusCards];

    // Deduplicate
    const seen = new Set<string>();
    const deduped = finalCards.filter((card) => {
      if (seen.has(card.id)) return false;
      seen.add(card.id);
      return true;
    });

    // ============================================
    // Track seen content + cache feed (async, non-blocking)
    // ============================================
    if (user && deduped.length > 0) {
      // Cache the feed
      const feedItems = deduped.map((card, index) => ({
        user_id: user.id,
        card_id: card.id,
        position: index + 1,
        feed_date: today,
      }));

      Promise.resolve(
        supabase.from("daily_feed").delete().eq("user_id", user.id).eq("feed_date", today)
      )
        .then(() => supabase.from("daily_feed").insert(feedItems))
        .catch(() => {});

      // Track seen content for cooldown (upsert to avoid duplicates)
      const seenItems = deduped.map((card) => ({
        user_id: user.id,
        card_id: card.id,
        card_type: card.type,
        seen_at: new Date().toISOString(),
      }));

      Promise.resolve(
        supabase
          .from("user_seen_content")
          .upsert(seenItems, { onConflict: "user_id,card_id" })
      ).catch(() => {});
    }

    return NextResponse.json({ cards: deduped }, {
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
