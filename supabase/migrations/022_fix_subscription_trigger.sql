-- Fix: add EXCEPTION handler + ON CONFLICT to prevent blocking signups
-- Per CLAUDE.md: all triggers on auth.users MUST have EXCEPTION WHEN OTHERS THEN RETURN NEW
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, tier, status, trial_start, trial_end)
  VALUES (NEW.id, 'pro', 'trialing', NOW(), NOW() + INTERVAL '7 days')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW; -- Never block auth signup
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
