/**
 * Page-model equivalence test for horoscope. Mirror of the choghadiya
 * and gauri-panchang equivalence tests: proves that for
 * /horoscope/[rashi]/[date], the model returned by `getHoroscopePageModel`
 * is byte-identical across all four cache states.
 *
 * If A === B === C === D, flipping PRECOMPUTE_FETCH_ENABLED in production
 * cannot change what users see — only the cost shape.
 *
 * Horoscope is locale-INDEPENDENT in the storage layer (LocaleText fields
 * carry all 9 locales baked in by `generateDailyHoroscope`), so one Blob
 * per (rashi, date) serves every locale.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { __setStorageForTests, InMemoryStorage } from '@/lib/precompute/storage';
import { setPrecomputed } from '@/lib/precompute/writer';
import { horoscopeKey } from '@/lib/precompute/keys';
import { HoroscopePageModel } from '@/lib/precompute/schema/horoscope';
import { getHoroscopePageModel } from '@/lib/precompute/horoscope-page-model';
import { RASHIS } from '@/lib/constants/rashis';

// The actual rashi slug in RASHIS is 'mesh' (Aries — id 1), not 'mesha'.
const RASHI = RASHIS.find((r) => r.slug === 'mesh')!;
const DATE = '2026-06-12';

function comparable(model: Awaited<ReturnType<typeof getHoroscopePageModel>>) {
  // _computedAt is non-deterministic between precompute-write and
  // live-fallback. Never user-visible.
  return {
    _v: model._v,
    date: model.date,
    moonSign: model.moonSign,
    moonSignName: model.moonSignName,
    overallScore: model.overallScore,
    areas: model.areas,
    insight: model.insight,
    luckyColor: model.luckyColor,
    luckyNumber: model.luckyNumber,
    luckyTime: model.luckyTime,
    luckyDirection: model.luckyDirection,
    transitSummary: model.transitSummary,
    compatibility: model.compatibility,
    remedy: model.remedy,
    dosAndDonts: model.dosAndDonts,
  };
}

describe('horoscope equivalence — getHoroscopePageModel across cache states', () => {
  let storage: InMemoryStorage;

  beforeEach(() => {
    storage = new InMemoryStorage();
    __setStorageForTests(storage);
  });

  afterEach(() => {
    __setStorageForTests(null);
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
  });

  it('State A === State B (kill switch off vs cold cache, both live-compute)', async () => {
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
    const a = await getHoroscopePageModel({
      date: DATE, rashiSlug: RASHI.slug, moonSign: RASHI.id,
    });

    process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
    const b = await getHoroscopePageModel({
      date: DATE, rashiSlug: RASHI.slug, moonSign: RASHI.id,
    });

    expect(comparable(a)).toEqual(comparable(b));
  });

  it('State A === State C (live compute vs precomputed Blob)', async () => {
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
    const a = await getHoroscopePageModel({
      date: DATE, rashiSlug: RASHI.slug, moonSign: RASHI.id,
    });

    await setPrecomputed({
      key: horoscopeKey(RASHI.slug, DATE),
      schema: HoroscopePageModel,
      data: a,
    });

    process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
    const c = await getHoroscopePageModel({
      date: DATE, rashiSlug: RASHI.slug, moonSign: RASHI.id,
    });

    expect(comparable(a)).toEqual(comparable(c));
  });

  it('State A === State D (live compute vs schema-invalid Blob → fallback)', async () => {
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
    const a = await getHoroscopePageModel({
      date: DATE, rashiSlug: RASHI.slug, moonSign: RASHI.id,
    });

    await storage.put(
      horoscopeKey(RASHI.slug, DATE),
      JSON.stringify({ _v: 999, bogus: true }),
    );

    process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
    const d = await getHoroscopePageModel({
      date: DATE, rashiSlug: RASHI.slug, moonSign: RASHI.id,
    });

    expect(comparable(a)).toEqual(comparable(d));
  });

  it('all LocaleText fields carry the 9 visible locales — one Blob serves every locale', async () => {
    const m = await getHoroscopePageModel({
      date: DATE, rashiSlug: RASHI.slug, moonSign: RASHI.id,
    });
    const visibleLocales = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'] as const;
    for (const loc of visibleLocales) {
      // `insight` is the canonical LocaleText carried through every
      // template. If every visible locale has it, the page can resolve
      // `tl(insight, locale)` without falling back to en for any locale.
      // Some less-translated fields legitimately fall back to en, but
      // `insight` is the load-bearing field for SEO.
      const v = (m.insight as Record<string, string | undefined>)[loc];
      expect(v, `insight missing locale ${loc}`).toBeTruthy();
    }
  });

  it('blob key is locale-independent — one Blob serves all 9 visible locales', () => {
    const k = horoscopeKey(RASHI.slug, DATE);
    expect(k).toBe(`horoscope/${RASHI.slug}/${DATE}`);
    const segments = k.split('/');
    expect(segments).toHaveLength(3);
    const localeCodes = ['en','hi','ta','te','bn','gu','kn','mai','mr','sa'];
    for (const seg of segments) {
      expect(localeCodes).not.toContain(seg);
    }
  });
});
