-- 035 — pending_checkouts: bind Stripe sessions to the authenticated user
--
-- Closes audit P0-5. The Stripe webhook previously trusted
-- session.metadata.user_id without server-side verification — an attacker
-- who controlled their own Stripe customer could craft a checkout session
-- whose metadata named a VICTIM's user_id, and the webhook would credit
-- the subscription to the victim. Webhook signature verification prevents
-- outside replay but not metadata-spoofing.
--
-- The fix mirrors the proven brihaspati_questions pattern (see
-- src/app/api/brihaspati/webhook/stripe/route.ts):
--   1. /api/checkout writes a pending_checkouts row binding
--      (stripe_session_id, user_id) at session-creation time, on the
--      authenticated server-side path.
--   2. The Stripe webhook looks up the pending row by session.id and
--      verifies session.metadata.user_id matches before crediting.
--   3. On mismatch the webhook logs + skips the write.

CREATE TABLE IF NOT EXISTS public.pending_checkouts (
  -- Stripe checkout session id (cs_test_… / cs_live_…). PRIMARY KEY for the
  -- webhook's O(1) lookup by session.id.
  stripe_session_id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL,
  billing text,
  currency text,
  created_at timestamptz NOT NULL DEFAULT now(),
  -- When the matching webhook arrives, the handler stamps this to dedup
  -- and gate later replays of the same checkout.session.completed event.
  -- NULL = pending; non-NULL = already credited.
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_pending_checkouts_user_time
  ON public.pending_checkouts(user_id, created_at DESC);

ALTER TABLE public.pending_checkouts ENABLE ROW LEVEL SECURITY;

-- Service-role-only: client should never read or write this table directly.
-- /api/checkout uses the service-role client (getServerSupabase) to insert;
-- the webhook uses the same to look up and update.
CREATE POLICY "Service role manages pending_checkouts" ON public.pending_checkouts
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
