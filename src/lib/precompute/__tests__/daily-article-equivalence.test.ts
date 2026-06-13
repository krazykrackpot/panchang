/**
 * Equivalence test for /daily/[date]/[city] precompute.
 *
 *   A: live compute via page-model fallback (Blob disabled)
 *   B: writer serialises the same shape → schema validates
 *   C: reader returns Blob payload byte-identical to A (modulo _computedAt)
 *
 * Bundles article + 12 horoscopes. One Blob per (date, city) serves
 * every locale.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { __setStorageForTests, InMemoryStorage } from '@/lib/precompute/storage';
import { getDailyArticlePageModel } from '@/lib/precompute/daily-article-page-model';
import { DailyArticlePageModel } from '@/lib/precompute/schema/daily-article';
import { setPrecomputed } from '@/lib/precompute/writer';
import { dailyArticleKey } from '@/lib/precompute/keys';
import { CITIES } from '@/lib/constants/cities';

const TEST_DATE = '2026-11-08';
const DELHI = CITIES.find((c) => c.slug === 'delhi')!;

describe('daily-article precompute equivalence', () => {
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
    const live = await getDailyArticlePageModel({ date: TEST_DATE, city: DELHI });
    const parsed = DailyArticlePageModel.safeParse(live);
    expect(parsed.success).toBe(true);
    expect(live.date).toBe(TEST_DATE);
    expect(live.city).toBe(DELHI.slug);
    expect(live.article.title.en).toBeTruthy();
    expect(live.horoscopes.length).toBe(12);
  });

  it('round-trip: writer output → reader returns byte-equivalent payload', async () => {
    const live = await getDailyArticlePageModel({ date: TEST_DATE, city: DELHI });
    const result = await setPrecomputed({
      key: dailyArticleKey(TEST_DATE, DELHI.slug),
      schema: DailyArticlePageModel,
      data: live,
    });
    expect(result.status).toBe('written');

    const fromBlob = await getDailyArticlePageModel({ date: TEST_DATE, city: DELHI });
    const { _computedAt: _a, ...liveSansTs } = live;
    const { _computedAt: _b, ...blobSansTs } = fromBlob;
    expect(blobSansTs).toEqual(liveSansTs);
  });
});
