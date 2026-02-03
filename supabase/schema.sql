-- Soul Sync Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  membership_level INTEGER DEFAULT 1, -- 1=Free, 2=Plus, 3=Premium
  points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_login DATE,
  last_mood_sync TIMESTAMP WITH TIME ZONE,
  preferred_theme TEXT DEFAULT 'dark-purple',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MOODS TABLE
-- ============================================
CREATE TABLE moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  emoji TEXT,
  color TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default moods
INSERT INTO moods (name, emoji, color, description, sort_order) VALUES
  ('Happy', '😊', '#fbbf24', 'Feeling joyful and content', 1),
  ('Sad', '😢', '#60a5fa', 'Feeling down or melancholic', 2),
  ('Lonely', '🥺', '#a78bfa', 'Feeling isolated or alone', 3),
  ('Anxious', '😰', '#f97316', 'Feeling worried or nervous', 4),
  ('Grateful', '🙏', '#34d399', 'Feeling thankful and blessed', 5),
  ('Angry', '😤', '#ef4444', 'Feeling frustrated or upset', 6);

-- ============================================
-- THEMES TABLE
-- ============================================
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  gradient_from TEXT,
  gradient_to TEXT,
  text_primary TEXT,
  text_secondary TEXT,
  accent_color TEXT,
  active_icon_color TEXT,
  button_bg TEXT,
  button_text TEXT,
  card_bg TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default themes
INSERT INTO themes (name, slug, gradient_from, gradient_to, accent_color, active_icon_color, sort_order) VALUES
  ('Dark Purple', 'dark-purple', '#1a0a2e', '#0f0a1a', '#fbbf24', '#fbbf24', 1),
  ('Pink Pastel', 'pink-pastel', '#2d1f25', '#1a0f14', '#f9a8d4', '#f9a8d4', 2),
  ('Baby Blue', 'baby-blue', '#0c1929', '#0a1420', '#7dd3fc', '#7dd3fc', 3);

-- ============================================
-- CARDS TABLE (Content)
-- ============================================
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('verse', 'devotional', 'article', 'quiz', 'game', 'task', 'journal', 'ad', 'prayer', 'motivational')),
  title TEXT NOT NULL,
  subtitle TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  thumbnail_url TEXT,
  background_url TEXT,
  min_membership_level INTEGER DEFAULT 1,
  points_reward INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_pinned BOOLEAN DEFAULT FALSE,
  pin_position INTEGER,
  pin_start DATE,
  pin_end DATE,
  publish_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CARD-MOOD RELATIONS
-- ============================================
CREATE TABLE card_moods (
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  mood_id UUID REFERENCES moods(id) ON DELETE CASCADE,
  weight INTEGER DEFAULT 1, -- Higher = more likely to appear for this mood
  PRIMARY KEY (card_id, mood_id)
);

