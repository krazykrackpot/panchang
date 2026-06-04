-- 057 — pandit_deliverables.client_seen_at: preserve first-seen timestamp
--
-- The /api/seeker/pandit-deliverables PATCH route always writes
-- client_seen_at = now() on both 'seen' and 'ack' actions, which
-- destroys the historical accuracy of when the client FIRST opened
-- the deliverable. The seeker dashboard timeline shows "First viewed
-- on …" — that field must point to the FIRST view, not the latest.
--
-- Fix: a BEFORE UPDATE trigger that coalesces — `client_seen_at`
-- transitions null → timestamp ONCE and then becomes immutable.
-- Pushes the invariant down to the DB so future callers (mobile app,
-- 3rd-party integrations, manual SQL) can't violate it.
--
-- Gemini PR #406 round P10 narrative #5.

CREATE OR REPLACE FUNCTION public.preserve_first_seen_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow client_seen_at to transition null → non-null. Any
  -- subsequent UPDATE that tries to change it (including back to null)
  -- silently retains the existing value.
  IF OLD.client_seen_at IS NOT NULL THEN
    NEW.client_seen_at := OLD.client_seen_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.preserve_first_seen_at() IS
  'Pandit CRM P10. Makes pandit_deliverables.client_seen_at immutable once set so the seeker timeline always shows the FIRST-view timestamp.';

DROP TRIGGER IF EXISTS pandit_deliverables_first_seen_at ON public.pandit_deliverables;

CREATE TRIGGER pandit_deliverables_first_seen_at
  BEFORE UPDATE OF client_seen_at ON public.pandit_deliverables
  FOR EACH ROW
  EXECUTE FUNCTION public.preserve_first_seen_at();
