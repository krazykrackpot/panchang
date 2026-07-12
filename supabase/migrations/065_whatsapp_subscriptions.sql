-- WhatsApp daily-panchang subscriptions.
--
-- Three tables:
--   user_whatsapp_subscriptions  — who, when, locale, phone, verification state
--   whatsapp_send_log            — one row per (subscription, day); idempotency + cost
--   whatsapp_inbound_log         — replies (STOP, queries) from users
--
-- Design doc: docs/specs/2026-06-15-whatsapp-daily-panchang.md §4
-- Operator setup: docs/runbooks/whatsapp-waba-setup.md

CREATE TABLE user_whatsapp_subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  phone_e164              TEXT NOT NULL,
  locale                  TEXT NOT NULL,
  timezone                TEXT NOT NULL,
  send_time_local         TIME NOT NULL DEFAULT '06:00',
  send_at_sunrise         BOOLEAN NOT NULL DEFAULT FALSE,

  -- Verification (6-digit OTP, stored hashed)
  verification_code_hash  TEXT,
  verification_expires_at TIMESTAMPTZ,
  -- Brute-force attempt counter — persisted because serverless containers
  -- are ephemeral and an in-memory Map can be bypassed by routing to
  -- a fresh container. Reset to 0 when a fresh OTP is issued via /optin.
  -- (Gemini PR #706 round-3 security-medium)
  verification_attempts   INT NOT NULL DEFAULT 0,
  verified_at             TIMESTAMPTZ,

  -- Lifecycle
  opted_in_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  opted_in_source         TEXT NOT NULL DEFAULT 'dashboard',
  opted_out_at            TIMESTAMPTZ,
  opt_out_reason          TEXT,

  -- Format guard: E.164 with country code, 7-15 digits
  CONSTRAINT phone_e164_format
    CHECK (phone_e164 ~ '^\+[1-9][0-9]{6,14}$'),
  -- Locale must be one of our visible 9
  CONSTRAINT valid_locale
    CHECK (locale IN ('en','hi','ta','te','bn','gu','kn','mai','mr')),
  -- send_time_local is bucketed to the top of the hour
  CONSTRAINT send_time_is_top_of_hour
    CHECK (EXTRACT(MINUTE FROM send_time_local) = 0
           AND EXTRACT(SECOND FROM send_time_local) = 0),
  -- opt_out_reason categories
  CONSTRAINT valid_opt_out_reason
    CHECK (opt_out_reason IS NULL OR opt_out_reason IN (
      'user_reply_stop', 'user_dashboard', 'invalid_number',
      'blocked', 'account_deleted', 'admin'
    ))
);

-- Partial unique indexes: only ONE active subscription per user, and only ONE
-- per phone number. Allows a user to opt-out then opt-in again with a new
-- phone (history row remains); allows the same phone to be reused after
-- account deletion. We can't use a constraint here because Postgres
-- constraints don't support WHERE clauses; partial indexes do the job.
CREATE UNIQUE INDEX idx_wa_subs_one_active_per_user
  ON user_whatsapp_subscriptions (user_id)
  WHERE opted_out_at IS NULL;

CREATE UNIQUE INDEX idx_wa_subs_one_active_per_phone
  ON user_whatsapp_subscriptions (phone_e164)
  WHERE opted_out_at IS NULL;

-- Fast lookup for the hourly cron: "give me all active subscriptions whose
-- local send-time matches the current UTC hour for their timezone"
CREATE INDEX idx_wa_subs_active_by_send_time
  ON user_whatsapp_subscriptions (timezone, send_time_local)
  WHERE verified_at IS NOT NULL AND opted_out_at IS NULL;

-- Index for the verification flow lookup (find pending by user)
CREATE INDEX idx_wa_subs_pending_verification
  ON user_whatsapp_subscriptions (user_id, verification_expires_at)
  WHERE verified_at IS NULL AND opted_out_at IS NULL;

-- ─────────────────────────────────────────────────────────────────────────
-- whatsapp_send_log
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE whatsapp_send_log (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id          UUID NOT NULL REFERENCES user_whatsapp_subscriptions(id) ON DELETE CASCADE,

  panchang_date            DATE NOT NULL,
  sent_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),

  whatsapp_message_id      TEXT,         -- Meta-assigned ID for delivery receipt correlation
  template_name            TEXT NOT NULL,
  template_lang            TEXT NOT NULL,

  status                   TEXT NOT NULL DEFAULT 'pending',
  failure_code             TEXT,
  failure_message          TEXT,

  -- Estimated cost in micro-USD (1e-6 USD). India utility ≈ 12000–14000 micros.
  -- Filled at send-time from a hardcoded rate table; reconciled monthly
  -- against Meta's actual invoice in future.
  cost_micros              BIGINT NOT NULL DEFAULT 0,

  -- One send per subscription per day. Cron retries become no-ops.
  CONSTRAINT one_send_per_day
    UNIQUE (subscription_id, panchang_date),

  CONSTRAINT valid_status
    CHECK (status IN ('pending', 'sent', 'delivered', 'read',
                      'failed', 'skipped_budget', 'skipped_paused'))
);

