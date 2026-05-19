-- Add onboarding_drip_day column to track which drip email has been sent.
-- Default 0 = no drip email sent yet. Cron increments to 1-7 as emails go out.
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS onboarding_drip_day integer NOT NULL DEFAULT 0;
