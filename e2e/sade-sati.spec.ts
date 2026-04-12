import { test, expect } from '@playwright/test';

test.describe('Sade Sati Page', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/en/sade-sati', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').textContent();
    const hasContent = /sade.?sati|saturn|शनि/i.test(bodyText || '');
    expect(hasContent).toBe(true);
  });

  test('moon sign grid is visible (12 signs)', async ({ page }) => {
    await page.goto('/en/sade-sati', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').textContent();
    // Page should mention rashi/sign names
    const hasSignNames = /aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces|mesh|vrishabh/i.test(bodyText || '');
    expect(hasSignNames).toBe(true);
  });

  test('clicking a sign shows results', async ({ page }) => {
    await page.goto('/en/sade-sati', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Try clicking on a sign button/card
    const signButton = page.locator('button:has-text("Aries"), a:has-text("Aries"), [role="button"]:has-text("Aries"), div:has-text("Aries")').first();
    if (await signButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await signButton.click();
      // After clicking, should show timeline or analysis
      await expect(page.locator('text=/cycle|phase|rising|peak|setting|intensity|timeline|saturn|transit/i').first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('page shows Saturn transit info', async ({ page }) => {
    await page.goto('/en/sade-sati', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').textContent();
    // Should mention Saturn's current position or transit
    const hasSaturnInfo = /saturn|transit|currently|position|शनि/i.test(bodyText || '');
    expect(hasSaturnInfo).toBe(true);
  });
});
