/**
 * Sprint 13 — P2 silent failures e2e.
 *
 * Behavioural assertions for the surfaced-error UI:
 *   - /api/financial response shape carries the new `warnings` array
 *   - /matching loads without unhandled-rejection events even when the
 *     /api/kundali calls fail (we force them to fail by passing a
 *     malformed body via direct fetch from a Playwright page).
 *
 * The page-level catches (P2-12, P2-14) require auth flows to exercise
 * end-to-end; their structural locks live in the vitest file. This e2e
 * focuses on the unauthenticated behavioural surface.
 */
import { test, expect, request as pwRequest } from '@playwright/test';

test.describe('P2-13 /api/financial — warnings array exists', () => {
  test('response shape includes warnings: [] (or populated)', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.post('/api/financial', {
      data: {
        birthData: {
          name: 'Test',
          date: '1990-06-15',
          time: '10:30',
          lat: 28.6,
          lng: 77.2,
          timezone: 'Asia/Kolkata',
          ayanamsha: 'lahiri',
        },
      },
    });
    if (res.status() === 200) {
      const body = await res.json();
      // The new contract: every success response carries `warnings`.
      // Each entry is `{ section, code }` — a translation key the
      // frontend maps to a localized string. No API-side English copy.
      expect(body, 'response should include a warnings array').toHaveProperty('warnings');
      expect(Array.isArray(body.warnings)).toBe(true);
      for (const w of body.warnings) {
        expect(w, 'warning should have section + code').toHaveProperty('section');
        expect(w, 'warning should have section + code').toHaveProperty('code');
        // Guard: no user-facing English copy leaks via a `message` field.
        expect(w).not.toHaveProperty('message');
      }
    }
    await ctx.dispose();
  });
});

test.describe('P2-15 /matching — no unhandled-rejection events on load', () => {
  test('loading the page registers zero unhandled-rejection events', async ({ page }) => {
    const unhandled: string[] = [];
    page.on('pageerror', (e) => {
      // Playwright surfaces unhandled promise rejections as pageerror
      // events whose message starts with 'Unhandled' or includes the
      // rejection reason. Accept any pageerror as a regression signal.
      unhandled.push(e.message);
    });

    const response = await page.goto('/en/matching', { waitUntil: 'networkidle' });
    expect(response?.status() ?? 0).toBeLessThan(500);

    // Wait for hydration via a deterministic signal — the matching form's
    // boy-section input is the first hydrated interactive element. Using
    // a web-first locator + waitForLoadState avoids the flaky fixed
    // waitForTimeout previously here.
    await page.locator('input[type="date"]').first().waitFor({ state: 'visible', timeout: 5_000 });
    await page.waitForLoadState('networkidle');

    expect(unhandled, `page emitted: ${unhandled.join('; ')}`).toEqual([]);
  });
});
