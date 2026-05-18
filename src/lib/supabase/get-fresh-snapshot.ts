/**
 * Fetch a user's kundali snapshot, auto-recomputing if stale.
 *
 * Single entry point for ALL snapshot consumers — cron jobs, API routes,
 * dashboard, profile. Ensures no consumer ever reads stale data after
 * an engine change.
 *
 * Compares stored computation_version against ENGINE_VERSION (hash of
 * 22 computation pipeline files). If they differ, recomputes via the
 * /api/user/profile POST endpoint and returns fresh data.
 */

import { ENGINE_VERSION } from '@/lib/kundali/engine-version';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface FreshSnapshot {
  ascendant_sign: number;
  moon_sign: number;
  moon_nakshatra: number;
  moon_nakshatra_pada: number;
  sun_sign: number;
  chart_data: unknown;
  sade_sati: unknown;
  dasha_timeline: unknown;
  planet_positions: unknown;
  full_kundali: unknown;
  computed_at: string;
  computation_version: string;
}

/**
 * Get a fresh snapshot for a user. Recomputes if stale.
 *
 * @param supabase - Authenticated Supabase client (server or service role)
 * @param userId - The user's UUID
 * @param accessToken - Optional Bearer token for recompute call. If not provided, recompute is skipped (snapshot returned as-is).
 * @param baseUrl - Base URL for internal API calls (e.g. process.env.VERCEL_URL). Required for recompute.
 */
export async function getFreshSnapshot(
  supabase: SupabaseClient,
  userId: string,
  accessToken?: string,
  baseUrl?: string,
): Promise<FreshSnapshot | null> {
  const { data: snapshot, error } = await supabase
    .from('kundali_snapshots')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[getFreshSnapshot] fetch failed:', error.message);
    return null;
  }
  if (!snapshot) return null;

  // Check staleness
  const isStale = (snapshot.computation_version ?? '') !== ENGINE_VERSION;

  if (isStale && accessToken && baseUrl) {
    // Fetch profile to trigger recompute (the GET handler auto-recomputes stale snapshots)
    try {
      const res = await fetch(`${baseUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.snapshot) return data.snapshot as FreshSnapshot;
      }
    } catch (err) {
      console.error('[getFreshSnapshot] recompute failed, returning stale:', err);
    }
  }

  return snapshot as FreshSnapshot;
}

/**
 * Check if a snapshot's computation_version matches the current engine.
 * Useful for cron jobs that process all users — they can skip stale
 * snapshots or flag them for recomputation.
 */
export function isSnapshotStale(snapshot: { computation_version?: string | null }): boolean {
  return (snapshot.computation_version ?? '') !== ENGINE_VERSION;
}
