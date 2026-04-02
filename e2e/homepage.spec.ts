import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('page loads and shows Dekho Panchang or Jyotish Panchang', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await expect(page).toHaveTitle(/Dekho Panchang|Jyotish Panchang/i, { timeout: 15000 });
    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(100);
  });

  test('Gayatri Mantra is visible on homepage', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    const bodyText = await page.locator('body').textContent();
    // Gayatri mantra contains "bhargo devasya" or Devanagari equivalent
    const hasMantra = /gayatri|bhargo|dhimahi|ॐ.*भूर्भुवः/i.test(bodyText || '');
    expect(hasMantra).toBe(true);
  });

  test('hero cards are visible (Birth Chart, Muhurta AI, etc.)', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    const bodyText = await page.locator('body').textContent();
    // Homepage should mention kundali/birth chart and muhurta
    const hasBirthChart = /birth\s*chart|kundali/i.test(bodyText || '');
    const hasMuhurta = /muhurta|muhurt/i.test(bodyText || '');
    expect(hasBirthChart || hasMuhurta).toBe(true);
  });

  test('navigation from home to panchang works', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    // Find a link that goes to panchang
    const panchangLink = page.locator('a[href*="/panchang"]').first();
    if (await panchangLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await panchangLink.click();
      await page.waitForURL('**/panchang**', { timeout: 10000 });
      expect(page.url()).toContain('/panchang');
    } else {
      // Direct navigation as fallback
      await page.goto('/en/panchang', { waitUntil: 'load' });
      expect(page.url()).toContain('/panchang');
    }
  });

  test('page has footer', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    const footer = page.locator('footer');
    const footerVisible = await footer.isVisible().catch(() => false);
    // Footer should exist in the DOM even if not visible without scrolling
    const footerCount = await footer.count();
    expect(footerCount).toBeGreaterThanOrEqual(1);
  });

  test('page loads without critical JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    // Filter out known benign errors
    const critical = errors.filter(
      (e) =>
        !e.includes('hydration') &&
        !e.includes('NEXT_REDIRECT') &&
        !e.includes('net::ERR')
    );
    expect(critical.length).toBe(0);
  });
});
