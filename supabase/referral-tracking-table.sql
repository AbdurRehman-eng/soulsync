-- ============================================
-- REFERRAL TRACKING TABLE
-- Tracks each referral with who referred whom,
-- when it happened, and what rewards were given.
-- Run this in Supabase SQL Editor.
-- ============================================

CREATE TABLE IF NOT EXISTS referral_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  referrer_points_awarded INTEGER DEFAULT 0,
  referrer_xp_awarded INTEGER DEFAULT 0,
  referred_points_awarded INTEGER DEFAULT 0,
  referred_xp_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Each user can only be referred once
  CONSTRAINT unique_referred_user UNIQUE (referred_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_referral_tracking_referrer ON referral_tracking(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_referred ON referral_tracking(referred_id);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_created ON referral_tracking(created_at);

-- Enable RLS
ALTER TABLE referral_tracking ENABLE ROW LEVEL SECURITY;

-- Users can view referrals they made or received
CREATE POLICY "Users can view own referrals" ON referral_tracking
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

COMMENT ON TABLE referral_tracking IS 'Tracks each referral: who referred whom, when, and rewards given';
