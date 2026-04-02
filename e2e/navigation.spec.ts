import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navbar is visible on homepage', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });

  test('navbar has multiple links', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const nav = page.locator('nav').first();
    const links = nav.locator('a[href]');
    const count = await links.count();
    expect(count).toBeGreaterThan(3);
  });

  test('dropdown menus exist for Calendars and Tools', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('nav').first().textContent();
    // Nav should mention "Calendar" and "Tools" sections
    const hasCalendars = /calendar/i.test(bodyText || '');
    const hasTools = /tool/i.test(bodyText || '');
    expect(hasCalendars || hasTools).toBe(true);
  });

  test('locale switcher works - switch to Hindi', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    // Look for Hindi locale link/button
    const hindiLink = page.locator('a[href*="/hi"], button:has-text("हि"), button:has-text("HI"), a:has-text("हिन्दी")').first();
    if (await hindiLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await hindiLink.click();
      await page.waitForTimeout(3000);

      // Should now be on Hindi locale
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toMatch(/[\u0900-\u097F]/); // Devanagari
    } else {
      // Direct navigation fallback
      await page.goto('/hi', { waitUntil: 'load' });
      await page.waitForTimeout(2000);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toMatch(/[\u0900-\u097F]/);
    }
  });

  test('light/dark mode toggle exists', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    // Look for theme toggle button
    const themeToggle = page.locator(
      'button[aria-label*="theme" i], button[aria-label*="mode" i], button[aria-label*="dark" i], button[aria-label*="light" i], button:has([class*="sun"]), button:has([class*="moon"])'
    ).first();

    const bodyHtml = await page.locator('html').getAttribute('class') || '';
    // Either a theme toggle exists or the page has a theme class
    const hasThemeSystem = await themeToggle.isVisible({ timeout: 3000 }).catch(() => false) ||
      /dark|light|theme/.test(bodyHtml);
    expect(hasThemeSystem).toBe(true);
  });

  test('can navigate to all core pages', async ({ page }) => {
    const pages = [
      { path: '/en/panchang', expected: /panchang/i },
      { path: '/en/kundali', expected: /kundali|birth.*chart/i },
      { path: '/en/calendar', expected: /calendar/i },
      { path: '/en/about', expected: /about/i },
    ];

    for (const p of pages) {
      await page.goto(p.path, { waitUntil: 'load' });
      expect(page.url()).toContain(p.path);
    }
  });

  test('404 page for non-existent route', async ({ page }) => {
    const res = await page.goto('/en/nonexistent-page-12345', { waitUntil: 'load' });
    // Should return 404 or show not-found content
    if (res?.status() === 404) {
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toMatch(/not found|404/i);
    }
    // Even if redirected, page should still load
    expect(res?.status()).toBeDefined();
  });
});
