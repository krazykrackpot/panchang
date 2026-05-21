-- 028_brihaspati.sql
-- Brihaspati AI Astrologer — schema for paid question/answer flow, credit ledger,
-- subscription state, webhook idempotency, training-data flywheel (§11), and
-- GDPR deletion ledger.
--
-- Companion to: docs/superpowers/specs/2026-05-21-brihaspati-ai-astrologer-design.md
-- All trigger-safety rules per CLAUDE.md: SECURITY DEFINER + SET search_path = public
-- + EXCEPTION WHEN OTHERS THEN RETURN NEW. Idempotency via UNIQUE constraints on
-- natural keys (payment_ref, webhook event id).

-- ============================================================
-- Helper: shared updated_at trigger function
-- ============================================================
-- Used by every mutable Brihaspati table. Idempotent definition.
CREATE OR REPLACE FUNCTION public.brihaspati_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================
-- Table: brihaspati_questions
-- One row per paid question. Carries the answer, validation result,
-- token counts, payment trail, and (§11) training-data fields.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.brihaspati_questions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question                TEXT NOT NULL,
  answer                  TEXT,
  locale                  TEXT NOT NULL DEFAULT 'en'
                          CHECK (locale IN ('en','hi','ta','bn','sa','te','kn','mr','gu','mai')),
  query_category          TEXT
                          CHECK (query_category IS NULL OR query_category IN (
                            'career','marriage','health','finance','children','education',
                            'dasha','remedies','compatibility','timing','transit','general'
                          )),
  tier                    SMALLINT
                          CHECK (tier IS NULL OR tier IN (0, 1, 2)),
  model_used              TEXT,
  pricing_tier            TEXT
                          CHECK (pricing_tier IS NULL OR pricing_tier IN ('single','pack_5','monthly','annual')),
  provider                TEXT
                          CHECK (provider IS NULL OR provider IN ('razorpay','stripe','credit','subscription')),
  payment_ref             TEXT,
  payment_verified        BOOLEAN NOT NULL DEFAULT FALSE,
  birth_data_used         BOOLEAN NOT NULL DEFAULT FALSE,
  validation_passed       BOOLEAN,
  validation_failures     JSONB,
  retry_count             SMALLINT NOT NULL DEFAULT 0 CHECK (retry_count >= 0),
  status                  TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','streaming','completed','failed')),
  input_tokens            INTEGER CHECK (input_tokens IS NULL OR input_tokens >= 0),
  output_tokens           INTEGER CHECK (output_tokens IS NULL OR output_tokens >= 0),
  -- training-data flywheel (spec §11)
  context_json            JSONB,
  engine_version          TEXT,
  system_prompt_version   TEXT,
  user_rating             SMALLINT NOT NULL DEFAULT 0 CHECK (user_rating IN (-1, 0, 1)),
  user_rating_reason      TEXT,
  training_eligible       BOOLEAN,
  training_opt_out        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at            TIMESTAMPTZ
);

COMMENT ON COLUMN public.brihaspati_questions.context_json IS
  'Structured Layer-2 JSON context passed to the LLM. Shape: { chart: {...}, dashas: [...], yogas: [...], doshas: [...], transits: [...], analysis: {...} }. Required for §11 training reuse.';
COMMENT ON COLUMN public.brihaspati_questions.engine_version IS
  'ENGINE_VERSION (hash of computation pipeline) at the time the context was built. Used to filter stale training pairs.';
COMMENT ON COLUMN public.brihaspati_questions.system_prompt_version IS
  'sha256 of the system prompt used for narration. Lets us group / re-train when the prompt evolves.';
COMMENT ON COLUMN public.brihaspati_questions.training_eligible IS
  'Nightly cron sets this true when row passes all §11 filters (validation, length, age, rating, opt-out). NULL until the cron has examined the row.';
COMMENT ON COLUMN public.brihaspati_questions.training_opt_out IS
  'Snapshot of user_profiles.brihaspati_training_opt_out at write time. Preserves user state at the moment of the question.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_brihaspati_questions_user_created
  ON public.brihaspati_questions (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_brihaspati_questions_status_pending_failed
  ON public.brihaspati_questions (status)
  WHERE status IN ('pending', 'failed');

CREATE INDEX IF NOT EXISTS idx_brihaspati_questions_training
  ON public.brihaspati_questions (training_eligible, query_category, locale)
  WHERE training_eligible = TRUE AND training_opt_out = FALSE;

-- Idempotency: each external payment can be applied to at most one question row.
-- Partial unique index so multiple NULL payment_refs (pre-payment) are allowed.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_brihaspati_questions_payment
  ON public.brihaspati_questions (provider, payment_ref)
  WHERE payment_ref IS NOT NULL;

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_brihaspati_questions_updated_at ON public.brihaspati_questions;
CREATE TRIGGER trg_brihaspati_questions_updated_at
  BEFORE UPDATE ON public.brihaspati_questions
  FOR EACH ROW EXECUTE FUNCTION public.brihaspati_set_updated_at();

-- RLS
ALTER TABLE public.brihaspati_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own_questions" ON public.brihaspati_questions;
CREATE POLICY "users_select_own_questions"
  ON public.brihaspati_questions FOR SELECT
  USING (auth.uid() = user_id);
-- Threat mitigated: prevents anon/authenticated clients from reading other users'
-- questions, answers, chart context, or PII through PostgREST. All writes go via
-- service_role from API routes; no client-side INSERT/UPDATE/DELETE policy.

-- ============================================================
-- Table: brihaspati_credits
-- Credit ledger for the 5-question pack. One row per purchase; consumed counter
-- increments as questions are answered. Subscriptions live on user_profiles,
-- NOT here.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.brihaspati_credits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  granted       INTEGER NOT NULL CHECK (granted > 0),
  consumed      INTEGER NOT NULL DEFAULT 0 CHECK (consumed >= 0 AND consumed <= granted),
  pricing_tier  TEXT NOT NULL CHECK (pricing_tier IN ('pack_5')),
  provider      TEXT NOT NULL CHECK (provider IN ('razorpay','stripe')),
  payment_ref   TEXT NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Idempotency: same payment can never grant credits twice
  CONSTRAINT uniq_brihaspati_credits_payment UNIQUE (provider, payment_ref)
);

