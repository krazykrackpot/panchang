'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import type { BirthData } from '@/types/kundali';

interface SavedChart {
  id: string;
  label: string;
  birth_data: BirthData;
  is_primary: boolean;
  created_at: string;
}

interface ChartsState {
  charts: SavedChart[];
  loading: boolean;
  fetchCharts: () => Promise<void>;
  saveChart: (label: string, birthData: BirthData, isPrimary?: boolean) => Promise<{ error?: string }>;
  deleteChart: (id: string) => Promise<void>;
  /** Reset in-memory state — called from auth-store.signOut so user A's
   *  charts don't bleed into user B's session. */
  reset: () => void;
}

// Module-scope in-flight dedupe keyed by user id (or 'anon' for no-session).
// Same canonical pattern as subscription-store: avoids N consumers each
// firing their own concurrent fetch + auth-lock contention. Key flip on
// user change starts a fresh fetch instead of returning user A's pending
// promise.
let inFlightFetch: Promise<void> | null = null;
let inFlightFetchKey: string | null = null;
let inFlightSave: Promise<{ error?: string }> | null = null;

export const useChartsStore = create<ChartsState>((set, get) => ({
  charts: [],
  loading: false,

  fetchCharts: async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    // getSession() — local read, no nav-lock contention. We only need
    // user.id, RLS validates ownership on the query itself.
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;
    const key = user?.id ?? 'anon';
    if (inFlightFetch && inFlightFetchKey === key) return inFlightFetch;
    if (!user) {
      // Logged out — clear any stale charts so the next sign-in doesn't see
      // the previous user's rows for an instant before refetch lands.
      set({ charts: [], loading: false });
      return;
    }

    inFlightFetchKey = key;
    set({ loading: true });
    inFlightFetch = (async () => {
      try {
        const { data, error } = await supabase
          .from('saved_charts')
          .select('id, label, birth_data, is_primary, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) {
          console.error('[charts] fetch failed:', error.message);
          return;
        }
        set({ charts: (data ?? []) as SavedChart[] });
      } finally {
        set({ loading: false });
        inFlightFetch = null;
        inFlightFetchKey = null;
      }
    })();
    return inFlightFetch;
  },

  saveChart: async (label, birthData, isPrimary = false) => {
    // Idempotency guard: in-flight save dedupe so double-click on a Save
    // button doesn't insert two rows. The 'self' case is also protected by
    // the partial unique index from migration 031, but the non-self path
    // (spouse / child / etc.) has no DB-level uniqueness — only this guard.
    if (inFlightSave) return inFlightSave;
    const supabase = getSupabase();
    if (!supabase) return { error: 'Not configured' };

    inFlightSave = (async (): Promise<{ error?: string }> => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        if (!user) return { error: 'Not logged in' };

        // Natural-key dedupe: same name + date + time + lat/lng → existing
        // row wins, no insert. Matches the same algorithm used by
        // kundali/Client.tsx handleSaveChart. Pre-filter by label at the
        // DB level (Postgres uses the user_id index + ilike) so we don't
        // ship every chart over the wire just to find a match — N grows
        // with user history but per-user candidates stay tiny.
        const normalizedLabel = label.trim().toLowerCase();
        const { data: candidateRows } = await supabase
          .from('saved_charts')
          .select('id, label, birth_data')
          .eq('user_id', user.id)
          .ilike('label', label.trim())
          .limit(20);
        const dup = (candidateRows ?? []).find((row: { label: string; birth_data: BirthData }) => {
          const bd = row.birth_data;
          const rowName = (row.label || bd.name || '').trim().toLowerCase();
          return (
            rowName === normalizedLabel &&
            bd.date === birthData.date &&
            bd.time === birthData.time &&
            Math.abs((bd.lat ?? 0) - birthData.lat) < 0.0001 &&
            Math.abs((bd.lng ?? 0) - birthData.lng) < 0.0001
          );
        });
        if (dup) {
          await get().fetchCharts();
          return {};
        }

        if (isPrimary) {
          await supabase
            .from('saved_charts')
            .update({ is_primary: false })
            .eq('user_id', user.id)
            .eq('is_primary', true);
        }

        const { error } = await supabase.from('saved_charts').insert({
          user_id: user.id,
          label,
          birth_data: birthData,
          is_primary: isPrimary,
        });
        if (error) {
          console.error('[charts] save failed:', error.message);
          return { error: error.message };
        }
        await get().fetchCharts();
        return {};
      } finally {
        inFlightSave = null;
      }
    })();
    return inFlightSave;
  },

  deleteChart: async (id) => {
    const supabase = getSupabase();
    if (!supabase) return;
    // RLS on saved_charts enforces user_id = auth.uid(), so delete-by-id is
    // scoped to the current user.
    const { error } = await supabase.from('saved_charts').delete().eq('id', id);
    if (error) {
      console.error('[charts] delete failed:', error.message);
      return;
    }
    set({ charts: get().charts.filter((c) => c.id !== id) });
  },

  reset: () => {
    inFlightFetch = null;
    inFlightFetchKey = null;
    inFlightSave = null;
    set({ charts: [], loading: false });
  },
}));
