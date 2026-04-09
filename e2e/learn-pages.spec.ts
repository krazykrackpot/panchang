import { test, expect } from '@playwright/test';

test.describe('Learn Pages', () => {

  test('birth chart learn page loads with content', async ({ page }) => {
    await page.goto('/en/learn/birth-chart');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Should have substantial content
    const bodyText = await page.locator('main').innerText();
    expect(bodyText.length).toBeGreaterThan(500);
  });

  test('tippanni learn page loads with content', async ({ page }) => {
    await page.goto('/en/learn/tippanni');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    const bodyText = await page.locator('main').innerText();
    expect(bodyText.length).toBeGreaterThan(500);
  });

  test('transits learn page loads with content', async ({ page }) => {
    await page.goto('/en/learn/transits');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    const bodyText = await page.locator('main').innerText();
    expect(bodyText.length).toBeGreaterThan(300);
  });

  test('patrika learn page loads with content', async ({ page }) => {
    await page.goto('/en/learn/patrika');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    const bodyText = await page.locator('main').innerText();
    expect(bodyText.length).toBeGreaterThan(200);
  });

  test('existing learn pages still load', async ({ page }) => {
    const learnPages = [
      '/en/learn/ashtakavarga',
      '/en/learn/shadbala',
      '/en/learn/yogas',
      '/en/learn/dashas',
      '/en/learn/vargas',
    ];

    for (const url of learnPages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1, h2').first()).toBeVisible();
    }
  });
});

test.describe('Regional Calendar Pages', () => {
  test('Tamil calendar page loads', async ({ page }) => {
    await page.goto('/en/calendar/regional/tamil');
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('main').innerText();
    expect(bodyText).toContain('Tamil');
    expect(bodyText.length).toBeGreaterThan(500);
  });

  test('Bengali calendar page loads', async ({ page }) => {
    await page.goto('/en/calendar/regional/bengali');
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('main').innerText();
    expect(bodyText).toContain('Bengali');
    expect(bodyText.length).toBeGreaterThan(500);
  });
});

test.describe('New Puja Pages', () => {
  const pujas = ['pongal', 'baisakhi', 'ugadi', 'bihu'];

  for (const slug of pujas) {
    test(`${slug} puja page loads`, async ({ page }) => {
      await page.goto(`/en/puja/${slug}`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1, h2').first()).toBeVisible();
      const bodyText = await page.locator('main').innerText();
      expect(bodyText.length).toBeGreaterThan(300);
    });
  }
});
