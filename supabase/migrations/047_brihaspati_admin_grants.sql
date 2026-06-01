-- 047 — Brihaspati admin / comp grants.
--
-- A separate ledger from public.brihaspati_credits because credits are
-- two different kinds of artefact:
--
--   - public.brihaspati_credits        — PAID credits. `provider` column
--                                        is razorpay or stripe; rows are
--                                        created by webhook handlers
--                                        only. payment_ref is a real
--                                        external reference.
--   - public.brihaspati_admin_grants   — COMPED credits. No payment
--                                        provider, no payment ref, just
--                                        a `reason` audit string and
--                                        `granted_by` (who issued the
--                                        comp).
--
-- The consume RPC is updated to drain admin grants first, then fall
-- through to paid credits. Comps go to the user; we don't want a
-- recipient's paid credits draining while their comp sits unused.
-- Subscriptions still win over both (subscription holders don't consume
-- either kind).

-- ============================================================
-- Table: brihaspati_admin_grants
-- ============================================================
CREATE TABLE IF NOT EXISTS public.brihaspati_admin_grants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  granted     INTEGER NOT NULL CHECK (granted > 0),
  consumed    INTEGER NOT NULL DEFAULT 0 CHECK (consumed >= 0 AND consumed <= granted),
  reason      TEXT NOT NULL,
  granted_by  TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brihaspati_admin_grants_user_expires
  ON public.brihaspati_admin_grants (user_id, expires_at);

DROP TRIGGER IF EXISTS trg_brihaspati_admin_grants_updated_at ON public.brihaspati_admin_grants;
CREATE TRIGGER trg_brihaspati_admin_grants_updated_at
  BEFORE UPDATE ON public.brihaspati_admin_grants
  FOR EACH ROW EXECUTE FUNCTION public.brihaspati_set_updated_at();

ALTER TABLE public.brihaspati_admin_grants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own_admin_grants" ON public.brihaspati_admin_grants;
CREATE POLICY "users_select_own_admin_grants"
  ON public.brihaspati_admin_grants FOR SELECT
  USING (auth.uid() = user_id);
-- Writes via service_role only — same posture as brihaspati_credits.

-- ============================================================
-- Replace consume_brihaspati_credit RPC to scan both ledgers.
-- ============================================================
-- Strategy: phase 1 picks the oldest-expiring active admin grant under
-- FOR UPDATE SKIP LOCKED. If we get one and the UPDATE re-asserts
-- capacity, we return its id. Otherwise we fall through to phase 2
-- which is the original paid-credit logic.
--
-- Why admin-first not "oldest-expiring across both": comps should be
-- consumed before paid credits regardless of expiration so the
-- recipient gets the value. Edge case where a paid credit expires
-- sooner than a comp is acceptable because (a) comps are infrequent
-- and (b) the paid-credit owner would still prefer their comp drain
-- first.
CREATE OR REPLACE FUNCTION public.consume_brihaspati_credit(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_id uuid;
BEGIN
  -- Phase 1: admin grants first.
  SELECT id INTO target_id
  FROM public.brihaspati_admin_grants
  WHERE user_id = p_user_id
    AND consumed < granted
    AND expires_at > now()
  ORDER BY expires_at ASC, created_at ASC
  FOR UPDATE SKIP LOCKED
  LIMIT 1;

  IF target_id IS NOT NULL THEN
    UPDATE public.brihaspati_admin_grants
    SET consumed = consumed + 1, updated_at = now()
    WHERE id = target_id AND consumed < granted
    RETURNING id INTO target_id;
    IF target_id IS NOT NULL THEN
      RETURN target_id;
    END IF;
    -- A concurrent consumer drained the admin row between the SELECT
    -- and UPDATE despite SKIP LOCKED — fall through to phase 2.
  END IF;

  -- Phase 2: paid credits (original logic, unchanged).
  SELECT id INTO target_id
  FROM public.brihaspati_credits
  WHERE user_id = p_user_id
    AND consumed < granted
    AND (expires_at IS NULL OR expires_at > now())
  ORDER BY created_at ASC
  FOR UPDATE SKIP LOCKED
  LIMIT 1;

  IF target_id IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.brihaspati_credits
  SET consumed = consumed + 1, updated_at = now()
  WHERE id = target_id AND consumed < granted
  RETURNING id INTO target_id;

  RETURN target_id;
END;
$$;

COMMENT ON FUNCTION public.consume_brihaspati_credit(uuid) IS
'Atomic decrement of one brihaspati credit. Drains admin grants first then paid credits. Returns the consumed row id, or NULL if no capacity.';

-- GRANT was already in place from migration 036; idempotent re-grant
-- for safety in case this migration is applied to a fresh environment.
GRANT EXECUTE ON FUNCTION public.consume_brihaspati_credit(uuid) TO service_role;
