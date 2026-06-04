-- 050_pandit_crm_security_fixes.sql
-- Pandit CRM — addresses 2 CRITICAL findings from Gemini PR #406 round 1.
--
-- CRITICAL #1 — Denormalised client_user_id on pandit_consultations /
--   pandit_alerts / pandit_deliverables was free-form on insert. If a
--   bug or a malicious write set it to a value DIFFERENT from the
--   parent pandit_clients.client_user_id, the client-side RLS policies
--   (which read the denorm column directly) would expose sensitive data
--   to the wrong user. Fix: BEFORE INSERT/UPDATE trigger that
--   overwrites client_user_id from the parent row — the denorm becomes
--   a real materialised foreign key.
--
-- CRITICAL #2 — RLS on pandit_clients exposed pandit_notes (and
--   tags / display_label / color) to a linked client querying the base
--   table directly. The pandit_consultations_for_client VIEW projected
--   only safe columns BUT the base table's policy
--   pandit_consultations_client_shared allowed direct SELECT of
--   pandit_private_notes. Fix: drop the two client-side SELECT
--   policies on these tables entirely; replace with SECURITY DEFINER
--   functions that return only safe columns. Client-side code on the
--   seeker dashboard's "My Pandits" panel + deliverable viewer (P7)
--   call these functions instead of querying tables directly.

-- ─────────────────────────────────────────────────────────────────────
-- CRITICAL #1 — Sync denorm client_user_id from parent on insert/update
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.sync_denorm_client_user_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  parent_client_user_id UUID;
BEGIN
  SELECT client_user_id INTO parent_client_user_id
  FROM public.pandit_clients
  WHERE id = NEW.client_record_id;

  -- Force NEW.client_user_id to match the parent. Caller-supplied value
  -- is ignored — denormalisation is for performance, not flexibility.
  NEW.client_user_id := parent_client_user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_consultation_client_user_id ON public.pandit_consultations;
CREATE TRIGGER trg_sync_consultation_client_user_id
  BEFORE INSERT OR UPDATE OF client_record_id ON public.pandit_consultations
  FOR EACH ROW EXECUTE FUNCTION public.sync_denorm_client_user_id();

DROP TRIGGER IF EXISTS trg_sync_alert_client_user_id ON public.pandit_alerts;
CREATE TRIGGER trg_sync_alert_client_user_id
  BEFORE INSERT OR UPDATE OF client_record_id ON public.pandit_alerts
  FOR EACH ROW EXECUTE FUNCTION public.sync_denorm_client_user_id();

DROP TRIGGER IF EXISTS trg_sync_deliverable_client_user_id ON public.pandit_deliverables;
CREATE TRIGGER trg_sync_deliverable_client_user_id
  BEFORE INSERT OR UPDATE OF client_record_id ON public.pandit_deliverables
  FOR EACH ROW EXECUTE FUNCTION public.sync_denorm_client_user_id();

-- Also fire on update to pandit_clients.client_user_id — when the link
-- is established/changed, propagate to all children. This is the
-- "second leg" of the materialised FK.
CREATE OR REPLACE FUNCTION public.propagate_client_user_id_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.client_user_id IS DISTINCT FROM OLD.client_user_id THEN
    UPDATE public.pandit_consultations
      SET client_user_id = NEW.client_user_id
      WHERE client_record_id = NEW.id;
    UPDATE public.pandit_alerts
      SET client_user_id = NEW.client_user_id
      WHERE client_record_id = NEW.id;
    UPDATE public.pandit_deliverables
      SET client_user_id = NEW.client_user_id
      WHERE client_record_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_propagate_client_user_id ON public.pandit_clients;
CREATE TRIGGER trg_propagate_client_user_id
  AFTER UPDATE OF client_user_id ON public.pandit_clients
  FOR EACH ROW EXECUTE FUNCTION public.propagate_client_user_id_change();

-- ─────────────────────────────────────────────────────────────────────
-- CRITICAL #2 — Drop client-side SELECT policies on tables that hold
-- Pandit-private columns; replace with SECURITY DEFINER projections.
-- ─────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS pandit_clients_client_select_self ON public.pandit_clients;
DROP POLICY IF EXISTS pandit_consultations_client_shared ON public.pandit_consultations;

-- The view from migration 049 still exists but isn't reachable by
-- clients now (no SELECT policy on the underlying table for them).
-- Keep it for the Pandit's own use (Pandit's RLS still allows SELECT).
-- Client-side queries go through these new functions instead.

CREATE OR REPLACE FUNCTION public.get_my_pandit_links()
RETURNS TABLE (
  id UUID,
  pandit_user_id UUID,
  pandit_display_name TEXT,
  link_state TEXT,
  engagement_state TEXT,
  permissions JSONB,
  linked_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id,
    c.pandit_user_id,
    up.display_name,
    c.link_state,
    c.engagement_state,
    c.permissions,
    c.link_state_changed_at
  FROM public.pandit_clients c
  LEFT JOIN public.user_profiles up ON up.id = c.pandit_user_id
  WHERE c.client_user_id = auth.uid()
    AND c.link_state IN ('linked', 'paused');
$$;

REVOKE EXECUTE ON FUNCTION public.get_my_pandit_links() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_pandit_links() TO authenticated;

COMMENT ON FUNCTION public.get_my_pandit_links() IS
  'Seeker-side projection: which Pandits am I linked to? Safe column subset only (no pandit_notes, no tags, no display_label). RLS-bypass via SECURITY DEFINER + auth.uid() gate; no Pandit-private fields exposed.';

CREATE OR REPLACE FUNCTION public.get_my_pandit_consultations()
RETURNS TABLE (
  id UUID,
  client_record_id UUID,
  pandit_user_id UUID,
  pandit_display_name TEXT,
  consulted_at TIMESTAMPTZ,
  channel TEXT,
  client_visible_summary TEXT,
  shared_at TIMESTAMPTZ,
  attachments JSONB
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id,
    c.client_record_id,
    c.pandit_user_id,
    up.display_name,
    c.consulted_at,
    c.channel,
    c.client_visible_summary,
    c.shared_at,
    c.attachments
  FROM public.pandit_consultations c
  LEFT JOIN public.user_profiles up ON up.id = c.pandit_user_id
  WHERE c.client_user_id = auth.uid()
    AND c.shared_with_client = TRUE;
$$;

REVOKE EXECUTE ON FUNCTION public.get_my_pandit_consultations() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_pandit_consultations() TO authenticated;

COMMENT ON FUNCTION public.get_my_pandit_consultations() IS
  'Seeker-side projection of consultations shared with the current user. Omits pandit_private_notes entirely — the only path for clients to read consultation content. RLS-bypass via SECURITY DEFINER + auth.uid() + shared_with_client gate.';

-- Note: pandit_alerts and pandit_deliverables base-table client SELECT
-- policies are KEPT because those tables do not have Pandit-private
-- columns. Alert payload is engine output (kind, fires_at, severity,
-- payload {dasha_from, dasha_to}). Deliverable content is intended to
-- be shared with the client. No regression here.
