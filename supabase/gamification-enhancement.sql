-- ============================================
-- SOUL SYNC GAMIFICATION ENHANCEMENT
-- Run this after the main schema.sql
-- ============================================

-- ============================================
-- ENHANCE PROFILES TABLE
-- ============================================
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_shares INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS consecutive_logins INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login_date DATE,
ADD COLUMN IF NOT EXISTS weekend_bonus_claimed_this_week BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS perfect_week_eligible BOOLEAN DEFAULT TRUE;

-- Generate referral codes for existing users
UPDATE profiles SET referral_code = CONCAT('SS', UPPER(SUBSTRING(MD5(id::text) FROM 1 FOR 8))) WHERE referral_code IS NULL;

-- ============================================
-- LEVELS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS levels (
  id SERIAL PRIMARY KEY,
  level_number INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  xp_required INTEGER NOT NULL,
  points_reward INTEGER DEFAULT 0,
  badge_icon TEXT,
  perks JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default levels (1-50)
INSERT INTO levels (level_number, name, xp_required, points_reward, badge_icon) VALUES
  (1, 'Seeker', 0, 0, '🌱'),
  (2, 'Believer', 100, 50, '✨'),
  (3, 'Faithful', 250, 75, '🙏'),
  (4, 'Devoted', 500, 100, '💫'),
  (5, 'Blessed', 800, 150, '🌟'),
  (6, 'Radiant', 1200, 200, '💎'),
  (7, 'Enlightened', 1700, 250, '🔥'),
  (8, 'Warrior', 2300, 300, '⚔️'),
  (9, 'Champion', 3000, 400, '🏆'),
  (10, 'Legendary', 4000, 500, '👑'),
  (11, 'Master', 5200, 600, '🎯'),
  (12, 'Sage', 6600, 700, '📿'),
  (13, 'Prophet', 8200, 800, '📖'),
  (14, 'Saint', 10000, 1000, '😇'),
  (15, 'Guardian', 12000, 1200, '🛡️'),
  (16, 'Protector', 14500, 1400, '🗡️'),
  (17, 'Defender', 17500, 1600, '⚡'),
  (18, 'Crusader', 21000, 1800, '🏰'),
  (19, 'Paladin', 25000, 2000, '🎖️'),
  (20, 'Divine', 30000, 2500, '✝️'),
  (21, 'Celestial', 36000, 3000, '☀️'),
  (22, 'Eternal', 43000, 3500, '🌙'),
  (23, 'Transcendent', 51000, 4000, '🌈'),
  (24, 'Ascended', 60000, 4500, '🕊️'),
  (25, 'Immortal', 70000, 5000, '👼');

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('streak', 'social', 'content', 'milestone', 'special')),
  name TEXT NOT NULL,
  description TEXT,
  requirement_type TEXT CHECK (requirement_type IN ('streak_days', 'total_shares', 'total_points', 'cards_completed', 'moods_logged', 'chat_messages', 'referrals', 'level_reached', 'special')),
  requirement_value INTEGER,
  xp_reward INTEGER DEFAULT 0,
  points_reward INTEGER DEFAULT 0,
  badge_icon TEXT,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert achievements
