/**
 * Equivalence test for /panchang/[city] precompute.
 *
 * Same three-state model as panchang-date / gauri-panchang / horoscope:
 *
 *   A: live compute via the page-model fallback (Blob disabled)
 *   B: writer serialises the same shape → schema validates
 *   C: reader returns Blob payload byte-identical to A (modulo _computedAt)
 *
 * Locale-independent (one Blob per (date, city) serves every locale via
 * tl() at render time). City catalogue spans IST + diaspora.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { __setStorageForTests, InMemoryStorage } from '@/lib/precompute/storage';
import { getPanchangCityPageModel } from '@/lib/precompute/panchang-city-page-model';
import { PanchangCityPageModel } from '@/lib/precompute/schema/panchang-city';
import { setPrecomputed } from '@/lib/precompute/writer';
import { panchangCityKey } from '@/lib/precompute/keys';
import { CITIES } from '@/lib/constants/cities';

const TEST_DATE = '2026-11-08';
const DELHI = CITIES.find((c) => c.slug === 'delhi')!;

describe('panchang-city precompute equivalence', () => {
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
    const live = await getPanchangCityPageModel({ date: TEST_DATE, city: DELHI });
    const parsed = PanchangCityPageModel.safeParse(live);
    expect(parsed.success).toBe(true);
    expect(live.date).toBe(TEST_DATE);
    expect(live.city).toBe(DELHI.slug);
    // Inner panchang is opaque-typed but a few well-known fields
    // are reliable enough to assert against.
    expect(typeof live.panchang.sunrise).toBe('string');
    expect(typeof live.panchang.sunset).toBe('string');
    expect(live.panchang.tithi).toBeTruthy();
  });

  it('round-trip: writer output → reader returns byte-equivalent payload', async () => {
    const live = await getPanchangCityPageModel({ date: TEST_DATE, city: DELHI });
    const result = await setPrecomputed({
      key: panchangCityKey(TEST_DATE, DELHI.slug),
      schema: PanchangCityPageModel,
      data: live,
    });
    expect(result.status).toBe('written');

    const fromBlob = await getPanchangCityPageModel({ date: TEST_DATE, city: DELHI });
    const { _computedAt: _a, ...liveSansTs } = live;
    const { _computedAt: _b, ...blobSansTs } = fromBlob;
    expect(blobSansTs).toEqual(liveSansTs);
  });
});
