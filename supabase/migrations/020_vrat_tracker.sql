-- Vrat preferences per user: tracks which vrats a user observes
-- Used by the dashboard VratTracker widget and daily email vrat reminders
CREATE TABLE IF NOT EXISTS user_vrat_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vrat_type TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, vrat_type)
);

-- RLS: users can only read/write their own vrat preferences
ALTER TABLE user_vrat_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own vrats" ON user_vrat_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Index for cron query: find all users with enabled vrats
CREATE INDEX idx_vrat_prefs_enabled ON user_vrat_preferences(enabled) WHERE enabled = true;
