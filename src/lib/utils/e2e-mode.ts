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
 * Production never sets this flag — sessionStorage is per-tab, can't be
 * set by external pages (same-origin restriction), and the only writer is
 * the e2e harness. So this is a test-mode toggle, not a feature flag.
 *
 * SSR-safe: returns `false` when window is undefined.
 */
export function isE2eMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem('dp-e2e') === '1';
  } catch {
    // sessionStorage can throw in privacy-mode iframes; treat as not-e2e.
    return false;
  }
}
