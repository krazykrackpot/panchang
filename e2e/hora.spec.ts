import { test, expect } from '@playwright/test';

test.describe('Hora (Planetary Hours) page', () => {
  test('loads and displays title', async ({ page }) => {
    await page.goto('/en/hora');
    await expect(page.locator('h1')).toContainText('Hora');
  });

  test('shows location prompt when no location set', async ({ page }) => {
    // Clear location storage before navigating
    await page.addInitScript(() => {
      localStorage.removeItem('panchang_location');
    });
    await page.goto('/en/hora');
    await expect(page.getByText('Set your location')).toBeVisible();
  });

  test('shows timeline when location is set', async ({ page }) => {
    // Pre-set location (Zurich)
    await page.addInitScript(() => {
      localStorage.setItem('panchang_location', JSON.stringify({
        lat: 47.3769,
        lng: 8.5417,
        name: 'Zurich, Switzerland',
        timezone: 'Europe/Zurich',
      }));
    });
    await page.goto('/en/hora');
    await expect(page.getByText('Day Horas')).toBeVisible();
    await expect(page.getByText('Night Horas')).toBeVisible();
  });
});
