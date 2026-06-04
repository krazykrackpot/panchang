-- 051_pandit_crm_rls_parent_check.sql
-- Pandit CRM — CRITICAL fix from Gemini PR #406 round 2.
--
-- The child-table RLS policies on pandit_client_family_members,
-- pandit_client_invitations, pandit_consultations, pandit_alerts, and
-- pandit_deliverables only verified `pandit_user_id = auth.uid()`. They
-- did NOT verify that the referenced `client_record_id` belonged to the
-- authenticated Pandit. A Pandit could therefore insert family
-- members / consultations / alerts / deliverables / invitations against
-- ANOTHER Pandit's client_record_id, by supplying their own pandit_user_id
-- in the row. The row would pass RLS USING/WITH CHECK because
-- pandit_user_id = auth.uid() is true, even though the client belongs to
-- someone else.
--
-- This is cross-tenant data injection. A bad actor could spam another
-- Pandit's client roster with garbage records or generate misleading
-- alerts on another Pandit's client. The owning Pandit's SELECT would
-- still filter to their own pandit_user_id, so they'd miss the injected
-- rows — but the linked client (via the seeker-side surfaces) might see
-- them.
--
-- Fix: add `AND EXISTS (SELECT 1 FROM pandit_clients WHERE id = client_record_id
-- AND pandit_user_id = auth.uid())` to each child policy's USING and
-- WITH CHECK. Now the policy verifies the parent client is owned by
-- the same Pandit.

DROP POLICY IF EXISTS pandit_family_owner_all ON public.pandit_client_family_members;
CREATE POLICY pandit_family_owner_all ON public.pandit_client_family_members
  FOR ALL
  USING (
    pandit_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pandit_clients pc
      WHERE pc.id = client_record_id AND pc.pandit_user_id = auth.uid()
    )
  )
  WITH CHECK (
    pandit_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pandit_clients pc
      WHERE pc.id = client_record_id AND pc.pandit_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS pandit_invitations_owner_all ON public.pandit_client_invitations;
CREATE POLICY pandit_invitations_owner_all ON public.pandit_client_invitations
  FOR ALL
  USING (
    pandit_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pandit_clients pc
      WHERE pc.id = client_record_id AND pc.pandit_user_id = auth.uid()
    )
  )
  WITH CHECK (
    pandit_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pandit_clients pc
      WHERE pc.id = client_record_id AND pc.pandit_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS pandit_consultations_owner_all ON public.pandit_consultations;
CREATE POLICY pandit_consultations_owner_all ON public.pandit_consultations
  FOR ALL
  USING (
    pandit_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pandit_clients pc
      WHERE pc.id = client_record_id AND pc.pandit_user_id = auth.uid()
    )
  )
  WITH CHECK (
    pandit_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pandit_clients pc
      WHERE pc.id = client_record_id AND pc.pandit_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS pandit_alerts_owner_all ON public.pandit_alerts;
CREATE POLICY pandit_alerts_owner_all ON public.pandit_alerts
  FOR ALL
  USING (
    pandit_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pandit_clients pc
      WHERE pc.id = client_record_id AND pc.pandit_user_id = auth.uid()
    )
  )
  WITH CHECK (
    pandit_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pandit_clients pc
      WHERE pc.id = client_record_id AND pc.pandit_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS pandit_deliverables_owner_all ON public.pandit_deliverables;
CREATE POLICY pandit_deliverables_owner_all ON public.pandit_deliverables
  FOR ALL
  USING (
    pandit_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pandit_clients pc
      WHERE pc.id = client_record_id AND pc.pandit_user_id = auth.uid()
    )
  )
  WITH CHECK (
    pandit_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pandit_clients pc
      WHERE pc.id = client_record_id AND pc.pandit_user_id = auth.uid()
    )
  );

-- Note: the client-side SELECT policies on pandit_alerts and
-- pandit_deliverables (pandit_alerts_client_self,
-- pandit_deliverables_client_pushed) gate on client_user_id = auth.uid()
-- only — they're correct, because the denormalised client_user_id is
-- now materialised by the migration 050 triggers from the parent's
-- value. A child row inserted with a forged client_user_id would have
-- it overwritten by the BEFORE INSERT trigger anyway.

-- The pandit_deliverables_client_ack policy (UPDATE for ack timestamps)
-- has the same protection: client_user_id = auth.uid() AND visibility =
-- 'client_pushed'. The trigger ensures client_user_id is the parent's
-- value; the visibility check ensures the Pandit had explicitly pushed it.
