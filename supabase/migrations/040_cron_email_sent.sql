-- 040 — cron_email_sent: per-user sent-anchor for daily/weekly email crons
--
-- Closes Round 3 audit finding R3-IDEM-3.
--
-- The daily-panchang and weekly-digest crons fan out emails to all opted-
-- in subscribers. Until this migration, neither had a per-user sent
-- anchor — so a Vercel cron retry on 502 (or a manual re-run) re-sent
-- every email. Same family as the May-20 welcome-email bombardment that
-- triggered the original Sprint 13 incident.
--
-- Pattern: claim-first dedup. Each user gets at most ONE row per
-- (cron_name, run_date) keyed by the primary key — insert with
-- ON CONFLICT DO NOTHING. If the insert returns a row, send the email.
-- If the insert returns nothing (conflict), the user was already sent
-- today; skip silently.
--
-- The row is written BEFORE the email send (claim-first). If the email
-- send fails after the claim, the user does NOT get a duplicate on retry
-- — we accept the trade-off that a failed send doesn't auto-retry within
-- the same cron run. The next daily/weekly cron will reach them with
-- the latest content; loss is bounded to one day/week.

CREATE TABLE IF NOT EXISTS public.cron_email_sent (
  -- Cron identifier (e.g. 'daily-panchang', 'weekly-digest').
  cron_name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- UTC date of the cron run. Daily crons use today's UTC date; weekly
  -- crons use the ISO week-start (Monday) UTC date.
  run_date DATE NOT NULL,
  -- When we claimed the slot (not when Resend confirmed delivery — that
  -- happens after this row exists). Used for ops dashboards only.
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (cron_name, user_id, run_date)
);

CREATE INDEX IF NOT EXISTS idx_cron_email_sent_run_date
  ON public.cron_email_sent(run_date DESC);

ALTER TABLE public.cron_email_sent ENABLE ROW LEVEL SECURITY;

-- Service-role-only — clients should never read or write this table.
CREATE POLICY "Service role manages cron_email_sent"
  ON public.cron_email_sent
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

COMMENT ON TABLE public.cron_email_sent IS
  'Per-user sent anchor for email crons. Claim-first via ON CONFLICT DO NOTHING. Closes Round 3 R3-IDEM-3 (daily-panchang / weekly-digest bombardment-on-retry).';
