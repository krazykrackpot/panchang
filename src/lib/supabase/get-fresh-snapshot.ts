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
import type { KundaliData } from '@/types/kundali';
import { stripKundaliForStorage, rehydrateKundali } from '@/lib/kundali/evaluated-yogas-codec';

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
 * Re-merge static yoga catalog fields onto a snapshot's `full_kundali`.
 * Snapshots store only chart-specific yoga fields — catalog fields
 * (name, description, classicalRef, formationRule, etc.) live in
 * ALL_YOGA_RULES and are merged back in on read. Idempotent: re-running
 * on an already-rehydrated snapshot is a safe no-op via the codec.
 */
function rehydrateFreshSnapshot(snapshot: FreshSnapshot | null): FreshSnapshot | null {
  if (!snapshot) return null;
  const rehydrated = rehydrateKundali(snapshot.full_kundali as KundaliData | null);
  return { ...snapshot, full_kundali: rehydrated };
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
        if (data.snapshot) return rehydrateFreshSnapshot(data.snapshot as FreshSnapshot);
      }
    } catch (err) {
      console.error('[getFreshSnapshot] recompute failed, returning stale:', err);
    }
  }

  return rehydrateFreshSnapshot(snapshot as FreshSnapshot);
}

/**
 * Check if a snapshot's computation_version matches the current engine.
 * Useful for cron jobs that process all users — they can skip stale
 * snapshots or flag them for recomputation.
 */
export function isSnapshotStale(snapshot: { computation_version?: string | null }): boolean {
  return (snapshot.computation_version ?? '') !== ENGINE_VERSION;
}

/**
 * Recompute a stale snapshot directly using service-role client.
 * For cron jobs that don't have user access tokens.
 *
 * @returns Fresh snapshot or null if recompute fails / user has no birth data.
 */
export async function recomputeSnapshotDirect(
  supabase: SupabaseClient,
  userId: string,
): Promise<FreshSnapshot | null> {
  try {
    // Fetch birth data from profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('date_of_birth, time_of_birth, birth_place, birth_lat, birth_lng')
      .eq('id', userId)
      .single();

    if (!profile?.date_of_birth || profile?.birth_lat == null || profile?.birth_lng == null) {
      return null; // No birth data — can't recompute
    }

    // Lazy imports to keep module lightweight for non-recompute consumers
    const { generateKundali } = await import('@/lib/ephem/kundali-calc');
    const { resolveBirthTimezone } = await import('@/lib/utils/timezone');
    const { getNakshatraNumber, getNakshatraPada } = await import('@/lib/ephem/astronomical');

    const resolvedTz = await resolveBirthTimezone(Number(profile.birth_lat), Number(profile.birth_lng));
    const kundali = generateKundali({
      name: 'User',
      date: String(profile.date_of_birth),
      time: String(profile.time_of_birth || '12:00'),
      place: String(profile.birth_place || ''),
      lat: Number(profile.birth_lat),
      lng: Number(profile.birth_lng),
      timezone: resolvedTz,
      ayanamsha: 'lahiri',
    });

    const moonP = kundali.planets.find((p: { planet: { id: number } }) => p.planet.id === 1);
    const sunP = kundali.planets.find((p: { planet: { id: number } }) => p.planet.id === 0);
    const mLong = moonP?.longitude ?? 0;

    const row = {
      user_id: userId,
      ascendant_sign: kundali.ascendant.sign,
      moon_sign: moonP?.sign || 1,
      moon_nakshatra: moonP?.nakshatra?.id ?? getNakshatraNumber(mLong),
      moon_nakshatra_pada: moonP?.nakshatra?.pada ?? getNakshatraPada(mLong),
      sun_sign: sunP?.sign || 1,
      planet_positions: kundali.planets,
      house_cusps: kundali.houses,
      chart_data: kundali.chart,
      navamsha_chart: kundali.navamshaChart,
      dasha_timeline: kundali.dashas,
      yogas: kundali.yogasComplete || [],
      shadbala: kundali.fullShadbala || kundali.shadbala,
      sade_sati: kundali.sadeSati || {},
      // Strip yoga catalog fields — see evaluated-yogas-codec.ts.
      full_kundali: stripKundaliForStorage(kundali),
      computed_at: new Date().toISOString(),
      computation_version: ENGINE_VERSION,
    };

    // Upsert + select in one call — avoids extra network round-trip
    const { data: fresh, error } = await supabase
      .from('kundali_snapshots')
      .upsert(row, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error(`[recomputeSnapshotDirect] upsert failed for user ${userId}:`, error.message);
      return null;
    }

    return rehydrateFreshSnapshot(fresh as FreshSnapshot | null);
  } catch (err) {
    console.error(`[recomputeSnapshotDirect] failed for user ${userId}:`, err);
    return null;
  }
}
