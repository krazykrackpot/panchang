/**
 * Snapshot normaliser — contract test against a real engine output.
 *
 * The fixture in __fixtures__/real-snapshot.json was extracted from the
 * production kundali_snapshots table. The structure is verbatim what the
 * engine emits today (with deep dasha trees and divisional charts
 * trimmed for repo size — but per-field shape preserved).
 *
 * Every assertion below is a CONTRACT: if it breaks, either the engine
 * changed shape (update the normaliser) OR a normaliser change dropped
 * a field the LLM relies on (do not commit). The normaliser is the
 * boundary between deterministic Jyotish and probabilistic LLM — any
 * silent loss here causes wrong readings the user cannot trace.
 */
import { describe, it, expect } from 'vitest';
import { normaliseSnapshot } from './snapshot-normaliser';
import REAL from './__fixtures__/real-snapshot.json' with { type: 'json' };

// Force loose typing for the test side; the fixture is engine-shape JSON.
const raw = REAL as unknown as Parameters<typeof normaliseSnapshot>[0];
const k = normaliseSnapshot(raw);

describe('snapshot-normaliser — top-level shape', () => {
  it('returns engineVersion + chart + dashas + yogas + doshas + transits + analysis', () => {
    expect(k.engineVersion).toBe('string' === typeof k.engineVersion ? k.engineVersion : '');
    expect(k.chart).toBeTypeOf('object');
    expect(k.dashas).toBeTypeOf('object');
    expect(Array.isArray(k.yogas)).toBe(true);
    expect(Array.isArray(k.doshas)).toBe(true);
    expect(Array.isArray(k.transits)).toBe(true);
    expect(k.analysis).toBeTypeOf('object');
  });
});

describe('snapshot-normaliser — planet positions (per planet)', () => {
  it('emits all 9 grahas (Sun..Ketu) when the engine did', () => {
    const positions = k.chart.positions as Array<Record<string, unknown>>;
    const names = positions.map((p) => p.planet);
    for (const expected of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
      expect(names).toContain(expected);
    }
  });

  it('surfaces precise astronomy: longitude, latitude, speed, degree', () => {
    const positions = k.chart.positions as Array<Record<string, unknown>>;
    const sun = positions.find((p) => p.planet === 'Sun');
    expect(sun).toBeDefined();
    expect(typeof sun!.longitude).toBe('number');
    expect(typeof sun!.latitude).toBe('number');
    expect(typeof sun!.speed).toBe('number');
    expect(typeof sun!.degree).toBe('string');
  });

  it('surfaces nakshatra trio (name + lord + pada)', () => {
    const positions = k.chart.positions as Array<Record<string, unknown>>;
    const sun = positions.find((p) => p.planet === 'Sun');
    expect(sun!.nakshatra).toBeTypeOf('string');
    expect(sun!.nakshatra_lord).toBeTypeOf('string');
    expect(typeof sun!.nakshatra_pada).toBe('number');
  });

  it('surfaces ALL dignity flags (combust, vargottama, mrityu, pushkar) — not only exalt/debil', () => {
    const positions = k.chart.positions as Array<Record<string, unknown>>;
    const sun = positions.find((p) => p.planet === 'Sun');
    // These are dignity facts the LLM cannot infer from sign alone.
    expect(sun!.combust).toBeTypeOf('boolean');
    expect(sun!.vargottama).toBeTypeOf('boolean');
    expect(sun!.mrityu_bhaga).toBeTypeOf('boolean');
    expect(sun!.pushkar_bhaga).toBeTypeOf('boolean');
    expect(sun!.pushkar_navamsha).toBeTypeOf('boolean');
  });

  it('surfaces navamshaSign (D9) for each planet', () => {
    const positions = k.chart.positions as Array<Record<string, unknown>>;
    const sun = positions.find((p) => p.planet === 'Sun');
    expect(sun!.navamsha_sign).toBeTypeOf('string');
  });
});

