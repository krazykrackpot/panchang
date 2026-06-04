-- 058 — admin_lookup_user_by_email: service-role RPC for email→id lookup
--
-- The grant-brihaspati-credits.ts script (and any future admin-side
-- script that needs to resolve an email to an auth.users.id) used to
-- call `(sb as any).schema('auth').from('users').select(...)`. On the
-- current supabase-js client + PostgREST configuration that throws
-- `Invalid schema: auth` because `auth` is not in the `db-schemas`
-- exposed-schemas list. We do NOT want to expose `auth` to PostgREST
-- (that schema contains identity/session/refresh-token columns that
-- should never be reachable via the REST API even with RLS).
--
-- The alternative — `auth.admin.listUsers({ perPage: 1000 })` — was
-- already rejected by PR #333 for being O(N) and silently truncating
-- past page 1.
--
-- This migration adds a tiny SECURITY DEFINER function in `public`
-- that does the lookup against the auth schema with the correct
-- search_path, and is callable only by service_role. RLS does not
-- apply to SECURITY DEFINER bodies, but PostgreSQL's GRANT model
-- still gates *who* can call the function.
--
-- Read pattern (auth.users has a unique index on email and Supabase
-- Auth lowercases on insert, so .eq() hits the index in O(log N)).

CREATE OR REPLACE FUNCTION public.admin_lookup_user_by_email(p_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_normalised text;
  v_id uuid;
BEGIN
  IF p_email IS NULL THEN
    RETURN NULL;
  END IF;
  v_normalised := lower(trim(p_email));
  IF v_normalised = '' THEN
    RETURN NULL;
  END IF;
  SELECT id INTO v_id
  FROM auth.users
  WHERE email = v_normalised
  LIMIT 1;
  RETURN v_id;
END;
$$;

COMMENT ON FUNCTION public.admin_lookup_user_by_email(text) IS
  'Resolve an email to auth.users.id. service_role only. Used by admin scripts (grant-brihaspati-credits.ts). See migration 058.';

REVOKE EXECUTE ON FUNCTION public.admin_lookup_user_by_email(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_lookup_user_by_email(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_lookup_user_by_email(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.admin_lookup_user_by_email(text) TO service_role;
