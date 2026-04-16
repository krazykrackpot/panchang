/**
 * i18n integrity — guards against the stale-messages-source-of-truth bug.
 *
 * Context: in Apr 2026 the dashboard rendered `pages.dashboard.title`,
 * `pages.dashboard.subtitle`, `pages.dashboard.gocharTitle` as literal
 * strings because `layout.tsx` imported a flat `messages/en.json` for the
 * client provider while `request.ts` loaded per-locale dirs for the server.
 * The client file was missing `pages.dashboard` entirely.
 *
 * These tests crawl key pages across several locales and assert that no
 * translation key path leaks through to the rendered body text. If this
 * fails, it means a message loader is out of sync with its translations.
 */

import { test, expect } from '@playwright/test';

// Any of these substrings appearing in rendered body text means a key
// path leaked through next-intl — the translator couldn't resolve it.
const RAW_KEY_PATTERNS = [
  /\bpages\.[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z][a-zA-Z0-9]*\b/, // pages.dashboard.title
  /\bcomponents\.[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z][a-zA-Z0-9]*\b/, // components.navbar.x
  /\blearn\.[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z][a-zA-Z0-9]*\b/, // learn.grahas.x
];

// Pages to check across locales. Add to this list when new public pages ship.
const PAGE_PATHS = [
  '/',
  '/panchang',
  '/kundali',
  '/dashboard',
  '/calendar',
  '/transits',
  '/learn',
];

const LOCALES = ['en', 'hi', 'ta'] as const;

for (const locale of LOCALES) {
  test.describe(`i18n — no raw keys leak in ${locale}`, () => {
    for (const path of PAGE_PATHS) {
      test(`${locale}${path} has no raw translation keys`, async ({ page }) => {
        await page.goto(`/${locale}${path}`, { waitUntil: 'load' });
        await page.waitForLoadState('networkidle');

        const bodyText = (await page.locator('body').textContent()) || '';

        for (const pattern of RAW_KEY_PATTERNS) {
          const match = bodyText.match(pattern);
          if (match) {
            // Show the matched key and 40 chars of surrounding context for
            // easy debugging — way more useful than "expected false to be true".
            const idx = bodyText.indexOf(match[0]);
            const context = bodyText.slice(Math.max(0, idx - 40), idx + match[0].length + 40);
            throw new Error(
              `Raw translation key leaked in ${locale}${path}: "${match[0]}"\n` +
              `Context: …${context}…`,
            );
          }
        }
      });
    }
  });
}
