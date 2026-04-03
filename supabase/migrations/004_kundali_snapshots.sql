-- Kundali snapshot — pre-computed birth chart data
-- Computed once at onboarding, recomputed on profile edit

CREATE TABLE IF NOT EXISTS kundali_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Key positions (for quick lookups without parsing JSONB)
  ascendant_sign INTEGER NOT NULL CHECK (ascendant_sign BETWEEN 1 AND 12),
  moon_sign INTEGER NOT NULL CHECK (moon_sign BETWEEN 1 AND 12),
  moon_nakshatra INTEGER NOT NULL CHECK (moon_nakshatra BETWEEN 1 AND 27),
  moon_nakshatra_pada INTEGER NOT NULL CHECK (moon_nakshatra_pada BETWEEN 1 AND 4),
  sun_sign INTEGER NOT NULL CHECK (sun_sign BETWEEN 1 AND 12),

  -- Full chart data (JSONB blobs)
  planet_positions JSONB NOT NULL,
  house_cusps JSONB NOT NULL,
  chart_data JSONB NOT NULL,
  navamsha_chart JSONB NOT NULL,
  dasha_timeline JSONB NOT NULL,
  yogas JSONB DEFAULT '[]',
  shadbala JSONB DEFAULT '[]',
  sade_sati JSONB DEFAULT '{}',
  full_kundali JSONB,  -- complete KundaliData for offline use

  computed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE kundali_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own snapshot" ON kundali_snapshots;
DROP POLICY IF EXISTS "Service role manages snapshots" ON kundali_snapshots;
CREATE POLICY "Users can read own snapshot" ON kundali_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages snapshots" ON kundali_snapshots FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX idx_snapshots_user ON kundali_snapshots(user_id);
CREATE INDEX idx_snapshots_moon ON kundali_snapshots(moon_sign);

-- Add birth data columns to user_profiles (if not already present)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='date_of_birth') THEN
    ALTER TABLE user_profiles ADD COLUMN date_of_birth DATE;
    ALTER TABLE user_profiles ADD COLUMN time_of_birth TIME;
    ALTER TABLE user_profiles ADD COLUMN birth_time_known BOOLEAN DEFAULT TRUE;
    ALTER TABLE user_profiles ADD COLUMN birth_place TEXT;
    ALTER TABLE user_profiles ADD COLUMN birth_lat DECIMAL(10,7);
    ALTER TABLE user_profiles ADD COLUMN birth_lng DECIMAL(10,7);
    ALTER TABLE user_profiles ADD COLUMN birth_timezone TEXT;
    ALTER TABLE user_profiles ADD COLUMN ayanamsha TEXT DEFAULT 'lahiri';
    ALTER TABLE user_profiles ADD COLUMN chart_style TEXT DEFAULT 'north';
  END IF;
END $$;
