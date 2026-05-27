-- 045_vrat_next_reminder_due_at.sql
--
-- Adds next_reminder_due_at to user_vrat_preferences for cron early-exit.
--
-- Three-state semantics:
--   concrete timestamp  = earliest upcoming reminder (day-before or parana)
--   'infinity'          = no future reminder due (all sent, disabled, or past end_date)
--   NULL                = unmigrated row; cron processes once via legacy path then sets value
--
-- The cron's early-exit query:
--   WHERE enabled = true AND email_reminders = true
--     AND (next_reminder_due_at IS NULL              -- unmigrated, process once
--          OR next_reminder_due_at <= NOW() + INTERVAL '10 minutes')
-- 'infinity'::timestamptz rows are naturally excluded (infinity > any finite NOW() + interval).
--
-- Spec: docs/superpowers/specs/2026-05-27-vercel-cost-reduction-design.md §2 Fix 1 + §3

ALTER TABLE user_vrat_preferences
  ADD COLUMN IF NOT EXISTS next_reminder_due_at TIMESTAMPTZ;

-- Partial index: only covers enabled+email_reminders rows that are non-NULL.
-- NULL rows (unmigrated) are found by a seq scan on the small table; once
-- backfill completes they all carry a concrete value or 'infinity'.
CREATE INDEX IF NOT EXISTS idx_vrat_prefs_next_reminder
  ON user_vrat_preferences (next_reminder_due_at)
  WHERE enabled = TRUE AND email_reminders = TRUE AND next_reminder_due_at IS NOT NULL;
