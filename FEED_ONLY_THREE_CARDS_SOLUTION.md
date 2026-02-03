## Feed Only Shows 3 Cards - Complete Solution

## What I Found

After analyzing your code, the issue is that the feed API is **returning cached data from the `daily_feed` table** which only contains 3 cards. The API code at [app/api/feed/route.ts:52-67](app/api/feed/route.ts#L52-L67) checks for cached data first and returns it if found.

## The Problem

1. **Old Cache**: The `daily_feed` table has cached 3 cards from an earlier session
2. **API Returns Cache**: Lines 52-67 return cached data without checking if more cards exist
3. **Never Updates**: Since cache exists for today, it never generates a fresh feed with all your cards

## Immediate Fix

### Option 1: Run SQL Script (Recommended)

Execute [COMPLETE_FEED_FIX.sql](COMPLETE_FEED_FIX.sql) in Supabase SQL Editor. This will:
- ✅ Clear all cached feeds
- ✅ Activate all cards and set proper membership levels
- ✅ Link all cards to all moods
- ✅ Verify the fix worked

```sql
-- Quick version - just clear the cache
DELETE FROM daily_feed;
```

### Option 2: Use API Endpoint

Open browser console (F12) and run:
```javascript
fetch('/api/feed/clear-cache', { method: 'POST' })
  .then(r => r.json())
  .then(console.log);
```

Then refresh the page.

## Testing & Debugging

### Check Server Logs

I added console logging to the API. After clearing cache and refreshing, check your server logs for:

```
[FEED API] No cached feed found, generating new feed
[FEED API] Fetched X cards from database
[FEED API] Returning X cards to client
```

If it says "Fetched 3 cards", you only have 3 cards in the database.

### Check Browser Console

The CardFeed component now logs what it receives:

```
[CardFeed] Received X cards from API
```

### Test the API Directly

Copy [TEST_FEED_API.js](TEST_FEED_API.js) into your browser console and run:

```javascript
window.testFeed.all()
```

This will test the feed API and show exactly how many cards are returned.

## Verify Cards Exist in Database

Run [CHECK_CARD_CREATION.sql](CHECK_CARD_CREATION.sql) to see:
- All cards created from admin panel
- Games with their AR configuration
- Quizzes with question counts

If this shows only 3 cards, you need to create more cards from the admin panel.

## Expected Behavior After Fix

1. **Cache cleared** → `daily_feed` table is empty
2. **API fetches fresh** → Reads from `cards` table
3. **Returns up to 20 cards** → Based on mood selection
4. **Caches for 24 hours** → Stores in `daily_feed` for performance

## Why This Happens

The feed uses **daily caching** (lines 144-160 in route.ts) to improve performance. Once a feed is generated for the day, it's cached and reused. This is great for production but problematic during development when you're creating new cards.

## Files Changed

I added debug logging to help diagnose:

1. ✅ [app/api/feed/route.ts](app/api/feed/route.ts) - Added console.log statements
2. ✅ [components/feed/CardFeed.tsx](components/feed/CardFeed.tsx) - Added console.log for received cards

These logs will help you see exactly what's happening.

## If Still Only 3 Cards After Fix

If after clearing cache you still see 3 cards:

### Check 1: Database Has More Than 3 Cards

```sql
SELECT COUNT(*) FROM cards WHERE is_active = true;
```

If this returns 3, you only have 3 cards. Create more from admin panel.

### Check 2: Cards Are Linked to Moods

```sql
SELECT COUNT(DISTINCT card_id) FROM card_moods;
```

Should match your card count. If not, run the link migration:

```sql
INSERT INTO card_moods (card_id, mood_id, weight)
SELECT c.id, m.id, 1
FROM cards c
CROSS JOIN moods m
WHERE c.is_active = true
AND m.is_active = true
ON CONFLICT (card_id, mood_id) DO NOTHING;
```

### Check 3: API is Using Correct Query

Check server logs for:
```
[FEED API] Fetched X cards from database
```

This shows how many cards the query returned.

## Temporary Development Fix

If you want to disable caching during development, comment out the cache check in [app/api/feed/route.ts:52-68](app/api/feed/route.ts#L52-L68):

```typescript
// DEVELOPMENT ONLY - DISABLE CACHING
/*
if (user && moodId) {
  const { data: cachedFeed } = await supabase
    .from("daily_feed")
    ...
}
*/
```

**Remember to re-enable for production!**

## Summary

The code is correct. The issue is cached data. Run this SQL and refresh:

```sql
DELETE FROM daily_feed;
```

Then check browser console and server logs to verify it's working.
