-- ============================================
-- APP SETTINGS TABLE
-- Store admin-configurable application settings
-- ============================================

CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  value_type TEXT DEFAULT 'string' CHECK (value_type IN ('string', 'number', 'boolean', 'json')),
  category TEXT DEFAULT 'general',
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can view settings" ON app_settings FOR SELECT USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can manage settings" ON app_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create index for faster lookups
CREATE INDEX idx_app_settings_key ON app_settings(key);
CREATE INDEX idx_app_settings_category ON app_settings(category);

-- Insert default gamification settings
INSERT INTO app_settings (key, value, value_type, category, description) VALUES
  ('daily_login_points', '10', 'number', 'gamification', 'Base points awarded for daily login'),
  ('daily_login_xp', '20', 'number', 'gamification', 'Base XP awarded for daily login'),
  ('streak_bonus_points', '5', 'number', 'gamification', 'Additional points per streak day'),
  ('weekend_bonus_points', '50', 'number', 'gamification', 'Bonus points for weekend login'),
  ('weekend_bonus_xp', '25', 'number', 'gamification', 'Bonus XP for weekend login'),
  ('share_points', '5', 'number', 'gamification', 'Points awarded for sharing content'),
  ('share_xp', '10', 'number', 'gamification', 'XP awarded for sharing content'),
  ('default_card_points', '10', 'number', 'gamification', 'Default points for card interactions'),
  ('default_membership_level', '1', 'number', 'general', 'Default membership level for new users'),
  ('streak_multiplier_threshold', '7', 'number', 'gamification', 'Days after which streak multiplier increases'),
  ('streak_multiplier_increment', '0.1', 'number', 'gamification', 'Multiplier increment per threshold'),

  -- Streak milestone rewards
  ('streak_3_days_points', '25', 'number', 'gamification', 'Points for 3-day streak milestone'),
  ('streak_3_days_xp', '50', 'number', 'gamification', 'XP for 3-day streak milestone'),
  ('streak_7_days_points', '50', 'number', 'gamification', 'Points for 7-day streak milestone'),
  ('streak_7_days_xp', '100', 'number', 'gamification', 'XP for 7-day streak milestone'),
  ('streak_14_days_points', '100', 'number', 'gamification', 'Points for 14-day streak milestone'),
  ('streak_14_days_xp', '200', 'number', 'gamification', 'XP for 14-day streak milestone'),
  ('streak_30_days_points', '250', 'number', 'gamification', 'Points for 30-day streak milestone'),
  ('streak_30_days_xp', '500', 'number', 'gamification', 'XP for 30-day streak milestone'),
  ('streak_60_days_points', '500', 'number', 'gamification', 'Points for 60-day streak milestone'),
  ('streak_60_days_xp', '1000', 'number', 'gamification', 'XP for 60-day streak milestone'),
  ('streak_100_days_points', '1000', 'number', 'gamification', 'Points for 100-day streak milestone'),
  ('streak_100_days_xp', '2000', 'number', 'gamification', 'XP for 100-day streak milestone'),

  -- Perfect week bonus
  ('perfect_week_points', '200', 'number', 'gamification', 'Bonus points for logging in 7 days straight'),
  ('perfect_week_xp', '100', 'number', 'gamification', 'Bonus XP for logging in 7 days straight'),

  -- Comeback bonus (after streak broken)
  ('comeback_bonus_points', '30', 'number', 'gamification', 'Bonus points for returning after streak break'),

  -- Share milestone rewards
  ('share_5_milestone_points', '20', 'number', 'gamification', 'Points for 5 shares milestone'),
  ('share_5_milestone_xp', '30', 'number', 'gamification', 'XP for 5 shares milestone'),
  ('share_10_milestone_points', '50', 'number', 'gamification', 'Points for 10 shares milestone'),
  ('share_10_milestone_xp', '75', 'number', 'gamification', 'XP for 10 shares milestone'),
  ('share_25_milestone_points', '100', 'number', 'gamification', 'Points for 25 shares milestone'),
  ('share_25_milestone_xp', '150', 'number', 'gamification', 'XP for 25 shares milestone'),
  ('share_50_milestone_points', '200', 'number', 'gamification', 'Points for 50 shares milestone'),
  ('share_50_milestone_xp', '300', 'number', 'gamification', 'XP for 50 shares milestone'),
  ('share_100_milestone_points', '500', 'number', 'gamification', 'Points for 100 shares milestone'),
  ('share_100_milestone_xp', '750', 'number', 'gamification', 'XP for 100 shares milestone')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_app_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE FUNCTION update_app_settings_updated_at();

-- Helper function to get setting value
CREATE OR REPLACE FUNCTION get_setting(setting_key TEXT, default_value TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  setting_value TEXT;
BEGIN
  SELECT value INTO setting_value FROM app_settings WHERE key = setting_key;
  RETURN COALESCE(setting_value, default_value);
END;
$$ LANGUAGE plpgsql;

-- Helper function to get setting as number
CREATE OR REPLACE FUNCTION get_setting_number(setting_key TEXT, default_value NUMERIC DEFAULT 0)
RETURNS NUMERIC AS $$
DECLARE
  setting_value TEXT;
BEGIN
  SELECT value INTO setting_value FROM app_settings WHERE key = setting_key;
  RETURN COALESCE(setting_value::NUMERIC, default_value);
END;
$$ LANGUAGE plpgsql;

-- Helper function to get setting as boolean
CREATE OR REPLACE FUNCTION get_setting_boolean(setting_key TEXT, default_value BOOLEAN DEFAULT false)
RETURNS BOOLEAN AS $$
DECLARE
  setting_value TEXT;
BEGIN
  SELECT value INTO setting_value FROM app_settings WHERE key = setting_key;
  RETURN COALESCE(setting_value::BOOLEAN, default_value);
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE app_settings IS 'Admin-configurable application settings';
COMMENT ON FUNCTION get_setting IS 'Get setting value by key with optional default';
COMMENT ON FUNCTION get_setting_number IS 'Get setting value as number with optional default';
COMMENT ON FUNCTION get_setting_boolean IS 'Get setting value as boolean with optional default';
