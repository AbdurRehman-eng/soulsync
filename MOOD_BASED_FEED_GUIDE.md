# Mood-Based Feed System - Complete Guide

## How It Works Now ✅

Your feed system now properly supports **mood-based personalization**!

### Overview

1. **No Mood Selected** → General feed with 20 random cards
2. **Mood Selected** → Personalized feed with 20 cards prioritized for that mood

---

## System Architecture

### 1. Mood Selection Flow

```
User selects mood → Mood stored in moodStore → Feed refetches with mood_id → API returns personalized cards
```

**Components**:
- **MoodStore** ([stores/moodStore.ts](stores/moodStore.ts)) - Tracks current mood
- **CardFeed** ([components/feed/CardFeed.tsx](components/feed/CardFeed.tsx)) - Passes mood to API
- **Feed API** ([app/api/feed/route.ts](app/api/feed/route.ts)) - Returns mood-specific cards

---

## Changes Made

### ✅ 1. CardFeed Now Passes Mood to API

**Updated**: [components/feed/CardFeed.tsx](components/feed/CardFeed.tsx)

**Changes**:
- Imports `useMoodStore` to access current mood
- Passes `mood_id` query parameter to API when fetching
- Re-fetches feed when mood changes
- URL built dynamically: `/api/feed?mood_id=XXX`

**Code**:
```typescript
const { currentMood } = useMoodStore();

const fetchCards = async () => {
  const url = new URL('/api/feed', window.location.origin);
  if (currentMood?.id) {
    url.searchParams.set('mood_id', currentMood.id);
  }
  const response = await fetch(url.toString());
  // ...
};
```

---

### ✅ 2. API Logs Mood Selection

**Updated**: [app/api/feed/route.ts](app/api/feed/route.ts)

**Changes**:
- Logs mood to `mood_logs` table when provided
- Updates `profiles.last_mood_sync` timestamp
- Only caches feed when mood is selected (prevents stale general feeds)
- Clears old cache before creating new mood-specific cache

**Benefits**:
- Track user mood patterns over time
- Analytics on mood selection
- Better personalization data

---

## How Mood Affects Feed

### Algorithm

1. **Fetch all active cards** matching user's membership level
2. **If mood selected**:
   - Sort cards by `card_moods.weight` for that mood
   - Take **top 5** cards with highest weight
   - Shuffle remaining cards with daily seed
   - Combine: [Top 5 mood cards] + [Shuffled remaining]
3. **If no mood**:
   - Shuffle all cards with daily seed
4. **Insert pinned cards** at their positions
5. **Limit to 20 cards**
6. **Cache for the day** (mood-specific)

---

## Card-Mood Weighting

Cards are linked to moods via the `card_moods` table:

```sql
CREATE TABLE card_moods (
  card_id UUID REFERENCES cards(id),
  mood_id UUID REFERENCES moods(id),
  weight INTEGER DEFAULT 1, -- Higher = more relevant
  PRIMARY KEY (card_id, mood_id)
);
```

**Weight Guide**:
- `1-2` - Somewhat relevant
- `3-5` - Moderately relevant
- `6-8` - Very relevant
- `9-10` - Perfect match

### Example: Link Card to Mood

```sql
-- Make "Finding Peace" card highly relevant for "Anxious" mood
INSERT INTO card_moods (card_id, mood_id, weight)
VALUES (
  'your-card-id',
  (SELECT id FROM moods WHERE name = 'Anxious'),
  9
);
```

---

## Testing the System

### Test 1: General Feed (No Mood)

1. Clear mood: Click mood badge and don't select anything (if possible)
2. View feed
3. Should see 20 random cards (shuffled daily)

### Test 2: Mood-Specific Feed

1. **Select mood**: Choose "Happy" 😊
2. **View feed**: Navigate to feed
3. **Verify**:
   - Feed has 20 cards
   - Top cards should have high weight for "Happy" mood
   - Feed changes when you select a different mood

### Test 3: Mood Change

