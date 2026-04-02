'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;
let _initialized = false;

export function getSupabase(): SupabaseClient | null {
  if (_initialized) return _supabase;
  _initialized = true;

  // Only create in browser
  if (typeof window === 'undefined') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;

  _supabase = createClient(url, key, {
    auth: {
      detectSessionInUrl: true,
      flowType: 'implicit',
      persistSession: true,
      storageKey: 'dekho-panchang-auth',
      autoRefreshToken: true,
    },
  });

  return _supabase;
}

// For backward compat — always use getSupabase() for null safety
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) return undefined;
    return (client as unknown as Record<string, unknown>)[prop as string];
  },
});
