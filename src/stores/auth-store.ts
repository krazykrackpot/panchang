'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
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
    const { data } = await supabase.auth.getSession();
    set({
      session: data.session,
      user: data.session?.user ?? null,
      initialized: true,
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  signInWithEmail: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    return error ? { error: error.message } : {};
  },

  signUpWithEmail: async (email, password, name) => {
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
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
