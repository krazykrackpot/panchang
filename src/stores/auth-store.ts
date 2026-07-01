'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import { BASE_URL } from '@/lib/seo/base-url';
import { useChartsStore } from './charts-store';
import { useJournalStore } from './journal-store';
import { useLifeEventsStore } from './life-events-store';
import { usePredictionsStore } from './predictions-store';
import { useLearningProgressStore } from './learning-progress-store';
import { useVratTrackingStore } from './vrat-tracking-store';
import { usePrakritiStore } from './prakriti-store';
import { useBirthDataStore } from './birth-data-store';
import { useSubscriptionStore } from './subscription-store';
import type { User, Session } from '@supabase/supabase-js';

/** Wipe every per-user store. Called from signOut and from
 *  onAuthStateChange when the auth user id transitions (sign-in as a
 *  different account on the same tab). Without this, user A's data
 *  remains visible in memory until each consumer's useEffect refetches —
 *  the cross-user data leak called out in the round-1 audit.
 *
 *  Round 2 audit added: vrat-tracking, prakriti, birth-data — the first
 *  two persist to localStorage with no user-id scoping, the third had
 *  the localStorage cleared by signOut but the in-memory zustand state
 *  was never reset.
 *
 *  When adding a new per-user store: register here AND, if it writes
 *  localStorage, add its key to the `signOut` cleanup list below. */
function resetAllUserStores(): void {
  try { useChartsStore.getState().reset(); } catch (e) { console.warn('[auth-store] charts reset failed:', e); }
  try { useJournalStore.getState().reset(); } catch (e) { console.warn('[auth-store] journal reset failed:', e); }
  try { useLifeEventsStore.getState().reset(); } catch (e) { console.warn('[auth-store] life-events reset failed:', e); }
  try { usePredictionsStore.getState().reset(); } catch (e) { console.warn('[auth-store] predictions reset failed:', e); }
  try { useLearningProgressStore.getState().reset(); } catch (e) { console.warn('[auth-store] learning-progress reset failed:', e); }
  try { useVratTrackingStore.getState().reset(); } catch (e) { console.warn('[auth-store] vrat-tracking reset failed:', e); }
  try { usePrakritiStore.getState().reset(); } catch (e) { console.warn('[auth-store] prakriti reset failed:', e); }
  try { useBirthDataStore.getState().reset(); } catch (e) { console.warn('[auth-store] birth-data reset failed:', e); }
  try { useSubscriptionStore.getState().reset(); } catch (e) { console.warn('[auth-store] subscription reset failed:', e); }
}

/** Wipe per-user data from disk (localStorage + sessionStorage). Called
 *  from both `signOut` AND the `onAuthStateChange` userChanged branch so
 *  account switches via OAuth roundtrip (no explicit signOut) also clear
 *  persisted state — otherwise the next page reload re-hydrates user A's
 *  data into user B's session via `loadFromStorage()` calls. Round 3
 *  audit caught this gap. */
