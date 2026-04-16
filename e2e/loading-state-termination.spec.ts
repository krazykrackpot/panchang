/**
 * Loading state must terminate — no infinite spinners.
 *
 * Context: in Apr 2026, `saved-charts/page.tsx` had:
 *   const fetchCharts = () => {
 *     if (!user) return;   // ← loading stays true forever when user=null
 *     ...
 *   };
 * When visited without a logged-in user, the spinner spun indefinitely
 * because the early return never called setLoading(false). Users assumed
 * the page was broken.
 *
 * This test ensures every auth-gated dashboard route terminates its
 * loading state within a reasonable window — either to a sign-in prompt
 * or to content. If a spinner is still visible after N seconds, fail.
 */

import { test, expect } from '@playwright/test';

const AUTH_GATED_ROUTES = [
  '/en/dashboard',
  '/en/dashboard/saved-charts',
  '/en/dashboard/chart',
  '/en/dashboard/dashas',
  '/en/dashboard/muhurta',
  '/en/dashboard/transits',
  '/en/dashboard/remedies',
];

for (const route of AUTH_GATED_ROUTES) {
  test(`${route} terminates loading state when unauthenticated`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Give auth restore up to 8 seconds to finish. That's generous — most
    // routes resolve in under 2s in practice.
    await page.waitForTimeout(8000);

    // After auth settles, the page should show EITHER a sign-in prompt OR
    // dashboard content. It must NOT still be showing only a spinner.
    const bodyText = ((await page.locator('body').textContent()) || '').toLowerCase();

    // Signals that we've reached a real state (any of these is fine):
    const hasSignInPrompt =
      /sign in|sign-in|log in|signin/.test(bodyText);
    const hasContent =
      /dashboard|saved|chart|remed|transit|muhurt|dasha/i.test(bodyText);

    expect(
      hasSignInPrompt || hasContent,
      `${route} still appears to be loading after 8s — no sign-in prompt or content visible. Body text: "${bodyText.slice(0, 300)}"`,
    ).toBe(true);

    // Also check no spinning loader with the "loading..." label is the only
    // visible thing. If body text is dominated by the word "loading" it's
    // probably stuck.
    const loadingCount = (bodyText.match(/loading/g) || []).length;
    expect(
      loadingCount,
      `${route} shows "loading" text ${loadingCount} times — likely stuck in a loading state`,
    ).toBeLessThan(3);
  });
}
