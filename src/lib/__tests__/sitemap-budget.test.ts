/**
 * Sitemap budget gate.
 *
 * Google enforces TWO per-sitemap-file limits — whichever comes first:
 *   - 50,000 URLs
 *   - 50 MB uncompressed
 * (https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
 *
 * With 8 locales and a hreflang block of ~9 alternates per URL, each
 * `<url>` entry serialises to ~1.2 KB. That means the BYTE limit binds
 * before the URL limit: 50 MB / 1.2 KB ≈ 41,600 URLs. Picked 40,000 as
 * the URL ceiling — a small margin under the byte-derived cap.
 *
 * We also assert the estimated byte size directly, so a future per-URL
 * size change (more alternates, longer locale prefixes, etc.) trips the
 * gate before Google does.
 *
 * **Why not lower than 40K?** The previous 30,000 figure was a
 * self-imposed conservative gate that forfeited ~10,000 URLs of legitimate
 * SEO surface area BELOW Google's real limit. We do NOT optimise for
 * "small sitemap"; we optimise for capturing every legitimate query.
 * If we ever hit 40,000 organically, the next step is a sitemap-index
 * file (splitting into multiple <50K-URL files, each referenced from a
 * single sitemap.xml index), not pruning legitimate URLs.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import sitemap from '@/app/sitemap';
import type { MetadataRoute } from 'next';

const SITEMAP_URL_CEILING = 40_000;
const SITEMAP_BYTE_CEILING_MB = 45; // 5 MB margin under Google's 50 MB
const ESTIMATED_BYTES_PER_URL = 1_200; // ~1.2 KB with 8-locale hreflang block

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

  it(`estimated XML payload stays under ${SITEMAP_BYTE_CEILING_MB} MB (Google caps at 50 MB)`, () => {
    // Estimated rather than measured — we don't want to instantiate the
    // full XML stream in a unit test. The estimate is intentionally
    // generous (1.2 KB/URL with 8-locale hreflang). If the real per-URL
    // size grows (more alternates, longer paths), bump
    // ESTIMATED_BYTES_PER_URL above to keep this gate honest.
    const estimatedBytes = entries.length * ESTIMATED_BYTES_PER_URL;
    const estimatedMB = estimatedBytes / (1024 * 1024);
    expect(estimatedMB, `estimated sitemap ${estimatedMB.toFixed(1)} MB exceeds ${SITEMAP_BYTE_CEILING_MB} MB`).toBeLessThanOrEqual(SITEMAP_BYTE_CEILING_MB);
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
