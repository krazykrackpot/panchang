import { test, expect } from '@playwright/test';

test.describe('Loading States', () => {
  const routes = [
    '/en/panchang',
    '/en/kundali',
    '/en/matching',
    '/en/calendar',
    '/en/sign-calculator',
    '/en/muhurta-ai',
  ];

  for (const route of routes) {
    test(`${route} shows content (not stuck on loading)`, async ({ page }) => {
      await page.goto(route);
      // Page should load within reasonable time and show actual content, not just a spinner
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 15000 });
    });
  }
});

test.describe('OG Images', () => {
  test('default OG image renders', async ({ page }) => {
    const response = await page.goto('/en/opengraph-image');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('image');
  });

  test('panchang OG image renders', async ({ page }) => {
    const response = await page.goto('/en/panchang/opengraph-image');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('image');
  });

  test('kundali OG image renders', async ({ page }) => {
    const response = await page.goto('/en/kundali/opengraph-image');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('image');
  });
});
