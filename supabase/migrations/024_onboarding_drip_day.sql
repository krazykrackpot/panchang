-- Ensure onboarding_drip_day has NOT NULL constraint.
-- Column was created in 010_onboarding_drip.sql without NOT NULL.
-- ADD COLUMN IF NOT EXISTS kept for safety in case 010 was never applied.
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS onboarding_drip_day integer DEFAULT 0;

-- Backfill NULLs before applying NOT NULL (handles manual edits or edge cases)
UPDATE public.user_profiles
  SET onboarding_drip_day = 0
  WHERE onboarding_drip_day IS NULL;

ALTER TABLE public.user_profiles
  ALTER COLUMN onboarding_drip_day SET NOT NULL,
  ALTER COLUMN onboarding_drip_day SET DEFAULT 0;
