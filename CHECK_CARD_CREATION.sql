-- Check if cards are being created from admin panel

-- See all cards with their related data
SELECT
  c.id,
  c.type,
  c.title,
  c.is_active,
  c.created_at,
  CASE
    WHEN c.type = 'game' THEN (SELECT COUNT(*) FROM games g WHERE g.card_id = c.id)
    WHEN c.type = 'quiz' THEN (SELECT COUNT(*) FROM quizzes q WHERE q.card_id = c.id)
    ELSE 1
  END as has_related_data
FROM cards c
ORDER BY c.created_at DESC
LIMIT 20;

-- Check games
SELECT
  c.title as card_title,
  g.is_ar_game,
  g.ar_type,
  g.difficulty,
  c.created_at
FROM cards c
JOIN games g ON g.card_id = c.id
ORDER BY c.created_at DESC;

-- Check quizzes with question count
SELECT
  c.title as card_title,
  q.difficulty,
  COUNT(qq.id) as question_count,
  c.created_at
FROM cards c
JOIN quizzes q ON q.card_id = c.id
LEFT JOIN quiz_questions qq ON qq.quiz_id = q.id
GROUP BY c.id, c.title, q.difficulty, c.created_at
ORDER BY c.created_at DESC;

-- If any tables show 0 rows, cards aren't being created from admin panel
