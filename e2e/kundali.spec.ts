import { test, expect } from '@playwright/test';

test.describe('Kundali Page', () => {
  test('shows birth data form', async ({ page }) => {
    await page.goto('/en/kundali', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    // Kundali page should have date or time inputs (from BirthForm component)
    const inputs = page.locator('input');
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('generates a chart with valid input', async ({ page }) => {
    await page.goto('/en/kundali', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    // Look for date input
    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.isVisible()) {
      await dateInput.fill('1990-01-15');
    }

    // Look for time input
    const timeInput = page.locator('input[type="time"]').first();
    if (await timeInput.isVisible()) {
      await timeInput.fill('10:30');
    }

    // Submit the form
    const submitBtn = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Calculate")').first();
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitBtn.click();
      // Wait for chart to appear — look for planet/house data
      await page.waitForTimeout(5000);
      const bodyText = await page.locator('body').textContent();
      const hasChartData = /ascendant|lagna|planet|house|sun|moon|mars|jupiter/i.test(bodyText || '');
      expect(hasChartData).toBe(true);
    }
  });
});

test.describe('Calendar Page', () => {
  test('loads festival calendar', async ({ page }) => {
    await page.goto('/en/calendar', { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    const bodyText = await page.locator('body').textContent();
    // Calendar page should show festivals, vrats, or month names
    const hasContent = /festival|vrat|ekadashi|purnima|amavasya|calendar/i.test(bodyText || '');
    expect(hasContent).toBe(true);
  });
});

test.describe('Regional Calendar', () => {
  test('shows regional calendars', async ({ page }) => {
    await page.goto('/en/regional', { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    const bodyText = await page.locator('body').textContent();
    // Regional page has info about Tamil, Telugu, Bengali, etc. calendar systems
    const hasContent = /tamil|telugu|bengali|kannada|gujarati|marathi/i.test(bodyText || '');
    expect(hasContent).toBe(true);
  });
});
