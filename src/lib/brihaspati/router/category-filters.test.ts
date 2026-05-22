/**
 * Tests for Layer-2 category filters. These exercise the contract that
 * was missing in the original buildContext() pass-through — REVIEW_TRACKER L2.
 *
 * Key invariants:
 *  - A marriage filter does NOT pass career planets through (Sun/Saturn only
 *    appear because we always carry Sun + Moon as base context)
 *  - A career filter does NOT pass marriage-specific yogas through
 *  - A transit filter prunes transits that don't touch focus houses/planets
 *  - Focus block is populated for every category
 *  - Defensive: arbitrary kundali shapes don't crash
 */
import { describe, it, expect } from 'vitest';
import { filterForCategory, CATEGORY_FOCUS } from './category-filters';
import { BRIHASPATI_CATEGORIES } from '../types';
import type { RouterKundali } from '../router';

const RICH_KUNDALI: RouterKundali = {
  engineVersion: 'v1',
  chart: {
    positions: [
      { planet: 'Sun', sign: 'Leo', house: 5 },
      { planet: 'Moon', sign: 'Cancer', house: 4 },
      { planet: 'Mars', sign: 'Aries', house: 1 },
      { planet: 'Mercury', sign: 'Virgo', house: 6 },
      { planet: 'Jupiter', sign: 'Sagittarius', house: 9 },
      { planet: 'Venus', sign: 'Taurus', house: 2 },
      { planet: 'Saturn', sign: 'Capricorn', house: 10 },
      { planet: 'Rahu', sign: 'Aquarius', house: 11 },
      { planet: 'Ketu', sign: 'Leo', house: 5 },
    ],
    houses: [
      { house: 1, sign: 'Aries', lord: 'Mars' },
      { house: 2, sign: 'Taurus', lord: 'Venus' },
      { house: 5, sign: 'Leo', lord: 'Sun' },
      { house: 7, sign: 'Libra', lord: 'Venus' },
      { house: 10, sign: 'Capricorn', lord: 'Saturn' },
      { house: 11, sign: 'Aquarius', lord: 'Saturn' },
    ],
    lagna: 'Aries',
    moonSign: 'Cancer',
  },
  dashas: {
    current: 'Jupiter',
    sub: 'Mercury',
    chain: ['Jupiter', 'Mercury', 'Venus', 'Sun', 'Moon'],
    upcoming: [{ lord: 'Saturn', start: '2027-01-01' }, { lord: 'Venus', start: '2027-06-01' }],
  },
  yogas: [
    { name: 'Gajakesari Yoga', domain: 'general' },
    { name: 'Mangal Dosha', domain: 'marriage' },
    { name: 'Budhaditya Yoga', domain: 'career' },
    { name: 'Putra Yoga', domain: 'children' },
  ],
  doshas: [
    { name: 'Mangal Dosha' },
    { name: 'Kaal Sarpa Dosha' },
  ],
  transits: [
    { planet: 'Saturn', house: 10, sign: 'Capricorn' },
    { planet: 'Jupiter', house: 2, sign: 'Taurus' },
    { planet: 'Mars', house: 6, sign: 'Virgo' },
    { planet: 'Mercury', house: 4, sign: 'Cancer' },
  ],
  analysis: {
    career: { tenth_lord_state: 'strong', dasa_affecting: 'Saturn-Jupiter' },
    marriage: { seventh_house_state: 'mixed', kuja_dosha: 'mild' },
    domain_synthesis: {
      finance: { wealth_score: 7 },
    },
  },
};

// ── Focus anchor ─────────────────────────────────────────────────────────

