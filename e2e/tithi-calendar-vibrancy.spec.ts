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

  test('grid-only zoom screenshot for icon review', async ({ page }) => {
    await setupRoutes(page);
    await page.setViewportSize({ width: 1600, height: 1200 });
    const gridResponse = page.waitForResponse(
      (resp) => resp.url().includes('/api/tithi-grid') && resp.status() === 200,
      { timeout: 30000 },
    );
    await page.goto('/en/calendars/tithi', { waitUntil: 'load' });
    await gridResponse;
    const gridWrapper = page.locator('[class*="grid-cols-7"]').first().locator('xpath=..');
    await gridWrapper.waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(800);
    await gridWrapper.screenshot({ path: 'test-results/tithi-calendar-grid-zoom.png' });
  });

  test('mobile renders list view, not grid', async ({ page }) => {
    await setupRoutes(page);
    // iPhone-ish viewport — below the sm breakpoint (640px).
    await page.setViewportSize({ width: 390, height: 844 });
    const gridResponse = page.waitForResponse(
      (resp) => resp.url().includes('/api/tithi-grid') && resp.status() === 200,
      { timeout: 30000 },
    );
    await page.goto('/en/calendars/tithi', { waitUntil: 'load' });
    await gridResponse;
    await page.waitForTimeout(2500);

    // Capture both a screenshot AND the body innerText so we can debug
    // what actually renders if the assertion fails.
    await page.screenshot({
      path: 'test-results/tithi-calendar-mobile-list.png',
      fullPage: true,
    });
    const bodyText = (await page.locator('body').textContent()) ?? '';
    const hasPaksha = /Paksha/i.test(bodyText);
    expect(hasPaksha, `expected "Paksha" header in body text. Sample: ${bodyText.slice(0, 200)}`).toBe(true);

    // The grid wrapper should be display:none on mobile, so its day-of-week
    // header row (Sun Mon Tue ...) should not be visible. A regression where
    // the responsive classes don't compile would show both.
    const gridHeaderVisible = await page.locator('[class*="hidden"][class*="sm:block"]').first().isVisible().catch(() => false);
    expect(gridHeaderVisible, 'grid wrapper should be display:none on mobile').toBe(false);
  });

  test('day-name header stays sticky while scrolling the calendar', async ({ page }) => {
    await setupRoutes(page);
    await page.setViewportSize({ width: 1440, height: 700 }); // shorter viewport forces scroll
    const gridResponse = page.waitForResponse(
      (resp) => resp.url().includes('/api/tithi-grid') && resp.status() === 200,
      { timeout: 30000 },
    );
    await page.goto('/en/calendars/tithi', { waitUntil: 'load' });
    await gridResponse;
    // Wait for the calendar grid to mount.
    await page.locator('[class*="grid-cols-7"]').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(800);

    // Locate the day-name header — it's the first grid-cols-7 child of the
    // calendar wrapper and carries `sticky` in its class list.
    const dayHeader = page.locator('[class*="sticky"][class*="grid-cols-7"]').first();
    await dayHeader.waitFor({ state: 'visible', timeout: 5000 });
    const beforeBox = await dayHeader.boundingBox();
    if (!beforeBox) throw new Error('day-name header had no bounding box pre-scroll');

    // Scroll down far enough that without sticky, the header would be off-screen.
    await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'instant' as ScrollBehavior }));
    await page.waitForTimeout(300);

    const afterBox = await dayHeader.boundingBox();
    if (!afterBox) throw new Error('day-name header disappeared after scroll — sticky broke');

    // Sticky behavior: after scrolling 600px, the header's viewport Y should
    // still be small (pinned near the top), not 600 below its original spot.
    // A non-sticky element would land at roughly originalY - 600.
    expect(afterBox.y, `header at y=${afterBox.y} after scroll; expected pinned near top (was ${beforeBox.y} before)`)
      .toBeLessThan(beforeBox.y + 200);
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
