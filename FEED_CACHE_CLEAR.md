# Feed Cache Clear Instructions

## Why You're Only Seeing 3 Cards

Your feed uses **daily caching** to improve performance. Once a user views their feed on a given day, it caches those cards and won't show new ones until the next day.

## Issues Fixed

1. ✅ **Removed hardcoded sample cards** - Feed now fetches from API
2. ✅ **Improved Quiz card UI** - Shows time estimate, difficulty, "Take Quiz" button
3. ✅ **Improved Game card UI** - Shows description, "Play Now" button

## Clear the Feed Cache

To see your newly created cards immediately, run this SQL in Supabase:

### Option 1: Clear All Cached Feeds (Nuclear Option)

```sql
-- Delete all cached feeds
DELETE FROM daily_feed;
```

### Option 2: Clear Only Your User's Cache

```sql
-- Replace YOUR_USER_ID with your actual user ID
DELETE FROM daily_feed WHERE user_id = 'YOUR_USER_ID';
```

### Option 3: Clear Today's Cache for All Users

```sql
-- Delete only today's cached feeds
DELETE FROM daily_feed WHERE feed_date = CURRENT_DATE;
```

## How to Find Your User ID

Run this to see all users:

```sql
SELECT id, email FROM auth.users;
```

Or if you're logged in, check the browser console:
```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log(user.id);
```

## Prevent This in the Future

### During Development

Add a "Refresh Feed" button that clears the cache:

```typescript
// In your CardFeed component
const refreshFeed = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from('daily_feed')
      .delete()
      .eq('user_id', user.id)
      .eq('feed_date', new Date().toISOString().split('T')[0]);

    // Reload feed
    window.location.reload();
  }
};
```

### Alternative: Use Query Parameters

Modify the feed API to accept a `?refresh=true` parameter:

```typescript
// In app/api/feed/route.ts
const refresh = searchParams.get("refresh");

if (!refresh && user) {
  // Check cache...
}
```

## Test New Cards Appear

1. **Clear cache** using one of the SQL commands above
2. **Refresh your browser**
3. **Navigate to feed**
4. You should now see all active cards from the database!

## Card Requirements to Appear in Feed

Make sure your cards meet these criteria:

```sql
-- Check if your cards are eligible
SELECT id, type, title, is_active, min_membership_level, publish_date
FROM cards
WHERE is_active = true
AND min_membership_level <= 1  -- Assuming free tier
AND (publish_date IS NULL OR publish_date <= CURRENT_DATE);
```

If any cards are missing:
- Set `is_active = true`
- Set `min_membership_level = 1` (or appropriate level)
- Set `publish_date = NULL` or a past date

## SQL to Verify Your Game/Quiz Setup

### Check Games

```sql
SELECT
  c.id,
  c.title,
  c.type,
  c.is_active,
  g.is_ar_game,
  g.ar_type,
  g.difficulty
FROM cards c
LEFT JOIN games g ON g.card_id = c.id
WHERE c.type = 'game';
```

### Check Quizzes

```sql
SELECT
  c.id,
  c.title,
  c.type,
  c.is_active,
  q.difficulty,
  COUNT(qq.id) as question_count
FROM cards c
LEFT JOIN quizzes q ON q.card_id = c.id
LEFT JOIN quiz_questions qq ON qq.quiz_id = q.id
WHERE c.type = 'quiz'
GROUP BY c.id, c.title, c.type, c.is_active, q.difficulty;
```

---

**After clearing cache, your feed should show all cards you created from the admin panel!**
