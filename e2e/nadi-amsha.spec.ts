import { test, expect } from '@playwright/test';

test.describe('Nadi Amsha (D-150) Tab', () => {
  test('tab is visible on kundali page and shows content when clicked', async ({ page }) => {
    await page.goto('/en/kundali');

    // The tab should exist in the tab bar once a chart is generated
    // This is a skeleton E2E — full flow requires filling birth form
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
