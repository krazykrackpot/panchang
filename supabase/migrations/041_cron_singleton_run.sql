-- 041 — cron_singleton_run: per-run lock for broadcast/singleton crons
--
-- Closes Round 3 audit findings R3-IDEM-4, R3-IDEM-5.
--
-- The daily-panchang and weekly-digest crons fan out per-user (one
-- email per subscriber); migration 040's `cron_email_sent` is keyed
-- on (cron_name, user_id, run_date) and serves them.
--
-- The social-post and youtube-short crons are BROADCAST — one tweet /
-- one video per UTC day, not per user. The per-user table doesn't fit:
-- there's no user_id to key on, and the auth.users FK would force a
-- sentinel user that's awkward to provision.
--
-- This sibling table is the singleton variant: one row per
-- (cron_name, run_date). Same claim-first ON CONFLICT DO NOTHING
-- pattern. A Vercel cron retry on 502 collides on the same row and
-- skips silently — no duplicate tweet, no duplicate YouTube upload.

CREATE TABLE IF NOT EXISTS public.cron_singleton_run (
  -- Cron identifier (e.g. 'social-post', 'youtube-short').
  cron_name TEXT NOT NULL,
  -- UTC date of the run (broadcasts are daily-keyed).
  run_date DATE NOT NULL,
  -- When we claimed the run (for ops dashboards / debug).
  ran_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Optional metadata about the run (tweet id, video id, etc.) so ops
  -- can correlate the claim with the downstream provider result.
  metadata JSONB,
  PRIMARY KEY (cron_name, run_date)
);

CREATE INDEX IF NOT EXISTS idx_cron_singleton_run_run_date
  ON public.cron_singleton_run(run_date DESC);

ALTER TABLE public.cron_singleton_run ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages cron_singleton_run"
  ON public.cron_singleton_run
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

COMMENT ON TABLE public.cron_singleton_run IS
  'Singleton per-day lock for broadcast crons (social-post, youtube-short). Closes R3-IDEM-4/5.';
