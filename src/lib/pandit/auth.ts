/**
 * Pandit CRM — shared auth helpers for /api/pandit/* routes.
 *
 * Every Pandit API route must verify:
 *   1. A valid Bearer token (Supabase JWT)
 *   2. The token's user has account_type='pandit' on user_profiles
 *
 * RLS already gates by pandit_user_id = auth.uid(), but a seeker
 * (account_type='seeker') could still POST/PATCH against the API and
 * create Pandit-side rows under their own UUID. The RLS would let it
 * through because their UUID DOES match auth.uid(); the issue is
 * "should this user be using the Pandit CRM at all?". account_type is
 * the design-level gate. Gemini PR #406 round 3 HIGH.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

export function bearerToken(req: Request): string | null {
  const h = req.headers.get('authorization');
  if (!h?.toLowerCase().startsWith('bearer ')) return null;
  return h.slice(7).trim() || null;
}

export function getSupabaseWithToken(accessToken: string): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export interface PanditAuthResult {
  ok: true;
  userId: string;
  supabase: SupabaseClient;
}

export interface PanditAuthError {
  ok: false;
  status: number;
  error: string;
}

/**
 * Authenticate a Pandit API request. Returns either a typed success
 * result with the verified Supabase client + user id, or a typed
 * error result with the HTTP status and error code to return.
 *
 * Verifies both the JWT (via auth.getUser(token)) AND that the user's
 * account_type is 'pandit' (via user_profiles).
 */
export async function authenticatePandit(req: Request): Promise<PanditAuthResult | PanditAuthError> {
  const token = bearerToken(req);
  if (!token) return { ok: false, status: 401, error: 'unauthorized' };

  const supabase = getSupabaseWithToken(token);
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    console.error('[pandit/auth] getUser failed:', userError?.message);
    return { ok: false, status: 401, error: 'unauthorized' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('account_type')
    .eq('id', user.id)
    .maybeSingle();
  if (profileError) {
    console.error('[pandit/auth] profile load failed:', profileError.message);
    return { ok: false, status: 500, error: 'profile_load_failed' };
  }
  if (profile?.account_type !== 'pandit') {
    // Seeker (or default 'seeker' on row not yet migrated) — Pandit
    // endpoints are off-limits. 403, not 401, so the client knows the
    // token is valid but the role isn't.
    return { ok: false, status: 403, error: 'pandit_account_required' };
  }

  return { ok: true, userId: user.id, supabase };
}
