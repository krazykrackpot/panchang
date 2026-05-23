-- 032_self_chart_drop_onboarding_gate.sql
-- The original sync_self_saved_chart() trigger (migration 030) required
-- onboarding_completed = true before auto-creating the self chart. This
-- left a hole: users who entered full birth data via direct settings save
-- (bypassing the onboarding modal) had a kundali snapshot but no entry in
-- saved_charts, so their dashboard "saved kundalis" surface stayed empty.
--
-- Product intent: birth profile complete (DOB + lat + lng) is the only
-- precondition for auto-creating the self chart. Drop the onboarding gate.
--
-- Then catch up: INSERT a self chart for every existing user_profiles row
-- that has full birth data and no existing self chart. Idempotent.

CREATE OR REPLACE FUNCTION public.sync_self_saved_chart()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only require the geometric inputs needed to render a chart. Skip the
  -- onboarding_completed gate intentionally — see migration 032.
  IF NEW.date_of_birth IS NULL
    OR NEW.birth_lat IS NULL
    OR NEW.birth_lng IS NULL THEN
    RETURN NEW;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.saved_charts
    WHERE user_id = NEW.id AND relationship = 'self'
  ) THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.saved_charts (user_id, label, birth_data, is_primary, relationship)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(TRIM(NEW.display_name), ''), 'My Chart'),
    jsonb_build_object(
      'name', COALESCE(NULLIF(TRIM(NEW.display_name), ''), ''),
      'date', to_char(NEW.date_of_birth, 'YYYY-MM-DD'),
      'time', to_char(COALESCE(NEW.time_of_birth, TIME '12:00'), 'HH24:MI'),
      'place', COALESCE(NEW.birth_place, ''),
      'lat', NEW.birth_lat::float,
      'lng', NEW.birth_lng::float,
      'timezone', COALESCE(NEW.birth_timezone, 'UTC'),
      'ayanamsha', COALESCE(NULLIF(TRIM(NEW.ayanamsha), ''), 'lahiri'),
      'relationship', 'self'
    ),
    true,
    'self'
  );

  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'sync_self_saved_chart failed for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Catch-up backfill: insert a self chart for every profile with full
-- birth data and no self chart. Same payload shape as the trigger.
INSERT INTO public.saved_charts (user_id, label, birth_data, is_primary, relationship)
SELECT
  p.id,
  COALESCE(NULLIF(TRIM(p.display_name), ''), 'My Chart'),
  jsonb_build_object(
    'name', COALESCE(NULLIF(TRIM(p.display_name), ''), ''),
    'date', to_char(p.date_of_birth, 'YYYY-MM-DD'),
    'time', to_char(COALESCE(p.time_of_birth, TIME '12:00'), 'HH24:MI'),
    'place', COALESCE(p.birth_place, ''),
    'lat', p.birth_lat::float,
    'lng', p.birth_lng::float,
    'timezone', COALESCE(p.birth_timezone, 'UTC'),
    'ayanamsha', COALESCE(NULLIF(TRIM(p.ayanamsha), ''), 'lahiri'),
    'relationship', 'self'
  ),
  true,
  'self'
FROM public.user_profiles p
WHERE p.date_of_birth IS NOT NULL
  AND p.birth_lat IS NOT NULL
  AND p.birth_lng IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.saved_charts s
    WHERE s.user_id = p.id AND s.relationship = 'self'
  );

NOTIFY pgrst, 'reload schema';
