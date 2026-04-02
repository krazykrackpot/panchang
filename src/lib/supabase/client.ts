'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client eagerly — Supabase needs to detect OAuth hash fragments on page load
const _supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          detectSessionInUrl: true,
          flowType: 'implicit',
        },
      })
    : null;

export function getSupabase(): SupabaseClient | null {
  return _supabase;
}

// Direct export — no proxy, no lazy init
// Components that import `supabase` must handle null checks
export const supabase = _supabase as SupabaseClient;
