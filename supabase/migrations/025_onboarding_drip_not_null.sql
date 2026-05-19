-- Step 2 of 3: Add NOT VALID CHECK constraint (instant, brief ACCESS EXCLUSIVE lock).
-- Separate transaction from step 1 so the backfill lock is already released.

ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_onboarding_drip_day_not_null
  CHECK (onboarding_drip_day IS NOT NULL) NOT VALID;
