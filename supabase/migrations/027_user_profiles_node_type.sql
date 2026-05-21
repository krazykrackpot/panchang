-- 027_user_profiles_node_type.sql
-- Add node_type column referenced by /settings save and kundali-calc
-- (used to toggle between Mean and True Rahu/Ketu nodes).
--
-- Production hotfix: settings save was failing with 400
--   "Could not find the 'node_type' column of 'user_profiles' in the schema cache"
-- because the code referenced the column but no migration had created it.
--
-- Default 'mean' matches the value the settings page initialises with.
--
-- IMPORTANT: each constraint is applied in its own statement so that production
-- databases where the column was added manually (without DEFAULT / NOT NULL /
-- CHECK) still end up in the correct final state. A single
-- `ADD COLUMN IF NOT EXISTS ... DEFAULT ... NOT NULL CHECK (...)` would skip
-- the entire clause if the column already existed.

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS node_type text;

ALTER TABLE public.user_profiles
  ALTER COLUMN node_type SET DEFAULT 'mean';

UPDATE public.user_profiles
  SET node_type = 'mean'
  WHERE node_type IS NULL;

ALTER TABLE public.user_profiles
  ALTER COLUMN node_type SET NOT NULL;

ALTER TABLE public.user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_node_type_check;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_node_type_check
  CHECK (node_type IN ('mean', 'true'));

-- Refresh PostgREST schema cache so REST API recognises the new column.
NOTIFY pgrst, 'reload schema';
