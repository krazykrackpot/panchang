-- Migration 068 — return credits_remaining on every spend_chart_credit branch
--
-- The original migration 066 returned credits_remaining only on the
-- 'insufficient_credits' branch. The 'unlocked' + 'already_unlocked'
-- branches omitted it, forcing the API route to do an extra SELECT
-- round-trip to chart_credits. Gemini review (PR #721) flagged this as
-- an unnecessary DB call. Body is otherwise byte-identical to the
-- original — same FOR UPDATE locking, same SECURITY DEFINER, same
-- search_path pin.

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
  v_balance int;
BEGIN
  -- Idempotency: if already entitled, return existing row + current balance.
  SELECT id INTO v_existing_id
  FROM chart_entitlements
  WHERE user_id = p_user_id AND kundali_fingerprint = p_fingerprint;

  IF v_existing_id IS NOT NULL THEN
    SELECT credits_remaining INTO v_balance FROM chart_credits WHERE user_id = p_user_id;
    RETURN json_build_object(
      'status', 'already_unlocked',
      'entitlement_id', v_existing_id,
      'credits_remaining', COALESCE(v_balance, 0)
    );
  END IF;

  -- Lock the credits row to prevent races (concurrent unlocks for
  -- different charts could both see credits=1 and both decrement,
  -- pushing credits to -1 if not locked).
  SELECT credits_remaining INTO v_credits
  FROM chart_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_credits IS NULL OR v_credits < 1 THEN
    RETURN json_build_object(
      'status', 'insufficient_credits',
      'credits_remaining', COALESCE(v_credits, 0)
    );
  END IF;

  -- Spend the credit.
  UPDATE chart_credits
  SET credits_remaining = credits_remaining - 1,
      total_spent = total_spent + 1,
      updated_at = now()
  WHERE user_id = p_user_id
  RETURNING credits_remaining INTO v_balance;

  -- Grant the entitlement.
  INSERT INTO chart_entitlements (user_id, kundali_fingerprint, display_name, source)
  VALUES (p_user_id, p_fingerprint, p_display_name, p_source)
  RETURNING id INTO v_new_id;

  RETURN json_build_object(
    'status', 'unlocked',
    'entitlement_id', v_new_id,
    'credits_remaining', v_balance
  );
END;
$$;

-- Keep the security posture from migration 066.
REVOKE ALL ON FUNCTION public.spend_chart_credit(uuid, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.spend_chart_credit(uuid, text, text, text) TO service_role;
