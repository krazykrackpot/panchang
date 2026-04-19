import { describe, it, expect } from 'vitest';
import { computeNadiAmsha, calculateNadiAmsha, getKarmicTheme } from '@/lib/kundali/nadi-amsha';
import type { KundaliData, PlanetPosition } from '@/types/kundali';

describe('computeNadiAmsha', () => {
  it('computes correctly for Taurus 15° (longitude 45°)', () => {
    // 45° → signIndex=1 (Taurus, EVEN), degreeInSign=15°
    // nadiAmshaNumber = floor(15/0.2)+1 = 76
    // EVEN sign: nadiSign = 12 - ((76-1) % 12) = 12 - (75%12) = 12 - 3 = 9
    const result = computeNadiAmsha(45);
    expect(result.signIndex).toBe(1);
    expect(result.nadiAmshaNumber).toBe(76);
    expect(result.nadiSign).toBe(9); // Sagittarius
  });

  it('odd sign forward cycle: Aries amsha 1 → Aries (sign 1)', () => {
    // 0° Aries → signIndex=0 (ODD), degreeInSign=0
    // nadiAmshaNumber = floor(0/0.2)+1 = 1
    // ODD: nadiSign = ((1-1)%12)+1 = 1
    const result = computeNadiAmsha(0);
    expect(result.signIndex).toBe(0);
    expect(result.nadiAmshaNumber).toBe(1);
    expect(result.nadiSign).toBe(1); // Aries
  });

  it('odd sign forward cycle: Aries amsha 13 → Aries again (cycle repeats)', () => {
    // amsha 13 → degreeInSign = (13-1)*0.2 = 2.4°
    // nadiAmshaNumber = floor(2.4/0.2)+1 = 13
    // ODD: nadiSign = ((13-1)%12)+1 = (12%12)+1 = 0+1 = 1
    const result = computeNadiAmsha(2.4);
    expect(result.nadiAmshaNumber).toBe(13);
    expect(result.nadiSign).toBe(1); // Aries again
  });

  it('even sign reverse cycle: Taurus amsha 1 → Pisces (sign 12)', () => {
    // 30° Taurus → signIndex=1 (EVEN), degreeInSign=0
    // nadiAmshaNumber = 1
    // EVEN: nadiSign = 12 - ((1-1)%12) = 12 - 0 = 12
    const result = computeNadiAmsha(30);
    expect(result.nadiAmshaNumber).toBe(1);
    expect(result.nadiSign).toBe(12); // Pisces
  });

  it('even sign reverse cycle: Taurus amsha 2 → Aquarius (sign 11)', () => {
    // 30.2° → signIndex=1 (EVEN), degreeInSign=0.2°
    // nadiAmshaNumber = floor(0.2/0.2)+1 = 2
    // EVEN: nadiSign = 12 - ((2-1)%12) = 12 - 1 = 11
    const result = computeNadiAmsha(30.2);
    expect(result.nadiAmshaNumber).toBe(2);
    expect(result.nadiSign).toBe(11); // Aquarius
  });

  it('handles 0° exactly', () => {
    const result = computeNadiAmsha(0);
    expect(result.signIndex).toBe(0);
    expect(result.degreeInSign).toBe(0);
    expect(result.nadiAmshaNumber).toBe(1);
    expect(result.nadiSign).toBe(1);
  });

  it('handles 359.99°', () => {
    // 359.99° → signIndex=11 (Pisces, EVEN)
    // degreeInSign = 359.99 - 330 = 29.99
    // nadiAmshaNumber = floor(29.99/0.2)+1 = floor(149.95)+1 = 150
    const result = computeNadiAmsha(359.99);
    expect(result.signIndex).toBe(11);
    expect(result.nadiAmshaNumber).toBe(150);
    // EVEN: nadiSign = 12 - ((150-1)%12) = 12 - (149%12) = 12 - 5 = 7
    expect(result.nadiSign).toBe(7); // Libra
  });

  it('handles sign boundary (30° exactly = Taurus start)', () => {
    const result = computeNadiAmsha(30);
    expect(result.signIndex).toBe(1); // Taurus
    expect(result.degreeInSign).toBe(0);
    expect(result.nadiAmshaNumber).toBe(1);
  });

  it('handles negative longitude (normalizes)', () => {
    // -10° should become 350° → Pisces (signIndex=11)
    const result = computeNadiAmsha(-10);
    expect(result.signIndex).toBe(11);
  });

  it('handles longitude > 360 (normalizes)', () => {
    // 370° should become 10° → Aries
    const result = computeNadiAmsha(370);
    expect(result.signIndex).toBe(0);
    expect(result.degreeInSign).toBeCloseTo(10, 5);
  });
});

