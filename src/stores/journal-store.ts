'use client';

import { create } from 'zustand';
import type { JournalEntry, JournalCreateInput, JournalFilters } from '@/types/journal';

interface JournalState {
  entries: JournalEntry[];
  todayEntry: JournalEntry | null;
  loading: boolean;
  filters: JournalFilters;
  total: number;

  // Actions
  submitCheckin: (token: string, input: JournalCreateInput) => Promise<{ error?: string }>;
  fetchEntries: (token: string, filters?: JournalFilters) => Promise<{ error?: string }>;
  fetchTodayEntry: (token: string) => Promise<{ error?: string }>;
  deleteEntry: (token: string, id: string) => Promise<{ error?: string }>;
  setFilters: (filters: Partial<JournalFilters>) => void;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  todayEntry: null,
  loading: false,
  filters: { limit: 30, offset: 0 },
  total: 0,

  // ---------------------------------------------------------------------------
  // submitCheckin — POST /api/journal
  // ---------------------------------------------------------------------------
  submitCheckin: async (token, input) => {
    set({ loading: true });
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });

      const data = await res.json() as { entry?: JournalEntry; error?: string };

      if (!res.ok || data.error) {
        const msg = data.error ?? 'Failed to save journal entry';
        console.error('[journal] submitCheckin failed:', msg);
        set({ loading: false });
        return { error: msg };
      }

      if (data.entry) {
        // Update todayEntry and splice into entries list if already loaded
        set((state) => {
          const updatedEntries = state.entries.some((e) => e.id === data.entry!.id)
            ? state.entries.map((e) => (e.id === data.entry!.id ? data.entry! : e))
            : [data.entry!, ...state.entries];
          return {
            todayEntry: data.entry!,
            entries: updatedEntries,
            loading: false,
          };
        });
      } else {
        set({ loading: false });
      }

      return {};
    } catch (err) {
      console.error('[journal] submitCheckin error:', err);
      set({ loading: false });
      return { error: 'Network error — please try again' };
    }
  },

  // ---------------------------------------------------------------------------
  // fetchEntries — GET /api/journal with filters
  // ---------------------------------------------------------------------------
  fetchEntries: async (token, filters) => {
    set({ loading: true });
    try {
      const activeFilters = { ...get().filters, ...filters };
      const params = new URLSearchParams();

      if (activeFilters.dateFrom)        params.set('dateFrom',        activeFilters.dateFrom);
      if (activeFilters.dateTo)          params.set('dateTo',          activeFilters.dateTo);
      if (activeFilters.mahaDasha)       params.set('mahaDasha',       activeFilters.mahaDasha);
      if (activeFilters.antarDasha)      params.set('antarDasha',      activeFilters.antarDasha);
      if (activeFilters.nakshatraNumber != null)
        params.set('nakshatraNumber', String(activeFilters.nakshatraNumber));
      if (activeFilters.tithiNumber != null)
        params.set('tithiNumber', String(activeFilters.tithiNumber));
      if (activeFilters.moodMin != null)
        params.set('moodMin', String(activeFilters.moodMin));
      if (activeFilters.limit  != null) params.set('limit',  String(activeFilters.limit));
      if (activeFilters.offset != null) params.set('offset', String(activeFilters.offset));

      const res = await fetch(`/api/journal?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json() as { entries?: JournalEntry[]; total?: number; error?: string };

      if (!res.ok || data.error) {
        const msg = data.error ?? 'Failed to load journal entries';
        console.error('[journal] fetchEntries failed:', msg);
        set({ loading: false });
        return { error: msg };
      }

      set({
        entries: data.entries ?? [],
        total: data.total ?? 0,
        filters: activeFilters,
        loading: false,
      });

      return {};
    } catch (err) {
      console.error('[journal] fetchEntries error:', err);
      set({ loading: false });
      return { error: 'Network error — please try again' };
    }
  },

  // ---------------------------------------------------------------------------
  // fetchTodayEntry — GET /api/journal?dateFrom=today&dateTo=today
  // ---------------------------------------------------------------------------
  fetchTodayEntry: async (token) => {
    set({ loading: true });
    try {
      // Get today's date in ISO format (YYYY-MM-DD)
      const today = new Date().toISOString().slice(0, 10);
      const params = new URLSearchParams({ dateFrom: today, dateTo: today, limit: '1' });

      const res = await fetch(`/api/journal?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json() as { entries?: JournalEntry[]; total?: number; error?: string };

      if (!res.ok || data.error) {
        const msg = data.error ?? 'Failed to load today\'s journal entry';
        console.error('[journal] fetchTodayEntry failed:', msg);
        set({ loading: false });
        return { error: msg };
      }

      const todayEntry = (data.entries ?? [])[0] ?? null;
      set({ todayEntry, loading: false });

      return {};
    } catch (err) {
      console.error('[journal] fetchTodayEntry error:', err);
      set({ loading: false });
      return { error: 'Network error — please try again' };
    }
  },

  // ---------------------------------------------------------------------------
  // deleteEntry — DELETE /api/journal/{id}
  // ---------------------------------------------------------------------------
  deleteEntry: async (token, id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json() as { success?: boolean; error?: string };

      if (!res.ok || data.error) {
        const msg = data.error ?? 'Failed to delete journal entry';
        console.error('[journal] deleteEntry failed:', msg);
        set({ loading: false });
        return { error: msg };
      }

      // Remove from local state
      set((state) => ({
        entries: state.entries.filter((e) => e.id !== id),
        todayEntry: state.todayEntry?.id === id ? null : state.todayEntry,
        total: Math.max(0, state.total - 1),
        loading: false,
      }));

      return {};
    } catch (err) {
      console.error('[journal] deleteEntry error:', err);
      set({ loading: false });
      return { error: 'Network error — please try again' };
    }
  },

  // ---------------------------------------------------------------------------
  // setFilters — merge partial filter update into current filters
  // ---------------------------------------------------------------------------
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },
}));
