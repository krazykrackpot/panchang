/**
 * Equivalence test for /muhurta/[type]/[year]/[month]/[city] precompute.
 *
 *   A: live compute via page-model fallback (Blob disabled)
 *   B: writer serialises the same shape → schema validates
 *   C: reader returns Blob payload byte-identical to A (modulo _computedAt)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { __setStorageForTests, InMemoryStorage } from '@/lib/precompute/storage';
import { getMuhurtaMonthPageModel } from '@/lib/precompute/muhurta-month-page-model';
import { MuhurtaMonthPageModel } from '@/lib/precompute/schema/muhurta-month';
import { setPrecomputed } from '@/lib/precompute/writer';
import { muhurtaMonthKey } from '@/lib/precompute/keys';
import { CITIES } from '@/lib/constants/cities';
import { ACTIVITY_SLUGS } from '@/app/[locale]/muhurta/[type]/[year]/[month]/[city]/shared';

const TEST_YEAR = 2026;
const TEST_MONTH = 11;
const ACTIVITY_SLUG = 'marriage';
const ACTIVITY_ID = ACTIVITY_SLUGS[ACTIVITY_SLUG];
const DELHI = CITIES.find((c) => c.slug === 'delhi')!;

describe('muhurta-month precompute equivalence', () => {
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
    const live = await getMuhurtaMonthPageModel({
      activitySlug: ACTIVITY_SLUG,
      activityId: ACTIVITY_ID,
      year: TEST_YEAR,
      month: TEST_MONTH,
      city: DELHI,
    });
    const parsed = MuhurtaMonthPageModel.safeParse(live);
    expect(parsed.success).toBe(true);
    expect(live.activity).toBe(ACTIVITY_SLUG);
    expect(live.year).toBe(TEST_YEAR);
    expect(live.month).toBe(TEST_MONTH);
    expect(live.city).toBe(DELHI.slug);
    expect(Array.isArray(live.windows)).toBe(true);
  });

  it('round-trip: writer output → reader returns byte-equivalent payload', async () => {
    const live = await getMuhurtaMonthPageModel({
      activitySlug: ACTIVITY_SLUG,
      activityId: ACTIVITY_ID,
      year: TEST_YEAR,
      month: TEST_MONTH,
      city: DELHI,
    });
    const result = await setPrecomputed({
      key: muhurtaMonthKey(ACTIVITY_SLUG, TEST_YEAR, TEST_MONTH, DELHI.slug),
      schema: MuhurtaMonthPageModel,
      data: live,
    });
    expect(result.status).toBe('written');

    const fromBlob = await getMuhurtaMonthPageModel({
      activitySlug: ACTIVITY_SLUG,
      activityId: ACTIVITY_ID,
      year: TEST_YEAR,
      month: TEST_MONTH,
      city: DELHI,
    });
    const { _computedAt: _a, ...liveSansTs } = live;
    const { _computedAt: _b, ...blobSansTs } = fromBlob;
    expect(blobSansTs).toEqual(liveSansTs);
  });
});
