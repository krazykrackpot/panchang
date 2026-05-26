-- 042 — NPS / feedback email dedup
--
-- Adds `nps_feedback_sent_at` to user_profiles so the
-- /api/cron/nps-feedback job can send the post-engagement NPS email
-- exactly once per user. Same shape as welcome_email_sent_at (migration
-- 034) — NULL means "eligible to send"; non-null means "already sent or
-- backfilled, do not send again."
--
-- Trigger conditions (evaluated in the cron):
--   1. user saved a chart on saved_charts at least 3 days ago, OR
--   2. user paid a Brihaspati question (payment_verified=true) at
--      least 3 days ago.
--
-- The 3-day delay gives the user time to actually use the product
-- before we ask for feedback — sending the same day is too early.

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS nps_feedback_sent_at timestamptz;

-- Backfill: every existing user predates this feature; we do NOT want
-- a sudden blast of NPS emails to historical users on the first cron
-- run. Mark them all as already-sent. The cron only emails users whose
-- column is NULL — which from now on is just new users hitting either
-- trigger condition.
UPDATE public.user_profiles
SET nps_feedback_sent_at = COALESCE(nps_feedback_sent_at, created_at, now())
WHERE nps_feedback_sent_at IS NULL;

-- Index the column to make the cron's "WHERE nps_feedback_sent_at IS NULL"
-- query fast even as the user base grows. Partial index on NULL only —
-- once a user is sent, their row drops out of the index, keeping it tiny.
CREATE INDEX IF NOT EXISTS user_profiles_nps_feedback_pending_idx
  ON public.user_profiles (id)
  WHERE nps_feedback_sent_at IS NULL;
