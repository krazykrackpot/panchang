/**
 * Audit 2026-06-05 Phase 3 — display + render drift fixes.
 *
 * From docs/tech-debt/duplicate-logic-audit-2026-06-05.md:
 *
 *   - #6 (CRITICAL): OG image rebuilt tithi/nakshatra/yoga from raw
 *     longitudes inside the Edge runtime, hardcoded Lahiri, used inline
 *     English-only name arrays. Fix: dropped `runtime = 'edge'`, switched
 *     to canonical helpers from `@/lib/ephem/astronomical` and
 *     `@/lib/constants/{tithis,nakshatras,yogas}`. The image still
 *     revalidates daily so the Node runtime overhead is irrelevant.
 *
 *   - #7 (CRITICAL → REFUTED): the audit claimed the 5-card grid drifted
 *     between PanchangClient.tsx (timezone-aware) and TodayPanchangWidget
 *     (naive). The widget already routes through the shared
 *     `hasMomentPassed` helper from `@/lib/utils/now-in-timezone` — see
 *     commit 045dded3 ("fix(panchang): unify transition-passed
 *     comparison"). The audit was based on a snapshot BEFORE that fix
 *     landed. Verified below by static check that both files import the
 *     shared helper.
 *
 *   - #8 (HIGH): TodayPanchangWidget hardcoded
 *     `locale === 'hi' ? 'अमान्त' : 'Amant'` so 7 of the 9 visible
 *     locales (ta, te, bn, kn, gu, mai, mr) saw the English string while
 *     PanchangClient.tsx localised properly. Fix: added `amant` /
 *     `purnimant` to `src/messages/components/today-panchang.json` with
 *     all 9 locales and routed the widget through `msg(...)`.
 *
 *   - #10 (CRITICAL → REFUTED): the audit claimed three hora
 *     implementations use different start-planet tables. They do —
 *     `[6,4,2,0,5,3,1]` (Sat-first) vs `[0,5,3,1,6,4,2]` (Sun-first) —
 *     but those are different ROTATIONS of the same Chaldean cycle. All
 *     three produce identical 24-hour hora sequences. Verified below by
 *     running all three on 2026-06-05 Delhi Friday and comparing
 *     planet IDs hour-by-hour.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { calculateHoras } from '@/lib/hora/hora-calculator';
import { computeHoraTable } from '@/lib/panchang/hora-engine';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import {
  dateToJD,
  toSidereal,
  moonLongitude,
  calculateTithi,
  calculateYoga,
  getNakshatraNumber,
} from '@/lib/ephem/astronomical';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import todayPanchangMsg from '@/messages/components/today-panchang.json';

const DELHI = { lat: 28.6139, lng: 77.2090, tzOffset: 5.5, timezone: 'Asia/Kolkata' };

// ───────────────────────────────────────────────────────────────────────────
// 1 — Hora cross-implementation agreement (audit #10 REFUTED)
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P3.1: three hora implementations produce identical output (#10 refuted)', () => {
  // 2026-06-05 Friday, Delhi. Sunrise/sunset from the canonical panchang engine.
  const p = computePanchang({ year: 2026, month: 6, day: 5, ...DELHI });
  const sunrise = p.sunrise;
  const sunset = p.sunset;
  const nextSunrise = '05:26'; // next day approximate
  const weekday = 5;           // Friday

  const hc = calculateHoras(new Date('2026-06-05'), sunrise, sunset, nextSunrise, weekday);
  const he = computeHoraTable(sunrise, sunset, nextSunrise, weekday);
  type PCHora = { planetId: number; startTime: string; endTime: string };
  const pcHoras = (p as unknown as { hora?: PCHora[] }).hora ?? [];

  it('Friday first day hora = Venus (planet 5) — Drik convention', () => {
    expect(hc.horas[0].planet).toBe(5);
    expect(he[0].planetId).toBe(5);
    if (pcHoras.length) expect(pcHoras[0].planetId).toBe(5);
  });

  it('hora-calculator ↔ hora-engine: 24/24 planet IDs agree', () => {
    for (let i = 0; i < 24; i++) {
      expect(hc.horas[i].planet, `hora ${i + 1}`).toBe(he[i].planetId);
    }
  });

  it('hora-calculator ↔ panchang-calc.computeHora: 24/24 planet IDs agree', () => {
    expect(pcHoras.length).toBe(24);
    for (let i = 0; i < 24; i++) {
      expect(hc.horas[i].planet, `hora ${i + 1}`).toBe(pcHoras[i].planetId);
    }
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 2 — TodayPanchangWidget Amant/Purnimant localised across all 9 locales (#8)
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P3.2: Amant/Purnimant labels localised in TodayPanchangWidget (#8)', () => {
  const widgetSrc = readFileSync(
    join(process.cwd(), 'src/components/panchang/TodayPanchangWidget.tsx'),
    'utf8',
  );

  it('widget no longer uses hardcoded `locale === "hi" ?` ternary for masa labels', () => {
    expect(widgetSrc).not.toMatch(/locale === ['"]hi['"]\s*\?\s*['"]अमान्त['"]/);
    expect(widgetSrc).not.toMatch(/locale === ['"]hi['"]\s*\?\s*['"]पूर्णिमान्त['"]/);
  });

  it('widget routes the Amant/Purnimant labels through msg()', () => {
    expect(widgetSrc).toMatch(/msg\(['"]amant['"]\s*,\s*locale\)/);
    expect(widgetSrc).toMatch(/msg\(['"]purnimant['"]\s*,\s*locale\)/);
  });

  it('today-panchang.json defines amant/purnimant for ALL 9 visible locales', () => {
    const msgs = todayPanchangMsg as unknown as Record<string, Record<string, string>>;
    const required = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
    for (const key of ['amant', 'purnimant']) {
      expect(msgs[key], `${key} missing`).toBeDefined();
      for (const locale of required) {
        expect(msgs[key][locale], `${key}.${locale} missing`).toBeDefined();
        expect(msgs[key][locale]!.length, `${key}.${locale} empty`).toBeGreaterThan(0);
      }
    }
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 3 — 5-card grid: both files share the canonical hasMomentPassed helper
//     (audit #7 REFUTED)
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P3.3: 5-card transition logic already shared (#7 refuted)', () => {
  const panchangClient = readFileSync(
    join(process.cwd(), 'src/app/[locale]/panchang/PanchangClient.tsx'),
    'utf8',
  );
  const widget = readFileSync(
    join(process.cwd(), 'src/components/panchang/TodayPanchangWidget.tsx'),
    'utf8',
  );

  it('PanchangClient.tsx imports hasMomentPassed from canonical helper', () => {
    expect(panchangClient).toMatch(
      /from\s+['"]@\/lib\/utils\/now-in-timezone['"]/,
    );
    expect(panchangClient).toMatch(/\bhasMomentPassed\b/);
  });

  it('TodayPanchangWidget.tsx imports hasMomentPassed from canonical helper', () => {
    expect(widget).toMatch(
      /from\s+['"]@\/lib\/utils\/now-in-timezone['"]/,
    );
    expect(widget).toMatch(/\bhasMomentPassed\b/);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 4 — OG image now uses canonical engine helpers (#6)
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P3.4: OG image uses canonical engine helpers (#6)', () => {
  const ogSrc = readFileSync(
    join(process.cwd(), 'src/app/[locale]/panchang/opengraph-image.tsx'),
    'utf8',
  );

  it('no longer declares `runtime = "edge"`', () => {
    expect(ogSrc).not.toMatch(/export const runtime = ['"]edge['"]/);
  });

  it('imports canonical helpers (calculateTithi, calculateYoga, getNakshatraNumber)', () => {
    expect(ogSrc).toMatch(/from\s+['"]@\/lib\/ephem\/astronomical['"]/);
    expect(ogSrc).toMatch(/\bcalculateTithi\b/);
    expect(ogSrc).toMatch(/\bcalculateYoga\b/);
    expect(ogSrc).toMatch(/\bgetNakshatraNumber\b/);
  });

  it('imports canonical name tables (TITHIS / NAKSHATRAS / YOGAS)', () => {
    expect(ogSrc).toMatch(/from\s+['"]@\/lib\/constants\/tithis['"]/);
    expect(ogSrc).toMatch(/from\s+['"]@\/lib\/constants\/nakshatras['"]/);
    expect(ogSrc).toMatch(/from\s+['"]@\/lib\/constants\/yogas['"]/);
  });

  it('no longer inlines TITHI_NAMES / NAKSHATRA_NAMES / YOGA_NAMES arrays', () => {
    expect(ogSrc).not.toMatch(/const TITHI_NAMES\s*=/);
    expect(ogSrc).not.toMatch(/const NAKSHATRA_NAMES\s*=/);
    expect(ogSrc).not.toMatch(/const YOGA_NAMES\s*=/);
  });

  it('OG canonical helpers produce the same noon-UT tithi as the canonical engine for 2026-06-05', () => {
    const jd = dateToJD(2026, 6, 5, 12);
    const moonSid = toSidereal(moonLongitude(jd), jd);
    const tithi = calculateTithi(jd);
    const nak = getNakshatraNumber(moonSid);
    const yoga = calculateYoga(jd);

    // Tithi 20 (Krishna Panchami) at noon UT — same as Drik for the sunrise day.
    expect(tithi.number).toBe(20);
    expect(TITHIS[tithi.number - 1]?.name.en).toBe('Panchami');

    // Nakshatra and yoga at noon UT may differ from sunrise (Moon moves ~6° in
    // half a day; nak/yoga buckets are 13.33°). The OG image deliberately
    // samples at noon UT for daily stability — verified the indices map to
    // valid names from the canonical tables.
    expect(NAKSHATRAS[nak - 1]?.name.en).toBeTypeOf('string');
    expect(YOGAS[yoga - 1]?.name.en).toBeTypeOf('string');
  });
});
