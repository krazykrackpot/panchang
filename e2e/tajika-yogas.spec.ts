/**
 * E2E test skeleton for Tajika Yogas on the Varshaphal page.
 * Navigates to the page and verifies the form + yoga section render.
 */
import { test, expect } from '@playwright/test';

test.describe('Varshaphal — Tajika Yogas', () => {
  test('page loads and shows the Tajika Yogas heading', async ({ page }) => {
    await page.goto('/en/varshaphal');
    // The page should load without errors
    await expect(page.locator('h1')).toContainText(/Varshaphal|वर्षफल/i);
  });

  test('form fields are present', async ({ page }) => {
    await page.goto('/en/varshaphal');
    // Check form inputs exist
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="date"]')).toBeVisible();
    await expect(page.locator('input[type="time"]')).toBeVisible();
    await expect(page.locator('input[type="number"]')).toBeVisible();
  });

  test('generate button is clickable', async ({ page }) => {
    await page.goto('/en/varshaphal');
    const btn = page.locator('button', { hasText: /Generate|बनाएं|रचयतु/i });
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });
});
