-- Fix AR Games that are missing required data
-- This script checks and fixes AR games that might be incomplete

-- 1. Check current AR games status
SELECT
  c.id as card_id,
  c.title,
  c.type,
  g.id as game_id,
  g.is_ar_game,
  g.ar_type,
  CASE
    WHEN g.ar_config IS NULL THEN 'NULL'
    WHEN g.ar_config::text = '{}' THEN 'EMPTY OBJECT'
    ELSE 'HAS CONFIG'
  END as ar_config_status
FROM cards c
LEFT JOIN games g ON g.card_id = c.id
WHERE c.type = 'game'
ORDER BY c.created_at DESC;

-- 2. Find AR games with missing ar_config
SELECT
  g.id as game_id,
  c.id as card_id,
  c.title,
  g.is_ar_game,
  g.ar_type,
  g.ar_config
FROM games g
JOIN cards c ON c.id = g.card_id
WHERE g.is_ar_game = true
  AND (g.ar_config IS NULL OR g.ar_config::text = '{}' OR g.ar_type IS NULL);

-- 3. Fix AR games that are missing configuration
-- Update any AR games that don't have proper ar_config
UPDATE games
SET
  ar_config = jsonb_build_object(
    'objectType', 'balloon',
    'objectColor', '#fbbf24',
    'spawnRate', 5,
    'gameTime', 60,
    'targetScore', 100,
    'difficulty', difficulty,
    'soundEnabled', true,
    'hapticEnabled', true,
    'theme', 'colorful',
    'specialEffects', ARRAY['particles']::text[]
  ),
  ar_type = COALESCE(ar_type, 'balloon_pop')
WHERE is_ar_game = true
  AND (ar_config IS NULL OR ar_config::text = '{}' OR ar_type IS NULL);

-- 4. Verify the fix
SELECT
  c.id as card_id,
  c.title,
  g.is_ar_game,
  g.ar_type,
  g.ar_config
FROM games g
JOIN cards c ON c.id = g.card_id
WHERE g.is_ar_game = true
ORDER BY c.created_at DESC;
