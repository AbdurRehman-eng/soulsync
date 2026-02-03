-- Migration: Add AR Games Support
-- Run this in Supabase SQL Editor to add AR game functionality

-- Extend games table to support AR games
ALTER TABLE games
  ADD COLUMN IF NOT EXISTS is_ar_game BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS ar_type TEXT CHECK (ar_type IN ('balloon_pop', 'target_tap', 'catch_game', 'memory_match', 'reaction_time', 'spatial_puzzle')),
  ADD COLUMN IF NOT EXISTS ar_config JSONB DEFAULT '{}';

-- Add comment explaining ar_config structure
COMMENT ON COLUMN games.ar_config IS 'AR game configuration:
{
  "objectType": "balloon|target|coin|star",
  "objectColor": "#hex",
  "spawnRate": 1-10,
  "gameTime": 30-120 seconds,
  "targetScore": 100-1000,
  "difficulty": "easy|medium|hard",
  "soundEnabled": true|false,
  "hapticEnabled": true|false,
  "theme": "colorful|minimal|nature",
  "specialEffects": ["particles", "trails", "glow"]
}';

-- Update the car d type check to ensure AR games are marked as 'game' type
-- (no change needed - already has 'game' type)

-- Create index for AR game queries
CREATE INDEX IF NOT EXISTS idx_games_ar_type ON games(ar_type) WHERE is_ar_game = true;

-- Add sample AR game
INSERT INTO cards (type, title, subtitle, content, points_reward, min_membership_level)
VALUES (
  'game',
  'Balloon Pop Challenge',
  'Pop balloons in AR!',
  '{"description": "Use your device camera to see balloons appear in your space. Tap to pop them before time runs out!"}',
  20,
  1
) RETURNING id;

-- Note: After running this migration, you'll need to link the game to the card
-- by inserting into the games table with the returned card_id