describe('calculateNadiAmsha', () => {
  const mockPlanet = (id: number, longitude: number, sign: number): PlanetPosition => ({
    planet: { id, name: { en: `Planet${id}` }, symbol: '', color: '' },
    longitude,
    latitude: 0,
    speed: 1,
    sign,
    signName: { en: 'Test' },
    house: 1,
    nakshatra: { id: 1, name: { en: 'Test' }, deity: { en: 'Test' }, ruler: 'Sun', rulerName: { en: 'Sun' }, startDeg: 0 },
    pada: 1,
    degree: '0°0\'0"',
    isRetrograde: false,
    isCombust: false,
    isExalted: false,
    isDebilitated: false,
    isOwnSign: false,
  });

  const mockChart: KundaliData = {
    birthData: { name: 'Test', date: '2026-01-01', time: '12:00', place: 'Test', lat: 46.4, lng: 6.8, timezone: 'Europe/Zurich', ayanamsha: 'lahiri' },
    ascendant: { degree: 15, sign: 1, signName: { en: 'Aries' } },
    planets: [
      mockPlanet(0, 10, 1),   // Sun in Aries
      mockPlanet(1, 45, 2),   // Moon in Taurus
      mockPlanet(2, 90, 4),   // Mars in Cancer
      mockPlanet(3, 120, 5),  // Mercury in Leo
      mockPlanet(4, 200, 7),  // Jupiter in Libra
      mockPlanet(5, 250, 9),  // Venus in Sagittarius
      mockPlanet(6, 300, 11), // Saturn in Aquarius
      mockPlanet(7, 330, 12), // Rahu in Pisces
      mockPlanet(8, 150, 6),  // Ketu in Virgo
    ],
    houses: [],
    chart: { houses: [], ascendantDeg: 15, ascendantSign: 1 },
    navamshaChart: { houses: [], ascendantDeg: 0, ascendantSign: 1 },
    dashas: [],
    shadbala: [],
    ayanamshaValue: 24.2,
    julianDay: 2460676,
  };

  it('returns positions for all 9 planets', () => {
    const result = calculateNadiAmsha(mockChart);
    expect(result.positions).toHaveLength(9);
  });

  it('returns ascendant nadi position', () => {
    const result = calculateNadiAmsha(mockChart);
    expect(result.ascendantNadi).toBeDefined();
    expect(result.ascendantNadi.planetId).toBe(-1);
    expect(result.ascendantNadi.planetName.en).toBe('Ascendant');
  });

  it('every position has a non-empty karmic theme', () => {
    const result = calculateNadiAmsha(mockChart);
    const all = [result.ascendantNadi, ...result.positions];
    for (const pos of all) {
      expect(pos.karmicTheme).toBeTruthy();
      expect(pos.karmicTheme.length).toBeGreaterThan(10);
    }
  });

  it('nadi sign is always 1-12', () => {
    const result = calculateNadiAmsha(mockChart);
    const all = [result.ascendantNadi, ...result.positions];
    for (const pos of all) {
      expect(pos.nadiSign).toBeGreaterThanOrEqual(1);
      expect(pos.nadiSign).toBeLessThanOrEqual(12);
    }
  });

  it('nadi amsha number is always 1-150', () => {
    const result = calculateNadiAmsha(mockChart);
    const all = [result.ascendantNadi, ...result.positions];
    for (const pos of all) {
      expect(pos.nadiAmshaNumber).toBeGreaterThanOrEqual(1);
      expect(pos.nadiAmshaNumber).toBeLessThanOrEqual(150);
    }
  });

  it('nadiSignName is a valid rashi name', () => {
    const result = calculateNadiAmsha(mockChart);
    for (const pos of result.positions) {
      expect(pos.nadiSignName.en).toBeTruthy();
      expect(pos.nadiSignName.en).not.toBe('?');
    }
  });
});

describe('getKarmicTheme', () => {
  it('returns a theme for every planet-sign combination', () => {
    for (let pid = 0; pid <= 8; pid++) {
      for (let sign = 1; sign <= 12; sign++) {
        const theme = getKarmicTheme(pid, sign);
        expect(theme).toBeTruthy();
        expect(theme.length).toBeGreaterThan(10);
      }
    }
  });

  it('returns a theme for ascendant (-1)', () => {
    for (let sign = 1; sign <= 12; sign++) {
      const theme = getKarmicTheme(-1, sign);
      expect(theme).toBeTruthy();
    }
  });

  it('returns fallback for unknown planet', () => {
    const theme = getKarmicTheme(99, 1);
    expect(theme).toContain('Subtle karmic imprint');
  });
});
