import { describe, it, expect } from 'vitest';
import { analyzeGochara, analyzeDoubleTransit } from '../gochara-engine';

describe('analyzeGochara — Vedha', () => {
  const moonSign = 1; // Aries

  it('Jupiter in 2nd (good) with no vedha → isGoodHouse=true, vedhaActive=false', () => {
    // Jupiter(4) in sign 2 = house 2 from Moon. Vedha house for Jupiter-2 = 12.
    // No planet in house 12 (sign 12).
    const transits = [
      { id: 0, sign: 5 }, { id: 1, sign: 6 }, { id: 2, sign: 3 },
      { id: 3, sign: 7 }, { id: 4, sign: 2 }, { id: 5, sign: 8 }, { id: 6, sign: 9 },
    ];
    const results = analyzeGochara(transits, moonSign);
    const jup = results.find(r => r.planet === 4)!;
    expect(jup.isGoodHouse).toBe(true);
    expect(jup.vedhaActive).toBe(false);
    expect(jup.houseFromMoon).toBe(2);
  });

  it('Jupiter in 2nd (good) + Mars in 12th (vedha) → vedhaActive=true', () => {
    // Jupiter(4) in house 2, vedha house = 12. Mars(2) in sign 12 = house 12.
    const transits = [
      { id: 0, sign: 5 }, { id: 1, sign: 6 }, { id: 2, sign: 12 },
      { id: 3, sign: 7 }, { id: 4, sign: 2 }, { id: 5, sign: 8 }, { id: 6, sign: 9 },
    ];
    const results = analyzeGochara(transits, moonSign);
    const jup = results.find(r => r.planet === 4)!;
    expect(jup.isGoodHouse).toBe(true);
    expect(jup.vedhaActive).toBe(true);
    expect(jup.vedhaPlanet).toBe(2); // Mars
  });

  it('Sun-Saturn exemption: Sun in 3rd + Saturn in 9th → vedha NOT active', () => {
    // Sun(0) in house 3 (good). Vedha house = 9. Saturn(6) in house 9.
    // But Sun-Saturn exempt each other!
    const transits = [
      { id: 0, sign: 3 }, { id: 1, sign: 6 }, { id: 2, sign: 5 },
      { id: 3, sign: 7 }, { id: 4, sign: 8 }, { id: 5, sign: 10 }, { id: 6, sign: 9 },
    ];
    const results = analyzeGochara(transits, moonSign);
    const sun = results.find(r => r.planet === 0)!;
    expect(sun.isGoodHouse).toBe(true);
    expect(sun.vedhaActive).toBe(false); // exemption!
  });

  it('planet in bad house → isGoodHouse=false', () => {
    // Saturn(6) in house 2 from Moon. Saturn good houses = 3,6,11. 2 is NOT good.
    const transits = [
      { id: 0, sign: 5 }, { id: 1, sign: 6 }, { id: 2, sign: 3 },
      { id: 3, sign: 7 }, { id: 4, sign: 8 }, { id: 5, sign: 10 }, { id: 6, sign: 2 },
    ];
    const results = analyzeGochara(transits, moonSign);
    const sat = results.find(r => r.planet === 6)!;
    expect(sat.isGoodHouse).toBe(false);
    expect(sat.houseFromMoon).toBe(2);
  });
});

describe('analyzeGochara — BAV quality', () => {
  it('good house + no vedha + high BAV → strong', () => {
    const transits = [
      { id: 0, sign: 5 }, { id: 1, sign: 6 }, { id: 2, sign: 3 },
      { id: 3, sign: 7 }, { id: 4, sign: 2 }, { id: 5, sign: 8 }, { id: 6, sign: 9 },
    ];
    // BAV table: Jupiter (index 4) in sign 2 (index 1) = 5 bindus
    const bav = Array.from({ length: 7 }, () => new Array(12).fill(2));
    bav[4][1] = 5; // Jupiter in Taurus = 5
    const results = analyzeGochara(transits, 1, bav);
    const jup = results.find(r => r.planet === 4)!;
    expect(jup.bavScore).toBe(5);
    expect(jup.quality).toBe('strong');
  });

  it('good house + vedha → adverse regardless of BAV', () => {
    const transits = [
      { id: 0, sign: 5 }, { id: 1, sign: 6 }, { id: 2, sign: 12 },
      { id: 3, sign: 7 }, { id: 4, sign: 2 }, { id: 5, sign: 8 }, { id: 6, sign: 9 },
    ];
    const bav = Array.from({ length: 7 }, () => new Array(12).fill(5));
    const results = analyzeGochara(transits, 1, bav);
    const jup = results.find(r => r.planet === 4)!;
    expect(jup.quality).toBe('adverse');
  });
});

describe('analyzeDoubleTransit', () => {
  it('both Jupiter and Saturn activate house 5 → doubleTransitActive', () => {
    // Moon in Aries(1). House 5 = sign 5 (Leo).
    // Jupiter in sign 5 (directly in house 5) ✓
    // Saturn in sign 11 (Aquarius). Saturn aspects 3rd,7th,10th from itself.
    // 7th from 11 = ((11-1+6)%12)+1 = 5. Saturn aspects house 5 ✓
    const results = analyzeDoubleTransit(5, 11, 1);
    const h5 = results.find(r => r.house === 5)!;
    expect(h5.jupiterActivates).toBe(true);
    expect(h5.saturnActivates).toBe(true);
    expect(h5.doubleTransitActive).toBe(true);
  });

  it('only Jupiter activates → no double transit', () => {
    // Jupiter in sign 5 (house 5), Saturn in sign 4 (house 4)
    // Saturn aspects: 3rd from 4 = house 6, 7th from 4 = house 10, 10th from 4 = house 1.
    // Saturn does NOT aspect house 5.
    const results = analyzeDoubleTransit(5, 4, 1);
    const h5 = results.find(r => r.house === 5)!;
    expect(h5.jupiterActivates).toBe(true);
    expect(h5.saturnActivates).toBe(false);
    expect(h5.doubleTransitActive).toBe(false);
  });

  it('returns results for all 12 houses', () => {
    const results = analyzeDoubleTransit(5, 11, 1);
    expect(results).toHaveLength(12);
    expect(results.every(r => r.house >= 1 && r.house <= 12)).toBe(true);
  });
});
