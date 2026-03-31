-- 003_subscriptions.sql
-- Subscription tiers and daily usage tracking

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'jyotishi')),
  provider TEXT CHECK (provider IN ('razorpay', 'stripe')),
  provider_subscription_id TEXT,
  provider_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'cancelled', 'past_due', 'expired')),
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages subscriptions" ON subscriptions FOR ALL USING (auth.role() = 'service_role');

CREATE TABLE IF NOT EXISTS daily_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  kundali_count INT DEFAULT 0,
  ai_chat_count INT DEFAULT 0,
  muhurta_scan_count INT DEFAULT 0,
  pdf_export_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, usage_date)
);

ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own usage" ON daily_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages usage" ON daily_usage FOR ALL USING (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION increment_usage(p_user_id UUID, p_field TEXT)
RETURNS INT AS $$
DECLARE
  current_val INT;
BEGIN
  INSERT INTO daily_usage (user_id, usage_date)
  VALUES (p_user_id, CURRENT_DATE)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  EXECUTE format(
    'UPDATE daily_usage SET %I = %I + 1 WHERE user_id = $1 AND usage_date = CURRENT_DATE RETURNING %I',
    p_field, p_field, p_field
  ) INTO current_val USING p_user_id;

  RETURN current_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create pro trial subscription on user signup
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, tier, status, trial_start, trial_end)
  VALUES (NEW.id, 'pro', 'trialing', NOW(), NOW() + INTERVAL '7 days');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_subscription();
