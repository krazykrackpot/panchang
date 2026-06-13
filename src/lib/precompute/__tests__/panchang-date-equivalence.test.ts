/**
 * Equivalence test for /panchang/date/[date] precompute.
 *
 * Mirrors the gauri-panchang / horoscope equivalence tests:
 *
 *   State A: live compute via the page-model fallback (Blob disabled)
 *   State B: writer serialises the same shape → schema validates
 *   State C: reader returns Blob payload byte-identical to State A
 *            (modulo the `_computedAt` timestamp which is the only
 *             time-variant field by design)
 *
 * If A === B === C the precompute pipeline is correct end-to-end for
 * this route. A drift in any of the three breaks the equivalence and
 * the test fails — protecting future refactors.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { __setStorageForTests, InMemoryStorage } from '@/lib/precompute/storage';
import { getPanchangDatePageModel } from '@/lib/precompute/panchang-date-page-model';
import { PanchangDatePageModel } from '@/lib/precompute/schema/panchang-date';
import { setPrecomputed } from '@/lib/precompute/writer';
import { panchangDateKey } from '@/lib/precompute/keys';
import { getSeoCityForLocale } from '@/lib/constants/cities';

// Stable known-good date that has a festival hit somewhere in 2026 —
// using Diwali for the Delhi/en surface gives a non-null festivalToday
// path that exercises the optional branch.
const TEST_DATE = '2026-11-08'; // Diwali 2026 in many traditions
const SEO_CITY = getSeoCityForLocale('en'); // delhi

describe('panchang-date precompute equivalence (State A === C)', () => {
  let storage: InMemoryStorage;

  beforeEach(() => {
    storage = new InMemoryStorage();
    __setStorageForTests(storage);
    // Force the kill switch ON so the reader actually consults storage.
    process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
  });

  afterEach(() => {
    __setStorageForTests(null);
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
  });

  it('live compute (fallback) returns a schema-valid model', async () => {
    // State A — Blob storage is empty; reader falls through to live compute.
    const live = await getPanchangDatePageModel({ date: TEST_DATE, city: SEO_CITY });
    const parsed = PanchangDatePageModel.safeParse(live);
    expect(parsed.success).toBe(true);
    expect(live.date).toBe(TEST_DATE);
    expect(live.city).toBe(SEO_CITY.slug);
    expect(live.tithi.name.en).toBeTruthy();
    expect(live.nakshatra.name.en).toBeTruthy();
    expect(live.sunrise).toMatch(/^\d{2}:\d{2}$/);
    expect(live.sunset).toMatch(/^\d{2}:\d{2}$/);
  });

  it('round-trip: writer output → reader returns byte-equivalent payload', async () => {
    // State A — capture the live compute output.
    const live = await getPanchangDatePageModel({ date: TEST_DATE, city: SEO_CITY });

    // State B — writer persists the same shape via the schema.
    const result = await setPrecomputed({
      key: panchangDateKey(TEST_DATE, SEO_CITY.slug),
      schema: PanchangDatePageModel,
      data: live,
    });
    expect(result.status).toBe('written');

    // State C — reader pulls from Blob (in-memory store) and the result
    // matches modulo _computedAt (which the live-compute fallback would
    // re-stamp each call — Blob persists the moment of write).
    const fromBlob = await getPanchangDatePageModel({ date: TEST_DATE, city: SEO_CITY });
    const { _computedAt: _a, ...liveSansTs } = live;
    const { _computedAt: _b, ...blobSansTs } = fromBlob;
    expect(blobSansTs).toEqual(liveSansTs);
  });
});
