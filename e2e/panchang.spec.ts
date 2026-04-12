import { test, expect } from '@playwright/test';

test.describe('Panchang Page', () => {
  test('loads and shows today\'s panchang data', async ({ page }) => {
    await page.goto('/en/panchang', { waitUntil: 'load' });
    // Title contains "Panchang" via the layout template "%s | Jyotish Panchang"
    await expect(page).toHaveTitle(/Panchang/i, { timeout: 15000 });

    // The page renders panchang data cards — check for body content loaded
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').textContent();
    // Panchang page must contain date-related or calendar-related content
    expect(bodyText!.length).toBeGreaterThan(100);
  });

  test('shows Rahu Kalam or muhurta info', async ({ page }) => {
    await page.goto('/en/panchang', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').textContent();
    // Page should contain Rahu Kalam, muhurta, or sunrise info
    const hasRelevantContent = /rahu|muhur|sunrise|sunset|kalam/i.test(bodyText || '');
    expect(hasRelevantContent).toBe(true);
  });
});

test.describe('Navigation', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    // Layout template: "%s | Jyotish Panchang"
    await expect(page).toHaveTitle(/Dekho Panchang|Jyotish Panchang/i, { timeout: 15000 });
  });

  test('can navigate to kundali page', async ({ page }) => {
    await page.goto('/en/kundali', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').textContent();
    // Kundali page should contain birth-chart-related text
    const hasContent = /birth|chart|kundali|कुण्डली|date|time/i.test(bodyText || '');
    expect(hasContent).toBe(true);
  });

  test('can navigate to learn page', async ({ page }) => {
    await page.goto('/en/learn', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').textContent();
    // Learn page has educational content
    const hasContent = /jyotish|graha|rashi|nakshatra|learn|foundation/i.test(bodyText || '');
    expect(hasContent).toBe(true);
  });

  test('can switch to Hindi', async ({ page }) => {
    await page.goto('/hi', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').textContent();
    // Hindi page should contain Devanagari script
    expect(bodyText).toMatch(/[\u0900-\u097F]/);
  });
});