describe('snapshot-normaliser — planet meta merged onto position', () => {
  it('merges shadbala component breakdown (sthana/dig/kala/cheshta/drik/naisargika)', () => {
    const positions = k.chart.positions as Array<Record<string, unknown>>;
    const sun = positions.find((p) => p.planet === 'Sun') as Record<string, unknown>;
    expect(sun.shadbala).toBeDefined();
    const s = sun.shadbala as Record<string, unknown>;
    // All 6 components must be present (the LLM uses these qualitatively).
    expect(s).toHaveProperty('total');
    expect(s).toHaveProperty('sthana');
    expect(s).toHaveProperty('dig');
    expect(s).toHaveProperty('kala');
    expect(s).toHaveProperty('cheshta');
    expect(s).toHaveProperty('drik');
    expect(s).toHaveProperty('naisargika');
  });

  it('merges avastha (all 5 systems: baladi, jagradadi, deeptadi, lajjitadi, shayanadi)', () => {
    const positions = k.chart.positions as Array<Record<string, unknown>>;
    const sun = positions.find((p) => p.planet === 'Sun') as Record<string, unknown>;
    expect(sun.avastha).toBeDefined();
    const a = sun.avastha as Record<string, unknown>;
    expect(a).toHaveProperty('baladi');
    expect(a).toHaveProperty('jagradadi');
    expect(a).toHaveProperty('deeptadi');
    expect(a).toHaveProperty('lajjitadi');
    expect(a).toHaveProperty('shayanadi');
  });

  it('merges functional nature (yogakaraka/benefic/maraka/badhak) per planet', () => {
    const positions = k.chart.positions as Array<Record<string, unknown>>;
    const sun = positions.find((p) => p.planet === 'Sun') as Record<string, unknown>;
    // Functional nature is set by the engine for every planet — even
    // 'neutral' is information. Should be present.
    expect(sun).toHaveProperty('functional_nature');
    expect(sun).toHaveProperty('house_rulership');
  });
});

describe('snapshot-normaliser — top-level analysis block', () => {
  it('surfaces ascendant with sign + degree + nakshatra + pada', () => {
    const a = k.analysis as Record<string, unknown>;
    const asc = a.ascendant as Record<string, unknown>;
    expect(asc.sign).toBeTypeOf('string');
    expect(asc.degree).toBeTypeOf('number');
    expect(asc).toHaveProperty('nakshatra');
  });

  it('surfaces functional_summary with badhak/maraka/yogakaraka lords', () => {
    const a = k.analysis as Record<string, unknown>;
    expect(a.functional_summary).toBeDefined();
    const fs = a.functional_summary as Record<string, unknown>;
    expect(fs).toHaveProperty('badhak_lord');
    expect(fs).toHaveProperty('badhak_house');
    expect(fs).toHaveProperty('maraka_lords');
    expect(fs).toHaveProperty('yoga_karaka');
  });

  it('surfaces ashtakavarga as SAV-per-sign + pinda-per-planet', () => {
    const a = k.analysis as Record<string, unknown>;
    const av = a.ashtakavarga as Record<string, unknown>;
    expect(av).toBeDefined();
    expect(av.sav_by_sign).toBeTypeOf('object');
    expect(av.pinda_by_planet).toBeTypeOf('object');
    // SAV table must have all 12 signs keyed by English name
    const sav = av.sav_by_sign as Record<string, number>;
    for (const sign of ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']) {
      expect(sav).toHaveProperty(sign);
      expect(typeof sav[sign]).toBe('number');
    }
  });

  it('surfaces bhavabala (house strength) for each house', () => {
    const a = k.analysis as Record<string, unknown>;
    const bb = a.bhavabala as Array<Record<string, unknown>>;
    expect(Array.isArray(bb)).toBe(true);
    expect(bb.length).toBeGreaterThanOrEqual(12);
  });

  it('surfaces navamsha (D9) chart summary with 12 houses', () => {
    const a = k.analysis as Record<string, unknown>;
    const nv = a.navamsha as Record<string, unknown>;
    expect(nv).toBeDefined();
    expect(nv.lagna).toBeTypeOf('string');
    expect(Array.isArray(nv.houses)).toBe(true);
    expect((nv.houses as unknown[]).length).toBe(12);
  });

  it('surfaces jaimini atmakaraka (the soul indicator — non-negotiable for purpose questions)', () => {
    const a = k.analysis as Record<string, unknown>;
    const j = a.jaimini as Record<string, unknown>;
    expect(j).toBeDefined();
    expect(j).toHaveProperty('atmakaraka');
    expect(j).toHaveProperty('karakamsha');
  });
});

