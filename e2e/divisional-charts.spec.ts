import { test, expect } from '@playwright/test';

test.describe('Divisional Charts (Varga Tab)', () => {
  // Navigate to kundali page with pre-filled params to skip form filling
  const KUNDALI_URL = '/en/kundali?n=Test&d=2000-01-15&t=10:30&p=Zurich&lat=47.3769&lng=8.5417&tz=Europe/Zurich&ay=lahiri';

  test('varga tab shows division selector pills', async ({ page }) => {
    await page.goto(KUNDALI_URL);
    // Wait for kundali to generate (form auto-submits with URL params)
    await page.waitForSelector('[data-tab="varga"]', { timeout: 30000 });
    await page.click('[data-tab="varga"]');
    // Division pills should be visible
    await expect(page.getByRole('button', { name: /D9/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /D10/i })).toBeVisible();
  });

  test('clicking a division pill shows chart and interpretation', async ({ page }) => {
    await page.goto(KUNDALI_URL);
    await page.waitForSelector('[data-tab="varga"]', { timeout: 30000 });
    await page.click('[data-tab="varga"]');
    // Click D10 pill
    await page.getByRole('button', { name: /D10/i }).first().click();
    // Header should show Dasamsha
    await expect(page.getByText(/Dasamsha|दशांश/)).toBeVisible();
    // Planet placements section should appear
    await expect(page.getByText(/Planet Placements|ग्रह स्थितियां/)).toBeVisible();
  });

  test('D9 is selected by default', async ({ page }) => {
    await page.goto(KUNDALI_URL);
    await page.waitForSelector('[data-tab="varga"]', { timeout: 30000 });
    await page.click('[data-tab="varga"]');
    // D9 header should be visible
    await expect(page.getByText(/Navamsha|नवांश/)).toBeVisible();
  });
});
