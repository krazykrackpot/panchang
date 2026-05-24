-- ============================================================
-- User Profiles & Saved Charts
-- ============================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  preferred_locale TEXT DEFAULT 'en' CHECK (preferred_locale IN ('en', 'hi', 'sa')),
  default_location JSONB, -- { lat, lng, name, timezone }
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Saved birth charts
CREATE TABLE saved_charts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label           TEXT NOT NULL,             -- e.g., "My Chart", "Mom"
  birth_data      JSONB NOT NULL,            -- BirthData JSON
  chart_data      JSONB,                     -- Full KundaliData (optional cache)
  is_primary      BOOLEAN DEFAULT FALSE,     -- User's own chart
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_charts_user ON saved_charts (user_id);
CREATE INDEX idx_saved_charts_primary ON saved_charts (user_id) WHERE is_primary = TRUE;

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_charts ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users manage own profile"
  ON user_profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users manage own charts"
  ON saved_charts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup.
--
-- Hardened in-place 2026-05-24 (P1-5): adds SET search_path, ON CONFLICT
-- DO NOTHING, and the EXCEPTION WHEN OTHERS catch-all required by the
-- project's trigger-on-auth.users contract (CLAUDE.md "Database
-- Migrations"). The earlier version of this function was patched in
-- migration 006 but the original definition here was left unsafe — if
-- migrations 002–005 are replayed on a fresh DB without 006, signup is
-- blocked. Making each CREATE OR REPLACE FUNCTION definition idempotently
-- safe means the order of migration application no longer matters.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block auth.users INSERT on a profile-create failure.
  -- Log surfaces in Postgres logs; the user can finish signup.
  RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
