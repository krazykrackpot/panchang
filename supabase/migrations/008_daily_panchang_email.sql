-- Daily Panchang Email — opt-in preferences
-- Adds email notification columns to user_profiles

-- Daily panchang email opt-in (default false — users must explicitly enable)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS daily_panchang_email BOOLEAN DEFAULT FALSE;

-- Location for panchang computation (separate from birth location — user may want
-- panchang for their current city, not birth city)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS panchang_location_lat NUMERIC;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS panchang_location_lng NUMERIC;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS panchang_location_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS panchang_location_timezone TEXT;

-- Add daily_panchang to notification_prefs default
-- (only affects new rows — existing rows keep their current prefs)
UPDATE user_profiles
SET notification_prefs = notification_prefs || '{"daily_panchang": false}'::jsonb
WHERE NOT (notification_prefs ? 'daily_panchang');
