'use client';

/**
 * Client-side hook to get a fresh kundali snapshot.
 *
 * ALL client components that need snapshot data MUST use this hook
 * instead of querying kundali_snapshots directly. This ensures:
 * 1. Staleness is handled (the profile API auto-recomputes)
 * 2. Single source of truth — no parallel Supabase queries
 * 3. Consistent data across all pages
 *
 * Usage:
 *   const { snapshot, loading } = useFreshSnapshot();
 *   if (loading || !snapshot) return <Spinner />;
 *   // Use snapshot.moon_sign, snapshot.full_kundali, etc.
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { FreshSnapshot } from './get-fresh-snapshot';

interface UseFreshSnapshotResult {
  snapshot: FreshSnapshot | null;
  loading: boolean;
  /** True if the snapshot was recomputed during this fetch */
  recomputed: boolean;
  /** Refetch (e.g. after user edits birth data) */
  refetch: () => void;
}

// Module-level cache — shared across all components in one session.
// Prevents redundant /api/user/profile calls when navigating between
// dashboard sub-pages.
let cachedSnapshot: FreshSnapshot | null = null;
let cachedUserId: string | null = null;
let fetchPromise: Promise<void> | null = null;

export function useFreshSnapshot(): UseFreshSnapshotResult {
  const { user, initialized } = useAuthStore();
  const [snapshot, setSnapshot] = useState<FreshSnapshot | null>(cachedSnapshot);
  const [loading, setLoading] = useState(!cachedSnapshot);
  const [recomputed, setRecomputed] = useState(false);

  const fetchSnapshot = async () => {
    const supabase = getSupabase();
    if (!supabase || !user) { setLoading(false); return; }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) { setLoading(false); return; }

    // If another component is already fetching, wait for it
    if (fetchPromise && cachedUserId === user.id) {
      await fetchPromise;
      setSnapshot(cachedSnapshot);
      setLoading(false);
      return;
    }

    setLoading(true);
    const promise = (async () => {
      try {
        const res = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          cachedSnapshot = data.snapshot || null;
          cachedUserId = user.id;
          setSnapshot(cachedSnapshot);
          setRecomputed(!!data.recomputed);
        }
      } catch (err) {
        console.error('[useFreshSnapshot] fetch failed:', err);
      }
      setLoading(false);
    })();

    fetchPromise = promise;
    await promise;
    fetchPromise = null;
  };

  useEffect(() => {
    if (!initialized || !user) { setLoading(false); return; }

    // If cache is for a different user, invalidate
    if (cachedUserId && cachedUserId !== user.id) {
      cachedSnapshot = null;
      cachedUserId = null;
    }

    // If already cached for this user, use it
    if (cachedSnapshot && cachedUserId === user.id) {
      setSnapshot(cachedSnapshot);
      setLoading(false);
      return;
    }

    fetchSnapshot();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, user?.id]);

  const refetch = () => {
    cachedSnapshot = null;
    cachedUserId = null;
    setLoading(true);
    fetchSnapshot();
  };

  return { snapshot, loading, recomputed, refetch };
}

/**
 * Invalidate the cached snapshot — call this after saving birth data
 * or any action that should trigger a fresh computation.
 */
export function invalidateSnapshotCache() {
  cachedSnapshot = null;
  cachedUserId = null;
}
