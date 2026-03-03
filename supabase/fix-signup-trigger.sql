-- ============================================
-- DEBUG + FIX: Signup trigger
-- Run ALL of this in Supabase SQL Editor
-- ============================================

-- STEP 1: Create a debug log table to capture trigger errors
CREATE TABLE IF NOT EXISTS public.debug_trigger_log (
  id SERIAL PRIMARY KEY,
  fn_name TEXT,
  step TEXT,
  detail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.debug_trigger_log DISABLE ROW LEVEL SECURITY;

-- STEP 2: See the current trigger function source code
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname IN ('handle_new_user', 'initialize_user_gamification');

-- STEP 3: Replace handle_new_user with a debug version that logs every step
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _username TEXT;
  _display_name TEXT;
  _referral_code TEXT;
BEGIN
  INSERT INTO public.debug_trigger_log (fn_name, step, detail)
  VALUES ('handle_new_user', 'START', 'user_id=' || NEW.id || ', email=' || COALESCE(NEW.email, 'NULL'));

  _username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
  _display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1));
  _referral_code := CONCAT('SS', UPPER(SUBSTRING(MD5(NEW.id::text) FROM 1 FOR 8)));

  INSERT INTO public.debug_trigger_log (fn_name, step, detail)
  VALUES ('handle_new_user', 'VARS', 'username=' || _username || ', display_name=' || _display_name || ', referral_code=' || _referral_code);

  BEGIN
    INSERT INTO public.profiles (id, username, display_name, referral_code)
    VALUES (NEW.id, _username, _display_name, _referral_code)
    ON CONFLICT (id) DO UPDATE SET
      username = COALESCE(EXCLUDED.username, profiles.username),
      display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
      referral_code = COALESCE(profiles.referral_code, EXCLUDED.referral_code);

    INSERT INTO public.debug_trigger_log (fn_name, step, detail)
    VALUES ('handle_new_user', 'INSERT_OK', 'profile created');
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.debug_trigger_log (fn_name, step, detail)
    VALUES ('handle_new_user', 'INSERT_ERROR', SQLERRM || ' [SQLSTATE=' || SQLSTATE || ']');

    -- Fallback: create profile without referral_code and with randomized username
    BEGIN
      INSERT INTO public.profiles (id, username, display_name)
      VALUES (
        NEW.id,
        split_part(NEW.email, '@', 1) || '_' || floor(random() * 10000)::text,
        _display_name
      )
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO public.debug_trigger_log (fn_name, step, detail)
      VALUES ('handle_new_user', 'FALLBACK_OK', 'fallback profile created');
    EXCEPTION WHEN OTHERS THEN
      INSERT INTO public.debug_trigger_log (fn_name, step, detail)
      VALUES ('handle_new_user', 'FALLBACK_ERROR', SQLERRM || ' [SQLSTATE=' || SQLSTATE || ']');
    END;
  END;

  INSERT INTO public.debug_trigger_log (fn_name, step, detail)
  VALUES ('handle_new_user', 'DONE', 'returning NEW');

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- This outer catch should never fire, but if it does, log it
  BEGIN
    INSERT INTO public.debug_trigger_log (fn_name, step, detail)
    VALUES ('handle_new_user', 'OUTER_ERROR', SQLERRM || ' [SQLSTATE=' || SQLSTATE || ']');
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 4: Replace initialize_user_gamification with a debug version
CREATE OR REPLACE FUNCTION initialize_user_gamification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.debug_trigger_log (fn_name, step, detail)
  VALUES ('init_gamification', 'START', 'user_id=' || NEW.id);

  BEGIN
    INSERT INTO user_badges (user_id, badge_id)
    SELECT NEW.id, id FROM badges WHERE name = 'Newcomer'
    ON CONFLICT DO NOTHING;

    INSERT INTO public.debug_trigger_log (fn_name, step, detail)
    VALUES ('init_gamification', 'BADGES_OK', 'newcomer badge inserted');
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.debug_trigger_log (fn_name, step, detail)
    VALUES ('init_gamification', 'BADGES_ERROR', SQLERRM || ' [SQLSTATE=' || SQLSTATE || ']');
  END;

  BEGIN
    INSERT INTO user_achievements (user_id, achievement_id, progress, completed)
    SELECT NEW.id, id, 0, FALSE
    FROM achievements
    WHERE is_active = TRUE
    ON CONFLICT DO NOTHING;

    INSERT INTO public.debug_trigger_log (fn_name, step, detail)
    VALUES ('init_gamification', 'ACHIEVEMENTS_OK', 'achievements initialized');
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.debug_trigger_log (fn_name, step, detail)
    VALUES ('init_gamification', 'ACHIEVEMENTS_ERROR', SQLERRM || ' [SQLSTATE=' || SQLSTATE || ']');
  END;

  INSERT INTO public.debug_trigger_log (fn_name, step, detail)
  VALUES ('init_gamification', 'DONE', 'returning NEW');

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  BEGIN
    INSERT INTO public.debug_trigger_log (fn_name, step, detail)
    VALUES ('init_gamification', 'OUTER_ERROR', SQLERRM || ' [SQLSTATE=' || SQLSTATE || ']');
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 5: VERIFY triggers are on the right tables
SELECT tgname, tgrelid::regclass, tgfoid::regproc
FROM pg_trigger
WHERE tgfoid IN (
  (SELECT oid FROM pg_proc WHERE proname = 'handle_new_user'),
  (SELECT oid FROM pg_proc WHERE proname = 'initialize_user_gamification')
);

-- ============================================
-- AFTER running all steps above:
--   1. Try signing up from the app
--   2. Then run this to see the debug log:
--
--   SELECT * FROM public.debug_trigger_log ORDER BY id DESC LIMIT 20;
--
-- ============================================
