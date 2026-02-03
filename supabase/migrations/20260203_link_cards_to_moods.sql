-- Migration: Link All Cards to Moods
-- This ensures all existing cards appear in mood-based feeds

-- Auto-link all active cards to all active moods with default weight=1
-- This is safe to run multiple times (uses ON CONFLICT DO NOTHING)
INSERT INTO card_moods (card_id, mood_id, weight)
SELECT c.id, m.id, 1
FROM cards c
CROSS JOIN moods m
WHERE c.is_active = true
AND m.is_active = true
ON CONFLICT (card_id, mood_id) DO NOTHING;

-- Optional: Set higher weights for specific card types
-- Uncomment and customize based on your content

-- Devotional cards are more relevant for Sad and Anxious moods
-- UPDATE card_moods
-- SET weight = 5
-- FROM cards c
-- JOIN moods m ON m.id = card_moods.mood_id
-- WHERE card_moods.card_id = c.id
-- AND c.type = 'devotional'
-- AND m.name IN ('Sad', 'Anxious', 'Lonely');

-- Motivational cards are more relevant for Happy and Grateful moods
-- UPDATE card_moods
-- SET weight = 5
-- FROM cards c
-- JOIN moods m ON m.id = card_moods.mood_id
-- WHERE card_moods.card_id = c.id
-- AND c.type = 'motivational'
-- AND m.name IN ('Happy', 'Grateful');

-- Prayer cards are highly relevant for all moods
-- UPDATE card_moods
-- SET weight = 3
-- FROM cards c
-- WHERE card_moods.card_id = c.id
-- AND c.type = 'prayer';

-- Games and quizzes are more relevant for Happy mood
-- UPDATE card_moods
-- SET weight = 4
-- FROM cards c
-- JOIN moods m ON m.id = card_moods.mood_id
-- WHERE card_moods.card_id = c.id
-- AND c.type IN ('game', 'quiz')
-- AND m.name = 'Happy';

-- Verify the linking worked
SELECT
  c.type,
  COUNT(DISTINCT c.id) as card_count,
  COUNT(*) as total_mood_links,
  ROUND(AVG(cm.weight), 2) as avg_weight
FROM cards c
LEFT JOIN card_moods cm ON cm.card_id = c.id
WHERE c.is_active = true
GROUP BY c.type
ORDER BY c.type;
