/**
 * Tests for Varshaphal sub-functions: Mudda Dasha, Sahams, Muntha
 */
import { describe, it, expect } from 'vitest';
import { calculateMuddaDasha } from '../mudda-dasha';
import { calculateMuntha } from '../muntha';
import { calculateSahams } from '../sahams';
import type { MuddaDashaPeriod } from '@/types/varshaphal';
import type { PlanetPosition, HouseCusp } from '@/types/kundali';

// ── Mudda Dasha ──────────────────────────────────────────────────────

describe('calculateMuddaDasha', () => {
  const solarReturnDate = new Date('2026-01-15T06:00:00Z');

  it('returns 9 or 10 periods (10th completes the starting lord\'s truncated portion)', () => {
    // With moonDegInNakshatra > 0, the first period is truncated, and a 10th period
    // for the same lord completes the solar year
    const result = calculateMuddaDasha(1, 5.0, solarReturnDate);
    expect(result.length).toBeGreaterThanOrEqual(9);
    expect(result.length).toBeLessThanOrEqual(10);
    // When moonDeg is 0 (start of nakshatra), no truncation → exactly 9
    const resultFull = calculateMuddaDasha(1, 0, solarReturnDate);
    expect(resultFull).toHaveLength(9);
  });

  it('each period has required fields', () => {
    const result = calculateMuddaDasha(10, 8.0, solarReturnDate);
    for (const period of result) {
      expect(period.planet).toBeTruthy();
      expect(period.planetName.en).toBeTruthy();
      expect(period.planetName.hi).toBeTruthy();
      expect(period.planetName.sa).toBeTruthy();
      expect(period.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(period.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof period.durationDays).toBe('number');
      expect(period.durationDays).toBeGreaterThan(0);
    }
  });

  it('periods are sequential — each starts where the previous ended', () => {
    const result = calculateMuddaDasha(5, 3.0, solarReturnDate);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].startDate).toBe(result[i - 1].endDate);
    }
  });

  it('total duration is approximately 365 days', () => {
    const result = calculateMuddaDasha(1, 0, solarReturnDate);
    const totalDays = result.reduce((sum, p) => sum + p.durationDays, 0);
    // With rounding, allow ±5 day tolerance
    expect(totalDays).toBeGreaterThanOrEqual(360);
    expect(totalDays).toBeLessThanOrEqual(370);
  });

  it('first period is shortened based on moon degree in nakshatra', () => {
    // moonDegInNakshatra = 0 means beginning of nakshatra → full first period
    const fullFirst = calculateMuddaDasha(1, 0, solarReturnDate);
    // moonDegInNakshatra close to 13.33 means nearly complete → tiny first period
    const shortFirst = calculateMuddaDasha(1, 12.0, solarReturnDate);

    expect(shortFirst[0].durationDays).toBeLessThan(fullFirst[0].durationDays);
  });

  it('first period planet is the nakshatra lord', () => {
    // Nakshatra 1 (Ashwini) → lord is Ketu
    const result1 = calculateMuddaDasha(1, 5.0, solarReturnDate);
    expect(result1[0].planet).toBe('Ketu');

    // Nakshatra 2 (Bharani) → lord is Venus
    const result2 = calculateMuddaDasha(2, 5.0, solarReturnDate);
    expect(result2[0].planet).toBe('Venus');

    // Nakshatra 3 (Krittika) → lord is Sun
    const result3 = calculateMuddaDasha(3, 5.0, solarReturnDate);
    expect(result3[0].planet).toBe('Sun');

    // Nakshatra 10 (Magha) → lord is Ketu (10 mod 9 cycles)
    const result10 = calculateMuddaDasha(10, 5.0, solarReturnDate);
    expect(result10[0].planet).toBe('Ketu');
  });

  it('covers all 9 dasha planets exactly once', () => {
    const result = calculateMuddaDasha(1, 0, solarReturnDate);
    const planets = result.map(p => p.planet);
    const expectedOrder = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    expect(new Set(planets).size).toBe(9);
    // Starting from Ketu (nakshatra 1 lord), order should follow Vimshottari sequence
    expect(planets).toEqual(expectedOrder);
  });

  it('first period starts on solar return date', () => {
    const result = calculateMuddaDasha(1, 5.0, solarReturnDate);
    expect(result[0].startDate).toBe('2026-01-15');
  });
});

