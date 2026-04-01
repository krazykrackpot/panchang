import { test, expect } from '@playwright/test';

test.describe('Panchang Page', () => {
  test('loads and shows today\'s panchang data', async ({ page }) => {
    await page.goto('/en/panchang');
    await expect(page).toHaveTitle(/Panchang|पंचांग/);

    // Should show tithi, nakshatra, yoga, karana
    await expect(page.locator('text=/Tithi|तिथि/')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=/Nakshatra|नक्षत्र/')).toBeVisible();
  });

  test('shows Rahu Kalam and other muhurtas', async ({ page }) => {
    await page.goto('/en/panchang');
    await expect(page.locator('text=/Rahu Kalam|राहु काल/')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Navigation', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/Jyotish|ज्योतिष/);
  });

  test('can navigate to kundali page', async ({ page }) => {
    await page.goto('/en/kundali');
    await expect(page.locator('text=/Kundali|कुण्डली|Birth Chart/')).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to learn page', async ({ page }) => {
    await page.goto('/en/learn');
    await expect(page.locator('text=/Learn|सीखें/')).toBeVisible({ timeout: 10000 });
  });

  test('can switch to Hindi', async ({ page }) => {
    await page.goto('/hi');
    await expect(page.locator('text=/ज्योतिष/')).toBeVisible({ timeout: 10000 });
  });
});
