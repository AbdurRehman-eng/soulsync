# Like Feature - Status & Testing Guide

## What Was Fixed

### 1. ✅ Likes Page - Can Now Unlike Cards

**Updated**: [app/(main)/likes/page.tsx](app/(main)/likes/page.tsx)

Added `onLike` handler to allow unliking cards from the likes page:

```typescript
<FeedCard
  card={card}
  index={index}
  isLiked={true}
  onLike={() => {
    // Remove from liked cards when unliked
    console.log(`[Likes Page] Unliking card: ${card.id}`);
    setLikedCards((prev) => prev.filter((c) => c.id !== card.id));
  }}
/>
```

### 2. ✅ CardFeed - Shows Correct Like State

**Updated**: [components/feed/CardFeed.tsx](components/feed/CardFeed.tsx)

Added function to fetch liked cards on mount so cards show correct liked state:

```typescript
// Fetch liked cards on mount to show correct like state
useEffect(() => {
  fetchLikedCards();
}, []);

const fetchLikedCards = async () => {
  try {
    const response = await fetch("/api/interactions?type=like&limit=500");
    if (response.ok) {
      const data = await response.json();
      const likedCardIds = new Set(data.cards?.map((c: Card) => c.id) || []);
      console.log(`[CardFeed] Loaded ${likedCardIds.size} liked cards`);
      setLikedCards(likedCardIds);
    }
  } catch (error) {
    console.error("[CardFeed] Failed to fetch liked cards:", error);
  }
};
```

### 3. ✅ Interactions API - Added Debug Logging

**Updated**: [app/api/interactions/route.ts](app/api/interactions/route.ts)

Added console logging for debugging:
- Logs when cards are liked/unliked
- Logs how many liked cards are returned in GET requests

## How the Like Feature Works

### User Flow

```
┌─────────────────────────────────────────────┐
│ 1. User taps heart icon on card            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 2. CardFeed calls handleLike(cardId)        │
│    - Updates local state (adds to Set)     │
│    - Calls API: POST /api/interactions     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 3. API checks if already liked              │
│    - If yes: DELETE (unlike)                │
│    - If no: INSERT (like)                   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 4. Returns { liked: true/false }            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 5. Heart icon updates (filled/unfilled)     │
│    - Floating hearts animation if liked    │
└─────────────────────────────────────────────┘
```

### Viewing Liked Content

```
┌─────────────────────────────────────────────┐
│ 1. User goes to More → Liked Content       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 2. Likes page fetches liked cards           │
│    GET /api/interactions?type=like          │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 3. API queries card_interactions table      │
│    - Filters by user_id and type='like'    │
│    - Joins with cards table                │
│    - Returns card objects                   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 4. Displays liked cards in grid             │
│    - Shows search bar                       │
│    - Allows unliking (removes from list)    │
└─────────────────────────────────────────────┘
```

## Database Structure

### card_interactions Table

```sql
CREATE TABLE card_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  interaction_type TEXT CHECK (interaction_type IN ('view', 'like', 'share', 'complete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes**:
- `user_id` - Fast lookup of user's interactions
- `card_id` - Fast lookup of card's interactions
- `interaction_type` - Fast filtering by type

## Testing the Like Feature

### 1. Quick Manual Test

1. **Open the app** and navigate to the feed
2. **Tap the heart icon** on a card
   - Heart should fill with red color
   - Floating hearts should appear
   - Check browser console for: `[Interactions API] Liking card ...`
3. **Tap the heart again** to unlike
   - Heart should become unfilled
   - Check console for: `[Interactions API] Unliking card ...`
4. **Go to More → Liked Content**
   - Should see the cards you liked
5. **Unlike from the likes page**
   - Card should disappear from the list

### 2. Automated Testing

Copy [TEST_LIKE_FEATURE.js](TEST_LIKE_FEATURE.js) into browser console and run:

```javascript
// Run all tests
window.testLikes.all()

