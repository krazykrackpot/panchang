'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import type { BirthData } from '@/types/kundali';
import { normalizeBirthTime } from '@/lib/utils/birth-data';

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
let inFlightSaveKey: string | null = null;

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
        // Guarded clear — see saveChart comment. Don't clobber a different
        // user's pending fetch that started after we did.
        if (inFlightFetchKey === key) {
          inFlightFetch = null;
          inFlightFetchKey = null;
        }
      }
    })();
    return inFlightFetch;
  },

  saveChart: async (label, birthData, isPrimary = false) => {
    // Idempotency guard: in-flight save dedupe so double-click on a Save
    // button doesn't insert two rows. The 'self' case is also protected by
    // the partial unique index from migration 031, but the non-self path
    // (spouse / child / etc.) has no DB-level uniqueness — only this guard.
    //
    // Resolve the user id BEFORE the dedupe check (round 2 audit caught
    // this miss): if user A's save is mid-flight and user B signs in on
    // the same tab and triggers their own save, B must not receive A's
    // pending promise (which captured A's user.id). Same pattern as
    // subscription-store's per-user-id dedupe key.
    const supabase = getSupabase();
    if (!supabase) return { error: 'Not configured' };

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;
    if (!user) return { error: 'Not logged in' };
    const key = user.id;
    if (inFlightSave && inFlightSaveKey === key) return inFlightSave;

    inFlightSaveKey = key;
    inFlightSave = (async (): Promise<{ error?: string }> => {
      try {

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
        const normalizedNewTime = normalizeBirthTime(birthData.time);
        const dup = (candidateRows ?? []).find((row: { label: string; birth_data: BirthData }) => {
          const bd = row.birth_data;
          const rowName = (row.label || bd.name || '').trim().toLowerCase();
          // P1-23 — normalise time before compare. "12:00" and "12:00:00"
          // are the same birth time but came from different UI inputs; raw
          // string comparison would let both insert as duplicates.
          return (
            rowName === normalizedLabel &&
            bd.date === birthData.date &&
            normalizeBirthTime(bd.time) === normalizedNewTime &&
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
        // Fire-and-forget — gamification level updates inside the current
        // tab without waiting for next sign-in. awardProgress reads
        // saved_charts COUNT(*) on the server side, so racing saves can't
        // undercount. Wrapped in `void (async)` so saveChart's returned
        // promise resolves immediately after the actual save; the session
        // lookup + POST happen out-of-band.
        void (async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) return;
            const res = await fetch('/api/user/progress/chart-saved', {
              method: 'POST',
              headers: { Authorization: `Bearer ${session.access_token}` },
            });
            // fetch resolves on any HTTP status — a 401/503 would silently
            // pass `.catch()`. Surface non-2xx so production debugging works.
            if (!res.ok) throw new Error(`chart-saved award returned ${res.status}`);
          } catch (err) {
            console.error('[charts] award chart_saved failed:', err);
          }
        })();
        return {};
      } finally {
        // Only clear the slot if WE still own it. If user B signed in
        // mid-flight and kicked off their own save, B's `inFlightSaveKey`
        // is set to a different value and we must not stomp on it.
        // Gemini #118 review.
        if (inFlightSaveKey === key) {
          inFlightSave = null;
          inFlightSaveKey = null;
        }
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
    inFlightSaveKey = null;
    set({ charts: [], loading: false });
  },
}));
