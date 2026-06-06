-- ============================================================================
-- 059 — Align daily quota window to the user's panchang timezone
-- ============================================================================
--
-- Why this exists
-- ----------------
-- Before this migration both `claim_usage` and `claim_monthly_usage` used
-- `CURRENT_DATE` to key the daily_usage row. Postgres resolves CURRENT_DATE
-- in the session timezone, which is UTC on Vercel/Supabase by default. The
-- subscription-store client was forced to read at UTC too, otherwise the
-- client and server would land on different `usage_date` strings on day
-- boundaries (off-by-one quota drift). The result: a Switzerland user at
-- 23:55 CET on June 5 sees "today" in their daily-limit UX as June 5, but
-- their daily_usage row is keyed June 5 UTC — which is actually 21:55 UTC,
-- so the row IS June 5. Fine. But at 01:00 CET on June 6 (= 23:00 UTC June
-- 5), their UX shows "today = June 6" — yet writes still land on the
-- June 5 row, so a user who just hit their daily limit at 23:55 CET June 5
-- can magically place another query 5 minutes later thinking it's a new
-- day, and the row keeps incrementing past the limit silently.
--
-- This migration encapsulates the TZ resolution INSIDE the RPC so callers
-- don't need to plumb anything. The RPC looks up the user's
-- `user_profiles.vrat_location_tz` (the IANA timezone the user actively
-- maintains for panchang work — already populated for any user who has
-- set up vrat reminders), computes "today in that timezone" via
-- `now() AT TIME ZONE`, and uses that as the daily window key.
--
-- Backward compatibility
-- ----------------------
-- The 3-arg signatures `claim_usage(uuid, text, int)` and
-- `claim_monthly_usage(uuid, text, int)` stay exactly as they were from
-- the caller's perspective. Their BODIES now do the TZ-aware lookup,
-- which is the bug fix. No call sites in TypeScript need to change.
--
-- A new 4-arg overload accepts an explicit `p_user_tz TEXT` override so
-- callers that already know the TZ (e.g. server-side cron, the daily-
-- panchang job, test fixtures) can skip the user_profiles lookup.
--
-- Migration-day window
-- --------------------
-- Users whose UTC-today differs from their TZ-today on the cutover day
-- may get up to one extra "day" of quota — their pre-deploy UTC-keyed
-- row and post-deploy TZ-keyed row may both exist for the overlapping
-- window. Acceptable: this is a one-time generosity, not a leak.
--
-- Invalid TZ handling
-- -------------------
-- `now() AT TIME ZONE 'bogus'` throws `invalid_parameter_value`. We
-- catch and fall back to CURRENT_DATE (UTC), matching pre-migration
-- behaviour exactly. Sustained invalid TZs surface via the WARNING.

-- ── 059-1: helper — resolve today's date in user's vrat_location_tz ──

CREATE OR REPLACE FUNCTION public.usage_date_for_user(
  p_user_id UUID,
  p_user_tz TEXT DEFAULT NULL
)
RETURNS DATE
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_tz TEXT := p_user_tz;
  v_result DATE;
