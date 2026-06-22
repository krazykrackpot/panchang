'use client';

/**
 * useKundaliEntitlement(birthParams)
 *
 * Returns the current user's entitlement state for the kundali identified
 * by the given birth params + their credit balance. Used by TippanniTab to
 * decide whether to render the full reading or the paywall.
 *
 * Fingerprint is computed CLIENT-SIDE for the entitlement-check query
 * (the server has to recompute it anyway during /api/kundali/unlock, so
 * a malicious client can't fool the actual unlock — but it must match
 * the server-side hash exactly, otherwise the optimistic check here
 * would say "entitled" when the server says "not". Both call sites
 * use the same normalisation: lat/lng rounded to 4dp, YYYY-MM-DD
 * date, HH:MM time).
 *
 * For users who aren't signed in, we don't fetch anything — they're
 * treated as "not entitled, 0 credits" and the paywall component will
 * route them through sign-in first.
 */

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { authedFetch } from '@/lib/api/authed-fetch';

export interface BirthParamsClient {
  date: string;
  time: string;
  lat: number;
  lng: number;
}

interface EntitlementState {
  loading: boolean;
  signedIn: boolean;
  entitled: boolean;
  creditsRemaining: number;
  fingerprint: string | null;
  /** Force-refresh callback — call after /api/kundali/unlock or a checkout return. */
  refresh: () => Promise<void>;
}

/** Mirror of src/lib/kundali/fingerprint.ts (SHA-256 of normalised params). */
async function clientFingerprint(b: BirthParamsClient): Promise<string> {
  const lat = b.lat.toFixed(4);
  const lng = b.lng.toFixed(4);
  const payload = `${b.date}|${b.time}|${lat}|${lng}`;
  const buf = new TextEncoder().encode(payload);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function useKundaliEntitlement(birth: BirthParamsClient | null): EntitlementState {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [entitled, setEntitled] = useState(false);
  const [credits, setCredits] = useState(0);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  // Recompute the fingerprint whenever birth changes — it's pure and
  // cheap. The hash drives the entitlement-check query string.
  useEffect(() => {
    let cancelled = false;
    if (!birth) {
      setFingerprint(null);
      return;
    }
    clientFingerprint(birth).then((fp) => {
      if (!cancelled) setFingerprint(fp);
    }).catch((err) => {
      console.error('[useKundaliEntitlement] fingerprint compute failed:', err);
    });
    return () => { cancelled = true; };
  }, [birth?.date, birth?.time, birth?.lat, birth?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchState = async () => {
    if (!user || !fingerprint) {
      setLoading(false);
      setEntitled(false);
      setCredits(0);
      return;
    }
    setLoading(true);
    try {
      const res = await authedFetch(`/api/kundali/credits?fingerprint=${fingerprint}`);
      if (!res.ok) {
        // Treat unknown errors as "not entitled" so the paywall surfaces
        // instead of erroneously unlocking. Don't throw — analytics shouldn't
        // gate the UI on a transient credits-API blip.
        console.error('[useKundaliEntitlement] credits fetch failed:', res.status);
        setEntitled(false);
        setCredits(0);
        return;
      }
      const data = (await res.json()) as {
        entitled?: boolean;
        creditsRemaining?: number;
      };
      setEntitled(Boolean(data.entitled));
      setCredits(Number(data.creditsRemaining ?? 0));
    } catch (err) {
      console.error('[useKundaliEntitlement] credits fetch threw:', err);
      setEntitled(false);
      setCredits(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, fingerprint]);

  return {
    loading,
    signedIn: !!user,
    entitled,
    creditsRemaining: credits,
    fingerprint,
    refresh: fetchState,
  };
}
