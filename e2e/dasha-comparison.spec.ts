import { test, expect } from '@playwright/test';

test.describe('Dasha Comparison Timeline', () => {
  test('compare page loads and shows input forms', async ({ page }) => {
    await page.goto('/en/kundali/compare');
    // Should show the title
    await expect(page.getByRole('heading', { name: /chart comparison/i })).toBeVisible();
    // Should show two chart input sections
    await expect(page.getByText('Chart A')).toBeVisible();
    await expect(page.getByText('Chart B')).toBeVisible();
  });

  test('compare page has back link to kundali', async ({ page }) => {
    await page.goto('/en/kundali/compare');
    const backLink = page.getByRole('link', { name: /back to kundali/i });
    await expect(backLink).toBeVisible();
  });
});
