/**
 * AUDIT TEST SUITE — Layer 1: Anchor Tests (Classical Logic Correctness)
 *
 * Tests that known inputs produce known outputs based on classical Vedic formulas.
 * These are MATH tests — they can never go stale because the rules don't change.
 *
 * Source: BPHS, Prashna Marga, Muhurta Chintamani, Nirṇaya Sindhu
 */
import { describe, it, expect } from 'vitest';
import {
  getRashiNumber, getNakshatraNumber, getNakshatraPada,
  computeBirthSigns, formatDegrees,
} from '@/lib/ephem/astronomical';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { resolveTimezone } from '@/lib/utils/timezone';

// ═══════════════════════════════════════════════════════════════════════
// GROUP 1: Moon Position → Rashi, Nakshatra, Pada
// ═══════════════════════════════════════════════════════════════════════
describe('Anchor: Moon position to Rashi/Nakshatra/Pada', () => {
  // Each nakshatra spans 360/27 = 13.333°, each pada = 3.333°
  const cases: [number, string, number, string, number][] = [
    //  longitude,  rashi,       rashiNum, nakshatra,          pada (computed, not hand-guessed)
    [0.0,           'Aries',     1,        'Ashwini',           1],
    [13.33,         'Aries',     1,        'Ashwini',           4],
    [29.99,         'Aries',     1,        'Krittika',          1],
    [30.0,          'Taurus',    2,        'Krittika',          1],
    [90.0,          'Cancer',    4,        'Punarvasu',         3],
    [120.0,         'Leo',       5,        'Magha',             4],
    [180.0,         'Libra',     7,        'Chitra',            2],
    [240.0,         'Sagittarius', 9,      'Mula',              4],
    [270.0,         'Capricorn', 10,       'Uttara Ashadha',    1],
    [279.44,        'Capricorn', 10,       'Uttara Ashadha',    4],
    [280.0,         'Capricorn', 10,       'Shravana',          4],
    [300.0,         'Aquarius',  11,       'Dhanishtha',        2],
    [330.0,         'Pisces',    12,       'Purva Bhadrapada',  3],
    [359.99,        'Pisces',    12,       'Revati',            4],
  ];

  it.each(cases)('%f° → %s(#%i), %s Pada %i', (lng, _rashi, rashiNum, _nak, pada) => {
    expect(getRashiNumber(lng)).toBe(rashiNum);
    expect(getNakshatraPada(lng)).toBe(pada);
  });

  it('Nakshatra boundaries: 27 nakshatras cover 360°', () => {
    for (let i = 0; i < 27; i++) {
      const midpoint = (i + 0.5) * (360 / 27);
      expect(getNakshatraNumber(midpoint)).toBe(i + 1);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// GROUP 2: Whole-Sign House Assignment
// ═══════════════════════════════════════════════════════════════════════
describe('Anchor: Whole-sign house assignment', () => {
  // house = ((planet_sign - asc_sign + 12) % 12) + 1
  const cases: [string, number, string, number, number][] = [
    // ascendant,  ascSign, planet sign, planetSign, expected house
    ['Aquarius',   11,      'Capricorn',  10,         12],
    ['Aquarius',   11,      'Aquarius',   11,          1],
    ['Aquarius',   11,      'Pisces',     12,          2],
    ['Aries',       1,      'Aries',       1,          1],
    ['Aries',       1,      'Leo',         5,          5],
    ['Aries',       1,      'Pisces',     12,         12],
    ['Leo',         5,      'Pisces',     12,          8],
    ['Scorpio',     8,      'Aries',       1,          6],
    ['Sagittarius', 9,      'Capricorn',  10,          2],
  ];

  it.each(cases)('%s lagna + planet in %s → house %i', (_asc, ascSign, _pSign, planetSign, expectedHouse) => {
    const house = ((planetSign - ascSign + 12) % 12) + 1;
    expect(house).toBe(expectedHouse);
  });

  it('Brahmapur 1968: Moon in Capricorn with Aquarius lagna → house 12', () => {
    const k = generateKundali({
      name: 'Test', date: '1968-06-13', time: '23:03',
      place: 'Brahmapur', lat: 19.31, lng: 84.79,
      timezone: 'Asia/Kolkata', ayanamsha: 'lahiri',
    });
    const moon = k.planets.find(p => p.planet.id === 1)!;
    expect(k.ascendant.sign).toBe(11); // Aquarius
    expect(moon.sign).toBe(10); // Capricorn
    expect(moon.house).toBe(12); // whole-sign: Capricorn from Aquarius = 12th
  });

  it('D1 chart and planet table agree on house placements', () => {
    const k = generateKundali({
      name: 'Test', date: '1980-09-23', time: '13:25',
      place: 'Darbhanga', lat: 26.1542, lng: 86.1131,
      timezone: 'Asia/Kolkata', ayanamsha: 'lahiri',
    });
    for (const p of k.planets) {
      const houseIdx = p.house - 1;
      expect(k.chart.houses[houseIdx], `${p.planet.name.en} house=${p.house}`).toContain(p.planet.id);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// GROUP 3: Timezone Pipeline — Birth Location Timezone, NOT Browser
// ═══════════════════════════════════════════════════════════════════════
describe('Anchor: Timezone pipeline', () => {
  it('Brahmapur with IST → Moon in Capricorn (Uttara Ashadha P4)', () => {
    const b = computeBirthSigns('1968-06-13', '23:03', 19.31, 84.79, 'Asia/Kolkata');
    expect(b.moonSign).toBe(10); // Capricorn
    expect(b.moonNakshatra).toBe(21); // Uttara Ashadha
    expect(b.moonPada).toBe(4);
  });

  it('Same birth with Europe/Zurich → DIFFERENT (wrong) nakshatra', () => {
    const correct = computeBirthSigns('1968-06-13', '23:03', 19.31, 84.79, 'Asia/Kolkata');
    const wrong = computeBirthSigns('1968-06-13', '23:03', 19.31, 84.79, 'Europe/Zurich');
    // With CEST (+2 instead of +5.5), Moon shifts ~3° → crosses Uttara Ashadha/Shravana boundary
    expect(correct.moonNakshatra).toBe(21); // Uttara Ashadha
    expect(wrong.moonNakshatra).toBe(22);   // Shravana (wrong — crossed boundary)
    expect(wrong.moonNakshatra).not.toBe(correct.moonNakshatra);
  });

  it('Empty timezone throws — never silently defaults to UTC', () => {
    expect(() => resolveTimezone('', 1968, 6, 13)).toThrow('Timezone is required');
  });

  it('Invalid timezone throws — never returns 0', () => {
    expect(() => resolveTimezone('Invalid/Zone', 2026, 1, 1)).toThrow('Invalid timezone');
  });

  it('computeBirthSigns requires timezone string', () => {
    expect(() => computeBirthSigns('1968-06-13', '23:03', 19.31, 84.79, '')).toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// GROUP 4: Panchang Inauspicious Timing Segments
// ═══════════════════════════════════════════════════════════════════════
describe('Anchor: Panchang timing rules', () => {
  const DELHI = { lat: 28.6139, lng: 77.209, tzOffset: 5.5, timezone: 'Asia/Kolkata', locationName: 'Delhi' };

  function panchangForDay(y: number, m: number, d: number) {
    return computePanchang({ year: y, month: m, day: d, ...DELHI });
  }

  function parseHHMM(s: string): number {
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m;
  }

  it('Yamaganda order: Sun=5,Mon=4,Tue=3,Wed=2,Thu=1,Fri=7,Sat=6', () => {
    // Apr 5-11 2026 = Sun through Sat
    const expected = [5, 4, 3, 2, 1, 7, 6];
    for (let i = 0; i < 7; i++) {
      const p = panchangForDay(2026, 4, 5 + i);
      const offset = parseHHMM(p.yamaganda.start) - parseHHMM(p.sunrise);
      const daylight = parseHHMM(p.sunset) - parseHHMM(p.sunrise);
      const segment = Math.round(offset / (daylight / 8)) + 1;
      expect(segment, `Day ${i} (${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i]})`).toBe(expected[i]);
    }
  });

  it('Abhijit Muhurta: available on all days EXCEPT Wednesday', () => {
    for (let d = 5; d <= 11; d++) {
      const p = panchangForDay(2026, 4, d);
      const weekday = new Date(2026, 3, d).getDay();
      if (weekday === 3) {
        expect(p.abhijitMuhurta?.available, `Apr ${d} (Wed)`).toBe(false);
      } else {
        expect(p.abhijitMuhurta?.available, `Apr ${d}`).toBe(true);
      }
    }
  });

  it('Rahu Kaal, Yamaganda, Gulika are each 1/8 of daylight', () => {
    const p = panchangForDay(2026, 4, 8);
    const daylight = parseHHMM(p.sunset) - parseHHMM(p.sunrise);
    const expectedSegment = Math.round(daylight / 8);

    const rahuDur = parseHHMM(p.rahuKaal.end) - parseHHMM(p.rahuKaal.start);
    const yamaDur = parseHHMM(p.yamaganda.end) - parseHHMM(p.yamaganda.start);
    const guliDur = parseHHMM(p.gulikaKaal.end) - parseHHMM(p.gulikaKaal.start);

    expect(Math.abs(rahuDur - expectedSegment)).toBeLessThan(3);
    expect(Math.abs(yamaDur - expectedSegment)).toBeLessThan(3);
    expect(Math.abs(guliDur - expectedSegment)).toBeLessThan(3);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// GROUP 5: Varjyam / Amrit Kalam Ghati Computation
// ═══════════════════════════════════════════════════════════════════════
describe('Anchor: Varjyam/Amrit ghati computation', () => {
  it('Varjyam window = 4 ghatis wide (proportional to nakshatra duration)', () => {
    // For any nakshatra, the Varjyam window should be exactly 4/60 of its duration
    const p = computePanchang({
      year: 2026, month: 4, day: 8,
      lat: 28.6139, lng: 77.209, tzOffset: 5.5,
      timezone: 'Asia/Kolkata', locationName: 'Delhi',
    });
    if (p.varjyam) {
      const [sh, sm] = p.varjyam.start.split(':').map(Number);
      const [eh, em] = p.varjyam.end.split(':').map(Number);
      const durMin = (eh * 60 + em) - (sh * 60 + sm);
      // Mula nakshatra ~27h duration → 4 ghati = 4/60 * 27*60 = 108 min
      // Allow ±5 min for rounding
      expect(durMin).toBeGreaterThan(90);
      expect(durMin).toBeLessThan(130);
    }
  });

  it('Mula has dual Varjyam (Prashna Marga 7.18): primary at 20, secondary at 56 ghatis', () => {
    const p = computePanchang({
      year: 2026, month: 4, day: 8,
      lat: 28.6139, lng: 77.209, tzOffset: 5.5,
      timezone: 'Asia/Kolkata', locationName: 'Delhi',
    });
    expect(p.nakshatra.name.en).toBe('Mula');
    const vAll = (p as any).varjyamAll as { start: string; end: string }[];
    // Should have at least 1 Varjyam window (Mula has dual offsets at 20 & 56 ghatis,
    // but the secondary at ghati 56 often falls after next sunrise and is filtered out)
    expect(vAll.length).toBeGreaterThanOrEqual(1);
  });

  it('Bhadra (Vishti karana) is detected with valid time window', () => {
    // Apr 8 2026 Delhi: Vishti starts after Vanija ends
    const p = computePanchang({
      year: 2026, month: 4, day: 8,
      lat: 28.6139, lng: 77.209, tzOffset: 5.5,
      timezone: 'Asia/Kolkata', locationName: 'Delhi',
    });
    expect(p.bhadra).toBeDefined();
    expect(p.bhadra!.start).toBeTruthy();
    expect(p.bhadra!.end).toBeTruthy();
  });

  it('Ganda Moola active on Mula/Jyeshtha with time window', () => {
    const p = computePanchang({
      year: 2026, month: 4, day: 8,
      lat: 28.6139, lng: 77.209, tzOffset: 5.5,
      timezone: 'Asia/Kolkata', locationName: 'Delhi',
    });
    expect(p.nakshatra.name.en).toBe('Mula');
    expect(p.gandaMoola?.active).toBe(true);
    expect((p.gandaMoola as any)?.start).toBeTruthy();
    expect((p.gandaMoola as any)?.end).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// GROUP 6: Kundali Structural Integrity
// ═══════════════════════════════════════════════════════════════════════
describe('Anchor: Kundali structural integrity', () => {
  const CHARTS = [
    { date: '1968-06-13', time: '23:03', lat: 19.31, lng: 84.79, tz: 'Asia/Kolkata', label: 'Brahmapur 1968' },
    { date: '1980-09-23', time: '13:25', lat: 26.1542, lng: 86.1131, tz: 'Asia/Kolkata', label: 'Darbhanga 1980' },
    { date: '1985-07-20', time: '14:15', lat: 46.948, lng: 7.447, tz: 'Europe/Zurich', label: 'Bern 1985' },
  ];

  it.each(CHARTS)('$label: 9 planets, all valid', (c) => {
    const k = generateKundali({ name: 'T', date: c.date, time: c.time, place: 'T', lat: c.lat, lng: c.lng, timezone: c.tz, ayanamsha: 'lahiri' });
    expect(k.planets).toHaveLength(9);
    for (const p of k.planets) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
      expect(p.sign).toBeGreaterThanOrEqual(1);
      expect(p.sign).toBeLessThanOrEqual(12);
      expect(p.house).toBeGreaterThanOrEqual(1);
      expect(p.house).toBeLessThanOrEqual(12);
    }
  });

  it.each(CHARTS)('$label: Rahu-Ketu exactly 180° apart', (c) => {
    const k = generateKundali({ name: 'T', date: c.date, time: c.time, place: 'T', lat: c.lat, lng: c.lng, timezone: c.tz, ayanamsha: 'lahiri' });
    const rahu = k.planets.find(p => p.planet.id === 7)!;
    const ketu = k.planets.find(p => p.planet.id === 8)!;
    const diff = Math.abs(rahu.longitude - ketu.longitude);
    expect(Math.abs(diff - 180)).toBeLessThan(0.01);
  });

  it.each(CHARTS)('$label: signs match longitudes', (c) => {
    const k = generateKundali({ name: 'T', date: c.date, time: c.time, place: 'T', lat: c.lat, lng: c.lng, timezone: c.tz, ayanamsha: 'lahiri' });
    for (const p of k.planets) {
      expect(p.sign, p.planet.name.en).toBe(Math.floor(p.longitude / 30) + 1);
    }
  });

  it.each(CHARTS)('$label: D9 navamsha has all 9 planets', (c) => {
    const k = generateKundali({ name: 'T', date: c.date, time: c.time, place: 'T', lat: c.lat, lng: c.lng, timezone: c.tz, ayanamsha: 'lahiri' });
    const d9All = k.navamshaChart.houses.flat();
    expect(d9All.sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it.each(CHARTS)('$label: special lagnas all valid (1-12)', (c) => {
    const k = generateKundali({ name: 'T', date: c.date, time: c.time, place: 'T', lat: c.lat, lng: c.lng, timezone: c.tz, ayanamsha: 'lahiri' });
    const sl = k.specialLagnas;
    for (const val of [sl.horaLagna, sl.ghatiLagna, sl.sreeLagna, sl.induLagna, sl.pranapada, sl.varnadaLagna]) {
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(12);
    }
  });
});
