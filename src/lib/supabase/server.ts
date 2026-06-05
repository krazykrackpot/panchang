import { createClient } from '@supabase/supabase-js';

export function getServerSupabase() {
  // Trim at env-fetch time, not at use time. Vercel can append
  // trailing whitespace / newlines on `vercel env pull`, and an
  // all-whitespace value would slip past `!url || !key` (non-empty
  // string is truthy) but produce an unauthenticated client.
  // Audit P5e #16.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