INSERT INTO achievements (category, name, description, requirement_type, requirement_value, xp_reward, points_reward, badge_icon, rarity, sort_order) VALUES
  -- Streak achievements
  ('streak', 'First Steps', 'Login 3 days in a row', 'streak_days', 3, 50, 25, '🔥', 'common', 1),
  ('streak', 'Week Warrior', 'Login 7 days in a row', 'streak_days', 7, 100, 50, '💪', 'common', 2),
  ('streak', 'Fortnight Fighter', 'Login 14 days in a row', 'streak_days', 14, 200, 100, '🛡️', 'rare', 3),
  ('streak', 'Monthly Master', 'Login 30 days in a row', 'streak_days', 30, 500, 250, '👑', 'epic', 4),
  ('streak', 'Eternal Flame', 'Login 60 days in a row', 'streak_days', 60, 1000, 500, '🔥', 'epic', 5),
  ('streak', 'Century Soul', 'Login 100 days in a row', 'streak_days', 100, 2000, 1000, '💎', 'legendary', 6),

  -- Social achievements
  ('social', 'Sharer', 'Share 5 cards', 'total_shares', 5, 30, 20, '📤', 'common', 10),
  ('social', 'Influencer', 'Share 25 cards', 'total_shares', 25, 100, 50, '📱', 'rare', 11),
  ('social', 'Evangelist', 'Share 100 cards', 'total_shares', 100, 300, 150, '📢', 'epic', 12),
  ('social', 'Ambassador', 'Refer 3 friends', 'referrals', 3, 200, 100, '🤝', 'rare', 13),
  ('social', 'Community Leader', 'Refer 10 friends', 'referrals', 10, 500, 300, '🌍', 'epic', 14),

  -- Content achievements
  ('content', 'Curious Mind', 'Complete 10 cards', 'cards_completed', 10, 50, 25, '📚', 'common', 20),
  ('content', 'Knowledge Seeker', 'Complete 50 cards', 'cards_completed', 50, 150, 75, '📖', 'rare', 21),
  ('content', 'Wisdom Collector', 'Complete 200 cards', 'cards_completed', 200, 400, 200, '🎓', 'epic', 22),
  ('content', 'Mood Tracker', 'Log 30 different moods', 'moods_logged', 30, 100, 50, '😊', 'common', 23),
  ('content', 'Emotional Intelligence', 'Log 100 different moods', 'moods_logged', 100, 300, 150, '🧠', 'rare', 24),
  ('content', 'Chat Enthusiast', 'Send 50 chat messages', 'chat_messages', 50, 100, 50, '💬', 'common', 25),
  ('content', 'Soul Companion', 'Send 200 chat messages', 'chat_messages', 200, 300, 150, '🤗', 'rare', 26),

  -- Milestone achievements
  ('milestone', 'Rising Star', 'Reach 500 total points', 'total_points', 500, 100, 50, '⭐', 'common', 30),
  ('milestone', 'Shining Bright', 'Reach 2000 total points', 'total_points', 2000, 300, 150, '🌟', 'rare', 31),
  ('milestone', 'Superstar', 'Reach 5000 total points', 'total_points', 5000, 600, 300, '✨', 'epic', 32),
  ('milestone', 'Legend', 'Reach 10000 total points', 'total_points', 10000, 1200, 600, '💫', 'legendary', 33),
  ('milestone', 'Level 5', 'Reach level 5', 'level_reached', 5, 100, 50, '🎯', 'common', 34),
  ('milestone', 'Level 10', 'Reach level 10', 'level_reached', 10, 300, 150, '🏆', 'rare', 35),
  ('milestone', 'Level 20', 'Reach level 20', 'level_reached', 20, 800, 400, '👑', 'epic', 36),
  ('milestone', 'Level 25', 'Reach level 25', 'level_reached', 25, 1500, 750, '💎', 'legendary', 37),

  -- Special achievements
  ('special', 'Early Bird', 'Login before 6 AM', 'special', 1, 50, 25, '🌅', 'rare', 40),
  ('special', 'Night Owl', 'Login after 11 PM', 'special', 1, 50, 25, '🦉', 'rare', 41),
  ('special', 'Weekend Warrior', 'Claim 10 weekend bonuses', 'special', 10, 200, 100, '🎉', 'rare', 42),
  ('special', 'Perfect Week', 'Login every day for a week', 'special', 1, 150, 75, '🏅', 'epic', 43);

