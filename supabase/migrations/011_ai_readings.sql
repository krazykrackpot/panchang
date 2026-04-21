-- ============================================================================
-- 011_ai_readings.sql
-- Persistent cache for AI-generated domain readings (Personal Pandit).
-- One row per kundali chart × prompt version. Birth charts are immutable,
-- so the same chart always produces the same natal reading.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ai_readings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Cache key: fingerprint of birth data (sha256 of date+time+lat+lng+ayanamsha)
  birth_fingerprint text NOT NULL,

  -- Prompt/model versioning so we can invalidate on upgrades
  prompt_version text NOT NULL DEFAULT 'v1',
  model          text NOT NULL,

  -- The full structured JSON: { overallInsight, health, wealth, ... }
  reading_json   jsonb NOT NULL,

  -- Cost tracking
  tokens_input   int NOT NULL DEFAULT 0,
  tokens_output  int NOT NULL DEFAULT 0,

  created_at     timestamptz NOT NULL DEFAULT now(),

  -- One reading per chart per prompt version per user
  CONSTRAINT uq_ai_reading UNIQUE (user_id, birth_fingerprint, prompt_version)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_ai_readings_lookup
  ON public.ai_readings (user_id, birth_fingerprint, prompt_version);

-- ─── RLS ────────────────────────────────────────────────────────────────────

ALTER TABLE public.ai_readings ENABLE ROW LEVEL SECURITY;

-- Users can read their own readings
CREATE POLICY ai_readings_select ON public.ai_readings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own readings
CREATE POLICY ai_readings_insert ON public.ai_readings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own readings (for regenerate)
CREATE POLICY ai_readings_delete ON public.ai_readings
  FOR DELETE USING (auth.uid() = user_id);

-- Note: service_role key bypasses RLS entirely, so no policy needed for it.
-- The above user-scoped policies ensure client-side Supabase calls are safe.
