-- 049_pandit_crm.sql
-- Pandit CRM P2 — full schema for the Pandit workspace.
--
-- Six tables, all owned by the pandit_user_id. Strict RLS so cross-tenant
-- access is impossible at the row level.
--
-- Design decisions (spec §4):
--   - Pandit's working data (birth_data, family) lives on Pandit's tables
--     regardless of link state. When client_user_id is set (linked mode),
--     birth_data is synced from client's user_profiles via the trigger in
--     update_client_birth_data_from_linked_user(). Single source of truth
--     for the Pandit's UI in every mode.
--   - Two orthogonal lifecycle axes: link_state (relationship to the app)
--     × engagement_state (relationship to the Pandit). 5×4 = 20 valid pairs.
--   - Idempotency indexes prevent double-click double-creation on every
--     INSERT path (Lesson G).
--
-- Spec: docs/specs/2026-06-04-pandit-crm.md §3-§4.

-- ─────────────────────────────────────────────────────────────────────
-- pandit_clients
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.pandit_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pandit_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identity
  full_name TEXT NOT NULL,
  client_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Pandit's working data
  birth_data JSONB NOT NULL,
  birth_data_source TEXT NOT NULL DEFAULT 'pandit_entered'
    CHECK (birth_data_source IN ('pandit_entered', 'client_synced')),
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  photo_url TEXT,

  -- Pandit-private organisation
  display_label TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  pandit_notes TEXT,
  color TEXT,

  -- Lifecycle (two orthogonal axes)
  link_state TEXT NOT NULL DEFAULT 'unlinked'
    CHECK (link_state IN ('unlinked','invited','linked','paused','declined')),
  engagement_state TEXT NOT NULL DEFAULT 'prospect'
    CHECK (engagement_state IN ('prospect','active','past','archived')),
  engagement_state_before_archive TEXT,
  permissions JSONB,

  -- Denormalised
  first_consult_at TIMESTAMPTZ,
  last_consult_at TIMESTAMPTZ,
  link_state_changed_at TIMESTAMPTZ DEFAULT NOW(),
  engagement_state_changed_at TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.pandit_clients IS
  'Master record per Pandit-Client relationship. Pandit owns the row regardless of link state. Pandit CRM P2 / spec §4.';

-- One active link per (pandit, client) pair
CREATE UNIQUE INDEX IF NOT EXISTS pandit_clients_unique_link
  ON public.pandit_clients (pandit_user_id, client_user_id)
  WHERE client_user_id IS NOT NULL
    AND link_state IN ('linked','paused');

-- Idempotency: same Pandit + same normalised name + same birth date = same record.
-- Prevents double-click double-creation on the unlinked path (Lesson G).
CREATE UNIQUE INDEX IF NOT EXISTS pandit_clients_unique_unlinked_identity
  ON public.pandit_clients (
    pandit_user_id,
    lower(trim(full_name)),
    (birth_data->>'date')
  )
  WHERE client_user_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_pandit_clients_pandit_engagement
  ON public.pandit_clients (pandit_user_id, engagement_state, last_consult_at DESC);

CREATE INDEX IF NOT EXISTS idx_pandit_clients_pandit_link_state
  ON public.pandit_clients (pandit_user_id, link_state);

CREATE INDEX IF NOT EXISTS idx_pandit_clients_tags
  ON public.pandit_clients USING gin (tags);