-- ============================================
-- USER ACHIEVEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  requirement_text TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert badges
INSERT INTO badges (name, description, icon, color, requirement_text) VALUES
  ('Newcomer', 'Joined Soul Sync', '👋', '#60a5fa', 'Create an account'),
  ('First Sync', 'Selected first mood', '🎯', '#fbbf24', 'Sync your mood'),
  ('3-Day Streak', 'Login 3 days in a row', '🔥', '#f97316', 'Login 3 days in a row'),
  ('7-Day Streak', 'Login 7 days in a row', '💪', '#ef4444', 'Login 7 days in a row'),
  ('30-Day Streak', 'Login 30 days in a row', '👑', '#a855f7', 'Login 30 days in a row'),
  ('Social Butterfly', 'Share 10 cards', '🦋', '#ec4899', 'Share 10 cards'),
  ('Content Creator', 'Complete 50 cards', '✍️', '#10b981', 'Complete 50 cards'),
  ('Level 5', 'Reach level 5', '🎯', '#3b82f6', 'Reach level 5'),
  ('Level 10', 'Reach level 10', '🏆', '#8b5cf6', 'Reach level 10'),
  ('Referral Master', 'Refer 5 friends', '🤝', '#f59e0b', 'Refer 5 friends'),
  ('Weekend Warrior', 'Login on 10 weekends', '🎉', '#06b6d4', 'Login on 10 weekends'),
  ('Perfect Week', 'Login every day for a week', '🏅', '#84cc16', 'Login every day for a week');

-- ============================================
-- USER BADGES
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================
-- DAILY CHALLENGES
-- ============================================
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_date DATE UNIQUE NOT NULL,
  challenge_type TEXT CHECK (challenge_type IN ('mood_sync', 'share_card', 'complete_task', 'chat_message', 'streak_maintain', 'quiz_perfect')),
  title TEXT NOT NULL,
  description TEXT,
  requirement_count INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 50,
  points_reward INTEGER DEFAULT 25,
  multiplier DECIMAL(3,2) DEFAULT 1.5,
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER DAILY CHALLENGES
-- ============================================
CREATE TABLE IF NOT EXISTS user_daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- ============================================
-- BONUS EVENTS
-- ============================================
CREATE TABLE IF NOT EXISTS bonus_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT CHECK (event_type IN ('weekend_bonus', 'perfect_week', 'mood_variety', 'social_surge', 'content_sprint', 'holiday_special')),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  multiplier DECIMAL(3,2) DEFAULT 2.0,
  bonus_points INTEGER DEFAULT 100,
  bonus_xp INTEGER DEFAULT 50,
  requirements JSONB DEFAULT '{}',
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert recurring bonus events
INSERT INTO bonus_events (event_type, name, description, multiplier, bonus_points, bonus_xp, icon) VALUES
  ('weekend_bonus', 'Weekend Warrior Bonus', 'Login on Saturday or Sunday for bonus rewards', 1.5, 50, 25, '🎉'),
  ('perfect_week', 'Perfect Week Bonus', 'Login every day this week for a massive bonus', 2.0, 200, 100, '🏅'),
  ('mood_variety', 'Mood Explorer Bonus', 'Log 5 different moods this week', 1.3, 75, 40, '🌈');

-- ============================================
-- SHARE TRACKING
-- ============================================
CREATE TABLE IF NOT EXISTS share_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  platform TEXT CHECK (platform IN ('facebook', 'twitter', 'whatsapp', 'instagram', 'copy_link', 'other')),
  referral_code TEXT,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- XP TRANSACTIONS LOG
-- ============================================
CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('daily_login', 'streak', 'share', 'complete', 'achievement', 'level_up', 'challenge', 'bonus_event', 'referral')),
  source_id UUID,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- POINTS TRANSACTIONS LOG (Enhanced)
-- ============================================
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('daily_login', 'streak', 'share', 'complete', 'achievement', 'level_up', 'challenge', 'bonus_event', 'referral', 'milestone')),
  source_id UUID,
  description TEXT,
  multiplier DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LEADERBOARDS (Enhanced)
-- ============================================
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  snapshot_date DATE NOT NULL,
  leaderboard_type TEXT CHECK (leaderboard_type IN ('all_time', 'weekly', 'monthly')),
  rankings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(snapshot_date, leaderboard_type)
);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view levels" ON levels FOR SELECT USING (true);
CREATE POLICY "Anyone can view active achievements" ON achievements FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active daily challenges" ON daily_challenges FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active bonus events" ON bonus_events FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view leaderboard snapshots" ON leaderboard_snapshots FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own challenges" ON user_daily_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own shares" ON share_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own XP transactions" ON xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own points transactions" ON points_transactions FOR SELECT USING (auth.uid() = user_id);

