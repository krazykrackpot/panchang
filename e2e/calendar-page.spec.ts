import { test, expect } from '@playwright/test';

test.describe('Calendar Page', () => {
  test('calendar page loads', async ({ page }) => {
    await page.goto('/en/calendar', { waitUntil: 'load' });
    await expect(page).toHaveTitle(/Calendar|Jyotish Panchang/i, { timeout: 15000 });
  });

  test('festivals are listed', async ({ page }) => {
    await page.goto('/en/calendar', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').textContent();
    // Calendar page should contain festival, vrat, or month-related text
    const hasContent = /festival|vrat|ekadashi|purnima|amavasya|diwali|holi|navratri/i.test(bodyText || '');
    expect(hasContent).toBe(true);
  });

  test('filter buttons are present', async ({ page }) => {
    await page.goto('/en/calendar', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Look for filter/category buttons
    const buttons = page.locator('button');
    const count = await buttons.count();
    // There should be some interactive buttons (filters, month navigation, etc.)
    expect(count).toBeGreaterThan(0);

    // Check for filter-related text
    const bodyText = await page.locator('body').textContent();
    const hasFilters = /all|major|ekadashi|purnima|filter|category/i.test(bodyText || '');
    expect(hasFilters).toBe(true);
  });

  test('calendar shows month navigation', async ({ page }) => {
    await page.goto('/en/calendar', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').textContent();
    // Should contain month names or year
    const hasMonthInfo = /january|february|march|april|may|june|july|august|september|october|november|december|2025|2026/i.test(bodyText || '');
    expect(hasMonthInfo).toBe(true);
  });
});