// ── Muntha ───────────────────────────────────────────────────────────

describe('calculateMuntha', () => {
  it('returns valid MunthaInfo with all required fields', () => {
    const result = calculateMuntha(1, 25, 4);
    expect(result.sign).toBeGreaterThanOrEqual(1);
    expect(result.sign).toBeLessThanOrEqual(12);
    expect(result.signName.en).toBeTruthy();
    expect(result.house).toBeGreaterThanOrEqual(1);
    expect(result.house).toBeLessThanOrEqual(12);
    expect(result.interpretation.en).toBeTruthy();
    expect(result.interpretation.hi).toBeTruthy();
    expect(result.interpretation.sa).toBeTruthy();
  });

  it('muntha sign progresses one sign per year from birth lagna', () => {
    // birthLagna = 1 (Aries), age = 0 → sign = 1
    expect(calculateMuntha(1, 0, 1).sign).toBe(1);
    // age = 1 → sign = 2
    expect(calculateMuntha(1, 1, 1).sign).toBe(2);
    // age = 11 → sign = 12
    expect(calculateMuntha(1, 11, 1).sign).toBe(12);
    // age = 12 → wraps to 1
    expect(calculateMuntha(1, 12, 1).sign).toBe(1);
  });

  it('correctly wraps around after 12 years', () => {
    // birthLagna = 5 (Leo), age = 10 → (5-1+10)%12+1 = 14%12+1 = 3
    expect(calculateMuntha(5, 10, 1).sign).toBe(3);
    // birthLagna = 10, age = 25 → (9+25)%12+1 = 34%12+1 = 10+1 = 11
    expect(calculateMuntha(10, 25, 1).sign).toBe(11);
  });

  it('house is computed from varshaphal lagna', () => {
    // muntha sign = 3, varshaphal lagna = 1 → house = 3
    const result = calculateMuntha(1, 2, 1); // sign = (0+2)%12+1 = 3
    expect(result.sign).toBe(3);
    expect(result.house).toBe(3);

    // muntha sign = 1, varshaphal lagna = 4 → house = ((1-4+12)%12)+1 = 10
    const result2 = calculateMuntha(1, 0, 4); // sign = 1
    expect(result2.house).toBe(10);
  });

  it('interpretation corresponds to the house', () => {
    for (let house = 1; house <= 12; house++) {
      // Construct: birthLagna=1, age=house-1 → sign=house, varshaphalLagna=1 → house=house
      const result = calculateMuntha(1, house - 1, 1);
      expect(result.house).toBe(house);
      expect(result.interpretation.en).toContain(`${house}`);
    }
  });

  it('handles large ages correctly', () => {
    const result = calculateMuntha(1, 100, 1);
    expect(result.sign).toBeGreaterThanOrEqual(1);
    expect(result.sign).toBeLessThanOrEqual(12);
    // (0 + 100) % 12 + 1 = 4 + 1 = 5
    expect(result.sign).toBe(5);
  });
});

// ── Sahams ───────────────────────────────────────────────────────────