CREATE INDEX idx_wa_log_recent
  ON whatsapp_send_log (sent_at DESC);

-- Index for cost-rollup queries (filter by month, sum cost_micros)
CREATE INDEX idx_wa_log_mtd_cost
  ON whatsapp_send_log (sent_at)
  WHERE status NOT IN ('skipped_budget', 'skipped_paused');

-- Index for delivery-receipt webhook lookups (find log row by whatsapp_message_id)
CREATE INDEX idx_wa_log_by_message_id
  ON whatsapp_send_log (whatsapp_message_id)
  WHERE whatsapp_message_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────
-- whatsapp_inbound_log
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE whatsapp_inbound_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_e164      TEXT NOT NULL,
  message_body    TEXT,                  -- truncated to 200 chars on insert (privacy)
  classification  TEXT,                  -- 'stop' | 'help' | 'other'
  received_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_classification
    CHECK (classification IS NULL OR classification IN ('stop', 'help', 'other'))
);

CREATE INDEX idx_wa_inbound_recent
  ON whatsapp_inbound_log (received_at DESC);

-- Truncate inbound bodies at 200 chars (privacy hygiene; we only need
-- enough text to detect STOP / HELP keywords)
CREATE OR REPLACE FUNCTION truncate_inbound_body() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.message_body IS NOT NULL AND length(NEW.message_body) > 200 THEN
    NEW.message_body := substring(NEW.message_body FROM 1 FOR 200);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_wa_inbound_truncate
  BEFORE INSERT ON whatsapp_inbound_log
  FOR EACH ROW EXECUTE FUNCTION truncate_inbound_body();

-- ─────────────────────────────────────────────────────────────────────────
-- Row-Level Security
-- ─────────────────────────────────────────────────────────────────────────

ALTER TABLE user_whatsapp_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_send_log           ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_inbound_log        ENABLE ROW LEVEL SECURITY;

-- Subscriptions: user can see/manage only their own row
CREATE POLICY wa_subs_self_read ON user_whatsapp_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY wa_subs_self_update ON user_whatsapp_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY wa_subs_self_insert ON user_whatsapp_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
-- DELETE not exposed to users — opt-out is a soft delete via UPDATE

