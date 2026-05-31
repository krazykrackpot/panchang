/**
 * E2E test mode detection.
 *
 * Setting `sessionStorage.dp-e2e = '1'` (via Playwright's `page.addInitScript`
 * before navigation) suppresses auto-popping UI overlays that race against
 * deterministic test flows:
 *
 *   - SignupPrompt — fires 3s after `kundali:generated` or on page-view
 *     thresholds. Races against any test that touches the kundali page.
 *   - CookieConsent — shows on first visit until consent is stored. Races
 *     against the very first interaction.
 *
 * Both modals share the same `z-[9999] role="dialog"` container, so when
 * either is open the next `.click()` from the test gets pointer-events
 * intercepted. Suppression at the source is more reliable than
 * dismiss-on-race.
 *
 * ## Production safety / host gate
 *
 * The session-storage flag alone is not enough to disable the cookie
 * banner — that would be a GDPR-relevant bypass: any same-origin XSS or
 * any future code path that sets `sessionStorage` could silently
 * suppress the consent UI. Instead, suppression requires BOTH:
 *
 *   1. `sessionStorage.dp-e2e === '1'`, AND
 *   2. The hostname is a known dev/test host (localhost, 127.0.0.1,
 *      local IPv6, or a Vercel preview URL).
 *
 * Production hosts (`dekhopanchang.com` and any future apex/www variant)
 * NEVER match `isOnTestHost()` so the cookie banner cannot be suppressed
 * regardless of session storage. Vercel preview URLs are allowed because
 * we run e2e against them in CI, but they're also not the canonical
 * domain anyone reads under a privacy audit.
 *
 * SSR-safe: returns `false` when window is undefined.
 */

function isOnTestHost(): boolean {
  // Quad defensive guard. All four failure modes return false (fail-closed)
  // so production cannot suppress the GDPR cookie banner via this path:
  //
  //   1. window absent (SSR / Node).
  //   2. window.location absent (partial mocks, sandboxes).
  //   3. hostname empty (very-degraded contexts).
  //   4. SecurityError on the `.hostname` access itself. This happens when
  //      the code runs inside a CROSS-ORIGIN iframe — the browser refuses
  //      to expose location properties to scripts not from the same origin
  //      as the framed document. Optional chaining only handles null/
  //      undefined, not thrown exceptions, so we need an explicit try.
  //
  // Gemini PRs #321 + #323 MEDIUMs both pointed at this.
  let h: string;
  try {
    if (typeof window === 'undefined' || !window.location?.hostname) return false;
    h = window.location.hostname;
  } catch {
    return false;
  }
  if (h === 'localhost' || h === '127.0.0.1' || h === '::1') return true;
  // Vercel preview deployments — `<branch>-<hash>.vercel.app`. Production
  // domain (`dekhopanchang.com`) is explicitly NOT covered here.
  if (h.endsWith('.vercel.app')) return true;
  return false;
}

export function isE2eMode(): boolean {
  if (typeof window === 'undefined') return false;
  if (!isOnTestHost()) return false;
  try {
    return window.sessionStorage.getItem('dp-e2e') === '1';
  } catch {
    // sessionStorage can throw in privacy-mode iframes; treat as not-e2e.
    return false;
  }
}
