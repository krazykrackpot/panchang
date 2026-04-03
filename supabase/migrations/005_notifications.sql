-- Notification system for personalized alerts
-- Phase 5: Engagement features

CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('dasha_transition', 'transit_alert', 'festival_reminder', 'sade_sati', 'weekly_digest', 'system')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifications" ON user_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON user_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role manages notifications" ON user_notifications FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX idx_notifications_user ON user_notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON user_notifications(user_id) WHERE read = FALSE;

-- Notification preferences
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS notification_prefs JSONB DEFAULT '{"dasha_transition":true,"transit_alert":true,"festival_reminder":true,"sade_sati":true,"weekly_digest":true}';
