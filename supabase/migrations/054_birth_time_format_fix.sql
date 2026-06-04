-- 054_birth_time_format_fix.sql
-- Pandit CRM — Gemini PR #406 round 8 narrative #5.
--
-- The sync_birth_data_on_link trigger from migration 053 used
-- `client_profile.time_of_birth::text` to write the time into the
-- birth_data JSONB. user_profiles.time_of_birth is Postgres `time`
-- type, whose ::text cast yields `HH:MM:SS` ('14:30:00'). The
-- engine + Pandit-side validator (POST /api/pandit/clients lat/lng
-- checks + /api/kundali) expect `HH:MM` ('14:30'). A linked client
-- whose profile has a known birth time would have synced as a
-- non-matching format string, then failed downstream chart
-- generation with a "birth_data.time must be HH:MM" error.
--
-- Fix: replace ::text with to_char(time_of_birth, 'HH24:MI').

CREATE OR REPLACE FUNCTION public.sync_birth_data_on_link()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_profile RECORD;
  synced_birth_data JSONB;
BEGIN
  IF NEW.link_state = 'linked'
     AND NEW.client_user_id IS NOT NULL
     AND (OLD.link_state IS DISTINCT FROM 'linked' OR OLD.client_user_id IS NULL)
  THEN
    SELECT
      date_of_birth,
      time_of_birth,
      birth_time_known,
      birth_place,
      birth_lat,
      birth_lng,
      birth_timezone
    INTO client_profile
    FROM public.user_profiles
    WHERE id = NEW.client_user_id;

    IF client_profile.date_of_birth IS NOT NULL
       AND client_profile.birth_lat IS NOT NULL
       AND client_profile.birth_lng IS NOT NULL THEN
      synced_birth_data := jsonb_build_object(
        'date', to_char(client_profile.date_of_birth, 'YYYY-MM-DD'),
        -- to_char(time, 'HH24:MI') yields HH:MM, matching the engine
        -- expectation and the Pandit-side validator regex. Was
        -- previously `::text` which yields HH:MM:SS. Gemini PR #406
        -- round 8 narrative #5.
        'time', COALESCE(to_char(client_profile.time_of_birth, 'HH24:MI'), '12:00'),
        'place', COALESCE(client_profile.birth_place, ''),
        'lat', client_profile.birth_lat,
        'lng', client_profile.birth_lng,
        'tz', COALESCE(client_profile.birth_timezone, 'Asia/Kolkata'),
        'time_estimated', NOT COALESCE(client_profile.birth_time_known, true)
      );
      NEW.birth_data := synced_birth_data;
      NEW.birth_data_source := 'client_synced';
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'sync_birth_data_on_link failed for client %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;
