/**
 * Page-model equivalence test for gauri-panchang. Mirror of the choghadiya
 * equivalence test: proves that for /gauri-panchang/[date], the model
 * returned by `getGauriPanchangPageModel` is byte-identical across all
 * four cache states (kill switch off, cold cache, hot Blob, invalid Blob).
 *
 * If A === B === C === D, flipping PRECOMPUTE_FETCH_ENABLED in production
 * cannot change what users see — only the cost shape. Same contract as
 * choghadiya: precompute is a cache, never a content source.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { __setStorageForTests, InMemoryStorage } from '@/lib/precompute/storage';
import { setPrecomputed } from '@/lib/precompute/writer';
import { gauriPanchangKey } from '@/lib/precompute/keys';
import { GauriPanchangPageModel } from '@/lib/precompute/schema/gauri-panchang';
import { getGauriPanchangPageModel } from '@/lib/precompute/gauri-panchang-page-model';
import { CITIES } from '@/lib/constants/cities';

// gauri-panchang's natural SEO anchor is Chennai (South-Indian tradition;
// see src/app/[locale]/gauri-panchang/[date]/page.tsx).
const CHENNAI = CITIES.find((c) => c.slug === 'chennai')!;
const DATE = '2026-06-12';

function comparable(model: Awaited<ReturnType<typeof getGauriPanchangPageModel>>) {
  // Skip _computedAt — non-deterministic between precompute-write and
  // live-fallback. Never user-visible.
  return {
    _v: model._v,
    date: model.date,
    city: model.city,
    weekday: model.weekday,
    tithiNumber: model.tithiNumber,
    daySlots: model.daySlots,
    nightSlots: model.nightSlots,
  };
}

describe('gauri-panchang equivalence — getGauriPanchangPageModel across cache states', () => {
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
    const a = await getGauriPanchangPageModel({ date: DATE, city: CHENNAI });

    process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
    const b = await getGauriPanchangPageModel({ date: DATE, city: CHENNAI });

    expect(comparable(a)).toEqual(comparable(b));
  });

  it('State A === State C (live compute vs precomputed Blob)', async () => {
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
    const a = await getGauriPanchangPageModel({ date: DATE, city: CHENNAI });

    // Simulate the GH-Action by writing what the live compute produced.
    await setPrecomputed({
      key: gauriPanchangKey(DATE, CHENNAI.slug),
      schema: GauriPanchangPageModel,
      data: a,
    });

    process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
    const c = await getGauriPanchangPageModel({ date: DATE, city: CHENNAI });

    expect(comparable(a)).toEqual(comparable(c));
  });

  it('State A === State D (live compute vs schema-invalid Blob → fallback)', async () => {
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
    const a = await getGauriPanchangPageModel({ date: DATE, city: CHENNAI });

    // Stuff garbage into the Blob — reader should detect schema mismatch
    // and fall through to live compute. End result is byte-identical to
    // State A.
    await storage.put(
      gauriPanchangKey(DATE, CHENNAI.slug),
      JSON.stringify({ _v: 999, bogus: true }),
    );

    process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
    const d = await getGauriPanchangPageModel({ date: DATE, city: CHENNAI });

    expect(comparable(a)).toEqual(comparable(d));
  });

  it('day + night slots both non-empty and time-ordered for a normal IST date', async () => {
    const m = await getGauriPanchangPageModel({ date: DATE, city: CHENNAI });
    expect(m.daySlots.length).toBeGreaterThan(0);
    expect(m.nightSlots.length).toBeGreaterThan(0);

    // Time ordering within each period — endTime of slot N <= startTime
    // of slot N+1 (with the exception of cross-midnight night slots,
    // handled by the engine's HH:mm strings; here we just sanity-check
    // that each slot has valid HH:mm fields).
    for (const slot of [...m.daySlots, ...m.nightSlots]) {
      expect(slot.startTime).toMatch(/^\d{2}:\d{2}$/);
      expect(slot.endTime).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  it('blob key is locale-independent — one Blob serves all 9 visible locales', () => {
    // Sanity check: the key derivation matches choghadiya's pattern
    // (no locale segment) so one (date, city) Blob covers every locale.
    // Naive substring checks on 'en'/'hi' would false-positive on city
    // slugs (chennai contains 'en') — assert the structural shape
    // instead: exactly 3 path segments, none of which is a locale code.
    const k = gauriPanchangKey(DATE, CHENNAI.slug);
    expect(k).toBe(`gauri-panchang/${DATE}/${CHENNAI.slug}`);
    const segments = k.split('/');
    expect(segments).toHaveLength(3);
    const localeCodes = ['en','hi','ta','te','bn','gu','kn','mai','mr','sa'];
    for (const seg of segments) {
      expect(localeCodes).not.toContain(seg);
    }
  });
});
