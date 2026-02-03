-- ============================================
-- RLS POLICIES FOR QUIZZES AND QUIZ QUESTIONS
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view quizzes" ON quizzes;
DROP POLICY IF EXISTS "Admins can manage quizzes" ON quizzes;
DROP POLICY IF EXISTS "Anyone can view quiz questions" ON quiz_questions;
DROP POLICY IF EXISTS "Admins can manage quiz questions" ON quiz_questions;

-- QUIZZES TABLE POLICIES
-- Allow everyone to view quizzes (for taking quizzes)
CREATE POLICY "Anyone can view quizzes"
  ON quizzes
  FOR SELECT
  USING (true);

-- Allow admins to insert quizzes
CREATE POLICY "Admins can insert quizzes"
  ON quizzes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Allow admins to update quizzes
CREATE POLICY "Admins can update quizzes"
  ON quizzes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Allow admins to delete quizzes
CREATE POLICY "Admins can delete quizzes"
  ON quizzes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- QUIZ QUESTIONS TABLE POLICIES
-- Allow everyone to view quiz questions
CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions
  FOR SELECT
  USING (true);

-- Allow admins to insert quiz questions
CREATE POLICY "Admins can insert quiz questions"
  ON quiz_questions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Allow admins to update quiz questions
CREATE POLICY "Admins can update quiz questions"
  ON quiz_questions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Allow admins to delete quiz questions
CREATE POLICY "Admins can delete quiz questions"
  ON quiz_questions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quizzes_card_id ON quizzes(card_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_sort_order ON quiz_questions(quiz_id, sort_order);
