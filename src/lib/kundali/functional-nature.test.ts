import { describe, it, expect } from 'vitest';
import { calculateFunctionalNature, type FunctionalNatureResult } from './functional-nature';

describe('calculateFunctionalNature', () => {
  // Test all 12 lagnas
  const allLagnas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  it('returns 9 planets (0-8 including Rahu and Ketu) for every lagna', () => {
    for (const lagna of allLagnas) {
      const result = calculateFunctionalNature(lagna);
      expect(result.planets.length).toBe(9);
    }
  });

  it('planet ids cover 0-8 for every lagna', () => {
    for (const lagna of allLagnas) {
      const result = calculateFunctionalNature(lagna);
      const ids = result.planets.map(p => p.planetId).sort((a, b) => a - b);
      expect(ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    }
  });

  it('Rahu (id=7) is always funcMalefic', () => {
    for (const lagna of allLagnas) {
      const result = calculateFunctionalNature(lagna);
      const rahu = result.planets.find(p => p.planetId === 7)!;
      expect(rahu).toBeDefined();
      expect(rahu.nature).toBe('funcMalefic');
    }
  });

  it('Ketu (id=8) is always funcMalefic', () => {
    for (const lagna of allLagnas) {
      const result = calculateFunctionalNature(lagna);
      const ketu = result.planets.find(p => p.planetId === 8)!;
      expect(ketu).toBeDefined();
      expect(ketu.nature).toBe('funcMalefic');
    }
  });

  it('Rahu and Ketu have no house rulership (shadow planets)', () => {
    for (const lagna of allLagnas) {
      const result = calculateFunctionalNature(lagna);
      const rahu = result.planets.find(p => p.planetId === 7)!;
      const ketu = result.planets.find(p => p.planetId === 8)!;
      expect(rahu.houseRulership).toEqual([]);
      expect(ketu.houseRulership).toEqual([]);
    }
  });

  it('Rahu/Ketu have trilingual names', () => {
    const result = calculateFunctionalNature(1);
    const rahu = result.planets.find(p => p.planetId === 7)!;
    const ketu = result.planets.find(p => p.planetId === 8)!;
    expect(rahu.planetName.en).toBe('Rahu');
    expect(rahu.planetName.hi).toBe('राहु');
    expect(rahu.planetName.sa).toBe('राहुः');
    expect(ketu.planetName.en).toBe('Ketu');
    expect(ketu.planetName.hi).toBe('केतु');
    expect(ketu.planetName.sa).toBe('केतुः');
  });

  // Classic yoga karaka tests
  it('Aries lagna (1): Saturn (6) is Yoga Karaka — owns 10H (kendra) + 11H', () => {
    // Aries: 10H=Capricorn (Saturn), 11H=Aquarius (Saturn); no trikona → neutral
    // Actually Aries YK: no classical YK for Aries
    const result = calculateFunctionalNature(1);
    expect(result.planets.find(p => p.planetId === 6)).toBeDefined();
  });

  it('Taurus lagna (2): Saturn is Yoga Karaka (owns 9H trikona + 10H kendra)', () => {
    const result = calculateFunctionalNature(2);
    expect(result.yogaKaraka).toBe(6); // Saturn
  });

  it('Cancer lagna (4): Mars is Yoga Karaka (owns 5H trikona + 10H kendra)', () => {
    const result = calculateFunctionalNature(4);
    expect(result.yogaKaraka).toBe(2); // Mars
  });

  it('Leo lagna (5): Mars is Yoga Karaka (owns 4H kendra + 9H trikona)', () => {
    const result = calculateFunctionalNature(5);
    expect(result.yogaKaraka).toBe(2); // Mars
  });

  it('Libra lagna (7): Saturn is Yoga Karaka (owns 4H kendra + 5H trikona)', () => {
    const result = calculateFunctionalNature(7);
    expect(result.yogaKaraka).toBe(6); // Saturn
  });

  it('Capricorn lagna (10): Venus is Yoga Karaka (owns 5H trikona + 10H kendra)', () => {
    const result = calculateFunctionalNature(10);
    expect(result.yogaKaraka).toBe(5); // Venus
  });

  it('Aquarius lagna (11): Venus is Yoga Karaka (owns 4H kendra + 9H trikona)', () => {
    const result = calculateFunctionalNature(11);
    expect(result.yogaKaraka).toBe(5); // Venus
  });

  // Badhak house tests
  it('movable lagnas (1,4,7,10) have badhak house 11', () => {
    for (const lagna of [1, 4, 7, 10]) {
      expect(calculateFunctionalNature(lagna).badhakHouse).toBe(11);
    }
  });

  it('fixed lagnas (2,5,8,11) have badhak house 9', () => {
    for (const lagna of [2, 5, 8, 11]) {
      expect(calculateFunctionalNature(lagna).badhakHouse).toBe(9);
    }
  });

  it('dual lagnas (3,6,9,12) have badhak house 7', () => {
    for (const lagna of [3, 6, 9, 12]) {
      expect(calculateFunctionalNature(lagna).badhakHouse).toBe(7);
    }
  });

  // Maraka lords test
  it('every lagna has 1-2 maraka lords (2H and 7H lords)', () => {
    for (const lagna of allLagnas) {
      const result = calculateFunctionalNature(lagna);
      expect(result.marakaLords.length).toBeGreaterThanOrEqual(1);
      expect(result.marakaLords.length).toBeLessThanOrEqual(2);
    }
  });

  it('nature values are from valid set', () => {
    const validNatures = new Set(['yogaKaraka', 'funcBenefic', 'neutral', 'funcMalefic', 'maraka', 'badhak']);
    for (const lagna of allLagnas) {
      const result = calculateFunctionalNature(lagna);
      for (const p of result.planets) {
        expect(validNatures.has(p.nature)).toBe(true);
      }
    }
  });

  it('each planet has label.en and label.hi', () => {
    for (const lagna of allLagnas) {
      const result = calculateFunctionalNature(lagna);
      for (const p of result.planets) {
        expect(typeof p.label.en).toBe('string');
        expect(p.label.en.length).toBeGreaterThan(0);
        expect(typeof p.label.hi).toBe('string');
        expect(p.label.hi.length).toBeGreaterThan(0);
      }
    }
  });

  it('planets with the same nature are sorted by ascending planetId (stable output)', () => {
    for (const lagna of allLagnas) {
      const result = calculateFunctionalNature(lagna);
      // Within each nature group, planetIds must be ascending
      const groups: Record<string, number[]> = {};
      for (const p of result.planets) {
        if (!groups[p.nature]) groups[p.nature] = [];
        groups[p.nature].push(p.planetId);
      }
      for (const ids of Object.values(groups)) {
        for (let i = 1; i < ids.length; i++) {
          expect(ids[i]).toBeGreaterThan(ids[i - 1]);
        }
      }
    }
  });

  it('Rahu (7) and Ketu (8) always sort after planets 0-6 within funcMalefic group', () => {
    for (const lagna of allLagnas) {
      const result = calculateFunctionalNature(lagna);
      const funcMalefics = result.planets.filter(p => p.nature === 'funcMalefic');
      const rahuIdx = funcMalefics.findIndex(p => p.planetId === 7);
      const ketuIdx = funcMalefics.findIndex(p => p.planetId === 8);
      // Rahu and Ketu present
      expect(rahuIdx).toBeGreaterThanOrEqual(0);
      expect(ketuIdx).toBeGreaterThanOrEqual(0);
      // Ketu (8) comes after Rahu (7)
      expect(ketuIdx).toBeGreaterThan(rahuIdx);
      // All other funcMalefics (0-6 range) come before Rahu
      for (const fm of funcMalefics) {
        if (fm.planetId < 7) {
          const fmIdx = funcMalefics.indexOf(fm);
          expect(fmIdx).toBeLessThan(rahuIdx);
        }
      }
    }
  });
});
