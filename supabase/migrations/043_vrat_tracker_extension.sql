-- 043 — Vrat Tracker MVP schema
--
-- Extends user_vrat_preferences (existing minimal table) and user_profiles
-- with the columns the Vrat Tracker MVP cron + UI need. No new tables.
--
-- Schema rationale + audit trail: docs/specs/2026-05-27-vrat-tracker-and-pandit-dashboard.md
-- Two Gemini reviews shaped this — #223 and #225 — so the per-type dedup
-- columns, range checks, and unique iCal token are all here from day one.

-- ─── user_vrat_preferences (extend) ────────────────────────────────────
ALTER TABLE public.user_vrat_preferences
  ADD COLUMN IF NOT EXISTS email_reminders bool NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS remind_day_before bool NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS remind_parana bool NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS start_date date NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS end_date date NULL,
  -- Per-type dedup columns. The single (date, type) pair would lose state
  -- when both reminder types fire on the same day during Navratri-adjacent
  -- dates (Gemini #225).
  ADD COLUMN IF NOT EXISTS last_day_before_reminder_date date NULL,
  ADD COLUMN IF NOT EXISTS last_parana_reminder_date date NULL;

-- end_date >= start_date when both set. Catches data corruption / UI bugs
-- at the DB level. Gemini #223.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_vrat_date_range' AND conrelid = 'public.user_vrat_preferences'::regclass
  ) THEN
    ALTER TABLE public.user_vrat_preferences
      ADD CONSTRAINT chk_vrat_date_range
      CHECK (end_date IS NULL OR end_date >= start_date);
  END IF;
END $$;

-- Partial index — only rows that are eligible for the reminder cron live
-- here. Keeps the cron's "who is due now?" scan cheap as user count grows.
CREATE INDEX IF NOT EXISTS user_vrat_reminders_pending_idx
  ON public.user_vrat_preferences (user_id, vrat_type)
  WHERE enabled = true AND email_reminders = true;

-- ─── user_profiles (add vrat-related columns) ──────────────────────────
ALTER TABLE public.user_profiles
  -- Smarta / Vaishnava tradition. NULL = not chosen yet — first prompt
  -- fires only when the user subscribes to a tradition-dependent vrat
  -- (Ekadashi, Janmashtami).
  ADD COLUMN IF NOT EXISTS vrat_tradition text NULL,

  -- Location-of-observance (NOT birth location). Required at first
  -- subscription. Lat/lng range-checked so a broken geocoder cannot
  -- poison sunrise calculation.
  ADD COLUMN IF NOT EXISTS vrat_location_city text NULL,
  ADD COLUMN IF NOT EXISTS vrat_location_lat double precision NULL,
  ADD COLUMN IF NOT EXISTS vrat_location_lng double precision NULL,
  ADD COLUMN IF NOT EXISTS vrat_location_tz text NULL,

  -- Single user-level pref. 99% will keep the default 30.
  ADD COLUMN IF NOT EXISTS parana_reminder_offset_minutes int NOT NULL DEFAULT 30,

  -- Per-user random token for the personalised iCal feed. Lazily
  -- generated on first vrat subscription. Rotatable from /settings.
  ADD COLUMN IF NOT EXISTS vrat_calendar_token text NULL;

-- Constraints applied separately so re-running the migration is safe even
-- if the columns already exist. Each guarded by a pg_constraint lookup.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_vrat_tradition' AND conrelid = 'public.user_profiles'::regclass
  ) THEN
    ALTER TABLE public.user_profiles
      ADD CONSTRAINT chk_vrat_tradition
      CHECK (vrat_tradition IS NULL OR vrat_tradition IN ('smarta','vaishnava'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_vrat_location_lat' AND conrelid = 'public.user_profiles'::regclass
  ) THEN
    ALTER TABLE public.user_profiles
      ADD CONSTRAINT chk_vrat_location_lat
      CHECK (vrat_location_lat IS NULL OR vrat_location_lat BETWEEN -90 AND 90);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_vrat_location_lng' AND conrelid = 'public.user_profiles'::regclass
  ) THEN
    ALTER TABLE public.user_profiles
      ADD CONSTRAINT chk_vrat_location_lng
      CHECK (vrat_location_lng IS NULL OR vrat_location_lng BETWEEN -180 AND 180);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_parana_offset_minutes' AND conrelid = 'public.user_profiles'::regclass
  ) THEN
    ALTER TABLE public.user_profiles
      ADD CONSTRAINT chk_parana_offset_minutes
      CHECK (parana_reminder_offset_minutes IN (15, 30, 60));
  END IF;
END $$;

-- Unique index on the calendar token (NULLs allowed, only non-null values
-- must be unique). UNIQUE on the column itself would also allow multiple
-- NULLs, but a partial unique index is more explicit about intent.
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_vrat_calendar_token_idx
  ON public.user_profiles (vrat_calendar_token)
  WHERE vrat_calendar_token IS NOT NULL;
