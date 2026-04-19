/**
 * Eclipse Impact on Your Chart — E2E Skeleton
 *
 * Verifies the eclipses page loads successfully. The eclipse impact engine
 * is backend-only (no dedicated UI page yet), so this test confirms the
 * existing eclipses page renders without errors as a smoke test.
 */

import { test, expect } from '@playwright/test';

test.describe('Eclipse Impact — Smoke', () => {
  test('eclipses page loads without errors', async ({ page }) => {
    await page.goto('/en/eclipses', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1');
    await expect(heading).toContainText(/Eclipse|ग्रहण/i, { timeout: 15000 });
  });
});