// Or test individual functions
window.testLikes.like("card-id-here")
window.testLikes.unlike("card-id-here")
window.testLikes.getLiked()
```

### 3. Database Verification

Run [VERIFY_LIKE_FEATURE.sql](VERIFY_LIKE_FEATURE.sql) in Supabase SQL Editor to:
- Check table structure
- View recent likes
- Count likes per user
- See most liked cards
- Verify RLS policies

## Debug Logs

With the updates, you'll see these logs:

### Browser Console
```
[CardFeed] Loaded 5 liked cards
[Likes Page] Loaded 5 liked cards
[Likes Page] Unliking card: abc-123
```

### Server Logs (Terminal)
```
[Interactions API] Liking card abc-123 for user xyz-789
[Interactions API] GET request - returning 5 like interactions for user xyz-789
[Interactions API] Unliking card abc-123 for user xyz-789
```

## API Endpoints

### POST /api/interactions
Like or unlike a card (toggle behavior)

**Request**:
```json
{
  "card_id": "uuid-here",
  "type": "like"
}
```

**Response (Like)**:
```json
{
  "success": true,
  "liked": true,
  "pointsAwarded": 0
}
```

**Response (Unlike)**:
```json
{
  "success": true,
  "liked": false
}
```

### GET /api/interactions
Get user's liked cards

**Query Parameters**:
- `type` (optional): "like" | "view" | "share" | "complete" (default: "like")
- `limit` (optional): number (default: 50)

**Response**:
```json
{
  "cards": [
    {
      "id": "uuid",
      "type": "verse",
      "title": "Today's Verse",
      ...
    }
  ]
}
```

## Common Issues & Solutions

### Issue: Liked cards don't show up on /likes page

**Check**:
1. Are you logged in?
2. Check browser console for errors
3. Check server logs for API errors
4. Run SQL query to verify data exists:
   ```sql
   SELECT * FROM card_interactions
   WHERE user_id = 'YOUR_USER_ID'
   AND interaction_type = 'like';
   ```

### Issue: Hearts don't stay filled after refresh

This is expected behavior. The CardFeed fetches liked cards on mount, so:
1. Wait for the fetch to complete
2. Hearts should update automatically
3. Check console for: `[CardFeed] Loaded X liked cards`

### Issue: RLS policy error

Run these SQL commands:
```sql
-- Allow users to view their own interactions
CREATE POLICY "Users can view own interactions"
  ON card_interactions FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to create interactions
CREATE POLICY "Users can create own interactions"
  ON card_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete interactions (unlike)
CREATE POLICY "Users can delete own interactions"
  ON card_interactions FOR DELETE
  USING (auth.uid() = user_id);
```

### Issue: API returns 401 Unauthorized

You're not logged in. Check:
1. `supabase.auth.getUser()` returns a user
2. Session cookies are present
3. Try logging out and back in

## Summary

✅ **Like/Unlike Toggle** - Works on feed cards
✅ **Likes Page** - Can view and unlike cards
✅ **Correct State** - Cards show correct liked status on load
✅ **API Logging** - Debug logs for troubleshooting
✅ **Database** - card_interactions table stores likes
✅ **Navigation** - Accessible from More page
✅ **Search** - Can search liked content
✅ **Animation** - Floating hearts on like

## Files Changed

1. ✅ [app/(main)/likes/page.tsx](app/(main)/likes/page.tsx) - Added unlike handler and logging
2. ✅ [components/feed/CardFeed.tsx](components/feed/CardFeed.tsx) - Fetches liked cards on mount
3. ✅ [app/api/interactions/route.ts](app/api/interactions/route.ts) - Added debug logging

## Next Steps (Optional Enhancements)

- Add like counts to cards
- Show "most liked" section
- Add unlike confirmation dialog
- Implement optimistic UI updates (don't wait for API)
- Add share count tracking
- Export liked content list