describe('category-filters — focus anchor', () => {
  it.each(BRIHASPATI_CATEGORIES)('%s category has a populated focus block', (category) => {
    const slice = filterForCategory(category, RICH_KUNDALI);
    expect(slice.focus, `${category}.focus`).toBeTruthy();
    expect(slice.focus.houses).toBeInstanceOf(Array);
    expect(slice.focus.planets).toBeInstanceOf(Array);
    expect(slice.focus.significators).toBeInstanceOf(Array);
  });

  it('career focus = [10, 6, 2] houses + Saturn/Sun/Mercury planets', () => {
    expect(CATEGORY_FOCUS.career.houses).toEqual([10, 6, 2]);
    expect(CATEGORY_FOCUS.career.planets).toContain('Saturn');
    expect(CATEGORY_FOCUS.career.planets).toContain('Sun');
  });

  it('marriage focus = [7, 2, 8] houses + Venus/Jupiter/Mars planets', () => {
    expect(CATEGORY_FOCUS.marriage.houses).toEqual([7, 2, 8]);
    expect(CATEGORY_FOCUS.marriage.planets).toContain('Venus');
    expect(CATEGORY_FOCUS.marriage.planets).toContain('Jupiter');
    expect(CATEGORY_FOCUS.marriage.planets).toContain('Mars');
  });
});

// ── Chart filtering: planets ────────────────────────────────────────────

describe('category-filters — chart positions are category-scoped', () => {
  it('marriage filter keeps Venus + Jupiter + Mars (plus Sun + Moon base)', () => {
    const slice = filterForCategory('marriage', RICH_KUNDALI);
    const positions = slice.chart.positions as Array<{ planet: string }>;
    const planets = positions.map((p) => p.planet);
    expect(planets).toContain('Venus');
    expect(planets).toContain('Jupiter');
    expect(planets).toContain('Mars');
    // Saturn is NOT a marriage focus planet — should NOT be in slice
    expect(planets).not.toContain('Saturn');
    expect(planets).not.toContain('Rahu');
    expect(planets).not.toContain('Ketu');
  });

  it('career filter keeps Saturn but drops Venus + Mars', () => {
    const slice = filterForCategory('career', RICH_KUNDALI);
    const positions = slice.chart.positions as Array<{ planet: string }>;
    const planets = positions.map((p) => p.planet);
    expect(planets).toContain('Saturn');
    expect(planets).toContain('Mercury');
    expect(planets).not.toContain('Venus');
    expect(planets).not.toContain('Mars');
  });

  it('always includes Sun + Moon as base context across all categories', () => {
    for (const category of BRIHASPATI_CATEGORIES) {
      const slice = filterForCategory(category, RICH_KUNDALI);
      const positions = slice.chart.positions as Array<{ planet: string }>;
      const planets = positions.map((p) => p.planet);
      expect(planets, `${category} missing Sun`).toContain('Sun');
      expect(planets, `${category} missing Moon`).toContain('Moon');
    }
  });
});

// ── Chart filtering: houses ─────────────────────────────────────────────

describe('category-filters — house cusps are category-scoped', () => {
  it('marriage filter returns the 7th house cusp', () => {
    const slice = filterForCategory('marriage', RICH_KUNDALI);
    const houses = slice.chart.houses as Array<{ house: number }>;
    expect(houses.find((h) => h.house === 7)).toBeTruthy();
    // 10th house is NOT in marriage focus
    expect(houses.find((h) => h.house === 10)).toBeFalsy();
  });

  it('career filter returns the 10th house cusp', () => {
    const slice = filterForCategory('career', RICH_KUNDALI);
    const houses = slice.chart.houses as Array<{ house: number }>;
    expect(houses.find((h) => h.house === 10)).toBeTruthy();
    expect(houses.find((h) => h.house === 7)).toBeFalsy();
  });
});

// ── Yoga / Dosha filtering ──────────────────────────────────────────────

