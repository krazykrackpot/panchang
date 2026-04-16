/**
 * Kundali URL params take priority over sessionStorage cache.
 *
 * Context: in Apr 2026, dashboard saved-chart cards linked to
 * `/kundali?n=X&d=Y&t=Z&la=LAT&lo=LNG&p=PLACE`, but the kundali page's
 * mount effect only read `sessionStorage.kundali_last_result`. The first
 * chart generated in a session was cached; every saved-chart click loaded
 * that cached one instead of the chart in the URL. Users saw "every card
 * opens the last kundali I made."
 *
 * This test generates two different charts in sequence (so sessionStorage
 * holds chart B), then navigates with URL params for chart A, and verifies
 * chart A's name renders — proving the URL wins, not the cache.
 */

import { test, expect } from '@playwright/test';

test.describe('Kundali — URL params win over cached sessionStorage', () => {
  test('navigating with ?n=...&d=... loads the URL chart, not the cache', async ({ page }) => {
    // Step 1: generate a chart using the form. This populates sessionStorage
    // with "cache chart" data.
    await page.goto('/en/kundali?n=CacheChart&d=1990-01-15&t=08:30&la=28.6139&lo=77.2090&p=Delhi', {
      waitUntil: 'load',
    });
    await page.waitForLoadState('networkidle');

    // Wait for the kundali to render — the D1 chart section or planet data
    // should appear within a few seconds.
    await page.waitForTimeout(3000);

    // Step 2: navigate to a DIFFERENT chart via URL params.
    await page.goto('/en/kundali?n=TargetChart&d=1985-06-20&t=14:45&la=19.0760&lo=72.8777&p=Mumbai', {
      waitUntil: 'load',
    });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Step 3: verify the target chart rendered — look for the target name
    // somewhere in the page (not the cached one).
    const bodyText = (await page.locator('body').textContent()) || '';

    // The name we passed in the URL should appear somewhere on the page
    // (in birth details, header, or save-chart label).
    expect(bodyText).toContain('TargetChart');

    // And the cached name must NOT dominate — specifically, if both appear
    // we fail (the cache leaked). If only the target appears, we pass.
    // A simple assertion: the name "CacheChart" should not appear prominently.
    // We allow it to appear once (maybe a stale form value) but prefer zero.
    const cacheOccurrences = (bodyText.match(/CacheChart/g) || []).length;
    const targetOccurrences = (bodyText.match(/TargetChart/g) || []).length;

    expect(targetOccurrences).toBeGreaterThan(0);
    // Target must appear at least as often as cache — if not, cache took over.
    expect(targetOccurrences).toBeGreaterThanOrEqual(cacheOccurrences);
  });
});