1. **Select "Sad"** 😢
2. **View feed** - Note the cards
3. **Change to "Grateful"** 🙏
4. **View feed again** - Should see different cards prioritized

---

## Check Mood Logs

```sql
-- See all mood selections today
SELECT
  p.username,
  m.name as mood,
  m.emoji,
  ml.logged_at
FROM mood_logs ml
JOIN profiles p ON p.id = ml.user_id
JOIN moods m ON m.id = ml.mood_id
WHERE DATE(ml.logged_at) = CURRENT_DATE
ORDER BY ml.logged_at DESC;
```

---

## Verify Card-Mood Weights

```sql
-- See which cards are linked to which moods
SELECT
  c.title,
  c.type,
  m.name as mood,
  cm.weight
FROM cards c
JOIN card_moods cm ON cm.card_id = c.id
JOIN moods m ON m.id = cm.mood_id
WHERE c.is_active = true
ORDER BY m.name, cm.weight DESC;
```

---

## Link New Cards to Moods

When you create cards via admin panel, they need to be linked to moods:

### Option 1: Link to All Moods (Default Weight)

```sql
-- Auto-link new card to all moods with weight=1
INSERT INTO card_moods (card_id, mood_id, weight)
SELECT 'YOUR_NEW_CARD_ID', id, 1
FROM moods
WHERE is_active = true;
```

### Option 2: Link to Specific Moods (Custom Weights)

```sql
-- Link "Overcoming Anxiety" card to relevant moods
INSERT INTO card_moods (card_id, mood_id, weight) VALUES
  ('card-id', (SELECT id FROM moods WHERE name = 'Anxious'), 10),
  ('card-id', (SELECT id FROM moods WHERE name = 'Sad'), 7),
  ('card-id', (SELECT id FROM moods WHERE name = 'Lonely'), 5);
```

---

## Caching Behavior

### How Cache Works

- **Cached**: When user has selected a mood
- **Cache Key**: `user_id` + `feed_date`
- **Duration**: 24 hours (resets at midnight)
- **Updates**: When user changes mood, old cache is cleared

### Clear Cache

```sql
-- Clear your cache to see new cards or test mood changes
DELETE FROM daily_feed
WHERE user_id = 'YOUR_USER_ID'
AND feed_date = CURRENT_DATE;
```

Or use the API:
```bash
curl -X POST http://localhost:3000/api/feed/clear-cache
```

---

## 20 Cards Guarantee

The feed **always returns up to 20 cards**:

```typescript
// In API route
finalCards = finalCards.slice(0, 20);
```

**What if there are fewer than 20 cards?**
- System returns all available cards
- If you have < 20 active cards total, that's all you'll see
- Solution: Create more cards in admin panel!

---

## Common Issues & Solutions

### Issue: Feed doesn't change when I select different moods

**Cause**: Cards not linked to moods via `card_moods` table

**Fix**: Link cards to moods:
```sql
-- Quick fix: Link ALL cards to ALL moods with default weight
INSERT INTO card_moods (card_id, mood_id, weight)
SELECT c.id, m.id, 1
FROM cards c
CROSS JOIN moods m
WHERE c.is_active = true
ON CONFLICT DO NOTHING;
```

### Issue: Same 3 cards always appear at top for a mood

**Cause**: Only 3 cards have high weight for that mood

**Fix**: Add more cards with high weights for that mood

### Issue: Feed shows less than 20 cards

**Possible causes**:
1. Less than 20 active cards total
2. Membership level too low (cards require higher level)
3. Publish dates in the future

**Check**:
```sql
SELECT COUNT(*) FROM cards
WHERE is_active = true
AND min_membership_level <= 1;
```

---

## Summary

✅ **Mood selection affects feed** - Different moods show different cards
✅ **20 cards always** - Up to 20 cards returned per feed
✅ **General feed available** - If no mood selected, random shuffle
✅ **Mood logging** - All mood selections tracked in `mood_logs`
✅ **Cache per mood** - Feed cached based on mood selection
✅ **Weight-based ranking** - Cards prioritized by `card_moods.weight`

**The feed is now fully mood-aware!** 🎉
