/**
 * Page-model equivalence test — the safety-critical assertion for
 * the Phase 1 migration. Proves that for the choghadiya page, the
 * model returned by `getChoghadiyaPageModel` is byte-identical
 * across all four cache states:
 *
 *   State A: PRECOMPUTE_FETCH_ENABLED=false (kill switch)
 *   State B: PRECOMPUTE_FETCH_ENABLED=true,  Blob absent (cold)
 *   State C: PRECOMPUTE_FETCH_ENABLED=true,  Blob valid (hot)
 *   State D: PRECOMPUTE_FETCH_ENABLED=true,  Blob schema-invalid
 *
 * If A === B === C === D, then flipping the env flag in production
 * cannot change what users see — only the cost shape. That's the
 * contract: precompute is a cache, never a content source.
 *
 * Test is structural — runs the same handler with the same inputs,
 * just toggles state. No fake timers needed because the underlying
 * compute is deterministic per (date, city).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { __setStorageForTests, InMemoryStorage } from '@/lib/precompute/storage';
import { setPrecomputed } from '@/lib/precompute/writer';
import { choghadiyaKey } from '@/lib/precompute/keys';
import { ChoghadiyaPageModel } from '@/lib/precompute/schema/choghadiya';
import { getChoghadiyaPageModel } from '@/lib/precompute/choghadiya-page-model';
import { CITIES } from '@/lib/constants/cities';

// Deterministic test fixture: a real city, a real date well outside any
// edge cases (no DST flip near this date in IST).
const DELHI = CITIES.find((c) => c.slug === 'delhi')!;
const DATE = '2026-06-07';

// What we compare: the parts of the model that affect rendered output.
// We intentionally exclude `_computedAt` (a non-deterministic timestamp
// of when the model was made — different between the precompute write
// and the live fallback compute, but never user-visible).
function comparable(model: Awaited<ReturnType<typeof getChoghadiyaPageModel>>) {
  return {
    _v: model._v,
    date: model.date,
    city: model.city,
    weekday: model.weekday,
    daySlots: model.daySlots,
    nightSlots: model.nightSlots,
  };
}

describe('Phase 1 equivalence — getChoghadiyaPageModel across all 4 cache states', () => {
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
    // State A: kill switch off
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
    const a = await getChoghadiyaPageModel({ date: DATE, city: DELHI });

    // State B: kill switch on, no Blob
    process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
    const b = await getChoghadiyaPageModel({ date: DATE, city: DELHI });

    expect(comparable(a)).toEqual(comparable(b));
  });

  it('State A === State C (live compute vs precomputed Blob)', async () => {
    // State A: live compute (kill switch off)
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
    const a = await getChoghadiyaPageModel({ date: DATE, city: DELHI });

    // State C: kill switch on, valid Blob populated by the same fallback
    // — simulate the GH-Action precompute output by writing the model
    // we just computed straight back through the writer.
    process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
    await setPrecomputed({
      key: choghadiyaKey(DATE, DELHI.slug),
      schema: ChoghadiyaPageModel,
      data: a,
    });
    const c = await getChoghadiyaPageModel({ date: DATE, city: DELHI });

    expect(comparable(a)).toEqual(comparable(c));
  });

  it('State A === State D (live compute vs schema-invalid Blob → fallback)', async () => {
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
    const a = await getChoghadiyaPageModel({ date: DATE, city: DELHI });

    // State D: kill switch on, but Blob is corrupted (missing required
    // field). Reader must fall back to live compute — the user must NOT
    // see a degraded page.
    process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
    await storage.put(
      choghadiyaKey(DATE, DELHI.slug),
      JSON.stringify({ _v: 1, totally: 'wrong-shape' }),
    );
    const d = await getChoghadiyaPageModel({ date: DATE, city: DELHI });

    expect(comparable(a)).toEqual(comparable(d));
  });

  it('cross-city: independent (date, city) pairs are independent', async () => {
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
    const delhi = await getChoghadiyaPageModel({ date: DATE, city: DELHI });
    const mumbai = await getChoghadiyaPageModel({
      date: DATE,
      city: CITIES.find((c) => c.slug === 'mumbai')!,
    });

    // Same weekday (UTC) but different sunrise/sunset → different slot
    // boundaries. If they happen to match it would indicate broken
    // city resolution.
    expect(delhi.weekday).toBe(mumbai.weekday);
    expect(delhi.daySlots[0]?.startTime).not.toBe(mumbai.daySlots[0]?.startTime);
  });

  it('precomputed Blob from yesterday still resolves to current model', async () => {
    // The page-model contract: as long as the date param is unchanged,
    // the canonical compute output is deterministic — a Blob written
    // yesterday for date=2026-06-07 must still match a fresh compute
    // for date=2026-06-07. This is what makes "past dates never need
    // re-precomputing" a safe invariant.
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
    const fresh = await getChoghadiyaPageModel({ date: DATE, city: DELHI });

    process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
    await setPrecomputed({
      key: choghadiyaKey(DATE, DELHI.slug),
      schema: ChoghadiyaPageModel,
      data: {
        ...fresh,
        _computedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1d ago
      },
    });
    const oneDayOld = await getChoghadiyaPageModel({ date: DATE, city: DELHI });

    expect(comparable(fresh)).toEqual(comparable(oneDayOld));
  });
});
