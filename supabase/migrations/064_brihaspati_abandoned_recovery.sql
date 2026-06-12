-- 064_brihaspati_abandoned_recovery.sql
--
-- Adds a one-shot "recovery email sent" marker to brihaspati_questions
-- for the /api/cron/brihaspati-abandoned-recovery job.
--
-- Rows where a user opened a Stripe Checkout but never completed payment
-- stay at status='pending', payment_verified=false. We want to email
-- those users exactly once with a "complete your reading" nudge.
--
-- The cron uses the same claim-first-then-send pattern as nps-feedback:
-- the row is claimed by setting `abandoned_recovery_sent_at = now()`
-- atomically (gated on IS NULL), the email is sent, and on send failure
-- the column is reset to NULL so tomorrow's run retries.
--
-- Partial index on `IS NULL` keeps the daily scan fast as the questions
-- table grows.

ALTER TABLE public.brihaspati_questions
  ADD COLUMN IF NOT EXISTS abandoned_recovery_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_brihaspati_questions_abandoned_recovery_pending
  ON public.brihaspati_questions (created_at)
  WHERE abandoned_recovery_sent_at IS NULL
    AND status = 'pending'
    AND payment_verified = false;

COMMENT ON COLUMN public.brihaspati_questions.abandoned_recovery_sent_at IS
  'Timestamp when /api/cron/brihaspati-abandoned-recovery emailed the user. NULL = never emailed; one-shot per question.';
