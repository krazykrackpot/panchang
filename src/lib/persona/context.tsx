'use client';

/**
 * PersonaModeProvider — React context for the sitewide persona mode.
 *
 * Mounted in the root `[locale]/layout.tsx` with the cookie-derived
 * `initialMode` so the first paint already reflects the user's mode
 * (no flash-of-Simple regression that the legacy `kundali-view-mode`
 * suffered).
 *
 * - SSR reads the cookie via `next/headers` and passes `initialMode`.
 * - On mount, the client checks localStorage for drift; cookie wins,
 *   localStorage gets synced.
 * - `setMode()` writes to cookie + localStorage. The Supabase
 *   `user_profiles.experience_level` write happens in PR-2 via the
 *   Settings page API route — not here.
 *
 * Design refs:
 *   docs/superpowers/specs/2026-06-03-persona-mode-setting-v1-design.md
 */

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  PERSONA_MODE_COOKIE_NAME,
  setPersonaModeCookieClient,
} from './cookie';
import {
  DEFAULT_PERSONA_MODE,
  isValidPersonaMode,
  type PersonaMode,
} from './types';

interface PersonaModeContextValue {
  /** Current persona mode. Reflects SSR cookie on first paint. */
  mode: PersonaMode;
  /**
   * Update the mode. Writes cookie + localStorage synchronously, then
   * updates the in-memory context. The Supabase profile sync is
   * handled by the Settings page API route (PR-2) — calling `setMode()`
   * here only persists locally.
   */
  setMode: (mode: PersonaMode) => void;
  /**
   * `true` after the first client-side effect runs. Components that
   * need to render differently before vs after hydration can read this
   * (e.g., to avoid an SSR/CSR mismatch warning when the cookie was
   * absent and the default was used).
   */
  isHydrated: boolean;
}

const PersonaModeContext = createContext<PersonaModeContextValue | null>(null);

/** Read-only fallback used when no provider is mounted (tests / orphans). */
const FALLBACK_CONTEXT: PersonaModeContextValue = {
  mode: DEFAULT_PERSONA_MODE,
  setMode: () => {
    // Intentionally silent: callers that mount without a provider get
    // a no-op setter rather than a thrown error. The mode is whatever
    // the default is and stays put.
  },
  isHydrated: false,
};

export function PersonaModeProvider({
  initialMode,
  children,
}: {
  /**
   * Raw cookie value from the root layout. `undefined` when the cookie
   * is absent — in that case the provider will try to restore from
   * `localStorage` after hydration, falling back to the default only
   * if localStorage is empty too. Pass the raw value (not a parsed
   * default) so the provider can distinguish "cookie absent" from
   * "cookie present with value X".
   */
  initialMode: PersonaMode | undefined;
  children: ReactNode;
}) {
  // SSR uses the cookie value if present, otherwise the default. The
  // localStorage backup is checked client-side in useEffect (the
  // window object isn't available during SSR).
  const [mode, setModeState] = useState<PersonaMode>(
    initialMode ?? DEFAULT_PERSONA_MODE,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // After hydration (and on every subsequent `initialMode` change),
    // reconcile localStorage with the SSR-derived value. Two paths:
    //   1. Cookie was present: it wins. Update React state if it
    //      changed since the last render (e.g., navigation refreshed
    //      the layout with a new cookie value from the Settings API)
    //      and sync localStorage to match.
    //   2. Cookie was absent: try to restore from localStorage. If
    //      localStorage has a valid value, adopt it AND write the
    //      cookie so subsequent requests can use the SSR path. If
    //      localStorage is also empty, keep the default already set.
    //
    // The state update in path 1 is essential because `useState`
    // initialises only on the first mount; subsequent prop changes
    // would otherwise be ignored. Gemini PR #381 cycle-2 HIGH.
    try {
      const stored = window.localStorage.getItem(PERSONA_MODE_COOKIE_NAME);
      if (initialMode !== undefined) {
        // Cookie wins. Update React state + sync localStorage.
        setModeState(initialMode);
        if (stored !== initialMode) {
          window.localStorage.setItem(PERSONA_MODE_COOKIE_NAME, initialMode);
        }
      } else if (stored && isValidPersonaMode(stored)) {
        // Cookie absent, localStorage backup valid → restore.
        setModeState(stored);
        setPersonaModeCookieClient(stored);
      }
      // Else: cookie absent + storage empty → default already set.
    } catch {
      // localStorage may be unavailable (privacy mode, SSR, jsdom
      // without storage). We tolerate the failure — the SSR default
      // remains in effect.
    }
    setIsHydrated(true);
  }, [initialMode]);

  const setMode = useCallback((newMode: PersonaMode) => {
    setModeState(newMode);
    setPersonaModeCookieClient(newMode);
    try {
      window.localStorage.setItem(PERSONA_MODE_COOKIE_NAME, newMode);
    } catch {
      // localStorage write failure is tolerated — cookie still persists.
    }
  }, []);

  return (
    <PersonaModeContext.Provider value={{ mode, setMode, isHydrated }}>
      {children}
    </PersonaModeContext.Provider>
  );
}

/**
 * Hook returning the current persona mode + setter. Returns a
 * sensible fallback (default mode, no-op setter) when called outside
 * a provider so individual components can still render in isolation
 * (test fixtures, Storybook).
 */
export function usePersonaMode(): PersonaModeContextValue {
  const ctx = useContext(PersonaModeContext);
  return ctx ?? FALLBACK_CONTEXT;
}
