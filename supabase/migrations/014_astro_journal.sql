-- 014_astro_journal.sql
-- Astro Journal feature: personal astrological diary, prediction tracking, life events

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. astro_journal — daily mood/energy log with denormalised panchang fields
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS astro_journal (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date         date        NOT NULL,
  mood               smallint    CHECK (mood BETWEEN 1 AND 5),
  energy             smallint    CHECK (energy BETWEEN 1 AND 5),
  note               text,
  tags               text[]      NOT NULL DEFAULT '{}',
  planetary_state    jsonb       NOT NULL DEFAULT '{}',
  -- Denormalised for fast filtering without JSONB operators
  tithi_number       smallint,
  nakshatra_number   smallint,
  yoga_number        smallint,
  karana_number      smallint,
  weekday            smallint,   -- 0=Sunday per JD convention
  maha_dasha         text,
  antar_dasha        text,
  moon_sign          smallint,   -- 1-12
  sade_sati_phase    text,       -- 'rising', 'peak', 'setting', or NULL
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now(),
  CONSTRAINT astro_journal_user_date_unique UNIQUE (user_id, entry_date)
);

ALTER TABLE astro_journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own journal entries"
  ON astro_journal FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own journal entries"
  ON astro_journal FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own journal entries"
  ON astro_journal FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own journal entries"
  ON astro_journal FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages journal entries"
  ON astro_journal FOR ALL
  USING (auth.role() = 'service_role');

-- Primary access pattern: user's entries newest-first
CREATE INDEX IF NOT EXISTS idx_astro_journal_user_date
  ON astro_journal(user_id, entry_date DESC);

-- Filter by dasha period (correlation queries)
CREATE INDEX IF NOT EXISTS idx_astro_journal_user_dasha
  ON astro_journal(user_id, maha_dasha, antar_dasha);

-- Filter by nakshatra (pattern discovery)
CREATE INDEX IF NOT EXISTS idx_astro_journal_user_nakshatra
  ON astro_journal(user_id, nakshatra_number);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. prediction_tracking — record predictions and mark outcomes later
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prediction_tracking (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prediction_text  text        NOT NULL,
  domain           text,       -- 'career', 'health', 'relationships', etc.
  source           text,       -- 'dasha', 'transit', 'manual', etc.
  predicted_for    daterange,  -- date range the prediction applies to
  planetary_state  jsonb       NOT NULL DEFAULT '{}',
  outcome          text        CHECK (outcome IN ('correct', 'partially_correct', 'incorrect', 'pending')),
  outcome_note     text,
  resolved_at      timestamptz,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE prediction_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own predictions"
  ON prediction_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own predictions"
  ON prediction_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own predictions"
  ON prediction_tracking FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own predictions"
  ON prediction_tracking FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages predictions"
  ON prediction_tracking FOR ALL
  USING (auth.role() = 'service_role');

-- Primary access pattern: user's predictions newest-first
CREATE INDEX IF NOT EXISTS idx_prediction_tracking_user_created
  ON prediction_tracking(user_id, created_at DESC);

-- Filter pending predictions
CREATE INDEX IF NOT EXISTS idx_prediction_tracking_user_outcome
  ON prediction_tracking(user_id, outcome);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. life_events — significant life events for retrospective astrological study
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS life_events (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_date       date        NOT NULL,
  event_type       text        NOT NULL,   -- 'career', 'health', 'travel', 'relationship', etc.
  title            text        NOT NULL,
  description      text,
  significance     smallint    CHECK (significance BETWEEN 1 AND 5),
  planetary_state  jsonb       NOT NULL DEFAULT '{}',
  maha_dasha       text,
  antar_dasha      text,
  tags             text[]      NOT NULL DEFAULT '{}',
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE life_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own life events"
  ON life_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own life events"
  ON life_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own life events"
  ON life_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own life events"
  ON life_events FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages life events"
  ON life_events FOR ALL
  USING (auth.role() = 'service_role');

-- Primary access pattern: user's events by date
CREATE INDEX IF NOT EXISTS idx_life_events_user_date
  ON life_events(user_id, event_date DESC);

-- Filter by event type
CREATE INDEX IF NOT EXISTS idx_life_events_user_type
  ON life_events(user_id, event_type);

-- Filter by dasha period
CREATE INDEX IF NOT EXISTS idx_life_events_user_dasha
  ON life_events(user_id, maha_dasha, antar_dasha);
