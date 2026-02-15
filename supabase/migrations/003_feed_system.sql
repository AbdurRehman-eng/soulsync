-- ============================================
-- Feed System Enhancement Migration
-- Adds: feed_patterns, user_seen_content, daily_quiz_candidates
-- Updates: cards type CHECK constraint to include new types
-- ============================================

-- 1. Update cards type CHECK constraint to include new types
ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_type_check;
ALTER TABLE cards ADD CONSTRAINT cards_type_check CHECK (
  type IN (
    'verse', 'devotional', 'article', 'quiz', 'game', 'task', 'journal', 'ad',
    'prayer', 'motivational', 'inspiration', 'meme', 'fact', 'riddle', 'joke',
    'thought_provoking', 'visual', 'share_card', 'marketing', 'milestone',
    'upgrade', 'journal_prompt', 'pause'
  )
);

-- 2. Feed Patterns table (admin-editable A/B/C patterns for slots 5-19)
CREATE TABLE IF NOT EXISTS feed_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  -- slots is an array of 15 card type strings for positions 5-19
  slots JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default feed patterns (A, B, C)
INSERT INTO feed_patterns (name, slug, slots, sort_order) VALUES
(
  'Pattern A - Energy Focus Uplift Reflect',
  'pattern-a',
  '["game", "inspiration", "article", "riddle", "motivation", "visual", "joke", "milestone", "inspiration", "thought_provoking", "fact", "meme", "game", "riddle", "motivation"]',
  1
),
(
  'Pattern B - Calm Build Engage Inspire',
  'pattern-b',
  '["visual", "motivation", "game", "fact", "inspiration", "article", "riddle", "milestone", "joke", "meme", "thought_provoking", "inspiration", "game", "motivation", "visual"]',
  2
),
(
  'Pattern C - Social Learn Play Reflect',
  'pattern-c',
  '["meme", "article", "riddle", "inspiration", "game", "thought_provoking", "motivation", "milestone", "fact", "visual", "joke", "game", "inspiration", "riddle", "motivation"]',
  3
);

-- 3. User Seen Content table (tracks cooldown periods)
CREATE TABLE IF NOT EXISTS user_seen_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  card_type TEXT NOT NULL,
  seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

CREATE INDEX IF NOT EXISTS idx_user_seen_content_user ON user_seen_content(user_id);
CREATE INDEX IF NOT EXISTS idx_user_seen_content_user_type ON user_seen_content(user_id, card_type);
CREATE INDEX IF NOT EXISTS idx_user_seen_content_seen_at ON user_seen_content(seen_at);

-- 4. Daily Quiz Candidates table
CREATE TABLE IF NOT EXISTS daily_quiz_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  scheduled_date DATE, -- NULL means it's in the general candidate pool
  is_candidate BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(card_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_quiz_scheduled ON daily_quiz_candidates(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_daily_quiz_candidate ON daily_quiz_candidates(is_candidate);

-- 5. Pause Cards table (editable pause cards with scheduling)
CREATE TABLE IF NOT EXISTS pause_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT FALSE,
  active_start DATE, -- NULL = always available
  active_end DATE,   -- NULL = no end date
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(card_id)
);

CREATE INDEX IF NOT EXISTS idx_pause_cards_default ON pause_cards(is_default);
CREATE INDEX IF NOT EXISTS idx_pause_cards_dates ON pause_cards(active_start, active_end);

-- 6. RLS Policies for new tables
ALTER TABLE feed_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_seen_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quiz_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pause_cards ENABLE ROW LEVEL SECURITY;

-- Feed patterns: anyone can read, admins can manage
CREATE POLICY "Anyone can view active feed patterns" ON feed_patterns
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage feed patterns" ON feed_patterns
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- User seen content: users can manage their own
CREATE POLICY "Users can manage own seen content" ON user_seen_content
  FOR ALL USING (auth.uid() = user_id);

-- Daily quiz candidates: anyone can read, admins can manage
CREATE POLICY "Anyone can view quiz candidates" ON daily_quiz_candidates
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage quiz candidates" ON daily_quiz_candidates
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Pause cards: anyone can read, admins can manage
CREATE POLICY "Anyone can view pause cards" ON pause_cards
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage pause cards" ON pause_cards
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- 7. Add sort_order to tasks table if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE tasks ADD COLUMN sort_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- 8. Trigger for feed_patterns updated_at
CREATE TRIGGER update_feed_patterns_updated_at
  BEFORE UPDATE ON feed_patterns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
