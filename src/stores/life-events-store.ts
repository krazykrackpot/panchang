'use client';

import { create } from 'zustand';
import type { LifeEvent } from '@/types/journal';

export interface LifeEventCreateInput {
  eventDate: string;      // YYYY-MM-DD
  eventType: string;
  title: string;
  description?: string;
  significance?: number;  // 1-5
  tags?: string[];
}

export interface LifeEventFilters {
  dateFrom?: string;
  dateTo?: string;
  eventType?: string;
  limit?: number;
  offset?: number;
}

interface LifeEventsState {
  events: LifeEvent[];
  loading: boolean;
  total: number;
  filters: LifeEventFilters;

  // Actions
  addEvent: (token: string, input: LifeEventCreateInput) => Promise<{ error?: string }>;
  fetchEvents: (token: string, filters?: LifeEventFilters) => Promise<{ error?: string }>;
  deleteEvent: (token: string, id: string) => Promise<{ error?: string }>;
  setFilters: (filters: Partial<LifeEventFilters>) => void;
}

export const useLifeEventsStore = create<LifeEventsState>((set, get) => ({
  events: [],
  loading: false,
  total: 0,
  filters: { limit: 50, offset: 0 },

  // ---------------------------------------------------------------------------
  // addEvent — POST /api/life-events
  // ---------------------------------------------------------------------------
  addEvent: async (token, input) => {
    set({ loading: true });
    try {
      const res = await fetch('/api/life-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventDate: input.eventDate,
          eventType: input.eventType,
          title: input.title,
          description: input.description,
          significance: input.significance,
          tags: input.tags,
        }),
      });

      const data = await res.json() as { event?: LifeEvent; error?: string };

      if (!res.ok || data.error) {
        const msg = data.error ?? 'Failed to save life event';
        console.error('[life-events] addEvent failed:', msg);
        set({ loading: false });
        return { error: msg };
      }

      if (data.event) {
        set((state) => ({
          events: [data.event!, ...state.events],
          total: state.total + 1,
          loading: false,
        }));
      } else {
        set({ loading: false });
      }

      return {};
    } catch (err) {
      console.error('[life-events] addEvent error:', err);
      set({ loading: false });
      return { error: 'Network error — please try again' };
    }
  },

  // ---------------------------------------------------------------------------
  // fetchEvents — GET /api/life-events with filters
  // ---------------------------------------------------------------------------
  fetchEvents: async (token, filters) => {
    set({ loading: true });
    try {
      const activeFilters = { ...get().filters, ...filters };
      const params = new URLSearchParams();

      if (activeFilters.dateFrom)  params.set('dateFrom',  activeFilters.dateFrom);
      if (activeFilters.dateTo)    params.set('dateTo',    activeFilters.dateTo);
      if (activeFilters.eventType) params.set('eventType', activeFilters.eventType);
      if (activeFilters.limit  != null) params.set('limit',  String(activeFilters.limit));
      if (activeFilters.offset != null) params.set('offset', String(activeFilters.offset));

      const res = await fetch(`/api/life-events?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json() as { events?: LifeEvent[]; total?: number; error?: string };

      if (!res.ok || data.error) {
        const msg = data.error ?? 'Failed to load life events';
        console.error('[life-events] fetchEvents failed:', msg);
        set({ loading: false });
        return { error: msg };
      }

      set({
        events: data.events ?? [],
        total: data.total ?? 0,
        filters: activeFilters,
        loading: false,
      });

      return {};
    } catch (err) {
      console.error('[life-events] fetchEvents error:', err);
      set({ loading: false });
      return { error: 'Network error — please try again' };
    }
  },

  // ---------------------------------------------------------------------------
  // deleteEvent — DELETE /api/life-events/[id]
  // ---------------------------------------------------------------------------
  deleteEvent: async (token, id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/life-events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json() as { success?: boolean; error?: string };

      if (!res.ok || data.error) {
        const msg = data.error ?? 'Failed to delete life event';
        console.error('[life-events] deleteEvent failed:', msg);
        set({ loading: false });
        return { error: msg };
      }

      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
        total: Math.max(0, state.total - 1),
        loading: false,
      }));

      return {};
    } catch (err) {
      console.error('[life-events] deleteEvent error:', err);
      set({ loading: false });
      return { error: 'Network error — please try again' };
    }
  },

  // ---------------------------------------------------------------------------
  // setFilters — merge partial update into current filters
  // ---------------------------------------------------------------------------
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },
}));
