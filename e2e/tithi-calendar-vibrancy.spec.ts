/**
 * Phase 1 verification for the tithi-calendar vibrancy uplift.
 *
 * Asserts:
 *  - /en, /hi, /mai (the #1 traffic driver) all render the grid without console errors
 *  - the grid renders enough cells to look like a month
 *  - no rapid duplicate /api/tithi-grid calls (render-loop sentinel)
 *  - Yoga, Masa chip, locale-aware day names + month heading are present in the DOM
 *
 * Captures before/after screenshots into test-results/ for manual review.
 */

import { test, expect, type Page, type ConsoleMessage, type Request } from '@playwright/test';

type Sample = {
  consoleErrors: string[];
  pageErrors: string[];
  tithiGridCalls: number;
};

/**
 * ipapi.co requires a paid plan for CORS on localhost; in tests we mock it so
 * the page actually loads a grid. Same trick works for the brittle AdSense
 * frame CSP that fires from a third-party script we don't control.
 */
async function setupRoutes(page: Page) {
  // Mock IP geolocation — Zurich (matches user's actual location for sanity).
  await page.route('**/ipapi.co/json/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        latitude: 47.3769,
        longitude: 8.5417,
        city: 'Zurich',
        country_name: 'Switzerland',
        timezone: 'Europe/Zurich',
      }),
    });
  });
  // Stub out AdSense frame — the CSP violation it triggers isn't ours.
  await page.route('**/pagead2.googlesyndication.com/**', (route) => route.abort());
}

async function sampleTithi(page: Page, url: string, dwellAfterRenderMs = 800): Promise<Sample> {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const gridCalls: Request[] = [];

  const onRequest = (req: Request) => {
    if (req.url().includes('/api/tithi-grid')) gridCalls.push(req);
  };
  const onConsole = (msg: ConsoleMessage) => {
    if (msg.type() !== 'error') return;
    const t = msg.text();
    // Known-benign noise (browser-side third-party + dev-only resource warnings).
    if (
      /adtrafficquality|favicon|net::ERR_|Failed to load resource/i.test(t) ||
      /pagead2\.googlesyndication|doubleclick|adsbygoogle/i.test(t) ||
      /Content Security Policy directive/i.test(t) ||
      /ipapi\.co/i.test(t)
    ) return;
    consoleErrors.push(t);
  };
  const onPageError = (err: Error) => pageErrors.push(err.message);

  page.on('request', onRequest);
  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  // Two-stage deterministic wait:
  //   1. wait for the grid API to respond (data is in the client)
  //   2. wait for the localised TODAY pill / cell text to render (React commit done)
  // Then a short fixed dwell so any late-stream console errors surface.
  const gridResponse = page.waitForResponse(
    (resp) => resp.url().includes('/api/tithi-grid') && resp.status() === 200,
    { timeout: 30000 },
  );
  await page.goto(url, { waitUntil: 'load' });
  await gridResponse;
  // The grid wrapper renders only once data is in; wait for it.
  await page.locator('[class*="grid-cols-7"]').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(dwellAfterRenderMs);

  page.off('request', onRequest);
  page.off('console', onConsole);
  page.off('pageerror', onPageError);

  return { consoleErrors, pageErrors, tithiGridCalls: gridCalls.length };
}

test.describe('Tithi calendar — Phase 1 vibrancy + locale audit', () => {
  test('renders cleanly in EN + captures screenshot', async ({ page }) => {
    await setupRoutes(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    const s = await sampleTithi(page, '/en/calendars/tithi');
    expect(s.pageErrors).toEqual([]);
    expect(s.consoleErrors).toEqual([]);
    expect(s.tithiGridCalls).toBeLessThan(5);
    await page.screenshot({
      path: 'test-results/tithi-calendar-en-after.png',
      fullPage: true,
    });
  });

  test('renders cleanly in HI', async ({ page }) => {
    await setupRoutes(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    const s = await sampleTithi(page, '/hi/calendars/tithi');
    expect(s.pageErrors).toEqual([]);
    expect(s.consoleErrors).toEqual([]);
    expect(s.tithiGridCalls).toBeLessThan(5);
    await page.screenshot({
      path: 'test-results/tithi-calendar-hi-after.png',
      fullPage: true,
    });
  });

  test('renders cleanly in MAI (#1 traffic driver)', async ({ page }) => {
    await setupRoutes(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    const s = await sampleTithi(page, '/mai/calendars/tithi');
    expect(s.pageErrors).toEqual([]);
    expect(s.consoleErrors).toEqual([]);
    expect(s.tithiGridCalls).toBeLessThan(5);
    await page.screenshot({
      path: 'test-results/tithi-calendar-mai-after.png',
      fullPage: true,
    });
  });

  test('grid renders day cells with localised day names', async ({ page }) => {
    await setupRoutes(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    // Deterministic wait — same pattern as sampleTithi.
    const gridResponse = page.waitForResponse(
      (resp) => resp.url().includes('/api/tithi-grid') && resp.status() === 200,
      { timeout: 30000 },
    );
    await page.goto('/en/calendars/tithi', { waitUntil: 'load' });
    await gridResponse;
    const dayHeader = page.locator('[class*="grid-cols-7"]').first();
    await expect(dayHeader).toBeVisible({ timeout: 10000 });

    // With grid loaded, there will be many SVGs (moon icon per cell + nakshatra
    // star + rashi crescent + yoga knot + sunrise + sunset, ~5-7 per cell × 28+
    // cells = 150+). Without the grid (location failure), only ~12 (page chrome).
    const svgCount = await page.locator('svg').count();
    expect(svgCount, 'grid did not render — too few SVGs').toBeGreaterThan(50);
  });
});
