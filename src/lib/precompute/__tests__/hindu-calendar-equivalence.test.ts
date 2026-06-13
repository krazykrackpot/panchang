/**
 * Equivalence test for /hindu-calendar/[year] precompute.
 *
 *   A: live compute via page-model fallback (Blob disabled)
 *   B: writer serialises the same shape → schema validates
 *   C: reader returns Blob payload byte-identical to A (modulo _computedAt)
 *
 * One Blob per year regardless of locale; festivals[].name etc. are
 * trilingual.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { __setStorageForTests, InMemoryStorage } from '@/lib/precompute/storage';
import { getHinduCalendarPageModel } from '@/lib/precompute/hindu-calendar-page-model';
import { HinduCalendarPageModel } from '@/lib/precompute/schema/hindu-calendar';
import { setPrecomputed } from '@/lib/precompute/writer';
import { hinduCalendarKey } from '@/lib/precompute/keys';

const TEST_YEAR = 2026;

describe('hindu-calendar precompute equivalence', () => {
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
    const live = await getHinduCalendarPageModel({ year: TEST_YEAR });
    const parsed = HinduCalendarPageModel.safeParse(live);
    expect(parsed.success).toBe(true);
    expect(live.year).toBe(TEST_YEAR);
    expect(live.festivals.length).toBeGreaterThan(0);
  });

  it('round-trip: writer output → reader returns byte-equivalent payload', async () => {
    const live = await getHinduCalendarPageModel({ year: TEST_YEAR });
    const result = await setPrecomputed({
      key: hinduCalendarKey(TEST_YEAR),
      schema: HinduCalendarPageModel,
      data: live,
    });
    expect(result.status).toBe('written');

    const fromBlob = await getHinduCalendarPageModel({ year: TEST_YEAR });
    const { _computedAt: _a, ...liveSansTs } = live;
    const { _computedAt: _b, ...blobSansTs } = fromBlob;
    expect(blobSansTs).toEqual(liveSansTs);
  });
});