describe('calculateSahams', () => {
  // Mock planet positions (sidereal longitudes)
  const mockPlanets: PlanetPosition[] = [
    { planet: { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, color: '#FF6B35' }, longitude: 270.5, latitude: 0, speed: 1.0, nakshatra: 1, nakshatraPada: 1, isRetrograde: false },
    { planet: { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, color: '#C0C0C0' }, longitude: 120.3, latitude: 0, speed: 13.0, nakshatra: 1, nakshatraPada: 1, isRetrograde: false },
    { planet: { id: 2, name: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, color: '#E74C3C' }, longitude: 45.2, latitude: 0, speed: 0.5, nakshatra: 1, nakshatraPada: 1, isRetrograde: false },
    { planet: { id: 3, name: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, color: '#2ECC71' }, longitude: 285.0, latitude: 0, speed: 1.2, nakshatra: 1, nakshatraPada: 1, isRetrograde: false },
    { planet: { id: 4, name: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' }, color: '#F39C12' }, longitude: 60.7, latitude: 0, speed: 0.08, nakshatra: 1, nakshatraPada: 1, isRetrograde: false },
    { planet: { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, color: '#E91E63' }, longitude: 310.5, latitude: 0, speed: 1.1, nakshatra: 1, nakshatraPada: 1, isRetrograde: false },
    { planet: { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, color: '#607D8B' }, longitude: 330.0, latitude: 0, speed: 0.03, nakshatra: 1, nakshatraPada: 1, isRetrograde: false },
  ] as PlanetPosition[];

  // Mock house cusps (equal house from 15° Aries)
  const mockCusps: HouseCusp[] = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    degree: (15 + i * 30) % 360,
    sign: Math.floor(((15 + i * 30) % 360) / 30) + 1,
    signName: { en: `Sign${i + 1}`, hi: '', sa: '' },
  })) as HouseCusp[];

  const ascendant = 15.0; // 15° Aries

  it('returns 16 sahams', () => {
    const result = calculateSahams(ascendant, mockPlanets, mockCusps, true);
    expect(result).toHaveLength(16);
  });

  it('each saham has required fields', () => {
    const result = calculateSahams(ascendant, mockPlanets, mockCusps, true);
    for (const saham of result) {
      expect(saham.name.en).toBeTruthy();
      expect(saham.name.hi).toBeTruthy();
      expect(saham.name.sa).toBeTruthy();
      expect(typeof saham.degree).toBe('number');
      expect(saham.degree).toBeGreaterThanOrEqual(0);
      expect(saham.degree).toBeLessThan(360);
      expect(saham.sign).toBeGreaterThanOrEqual(1);
      expect(saham.sign).toBeLessThanOrEqual(12);
      expect(saham.signName.en).toBeTruthy();
      expect(saham.house).toBeGreaterThanOrEqual(1);
      expect(saham.house).toBeLessThanOrEqual(12);
    }
  });

  it('day and night births produce different results for reversible sahams', () => {
    const dayResult = calculateSahams(ascendant, mockPlanets, mockCusps, true);
    const nightResult = calculateSahams(ascendant, mockPlanets, mockCusps, false);

    // Punya Saham (index 0) uses Moon - Sun + Asc (day) vs Sun - Moon + Asc (night)
    // These should differ unless Moon = Sun
    expect(dayResult[0].degree).not.toBe(nightResult[0].degree);
  });

  it('Punya Saham formula is correct for day birth', () => {
    // Punya Saham day = Moon - Sun + Asc
    const moonLong = 120.3;
    const sunLong = 270.5;
    const expectedDeg = ((moonLong - sunLong + ascendant) % 360 + 360) % 360;
    const result = calculateSahams(ascendant, mockPlanets, mockCusps, true);
    // Allow small floating point difference
    expect(Math.abs(result[0].degree - expectedDeg)).toBeLessThan(0.01);
  });

  it('all sahams have known names', () => {
    const result = calculateSahams(ascendant, mockPlanets, mockCusps, true);
    const expectedNames = [
      'Punya Saham', 'Vidya Saham', 'Yashas Saham', 'Mitra Saham',
      'Mahatmya Saham', 'Asha Saham', 'Samartha Saham', 'Bhratri Saham',
      'Pitri Saham', 'Matri Saham', 'Putra Saham', 'Jeeva Saham',
      'Karma Saham', 'Roga Saham', 'Kali Saham', 'Bandhu Saham',
    ];
    const resultNames = result.map(s => s.name.en);
    expect(resultNames).toEqual(expectedNames);
  });

  it('degrees are always normalized to 0-360', () => {
    // Use extreme positions that could cause negative intermediate values
    const extremePlanets = mockPlanets.map(p => ({
      ...p,
      longitude: (p.longitude + 180) % 360,
    })) as PlanetPosition[];

    const result = calculateSahams(350, extremePlanets, mockCusps, true);
    for (const saham of result) {
      expect(saham.degree).toBeGreaterThanOrEqual(0);
      expect(saham.degree).toBeLessThan(360);
    }
  });
});