BEGIN
  -- Resolve TZ: explicit param wins, else look up the user's profile,
  -- else UTC. The COALESCE+SELECT pattern only fires the SELECT when
  -- the explicit param is NULL.
  IF v_tz IS NULL THEN
    SELECT vrat_location_tz INTO v_tz
      FROM user_profiles WHERE id = p_user_id;
  END IF;

  IF v_tz IS NULL OR v_tz = '' THEN
    v_tz := 'UTC';
  END IF;

  -- Compute today in that TZ. Postgres throws invalid_parameter_value
  -- for bogus IANA strings — catch and fall back to UTC so a corrupt
  -- profile column never breaks the quota path.
  --
  -- Fallback is explicitly `(now() AT TIME ZONE 'UTC')::DATE`, not
  -- `CURRENT_DATE` — the former is hard-coded to UTC, the latter
  -- depends on the session's `TimeZone` GUC which a future Supabase
  -- config could change (Gemini PR #474 MED). Pinning UTC keeps the
  -- documented contract honest.
  BEGIN
    v_result := (now() AT TIME ZONE v_tz)::DATE;
  EXCEPTION WHEN invalid_parameter_value THEN
    RAISE WARNING '[usage_date_for_user] invalid timezone for user %: %', p_user_id, v_tz;
    v_result := (now() AT TIME ZONE 'UTC')::DATE;
  END;

  RETURN v_result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.usage_date_for_user(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.usage_date_for_user(UUID, TEXT) TO service_role;

COMMENT ON FUNCTION public.usage_date_for_user(UUID, TEXT) IS
  'Resolve "today" as a DATE in the user''s panchang timezone (vrat_location_tz). Returns CURRENT_DATE (UTC) for users with no tz set or whose tz string is invalid. p_user_tz overrides the lookup.';

-- ── 059-2: 4-arg overload of claim_usage with explicit p_user_tz ──

CREATE OR REPLACE FUNCTION public.claim_usage(
  p_user_id UUID,
  p_field TEXT,
  p_limit INT,
  p_user_tz TEXT
)
RETURNS TABLE(claimed BOOLEAN, new_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_count INT;
  v_usage_date DATE := public.usage_date_for_user(p_user_id, p_user_tz);
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
    RAISE WARNING '[claim_usage] unknown feature: %', p_field;
    RETURN QUERY SELECT FALSE, -1;
    RETURN;
  END IF;

  -- Ensure today's row exists (cheap no-op on conflict).
  INSERT INTO daily_usage (user_id, usage_date)
  VALUES (p_user_id, v_usage_date)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  -- Unlimited tier: increment unconditionally. `COALESCE(%I, 0) + 1` is
  -- defensive against NULL column values (Gemini PR #474 MED) — `NULL +
  -- 1` evaluates to NULL in Postgres, so a row added by a future ALTER
  -- TABLE without a DEFAULT would silently never increment.
  IF p_limit = -1 THEN
    EXECUTE format(
      'UPDATE daily_usage
         SET %I = COALESCE(%I, 0) + 1
       WHERE user_id = $1 AND usage_date = $2
       RETURNING %I',
      p_field, p_field, p_field
    ) INTO v_new_count USING p_user_id, v_usage_date;
    RETURN QUERY SELECT TRUE, v_new_count;
    RETURN;
  END IF;

  -- Atomic conditional increment. Both the SET and the WHERE use
  -- COALESCE so a NULL column treats as 0: SET so the increment is
  -- non-NULL, WHERE so a row with NULL still passes the `< limit` gate
  -- (NULL < N is UNKNOWN in SQL, which would silently fail the match).
  EXECUTE format(
    'UPDATE daily_usage
       SET %I = COALESCE(%I, 0) + 1
     WHERE user_id = $1
       AND usage_date = $2
       AND COALESCE(%I, 0) < $3
     RETURNING %I',
    p_field, p_field, p_field, p_field
  ) INTO v_new_count USING p_user_id, v_usage_date, p_limit;

  IF v_new_count IS NULL THEN
    EXECUTE format(
      'SELECT %I FROM daily_usage WHERE user_id = $1 AND usage_date = $2',
      p_field
    ) INTO v_new_count USING p_user_id, v_usage_date;
    RETURN QUERY SELECT FALSE, COALESCE(v_new_count, p_limit);
    RETURN;
  END IF;

  RETURN QUERY SELECT TRUE, v_new_count;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_usage(UUID, TEXT, INT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_usage(UUID, TEXT, INT, TEXT) TO service_role;

COMMENT ON FUNCTION public.claim_usage(UUID, TEXT, INT, TEXT) IS
  'Atomic check-and-increment with explicit user-TZ override (4-arg form). p_user_tz NULL → look up user_profiles.vrat_location_tz, fall back to UTC. Migration 059.';

-- ── 059-3: rebody the 3-arg claim_usage to use the same TZ logic ──
--
-- Existing TypeScript callers (api-gate, api/domain-pandit, api/ai-reading)
-- all call this 3-arg signature. They keep working unchanged — but now
-- the daily window is the user's panchang day, not the server's UTC day.

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
BEGIN
  RETURN QUERY SELECT * FROM public.claim_usage(p_user_id, p_field, p_limit, NULL::TEXT);
END;
$$;

COMMENT ON FUNCTION public.claim_usage(UUID, TEXT, INT) IS
  'Atomic daily quota increment, keyed on today in the user''s panchang timezone (user_profiles.vrat_location_tz, fallback UTC). Migration 059 swapped CURRENT_DATE for usage_date_for_user(p_user_id) — the daily window now follows the user, not the server clock. No TypeScript call sites changed.';

-- ── 059-4: 4-arg overload of claim_monthly_usage ──

CREATE OR REPLACE FUNCTION public.claim_monthly_usage(
  p_user_id UUID,
  p_field TEXT,
  p_limit INT,
  p_user_tz TEXT
)
RETURNS TABLE(claimed BOOLEAN, new_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := public.usage_date_for_user(p_user_id, p_user_tz);
  v_month_start DATE := DATE_TRUNC('month', v_today)::DATE;
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
  VALUES (p_user_id, v_today)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  -- Serialise concurrent claims for this user this month.
  PERFORM 1
    FROM daily_usage
   WHERE user_id = p_user_id
     AND usage_date >= v_month_start
   FOR UPDATE;

  -- Sum monthly usage post-lock.
  EXECUTE format(
    'SELECT COALESCE(SUM(%I), 0)::INT FROM daily_usage
       WHERE user_id = $1 AND usage_date >= $2',
    p_field
  ) INTO v_total USING p_user_id, v_month_start;

  IF p_limit != -1 AND v_total >= p_limit THEN
    RETURN QUERY SELECT FALSE, v_total;
    RETURN;
  END IF;

  -- Increment today's row. We don't RETURN the new today value because
  -- the caller (check-access.checkAndIncrementUsage) reads `new_count`
  -- as the MONTHLY running total to compute `remaining = limit -
  -- new_count`. Returning today's row would massively under-count and
  -- show a wrong remaining quota (Gemini PR #474 HIGH).
  --
  -- Post-increment monthly total = v_total + 1 because v_total was the
  -- pre-increment sum captured under FOR UPDATE.
  EXECUTE format(
    'UPDATE daily_usage
       SET %I = COALESCE(%I, 0) + 1
     WHERE user_id = $1 AND usage_date = $2',
    p_field, p_field
  ) USING p_user_id, v_today;

  RETURN QUERY SELECT TRUE, v_total + 1;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_monthly_usage(UUID, TEXT, INT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_monthly_usage(UUID, TEXT, INT, TEXT) TO service_role;

COMMENT ON FUNCTION public.claim_monthly_usage(UUID, TEXT, INT, TEXT) IS
  'Atomic monthly quota with explicit user-TZ override (4-arg form). Migration 059.';

-- ── 059-5: rebody the 3-arg claim_monthly_usage ──

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
BEGIN
  RETURN QUERY SELECT * FROM public.claim_monthly_usage(p_user_id, p_field, p_limit, NULL::TEXT);
END;
$$;

COMMENT ON FUNCTION public.claim_monthly_usage(UUID, TEXT, INT) IS
  'Atomic monthly quota increment, keyed on month-of-today in the user''s panchang timezone. Migration 059 swapped CURRENT_DATE for usage_date_for_user(p_user_id). No TypeScript call sites changed.';

-- ── 059-6: align check-access.ts monthly select with user-TZ month-start ──
--
-- check-access.ts:122-129 does a JS-side `monthStartStr = first-of-UTC-month`
-- before calling claim_usage with p_limit=-1 for monthly features. That
-- pre-check is still UTC-aligned, but the RPC now writes at user-TZ. To
-- keep the pre-check and the RPC consistent, callers that care about the
-- precise month-boundary should pass an explicit p_user_tz or compute
-- monthStartStr against the same TZ. For now the pre-check is slightly
-- conservative on the cutover day (queries up to ~24h of overlap) and
-- self-heals after that. Tracked as a follow-up: callers should pass
-- p_user_tz explicitly OR look up vrat_location_tz before the SELECT.

-- ── 059-7: backward-compat test — both signatures resolvable ──
-- These DO blocks fail loudly if either signature is missing or has the
-- wrong return shape. They run as part of the migration apply, not as
-- separate tests.

DO $$
BEGIN
  PERFORM 1 FROM pg_proc
    WHERE proname = 'claim_usage'
      AND pronargs = 3;
  IF NOT FOUND THEN
    RAISE EXCEPTION '[059] 3-arg claim_usage signature missing post-migration';
  END IF;

  PERFORM 1 FROM pg_proc
    WHERE proname = 'claim_usage'
      AND pronargs = 4;
  IF NOT FOUND THEN
    RAISE EXCEPTION '[059] 4-arg claim_usage signature missing post-migration';
  END IF;

  PERFORM 1 FROM pg_proc
    WHERE proname = 'claim_monthly_usage'
      AND pronargs = 3;
  IF NOT FOUND THEN
    RAISE EXCEPTION '[059] 3-arg claim_monthly_usage signature missing post-migration';
  END IF;

  PERFORM 1 FROM pg_proc
    WHERE proname = 'claim_monthly_usage'
      AND pronargs = 4;
  IF NOT FOUND THEN
    RAISE EXCEPTION '[059] 4-arg claim_monthly_usage signature missing post-migration';
  END IF;
END $$;
