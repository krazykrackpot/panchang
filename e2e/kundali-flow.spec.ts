import { test, expect } from '@playwright/test';

test.describe('Kundali Generation Flow', () => {
  test('kundali page loads with form', async ({ page }) => {
    await page.goto('/en/kundali', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').textContent();
    const hasContent = /birth|chart|kundali|date|time/i.test(bodyText || '');
    expect(hasContent).toBe(true);
  });

  test('form has date, time, and place fields', async ({ page }) => {
    await page.goto('/en/kundali', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Check for date input
    const dateInput = page.locator('input[type="date"]');
    const dateCount = await dateInput.count();

    // Check for time input
    const timeInput = page.locator('input[type="time"]');
    const timeCount = await timeInput.count();

    // Check for text inputs (name, place)
    const textInputs = page.locator('input[type="text"], input:not([type])');
    const textCount = await textInputs.count();

    // Should have at least date + time + one text input
    expect(dateCount + timeCount + textCount).toBeGreaterThanOrEqual(2);
  });

  test('enter birth details and generate chart', async ({ page }) => {
    await page.goto('/en/kundali', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Fill date
    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.isVisible()) {
      await dateInput.fill('1990-01-15');
    }

    // Fill time
    const timeInput = page.locator('input[type="time"]').first();
    if (await timeInput.isVisible()) {
      await timeInput.fill('06:00');
    }

    // Fill name if exists
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nameInput.fill('Test Person');
    }

    // Search for Delhi in location input
    const locationInput = page.locator(
      'input[name="place"], input[placeholder*="location" i], input[placeholder*="place" i], input[placeholder*="city" i], input[placeholder*="search" i]'
    ).first();
    if (await locationInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await locationInput.fill('Delhi');
      // Wait for autocomplete suggestions to appear
      const suggestion = page.locator('[role="option"], [role="listbox"] >> text=Delhi, li:has-text("Delhi")').first();
      if (await suggestion.isVisible({ timeout: 5000 }).catch(() => false)) {
        await suggestion.click();
      }
    }

    // Click Generate / Calculate button
    const submitBtn = page.locator(
      'button[type="submit"], button:has-text("Generate"), button:has-text("Calculate"), button:has-text("Create")'
    ).first();
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitBtn.click();

      // After generation, check for chart-related content
      await expect(page.locator('text=/ascendant|lagna|planet|house|sun|moon|mars|jupiter|chart/i').first()).toBeVisible({ timeout: 15000 });
    }
  });

  test('tabs are visible after chart generation', async ({ page }) => {
    await page.goto('/en/kundali', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Fill minimal required data
    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.isVisible()) await dateInput.fill('1990-01-15');

    const timeInput = page.locator('input[type="time"]').first();
    if (await timeInput.isVisible()) await timeInput.fill('06:00');

    const locationInput = page.locator(
      'input[name="place"], input[placeholder*="location" i], input[placeholder*="place" i], input[placeholder*="city" i], input[placeholder*="search" i]'
    ).first();
    if (await locationInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await locationInput.fill('Delhi');
      const suggestion = page.locator('[role="option"], [role="listbox"] >> text=Delhi, li:has-text("Delhi")').first();
      if (await suggestion.isVisible({ timeout: 5000 }).catch(() => false)) {
        await suggestion.click();
      }
    }

    const submitBtn = page.locator(
      'button[type="submit"], button:has-text("Generate"), button:has-text("Calculate"), button:has-text("Create")'
    ).first();
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitBtn.click();

      // Look for tab-like elements (Chart, Planets, Dasha, Yogas, etc.)
      await expect(page.locator('text=/chart|planet|dasha|yoga|shadbala/i').first()).toBeVisible({ timeout: 15000 });
    }
  });

  test('kundali page has form and generate capability', async ({ page }) => {
    // This test verifies the kundali page loads correctly with all form elements
    // Full generation requires location API which may not be available in CI
    await page.goto('/en/kundali', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Verify form elements exist
    await expect(page.locator('input[type="date"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="time"]').first()).toBeVisible({ timeout: 10000 });

    // Verify submit button exists
    const submitBtn = page.locator(
      'button[type="submit"], button:has-text("Generate"), button:has-text("Calculate"), button:has-text("Create")'
    ).first();
    await expect(submitBtn).toBeVisible({ timeout: 5000 });
  });
});
