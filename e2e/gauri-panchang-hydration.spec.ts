/**
 * Regression: /gauri-panchang/[date] is an ISR-cached route. Mounting the
 * interactive client (which reads `new Date()` at render) inside that cache
 * produces React error #418 hydration mismatches when the cached HTML and
 * the visitor's local "today" disagree. That kills the React tree post-
 * hydration → analytics events never fire → ~80% pageview collapse on
 * 2026-05-28 (sibling Choghadiya route, fixed in PR #267).
 *
 * The /gauri-panchang index (no [date]) is force-dynamic and is allowed
 * to keep mounting the client — included here as a smoke check.
 */
import { test, expect } from '@playwright/test';

const HYDRATION_RE = /#418|hydrat/i;

async function expectNoHydrationErrors(page: import('@playwright/test').Page, url: string) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  // React hydration crashes ("kill the tree") surface as uncaught runtime
  // exceptions on `pageerror`, not as console.error — catch both so a
  // future regression can't slip past by raising instead of logging.
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  const hits = errors.filter((e) => HYDRATION_RE.test(e));
  expect(hits, hits.join('\n')).toHaveLength(0);
}

test.describe('Gauri Panchang [date] hydration', () => {
  test('en/gauri-panchang/<future-date> hydrates without React #418', async ({ page }) => {
    await expectNoHydrationErrors(page, '/en/gauri-panchang/2026-06-15');
  });

  test('hi/gauri-panchang/<future-date> hydrates without React #418', async ({ page }) => {
    await expectNoHydrationErrors(page, '/hi/gauri-panchang/2026-06-15');
  });

  test('mai/gauri-panchang/<future-date> hydrates without React #418', async ({ page }) => {
    await expectNoHydrationErrors(page, '/mai/gauri-panchang/2026-06-15');
  });

  test('en/gauri-panchang (no date — dynamic route) still works', async ({ page }) => {
    await expectNoHydrationErrors(page, '/en/gauri-panchang');
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
});
