-- Fix Feed Issue - Complete Solution
-- Run these in order

-- STEP 1: Clear the feed cache (removes old cached data)
DELETE FROM daily_feed WHERE feed_date >= CURRENT_DATE - INTERVAL '7 days';

-- STEP 2: Link all cards to all moods (from your migration)
INSERT INTO card_moods (card_id, mood_id, weight)
SELECT c.id, m.id, 1
FROM cards c
CROSS JOIN moods m
WHERE c.is_active = true
AND m.is_active = true
ON CONFLICT (card_id, mood_id) DO NOTHING;

-- STEP 3: Ensure all cards are properly configured
-- Set cards to active if they're not
UPDATE cards
SET is_active = true
WHERE is_active = false
AND id IN (
  -- Only activate cards that have content
  SELECT c.id FROM cards c
  LEFT JOIN games g ON g.card_id = c.id
  LEFT JOIN quizzes q ON q.card_id = c.id
  WHERE (c.type NOT IN ('game', 'quiz'))
     OR (c.type = 'game' AND g.id IS NOT NULL)
     OR (c.type = 'quiz' AND q.id IS NOT NULL)
);

-- STEP 4: Set membership level to 1 for all cards (free tier)
UPDATE cards
SET min_membership_level = 1
WHERE min_membership_level > 1;

-- STEP 5: Clear future publish dates
UPDATE cards
SET publish_date = NULL
WHERE publish_date > CURRENT_DATE;

-- Verification: Count cards that will appear in feed
SELECT
  'Total active cards' as check_name,
  COUNT(*) as count
FROM cards
WHERE is_active = true
AND min_membership_level <= 1
AND (publish_date IS NULL OR publish_date <= CURRENT_DATE)

UNION ALL

SELECT
  'Cards linked to moods' as check_name,
  COUNT(DISTINCT card_id) as count
FROM card_moods cm
JOIN cards c ON c.id = cm.card_id
WHERE c.is_active = true;
