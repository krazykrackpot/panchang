import { describe, it, expect } from 'vitest';
import {
  calculateAshtottariDashas,
  isAshtottariApplicable,
  ASHTOTTARI_SEQUENCE,
  TOTAL_ASHTOTTARI_YEARS,
  NAKSHATRA_TO_LORD_INDEX,
} from '@/lib/kundali/ashtottari-dasha';

describe('Ashtottari Dasha System', () => {
  describe('Sequence validation', () => {
    it('should have exactly 8 planets', () => {
      expect(ASHTOTTARI_SEQUENCE).toHaveLength(8);
    });

    it('should total 108 years', () => {
      const total = ASHTOTTARI_SEQUENCE.reduce((sum, d) => sum + d.years, 0);
      expect(total).toBe(108);
      expect(TOTAL_ASHTOTTARI_YEARS).toBe(108);
    });

    it('should exclude Rahu from the sequence', () => {
      const planets = ASHTOTTARI_SEQUENCE.map(d => d.planet);
      expect(planets).not.toContain('Rahu');
    });

    it('should include Ketu in the sequence', () => {
      const planets = ASHTOTTARI_SEQUENCE.map(d => d.planet);
      expect(planets).toContain('Ketu');
    });

    it('should have the correct planet order', () => {
      const planets = ASHTOTTARI_SEQUENCE.map(d => d.planet);
      expect(planets).toEqual(['Sun', 'Moon', 'Mars', 'Mercury', 'Saturn', 'Jupiter', 'Venus', 'Ketu']);
    });

    it('should have the correct year assignments', () => {
      const yearMap = Object.fromEntries(ASHTOTTARI_SEQUENCE.map(d => [d.planet, d.years]));
      expect(yearMap).toEqual({
        Sun: 6, Moon: 15, Mars: 8, Mercury: 17,
        Saturn: 10, Jupiter: 19, Venus: 21, Ketu: 12,
      });
    });
  });

  describe('Nakshatra-to-lord mapping', () => {
    it('should have 27 entries', () => {
      expect(NAKSHATRA_TO_LORD_INDEX).toHaveLength(27);
    });

    it('should map Ardra (index 5) to Sun (index 0)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[5]).toBe(0); // Sun
    });

    it('should map Punarvasu (index 6) to Sun (index 0)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[6]).toBe(0);
    });

    it('should map Pushya (index 7) to Sun (index 0)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[7]).toBe(0);
    });

    it('should map Ashlesha (index 8) to Moon (index 1)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[8]).toBe(1);
    });

    it('should map Magha (index 9) to Moon (index 1)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[9]).toBe(1);
    });

    it('should map U.Phalguni (index 11) to Mars (index 2)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[11]).toBe(2);
    });

    it('should map Swati (index 14) to Mercury (index 3)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[14]).toBe(3);
    });

    it('should map Jyeshtha (index 17) to Saturn (index 4)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[17]).toBe(4);
    });

    it('should map U.Ashadha (index 20) to Jupiter (index 5)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[20]).toBe(5);
    });

    it('should map Shatabhisha (index 23) to Venus (index 6)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[23]).toBe(6);
    });

    it('should map Revati (index 26) to Ketu (index 7)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[26]).toBe(7);
    });

    it('should map Ashwini (index 0) to Ketu (index 7)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[0]).toBe(7);
    });

    it('should map Bharani (index 1) to Ketu (index 7)', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[1]).toBe(7);
    });

    it('should map Krittika (index 2) to Sun (index 0) — cycle wrap', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[2]).toBe(0);
    });

    it('should map Rohini (index 3) to Sun (index 0) — cycle wrap', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[3]).toBe(0);
    });

    it('should map Mrigashira (index 4) to Sun (index 0) — cycle wrap', () => {
      expect(NAKSHATRA_TO_LORD_INDEX[4]).toBe(0);
    });
  });

  describe('calculateAshtottariDashas', () => {
    const birthDate = new Date(2000, 0, 1); // Jan 1, 2000

    it('should return exactly 8 Mahadasha periods', () => {
      const dashas = calculateAshtottariDashas(5, 0, birthDate); // Ardra, start of nakshatra
      expect(dashas).toHaveLength(8);
    });

    it('should start with the correct lord for Ardra nakshatra', () => {
      // Ardra (index 5) → Sun
      const dashas = calculateAshtottariDashas(5, 0, birthDate);
      expect(dashas[0].planet).toBe('Sun');
    });

    it('should start with the correct lord for Ashwini nakshatra', () => {
      // Ashwini (index 0) → Ketu
      const dashas = calculateAshtottariDashas(0, 0, birthDate);
      expect(dashas[0].planet).toBe('Ketu');
    });

    it('should start with the correct lord for Ashlesha nakshatra', () => {
      // Ashlesha (index 8) → Moon
      const dashas = calculateAshtottariDashas(8, 0, birthDate);
      expect(dashas[0].planet).toBe('Moon');
    });

    it('should have a partial first dasha when Moon is partway through nakshatra', () => {
      const nakshatraSpan = 360 / 27;
      const halfwayDegree = nakshatraSpan / 2;
      // Ardra → Sun (6 years full), halfway → ~3 years remaining
      const dashas = calculateAshtottariDashas(5, halfwayDegree, birthDate);
      expect(dashas[0].planet).toBe('Sun');
      // First dasha should be approximately half of 6 years
      const startMs = new Date(dashas[0].startDate).getTime();
      const endMs = new Date(dashas[0].endDate).getTime();
      const durationYears = (endMs - startMs) / (365.25 * 24 * 60 * 60 * 1000);
      expect(durationYears).toBeCloseTo(3, 0);
    });

    it('should have full duration for the first dasha when Moon is at nakshatra start', () => {
      // Ardra start → full Sun dasha (6 years)
      const dashas = calculateAshtottariDashas(5, 0, birthDate);
      const startMs = new Date(dashas[0].startDate).getTime();
      const endMs = new Date(dashas[0].endDate).getTime();
      const durationYears = (endMs - startMs) / (365.25 * 24 * 60 * 60 * 1000);
      expect(durationYears).toBeCloseTo(6, 1);
    });

    it('should produce consecutive non-overlapping periods', () => {
      const dashas = calculateAshtottariDashas(5, 3, birthDate);
      for (let i = 1; i < dashas.length; i++) {
        expect(dashas[i].startDate).toBe(dashas[i - 1].endDate);
      }
    });

    it('should have all periods with valid ISO date strings', () => {
      const dashas = calculateAshtottariDashas(5, 0, birthDate);
      for (const d of dashas) {
        expect(d.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(d.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(isNaN(new Date(d.startDate).getTime())).toBe(false);
        expect(isNaN(new Date(d.endDate).getTime())).toBe(false);
      }
    });

    it('should have all periods with level "maha"', () => {
      const dashas = calculateAshtottariDashas(5, 0, birthDate);
      for (const d of dashas) {
        expect(d.level).toBe('maha');
      }
    });

    it('should include planetName with en/hi/sa keys', () => {
      const dashas = calculateAshtottariDashas(5, 0, birthDate);
      for (const d of dashas) {
        expect(d.planetName).toBeDefined();
        expect(d.planetName.en).toBeTruthy();
        expect(d.planetName.hi).toBeTruthy();
        expect(d.planetName.sa).toBeTruthy();
      }
    });
  });

  describe('Sub-period generation', () => {
    const birthDate = new Date(2000, 0, 1);

    it('should generate 8 Antardasha sub-periods per Mahadasha', () => {
      const dashas = calculateAshtottariDashas(5, 0, birthDate);
      for (const maha of dashas) {
        expect(maha.subPeriods).toBeDefined();
        expect(maha.subPeriods).toHaveLength(8);
      }
    });

    it('Antardasha durations should sum to Mahadasha duration', () => {
      const dashas = calculateAshtottariDashas(5, 0, birthDate);
      for (const maha of dashas) {
        const mahaStart = new Date(maha.startDate).getTime();
        const mahaEnd = new Date(maha.endDate).getTime();
        const mahaDuration = mahaEnd - mahaStart;

        const antarStart = new Date(maha.subPeriods![0].startDate).getTime();
        const antarEnd = new Date(maha.subPeriods![maha.subPeriods!.length - 1].endDate).getTime();
        const antarDuration = antarEnd - antarStart;

        // Allow 1 day tolerance due to floating-point date arithmetic
        expect(Math.abs(mahaDuration - antarDuration)).toBeLessThan(24 * 60 * 60 * 1000);
      }
    });

    it('Antardasha sub-periods should be consecutive', () => {
      const dashas = calculateAshtottariDashas(5, 0, birthDate);
      for (const maha of dashas) {
        for (let i = 1; i < maha.subPeriods!.length; i++) {
          expect(maha.subPeriods![i].startDate).toBe(maha.subPeriods![i - 1].endDate);
        }
      }
    });

    it('Antardasha should have level "antar"', () => {
      const dashas = calculateAshtottariDashas(5, 0, birthDate);
      for (const maha of dashas) {
        for (const antar of maha.subPeriods!) {
          expect(antar.level).toBe('antar');
        }
      }
    });

    it('should generate 8 Pratyantardasha sub-periods per Antardasha', () => {
      const dashas = calculateAshtottariDashas(5, 0, birthDate);
      // Check first Mahadasha's first Antardasha
      const firstMaha = dashas[0];
      const firstAntar = firstMaha.subPeriods![0];
      expect(firstAntar.subPeriods).toBeDefined();
      expect(firstAntar.subPeriods).toHaveLength(8);
    });

    it('Pratyantardasha should have level "pratyantar"', () => {
      const dashas = calculateAshtottariDashas(5, 0, birthDate);
      const pratyantar = dashas[0].subPeriods![0].subPeriods!;
      for (const p of pratyantar) {
        expect(p.level).toBe('pratyantar');
      }
    });
  });

  describe('isAshtottariApplicable', () => {
    it('should return true for Krishna Paksha (Moon-Sun diff > 180)', () => {
      // Sun at 0, Moon at 200 → diff = 200 > 180 → Krishna Paksha
      expect(isAshtottariApplicable(0, 200)).toBe(true);
    });

    it('should return false for Shukla Paksha (Moon-Sun diff < 180)', () => {
      // Sun at 0, Moon at 90 → diff = 90 < 180 → Shukla Paksha
      expect(isAshtottariApplicable(0, 90)).toBe(false);
    });

    it('should return false when Moon-Sun diff is exactly 180 (Full Moon)', () => {
      expect(isAshtottariApplicable(0, 180)).toBe(false);
    });

    it('should return true for diff just past 180', () => {
      expect(isAshtottariApplicable(0, 181)).toBe(true);
    });

    it('should handle wrap-around correctly (Moon before Sun in zodiac)', () => {
      // Sun at 350, Moon at 10 → diff = (10-350+360)%360 = 20 → Shukla
      expect(isAshtottariApplicable(350, 10)).toBe(false);
    });

    it('should handle wrap-around for Krishna Paksha', () => {
      // Sun at 10, Moon at 200 → diff = 190 > 180 → Krishna
      expect(isAshtottariApplicable(10, 200)).toBe(true);
    });

    it('should return true near New Moon (diff ~ 350)', () => {
      // Sun at 100, Moon at 90 → diff = (90-100+360)%360 = 350 > 180 → Krishna
      expect(isAshtottariApplicable(100, 90)).toBe(true);
    });
  });

  describe('Total coverage', () => {
    it('all 8 dashas from nakshatra start should sum to ~108 years', () => {
      const birthDate = new Date(2000, 0, 1);
      const dashas = calculateAshtottariDashas(5, 0, birthDate);
      const firstStart = new Date(dashas[0].startDate).getTime();
      const lastEnd = new Date(dashas[dashas.length - 1].endDate).getTime();
      const totalYears = (lastEnd - firstStart) / (365.25 * 24 * 60 * 60 * 1000);
      expect(totalYears).toBeCloseTo(108, 0);
    });

    it('partial first dasha should still yield ~108 years total', () => {
      const birthDate = new Date(2000, 0, 1);
      const nakshatraSpan = 360 / 27;
      // 3/4 through nakshatra → first dasha is 1/4 of its full period
      const dashas = calculateAshtottariDashas(5, nakshatraSpan * 0.75, birthDate);
      const firstStart = new Date(dashas[0].startDate).getTime();
      const lastEnd = new Date(dashas[dashas.length - 1].endDate).getTime();
      const totalYears = (lastEnd - firstStart) / (365.25 * 24 * 60 * 60 * 1000);
      // Should be 108 - 0.75 * 6 = 103.5 years
      expect(totalYears).toBeCloseTo(103.5, 0);
    });
  });
});
