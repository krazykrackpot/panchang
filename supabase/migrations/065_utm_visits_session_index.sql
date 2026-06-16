-- 065 — Index utm_visits.session_id for the retro-stitch UPDATE pattern.
--
-- Background: PR #709 introduces user_id population on utm_visits inserts,
-- plus a retro-stitch that runs on every authed track-utm POST:
--
--   UPDATE utm_visits SET user_id = $userId
--   WHERE session_id = $sessionId AND user_id IS NULL
--
-- Without an index on session_id, that UPDATE triggers a full table scan
-- on every authed event. The utm_visits table already has ~6 figures of
-- rows from a single month of ChatGPT-mediated traffic and is the
-- highest-volume table in the schema; an unindexed scan per request
-- would blow up under any meaningful authed traffic.
--
-- Composite (session_id, user_id) chosen over plain (session_id) because:
--  (a) the retro-stitch's WHERE clause includes both columns; the planner
--      can use an index-only scan to find the matching null-user rows
--      without touching the heap,
--  (b) future attribution joins like
--      `JOIN auth.users ON utm_visits.user_id = users.id`
--      benefit from the second column being adjacent in the index.
-- A partial index `(session_id) WHERE user_id IS NULL` was considered but
-- rejected: it bloats again every time the stitch flips a batch from null
-- to non-null, requiring scheduled REINDEX. Composite is steady-state stable.
--
-- CREATE INDEX CONCURRENTLY would normally be preferred to avoid an
-- ACCESS EXCLUSIVE lock, but Supabase's migration runner wraps each .sql
-- file in a single transaction and CONCURRENTLY isn't transactional.
-- The plain CREATE INDEX briefly locks utm_visits, which is acceptable
-- for analytics writes (the insert path tolerates a few hundred ms of
-- write blocking; readers continue with the old index plan).

CREATE INDEX IF NOT EXISTS idx_utm_visits_session_user
  ON public.utm_visits (session_id, user_id);

COMMENT ON INDEX public.idx_utm_visits_session_user IS
  'Powers PR #709 retro-stitch UPDATE WHERE session_id=$1 AND user_id IS NULL, plus future user_id attribution joins.';
