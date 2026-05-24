-- 039 — user_notifications.dedup_key: DB-side dedup primitive
--
-- Closes Round 2 audit findings IDEM-8, IDEM-9, IDEM-12, SF-14, SF-15
-- and partially SF-16. The four cron jobs (generate-notifications,
-- transit-alerts, domain-activations, email-alerts) previously deduped
-- by reading recent rows into a Set and filtering inserts client-side.
-- That pattern has three failure modes:
--
--   1. The SELECT can fail silently → empty Set → every alert re-fires.
--      (Bombardment-shape risk; see project memory's May-20 incident.)
--   2. Two concurrent cron invocations both read empty/stale and both
--      insert → duplicate alerts (Vercel cron retries on 502).
--   3. JSON.stringify(metadata) key order is non-deterministic → same
--      semantic event hashes differently across runs → false dedup miss.
--
-- Fix: lift dedup to a DB constraint. App computes a deterministic
-- dedup_key per row and inserts with ON CONFLICT DO NOTHING. The
-- unique index handles concurrency and false-miss cases by construction.
--
-- We use a plain TEXT column (not a generated column) because:
--   * date_trunc on timestamptz isn't IMMUTABLE → can't STORE.
--   * Computing the md5 of metadata in PG would require us to put the
--     JSON-canonicalisation logic in plpgsql, duplicating the JS path.
--   * App-computed keys are easier to audit in logs.
--
-- The unique constraint allows NULL dedup_key for legacy rows + any
-- caller that doesn't need dedup (e.g. system messages).

ALTER TABLE public.user_notifications
  ADD COLUMN IF NOT EXISTS dedup_key TEXT;

-- Partial unique index. NULL dedup_key bypasses dedup (legacy + system
-- messages). For app-generated keys, dedup is enforced across all time
-- — the app embeds a per-day (or per-week, per cron) date suffix in the
-- key itself, so multi-day notifications generate distinct keys.
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_notifications_dedup_key
  ON public.user_notifications(dedup_key)
  WHERE dedup_key IS NOT NULL;

COMMENT ON COLUMN public.user_notifications.dedup_key IS
  'App-generated deterministic dedup key, e.g. "user_id:type:md5(metadata):YYYY-MM-DD". Unique index prevents duplicate inserts. Closes Round 2 IDEM-8/9/12.';
