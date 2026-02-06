-- ============================================
-- MIGRATION: Content Categories & Extended Card Types
-- ============================================

-- 1. Drop and recreate the type CHECK constraint on cards to support new types
ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_type_check;
ALTER TABLE cards ADD CONSTRAINT cards_type_check CHECK (
  type IN (
    'verse', 'devotional', 'article', 'quiz', 'game', 'task', 'journal', 'ad',
    'prayer', 'motivational', 'meme', 'fact', 'riddle', 'joke',
    'thought_provoking', 'visual', 'share_card', 'marketing', 'milestone',
    'upgrade', 'journal_prompt'
  )
);

-- 2. Add new columns to cards table
ALTER TABLE cards ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS featured_start DATE;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS featured_end DATE;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS category_id UUID;

-- 3. Create content_categories table (drop first if leftover from partial run)
ALTER TABLE cards DROP CONSTRAINT IF EXISTS fk_cards_category;
DROP TABLE IF EXISTS card_categories;
DROP TABLE IF EXISTS content_categories;

CREATE TABLE content_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  emoji TEXT,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  gradient_from TEXT DEFAULT '#6366f1',
  gradient_to TEXT DEFAULT '#8b5cf6',
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create card_categories junction table (many-to-many)
CREATE TABLE card_categories (
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  category_id UUID REFERENCES content_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (card_id, category_id)
);

-- 5. Add FK from cards.category_id to content_categories (skip if already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_cards_category' AND table_name = 'cards'
  ) THEN
    ALTER TABLE cards ADD CONSTRAINT fk_cards_category
      FOREIGN KEY (category_id) REFERENCES content_categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 6. Enable RLS
ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_categories ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (drop first to avoid "already exists" errors on re-run)
DROP POLICY IF EXISTS "Anyone can view active categories" ON content_categories;
CREATE POLICY "Anyone can view active categories"
  ON content_categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON content_categories;
CREATE POLICY "Admins can manage categories"
  ON content_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "Anyone can view card categories" ON card_categories;
CREATE POLICY "Anyone can view card categories"
  ON card_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage card categories" ON card_categories;
CREATE POLICY "Admins can manage card categories"
  ON card_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 8. Indexes
CREATE INDEX IF NOT EXISTS idx_cards_category_id ON cards(category_id);
CREATE INDEX IF NOT EXISTS idx_cards_is_featured ON cards(is_featured);
CREATE INDEX IF NOT EXISTS idx_cards_is_trending ON cards(is_trending);
CREATE INDEX IF NOT EXISTS idx_card_categories_category_id ON card_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_content_categories_slug ON content_categories(slug);

-- 9. Insert the 12 default content categories
INSERT INTO content_categories (name, slug, display_name, emoji, description, color, gradient_from, gradient_to, icon_name, sort_order) VALUES
  ('games', 'arena', 'Arena', '🎮', 'Fun mini games to play and compete', '#f97316', '#f97316', '#ef4444', 'Gamepad2', 1),
  ('quizzes', 'mind-quests', 'Mind Quests', '🧠', 'Test your knowledge with quizzes', '#ec4899', '#ec4899', '#a855f7', 'Brain', 2),
  ('memes', 'joy-moments', 'Joy Moments', '😄', 'Lighten up with fun memes', '#fbbf24', '#fbbf24', '#f97316', 'Smile', 3),
  ('share_cards', 'share-cards', 'Share Cards', '💌', 'Beautiful cards to share with others', '#f472b6', '#f472b6', '#e879f9', 'Share2', 4),
  ('articles', 'insights', 'Insights', '📖', 'Deep articles and devotionals', '#3b82f6', '#3b82f6', '#6366f1', 'BookOpen', 5),
  ('thought_provoking', 'deep-dive', 'Deep Dive', '💭', 'Thought provoking content', '#8b5cf6', '#8b5cf6', '#6366f1', 'Lightbulb', 6),
  ('visuals', 'calm-corner', 'Calm Corner', '🧘', 'Visual relaxation and calm content', '#10b981', '#10b981', '#14b8a6', 'Eye', 7),
  ('facts', 'gems', 'Gems', '💎', 'Interesting and inspiring facts', '#06b6d4', '#06b6d4', '#3b82f6', 'Diamond', 8),
  ('riddles', 'enigmas', 'Enigmas', '🧩', 'Brain teasers and riddles', '#a855f7', '#a855f7', '#ec4899', 'Puzzle', 9),
  ('jokes', 'light-hearts', 'Light Hearts', '😊', 'Clean jokes to brighten your day', '#f59e0b', '#f59e0b', '#fbbf24', 'Heart', 10),
  ('journal', 'reflections', 'Reflections', '✨', 'Journal prompts and reflections', '#6366f1', '#6366f1', '#8b5cf6', 'PenTool', 11),
  ('prayers', 'boosts', 'Boosts', '🙏', 'Prayers for protection, guidance and more', '#34d399', '#34d399', '#10b981', 'Sparkles', 12)
ON CONFLICT (slug) DO NOTHING;

-- 10. Create journal_entries table for user journal posts (drop first if leftover from partial run)
DROP TABLE IF EXISTS journal_entries;

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  mood_id UUID REFERENCES moods(id) ON DELETE SET NULL,
  is_private BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own journal entries" ON journal_entries;
CREATE POLICY "Users can manage own journal entries"
  ON journal_entries FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
