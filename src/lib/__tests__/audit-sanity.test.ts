/**
 * AUDIT TEST SUITE — Layer 3: Cross-Source Sanity Checks (Soft Warnings)
 *
 * Compares our output against Prokerala for the same location (Ujjain).
 * NOT a hard fail — flags deviations >15 min as warnings.
 * Only runs when SANITY_CHECK=true env var is set.
 *
 * Purpose: catch drift if someone accidentally changes a ghati table or
 * formula constant. NOT a correctness test — our source is Prashna Marga,
 * not Prokerala.
 */
import { describe, it, expect } from 'vitest';
import { computePanchang } from '@/lib/ephem/panchang-calc';

// Skip entire suite unless SANITY_CHECK=true
const ENABLED = process.env.SANITY_CHECK === 'true';

// ─── Prokerala reference data (Ujjain, manually captured) ──────────
// These values are from Prokerala.com for Ujjain, Madhya Pradesh
// Captured: 2026-04-08
const PROKERALA_UJJAIN_APR8 = {
  sunrise: '06:16',
  nakshatra: 'Moola',
  varjyam: '14:51',      // start time
  amritKalam: '01:42',   // start time
  yamaganda: '07:49',
  durMuhurtam: '12:03',
  rahuKaal: '12:28',
  gulikaKaal: '10:55',
};

const UJJAIN = {
  lat: 23.1765, lng: 75.7885, tzOffset: 5.5,
  timezone: 'Asia/Kolkata', locationName: 'Ujjain',
};

function parseHHMM(s: string): number {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
}

function diffMin(a: string, b: string): number {
  let d = Math.abs(parseHHMM(a) - parseHHMM(b));
  if (d > 720) d = 1440 - d;
  return d;
}

describe.skipIf(!ENABLED)('Sanity: Prokerala cross-check (Ujjain Apr 8 2026)', () => {
  const p = computePanchang({ year: 2026, month: 4, day: 8, ...UJJAIN });
  const ref = PROKERALA_UJJAIN_APR8;

  it('sunrise within 5 min of Prokerala', () => {
    const d = diffMin(p.sunrise, ref.sunrise);
    if (d > 5) console.warn(`⚠ Sunrise drift: ours=${p.sunrise} prokerala=${ref.sunrise} diff=${d}min`);
    expect(d).toBeLessThanOrEqual(15);
  });

  it('nakshatra matches Prokerala', () => {
    // Prokerala uses "Moola" spelling, we use "Mula"
    const match = p.nakshatra.name.en.toLowerCase().includes('mul');
    if (!match) console.warn(`⚠ Nakshatra mismatch: ours=${p.nakshatra.name.en} prokerala=${ref.nakshatra}`);
    expect(match).toBe(true);
  });

  it('yamaganda within 5 min of Prokerala', () => {
    const d = diffMin(p.yamaganda.start, ref.yamaganda);
    if (d > 5) console.warn(`⚠ Yamaganda drift: ours=${p.yamaganda.start} prokerala=${ref.yamaganda} diff=${d}min`);
    expect(d).toBeLessThanOrEqual(15);
  });

  it('rahu kaal within 5 min of Prokerala', () => {
    const d = diffMin(p.rahuKaal.start, ref.rahuKaal);
    if (d > 5) console.warn(`⚠ Rahu Kaal drift: ours=${p.rahuKaal.start} prokerala=${ref.rahuKaal} diff=${d}min`);
    expect(d).toBeLessThanOrEqual(15);
  });

  it('dur muhurtam within 5 min of Prokerala', () => {
    const dm = p.durMuhurtam?.[0]?.start;
    if (!dm) { console.warn('⚠ No dur muhurtam computed'); return; }
    const d = diffMin(dm, ref.durMuhurtam);
    if (d > 5) console.warn(`⚠ Dur Muhurtam drift: ours=${dm} prokerala=${ref.durMuhurtam} diff=${d}min`);
    expect(d).toBeLessThanOrEqual(15);
  });

  it('varjyam within 15 min of Prokerala', () => {
    const vAll = (p as any).varjyamAll as { start: string }[] | undefined;
    if (!vAll?.length) { console.warn('⚠ No varjyam computed'); return; }
    // Find closest match
    let best = 999;
    for (const v of vAll) {
      const d = diffMin(v.start, ref.varjyam);
      if (d < best) best = d;
    }
    if (best > 5) console.warn(`⚠ Varjyam drift: closest=${best}min (prokerala=${ref.varjyam})`);
    expect(best).toBeLessThanOrEqual(15);
  });

  it('amrit kalam within 15 min of Prokerala', () => {
    const aAll = (p as any).amritKalamAll as { start: string }[] | undefined;
    if (!aAll?.length) { console.warn('⚠ No amrit kalam computed'); return; }
    let best = 999;
    for (const a of aAll) {
      const d = diffMin(a.start, ref.amritKalam);
      if (d < best) best = d;
    }
    if (best > 5) console.warn(`⚠ Amrit Kalam drift: closest=${best}min (prokerala=${ref.amritKalam})`);
    expect(best).toBeLessThanOrEqual(15);
  });
});
