'use client';

/**
 * PersonaModeProvider — React context for the sitewide persona mode.
 *
 * Mounted in the root `[locale]/layout.tsx`. The provider reads the
 * `dp-persona-mode` cookie + localStorage CLIENT-SIDE on hydration.
 *
 * Why not read the cookie server-side via `next/headers`? Calling
 * `cookies()` in the root layout opts the entire localised route tree
 * into dynamic rendering, disabling SSG / ISR (Gemini PR #381 cycle-3
 * HIGH). The static-page budget + SEO depend on the locale routes
 * staying static-prerendered, so we accept a one-frame flicker on
 * persona-aware surfaces in exchange for keeping ~9 K static pages
 * static. Components that render differently per mode must gate on
 * `isHydrated` to avoid the flicker.
 *
 * Cookie/storage resolution on mount:
 *   1. Cookie present + valid → use it.
 *   2. Cookie absent, localStorage present + valid → restore from
 *      localStorage and re-set the cookie.
 *   3. Both absent → keep DEFAULT_PERSONA_MODE.
 *
 * `setMode()` writes to cookie + localStorage. The Supabase
 * `user_profiles.experience_level` write happens in PR-2 via the
 * Settings page API route — not here.
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
  readPersonaModeCookieClient,
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
   * Optional override for tests. In production the provider reads the
   * `dp-persona-mode` cookie + localStorage client-side on mount; the
   * root layout does not pass this prop. When provided in a test, the
   * provider treats it as the cookie-equivalent value.
   */
  initialMode?: PersonaMode | undefined;
  children: ReactNode;
}) {
  // SSR always renders with the default mode (no cookie/localStorage
  // access). The client useEffect below resolves the real value on
  // mount. Components that render differently per mode must gate on
  // `isHydrated` to avoid the first-paint flicker.
  const [mode, setModeState] = useState<PersonaMode>(
    initialMode ?? DEFAULT_PERSONA_MODE,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Client-only. Resolve the persona mode in priority order:
    //   1. The `initialMode` prop, if provided (test override).
    //   2. The cookie, if present + valid.
    //   3. The localStorage backup, if present + valid (also re-set
    //      the cookie so subsequent requests have a fast path).
    //   4. Otherwise, keep the default already in state.
    let resolved: PersonaMode | null = initialMode ?? null;

    if (resolved === null) {
      const fromCookie = readPersonaModeCookieClient();
      if (fromCookie !== null) {
        resolved = fromCookie;
      }
    }

    try {
      const stored = window.localStorage.getItem(PERSONA_MODE_COOKIE_NAME);
      if (resolved !== null) {
        // We have a value from cookie or prop → sync localStorage.
        if (stored !== resolved) {
          window.localStorage.setItem(PERSONA_MODE_COOKIE_NAME, resolved);
        }
      } else if (stored && isValidPersonaMode(stored)) {
        // Cookie + prop absent; localStorage backup valid → restore
        // and re-set the cookie. Gemini PR #381 cycle-1 HIGH.
        resolved = stored;
        setPersonaModeCookieClient(stored);
      }
      // Else: nothing to do; default already in state.
    } catch (err) {
      // localStorage may be unavailable (sandboxed iframe, strict
      // privacy mode). We tolerate the failure — the SSR default
      // remains in effect, and the cookie path still works.
      console.error('[persona] localStorage reconcile failed:', err);
    }

    // Update React state if our resolved value differs from current.
    // Always update when `initialMode` changes (e.g., test re-render
    // with a new override) — Gemini PR #381 cycle-2 HIGH.
    if (resolved !== null && resolved !== mode) {
      setModeState(resolved);
    } else if (initialMode !== undefined && initialMode !== mode) {
      setModeState(initialMode);
    }

    setIsHydrated(true);
    // We deliberately depend on `initialMode` so that test re-renders
    // with a new override propagate. In production `initialMode` is
    // never passed, so this effect runs exactly once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
