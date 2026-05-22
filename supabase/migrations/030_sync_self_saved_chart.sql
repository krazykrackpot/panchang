-- 030_sync_self_saved_chart.sql
-- Auto-create a "self" saved_chart row when a user's profile birth data is
-- complete enough to render a kundali. Fires after INSERT/UPDATE on
-- user_profiles. Idempotent: never clobbers an existing self chart, so user
-- edits to the saved chart survive subsequent profile updates.

CREATE OR REPLACE FUNCTION public.sync_self_saved_chart()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.onboarding_completed IS NOT TRUE
    OR NEW.date_of_birth IS NULL
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

DROP TRIGGER IF EXISTS trg_sync_self_saved_chart ON public.user_profiles;

CREATE TRIGGER trg_sync_self_saved_chart
  AFTER INSERT OR UPDATE OF
    onboarding_completed,
    date_of_birth,
    time_of_birth,
    birth_place,
    birth_lat,
    birth_lng,
    birth_timezone,
    display_name
  ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_self_saved_chart();

-- Existing rows were backfilled in the same release via an INSERT...SELECT.
-- Re-applying this migration is safe: the function skips users with an
-- existing self chart.