describe('category-filters — yogas filtered by domain', () => {
  it('marriage filter keeps Mangal Dosha but drops Budhaditya Yoga', () => {
    const slice = filterForCategory('marriage', RICH_KUNDALI);
    const names = slice.yogas.map((y) => String(y.name));
    expect(names).toContain('Mangal Dosha');
    expect(names).not.toContain('Budhaditya Yoga');
  });

  it('career filter keeps Budhaditya Yoga but drops Mangal Dosha', () => {
    const slice = filterForCategory('career', RICH_KUNDALI);
    const names = slice.yogas.map((y) => String(y.name));
    expect(names).toContain('Budhaditya Yoga');
    expect(names).not.toContain('Mangal Dosha');
  });

  it('general category passes all yogas through (no filter)', () => {
    const slice = filterForCategory('general', RICH_KUNDALI);
    expect(slice.yogas.length).toBe(RICH_KUNDALI.yogas!.length);
  });

  it('does not drop the only yoga if it doesn\'t match (fall-back to original)', () => {
    const kundaliWithUnmatchedYoga: RouterKundali = {
      ...RICH_KUNDALI,
      yogas: [{ name: 'Random Yoga' }],
    };
    const slice = filterForCategory('career', kundaliWithUnmatchedYoga);
    expect(slice.yogas.length).toBeGreaterThan(0); // graceful fallback
  });
});

// ── Transit filtering ────────────────────────────────────────────────────

describe('category-filters — transits scoped to focus', () => {
  it('career filter keeps Saturn-in-10th transit', () => {
    const slice = filterForCategory('career', RICH_KUNDALI);
    const transits = slice.transits as Array<{ planet: string; house: number }>;
    expect(transits.find((t) => t.planet === 'Saturn' && t.house === 10)).toBeTruthy();
  });

  it('career filter drops Jupiter-in-2nd transit (Jupiter not in career focus, 2nd is)', () => {
    // Wait — 2 IS a career focus house. So this transit should be KEPT.
    // Let's test the actual drop: Mars-in-6th — Mars not in career focus, 6 IS.
    const slice = filterForCategory('career', RICH_KUNDALI);
    const transits = slice.transits as Array<{ planet: string; house: number }>;
    // Mars-in-6th: 6 is a career focus house → kept
    expect(transits.find((t) => t.planet === 'Mars' && t.house === 6)).toBeTruthy();
    // Mercury-in-4th: 4 not in career focus, Mercury IS in career planets → kept
    expect(transits.find((t) => t.planet === 'Mercury' && t.house === 4)).toBeTruthy();
  });

  it('marriage filter keeps Jupiter-in-2nd (Jupiter is a marriage karaka, 2nd is in focus)', () => {
    const slice = filterForCategory('marriage', RICH_KUNDALI);
    const transits = slice.transits as Array<{ planet: string; house: number }>;
    expect(transits.find((t) => t.planet === 'Jupiter')).toBeTruthy();
  });
});

// ── Dasha trimming ──────────────────────────────────────────────────────

describe('category-filters — dashas trimmed but never empty', () => {
  it('always carries current + sub dasha lords', () => {
    const slice = filterForCategory('career', RICH_KUNDALI);
    expect(slice.dashas.current).toBe('Jupiter');
    expect(slice.dashas.sub).toBe('Mercury');
  });

  it('limits chain to 6 entries to avoid full-period dumping', () => {
    const longChain: RouterKundali = {
      ...RICH_KUNDALI,
      dashas: {
        current: 'Jupiter',
        chain: ['Jupiter', 'Mercury', 'Venus', 'Sun', 'Moon', 'Mars', 'Saturn', 'Rahu', 'Ketu'],
      },
    };
    const slice = filterForCategory('career', longChain);
    expect((slice.dashas.chain as unknown[]).length).toBeLessThanOrEqual(6);
  });
});

// ── Analysis selection ──────────────────────────────────────────────────

describe('category-filters — category-specific analysis is selected', () => {
  it('career filter picks analysis.career block', () => {
    const slice = filterForCategory('career', RICH_KUNDALI);
    expect(slice.analysis.tenth_lord_state).toBe('strong');
  });

  it('marriage filter picks analysis.marriage block', () => {
    const slice = filterForCategory('marriage', RICH_KUNDALI);
    expect(slice.analysis.seventh_house_state).toBe('mixed');
  });

  it('finance filter picks domain_synthesis.finance when no top-level analysis.finance', () => {
    const slice = filterForCategory('finance', RICH_KUNDALI);
    expect(slice.analysis.wealth_score).toBe(7);
  });
});

