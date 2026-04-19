import { test, expect } from '@playwright/test';

test.describe('Detailed Compatibility Report', () => {
  test('page loads and shows form', async ({ page }) => {
    await page.goto('/en/matching/report');
    await expect(page.locator('h1')).toContainText('Detailed Compatibility Report');
    // Two birth cards visible
    await expect(page.locator('input[type="date"]')).toHaveCount(2);
    await expect(page.locator('input[type="time"]')).toHaveCount(2);
  });

  test('generate button is disabled without complete data', async ({ page }) => {
    await page.goto('/en/matching/report');
    const btn = page.locator('button', { hasText: 'Generate Detailed Report' });
    await expect(btn).toBeDisabled();
  });

  test('back link navigates to matching page', async ({ page }) => {
    await page.goto('/en/matching/report');
    const backLink = page.locator('a', { hasText: 'Back to Matching' });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/en\/matching$/);
  });

  test('Hindi locale loads correctly', async ({ page }) => {
    await page.goto('/hi/matching/report');
    await expect(page.locator('h1')).toContainText('विस्तृत अनुकूलता रिपोर्ट');
  });
});