-- Note: partial index with NOW() is rejected by Postgres (NOW is STABLE not IMMUTABLE).
-- Balance queries filter consumed < granted AND expires_at > NOW() at runtime; this
-- composite index supports the lookup efficiently.
CREATE INDEX IF NOT EXISTS idx_brihaspati_credits_user_expires
  ON public.brihaspati_credits (user_id, expires_at);

DROP TRIGGER IF EXISTS trg_brihaspati_credits_updated_at ON public.brihaspati_credits;
CREATE TRIGGER trg_brihaspati_credits_updated_at
  BEFORE UPDATE ON public.brihaspati_credits
  FOR EACH ROW EXECUTE FUNCTION public.brihaspati_set_updated_at();

ALTER TABLE public.brihaspati_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own_credits" ON public.brihaspati_credits;
CREATE POLICY "users_select_own_credits"
  ON public.brihaspati_credits FOR SELECT
  USING (auth.uid() = user_id);
-- Threat mitigated: prevents discovering other users' credit balances. Writes via
-- service_role only — users cannot fabricate credits by directly INSERTing.

-- ============================================================
-- Table: brihaspati_webhook_events
-- Idempotency ledger for Razorpay + Stripe webhook callbacks. Webhook handlers
-- INSERT here first; ON CONFLICT means duplicate deliveries become no-ops.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.brihaspati_webhook_events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider            TEXT NOT NULL CHECK (provider IN ('razorpay','stripe')),
  provider_event_id   TEXT NOT NULL,
  event_type          TEXT NOT NULL,
  payload             JSONB NOT NULL,
  processed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uniq_brihaspati_webhook_events UNIQUE (provider, provider_event_id)
);

COMMENT ON COLUMN public.brihaspati_webhook_events.payload IS
  'Raw provider event payload. Shape varies per provider/event_type. Retained for audit and replay.';

-- No RLS policy required because no client should ever read this table directly.
-- Service role bypasses RLS; enable it to deny anon/authenticated by default.
ALTER TABLE public.brihaspati_webhook_events ENABLE ROW LEVEL SECURITY;
-- No SELECT/INSERT/UPDATE/DELETE policy: anon and authenticated are denied entirely.
-- Service role is unaffected (bypasses RLS).

-- ============================================================
-- Table: brihaspati_deletion_ledger
-- Tracks GDPR deletions so the cron job that purges training exports can
-- find which user-ids to scrub from on-disk datasets without retaining the
-- raw user_id (which is exactly what we're trying to forget).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.brihaspati_deletion_ledger (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash             TEXT NOT NULL,  -- sha256(user_id::text); the original user_id is unrecoverable
  deleted_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  purged_from_training_at  TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uniq_brihaspati_deletion_ledger_hash UNIQUE (user_id_hash)
);

COMMENT ON COLUMN public.brihaspati_deletion_ledger.user_id_hash IS
  'sha256 of the deleted user_id text representation. One-way hash so the original ID is unrecoverable but the export-purge job can still locate matching rows.';

CREATE INDEX IF NOT EXISTS idx_brihaspati_deletion_ledger_pending_purge
  ON public.brihaspati_deletion_ledger (deleted_at)
  WHERE purged_from_training_at IS NULL;

DROP TRIGGER IF EXISTS trg_brihaspati_deletion_ledger_updated_at ON public.brihaspati_deletion_ledger;
CREATE TRIGGER trg_brihaspati_deletion_ledger_updated_at
  BEFORE UPDATE ON public.brihaspati_deletion_ledger
  FOR EACH ROW EXECUTE FUNCTION public.brihaspati_set_updated_at();

ALTER TABLE public.brihaspati_deletion_ledger ENABLE ROW LEVEL SECURITY;
-- No policies: anon and authenticated denied; service role only.

-- ============================================================
-- user_profiles columns
-- ============================================================
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS brihaspati_subscription JSONB,
  ADD COLUMN IF NOT EXISTS brihaspati_training_opt_out BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.user_profiles.brihaspati_subscription IS
  'Current Brihaspati subscription state. Shape: { tier: "monthly" | "annual", expires_at: <ISO8601>, provider: "razorpay" | "stripe", started_at: <ISO8601> }. NULL when no active subscription. Mutated by webhook handlers only.';
COMMENT ON COLUMN public.user_profiles.brihaspati_training_opt_out IS
  'When TRUE, future brihaspati_questions rows for this user are marked training_opt_out=true and excluded from training exports. Toggled from /settings (spec §11).';

-- ============================================================
-- PostgREST cache reload
-- ============================================================
NOTIFY pgrst, 'reload schema';
