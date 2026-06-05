/**
 * Canonical `user_profiles` reader.
 *
 * Audit P5b #14: 57 ad-hoc `supabase.from('user_profiles').select(...)`
 * sites across 40 files. Schema changes would have to touch all of them;
 * field-name typos drop silently; each site re-implements its own
 * error-logging tag. This module is the single read path.
 *
 * Scope: READS only. Writes (`upsert`, `update`, `insert`) stay inline
 * for now — they each have specific RLS / conflict semantics that don't
 * generalise as cleanly as a typed projection helper.
 *
 * Usage (server route or client component, both work):
 *
 *   const profile = await getProfile(supabase, user.id, ['display_name', 'birth_lat'] as const, '[my-route]');
 *   if (!profile) return; // load failed or row missing — already logged
 *   const name = profile.display_name;
 *
 *   const role = await getAccountType(supabase, user.id, '[my-layout]');
 *   if (role !== 'pandit') router.replace('/dashboard');
 *
 * The `context` argument tags `console.error('[ctx] user_profiles
 * load failed: …', err)` so the original site-specific log prefixes
 * stay in place — ops can still grep `[PanditClientsLayout]` and find
 * the same calls.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Minimal shape of `user_profiles` for the helpers below. Add fields
 * here as call sites are migrated — keeping the union tight catches
 * typos at compile time (e.g. `defualt_location`).
 *
 * NOT the full DB row — that's intentional. This is the surface
 * Phase 5b migrates.
 */
export interface UserProfile {
  id: string;
  account_type: 'pandit' | 'seeker' | null;
  display_name: string | null;
  /**
   * Stored as `jsonb` — PostgREST returns the parsed object. Some
   * legacy rows have a JSON-encoded string here, which is why a few
   * call sites still defensive-`JSON.parse` it. New writers should
   * always insert an object.
   */
  default_location: string | Record<string, unknown> | null;
  experience_level: 'beginner' | 'intermediate' | 'advanced' | null;
  notification_prefs: Record<string, unknown> | null;
}

export type UserProfileField = keyof UserProfile;

/**
 * Load a projection of `user_profiles` for one user. Returns `null` if
 * the row is missing OR the query fails — both cases are logged with
 * the supplied `context` tag. Callers should treat `null` as
 * "no usable data; degrade to logged-out flow."
 */
export async function getProfile<F extends UserProfileField>(
  supabase: SupabaseClient,
  userId: string,
  fields: readonly F[],
  context: string,
): Promise<Pick<UserProfile, F> | null> {
  if (fields.length === 0) {
    // Defensive: a zero-field projection is almost always a bug in the
    // caller (forgot to pass the column list). Don't issue the round-trip.
    console.error(`[${context}] getProfile called with empty fields list`);
    return null;
  }
  const projection = fields.join(',');
  const { data, error } = await supabase
    .from('user_profiles')
    .select(projection)
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.error(`[${context}] user_profiles load failed:`, error.message);
    return null;
  }
  return (data as Pick<UserProfile, F> | null) ?? null;
}

/**
 * Convenience wrapper for the 6+ surfaces (4 dashboard layout guards,
 * AccountTypeRouter, `lib/pandit/auth`) that only need to know whether
 * a user is a Pandit. Returns `null` on missing row OR on error — both
 * mean "not authorised as Pandit," which is the existing behaviour.
 */
export async function getAccountType(
  supabase: SupabaseClient,
  userId: string,
  context: string,
): Promise<'pandit' | 'seeker' | null> {
  const profile = await getProfile(supabase, userId, ['account_type'] as const, context);
  return profile?.account_type ?? null;
}
