/**
 * E2E skeleton test for Sudarshana Chakra.
 *
 * Navigates to the kundali page and verifies it loads.
 * Full Sudarshana UI tests will be added once the component is built.
 */
import { test, expect } from '@playwright/test';

test.describe('Sudarshana Chakra', () => {
  test('kundali page loads successfully', async ({ page }) => {
    await page.goto('/en/kundali');
    // The kundali page should display the birth form
    await expect(
      page.locator('main').first()
    ).toBeVisible({ timeout: 10000 });
  });
});
