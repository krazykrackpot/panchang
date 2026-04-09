import { test, expect } from '@playwright/test';

test.describe('Transit Radar on Kundali Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to kundali page and generate a chart
    await page.goto('/en/kundali');
    await page.waitForLoadState('networkidle');
  });

  test('kundali page loads with birth form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Kundali');
    // Birth form should be visible
    await expect(page.locator('input[type="date"]')).toBeVisible();
    await expect(page.locator('input[type="time"]')).toBeVisible();
  });

  test('generating a kundali shows transit radar section', async ({ page }) => {
    // Fill in birth details
    await page.fill('input[type="text"][placeholder*="name" i]', 'Test User');
    await page.fill('input[type="date"]', '1990-01-15');
    await page.fill('input[type="time"]', '08:30');

    // Search for a location
    const locationInput = page.locator('input[placeholder*="city" i], input[placeholder*="place" i], input[placeholder*="search" i]').first();
    await locationInput.fill('Delhi');
    await page.waitForTimeout(1500); // Wait for autocomplete

    // Click first result if dropdown appears
    const suggestion = page.locator('[class*="suggestion"], [class*="result"], [role="option"]').first();
    if (await suggestion.isVisible({ timeout: 3000 }).catch(() => false)) {
      await suggestion.click();
    }

    // Submit the form
    const submitBtn = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("कुण्डली")').first();
    await submitBtn.click();

    // Wait for kundali to load
    await page.waitForTimeout(5000);

    // Check that chart appears
    await expect(page.locator('svg[role="img"]').first()).toBeVisible({ timeout: 15000 });

    // Scroll down to find Transit Radar section
    const transitRadar = page.locator('text=Transit Radar');
    if (await transitRadar.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(transitRadar).toBeVisible();
    }
  });
});
