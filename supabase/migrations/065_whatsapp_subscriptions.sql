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

-- Send log: users can read their own send history (helpful for "show me last
-- 7 days of panchang messages" UI later); writes are service-role only
CREATE POLICY wa_log_self_read ON whatsapp_send_log
  FOR SELECT USING (
    subscription_id IN (SELECT id FROM user_whatsapp_subscriptions WHERE user_id = auth.uid())
  );

-- Inbound log: service-role only (no user policies — they never read it)
-- (Note: anonymous webhook handler authenticates by signature verification,
-- not Supabase auth, then uses service_role to insert.)
