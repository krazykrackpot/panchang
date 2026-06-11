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
--
-- Idempotency
-- -----------
-- The whole column-add + backfill is wrapped in a DO block guarded by
-- IF NOT EXISTS on information_schema. The earlier draft was
--   ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...; UPDATE ... WHERE col IS NULL;
-- — but on a re-apply (CI replay, local-dev reset, etc.) the UPDATE would
-- run against any users who signed up AFTER the first apply but hadn't
-- yet received their welcome email, stamping them as "already welcomed"
-- and permanently silencing the welcome route for them (Gemini PR #673
-- HIGH). Wrapping in a DO block tied to the column's existence makes the
-- backfill a one-time event that fires exactly once across all reapplications.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
      AND column_name = 'signup_welcome_sent_at'
  ) THEN
    ALTER TABLE user_profiles
      ADD COLUMN signup_welcome_sent_at timestamptz;

    COMMENT ON COLUMN user_profiles.signup_welcome_sent_at IS
      'Set when the immediate post-signup welcome email was sent via /api/user/signup-welcome. NULL = not yet sent. Idempotency guard against duplicate sends across retried auth callbacks.';

    -- Existing users (signed up before this column existed) are stamped
    -- with created_at so the route does not re-welcome them. Runs exactly
    -- once — at the time of first column creation, when by definition no
    -- "new since the column was added" users can exist yet.
    UPDATE user_profiles
    SET signup_welcome_sent_at = COALESCE(created_at, now());
  END IF;
END $$;
