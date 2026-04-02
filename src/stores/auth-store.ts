'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('[Auth] Supabase client not available');
      set({ initialized: true });
      return;
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] onAuthStateChange:', event, session?.user?.email ?? 'no user');
      set({ session, user: session?.user ?? null });
      if (event === 'SIGNED_IN' && session) {
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    });

    // Check existing session
    const { data, error } = await supabase.auth.getSession();
    console.log('[Auth] getSession:', data.session ? `user=${data.session.user.email}` : 'no session', error?.message ?? '');
    set({
      session: data.session,
      user: data.session?.user ?? null,
      initialized: true,
    });
  },

  signInWithEmail: async (email, password) => {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Auth not configured' };
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    return error ? { error: error.message } : {};
  },

  signUpWithEmail: async (email, password, name) => {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Auth not configured' };
    set({ loading: true });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    set({ loading: false });
    return error ? { error: error.message } : {};
  },

  signInWithGoogle: async () => {
    const supabase = getSupabase();
    if (!supabase) {
      console.error('Supabase not configured');
      return;
    }
    // Determine locale from current path
    const pathParts = window.location.pathname.split('/');
    const locale = ['en', 'hi', 'sa'].includes(pathParts[1]) ? pathParts[1] : 'en';
    const callbackUrl = `${window.location.origin}/${locale}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl },
    });
    if (error) {
      console.error('Google sign-in error:', error.message);
      return;
    }
    if (data?.url) {
      window.location.href = data.url;
    }
  },

  signOut: async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
