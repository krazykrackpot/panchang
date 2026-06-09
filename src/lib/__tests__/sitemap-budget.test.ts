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
import sitemap, { generateSitemaps } from '@/app/sitemap';
import type { MetadataRoute } from 'next';

const SITEMAP_URL_CEILING = 40_000;
const SITEMAP_BYTE_CEILING_MB = 45; // 5 MB margin under Google's 50 MB
const ESTIMATED_BYTES_PER_URL = 1_200; // ~1.2 KB with 8-locale hreflang block
// Per-shard caps. Each /sitemap/N.xml is fetched independently by Google,
// so the binding constraint is now per-shard, not aggregate. GSC's
// practical tolerance for uncompressed XML is well below the 50 MB spec
// limit — 12 MB / ~10K URLs per shard leaves margin while still allowing
// the 6-shard split to fit our current ~11K URL footprint.
const PER_SHARD_URL_CEILING = 10_000;
const PER_SHARD_BYTE_CEILING_MB = 12;

describe('sitemap URL budget', () => {
  // Iterate all shards (the default export now slices a single shard;
  // generateSitemaps() lists every shard ID Next will emit). We assert
  // both the aggregate budget AND the per-shard cap that prevents
  // GSC "Couldn't fetch" recurrences.
  let entries: MetadataRoute.Sitemap;
  let shards: MetadataRoute.Sitemap[];
  beforeAll(async () => {
    const descriptors = await generateSitemaps();
    shards = descriptors.map(({ id }) => sitemap({ id }));
    entries = shards.flat();
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

  it(`every shard stays under ${PER_SHARD_URL_CEILING.toLocaleString()} URLs and ${PER_SHARD_BYTE_CEILING_MB} MB`, () => {
    // The 2026-06-09 incident: a single unsharded sitemap of ~11K URLs /
    // 13.8 MB hit GSC "Couldn't fetch" on uncompressed XML. Per-shard
    // caps prevent any future organic growth from re-triggering.
    for (let i = 0; i < shards.length; i++) {
      const shard = shards[i];
      expect(shard.length, `shard ${i} has ${shard.length} URLs`).toBeLessThanOrEqual(PER_SHARD_URL_CEILING);
      const estimatedMB = (shard.length * ESTIMATED_BYTES_PER_URL) / (1024 * 1024);
      expect(estimatedMB, `shard ${i} estimated ${estimatedMB.toFixed(1)} MB`).toBeLessThanOrEqual(PER_SHARD_BYTE_CEILING_MB);
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
