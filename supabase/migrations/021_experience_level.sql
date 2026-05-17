-- Add experience_level to user_profiles
-- Controls which kundali view mode the user prefers (simple/expert)
-- Also used for content personalisation across the app
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'beginner'
  CHECK (experience_level IN ('beginner', 'intermediate', 'advanced'));

-- Comment for documentation
COMMENT ON COLUMN user_profiles.experience_level IS 'User self-reported Jyotish knowledge level: beginner (simple mode), intermediate, advanced (expert mode)';
