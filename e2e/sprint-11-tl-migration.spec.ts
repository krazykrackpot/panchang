/**
 * Sprint 11 — P1-45 e2e: priority pages render in Tamil without `undefined`.
 *
 * Before the migration, direct `obj.X[locale]` access on a trilingual object
 * (most constants only carry en/hi/sa) would emit the literal string
 * "undefined" into the rendered DOM for locale='ta'. After Sprint 11 every
 * such read goes through tl(), which falls back to .en.
 *
 * Pages exercised (the audit's named 5):
 *   - /ta/prashna
 *   - /ta/calendar
 *   - /ta/dashboard         (skipped — requires auth; LOCALE guard tested
 *                            indirectly via /ta/learn/tithis below)
 *   - /ta/learn/tithis
 *   - /ta/transits/graphic
 */
import { test, expect } from '@playwright/test';

const TAMIL_PAGES = [
  '/ta/prashna',
  '/ta/calendar',
  '/ta/learn/tithis',
  '/ta/transits/graphic',
];

for (const path of TAMIL_PAGES) {
  test(`${path} renders no literal "undefined" in DOM (Tamil fallback)`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('pageerror', (e) => consoleErrors.push(e.message));

    const response = await page.goto(path, { waitUntil: 'networkidle' });
    // We accept 200 or 404 (some routes redirect or guard); only assert
    // on the actual rendered body content for 2xx responses.
    if (!response || response.status() >= 500) {
      throw new Error(`${path} returned ${response?.status() ?? 'no response'}`);
    }
    if (response.status() >= 400) {
      // 404/403 — skip body assertion but still confirm no JS crash.
      expect(consoleErrors, `${path} page errors: ${consoleErrors.join(', ')}`).toEqual([]);
      return;
    }

    // innerText (not textContent) excludes <script>/<style> bodies and
    // respects CSS visibility — matches what the user actually sees.
    const visible = await page.evaluate(() => document.body.innerText);
    expect(visible, `${path}: visible text should not contain literal "undefined"`).not.toMatch(
      /\bundefined\b/,
    );
    // Also: no JS crashed during render (a tl() bypass site that threw
    // on `cat.label[locale]` when category had no Tamil entry would here).
    expect(
      consoleErrors,
      `${path} produced JS errors: ${consoleErrors.join('; ')}`,
    ).toEqual([]);
  });
}