function clearPersistedUserData(): void {
  try {
    sessionStorage.removeItem('kundali_last_result');
    localStorage.removeItem('panchang_birth_data');
    localStorage.removeItem('dekho-panchang-learn-progress');
    localStorage.removeItem('dekho-panchang-learn-streak');
    localStorage.removeItem('dekho-panchang-learn-review');
    localStorage.removeItem('dekho-vrat-tracking');
    localStorage.removeItem('panchang_prakriti');
  } catch (err) {
    // SSR or private browsing  –  storage APIs may not be available
    console.warn('[Auth] Failed to clear cached data:', err);
  }
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string; code?: string }>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  // Re-sends the signup confirmation link for an unconfirmed email.
  // Used by the AuthModal nudge when signInWithEmail returns
  // code='email_not_confirmed'. Supabase silently no-ops if the email
  // is already confirmed or unknown — no user-enumeration signal.
  resendConfirmation: (email: string) => Promise<{ error?: string }>;
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

    // Listen for auth changes (must register BEFORE getSession so OAuth hash exchange is caught).
    // IMPORTANT: Supabase fires this for TOKEN_REFRESHED (every ~hour) and on
    // tab visibility-change too. If we naively `set({ user: session.user })`
    // every time, the `user` REFERENCE changes even when nothing material did
    // — every consumer with a `user` dep re-fires its useEffect, including
    // the dashboard's loadDashboard cascade (parallel fetches + muhurta
    // scans). Felt like the page periodically reloading.
    //
    // Only swap the user reference when the id (sign-in / sign-out)
    // actually changed. Same for session — we still update it so token
    // refreshes propagate fresh access tokens to consumers that read
    // `session.access_token` for API auth.
    supabase.auth.onAuthStateChange((event, session) => {
      const newUser = session?.user ?? null;
      let userChanged = false;
      set((prev) => {
        userChanged = (prev.user?.id ?? null) !== (newUser?.id ?? null);
        return userChanged
          ? { session, user: newUser }
          : { session };
      });
      // If the auth user id transitioned (sign-in/out / account switch on
      // the same tab), reset every per-user store so the previous user's
      // data doesn't bleed into the new session. Also clear persisted
      // disk state for the same reason — the next page reload otherwise
      // re-hydrates user A's data into user B's session.
      if (userChanged) {
        resetAllUserStores();
        clearPersistedUserData();
      }
      if (event === 'SIGNED_IN' && session) {
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        // P1-19 — Gate sign-in award on `userChanged` (only fire on a real
        // user-id transition). Supabase fires SIGNED_IN on every tab when
        // any tab signs in, on initial getSession when a session exists,
        // and after some token-refresh paths — none of which represent a
        // genuine new sign-in. Without the gate, awardProgress was being
        // invoked N times (N = number of open tabs + page reloads) per
        // actual sign-in. Streak compute is idempotent via todayIst() so
        // it self-healed, but any non-streak event added in future would
        // multi-count.
        if (userChanged) {
          fetch('/api/user/progress/sign-in', {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.access_token}` },
          }).catch(err => console.error('[auth-store] sign-in award failed:', err));
        }
      }
    });

    // getSession triggers the OAuth hash exchange if present — no setTimeout needed.
    // The onAuthStateChange callback above fires when the exchange completes.
    // Round 2 SF-21 — capture { error } so OAuth-exchange / network blips
    // surface in logs instead of leaving the user in an unidentified-but-
    // initialized state. We still mark `initialized: true` so the UI stops
    // waiting; existing state (session=null) is the safe default.
    const { data, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr) {
      console.error('[auth] getSession failed during initialize:', sessionErr.message);
    }
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
    // Return `code` alongside `message` so the UI can special-case
    // 'email_not_confirmed' without string-matching a human-readable
    // message (which Supabase can localise / reword).
    return error ? { error: error.message, code: error.code } : {};
  },

  resendConfirmation: async (email) => {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Auth not configured' };
    // Supabase's built-in per-email rate limit applies (default 60s). A
    // 429 comes back through `error` with a human-readable message we
    // surface directly. Type 'signup' resends the initial confirmation
    // link (as opposed to 'email_change' or 'invite').
    const baseUrl = BASE_URL;
    const localePrefix = window.location.pathname.split('/')[1] || 'en';
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${baseUrl}/${localePrefix}` },
    });
    if (error) {
      console.error('[auth] resend confirmation failed:', error.message);
      return { error: error.message };
    }
    return {};
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
    // P1-4 — pin redirect host to server-controlled NEXT_PUBLIC_SITE_URL,
    // not window.location.origin. Supabase's allowlist normally protects
    // us, but if anyone ever adds a wildcard (preview deploys, *.vercel.app)
    // the OAuth/reset landing could be hijacked to an attacker subdomain.
    // BASE_URL is sourced from NEXT_PUBLIC_SITE_URL via `@/lib/seo/base-url`.
    // The env-pin guards against open-redirect via window.location.origin
    // (see sprint-8-security P1-4).
    const baseUrl = BASE_URL;
    const localePrefix = window.location.pathname.split('/')[1] || 'en';
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/${localePrefix}/settings`,
    });
    return error ? { error: error.message } : {};
  },

  signInWithGoogle: async () => {
    const supabase = getSupabase();
    if (!supabase) {
      console.error('[Auth] signInWithGoogle: Supabase not configured');
      return { error: 'Auth not configured' };
    }
    // P1-4 — pin redirect host to server-controlled NEXT_PUBLIC_SITE_URL.
    // Preserve pathname + search so the user lands back where they were
    // (loss of `search` was a small UX regression noted in the audit).
    // BASE_URL is sourced from NEXT_PUBLIC_SITE_URL via `@/lib/seo/base-url`.
    // The env-pin guards against open-redirect via window.location.origin
    // (see sprint-8-security P1-4).
    const baseUrl = BASE_URL;
    const returnPath = window.location.pathname + window.location.search;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}${returnPath}`,
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
    // Reset every in-memory per-user store. onAuthStateChange will fire
    // SIGNED_OUT and the userChanged branch will reset again — both are
    // idempotent, so the double call is harmless but the explicit reset
    // here guarantees the wipe even if onAuthStateChange is slow to fire.
    resetAllUserStores();
    clearPersistedUserData();
  },
}));
