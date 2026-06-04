-- 056 — Cap-enforcement trigger: close the race-condition window
--
-- The migration-055 trigger reads `COUNT(*)` of unlinked clients
-- without serialising concurrent transactions for the same Pandit.
-- If two INSERT statements run concurrently (two browser tabs,
-- double-click, retry-after-network-blip), both transactions see
-- the same pre-insert count and both proceed — letting a free-tier
-- Pandit briefly slip past the 5-client cap.
--
-- Fix: take a transactional advisory lock on the Pandit's user id
-- BEFORE counting. `pg_advisory_xact_lock` blocks any other
-- transaction holding the same lock key until commit/rollback, so
-- the two concurrent inserts serialise → the second sees the first
-- one's row and correctly raises `pandit_cap_exceeded:`.
--
-- We use `pg_advisory_xact_lock(bigint)` over `SELECT ... FOR UPDATE
-- ON user_profiles` because:
--   1. user_profiles has many concurrent readers (settings page,
--      onboarding, auth callbacks). Locking it on every Pandit
--      client INSERT would create write contention on a hot table.
--   2. Advisory locks are cheap, key-based, and auto-release at
--      transaction end. They cost nothing for non-Pandit operations.
--
-- The lock key is derived from the Pandit's UUID via hashtextextended,
-- which gives 64 bits of evenly-distributed keyspace — collision
-- probability between two distinct Pandit IDs is ~2^-64.
--
-- Gemini PR #406 round P10 narrative #2 (security-high).

CREATE OR REPLACE FUNCTION public.enforce_pandit_unlinked_client_cap()
RETURNS TRIGGER AS $$
DECLARE
  v_pandit_tier TEXT;
  v_unlinked_count INT;
  -- Free tier allows up to 5 unlinked clients. Keep in sync with
  -- src/lib/pandit/subscription.ts FREE_TIER_UNLINKED_CAP.
  k_free_cap CONSTANT INT := 5;
BEGIN
  -- Only enforce when the new row sits in the unlinked/invited bucket.
  IF NEW.link_state NOT IN ('unlinked','invited') THEN
    RETURN NEW;
  END IF;

  -- On UPDATE, skip if the row was ALREADY in the counted bucket — the
  -- cap was checked at INSERT (or at the previous transition).
  IF TG_OP = 'UPDATE' AND OLD.link_state IN ('unlinked','invited') THEN
    RETURN NEW;
  END IF;

  -- Serialise concurrent counted-bucket transitions for the same
  -- Pandit. The advisory lock is transactional — released on
  -- COMMIT/ROLLBACK without explicit cleanup. Race fix per Gemini
  -- PR #406 round P10 narrative #2.
  PERFORM pg_advisory_xact_lock(hashtextextended(NEW.pandit_user_id::text, 0));

  -- Resolve the Pandit's current tier. NULL row = free tier.
  SELECT s.tier INTO v_pandit_tier
    FROM public.subscriptions s
    WHERE s.user_id = NEW.pandit_user_id
      AND s.status IN ('active','trialing')
    ORDER BY s.updated_at DESC NULLS LAST
    LIMIT 1;

  IF v_pandit_tier IN ('pandit_pro','pandit_unlimited') THEN
    RETURN NEW;
  END IF;

  -- Count current unlinked roster. Now serialised under the advisory
  -- lock — any concurrent INSERT for the same Pandit waits here.
  SELECT COUNT(*) INTO v_unlinked_count
    FROM public.pandit_clients pc
    WHERE pc.pandit_user_id = NEW.pandit_user_id
      AND pc.link_state IN ('unlinked','invited')
      AND (TG_OP = 'INSERT' OR pc.id <> NEW.id);

  IF v_unlinked_count >= k_free_cap THEN
    RAISE EXCEPTION 'pandit_cap_exceeded: free tier allows up to % unlinked clients', k_free_cap
      USING ERRCODE = 'P0001',
            HINT = 'Upgrade to Pandit Pro for unlimited clients, or invite an existing unlinked client onto the platform (linked clients don''t count against your cap).';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
