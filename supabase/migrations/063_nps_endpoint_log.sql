-- 063_nps_endpoint_log.sql
--
-- Audit table for every hit on /api/feedback/nps — success and failure.
--
-- Built after a silent-failure incident: NPS_TOKEN_SECRET was rotated
-- on 2026-06-06, invalidating tokens in 87 in-flight NPS emails.
-- Every click on those buttons returned 400, but no row landed in
-- `nps_responses` and no signal reached the operator — "0 of 93 emailed
-- responded" looked like a friction problem when it was really a
-- token-validation problem. This table is the observability layer
-- that would have caught it on day 1.
--
-- Columns:
--   outcome — discrete states the route can finish in:
--     'success'         — token verified + score upserted
--     'invalid_token'   — verifyNpsToken returned null
--     'invalid_score'   — score missing or out of [0, 10]
--     'db_error'        — upsert failed
--     'no_db'           — getServerSupabase returned null (env issue)
--   user_id — populated when token verified; null otherwise so we can
--             still count anonymous/forged clicks without crashing.
--   score   — recorded even on failure paths (the click intent matters
--             for the funnel, not just whether the row landed).
--   ip_hash — sha256(ip) sliced to first 16 hex chars; enough to
--             dedupe spam from one source without storing the actual
--             IP. Set null when ip is unknown.
--   user_agent — truncated to 200 chars for spam-bot diagnosis.
--
-- RLS: enabled with NO select policy. Only the service_role can read.

CREATE TABLE IF NOT EXISTS nps_endpoint_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  score integer CHECK (score IS NULL OR (score >= 0 AND score <= 10)),
  outcome text NOT NULL CHECK (outcome IN ('success', 'invalid_token', 'invalid_score', 'db_error', 'no_db')),
  ip_hash text,
  user_agent text
);

CREATE INDEX IF NOT EXISTS nps_endpoint_log_created_at_idx
  ON nps_endpoint_log (created_at DESC);

-- Index for the "how many clicks per outcome over the last 7 days"
-- analytics query the operator will use to spot future regressions.
CREATE INDEX IF NOT EXISTS nps_endpoint_log_outcome_created_idx
  ON nps_endpoint_log (outcome, created_at DESC);

ALTER TABLE nps_endpoint_log ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE nps_endpoint_log IS
  'Audit log for every /api/feedback/nps request. Built 2026-06-10 after secret-rotation incident — every click should land here regardless of outcome.';
