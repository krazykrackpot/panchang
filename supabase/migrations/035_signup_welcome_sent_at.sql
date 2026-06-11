-- Migration 035: signup_welcome_sent_at
--
-- Tracks whether the immediate post-signup welcome email has been sent.
-- Distinct from welcome_email_sent_at (migration 034) which gates the
-- first-chart welcome email — that email needs chart data (moon sign,
-- nakshatra, ascendant) and only fires after the user generates a chart.
-- Users who sign up but never generate a chart previously got no welcome
-- at all; this column gates a chart-independent welcome that fires from
-- /api/user/signup-welcome on successful auth callback.
--
-- Onboarding-drip Day 1 (cron) coincides with this email — to avoid
-- double-emailing, the signup-welcome route also sets onboarding_drip_day
-- = 1 on the same row, which makes the daily cron skip Day 1 (it claims
-- the row only when current drip_day < 1).

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS signup_welcome_sent_at timestamptz;

COMMENT ON COLUMN user_profiles.signup_welcome_sent_at IS
  'Set when the immediate post-signup welcome email was sent via /api/user/signup-welcome. NULL = not yet sent. Idempotency guard against duplicate sends across retried auth callbacks.';

-- Existing users (signed up before this column existed) are stamped with
-- created_at so the route does not re-welcome them.
UPDATE user_profiles
SET signup_welcome_sent_at = COALESCE(signup_welcome_sent_at, created_at, now())
WHERE signup_welcome_sent_at IS NULL;