-- Insert policies
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own achievements" ON user_achievements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert own challenges" ON user_daily_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own challenges" ON user_daily_challenges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shares" ON share_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert own XP transactions" ON xp_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert own points transactions" ON points_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can manage levels" ON levels FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage achievements" ON achievements FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage badges" ON badges FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage daily challenges" ON daily_challenges FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage bonus events" ON bonus_events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_completed ON user_achievements(completed);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_daily_challenges_date ON daily_challenges(challenge_date);
CREATE INDEX idx_user_daily_challenges_user_id ON user_daily_challenges(user_id);
CREATE INDEX idx_user_daily_challenges_completed ON user_daily_challenges(completed);
CREATE INDEX idx_share_tracking_user_id ON share_tracking(user_id);
CREATE INDEX idx_share_tracking_shared_at ON share_tracking(shared_at);
CREATE INDEX idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX idx_profiles_level ON profiles(level);
CREATE INDEX idx_profiles_xp ON profiles(xp);
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to calculate user level from XP
CREATE OR REPLACE FUNCTION calculate_level(user_xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  user_level INTEGER;
BEGIN
  SELECT COALESCE(MAX(level_number), 1)
  INTO user_level
  FROM levels
  WHERE xp_required <= user_xp;

  RETURN user_level;
END;
$$ LANGUAGE plpgsql;

-- Function to add XP and update level
CREATE OR REPLACE FUNCTION add_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_source TEXT,
  p_source_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS TABLE(new_xp INTEGER, new_level INTEGER, level_up BOOLEAN) AS $$
DECLARE
  old_level INTEGER;
  new_level INTEGER;
  current_xp INTEGER;
  new_xp_total INTEGER;
  did_level_up BOOLEAN := FALSE;
BEGIN
  -- Get current XP and level
  SELECT xp, level INTO current_xp, old_level FROM profiles WHERE id = p_user_id;

  -- Calculate new XP
  new_xp_total := current_xp + p_amount;

  -- Calculate new level
  new_level := calculate_level(new_xp_total);

  -- Check if leveled up
  IF new_level > old_level THEN
    did_level_up := TRUE;
  END IF;

  -- Update profile
  UPDATE profiles
  SET xp = new_xp_total, level = new_level, updated_at = NOW()
  WHERE id = p_user_id;

  -- Log transaction
  INSERT INTO xp_transactions (user_id, amount, source, source_id, description)
  VALUES (p_user_id, p_amount, p_source, p_source_id, p_description);

  -- Return results
  RETURN QUERY SELECT new_xp_total, new_level, did_level_up;
END;
$$ LANGUAGE plpgsql;

-- Function to add points with multiplier
CREATE OR REPLACE FUNCTION add_points(
  p_user_id UUID,
  p_amount INTEGER,
  p_source TEXT,
  p_multiplier DECIMAL(3,2) DEFAULT 1.0,
  p_source_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  final_amount INTEGER;
  current_points INTEGER;
BEGIN
  -- Calculate final amount with multiplier
  final_amount := FLOOR(p_amount * p_multiplier);

  -- Update profile
  UPDATE profiles
  SET points = points + final_amount, updated_at = NOW()
  WHERE id = p_user_id
  RETURNING points INTO current_points;

  -- Log transaction
  INSERT INTO points_transactions (user_id, amount, source, source_id, description, multiplier)
  VALUES (p_user_id, final_amount, p_source, p_source_id, p_description, p_multiplier);

  RETURN final_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS TABLE(achievement_id UUID, achievement_name TEXT) AS $$
BEGIN
  -- This is a placeholder - achievements will be checked in application logic
  -- Returns newly completed achievements
  RETURN QUERY
  SELECT a.id, a.name
  FROM achievements a
  JOIN user_achievements ua ON a.id = ua.achievement_id
  WHERE ua.user_id = p_user_id
    AND ua.completed = TRUE
    AND ua.completed_at > NOW() - INTERVAL '1 minute';
END;
$$ LANGUAGE plpgsql;

-- Function to check weekend bonus eligibility
CREATE OR REPLACE FUNCTION is_weekend_bonus_eligible(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_weekend BOOLEAN;
  already_claimed BOOLEAN;
BEGIN
  -- Check if today is weekend
  is_weekend := EXTRACT(DOW FROM CURRENT_DATE) IN (0, 6);

  IF NOT is_weekend THEN
    RETURN FALSE;
  END IF;

  -- Check if already claimed this week
  SELECT weekend_bonus_claimed_this_week INTO already_claimed
  FROM profiles
  WHERE id = p_user_id;

  RETURN NOT already_claimed;
END;
$$ LANGUAGE plpgsql;

-- Trigger to reset weekly bonuses
CREATE OR REPLACE FUNCTION reset_weekly_bonuses()
RETURNS void AS $$
BEGIN
  -- Reset on Monday
  IF EXTRACT(DOW FROM CURRENT_DATE) = 1 THEN
    UPDATE profiles
    SET weekend_bonus_claimed_this_week = FALSE,
        perfect_week_eligible = TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS
-- ============================================

-- View for user gamification stats
CREATE OR REPLACE VIEW user_gamification_stats AS
SELECT
  p.id,
  p.username,
  p.display_name,
  p.level,
  p.xp,
  p.points,
  p.current_streak,
  p.longest_streak,
  p.total_shares,
  p.total_referrals,
  (SELECT COUNT(*) FROM user_achievements WHERE user_id = p.id AND completed = TRUE) as achievements_count,
  (SELECT COUNT(*) FROM user_badges WHERE user_id = p.id) as badges_count,
  (SELECT level_number FROM levels WHERE level_number = p.level) as current_level_number,
  (SELECT name FROM levels WHERE level_number = p.level) as current_level_name,
  (SELECT xp_required FROM levels WHERE level_number = p.level + 1) as next_level_xp,
  p.created_at
FROM profiles p;

-- View for achievement progress
CREATE OR REPLACE VIEW achievement_progress AS
SELECT
  ua.user_id,
  a.id as achievement_id,
  a.name,
  a.description,
  a.category,
  a.rarity,
  a.requirement_type,
  a.requirement_value,
  ua.progress,
  ua.completed,
  ua.completed_at,
  a.xp_reward,
  a.points_reward,
  a.badge_icon,
  CASE
    WHEN a.requirement_value > 0 THEN (ua.progress::DECIMAL / a.requirement_value * 100)
    ELSE 100
  END as progress_percentage
FROM user_achievements ua
JOIN achievements a ON ua.achievement_id = a.id;

-- ============================================
-- SAMPLE DATA FOR NEW USERS
-- ============================================

-- Function to initialize new user gamification
CREATE OR REPLACE FUNCTION initialize_user_gamification()
RETURNS TRIGGER AS $$
BEGIN
  -- Give newcomer badge
  INSERT INTO user_badges (user_id, badge_id)
  SELECT NEW.id, id FROM badges WHERE name = 'Newcomer'
  ON CONFLICT DO NOTHING;

  -- Initialize all achievements with 0 progress
  INSERT INTO user_achievements (user_id, achievement_id, progress, completed)
  SELECT NEW.id, id, 0, FALSE
  FROM achievements
  WHERE is_active = TRUE
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_user_gamification_init
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION initialize_user_gamification();

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE levels IS 'User level definitions with XP requirements';
COMMENT ON TABLE achievements IS 'Unlockable achievements with progress tracking';
COMMENT ON TABLE badges IS 'Visual badges for accomplishments';
COMMENT ON TABLE daily_challenges IS 'Daily challenges with bonus rewards';
COMMENT ON TABLE bonus_events IS 'Special events with point multipliers';
COMMENT ON TABLE share_tracking IS 'Track social shares and referrals';
COMMENT ON TABLE xp_transactions IS 'Audit log of all XP gains';
COMMENT ON TABLE points_transactions IS 'Audit log of all point gains with multipliers';
COMMENT ON FUNCTION add_xp IS 'Add XP to user and check for level ups';
COMMENT ON FUNCTION add_points IS 'Add points to user with optional multiplier';
