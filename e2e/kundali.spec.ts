import { test, expect } from '@playwright/test';

test.describe('Kundali Page', () => {
  test('shows birth data form', async ({ page }) => {
    await page.goto('/en/kundali');
    await expect(page.locator('input[name="name"], input[placeholder*="Name"], input[placeholder*="name"]')).toBeVisible({ timeout: 10000 });
  });

  test('generates a chart with valid input', async ({ page }) => {
    await page.goto('/en/kundali');

    // Fill the form — look for common form elements
    const nameInput = page.locator('input').first();
    await nameInput.fill('Test User');

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
    const submitBtn = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("generate")').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Wait for chart to appear
      await expect(page.locator('text=/Ascendant|लग्न|Planet|ग्रह/')).toBeVisible({ timeout: 30000 });
    }
  });
});

test.describe('Calendar Page', () => {
  test('loads festival calendar', async ({ page }) => {
    await page.goto('/en/calendar');
    await expect(page.locator('text=/Festival|Calendar|उत्सव|पंचांग/')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Regional Calendar', () => {
  test('shows regional calendars', async ({ page }) => {
    await page.goto('/en/regional');
    await expect(page.locator('text=/Tamil|Telugu|Bengali/')).toBeVisible({ timeout: 10000 });
  });
});
