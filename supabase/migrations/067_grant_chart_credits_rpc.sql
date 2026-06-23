-- 067 — RPC: grant_chart_credits.
--
-- Atomic credit grant called from webhook handlers. Doing the
-- chart_credit_purchases INSERT + chart_credits UPSERT in one
-- SECURITY DEFINER function gives us:
--   (a) idempotency via UNIQUE(provider, provider_session_id) — replays
--       short-circuit cleanly
--   (b) consistency — credits never get incremented without the audit
--       row existing, and vice versa
--   (c) one network call instead of two

CREATE OR REPLACE FUNCTION public.grant_chart_credits(
  p_user_id uuid,
  p_sku text,
  p_credits_granted int,
  p_amount_paid_minor int,
  p_currency text,
  p_provider text,
  p_provider_session_id text,
  p_provider_payment_id text DEFAULT NULL
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_purchase_id uuid;
BEGIN
  -- Insert audit row; UNIQUE(provider, provider_session_id) makes this idempotent.
  INSERT INTO chart_credit_purchases (
    user_id, sku, credits_granted, amount_paid_minor, currency,
    provider, provider_session_id, provider_payment_id
  ) VALUES (
    p_user_id, p_sku, p_credits_granted, p_amount_paid_minor, p_currency,
    p_provider, p_provider_session_id, p_provider_payment_id
  )
  ON CONFLICT (provider, provider_session_id) DO NOTHING
  RETURNING id INTO v_purchase_id;

  IF v_purchase_id IS NULL THEN
    -- Replay — purchase already recorded. Credits already granted on the
    -- prior delivery, no action needed. Return current balance for the log.
    RETURN json_build_object(
      'status', 'duplicate',
      'credits_remaining', (SELECT credits_remaining FROM chart_credits WHERE user_id = p_user_id)
    );
  END IF;

  -- Increment (or initialise) the user's credit balance. UPSERT with
  -- additive update is safe under concurrency because we hold the row
  -- lock for the duration of the function (single-statement RPC).
  INSERT INTO chart_credits (user_id, credits_remaining, total_purchased, total_spent)
  VALUES (p_user_id, p_credits_granted, p_credits_granted, 0)
  ON CONFLICT (user_id) DO UPDATE
    SET credits_remaining = chart_credits.credits_remaining + EXCLUDED.credits_remaining,
        total_purchased = chart_credits.total_purchased + EXCLUDED.total_purchased,
        updated_at = now();

  RETURN json_build_object(
    'status', 'granted',
    'credits_remaining', (SELECT credits_remaining FROM chart_credits WHERE user_id = p_user_id),
    'purchase_id', v_purchase_id
  );
END;
$$;

COMMENT ON FUNCTION public.grant_chart_credits IS 'Atomic credit grant called from /api/kundali/webhook/stripe (and razorpay). Idempotent via UNIQUE(provider, provider_session_id) on chart_credit_purchases. Replay returns status=duplicate without re-granting.';

REVOKE ALL ON FUNCTION public.grant_chart_credits FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.grant_chart_credits TO service_role;
