-- 066 — Kundali paywall: credits + entitlements + purchase log.
--
-- Pricing model (per docs/specs/2026-06-22-kundali-paywall.md):
--   Single Kundali  ₹299 → 1 credit
--   Family Pack     ₹999 → 4 credits
--   Brihaspati AI is separate (already paid via its own product family)
--
-- A "credit" is the right to unlock the tippanni / divisional charts /
-- PDF download for ONE distinct kundali fingerprint. The fingerprint is
-- a deterministic hash of normalised birth params (date + time + lat-4dp
-- + lng-4dp), so re-unlocking the same chart (typo correction, browser
-- refresh, account switch) never double-charges.
--
-- Free chart generation stays free — the paywall is on the tippanni
-- interpretation surface, not on the engine.

-- ── 1. Credits balance (one row per user) ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.chart_credits (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_remaining int NOT NULL DEFAULT 0 CHECK (credits_remaining >= 0),
  total_purchased int NOT NULL DEFAULT 0 CHECK (total_purchased >= 0),
  total_spent int NOT NULL DEFAULT 0 CHECK (total_spent >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.chart_credits IS 'Per-user balance of kundali-unlock credits. 1 row per user; never deleted (history matters for refunds). credits_remaining = total_purchased - total_spent.';

-- ── 2. Entitlements (which charts a user has unlocked) ───────────────
CREATE TABLE IF NOT EXISTS public.chart_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Deterministic SHA-256 of normalised birth params. Computed
  -- server-side in src/lib/kundali/fingerprint.ts; clients never
  -- compute the fingerprint themselves (auth bypass would be trivial).
  kundali_fingerprint text NOT NULL,
  -- Friendly label for the account/credits page. NULL allowed because
  -- v1 unlocks may not pass a name.
  display_name text,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL CHECK (source IN ('single', 'family', 'admin_grant')),
  -- Idempotency: one entitlement per (user, fingerprint). Re-unlock is
  -- a no-op that returns the existing row without spending a credit.
  UNIQUE (user_id, kundali_fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_chart_entitlements_user
  ON public.chart_entitlements (user_id);

COMMENT ON TABLE public.chart_entitlements IS 'A user has unlocked the tippanni / divisional charts / PDF for the kundali whose normalised birth params hash to this fingerprint.';

-- ── 3. Purchase log (refunds + audit) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chart_credit_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sku text NOT NULL CHECK (sku IN ('single', 'family')),
  credits_granted int NOT NULL CHECK (credits_granted > 0),
  amount_paid_minor int NOT NULL CHECK (amount_paid_minor > 0),
  currency text NOT NULL CHECK (currency IN ('INR', 'USD')),
  provider text NOT NULL CHECK (provider IN ('stripe', 'razorpay')),
  provider_session_id text NOT NULL,
  provider_payment_id text,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  -- Webhook idempotency: replaying the same provider event MUST NOT
  -- grant credits twice. UNIQUE (provider, provider_session_id) is the
  -- gate.
  UNIQUE (provider, provider_session_id)
);

CREATE INDEX IF NOT EXISTS idx_chart_credit_purchases_user
  ON public.chart_credit_purchases (user_id, purchased_at DESC);

COMMENT ON TABLE public.chart_credit_purchases IS 'Audit log of every kundali-credit purchase. UNIQUE on (provider, provider_session_id) is the webhook-replay safety gate.';

-- ── 4. RLS ────────────────────────────────────────────────────────────
-- Users can read THEIR OWN credits, entitlements, and purchase history.
-- Nobody can write directly from the client — all mutations flow through
-- service-role API routes (checkout grant, unlock spend).

ALTER TABLE public.chart_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_credit_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS chart_credits_own_read ON public.chart_credits;
CREATE POLICY chart_credits_own_read ON public.chart_credits
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS chart_entitlements_own_read ON public.chart_entitlements;
CREATE POLICY chart_entitlements_own_read ON public.chart_entitlements
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS chart_credit_purchases_own_read ON public.chart_credit_purchases;
CREATE POLICY chart_credit_purchases_own_read ON public.chart_credit_purchases
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- service_role bypasses RLS by default — no policies needed for it.

-- ── 5. Atomic spend RPC ───────────────────────────────────────────────
-- The /api/kundali/unlock route needs an ALL-OR-NOTHING operation:
--   (a) check user has credits_remaining > 0
--   (b) check no existing entitlement for this fingerprint
--   (c) if existing entitlement: return it (idempotent, no spend)
--   (d) else: decrement credits + insert entitlement, both in one tx
--
-- Doing this in app code requires a transaction roundtrip. Doing it in
-- a SECURITY DEFINER function pins it to one network call with proper
-- locking via FOR UPDATE.
--
-- Returns 'unlocked' (newly unlocked), 'already_unlocked' (idempotent),
-- or 'insufficient_credits'.

CREATE OR REPLACE FUNCTION public.spend_chart_credit(
  p_user_id uuid,
  p_fingerprint text,
  p_display_name text DEFAULT NULL,
  p_source text DEFAULT 'single'
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_id uuid;
  v_credits int;
  v_new_id uuid;
BEGIN
  -- Idempotency: if already entitled, return existing row.
  SELECT id INTO v_existing_id
  FROM chart_entitlements
  WHERE user_id = p_user_id AND kundali_fingerprint = p_fingerprint;

  IF v_existing_id IS NOT NULL THEN
    RETURN json_build_object('status', 'already_unlocked', 'entitlement_id', v_existing_id);
  END IF;

  -- Lock the credits row to prevent races (concurrent unlocks for
  -- different charts could both see credits=1 and both decrement,
  -- pushing credits to -1 if not locked).
  SELECT credits_remaining INTO v_credits
  FROM chart_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_credits IS NULL OR v_credits < 1 THEN
    RETURN json_build_object('status', 'insufficient_credits', 'credits_remaining', COALESCE(v_credits, 0));
  END IF;

  -- Spend the credit.
  UPDATE chart_credits
  SET credits_remaining = credits_remaining - 1,
      total_spent = total_spent + 1,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Grant the entitlement.
  INSERT INTO chart_entitlements (user_id, kundali_fingerprint, display_name, source)
  VALUES (p_user_id, p_fingerprint, p_display_name, p_source)
  RETURNING id INTO v_new_id;

  RETURN json_build_object('status', 'unlocked', 'entitlement_id', v_new_id);
END;
$$;

COMMENT ON FUNCTION public.spend_chart_credit IS 'Atomic unlock: spends 1 credit + inserts entitlement, or returns existing entitlement (idempotent), or returns insufficient_credits. FOR UPDATE on chart_credits prevents the concurrent-double-spend race.';

REVOKE ALL ON FUNCTION public.spend_chart_credit FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.spend_chart_credit TO service_role;
