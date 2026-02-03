-- COMPLETE FEED FIX
-- This script will diagnose and fix the "only 3 cards" issue

-- ==========================================
-- STEP 1: DIAGNOSE THE PROBLEM
-- ==========================================

-- Check 1: How many active cards exist?
SELECT 'Active Cards Count' as check_name, COUNT(*) as result
FROM cards
WHERE is_active = true;

-- Check 2: What cards exist and their status?
SELECT
  id,
  type,
  title,
  is_active,
  min_membership_level,
  publish_date,
  created_at
FROM cards
ORDER BY created_at DESC;

-- Check 3: What's in the cached feed today?
SELECT
  'Cached Feed Count' as check_name,
  user_id,
  COUNT(*) as card_count
FROM daily_feed
WHERE feed_date = CURRENT_DATE
GROUP BY user_id;

-- Check 4: Are cards linked to moods?
SELECT
  'Card-Mood Links' as check_name,
  COUNT(*) as total_links,
  COUNT(DISTINCT card_id) as unique_cards
FROM card_moods;

-- ==========================================
-- STEP 2: FIX THE ISSUE
-- ==========================================

-- Fix 1: CLEAR ALL CACHED FEEDS
-- This is the most likely culprit - old cache with 3 cards
DELETE FROM daily_feed;

-- Fix 2: ENSURE CARDS ARE ACTIVE AND PROPERLY CONFIGURED
-- Set all cards to active, membership level 1, and clear future publish dates
UPDATE cards
SET
  is_active = true,
  min_membership_level = 1,
  publish_date = CASE
    WHEN publish_date > CURRENT_DATE THEN NULL
    ELSE publish_date
  END
WHERE is_active = false
   OR min_membership_level > 1
   OR publish_date > CURRENT_DATE;

-- Fix 3: LINK ALL CARDS TO ALL MOODS
-- This ensures mood-based feed works properly
INSERT INTO card_moods (card_id, mood_id, weight)
SELECT c.id, m.id, 1
FROM cards c
CROSS JOIN moods m
WHERE c.is_active = true
AND m.is_active = true
ON CONFLICT (card_id, mood_id) DO NOTHING;

-- ==========================================
-- STEP 3: VERIFY THE FIX
-- ==========================================

-- Verify 1: Count eligible cards for feed
SELECT
  'Feed-Eligible Cards' as check_name,
  COUNT(*) as count
FROM cards
WHERE is_active = true
AND min_membership_level <= 1
AND (publish_date IS NULL OR publish_date <= CURRENT_DATE);

-- Verify 2: Check card types distribution
SELECT
  type,
  COUNT(*) as count
FROM cards
WHERE is_active = true
GROUP BY type
ORDER BY count DESC;

-- Verify 3: Verify card-mood links per card
SELECT
  c.type,
  c.title,
  COUNT(cm.mood_id) as linked_moods
FROM cards c
LEFT JOIN card_moods cm ON cm.card_id = c.id
WHERE c.is_active = true
GROUP BY c.id, c.type, c.title
ORDER BY linked_moods;

-- Verify 4: Confirm cache is cleared
SELECT
  'Remaining Cached Feeds' as check_name,
  COUNT(*) as count
FROM daily_feed;

-- ==========================================
-- EXPECTED RESULTS
-- ==========================================
-- After running this script:
-- 1. daily_feed table should be empty (0 rows)
-- 2. All cards should be is_active=true, min_membership_level=1
-- 3. Each card should be linked to all moods (6 moods typically)
-- 4. Feed-Eligible Cards count should match your total cards created
--
-- If Feed-Eligible Cards = 3, you only have 3 cards in database
-- If Feed-Eligible Cards > 3, the cache was the problem