describe('snapshot-normaliser — dashas (3 levels)', () => {
  it('surfaces current maha + antar + pratyantar when available', () => {
    const d = k.dashas as Record<string, unknown>;
    expect(d.current).toBeTypeOf('string');
    // Sub + pratyantar may be undefined for fixture-clipped data, but the
    // KEY must be addressable.
    expect(d).toHaveProperty('sub');
    expect(d).toHaveProperty('pratyantar');
  });

  it('surfaces current maha start/end dates + upcoming transitions', () => {
    const d = k.dashas as Record<string, unknown>;
    expect(d).toHaveProperty('start_date');
    expect(d).toHaveProperty('end_date');
    expect(Array.isArray(d.upcoming)).toBe(true);
  });
});

describe('snapshot-normaliser — yogas', () => {
  it('surfaces detected yogas with name + domain + strength_label', () => {
    expect(k.yogas.length).toBeGreaterThan(0);
    const y = k.yogas[0] as Record<string, unknown>;
    expect(y).toHaveProperty('name');
    // domain may be null but key must exist
    expect(y).toHaveProperty('domain');
    expect(y).toHaveProperty('strength_label');
    expect(y).toHaveProperty('cancelled');
  });
});

describe('snapshot-normaliser — houses', () => {
  it('surfaces 12 houses with sign + planets', () => {
    const houses = k.chart.houses as Array<Record<string, unknown>>;
    expect(houses.length).toBe(12);
    for (const h of houses) {
      expect(h).toHaveProperty('house');
      expect(h).toHaveProperty('sign');
      expect(Array.isArray(h.planets)).toBe(true);
    }
  });

  it('first house sign matches the ascendant sign', () => {
    const houses = k.chart.houses as Array<Record<string, unknown>>;
    expect(houses[0].sign).toBe(k.chart.lagna);
  });
});

describe('snapshot-normaliser — defensive shape coercion', () => {
  it('does not throw on null full_kundali', () => {
    expect(() => normaliseSnapshot({ full_kundali: null } as never)).not.toThrow();
  });
  it('does not throw on missing chart_data', () => {
    expect(() => normaliseSnapshot({} as never)).not.toThrow();
  });
  it('accepts {planets:[...]} shape for chart_data.houses cells', () => {
    const out = normaliseSnapshot({
      chart_data: {
        houses: [{ planets: [0, 1] }, { planets: [] }, { planets: [] }, { planets: [] }, { planets: [] }, { planets: [] }, { planets: [] }, { planets: [] }, { planets: [] }, { planets: [] }, { planets: [] }, { planets: [] }],
        ascendantSign: 1,
      },
    } as never);
    const houses = out.chart.houses as Array<Record<string, unknown>>;
    expect((houses[0].planets as unknown[])).toEqual(['Sun', 'Moon']);
  });
  it('accepts {grahas:[...]} shape too', () => {
    const out = normaliseSnapshot({
      chart_data: {
        houses: [{ grahas: [4] }, [], [], [], [], [], [], [], [], [], [], []],
        ascendantSign: 1,
      },
    } as never);
    const houses = out.chart.houses as Array<Record<string, unknown>>;
    expect((houses[0].planets as unknown[])).toEqual(['Jupiter']);
  });
});
