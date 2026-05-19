-- Step 3 of 3: Validate constraint, promote to real NOT NULL, drop temporary CHECK.
-- VALIDATE uses SHARE UPDATE EXCLUSIVE (reads allowed).
-- SET NOT NULL is instant since Postgres sees the validated CHECK.
-- DROP CONSTRAINT removes the now-redundant CHECK.

ALTER TABLE public.user_profiles
  VALIDATE CONSTRAINT user_profiles_onboarding_drip_day_not_null;

ALTER TABLE public.user_profiles
  ALTER COLUMN onboarding_drip_day SET NOT NULL;

ALTER TABLE public.user_profiles
  DROP CONSTRAINT user_profiles_onboarding_drip_day_not_null;
