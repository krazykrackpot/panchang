-- 037 — Razorpay parity: pending_razorpay_subscriptions
--
-- Closes Round 2 audit findings SEC-3, SEC-4, SF-3, IDEM-2 — the Razorpay
-- branch of /api/checkout was never extended with the server-side binding
-- row that the Stripe webhook now requires (sprint 7 / migration 035).
-- Without it, the Razorpay subscription webhook trusts notes.user_id from
-- the subscription entity, which an attacker controlling their own
-- Razorpay merchant account can set to a victim's user_id.
--
-- Mirrors `pending_checkouts` in shape. Kept as a sibling table rather
-- than extending pending_checkouts because:
--   * Lower risk to the live Stripe binding flow (no PK or constraint
--     mutations on the existing table).
--   * Clearer separation in logs and ops dashboards (`SELECT * FROM
--     pending_razorpay_subscriptions WHERE completed_at IS NULL` is
--     directly the "stuck Razorpay subscriptions" report).
--   * Easy rollback — drop one table, the Stripe path is untouched.
--
-- Flow:
--   1. /api/checkout (INR) writes a row keyed on (razorpay_subscription_id,
--      user_id) at subscription-creation time, on the authenticated path.
--   2. /api/webhooks/razorpay looks up the row by subscription.entity.id
--      and verifies notes.user_id matches before crediting.
--   3. On mismatch, the webhook logs + skips. On match, it stamps
--      completed_at for replay dedup.

CREATE TABLE IF NOT EXISTS public.pending_razorpay_subscriptions (
  -- Razorpay subscription id (sub_…). PRIMARY KEY for the webhook's
  -- O(1) lookup by subscription.entity.id.
  razorpay_subscription_id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL,
  billing text,
  created_at timestamptz NOT NULL DEFAULT now(),
  -- When the matching webhook arrives, the handler stamps this to dedup
  -- and gate later replays of the same subscription.activated event.
  -- NULL = pending; non-NULL = already credited.
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_pending_razorpay_subscriptions_user_time
  ON public.pending_razorpay_subscriptions(user_id, created_at DESC);

ALTER TABLE public.pending_razorpay_subscriptions ENABLE ROW LEVEL SECURITY;

-- Service-role-only: client never reads or writes this table directly.
-- /api/checkout uses the service-role client to insert; the webhook uses
-- the same to look up and update.
CREATE POLICY "Service role manages pending_razorpay_subscriptions"
  ON public.pending_razorpay_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