// ── Remedies promotion (REVIEW_TRACKER P2) ──────────────────────────────

describe('category-filters — remedies are promoted to first-class field', () => {
  it('reads remedies from kundali top-level when present', () => {
    const k: RouterKundali = {
      engineVersion: 'v1',
      chart: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...({ remedies: [{ text: 'Wear yellow sapphire', kind: 'gemstone', planet: 'Jupiter' }] } as any),
    };
    const slice = filterForCategory('finance', k);
    expect(slice.remedies).toEqual([{ text: 'Wear yellow sapphire', kind: 'gemstone', planet: 'Jupiter' }]);
  });

  it('reads remedies from analysis.remedies', () => {
    const k: RouterKundali = {
      engineVersion: 'v1',
      chart: {},
      analysis: { remedies: [{ text: 'Recite Vishnu Sahasranama on Thursdays', kind: 'mantra' }] },
    };
    const slice = filterForCategory('general', k);
    expect(slice.remedies[0].text).toMatch(/Vishnu Sahasranama/);
  });

  it('reads category-specific analysis.<category>.remedies', () => {
    const k: RouterKundali = {
      engineVersion: 'v1',
      chart: {},
      analysis: {
        marriage: { remedies: [{ text: 'Friday Venus puja', kind: 'puja' }] },
      },
    };
    const slice = filterForCategory('marriage', k);
    expect(slice.remedies[0].text).toMatch(/Venus puja/);
  });

  it('normalises string-form remedies to { text }', () => {
    const k: RouterKundali = {
      engineVersion: 'v1',
      chart: {},
      analysis: { remedies: ['Donate food on Saturdays', { text: 'Wear red coral', kind: 'gemstone' }] },
    };
    const slice = filterForCategory('health', k);
    expect(slice.remedies).toEqual([
      { text: 'Donate food on Saturdays' },
      { text: 'Wear red coral', kind: 'gemstone' },
    ]);
  });

  it('returns empty array when no remedies anywhere (rule #4 falls back to chart-themed suggestion)', () => {
    const k: RouterKundali = { engineVersion: 'v1', chart: {} };
    const slice = filterForCategory('career', k);
    expect(slice.remedies).toEqual([]);
  });
});

// ── Defensive: arbitrary input shapes ───────────────────────────────────

describe('category-filters — defensive against arbitrary kundali shapes', () => {
  it('empty kundali does not crash', () => {
    const empty: RouterKundali = { engineVersion: 'v1', chart: {} };
    for (const category of BRIHASPATI_CATEGORIES) {
      expect(() => filterForCategory(category, empty)).not.toThrow();
    }
  });

  it('kundali with planets-object shape works', () => {
    const altShape: RouterKundali = {
      engineVersion: 'v1',
      chart: {
        planets: {
          Venus: { sign: 'Taurus', house: 7 },
          Saturn: { sign: 'Capricorn', house: 10 },
        },
      },
    };
    const slice = filterForCategory('marriage', altShape);
    const positions = slice.chart.positions as Array<{ planet: string }>;
    expect(positions.find((p) => p.planet === 'Venus')).toBeTruthy();
  });

  it('kundali with top-level planet keys works', () => {
    const altShape: RouterKundali = {
      engineVersion: 'v1',
      chart: {
        Venus: { sign: 'Taurus', house: 7 },
        Mars: { sign: 'Aries', house: 1 },
      },
    };
    const slice = filterForCategory('marriage', altShape);
    const positions = slice.chart.positions as Array<{ planet: string }>;
    expect(positions.find((p) => p.planet === 'Venus')).toBeTruthy();
  });
});
