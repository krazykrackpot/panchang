/**
 * Sitemap budget gate.
 *
 * The sitemap pruning of 2026-04-16 cut us from ~9,390 URLs to ~1,064.
 * Subsequent additions (8-locale expansion, choghadiya 30-day forward
 * window, more festival years) have grown the sitemap again. Per audit
 * N-1 (2026-05-23), the live sitemap is now ~19,443 URLs vs the
 * documented target of 1,064. That's not necessarily wrong — the
 * additions are intentional — but it must not silently 5x again.
 *
 * This test asserts an explicit ceiling. Bumping the ceiling is a
 * deliberate act of the day; an unintentional explosion will fail
 * the test in CI before it ships.
 *
 * If you intentionally need more URLs, raise SITEMAP_URL_CEILING here
 * and explain why in the commit message.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import sitemap from '@/app/sitemap';
import type { MetadataRoute } from 'next';

const SITEMAP_URL_CEILING = 30_000;

describe('sitemap URL budget', () => {
  // Generate once and share — sitemap() walks every route × locale and
  // produces ~20k entries; calling it per test would dominate the suite.
  let entries: MetadataRoute.Sitemap;
  beforeAll(() => {
    entries = sitemap();
  });

  it(`emits no more than ${SITEMAP_URL_CEILING.toLocaleString()} URLs`, () => {
    expect(entries.length).toBeLessThanOrEqual(SITEMAP_URL_CEILING);
  });

  it('every entry has a non-empty URL', () => {
    for (const e of entries) {
      expect(e.url, `entry missing url: ${JSON.stringify(e)}`).toBeTruthy();
      expect(e.url.startsWith('http'), `non-http URL: ${e.url}`).toBe(true);
    }
  });

  it('every entry has alternates.languages with x-default + EN', () => {
    // Check ALL entries — the bug an addEntries regression would introduce
    // would likely affect a single route category that may not appear in
    // the first N entries. Generation is the expensive part; iteration is
    // O(n) and fast.
    for (const e of entries) {
      expect(e.alternates?.languages, `no alternates: ${e.url}`).toBeDefined();
      const langs = e.alternates!.languages as Record<string, string>;
      expect(Object.keys(langs).length, `too few alternates: ${e.url}`).toBeGreaterThanOrEqual(2);
      expect(langs['x-default'], `no x-default: ${e.url}`).toBeTruthy();
    }
  });
});
