-- 069_nps_inapp_modal.sql
--
-- Adds dedup tracker for the in-app NPS modal that backfills the
-- ~99%-ignored email NPS prompt. Triggered for users where the email
-- went out ≥7 days ago AND no nps_responses row exists yet.
--
-- See: src/app/api/feedback/nps-inapp/route.ts
--     src/components/feedback/NpsModal.tsx
--
-- Why a column on user_profiles (not a new table): we already key NPS
-- send-state off user_profiles.nps_feedback_sent_at; keeping the modal
-- shown-state on the same row means the eligibility query is one
-- single-row read per signed-in user, no JOIN.
--
-- nps_modal_shown_at is set when the user EITHER submits a score OR
-- explicitly dismisses ("Not now"). Both paths write through the API
-- route, never the client directly — RLS keeps the column writable only
-- via service-role (the route uses the server client).

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS nps_modal_shown_at TIMESTAMPTZ NULL;

COMMENT ON COLUMN public.user_profiles.nps_modal_shown_at IS
  'Set once when the in-app NPS modal is dismissed or submitted. Null until then. See /api/feedback/nps-inapp.';

-- Partial index on the eligibility predicate. The eligibility query
-- only ever scans rows where:
--   * nps_feedback_sent_at IS NOT NULL     (email already went out)
--   * nps_modal_shown_at IS NULL            (modal not yet seen)
-- which is the small frontier of "due for a modal" users.
CREATE INDEX IF NOT EXISTS user_profiles_nps_modal_due_idx
  ON public.user_profiles (nps_feedback_sent_at)
  WHERE nps_feedback_sent_at IS NOT NULL AND nps_modal_shown_at IS NULL;
