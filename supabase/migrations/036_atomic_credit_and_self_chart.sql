-- 036 — Atomic Brihaspati credit consume + atomic self-chart save
--
-- Two RPC functions that fix concurrency races flagged by audit P1-20 and
-- P1-24. Both replace read-then-update patterns that were non-atomic.

-- ─── P1-20: consume_brihaspati_credit ────────────────────────────────────
-- Replaces the non-transactional read-check-update in
-- src/lib/brihaspati/credits/credit-manager.ts (line 129-177). Two
-- concurrent calls could both read consumed < granted and both write
-- consumed + 1 — user got 2 answers for 1 credit. Now decrements
-- atomically inside a single SQL statement.
--
-- Strategy: pick the OLDEST unexpired credit row with capacity, then
-- UPDATE ... WHERE consumed < granted RETURNING id. The WHERE clause is
-- evaluated under the row lock, so only one of N concurrent calls can
-- match — the rest see 0 rows returned. Returns the consumed row's id
-- on success, NULL on no-capacity.
CREATE OR REPLACE FUNCTION public.consume_brihaspati_credit(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_id uuid;
BEGIN
  -- FOR UPDATE SKIP LOCKED gives us the oldest unexpired credit row with
  -- spare capacity, locking it so concurrent calls fall through to the
  -- next row. The UPDATE's WHERE clause re-asserts the capacity
  -- invariant inside the same statement — belt + braces.
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
  WHERE id = target_id
    AND consumed < granted
  RETURNING id INTO target_id;

  -- target_id is NULL here only if a racing call drained the row between
  -- the SELECT and UPDATE — which the FOR UPDATE SKIP LOCKED above
  -- should prevent. Defensive return either way.
  RETURN target_id;
END;
$$;

COMMENT ON FUNCTION public.consume_brihaspati_credit(uuid) IS
'Atomic decrement of one brihaspati credit. Returns the consumed row id, or NULL if no capacity.';

GRANT EXECUTE ON FUNCTION public.consume_brihaspati_credit(uuid) TO service_role;

-- ─── P1-24: save_self_chart ──────────────────────────────────────────────
-- Replaces the multi-step read → demote-others → upsert in
-- src/app/[locale]/kundali/Client.tsx. Cross-tab races could leave family
-- charts demoted to non-primary while the self insert failed under the
-- partial-unique constraint. Wrapping in a SECURITY DEFINER function gives
-- us a single implicit transaction.
--
-- The function takes the full chart payload as JSONB; the caller is
-- responsible for shaping it. Returns the (UPSERTed) row id.
CREATE OR REPLACE FUNCTION public.save_self_chart(
  p_user_id uuid,
  p_label text,
  p_birth_data jsonb,
  p_is_primary boolean DEFAULT true
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_id uuid;
  result_id uuid;
BEGIN
  -- Demote any existing primary that isn't the self row (so the new
  -- self row becomes the sole primary). Done first because if the self
  -- upsert fails we want to know before demoting; but the function is
  -- atomic so a failure here rolls back the demote too.
  IF p_is_primary THEN
    UPDATE public.saved_charts
    SET is_primary = false
    WHERE user_id = p_user_id
      AND is_primary = true
      AND relationship <> 'self';
  END IF;

  -- Update the existing self row if present, else insert. The partial
  -- unique index (user_id) WHERE relationship='self' guarantees at most
  -- one self row, so existing_id is unique.
  SELECT id INTO existing_id
  FROM public.saved_charts
  WHERE user_id = p_user_id AND relationship = 'self';

  IF existing_id IS NOT NULL THEN
    UPDATE public.saved_charts
    SET label = p_label,
        birth_data = p_birth_data,
        is_primary = p_is_primary,
        updated_at = now()
    WHERE id = existing_id
    RETURNING id INTO result_id;
  ELSE
    INSERT INTO public.saved_charts (user_id, label, birth_data, relationship, is_primary)
    VALUES (p_user_id, p_label, p_birth_data, 'self', p_is_primary)
    RETURNING id INTO result_id;
  END IF;

  RETURN result_id;
END;
$$;

COMMENT ON FUNCTION public.save_self_chart(uuid, text, jsonb, boolean) IS
'Atomic self-chart upsert: demote other primaries + insert/update the self row in one transaction.';

GRANT EXECUTE ON FUNCTION public.save_self_chart(uuid, text, jsonb, boolean) TO service_role;
