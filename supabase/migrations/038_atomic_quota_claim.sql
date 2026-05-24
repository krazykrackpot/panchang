-- 038 — Atomic AI quota claim: close the read-then-increment TOCTOU
--
-- Closes Round 2 audit findings IDEM-4 and IDEM-5.
--
-- Three AI endpoints (ai-reading, domain-pandit, tippanni-llm) plus the
-- central `checkAndIncrementUsage` helper read the current quota count
-- THEN compare to limit THEN call increment_usage. The window between
-- read and increment is the entire LLM latency (~3–20s) — multiple
-- concurrent requests all see the same pre-increment count, all pass the
-- gate, all burn Anthropic tokens past the user's plan limit. Across
-- multiple Fluid Compute containers the previous in-memory `Map` cache
-- in those routes didn't share at all, multiplying the bypass.
--
-- Fix: an atomic claim function that does the check-and-increment in a
-- single UPDATE … WHERE … < limit RETURNING … statement. The UPDATE
-- either modifies the row (granted) or doesn't (at-limit) — there is no
-- intermediate state visible to a concurrent transaction.

-- ── 038-1: extend daily_usage with AI-feature columns ────────────────
--
-- The existing daily_usage table tracks kundali / muhurta / pdf / ai_chat
-- counts. The three AI endpoints kept their own in-memory Map until now.
-- Adding columns is simpler than introducing a sibling table and lets us
-- reuse the existing UNIQUE(user_id, usage_date) row.

ALTER TABLE public.daily_usage
  ADD COLUMN IF NOT EXISTS ai_reading_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS domain_pandit_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tippanni_llm_count INT NOT NULL DEFAULT 0;

-- ── 038-2: atomic claim_usage ────────────────────────────────────────
--
-- Generic atomic check-and-increment for any daily_usage column.
-- Returns a single row with (claimed boolean, new_count int):
--   * claimed=TRUE, new_count=N  → request granted; counter is now N
--   * claimed=FALSE, new_count=N → at-limit; counter unchanged at N
--   * claimed=FALSE, new_count=-1 → invalid feature name (defence)
--
-- p_limit = -1 means unlimited; the function increments unconditionally
-- and always returns claimed=TRUE. -1 lets the jyotishi tier short-
-- circuit the WHERE clause cleanly.
--
-- SECURITY DEFINER so it bypasses RLS — daily_usage is service-role
-- writable. The function only accepts a whitelisted set of feature names
-- (matched against the daily_usage column list) to prevent SQL injection
-- via the format() in EXECUTE.