-- ============================================
-- USER MOOD LOGS
-- ============================================
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mood_id UUID REFERENCES moods(id) ON DELETE SET NULL,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER CARD INTERACTIONS
-- ============================================
CREATE TABLE card_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  interaction_type TEXT CHECK (interaction_type IN ('view', 'like', 'share', 'complete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DAILY FEED CACHE
-- ============================================
CREATE TABLE daily_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  position INTEGER,
  feed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- QUIZZES
-- ============================================
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER, -- seconds
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- QUIZ QUESTIONS
-- ============================================
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer INTEGER,
  explanation TEXT,
  points INTEGER DEFAULT 10,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MINI GAMES
-- ============================================
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  html_content TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  instructions TEXT,
  max_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TASKS
-- ============================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  task_type TEXT CHECK (task_type IN ('daily', 'weekly', 'challenge')),
  description TEXT,
  points_reward INTEGER DEFAULT 10,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER TASKS PROGRESS
-- ============================================
CREATE TABLE user_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- REWARDS
-- ============================================
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('daily_login', 'streak', 'milestone', 'share', 'task')),
  name TEXT NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0,
  message TEXT,
  icon TEXT,
  trigger_value INTEGER, -- e.g., streak day 7, milestone 1000 points
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default rewards
INSERT INTO rewards (type, name, description, points, message, trigger_value) VALUES
  ('daily_login', 'Daily Login', 'Login to earn points', 10, 'Welcome back! +10 points', NULL),
  ('streak', '3-Day Streak', 'Login 3 days in a row', 25, 'Amazing! 3-day streak! +25 points', 3),
  ('streak', '7-Day Streak', 'Login 7 days in a row', 50, 'Incredible! 1 week streak! +50 points', 7),
  ('streak', '14-Day Streak', 'Login 14 days in a row', 100, 'Unstoppable! 2 week streak! +100 points', 14),
  ('streak', '30-Day Streak', 'Login 30 days in a row', 250, 'Legendary! 1 month streak! +250 points', 30),
  ('milestone', '100 Points', 'Earn 100 total points', 20, 'First milestone! +20 bonus points', 100),
  ('milestone', '500 Points', 'Earn 500 total points', 50, 'Rising star! +50 bonus points', 500),
  ('milestone', '1000 Points', 'Earn 1000 total points', 100, 'Champion! +100 bonus points', 1000);

-- ============================================
-- USER REWARDS
-- ============================================
CREATE TABLE user_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MEMBERSHIP PLANS
-- ============================================
CREATE TABLE membership_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_price_id TEXT UNIQUE,
  name TEXT NOT NULL,
  level INTEGER NOT NULL, -- 1, 2, 3
  price DECIMAL(10,2),
  interval TEXT CHECK (interval IN ('month', 'year')),
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default plans
INSERT INTO membership_plans (name, level, price, interval, features, stripe_price_id) VALUES
  ('Free', 1, 0, 'month', '["Basic content", "Daily verses", "Limited quizzes"]', NULL),
  ('Plus', 2, 4.99, 'month', '["All free features", "Premium devotionals", "All quizzes", "No ads"]', NULL),
  ('Premium', 3, 9.99, 'month', '["All Plus features", "Exclusive content", "Priority support", "AR features"]', NULL);

-- ============================================
-- USER SUBSCRIPTIONS
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan_id UUID REFERENCES membership_plans(id),
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CHAT MESSAGES
-- ============================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- AI CONTENT DRAFTS (Admin)
-- ============================================
CREATE TABLE ai_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT,
  prompt TEXT,
  generated_content JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_drafts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Public read access for moods, themes, cards, rewards, membership plans
CREATE POLICY "Anyone can view active moods" ON moods FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active themes" ON themes FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active cards" ON cards FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view card moods" ON card_moods FOR SELECT USING (true);
CREATE POLICY "Anyone can view active rewards" ON rewards FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active plans" ON membership_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Anyone can view quiz questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can view games" ON games FOR SELECT USING (true);
CREATE POLICY "Anyone can view tasks" ON tasks FOR SELECT USING (true);

-- User-specific data policies
CREATE POLICY "Users can manage own mood logs" ON mood_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own interactions" ON card_interactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own daily feed" ON daily_feed FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own task progress" ON user_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own rewards" ON user_rewards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own subscription" ON subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own chat messages" ON chat_messages FOR ALL USING (auth.uid() = user_id);

-- Admin policies (check is_admin in profiles)
CREATE POLICY "Admins can manage all content" ON cards FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage moods" ON moods FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage themes" ON themes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage ai drafts" ON ai_drafts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_cards_type ON cards(type);
CREATE INDEX idx_cards_is_active ON cards(is_active);
CREATE INDEX idx_cards_publish_date ON cards(publish_date);
CREATE INDEX idx_card_moods_mood_id ON card_moods(mood_id);
CREATE INDEX idx_mood_logs_user_id ON mood_logs(user_id);
CREATE INDEX idx_mood_logs_logged_at ON mood_logs(logged_at);
CREATE INDEX idx_card_interactions_user_id ON card_interactions(user_id);
CREATE INDEX idx_card_interactions_card_id ON card_interactions(card_id);
CREATE INDEX idx_daily_feed_user_date ON daily_feed(user_id, feed_date);
CREATE INDEX idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);

-- ============================================
-- SAMPLE CONTENT (Optional)
-- ============================================

-- Insert sample cards
INSERT INTO cards (type, title, subtitle, content, points_reward) VALUES
  ('verse', 'Daily Verse', 'Jeremiah 29:11', '{"verse_text": "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", "verse_reference": "Jeremiah 29:11"}', 5),
  ('devotional', 'Finding Peace', 'A moment of reflection', '{"body": "In times of uncertainty, it is easy to feel overwhelmed. But remember, every storm eventually passes. Take a deep breath, center yourself in faith, and trust that you are being guided toward better days.", "author": "Soul Sync Team", "read_time": 2}', 10),
  ('prayer', 'Morning Prayer', 'Start your day right', '{"prayer_text": "Dear Lord, thank you for this new day. Guide my thoughts, words, and actions. Help me to be a light to others and to walk in your ways."}', 5),
  ('motivational', 'Daily Inspiration', 'Stay motivated', '{"quote": "The only way to do great work is to love what you do.", "quote_author": "Steve Jobs"}', 5),
  ('task', 'Practice Gratitude', 'A daily challenge', '{"description": "Write down 3 things you are grateful for today"}', 15);

-- Link cards to moods (all cards visible for all moods with default weight)
INSERT INTO card_moods (card_id, mood_id, weight)
SELECT c.id, m.id, 1
FROM cards c
CROSS JOIN moods m;
