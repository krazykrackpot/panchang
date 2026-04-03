'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;
  if (typeof window === 'undefined') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;

  _supabase = createClient(url, key, {
    auth: {
      persistSession: true,
      storageKey: 'dekho-panchang-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return _supabase;
}
