-- 013_family_readings.sql
-- Add indexed relationship column to saved_charts + family_readings cache table

-- 1. Add queryable relationship column to saved_charts
ALTER TABLE saved_charts ADD COLUMN IF NOT EXISTS relationship text;

-- 2. Backfill from existing JSONB birth_data
UPDATE saved_charts
SET relationship = birth_data->>'relationship'
WHERE birth_data->>'relationship' IS NOT NULL
  AND relationship IS NULL;

-- 3. Index for fast family chart lookup
CREATE INDEX IF NOT EXISTS idx_saved_charts_user_relationship
  ON saved_charts(user_id, relationship);

-- 4. Family readings cache table
CREATE TABLE IF NOT EXISTS family_readings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_data jsonb NOT NULL,
  computed_at timestamptz NOT NULL DEFAULT now(),
  chart_ids   uuid[] NOT NULL DEFAULT '{}',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  CONSTRAINT family_readings_user_unique UNIQUE (user_id)
);

-- 5. RLS for family_readings
ALTER TABLE family_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own family readings"
  ON family_readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages family readings"
  ON family_readings FOR ALL
  USING (auth.role() = 'service_role');

-- 6. Index on family_readings user_id (covered by UNIQUE, but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_family_readings_user ON family_readings(user_id);
