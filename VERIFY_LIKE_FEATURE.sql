-- VERIFY LIKE FEATURE
-- Run these queries in Supabase SQL Editor to check the like system

-- ==========================================
-- CHECK DATABASE STRUCTURE
-- ==========================================

-- 1. Verify card_interactions table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'card_interactions'
) as table_exists;

-- 2. Check card_interactions table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'card_interactions'
ORDER BY ordinal_position;

-- ==========================================
-- CHECK INTERACTIONS DATA
-- ==========================================

-- 3. Count all interactions by type
SELECT
  interaction_type,
  COUNT(*) as count
FROM card_interactions
GROUP BY interaction_type
ORDER BY count DESC;

-- 4. Check recent likes
SELECT
  ci.id,
  ci.user_id,
  ci.card_id,
  ci.interaction_type,
  ci.created_at,
  c.title as card_title,
  c.type as card_type,
  p.username
FROM card_interactions ci
JOIN cards c ON c.id = ci.card_id
JOIN profiles p ON p.id = ci.user_id
WHERE ci.interaction_type = 'like'
ORDER BY ci.created_at DESC
LIMIT 20;

-- 5. Count likes per user
SELECT
  p.username,
  p.display_name,
  COUNT(ci.id) as total_likes
FROM profiles p
LEFT JOIN card_interactions ci ON ci.user_id = p.id AND ci.interaction_type = 'like'
GROUP BY p.id, p.username, p.display_name
ORDER BY total_likes DESC;

-- 6. Most liked cards
SELECT
  c.id,
  c.type,
  c.title,
  COUNT(ci.id) as like_count
FROM cards c
LEFT JOIN card_interactions ci ON ci.card_id = c.id AND ci.interaction_type = 'like'
GROUP BY c.id, c.type, c.title
ORDER BY like_count DESC
LIMIT 10;

-- ==========================================
-- CHECK RLS POLICIES
-- ==========================================

-- 7. Verify RLS policies exist for card_interactions
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'card_interactions';

-- ==========================================
-- TEST QUERIES
-- ==========================================

-- 8. Check if a specific user has liked a specific card
-- Replace USER_ID and CARD_ID with actual values
/*
SELECT EXISTS (
  SELECT 1 FROM card_interactions
  WHERE user_id = 'YOUR_USER_ID'
  AND card_id = 'YOUR_CARD_ID'
  AND interaction_type = 'like'
) as is_liked;
*/

-- 9. Get all cards a user has liked
-- Replace USER_ID with actual value
/*
SELECT
  c.id,
  c.type,
  c.title,
  ci.created_at as liked_at
FROM card_interactions ci
JOIN cards c ON c.id = ci.card_id
WHERE ci.user_id = 'YOUR_USER_ID'
AND ci.interaction_type = 'like'
ORDER BY ci.created_at DESC;
*/

-- ==========================================
-- FIX COMMON ISSUES
-- ==========================================

-- 10. If RLS policies are missing, create them:
/*
-- Allow users to read their own interactions
CREATE POLICY "Users can view own interactions"
  ON card_interactions FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to create their own interactions
CREATE POLICY "Users can create own interactions"
  ON card_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own interactions (for unlike)
CREATE POLICY "Users can delete own interactions"
  ON card_interactions FOR DELETE
  USING (auth.uid() = user_id);
*/

-- 11. If table doesn't exist, create it:
/*
CREATE TABLE IF NOT EXISTS card_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  interaction_type TEXT CHECK (interaction_type IN ('view', 'like', 'share', 'complete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_card_interactions_user_id ON card_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_card_interactions_card_id ON card_interactions(card_id);
CREATE INDEX IF NOT EXISTS idx_card_interactions_type ON card_interactions(interaction_type);

-- Enable RLS
ALTER TABLE card_interactions ENABLE ROW LEVEL SECURITY;
*/
