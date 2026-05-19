-- Ensure onboarding_drip_day exists and has NOT NULL constraint.
-- Column was created in 010_onboarding_drip.sql without NOT NULL.
-- Uses NOT VALID + VALIDATE pattern to avoid ACCESS EXCLUSIVE lock on large tables.

-- 1. Create column if 010 was never applied
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS onboarding_drip_day integer DEFAULT 0;

-- 2. Backfill NULLs (no lock escalation — row-level locks only)
UPDATE public.user_profiles
  SET onboarding_drip_day = 0
  WHERE onboarding_drip_day IS NULL;

-- 3. Add CHECK constraint as NOT VALID (instant — no table scan, brief lock)
ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_onboarding_drip_day_not_null
  CHECK (onboarding_drip_day IS NOT NULL) NOT VALID;

-- 4. Validate constraint (SHARE UPDATE EXCLUSIVE — reads still allowed)
ALTER TABLE public.user_profiles
  VALIDATE CONSTRAINT user_profiles_onboarding_drip_day_not_null;

-- 5. Now SET NOT NULL is instant — Postgres recognises the validated CHECK
ALTER TABLE public.user_profiles
  ALTER COLUMN onboarding_drip_day SET NOT NULL,
  ALTER COLUMN onboarding_drip_day SET DEFAULT 0;
