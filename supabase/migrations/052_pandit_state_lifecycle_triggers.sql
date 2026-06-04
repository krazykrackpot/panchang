-- 052_pandit_state_lifecycle_triggers.sql
-- Pandit CRM — addresses 2 findings from Gemini PR #406 round 3:
--   HIGH #2: snapshot engagement_state into engagement_state_before_archive
--            on transition to 'archived', so the unarchive UX (P11) can
--            restore the prior state.
--   MED  #6: when client_user_id becomes NULL (client deleted their
--            account; FK ON DELETE SET NULL fires from migration 049),
--            link_state stays 'linked'/'paused' — a zombie state where
--            the Pandit's UI would try to push to a non-existent user.
--            Trigger flips link_state to 'unlinked' in that case.

-- ─────────────────────────────────────────────────────────────────────
-- HIGH #2 — Extend the existing state-timestamp trigger to also
-- snapshot engagement_state_before_archive on the prospect/active/past
-- → 'archived' transition.
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.update_client_state_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.link_state IS DISTINCT FROM OLD.link_state THEN
    NEW.link_state_changed_at = NOW();
  END IF;
  IF NEW.engagement_state IS DISTINCT FROM OLD.engagement_state THEN
    NEW.engagement_state_changed_at = NOW();
    -- Snapshot the prior engagement state when archiving, so unarchive
    -- (P11) can restore the right state. Without this, "Unarchive" has
    -- no way to know whether to return to 'prospect', 'active', or
    -- 'past'. Gemini PR #406 round 3 HIGH.
    IF NEW.engagement_state = 'archived' AND OLD.engagement_state IS DISTINCT FROM 'archived' THEN
      NEW.engagement_state_before_archive = OLD.engagement_state;
    END IF;
    -- Clear the snapshot when unarchiving, so a later re-archive
    -- captures the new prior state (rather than the stale one).
    IF NEW.engagement_state IS DISTINCT FROM 'archived' AND OLD.engagement_state = 'archived' THEN
      NEW.engagement_state_before_archive = NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- (Trigger itself unchanged; CREATE OR REPLACE FUNCTION rebinds the body.)

-- ─────────────────────────────────────────────────────────────────────
-- MED #6 — On client_user_id → NULL, reset link_state to 'unlinked'.
-- The FK ON DELETE SET NULL in migration 049 fires when the auth user
-- is deleted (GDPR delete, account closure). Without this trigger,
-- link_state remains 'linked' / 'paused' — push-to-dashboard surfaces
-- (P7) would try to notify a non-existent user.
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_client_user_id_disconnect()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.client_user_id IS NULL AND OLD.client_user_id IS NOT NULL THEN
    NEW.link_state := 'unlinked';
    NEW.link_state_changed_at := NOW();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_client_user_id_disconnect ON public.pandit_clients;
CREATE TRIGGER trg_client_user_id_disconnect
  BEFORE UPDATE OF client_user_id ON public.pandit_clients
  FOR EACH ROW EXECUTE FUNCTION public.handle_client_user_id_disconnect();