-- ─────────────────────────────────────────────────────────────────────────
-- Field-level guards (Gemini PR #706 security-critical + security-high)
-- ─────────────────────────────────────────────────────────────────────────
--
-- Row-level security alone is not enough here. The verified_at column is
-- the boolean gate between "filled out a form" and "owns this phone
-- number"; a user with self-write access could set it directly via the
-- Supabase JS client and skip the OTP loop. Similarly, phone_e164 must be
-- immutable on an active row: otherwise a verified user could swap the
-- number to an arbitrary one and continue receiving messages OR direct
-- our cron to spam someone else's number.
--
-- This trigger runs as SECURITY DEFINER so it can read both the JWT-claim
-- role (HTTP context via PostgREST) AND the actual Postgres current_user
-- (non-HTTP contexts: psql, supabase_admin connections, background workers).
--
-- BYPASS POLICY (Gemini PR #706 round-2 SECURITY-HIGH):
--   The previous version bypassed when `current_setting('request.jwt.claim.role')`
--   returned 'service_role' OR NULL. NULL was the security hole — any
--   non-HTTP connection (direct psql, background worker, internal trigger)
--   would have the GUC unset and silently bypass every check.
--
--   New rule: bypass ONLY if BOTH (a) we're in an explicitly trusted
--   Postgres role AND (b) the JWT claim is also service_role-or-unset.
--   Trusted roles are the connections Supabase itself uses for migrations,
--   replication, and service-role HTTP traffic. Any other current_user
--   value (anon, authenticated, etc.) goes through the guards.
CREATE OR REPLACE FUNCTION wa_subs_field_guard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pg_role  TEXT := current_user;
  jwt_role TEXT := current_setting('request.jwt.claim.role', true);
  is_trusted BOOLEAN;
BEGIN
  -- (a) Trusted Postgres roles: service_role (Supabase server-side),
  --     postgres + supabase_admin (migration / DBA), supabase_storage_admin
  --     (background workers). Anon + authenticated must NOT bypass.
  -- (b) When called via PostgREST, jwt_role is set; anything OTHER than
  --     'service_role' (e.g. 'authenticated' for a logged-in user) MUST
  --     hit the guards regardless of pg_role.
  is_trusted := (
    pg_role IN ('service_role', 'postgres', 'supabase_admin', 'supabase_storage_admin')
    AND (jwt_role IS NULL OR jwt_role = 'service_role')
  );

  IF is_trusted THEN
    RETURN NEW;
  END IF;

  -- ─── INSERT path ─────────────────────────────────────────────────────
  -- Users can create their own pending-verification row, but they cannot
  -- mark it as already verified. They can populate the verification_*
  -- fields only via the OTP API route (which runs as service_role).
  IF TG_OP = 'INSERT' THEN
    IF NEW.verified_at IS NOT NULL THEN
      RAISE EXCEPTION 'wa_subs: users cannot set verified_at directly';
    END IF;
    IF NEW.verification_code_hash IS NOT NULL OR NEW.verification_expires_at IS NOT NULL THEN
      RAISE EXCEPTION 'wa_subs: users cannot set verification fields directly; use the OTP API';
    END IF;
    IF NEW.verification_attempts IS DISTINCT FROM 0 THEN
      RAISE EXCEPTION 'wa_subs: verification_attempts must start at 0';
    END IF;
    RETURN NEW;
  END IF;

  -- ─── UPDATE path ─────────────────────────────────────────────────────
  -- The only field a user is allowed to mutate post-insert is
  -- opted_out_at (for self-opt-out) and opt_out_reason. Everything else
  -- — id, user_id, phone_e164, locale, timezone, send_time_local,
  -- send_at_sunrise, verified_at, verification_*, opted_in_at,
  -- opted_in_source — must go through the API as service_role.
  --
  -- opted_in_source is the Meta-compliance audit trail proving where the
  -- consent came from ('dashboard' / 'onboarding_step_4' / 'admin').
  -- Allowing users to mutate it post-insert would invalidate the audit log.
  -- (Gemini PR #706 round-2 SECURITY-HIGH)
  IF TG_OP = 'UPDATE' THEN
    IF NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'wa_subs: id is immutable';
    END IF;
    IF NEW.phone_e164 IS DISTINCT FROM OLD.phone_e164 THEN
      RAISE EXCEPTION 'wa_subs: phone_e164 is immutable; opt out and create a new subscription';
    END IF;
    IF NEW.verified_at IS DISTINCT FROM OLD.verified_at THEN
      RAISE EXCEPTION 'wa_subs: users cannot change verified_at; use the OTP API';
    END IF;
    IF NEW.verification_code_hash IS DISTINCT FROM OLD.verification_code_hash
       OR NEW.verification_expires_at IS DISTINCT FROM OLD.verification_expires_at
       OR NEW.verification_attempts IS DISTINCT FROM OLD.verification_attempts THEN
      RAISE EXCEPTION 'wa_subs: users cannot change verification fields; use the OTP API';
    END IF;
    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'wa_subs: user_id is immutable';
    END IF;
    IF NEW.opted_in_at IS DISTINCT FROM OLD.opted_in_at THEN
      RAISE EXCEPTION 'wa_subs: opted_in_at is immutable';
    END IF;
    IF NEW.opted_in_source IS DISTINCT FROM OLD.opted_in_source THEN
      RAISE EXCEPTION 'wa_subs: opted_in_source is immutable (audit-trail)';
    END IF;
    -- locale / timezone / send_time_local / send_at_sunrise: also blocked
    -- on the client. To change these, the API runs an UPDATE as service_role
    -- (which bypasses this trigger via the early return above).
    IF NEW.locale IS DISTINCT FROM OLD.locale
       OR NEW.timezone IS DISTINCT FROM OLD.timezone
       OR NEW.send_time_local IS DISTINCT FROM OLD.send_time_local
       OR NEW.send_at_sunrise IS DISTINCT FROM OLD.send_at_sunrise THEN
      RAISE EXCEPTION 'wa_subs: locale/timezone/send-time changes must go through the API';
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER tr_wa_subs_field_guard
  BEFORE INSERT OR UPDATE ON user_whatsapp_subscriptions
  FOR EACH ROW EXECUTE FUNCTION wa_subs_field_guard();

-- Send log: users can read their own send history (helpful for "show me last
-- 7 days of panchang messages" UI later); writes are service-role only
CREATE POLICY wa_log_self_read ON whatsapp_send_log
  FOR SELECT USING (
    subscription_id IN (SELECT id FROM user_whatsapp_subscriptions WHERE user_id = auth.uid())
  );

-- Inbound log: service-role only (no user policies — they never read it)
-- (Note: anonymous webhook handler authenticates by signature verification,
-- not Supabase auth, then uses service_role to insert.)
