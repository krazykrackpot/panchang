-- 053_linked_client_birth_data_sync.sql
-- Pandit CRM — implements update_client_birth_data_from_linked_user(),
-- the trigger referenced by spec §4 but missing from migration 049.
-- Was deferred from Gemini PR #406 round 3 HIGH #1 to ship with the
-- linking flow itself (P6 — invitation accept path).
--
-- What it does: when a Pandit's client_record gets linked
-- (link_state transitions to 'linked' AND client_user_id is set),
-- copy the client's CURRENT user_profiles.birth_data into
-- pandit_clients.birth_data and flip birth_data_source to
-- 'client_synced'. This way the Pandit's UI reads accurate, up-to-date
-- birth data the moment the link is established.
--
-- Without this trigger, a linked client whose self-profile has more
-- accurate birth data than what the Pandit originally entered would
-- still show the Pandit's stale entry. The trigger ensures linking is
-- a one-shot sync — subsequent edits to client's own profile are NOT
-- auto-pushed (Pandit keeps their working snapshot; per spec §6
-- "single source of truth").

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
  -- Only fire on the transition INTO 'linked' state with a client_user_id.
  -- Other transitions (paused→linked re-sync isn't desired — the Pandit
  -- may have edits since the first sync) deliberately skipped.
  IF NEW.link_state = 'linked'
     AND NEW.client_user_id IS NOT NULL
     AND (OLD.link_state IS DISTINCT FROM 'linked' OR OLD.client_user_id IS NULL)
  THEN
    -- Pull client's self-profile fields that map to birth_data.
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

    -- Only sync if client actually has birth data on their profile. If
    -- they don't (incomplete profile), keep the Pandit's working entry
    -- — it's better data than nothing.
    IF client_profile.date_of_birth IS NOT NULL
       AND client_profile.birth_lat IS NOT NULL
       AND client_profile.birth_lng IS NOT NULL THEN
      synced_birth_data := jsonb_build_object(
        'date', client_profile.date_of_birth::text,
        'time', COALESCE(client_profile.time_of_birth::text, '12:00'),
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
  -- Never block the link transition if the sync fails — the Pandit's
  -- existing entry remains. Log via RAISE WARNING so it shows up in
  -- Vercel logs without being fatal.
  RAISE WARNING 'sync_birth_data_on_link failed for client %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_birth_data_on_link ON public.pandit_clients;
CREATE TRIGGER trg_sync_birth_data_on_link
  BEFORE UPDATE OF link_state, client_user_id ON public.pandit_clients
  FOR EACH ROW EXECUTE FUNCTION public.sync_birth_data_on_link();
