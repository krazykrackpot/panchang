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
  signInWithGoogle: () => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
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

    // Listen for auth changes (must register BEFORE getSession so OAuth hash exchange is caught)
    supabase.auth.onAuthStateChange((event, session) => {
      set({ session, user: session?.user ?? null });
      if (event === 'SIGNED_IN' && session) {
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        // Fire-and-forget: award sign-in progress (advances streak, computes badges).
        fetch('/api/user/progress/sign-in', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
        }).catch(err => console.error('[auth-store] sign-in award failed:', err));
      }
    });

    // getSession triggers the OAuth hash exchange if present — no setTimeout needed.
    // The onAuthStateChange callback above fires when the exchange completes.
    const { data } = await supabase.auth.getSession();
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    set({ loading: false });
    if (error) return { error: error.message };
    // Supabase returns an empty identities array if the email already exists
    if (data.user && data.user.identities?.length === 0) {
      return { error: 'An account with this email already exists. Please sign in instead.' };
    }
    return {};
  },

  resetPassword: async (email) => {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Auth not configured' };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${window.location.pathname.split('/')[1] || 'en'}/settings`,
    });
    return error ? { error: error.message } : {};
  },

  signInWithGoogle: async () => {
    const supabase = getSupabase();
    if (!supabase) {
      console.error('[Auth] signInWithGoogle: Supabase not configured');
      return { error: 'Auth not configured' };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });
    if (error) {
      console.error('[Auth] signInWithGoogle failed:', error.message);
      return { error: error.message };
    }
    if (data?.url) {
      window.location.href = data.url;
    }
    return {};
  },

  signOut: async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    set({ user: null, session: null });
    // Clear all user-specific cached data
    try {
      sessionStorage.removeItem('kundali_last_result');
      localStorage.removeItem('panchang_birth_data');
      localStorage.removeItem('dekho-panchang-learn-progress');
      localStorage.removeItem('dekho-panchang-learn-streak');
    } catch (err) {
      // SSR or private browsing  –  storage APIs may not be available
      console.warn('[Auth] Failed to clear cached data on sign-out:', err);
    }
  },
}));
