-- Domain readings: monthly snapshot of 8-domain life scores for trajectory tracking
CREATE TABLE IF NOT EXISTS public.domain_readings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  computed_at timestamptz NOT NULL DEFAULT now(),
  reading_month date NOT NULL DEFAULT date_trunc('month', CURRENT_DATE)::date,
  health numeric(3,1) NOT NULL,
  wealth numeric(3,1) NOT NULL,
  career numeric(3,1) NOT NULL,
  marriage numeric(3,1) NOT NULL,
  children numeric(3,1) NOT NULL,
  family numeric(3,1) NOT NULL,
  spiritual numeric(3,1) NOT NULL,
  education numeric(3,1) NOT NULL,
  maha_dasha text,
  antar_dasha text,
  sade_sati_active boolean DEFAULT false,
  overall_activation numeric(3,1),
  trigger_event text
);

-- One reading per user per month (simple column-based unique, no expression needed)
CREATE UNIQUE INDEX idx_domain_readings_one_per_month ON public.domain_readings (user_id, reading_month);

ALTER TABLE public.domain_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own readings" ON public.domain_readings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role manages readings" ON public.domain_readings
  FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX idx_domain_readings_user_time ON public.domain_readings(user_id, computed_at DESC);
