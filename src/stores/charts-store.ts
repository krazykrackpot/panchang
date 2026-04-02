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
}

export const useChartsStore = create<ChartsState>((set, get) => ({
  charts: [],
  loading: false,

  fetchCharts: async () => {
    set({ loading: true });
    const { data, error } = await getSupabase()!
      .from('saved_charts')
      .select('id, label, birth_data, is_primary, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ charts: data as SavedChart[] });
    }
    set({ loading: false });
  },

  saveChart: async (label, birthData, isPrimary = false) => {
    const { data: userData } = await getSupabase()!.auth.getUser();
    if (!userData.user) return { error: 'Not logged in' };

    // If setting as primary, unset existing primary
    if (isPrimary) {
      await getSupabase()!
        .from('saved_charts')
        .update({ is_primary: false })
        .eq('user_id', userData.user.id)
        .eq('is_primary', true);
    }

    const { error } = await getSupabase()!.from('saved_charts').insert({
      user_id: userData.user.id,
      label,
      birth_data: birthData,
      is_primary: isPrimary,
    });

    if (!error) {
      await get().fetchCharts();
    }
    return error ? { error: error.message } : {};
  },

  deleteChart: async (id) => {
    await getSupabase()!.from('saved_charts').delete().eq('id', id);
    set({ charts: get().charts.filter((c) => c.id !== id) });
  },
}));
