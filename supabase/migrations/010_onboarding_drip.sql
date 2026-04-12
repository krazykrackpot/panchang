-- 010_onboarding_drip.sql
-- Track which onboarding drip email day was last sent to each user.

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS onboarding_drip_day INT DEFAULT 0;
