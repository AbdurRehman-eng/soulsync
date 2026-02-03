# Fix: Feed Only Showing 3 Cards

## Problem
The feed is displaying only 3 swipeable cards instead of up to 20 cards.

## Root Causes
1. **Feed cache has old data** with only 3 cards from before mood system was implemented
2. **Cards aren't linked to moods** - the migration hasn't been run yet
3. **Database might only have 3 cards** marked as active

## Complete Fix (Run in Order)

### Step 1: Run Debug Queries

Open Supabase SQL Editor and run [DEBUG_FEED_ISSUE.sql](DEBUG_FEED_ISSUE.sql) to see:
- How many active cards exist
- Whether cards are linked to moods
- What's in the cache

### Step 2: Run Fix Script

Execute [FIX_FEED_ISSUE.sql](FIX_FEED_ISSUE.sql) in Supabase SQL Editor. This will:

1. **Clear the cache**:
   ```sql
   DELETE FROM daily_feed WHERE feed_date >= CURRENT_DATE - INTERVAL '7 days';
   ```

2. **Link all cards to all moods**:
   ```sql
   INSERT INTO card_moods (card_id, mood_id, weight)
   SELECT c.id, m.id, 1
   FROM cards c
   CROSS JOIN moods m
   WHERE c.is_active = true
   AND m.is_active = true
   ON CONFLICT (card_id, mood_id) DO NOTHING;
   ```

3. **Ensure cards are properly configured** (active, membership level 1, published)

### Step 3: Verify Card Count

Check how many cards will appear in the feed:

```sql
SELECT COUNT(*) as feed_eligible_cards
FROM cards
WHERE is_active = true
AND min_membership_level <= 1
AND (publish_date IS NULL OR publish_date <= CURRENT_DATE);
```

**Expected**: Should show 10+ cards if you've been creating content from the admin panel.

**If you see < 5 cards**: You need to create more cards from the admin panel.

### Step 4: Test the Feed

1. **Refresh your browser** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Select a mood**
3. **Navigate to the feed**
4. **Verify you see multiple cards** (not just 3)

## If Still Only Showing 3 Cards

### Check Browser Console

Open Developer Tools (F12) and check:
1. Network tab - Look at the `/api/feed` request
2. Check the response - How many cards are returned?
3. Look for any errors

### Manual Cache Clear via API

If the cache is still causing issues, use the API endpoint:

```bash
# Open browser console and run:
fetch('/api/feed/clear-cache', { method: 'POST' })
  .then(r => r.json())
  .then(console.log);
```

Or via curl:
```bash
curl -X POST http://localhost:3000/api/feed/clear-cache
```

### Check Database Directly

```sql
-- See what cards exist
SELECT id, type, title, is_active, min_membership_level
FROM cards
WHERE is_active = true
ORDER BY created_at DESC;

-- See card-mood links
SELECT
  c.type,
  c.title,
  COUNT(cm.mood_id) as mood_count
FROM cards c
LEFT JOIN card_moods cm ON cm.card_id = c.id
WHERE c.is_active = true
GROUP BY c.id, c.type, c.title;
```

## Why This Happened

The feed uses **daily caching** for performance. Before the mood-based feed system was implemented, you likely viewed the feed with 3 sample cards. Those 3 cards got cached for today. Now even though:
- The mood system is implemented
- The API can return 20 cards
- The code is correct

...the cache is returning the old 3-card feed.

## Prevention for Development

During development, you can temporarily modify the API to skip caching:

**app/api/feed/route.ts** - Comment out cache check:
```typescript
// TEMPORARILY DISABLE FOR DEVELOPMENT
// if (user && moodId) {
//   const { data: cachedFeed } = await supabase
//     .from("daily_feed")
//     ...
// }
```

**Remember to re-enable caching for production!**

## Summary

Run the [FIX_FEED_ISSUE.sql](FIX_FEED_ISSUE.sql) script and refresh your browser. Your feed should now show up to 20 cards based on your mood selection.
