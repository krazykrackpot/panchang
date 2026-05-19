-- Step 1 of 3: Ensure column exists and backfill NULLs.
-- Runs in its own transaction so the UPDATE lock is released before step 2.
-- See 025 and 026 for the NOT NULL constraint steps.

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS onboarding_drip_day integer DEFAULT 0;

UPDATE public.user_profiles
  SET onboarding_drip_day = 0
  WHERE onboarding_drip_day IS NULL;
