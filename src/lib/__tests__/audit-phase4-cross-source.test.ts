/**
 * Audit 2026-06-05 Phase 4a — HIGH constant consolidations.
 *
 *   - #12 SIGN_LORDS: 14 inline copies replaced with canonical
 *     `SIGN_LORDS` from `@/lib/constants/dignities`.
 *   - #15 compatibility/page.tsx: 8 unguarded `obj[locale]` accesses
 *     wrapped in `tl(...)` so 7 Indic locales (ta/te/bn/kn/gu/mai/mr)
 *     don't crash. Previously only en/hi worked.
 *   - #18 EXALTATION_DEG: derived at module load from canonical
 *     `EXALTATION_SIGNS` × 30 + `EXALTATION_DEGREES` instead of the
 *     hardcoded parallel absolute-longitude table in shadbala.ts.
 *   - #21 ~16 inline `Math.floor(longitude / 30) + 1` rashi sites
 *     replaced with the canonical `getRashiNumber(longitude)` helper.
 *
 * Cross-source verification: Drik Panchang Delhi for 5 dates spanning
 * the Adhika lunation + post-Adhika + Amavasya gap days. All still
 * pass after the consolidation (no semantic drift).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  EXALTATION_SIGNS,
  EXALTATION_DEGREES,
  SIGN_LORDS,
} from '@/lib/constants/dignities';
import { getRashiNumber } from '@/lib/ephem/astronomical';
import { computePanchang } from '@/lib/ephem/panchang-calc';

const DELHI = { lat: 28.6139, lng: 77.2090, tzOffset: 5.5, timezone: 'Asia/Kolkata' };

// ───────────────────────────────────────────────────────────────────────────
// 1 — #18: EXALTATION_DEG derivation matches the prior hardcoded values
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P4.1 (FIX #18): EXALTATION_DEG derived from canonical', () => {
  // Prior hardcoded absolute-longitude table from shadbala.ts:102.
  const OLD: Record<number, number> = {
    0: 10,   // Sun  – Aries 10°
    1: 33,   // Moon – Taurus 3°
    2: 298,  // Mars – Capricorn 28°
    3: 165,  // Mercury – Virgo 15°
    4: 95,   // Jupiter – Cancer 5°
    5: 357,  // Venus – Pisces 27°
    6: 200,  // Saturn – Libra 20°
  };

  it.each([0, 1, 2, 3, 4, 5, 6])('planet %i: derived === prior hardcoded value', (id) => {
    const sign = EXALTATION_SIGNS[id]!;
    const degInSign = EXALTATION_DEGREES[id]!;
    const derived = (sign - 1) * 30 + degInSign;
    expect(derived).toBe(OLD[id]);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 2 — #21: getRashiNumber matches Math.floor(x/30)+1 across the full range
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P4.2 (FIX #21): getRashiNumber ≡ Math.floor(x/30)+1', () => {
  it('agrees on 515 longitudes spanning [0, 360)', () => {
    // Assert inside the loop (Gemini #441) — first divergence surfaces
    // its longitude in the failure message, rather than a bare count.
    for (let lon = 0; lon < 360; lon += 0.7) {
      const inline = Math.floor(lon / 30) + 1;
      const canonical = getRashiNumber(lon);
      expect(canonical, `getRashiNumber(${lon}) ≠ Math.floor(${lon}/30)+1`).toBe(inline);
    }
  });

  it('handles the four sign boundaries correctly', () => {
    expect(getRashiNumber(0)).toBe(1);     // 0°       → Aries
    expect(getRashiNumber(29.9)).toBe(1);  // 29.9°    → still Aries
    expect(getRashiNumber(30)).toBe(2);    // 30°      → Taurus boundary
    expect(getRashiNumber(359.9)).toBe(12); // 359.9°  → Pisces
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 3 — #12: canonical SIGN_LORDS matches BPHS Ch.3 + no inline duplicates left
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P4.3 (FIX #12): SIGN_LORDS canonical + no inline duplicates', () => {
  const BPHS: Record<number, number> = {
    1: 2,  // Aries   → Mars
    2: 5,  // Taurus  → Venus
    3: 3,  // Gemini  → Mercury
    4: 1,  // Cancer  → Moon
    5: 0,  // Leo     → Sun
    6: 3,  // Virgo   → Mercury
    7: 5,  // Libra   → Venus
    8: 2,  // Scorpio → Mars
    9: 4,  // Sagittarius → Jupiter
    10: 6, // Capricorn   → Saturn
    11: 6, // Aquarius    → Saturn
    12: 4, // Pisces      → Jupiter
  };

  it('SIGN_LORDS matches BPHS Ch.3 across all 12 signs', () => {
    // One test with 12 assertions (Gemini #441) — vitest still pinpoints
    // the failing sign via the error message, but the suite output isn't
    // cluttered with 12 it() entries.
    for (let sign = 1; sign <= 12; sign++) {
      expect(SIGN_LORDS[sign], `sign ${sign} (BPHS Ch.3)`).toBe(BPHS[sign]);
    }
  });

  it('no source file outside __tests__ still inlines the 12-row SIGN_LORDS table', () => {
    // Walk the src/ tree looking for the verbatim row pattern. The pattern
    // matches the unanimous {1:2,2:5,3:3,4:1,5:0,6:3,...} that the 14 fixed
    // files all shared.
    const inlinePattern = /\{\s*1\s*:\s*2\s*,\s*2\s*:\s*5\s*,\s*3\s*:\s*3\s*,\s*4\s*:\s*1\s*,\s*5\s*:\s*0\s*,\s*6\s*:\s*3/;

    function walk(dir: string): string[] {
      const out: string[] = [];
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) out.push(...walk(full));
        else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) out.push(full);
      }
      return out;
    }

    const offenders: string[] = [];
    for (const f of walk(join(process.cwd(), 'src'))) {
      if (f.includes('__tests__')) continue;
      const text = readFileSync(f, 'utf8');
      if (inlinePattern.test(text)) offenders.push(f);
    }
    expect(offenders, `inline SIGN_LORDS still present: ${offenders.join(', ')}`).toEqual([]);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 4 — #15: compatibility/page.tsx wraps every locale access in tl(...)
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P4.4 (FIX #15): compatibility/page.tsx locale fallback', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/[locale]/learn/compatibility/page.tsx'),
    'utf8',
  );

  it('no longer has unguarded {pt[locale]} / {d.combo[locale]} / {s.text[locale]} accesses', () => {
    expect(src).not.toMatch(/\{pt\[locale\]\}/);
    expect(src).not.toMatch(/\{d\.combo\[locale\]\}/);
    expect(src).not.toMatch(/\{d\.effect\[locale\]\}/);
    expect(src).not.toMatch(/\{s\.text\[locale\]\}/);
    expect(src).not.toMatch(/\{c\[locale\]\}/);
  });

  it('uses tl(obj, locale) for the wrapped accesses', () => {
    expect(src).toMatch(/\{tl\(pt,\s*locale\)\}/);
    expect(src).toMatch(/\{tl\(d\.combo,\s*locale\)\}/);
    expect(src).toMatch(/\{tl\(d\.effect,\s*locale\)\}/);
    expect(src).toMatch(/\{tl\(s\.text,\s*locale\)\}/);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 5 — Cross-source: Drik Panchang Delhi still matches after consolidation
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P4.5 (cross-source): Drik Panchang Delhi unchanged after Phase 4a edits', () => {
  const cases: Array<{ date: string; tithi: number; amanta: string; purnimanta: string }> = [
    { date: '2026-02-17', tithi: 30, amanta: 'Magha',           purnimanta: 'Phalguna' },
    { date: '2026-06-05', tithi: 20, amanta: 'Adhika Jyeshtha', purnimanta: 'Adhika Jyeshtha' },
    { date: '2026-07-14', tithi: 30, amanta: 'Jyeshtha',        purnimanta: 'Ashadha' },
    { date: '2026-10-10', tithi: 30, amanta: 'Bhadrapada',      purnimanta: 'Ashwina' },
    { date: '2026-12-08', tithi: 30, amanta: 'Kartika',         purnimanta: 'Margashirsha' },
  ];

  for (const c of cases) {
    it(`${c.date}: tithi=${c.tithi}, amanta=${c.amanta}, purnimanta=${c.purnimanta}`, () => {
      const [y, mo, d] = c.date.split('-').map(Number);
      const p = computePanchang({ year: y, month: mo, day: d, ...DELHI });
      expect(p.tithi.number, `${c.date} tithi`).toBe(c.tithi);
      expect(p.amantMasa?.en, `${c.date} amanta`).toBe(c.amanta);
      expect(p.purnimantMasa?.en, `${c.date} purnimanta`).toBe(c.purnimanta);
    });
  }
});

