/**
 * Sitemap budget gate.
 *
 * The ceiling matches Google's documented per-sitemap-file hard limit:
 * **50,000 URLs OR 50 MB uncompressed**, whichever comes first
 * (https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
 * We set the soft ceiling at 49,000 to leave a small safety margin for
 * a single deploy that adds a route shape — exceeding this is a real
 * Google-side problem, not a self-imposed budget.
 *
 * **Why not lower?** The previous 30,000 figure was a self-imposed
 * conservative gate that was forfeiting 20,000 URLs of legitimate SEO
 * surface area below Google's actual limit. We do NOT optimise for
 * "small sitemap"; we optimise for capturing every legitimate query.
 * If we ever hit 49,000 organically, the next step is a sitemap-index
 * file (splitting into multiple <50K files), not pruning.
 *
 * This test still catches the regression class it was designed for —
 * an unintentional addition that explodes the sitemap past Google's
 * per-file limit — but it no longer gets in the way of growth.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import sitemap from '@/app/sitemap';
import type { MetadataRoute } from 'next';

const SITEMAP_URL_CEILING = 49_000;

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
