-- 033 — Fix domain_readings RLS hole + create processed_webhook_events for Stripe idempotency
--
-- Two unrelated but small infra fixes from the 2026-05-23 bug-hunt audit
-- (P0-1 + P0-6). Bundled because both are migration-only and small.

-- ─── P0-1: domain_readings RLS was wide-open ─────────────────────────────────
--
-- The original migration 012 created:
--   CREATE POLICY "Service role manages readings" ON public.domain_readings
--     FOR ALL USING (true) WITH CHECK (true);
--
-- PostgREST ORs all matching policies, so any signed-in user (anon key)
-- could SELECT/INSERT/UPDATE/DELETE *any* row — cross-user leak of the
-- 8-domain life scores. Sibling tables (family_readings, ai_readings)
-- correctly scoped this to auth.role() = 'service_role'.

DROP POLICY IF EXISTS "Service role manages readings" ON public.domain_readings;

CREATE POLICY "Service role manages readings" ON public.domain_readings
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Users may still SELECT their own row via the existing "Users read own
-- readings" policy unchanged. Service role is the only write path.

-- ─── P0-6: processed_webhook_events for Stripe main-webhook idempotency ─────
--
-- The main Stripe webhook (src/app/api/webhooks/stripe/route.ts) has no
-- event.id dedup. Stripe retries for up to 3 days on non-2xx and can
-- deliver out of order — a re-played older subscription.updated can
-- overwrite a newer cancel_at_period_end. The Brihaspati webhook gets
-- this right via brihaspati_webhook_events; this table mirrors the shape
-- for the main Stripe + future generic webhooks.
--
-- Kept separate from brihaspati_webhook_events to avoid coupling — they
-- key off the same (provider, event_id) unique constraint pattern.

CREATE TABLE IF NOT EXISTS public.processed_webhook_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  provider text NOT NULL,
  provider_event_id text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  -- At-least-once delivery: 'processing' on insert; flip to 'completed'
  -- only after the work succeeds. Retries from the provider can then
  -- re-enter the handler if status is still 'processing' (i.e. previous
  -- attempt failed mid-flight). Without this column, a work failure
  -- after the dedup row was already written silently lost the event.
  status text NOT NULL DEFAULT 'processing',
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  CONSTRAINT processed_webhook_events_unique UNIQUE (provider, provider_event_id),
  CONSTRAINT processed_webhook_events_status_valid CHECK (status IN ('processing', 'completed'))
);

CREATE INDEX IF NOT EXISTS idx_processed_webhook_events_provider_time
  ON public.processed_webhook_events(provider, processed_at DESC);

ALTER TABLE public.processed_webhook_events ENABLE ROW LEVEL SECURITY;

-- No user-facing SELECT policy — table is service-role-only audit data.
CREATE POLICY "Service role manages webhook events" ON public.processed_webhook_events
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
