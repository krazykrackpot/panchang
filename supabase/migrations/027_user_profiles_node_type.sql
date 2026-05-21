-- 027_user_profiles_node_type.sql
-- Add node_type column referenced by /settings save and kundali-calc
-- (used to toggle between Mean and True Rahu/Ketu nodes).
--
-- Production hotfix: settings save was failing with 400
--   "Could not find the 'node_type' column of 'user_profiles' in the schema cache"
-- because the code referenced the column but no migration had created it.
--
-- Default 'mean' matches the value the settings page initialises with.

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS node_type text NOT NULL DEFAULT 'mean'
  CHECK (node_type IN ('mean', 'true'));

-- Refresh PostgREST schema cache so REST API recognises the new column.
NOTIFY pgrst, 'reload schema';
