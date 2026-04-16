/**
 * Errors must be visible — no silent failures.
 *
 * Context: in Apr 2026, `saved-charts/page.tsx` did:
 *   .then(({ data }) => { if (data) setCharts(data); setLoading(false); });
 * When the Supabase query failed (RLS, expired JWT, network), `data` was
 * null and `error` was ignored. The UI rendered "No saved charts" as if
 * the user simply had none — users assumed their data was lost.
 *
 * This test intercepts the Supabase saved_charts query, returns a 401,
 * and asserts that the UI shows a visible error banner (not just empty
 * state). If a future change removes error surfacing, this fails.
 */

import { test, expect } from '@playwright/test';

test.describe('Error surfacing — failures must reach the user', () => {
  test.skip(
    !process.env.E2E_AUTH_COOKIE,
    'Requires E2E_AUTH_COOKIE for an authenticated session on /dashboard/saved-charts.',
  );

  test('saved-charts page shows error banner when Supabase returns an error', async ({ page, context }) => {
    if (process.env.E2E_AUTH_COOKIE) {
      await context.addCookies([
        {
          name: 'dekho-panchang-auth',
          value: process.env.E2E_AUTH_COOKIE,
          domain: 'localhost',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
      ]);
    }

    // Make the saved_charts query fail with an RLS-style error.
    await page.route(/\/rest\/v1\/saved_charts/, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            code: '42501',
            message: 'new row violates row-level security policy',
            hint: null,
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/en/dashboard/saved-charts', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const bodyText = ((await page.locator('body').textContent()) || '').toLowerCase();

    test.skip(
      /sign in to manage/i.test(bodyText) && !bodyText.includes('could not load'),
      'Page did not reach authenticated view — auth cookie may be expired.',
    );

    // The error banner added in the fix says "Could not load saved charts"
    // plus the raw message. We accept either phrase being present.
    const hasErrorMessage =
      /could not load|failed|error|row-level/i.test(bodyText);

    expect(
      hasErrorMessage,
      `Expected a visible error message on saved-charts when the API returns 401. ` +
      `The UI appears to silently show empty state. Body: "${bodyText.slice(0, 300)}"`,
    ).toBe(true);
  });
});
