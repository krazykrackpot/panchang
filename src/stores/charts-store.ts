'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
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
    const { data, error } = await supabase
      .from('saved_charts')
      .select('id, label, birth_data, is_primary, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ charts: data as SavedChart[] });
    }
    set({ loading: false });
  },

  saveChart: async (label, birthData, isPrimary = false) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { error: 'Not logged in' };

    // If setting as primary, unset existing primary
    if (isPrimary) {
      await supabase
        .from('saved_charts')
        .update({ is_primary: false })
        .eq('user_id', userData.user.id)
        .eq('is_primary', true);
    }

    const { error } = await supabase.from('saved_charts').insert({
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
    await supabase.from('saved_charts').delete().eq('id', id);
    set({ charts: get().charts.filter((c) => c.id !== id) });
  },
}));
