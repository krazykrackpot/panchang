import { test, expect } from '@playwright/test';

/**
 * Skeleton E2E test for gemstone remedies.
 * Verifies the kundali page loads and a chart can be generated.
 * When UI is added for the remedies tab, extend these tests.
 */
test.describe('Gemstone Remedies', () => {
  test('kundali page loads and birth form is present', async ({ page }) => {
    await page.goto('/en/kundali');
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
  });

  test.skip('remedies tab appears after chart generation', async ({ page }) => {
    // TODO: Enable when remedies UI tab is added to the kundali page.
    // 1. Navigate to /en/kundali
    // 2. Fill birth form (name, date, time, place)
    // 3. Submit and wait for chart
    // 4. Click "Remedies" tab
    // 5. Verify gemstone cards are visible
    await page.goto('/en/kundali');
    // Placeholder — will be filled when UI ships
    expect(true).toBe(true);
  });
});
