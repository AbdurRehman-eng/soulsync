-- Debug Feed Issue - Run these queries to diagnose the problem

-- 1. Check how many active cards exist
SELECT
  type,
  COUNT(*) as count,
  is_active
FROM cards
GROUP BY type, is_active
ORDER BY is_active DESC, type;

-- 2. Check card-mood links (should be populated)
SELECT
  COUNT(*) as total_links,
  COUNT(DISTINCT card_id) as unique_cards,
  COUNT(DISTINCT mood_id) as unique_moods
FROM card_moods;

-- 3. Check today's cached feeds
SELECT
  user_id,
  feed_date,
  COUNT(*) as cached_cards
FROM daily_feed
WHERE feed_date = CURRENT_DATE
GROUP BY user_id, feed_date;

-- 4. Check if cards are eligible for feed (active, proper membership, published)
SELECT
  id,
  type,
  title,
  is_active,
  min_membership_level,
  publish_date,
  CASE
    WHEN is_active = false THEN 'INACTIVE'
    WHEN min_membership_level > 1 THEN 'WRONG_MEMBERSHIP'
    WHEN publish_date > CURRENT_DATE THEN 'NOT_PUBLISHED_YET'
    ELSE 'OK'
  END as status
FROM cards
ORDER BY is_active DESC, type;

-- 5. Check card-mood links per card
SELECT
  c.id,
  c.type,
  c.title,
  COUNT(cm.mood_id) as linked_moods
FROM cards c
LEFT JOIN card_moods cm ON cm.card_id = c.id
WHERE c.is_active = true
GROUP BY c.id, c.type, c.title
ORDER BY linked_moods, c.type;