CREATE OR REPLACE FUNCTION public.claim_usage(
  p_user_id UUID,
  p_field TEXT,
  p_limit INT
)
RETURNS TABLE(claimed BOOLEAN, new_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_count INT;
  v_allowed_fields CONSTANT TEXT[] := ARRAY[
    'kundali_count',
    'ai_chat_count',
    'muhurta_scan_count',
    'pdf_export_count',
    'ai_reading_count',
    'domain_pandit_count',
    'tippanni_llm_count'
  ];
BEGIN
  -- Defence against SQL injection: only allow known column names through
  -- the dynamic SQL. format(%I) quotes the identifier safely but we
  -- belt-and-brace by gating against the whitelist first.
  IF NOT (p_field = ANY(v_allowed_fields)) THEN
    RAISE WARNING '[claim_usage] unknown feature: %', p_field;
    RETURN QUERY SELECT FALSE, -1;
    RETURN;
  END IF;

  -- Ensure today's row exists (cheap no-op on conflict).
  INSERT INTO daily_usage (user_id, usage_date)
  VALUES (p_user_id, CURRENT_DATE)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  -- Unlimited tier: increment unconditionally, always granted.
  IF p_limit = -1 THEN
    EXECUTE format(
      'UPDATE daily_usage
         SET %I = %I + 1
       WHERE user_id = $1 AND usage_date = CURRENT_DATE
       RETURNING %I',
      p_field, p_field, p_field
    ) INTO v_new_count USING p_user_id;
    RETURN QUERY SELECT TRUE, v_new_count;
    RETURN;
  END IF;

  -- Atomic conditional increment: UPDATE only the row whose current
  -- count is below the limit. If no row updates (already at-limit),
  -- v_new_count stays NULL and we report claimed=FALSE.
  EXECUTE format(
    'UPDATE daily_usage
       SET %I = %I + 1
     WHERE user_id = $1
       AND usage_date = CURRENT_DATE
       AND %I < $2
     RETURNING %I',
    p_field, p_field, p_field, p_field
  ) INTO v_new_count USING p_user_id, p_limit;

  IF v_new_count IS NULL THEN
    -- At-limit: read the current value back for accurate reporting.
    EXECUTE format(
      'SELECT %I FROM daily_usage WHERE user_id = $1 AND usage_date = CURRENT_DATE',
      p_field
    ) INTO v_new_count USING p_user_id;
    -- Fallback to p_limit if the row somehow vanished between INSERT and
    -- SELECT (extremely unlikely after the upsert above).
    RETURN QUERY SELECT FALSE, COALESCE(v_new_count, p_limit);
    RETURN;
  END IF;

  RETURN QUERY SELECT TRUE, v_new_count;
END;
$$;

-- Restrict execution to service_role only — anon/authenticated paths
-- should never call this directly.
REVOKE EXECUTE ON FUNCTION public.claim_usage(UUID, TEXT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_usage(UUID, TEXT, INT) TO service_role;

COMMENT ON FUNCTION public.claim_usage(UUID, TEXT, INT) IS
  'Atomic check-and-increment for a daily_usage feature column. Returns (claimed, new_count). p_limit=-1 for unlimited. Closes TOCTOU race in AI quota gates (Sprint 19, audit IDEM-4 / IDEM-5).';

-- ── 038-3: atomic claim_monthly_usage for tippanni-llm ───────────────
--
-- Monthly counters need to SUM across the user's daily_usage rows for
-- the current month and then increment today's row, atomically. We use
-- row-level locks (FOR UPDATE) on this user's monthly rows to serialise
-- concurrent claims — first claimer acquires the lock, sums + increments
-- + commits; subsequent claimers wait then see the fresh sum.

CREATE OR REPLACE FUNCTION public.claim_monthly_usage(
  p_user_id UUID,
  p_field TEXT,
  p_limit INT
)
RETURNS TABLE(claimed BOOLEAN, new_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_month_start DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  v_total INT;
  v_allowed_fields CONSTANT TEXT[] := ARRAY[
    'kundali_count',
    'ai_chat_count',
    'muhurta_scan_count',
    'pdf_export_count',
    'ai_reading_count',
    'domain_pandit_count',
    'tippanni_llm_count'
  ];
BEGIN
  IF NOT (p_field = ANY(v_allowed_fields)) THEN
    RAISE WARNING '[claim_monthly_usage] unknown feature: %', p_field;
    RETURN QUERY SELECT FALSE, -1;
    RETURN;
  END IF;

  -- Ensure today's row exists.
  INSERT INTO daily_usage (user_id, usage_date)
  VALUES (p_user_id, CURRENT_DATE)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  -- Serialise concurrent claims for this user this month. FOR UPDATE
  -- on the existing rows acquires row-level locks held until COMMIT.
  PERFORM 1
    FROM daily_usage
   WHERE user_id = p_user_id
     AND usage_date >= v_month_start
   FOR UPDATE;

  -- Sum monthly usage for this feature (post-lock; fresh value).
  EXECUTE format(
    'SELECT COALESCE(SUM(%I), 0)::INT FROM daily_usage
       WHERE user_id = $1 AND usage_date >= $2',
    p_field
  ) INTO v_total USING p_user_id, v_month_start;

  IF p_limit != -1 AND v_total >= p_limit THEN
    RETURN QUERY SELECT FALSE, v_total;
    RETURN;
  END IF;

  -- Increment today's row.
  EXECUTE format(
    'UPDATE daily_usage SET %I = %I + 1
       WHERE user_id = $1 AND usage_date = CURRENT_DATE',
    p_field, p_field
  ) USING p_user_id;

  -- Return the new monthly total for accurate reporting.
  EXECUTE format(
    'SELECT COALESCE(SUM(%I), 0)::INT FROM daily_usage
       WHERE user_id = $1 AND usage_date >= $2',
    p_field
  ) INTO v_total USING p_user_id, v_month_start;

  RETURN QUERY SELECT TRUE, v_total;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_monthly_usage(UUID, TEXT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_monthly_usage(UUID, TEXT, INT) TO service_role;

COMMENT ON FUNCTION public.claim_monthly_usage(UUID, TEXT, INT) IS
  'Atomic check-and-increment for a daily_usage feature column with a monthly limit. Uses FOR UPDATE row locks to serialise concurrent claims. Returns (claimed, new_count) where new_count is the monthly total. Used by tippanni-llm. Closes TOCTOU in monthly quota gates.';
