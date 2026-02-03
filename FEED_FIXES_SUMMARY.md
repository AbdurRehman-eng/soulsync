# Feed Fixes - Complete Summary

## Problems Identified & Fixed

### 1. ✅ Feed Only Showing 3 Hardcoded Cards

**Problem**: Main page was passing `initialCards={sampleFeedCards}` to CardFeed component, which used hardcoded sample data instead of fetching from the database.

**Fix**: Removed `initialCards` prop from CardFeed call in [app/(main)/page.tsx](app/(main)/page.tsx:314)

**Before**:
```tsx
<CardFeed initialCards={sampleFeedCards} />
```

**After**:
```tsx
<CardFeed />
```

Now CardFeed fetches real data from `/api/feed`!

---

### 2. ✅ New Cards Not Appearing After Creation

**Problem**: Feed uses daily caching. Once viewed, cached cards are shown for the rest of the day, preventing new cards from appearing.

**Solution**: Clear the cache!

#### Quick Fix - Run in Supabase SQL Editor:

```sql
-- Clear today's cache for all users
DELETE FROM daily_feed WHERE feed_date = CURRENT_DATE;
```

#### Or use the new API endpoint:

```bash
# Clear your own cache
curl -X POST http://localhost:3000/api/feed/clear-cache

# Admin: Clear all caches
curl -X DELETE http://localhost:3000/api/feed/clear-cache
```

---

### 3. ✅ Quiz Card UI Improvements

**Updated**: [components/cards/QuizCard.tsx](components/cards/QuizCard.tsx)

**Changes**:
- ✅ Shows estimated completion time (30 sec per question)
- ✅ "Take Quiz" button instead of "Start"
- ✅ Displays difficulty with color coding (green/yellow/red)
- ✅ Better description layout with glass card
- ✅ Shows "Earn +X pts" instead of just "+X pts"

**New UI**:
```
┌─────────────────────────┐
│  🏆 Trophy Icon         │
│  Quiz Title             │
│  Description            │
│                         │
│  ┌───────────────────┐  │
│  │ 5 questions       │  │
│  │ 🕐 3 min          │  │
│  │ Difficulty: Easy  │  │
│  └───────────────────┘  │
│                         │
│  [Earn +20 pts]         │
│  [Take Quiz →]          │
└─────────────────────────┘
```

---

### 4. ✅ Game Card UI Improvements

**Updated**: [components/cards/GameCard.tsx](components/cards/GameCard.tsx)

**Changes**:
- ✅ Shows game description/instructions in a glass card
- ✅ "Play Now" button instead of just "Play"
- ✅ Displays target score and time limit for AR games
- ✅ Shows "X Difficulty" instead of just difficulty level
- ✅ Better layout with more spacing

**AR Game UI**:
```
┌─────────────────────────┐
│  ✨ Sparkles Icon       │
│  Game Title             │
│  Subtitle               │
│                         │
│  ┌───────────────────┐  │
│  │ ℹ️ Instructions    │  │
│  │ Target: 100 pts   │  │
│  │ Time: 60s         │  │
│  └───────────────────┘  │
│                         │
│  [Play Now ▶]           │
│  [Medium Difficulty]    │
└─────────────────────────┘
```

**Regular Game UI**:
```
┌─────────────────────────┐
│  🎮 Gamepad Icon        │
│  Game Title             │
│  Subtitle               │
│                         │
│  ┌───────────────────┐  │
│  │ ℹ️ Instructions    │  │
│  └───────────────────┘  │
│                         │
│  [Play Now ▶]           │
└─────────────────────────┘
```

---

## Files Changed

1. **[app/(main)/page.tsx](app/(main)/page.tsx)** - Removed hardcoded cards
2. **[components/cards/QuizCard.tsx](components/cards/QuizCard.tsx)** - Improved UI with time estimate
3. **[components/cards/GameCard.tsx](components/cards/GameCard.tsx)** - Improved UI with description
4. **[app/api/feed/clear-cache/route.ts](app/api/feed/clear-cache/route.ts)** - NEW: API to clear cache

---

## How to See New Cards

### Step 1: Clear the Feed Cache

**Option A - SQL** (Fastest):
```sql
DELETE FROM daily_feed WHERE feed_date = CURRENT_DATE;
```

**Option B - API** (During runtime):
```bash
# In your browser console or using curl
fetch('/api/feed/clear-cache', { method: 'POST' })
  .then(r => r.json())
  .then(console.log);
```

### Step 2: Verify Cards Are Active

```sql
-- Check all active cards
SELECT id, type, title, is_active, min_membership_level, publish_date
FROM cards
WHERE is_active = true
ORDER BY created_at DESC;
```

### Step 3: Verify Game/Quiz Data Exists

**For Games**:
```sql
SELECT c.id, c.title, g.is_ar_game, g.ar_type, g.instructions
FROM cards c
JOIN games g ON g.card_id = c.id
WHERE c.type = 'game';
```

**For Quizzes**:
```sql
SELECT c.id, c.title, q.difficulty, COUNT(qq.id) as questions
FROM cards c
JOIN quizzes q ON q.card_id = c.id
LEFT JOIN quiz_questions qq ON qq.quiz_id = q.id
WHERE c.type = 'quiz'
GROUP BY c.id, c.title, q.difficulty;
```

### Step 4: Refresh Browser

After clearing cache, refresh your browser and navigate to the feed. All your cards should now appear!

---

## Testing the Improvements

### Test Quiz Card

1. Create a quiz in admin panel
2. Clear feed cache
3. Refresh and view feed
4. Quiz card should show:
   - Trophy icon
   - Number of questions
   - Estimated time (e.g., "3 min")
   - Difficulty with color
   - "Take Quiz" button

### Test AR Game Card

1. Create an AR game in admin panel
2. Clear feed cache
3. Refresh and view feed
4. AR game card should show:
   - Blue sparkles icon (not orange gamepad)
   - "AR Game" badge
   - Instructions
   - Target score and time
   - "Play Now" button
   - Difficulty level

### Test Regular Game Card

1. If you have non-AR games
2. Should show:
   - Orange gamepad icon
   - "Mini Game" badge
   - Instructions
   - "Play Now" button

---

## Permissions for AR Games

AR games in this implementation use WebGL (not native device AR), so **no camera permissions are needed**. The games render 3D objects in a virtual space using Three.js.

If you want to add device camera AR in the future:
- Use WebXR Device API
- Request camera permissions with `navigator.mediaDevices.getUserMedia({ video: true })`
- Show permission prompt before opening AR game viewer

---

## Common Issues & Solutions

### Issue: Cards still not showing

**Check**:
1. Did you clear the cache?
2. Are cards `is_active = true`?
3. Is `min_membership_level` appropriate for user?
4. Is `publish_date` NULL or in the past?

### Issue: Quiz shows "0 questions"

**Fix**: Quiz questions weren't created. Check:
```sql
SELECT quiz_id, COUNT(*) FROM quiz_questions GROUP BY quiz_id;
```

### Issue: Game shows "Loading..."

**Fix**: Game record doesn't exist. Check:
```sql
SELECT * FROM games WHERE card_id = 'YOUR_CARD_ID';
```

### Issue: Feed API returns error

**Check browser console** for:
- Supabase connection errors
- RLS policy errors
- Network errors

---

## Summary

✅ **Feed now fetches from database** instead of hardcoded data
✅ **Quiz cards show time estimate** and better UI
✅ **Game cards show descriptions** and "Play Now" button
✅ **Cache clear endpoint** for easy development
✅ **Documentation** for troubleshooting

**Next**: Clear your feed cache and test the improved UI!
