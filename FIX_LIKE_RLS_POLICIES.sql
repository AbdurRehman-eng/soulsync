-- FIX LIKE FEATURE RLS POLICIES
-- Run this if you're getting permission errors when liking cards

-- ==========================================
-- ENSURE RLS IS ENABLED
-- ==========================================

ALTER TABLE card_interactions ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- DROP OLD POLICIES (if they exist)
-- ==========================================

DROP POLICY IF EXISTS "Users can view own interactions" ON card_interactions;
DROP POLICY IF EXISTS "Users can create own interactions" ON card_interactions;
DROP POLICY IF EXISTS "Users can delete own interactions" ON card_interactions;

-- ==========================================
-- CREATE NEW RLS POLICIES
-- ==========================================

-- 1. Allow users to view their own interactions
CREATE POLICY "Users can view own interactions"
  ON card_interactions FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Allow users to create their own interactions
CREATE POLICY "Users can create own interactions"
  ON card_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Allow users to delete their own interactions (for unliking)
CREATE POLICY "Users can delete own interactions"
  ON card_interactions FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Optional: Allow admins to view all interactions
CREATE POLICY "Admins can view all interactions"
  ON card_interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- ==========================================
-- CREATE INDEXES FOR PERFORMANCE
-- ==========================================

-- Index on user_id for fast user lookup
CREATE INDEX IF NOT EXISTS idx_card_interactions_user_id
  ON card_interactions(user_id);

-- Index on card_id for fast card lookup
CREATE INDEX IF NOT EXISTS idx_card_interactions_card_id
  ON card_interactions(card_id);

-- Index on interaction_type for filtering
CREATE INDEX IF NOT EXISTS idx_card_interactions_type
  ON card_interactions(interaction_type);

-- Composite index for user + type queries
CREATE INDEX IF NOT EXISTS idx_card_interactions_user_type
  ON card_interactions(user_id, interaction_type);

-- ==========================================
-- VERIFY POLICIES
-- ==========================================

-- Check that policies were created
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  CASE
    WHEN cmd = 'SELECT' THEN 'READ'
    WHEN cmd = 'INSERT' THEN 'CREATE'
    WHEN cmd = 'DELETE' THEN 'DELETE'
    ELSE cmd
  END as operation
FROM pg_policies
WHERE tablename = 'card_interactions'
ORDER BY policyname;

-- Expected output:
-- - "Users can view own interactions" (SELECT)
-- - "Users can create own interactions" (INSERT)
-- - "Users can delete own interactions" (DELETE)
-- - "Admins can view all interactions" (SELECT) [optional]
