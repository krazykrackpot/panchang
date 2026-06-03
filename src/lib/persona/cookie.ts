/**
 * Cookie + localStorage helpers for `dp-persona-mode`.
 *
 * The cookie is the SSR-readable source of truth: the root layout
 * parses it server-side so the first paint already reflects the
 * user's mode. localStorage mirrors the cookie as a defensive
 * fallback in case the cookie is cleared or third-party cookie
 * blocking is in play.
 */

import { DEFAULT_PERSONA_MODE, isValidPersonaMode, type PersonaMode } from './types';

/** Cookie + localStorage key. */
export const PERSONA_MODE_COOKIE_NAME = 'dp-persona-mode';

/** Legacy localStorage key carried by `/kundali`. PR-3 migrates it
 *  into the new key and PR-7 removes the fallback entirely. */
export const LEGACY_KUNDALI_VIEW_MODE_KEY = 'kundali-view-mode';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Parse a cookie / storage value into a valid `PersonaMode`. Falls back
 * to the default for anything unrecognised so a corrupted cookie can
 * never break the UI.
 */
export function parsePersonaMode(value: string | null | undefined): PersonaMode {
  if (value && isValidPersonaMode(value)) return value;
  return DEFAULT_PERSONA_MODE;
}

/**
 * Build the `Set-Cookie` header string for a given mode. Used by API
 * routes that update the mode server-side.
 *
 * - Path=/  → cookie is sent on every request.
 * - Max-Age=1 year  → persists across browser sessions.
 * - SameSite=Lax  → safe default; the cookie is only a UI preference
 *   so we don't need cross-site behaviour.
 * - Secure  → HTTPS only in production (skipped in dev for localhost).
 */
export function buildPersonaModeCookieHeader(
  mode: PersonaMode,
  options: { secure?: boolean } = {},
): string {
  const secureFlag = options.secure ? '; Secure' : '';
  return `${PERSONA_MODE_COOKIE_NAME}=${mode}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${secureFlag}`;
}

/**
 * Write the cookie client-side via `document.cookie`. No-op outside the
 * browser (SSR safety).
 *
 * `document.cookie` writes can throw `SecurityError` / `DOMException`
 * in sandboxed iframes, strict privacy modes, or when third-party
 * cookies are entirely blocked. We silently swallow the failure — the
 * caller is already responsible for syncing localStorage as a backup,
 * and the persona mode is a UI preference (not load-bearing for
 * functionality). Gemini PR #381 cycle-3 MED.
 */
export function setPersonaModeCookieClient(mode: PersonaMode): void {
  if (typeof document === 'undefined') return;
  try {
    const isHttps =
      typeof window !== 'undefined' && window.location?.protocol === 'https:';
    document.cookie = buildPersonaModeCookieHeader(mode, { secure: isHttps });
  } catch (err) {
    console.error('[persona] cookie write blocked:', err);
  }
}

/**
 * Read the persona-mode cookie from a Document. Returns the parsed
 * mode if the cookie is present and valid, or `null` if absent.
 *
 * Returning `null` (rather than the default) lets callers distinguish
 * "cookie absent" from "cookie present with valid value" — important
 * for the provider's localStorage-restore path.
 *
 * Browser-only; on SSR returns `null`. Same try/catch defence as the
 * write path (Gemini PR #381 cycle-3 MED).
 */
export function readPersonaModeCookieClient(): PersonaMode | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${PERSONA_MODE_COOKIE_NAME}=([^;]+)`),
    );
    const raw = match?.[1];
    return raw && isValidPersonaMode(raw) ? raw : null;
  } catch (err) {
    console.error('[persona] cookie read blocked:', err);
    return null;
  }
}
