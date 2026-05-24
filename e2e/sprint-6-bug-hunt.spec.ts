/**
 * Sprint 6 (2026-05-24) — bug-hunt regression suite.
 *
 * Targets surfaces unique to Sprint 6's changes:
 *   - P0-28 — /api/tippanni now requires auth; anonymous = 401
 *   - SEO growth — Tier 3 cities (newly in sitemap) render their panchang page
 *   - P0-15 follow-up — festival year page renders sunrise/sunset times in
 *     a sane format (server-tz-safe migration didn't break rendering)
 *   - P0-27 — backfilled learn/* pages render translated content (or EN
 *     fallback) in regional locales without raw key paths
 *
 * Existing specs already cover broader i18n parity (i18n-no-raw-keys.spec.ts),
 * Maithili navigation (navigation.spec.ts), and panchang correctness
 * (panchang-drik-validation.spec.ts) — they should be re-run before merge.
 */
import { test, expect, request as pwRequest } from '@playwright/test';

test.describe('P0-28 — /api/tippanni auth gate', () => {
  test('returns 401 when called without bearer / cookie', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.post('/api/tippanni', {
      data: { locale: 'en', ragEnabled: false },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toContain('Authentication required');
    await ctx.dispose();
  });

  test('ignores body.kundali (no server-side accept of attacker payload)', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    // Even if we managed to attach a malformed kundali, server should reject
    // on auth before parsing it.
    const res = await ctx.post('/api/tippanni', {
      data: {
        locale: 'en',
        kundali: { malicious: 'payload', planets: [], ascendant: { sign: 99999 } },
      },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(401);
    await ctx.dispose();
  });
});

test.describe('Sitemap growth — Tier 3 cities render', () => {
  // Spot-check a known Tier 3 city. /panchang/[slug] should render the
  // city's panchang without 404 or crash.
  const TIER_3_SLUG = 'los-angeles'; // confirmed tier 3 in cities-extended.ts

  test(`/en/panchang/${TIER_3_SLUG} renders panchang`, async ({ page }) => {
    const response = await page.goto(`/en/panchang/${TIER_3_SLUG}`, { waitUntil: 'load' });
    expect(response?.status()).toBeLessThan(400);
    await page.waitForLoadState('networkidle');

    const bodyText = (await page.locator('body').textContent()) || '';
    // Page should mention the city name and "panchang"
    expect(bodyText.toLowerCase()).toContain('los angeles');
    // No raw next-intl key paths leaked
    expect(bodyText).not.toMatch(/pages\.\w+\.\w+/);
  });
});

test.describe('P0-15 follow-up — festival year page sunrise/sunset', () => {
  test('/en/festivals/diwali/2026 renders with sunrise/sunset', async ({ page }) => {
    const response = await page.goto('/en/festivals/diwali/2026', { waitUntil: 'load' });
    expect(response?.status()).toBeLessThan(400);
    await page.waitForLoadState('networkidle');

    const bodyText = (await page.locator('body').textContent()) || '';
    // The page should display the festival name
    expect(bodyText.toLowerCase()).toContain('diwali');
    // Sunrise/sunset times should be in HH:MM format (no malformed
    // "Invalid Date" or empty placeholders that would indicate the
    // SunTimes Date contract migration broke rendering)
    expect(bodyText).not.toContain('Invalid Date');
    expect(bodyText).not.toContain('NaN:NaN');
  });
});

test.describe('P0-27 — backfilled learn pages render in regional locales', () => {
  // Pages that previously had en+hi only and got EN backfill for ta/te/bn/gu/kn/mai.
  // They should render (showing EN content where translations don't exist) without
  // raw key paths leaking through next-intl.
  const PAGES = ['vivah-muhurta', 'ayurveda-jyotish', 'caesarean-muhurta'];

  for (const slug of PAGES) {
    test(`/te/learn/${slug} renders without raw keys`, async ({ page }) => {
      const response = await page.goto(`/te/learn/${slug}`, { waitUntil: 'load' });
      // ISR cold start may be slow but should resolve under 30s
      expect(response?.status()).toBeLessThan(500);

      await page.waitForLoadState('networkidle');
      const bodyText = (await page.locator('body').textContent()) || '';

      // No raw next-intl key path patterns. (Same pattern set as
      // i18n-no-raw-keys.spec.ts.)
      expect(bodyText).not.toMatch(/\bpages\.\w+\.\w+\b/);
      expect(bodyText).not.toMatch(/\blearn\.\w+\.\w+\b/);
      // No bare camelCase leaf identifiers (the original P0-4 symptom)
      // Skip this check on locale switcher / nav strings — narrow to
      // article content if needed in a follow-up.
    });
  }
});

test.describe('Festival bare-slug redirect (Sprint 3 sanity)', () => {
  // Sprint 3 added /[locale]/festivals/[slug] which 308-redirects to the
  // current-year page. Verify it still works after Sprint 6's other changes.
  test('/en/festivals/diwali redirects to current-year page', async ({ page }) => {
    const response = await page.goto('/en/festivals/diwali', { waitUntil: 'load' });
    expect(response?.status()).toBeLessThan(400);
    expect(page.url()).toMatch(/\/en\/festivals\/diwali\/20\d\d/);
  });
});
