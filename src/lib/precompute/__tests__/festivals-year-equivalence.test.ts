/**
 * Equivalence test for /festivals/[slug]/[year]/[city] precompute.
 *
 *   A: live compute via page-model fallback (Blob disabled)
 *   B: writer serialises the same shape → schema validates
 *   C: reader returns Blob payload byte-identical to A (modulo _computedAt)
 *
 * One Blob per (year, city) reused across every festival slug.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { __setStorageForTests, InMemoryStorage } from '@/lib/precompute/storage';
import { getFestivalsYearPageModel } from '@/lib/precompute/festivals-year-page-model';
import { FestivalsYearPageModel } from '@/lib/precompute/schema/festivals-year';
import { setPrecomputed } from '@/lib/precompute/writer';
import { festivalsYearKey } from '@/lib/precompute/keys';
import { CITIES } from '@/lib/constants/cities';

const TEST_YEAR = 2026;
const DELHI = CITIES.find((c) => c.slug === 'delhi')!;

describe('festivals-year precompute equivalence', () => {
  let storage: InMemoryStorage;

  beforeEach(() => {
    storage = new InMemoryStorage();
    __setStorageForTests(storage);
    process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
  });

  afterEach(() => {
    __setStorageForTests(null);
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
  });

  it('live compute (fallback) returns a schema-valid model', async () => {
    const live = await getFestivalsYearPageModel({ year: TEST_YEAR, city: DELHI });
    const parsed = FestivalsYearPageModel.safeParse(live);
    expect(parsed.success).toBe(true);
    expect(live.year).toBe(TEST_YEAR);
    expect(live.city).toBe(DELHI.slug);
    expect(live.festivals.length).toBeGreaterThan(0);
  });

  it('round-trip: writer output → reader returns byte-equivalent payload', async () => {
    const live = await getFestivalsYearPageModel({ year: TEST_YEAR, city: DELHI });
    const result = await setPrecomputed({
      key: festivalsYearKey(TEST_YEAR, DELHI.slug),
      schema: FestivalsYearPageModel,
      data: live,
    });
    expect(result.status).toBe('written');

    const fromBlob = await getFestivalsYearPageModel({ year: TEST_YEAR, city: DELHI });
    const { _computedAt: _a, ...liveSansTs } = live;
    const { _computedAt: _b, ...blobSansTs } = fromBlob;
    expect(blobSansTs).toEqual(liveSansTs);
  });
});