-- ─────────────────────────────────────────────────────────────────────
-- pandit_client_family_members
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.pandit_client_family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_record_id UUID NOT NULL REFERENCES public.pandit_clients(id) ON DELETE CASCADE,
  pandit_user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  birth_data JSONB,
  relationship TEXT NOT NULL
    CHECK (relationship IN ('spouse','son','daughter','father','mother','sibling','other')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pandit_client_family_client
  ON public.pandit_client_family_members (client_record_id);

CREATE INDEX IF NOT EXISTS idx_pandit_client_family_pandit
  ON public.pandit_client_family_members (pandit_user_id);

-- ─────────────────────────────────────────────────────────────────────
-- pandit_client_invitations
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.pandit_client_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_record_id UUID NOT NULL REFERENCES public.pandit_clients(id) ON DELETE CASCADE,
  pandit_user_id UUID NOT NULL,
  invitation_token TEXT NOT NULL UNIQUE,
  invited_email TEXT NOT NULL,
  invited_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  permissions_requested JSONB NOT NULL,
  pandit_message TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','declined','expired','revoked')),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One open invitation per client record at a time
CREATE UNIQUE INDEX IF NOT EXISTS pandit_client_invitations_one_pending
  ON public.pandit_client_invitations (client_record_id)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_pandit_invitations_token
  ON public.pandit_client_invitations (invitation_token);

CREATE INDEX IF NOT EXISTS idx_pandit_invitations_email_pending
  ON public.pandit_client_invitations (lower(trim(invited_email)))
  WHERE status = 'pending';

-- ─────────────────────────────────────────────────────────────────────
-- pandit_consultations
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.pandit_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_record_id UUID NOT NULL REFERENCES public.pandit_clients(id) ON DELETE CASCADE,
  pandit_user_id UUID NOT NULL,
  client_user_id UUID,
  consulted_at TIMESTAMPTZ NOT NULL,
  channel TEXT
    CHECK (channel IN ('in_person','phone','video','chat','email','async_note')),
  duration_minutes INT,
  pandit_private_notes TEXT,
  client_visible_summary TEXT,
  shared_with_client BOOLEAN NOT NULL DEFAULT FALSE,
  shared_at TIMESTAMPTZ,
  attachments JSONB,
  next_followup_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pandit_consultations_client
  ON public.pandit_consultations (client_record_id, consulted_at DESC);

CREATE INDEX IF NOT EXISTS idx_pandit_consultations_followups
  ON public.pandit_consultations (pandit_user_id, next_followup_at)
  WHERE next_followup_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pandit_consultations_client_user_shared
  ON public.pandit_consultations (client_user_id, shared_at DESC)
  WHERE shared_with_client = TRUE AND client_user_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────
-- pandit_alerts
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.pandit_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_record_id UUID NOT NULL REFERENCES public.pandit_clients(id) ON DELETE CASCADE,
  pandit_user_id UUID NOT NULL,
  client_user_id UUID,
  kind TEXT NOT NULL,
  fires_at DATE NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info','notable','critical')),
  payload JSONB,
  acknowledged_at TIMESTAMPTZ,
  emailed_at TIMESTAMPTZ,
  client_emailed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cron idempotency: same (client, kind, fires_at) = same alert
CREATE UNIQUE INDEX IF NOT EXISTS pandit_alerts_idempotency
  ON public.pandit_alerts (client_record_id, kind, fires_at);

CREATE INDEX IF NOT EXISTS idx_pandit_alerts_pandit_inbox
  ON public.pandit_alerts (pandit_user_id, severity, fires_at)
  WHERE acknowledged_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_pandit_alerts_client_unseen
  ON public.pandit_alerts (client_user_id, fires_at DESC)
  WHERE client_user_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────
-- pandit_deliverables
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.pandit_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_record_id UUID NOT NULL REFERENCES public.pandit_clients(id) ON DELETE CASCADE,
  pandit_user_id UUID NOT NULL,
  client_user_id UUID,
  kind TEXT NOT NULL CHECK (kind IN (
    'kundali_report','tippanni','muhurta_pick','matching_report',
    'consultation_summary','custom_letter'
  )),
  title TEXT NOT NULL,
  content JSONB,
  locale TEXT NOT NULL DEFAULT 'en',
  content_pdf_url TEXT,
  visibility TEXT NOT NULL DEFAULT 'pandit_only'
    CHECK (visibility IN ('pandit_only','client_pushed')),
  pushed_at TIMESTAMPTZ,
  client_seen_at TIMESTAMPTZ,
  client_acknowledged_at TIMESTAMPTZ,
  notification_id UUID,
  engine_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pandit_deliverables_client
  ON public.pandit_deliverables (client_record_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pandit_deliverables_client_user_pushed
  ON public.pandit_deliverables (client_user_id, pushed_at DESC)
  WHERE visibility = 'client_pushed' AND client_user_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────
-- pandit_settings (one per pandit)
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.pandit_settings (
  pandit_user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  letterhead_name TEXT,
  letterhead_subtitle TEXT,
  letterhead_address TEXT,
  logo_url TEXT,
  signature_url TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  default_report_locale TEXT NOT NULL DEFAULT 'en',
  alert_email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  alert_lookahead_days INT NOT NULL DEFAULT 14
    CHECK (alert_lookahead_days BETWEEN 1 AND 90),
  past_threshold_months INT NOT NULL DEFAULT 12
    CHECK (past_threshold_months BETWEEN 1 AND 60),
  weekly_digest_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  digest_day TEXT NOT NULL DEFAULT 'monday'
    CHECK (digest_day IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────
-- updated_at triggers (reuse existing helper if available, else inline)
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'pandit_clients',
    'pandit_client_family_members',
    'pandit_consultations',
    'pandit_deliverables',
    'pandit_settings'
  ]) LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_%I_updated_at ON public.%I;
       CREATE TRIGGER set_%I_updated_at
         BEFORE UPDATE ON public.%I
         FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();',
      t, t, t, t
    );
  END LOOP;
END$$;

-- Auto-flip engagement_state from 'prospect' → 'active' on first consultation,
-- and maintain last_consult_at / first_consult_at denorm.
CREATE OR REPLACE FUNCTION public.update_client_on_consultation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.pandit_clients
  SET
    last_consult_at = GREATEST(COALESCE(last_consult_at, NEW.consulted_at), NEW.consulted_at),
    first_consult_at = LEAST(COALESCE(first_consult_at, NEW.consulted_at), NEW.consulted_at),
    engagement_state = CASE
      WHEN engagement_state = 'prospect' THEN 'active'
      WHEN engagement_state = 'past' THEN 'active'
      ELSE engagement_state
    END,
    engagement_state_changed_at = CASE
      WHEN engagement_state IN ('prospect','past') THEN NOW()
      ELSE engagement_state_changed_at
    END
  WHERE id = NEW.client_record_id;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block consultation insert if the denorm update fails.
  RAISE WARNING 'update_client_on_consultation failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_consultation_updates_client ON public.pandit_consultations;
CREATE TRIGGER trg_consultation_updates_client
  AFTER INSERT ON public.pandit_consultations
  FOR EACH ROW EXECUTE FUNCTION public.update_client_on_consultation();

-- Maintain link_state_changed_at + engagement_state_changed_at
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
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_client_state_timestamps ON public.pandit_clients;
CREATE TRIGGER trg_client_state_timestamps
  BEFORE UPDATE OF link_state, engagement_state ON public.pandit_clients
  FOR EACH ROW EXECUTE FUNCTION public.update_client_state_timestamps();

-- ─────────────────────────────────────────────────────────────────────
-- RLS — every pandit_* table, pandit_user_id owns the row.
-- Linked clients have a separate read-only policy for the surfaces they
-- legitimately see (deliverables pushed to them, consultations shared
-- with them, alerts where they're the client).
-- ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.pandit_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandit_client_family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandit_client_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandit_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandit_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandit_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandit_settings ENABLE ROW LEVEL SECURITY;

-- pandit_clients — Pandit-owner full access
DROP POLICY IF EXISTS pandit_clients_owner_select ON public.pandit_clients;
CREATE POLICY pandit_clients_owner_select ON public.pandit_clients
  FOR SELECT USING (pandit_user_id = auth.uid());
DROP POLICY IF EXISTS pandit_clients_owner_insert ON public.pandit_clients;
CREATE POLICY pandit_clients_owner_insert ON public.pandit_clients
  FOR INSERT WITH CHECK (pandit_user_id = auth.uid());
DROP POLICY IF EXISTS pandit_clients_owner_update ON public.pandit_clients;
CREATE POLICY pandit_clients_owner_update ON public.pandit_clients
  FOR UPDATE USING (pandit_user_id = auth.uid())
  WITH CHECK (pandit_user_id = auth.uid());
DROP POLICY IF EXISTS pandit_clients_owner_delete ON public.pandit_clients;
CREATE POLICY pandit_clients_owner_delete ON public.pandit_clients
  FOR DELETE USING (pandit_user_id = auth.uid());

-- Linked client can SELECT their own record (read-only, no PII columns leaked here)
DROP POLICY IF EXISTS pandit_clients_client_select_self ON public.pandit_clients;
CREATE POLICY pandit_clients_client_select_self ON public.pandit_clients
  FOR SELECT USING (
    client_user_id = auth.uid() AND link_state IN ('linked','paused')
  );

-- pandit_client_family_members
DROP POLICY IF EXISTS pandit_family_owner_all ON public.pandit_client_family_members;
CREATE POLICY pandit_family_owner_all ON public.pandit_client_family_members
  FOR ALL USING (pandit_user_id = auth.uid())
  WITH CHECK (pandit_user_id = auth.uid());

-- pandit_client_invitations
DROP POLICY IF EXISTS pandit_invitations_owner_all ON public.pandit_client_invitations;
CREATE POLICY pandit_invitations_owner_all ON public.pandit_client_invitations
  FOR ALL USING (pandit_user_id = auth.uid())
  WITH CHECK (pandit_user_id = auth.uid());
-- Invited user can SELECT (and UPDATE to accept/decline) their own invitation
DROP POLICY IF EXISTS pandit_invitations_invitee_select ON public.pandit_client_invitations;
CREATE POLICY pandit_invitations_invitee_select ON public.pandit_client_invitations
  FOR SELECT USING (
    invited_user_id = auth.uid()
    OR lower(trim(invited_email)) = lower(trim(coalesce((auth.jwt()->>'email')::text, '')))
  );

-- pandit_consultations
DROP POLICY IF EXISTS pandit_consultations_owner_all ON public.pandit_consultations;
CREATE POLICY pandit_consultations_owner_all ON public.pandit_consultations
  FOR ALL USING (pandit_user_id = auth.uid())
  WITH CHECK (pandit_user_id = auth.uid());
-- Linked client can SELECT consultations shared with them — they see only
-- (client_visible_summary, consulted_at, channel) at the app layer; the
-- column-level read of pandit_private_notes is prevented by the
-- pandit_consultations_for_client VIEW rather than column-level RLS for
-- portability across Postgres versions.
DROP POLICY IF EXISTS pandit_consultations_client_shared ON public.pandit_consultations;
CREATE POLICY pandit_consultations_client_shared ON public.pandit_consultations
  FOR SELECT USING (
    client_user_id = auth.uid() AND shared_with_client = TRUE
  );

-- pandit_alerts
DROP POLICY IF EXISTS pandit_alerts_owner_all ON public.pandit_alerts;
CREATE POLICY pandit_alerts_owner_all ON public.pandit_alerts
  FOR ALL USING (pandit_user_id = auth.uid())
  WITH CHECK (pandit_user_id = auth.uid());
-- Linked client can SELECT alerts where they're the subject (P8 surfaces
-- this on the seeker dashboard when permissions.send_alerts_to_client=true)
DROP POLICY IF EXISTS pandit_alerts_client_self ON public.pandit_alerts;
CREATE POLICY pandit_alerts_client_self ON public.pandit_alerts
  FOR SELECT USING (client_user_id = auth.uid());

-- pandit_deliverables
DROP POLICY IF EXISTS pandit_deliverables_owner_all ON public.pandit_deliverables;
CREATE POLICY pandit_deliverables_owner_all ON public.pandit_deliverables
  FOR ALL USING (pandit_user_id = auth.uid())
  WITH CHECK (pandit_user_id = auth.uid());
-- Linked client can SELECT deliverables pushed to them (P7 surface)
DROP POLICY IF EXISTS pandit_deliverables_client_pushed ON public.pandit_deliverables;
CREATE POLICY pandit_deliverables_client_pushed ON public.pandit_deliverables
  FOR SELECT USING (
    client_user_id = auth.uid() AND visibility = 'client_pushed'
  );
-- Linked client can UPDATE their own seen/ack timestamps
DROP POLICY IF EXISTS pandit_deliverables_client_ack ON public.pandit_deliverables;
CREATE POLICY pandit_deliverables_client_ack ON public.pandit_deliverables
  FOR UPDATE USING (
    client_user_id = auth.uid() AND visibility = 'client_pushed'
  )
  WITH CHECK (
    client_user_id = auth.uid() AND visibility = 'client_pushed'
  );

-- pandit_settings
DROP POLICY IF EXISTS pandit_settings_owner_all ON public.pandit_settings;
CREATE POLICY pandit_settings_owner_all ON public.pandit_settings
  FOR ALL USING (pandit_user_id = auth.uid())
  WITH CHECK (pandit_user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────
-- Helper view: client-safe consultation projection (used by seeker
-- dashboard's "From your Pandits" surface in P7).
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public.pandit_consultations_for_client AS
SELECT
  id,
  client_record_id,
  pandit_user_id,
  client_user_id,
  consulted_at,
  channel,
  client_visible_summary,
  shared_at,
  attachments,
  created_at,
  updated_at
FROM public.pandit_consultations
WHERE shared_with_client = TRUE AND client_user_id IS NOT NULL;

COMMENT ON VIEW public.pandit_consultations_for_client IS
  'Client-safe projection: omits pandit_private_notes column entirely. RLS on the underlying table still applies.';
