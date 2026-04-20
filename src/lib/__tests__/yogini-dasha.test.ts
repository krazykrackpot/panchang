/**
 * Tests for Yogini Dasha engine
 * Validates: sequence, nakshatra mapping, balance calculation,
 * sub-period generation, date continuity, and cycle behavior.
 */
import { describe, it, expect } from 'vitest';
import {
  calculateYoginiDashas,
  getYoginiLordIndex,
  YOGINI_SEQUENCE,
  TOTAL_YOGINI_YEARS,
} from '@/lib/kundali/yogini-dasha';

describe('Yogini Dasha', () => {
  describe('YOGINI_SEQUENCE', () => {
    it('should have 8 yoginis totaling 36 years', () => {
      expect(YOGINI_SEQUENCE).toHaveLength(8);
      const totalYears = YOGINI_SEQUENCE.reduce((sum, y) => sum + y.years, 0);
      expect(totalYears).toBe(36);
      expect(TOTAL_YOGINI_YEARS).toBe(36);
    });

    it('should have correct yogini-planet-year mappings', () => {
      const expected = [
        { yogini: 'Mangala', planet: 'Moon', years: 1 },
        { yogini: 'Pingala', planet: 'Sun', years: 2 },
        { yogini: 'Dhanya', planet: 'Jupiter', years: 3 },
        { yogini: 'Bhramari', planet: 'Mars', years: 4 },
        { yogini: 'Bhadrika', planet: 'Mercury', years: 5 },
        { yogini: 'Ulka', planet: 'Saturn', years: 6 },
        { yogini: 'Siddha', planet: 'Venus', years: 7 },
        { yogini: 'Sankata', planet: 'Rahu', years: 8 },
      ];
      expected.forEach((exp, i) => {
        expect(YOGINI_SEQUENCE[i].yogini).toBe(exp.yogini);
        expect(YOGINI_SEQUENCE[i].planet).toBe(exp.planet);
        expect(YOGINI_SEQUENCE[i].years).toBe(exp.years);
      });
    });
  });

  describe('getYoginiLordIndex', () => {
    it('Ashwini (0) -> Mangala (index 0)', () => {
      expect(getYoginiLordIndex(0)).toBe(0);
    });

    it('Bharani (1) -> Pingala (index 1)', () => {
      expect(getYoginiLordIndex(1)).toBe(1);
    });

    it('Krittika (2) -> Dhanya (index 2)', () => {
      expect(getYoginiLordIndex(2)).toBe(2);
    });

    it('Rohini (3) -> Bhramari (index 3)', () => {
      expect(getYoginiLordIndex(3)).toBe(3);
    });

    it('Mrigashira (4) -> Bhadrika (index 4)', () => {
      expect(getYoginiLordIndex(4)).toBe(4);
    });

    it('Ardra (5) -> Ulka (index 5)', () => {
      expect(getYoginiLordIndex(5)).toBe(5);
    });

    it('Punarvasu (6) -> Siddha (index 6)', () => {
      expect(getYoginiLordIndex(6)).toBe(6);
    });

    it('Pushya (7) -> Sankata (index 7)', () => {
      expect(getYoginiLordIndex(7)).toBe(7);
    });

    it('Ashlesha (8) -> wraps back to Mangala (index 0)', () => {
      expect(getYoginiLordIndex(8)).toBe(0);
    });

    it('Magha (9) -> Mangala (index 0) — second cycle', () => {
      expect(getYoginiLordIndex(9)).toBe(0);
    });

    it('P.Phalguni (10) -> Pingala (index 1)', () => {
      expect(getYoginiLordIndex(10)).toBe(1);
    });

    it('Jyeshtha (17) -> wraps to Mangala (index 0)', () => {
      expect(getYoginiLordIndex(17)).toBe(0);
    });

    it('Moola (18) -> Mangala (index 0) — third cycle', () => {
      expect(getYoginiLordIndex(18)).toBe(0);
    });

    it('Revati (26) -> wraps to Mangala (index 0)', () => {
      expect(getYoginiLordIndex(26)).toBe(0);
    });

    it('U.Bhadrapada (25) -> Sankata (index 7)', () => {
      expect(getYoginiLordIndex(25)).toBe(7);
    });

    it('all 27 nakshatras map correctly', () => {
      // Expected mapping: groups of 9, indices 0-7, with 8 wrapping to 0
      const expected = [0,1,2,3,4,5,6,7,0, 0,1,2,3,4,5,6,7,0, 0,1,2,3,4,5,6,7,0];
      for (let i = 0; i < 27; i++) {
        expect(getYoginiLordIndex(i)).toBe(expected[i]);
      }
    });
  });

  describe('calculateYoginiDashas', () => {
    // Use UTC noon to avoid timezone offset issues with toISOString()
    const birthDate = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));

    it('should return exactly 8 Maha dasha periods', () => {
      const dashas = calculateYoginiDashas(0, 0, birthDate);
      expect(dashas).toHaveLength(8);
      dashas.forEach(d => expect(d.level).toBe('maha'));
    });

    it('first dasha starts at birth date', () => {
      const dashas = calculateYoginiDashas(0, 0, birthDate);
      expect(dashas[0].startDate).toBe('2000-01-01');
    });

    it('dasha dates are continuous (no gaps)', () => {
      const dashas = calculateYoginiDashas(5, 3.0, birthDate);
      for (let i = 1; i < dashas.length; i++) {
        expect(dashas[i].startDate).toBe(dashas[i - 1].endDate);
      }
    });

    it('full cycle from start of nakshatra should span ~36 years', () => {
      // Moon at exact start of Ashwini (degree 0) = no elapsed fraction
      const dashas = calculateYoginiDashas(0, 0, birthDate);
      const lastEnd = new Date(dashas[7].endDate);
      const diffYears = (lastEnd.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      expect(diffYears).toBeCloseTo(36, 0);
    });

    it('partial first dasha when Moon is mid-nakshatra', () => {
      const nakshatraSpan = 360 / 27;
      const halfNakshatra = nakshatraSpan / 2;
      // Ashwini -> Mangala (1yr), halfway through = 0.5yr remaining
      const dashas = calculateYoginiDashas(0, halfNakshatra, birthDate);
      const firstEnd = new Date(dashas[0].endDate);
      const firstDuration = (firstEnd.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      expect(firstDuration).toBeCloseTo(0.5, 1);
    });

    it('each maha dasha has 8 antar sub-periods', () => {
      const dashas = calculateYoginiDashas(0, 0, birthDate);
      dashas.forEach(d => {
        expect(d.subPeriods).toBeDefined();
        expect(d.subPeriods).toHaveLength(8);
        d.subPeriods!.forEach(sp => expect(sp.level).toBe('antar'));
      });
    });

    it('antar sub-periods sum to maha dasha duration', () => {
      const dashas = calculateYoginiDashas(0, 0, birthDate);
      dashas.forEach(d => {
        expect(d.subPeriods![0].startDate).toBe(d.startDate);
        expect(d.subPeriods![7].endDate).toBe(d.endDate);
      });
    });

    it('each antar dasha has 8 pratyantar sub-periods', () => {
      const dashas = calculateYoginiDashas(0, 0, birthDate);
      // Check the first maha dasha's first antar
      const antar = dashas[0].subPeriods!;
      antar.forEach(a => {
        expect(a.subPeriods).toBeDefined();
        expect(a.subPeriods).toHaveLength(8);
        a.subPeriods!.forEach(p => expect(p.level).toBe('pratyantar'));
      });
    });

    it('pratyantar sub-periods have no further sub-periods', () => {
      const dashas = calculateYoginiDashas(0, 0, birthDate);
      const pratyantar = dashas[0].subPeriods![0].subPeriods!;
      pratyantar.forEach(p => {
        expect(p.subPeriods).toBeUndefined();
      });
    });

    it('all dates are valid ISO date strings', () => {
      const dashas = calculateYoginiDashas(13, 5.0, birthDate);
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      function checkDates(entries: typeof dashas) {
        for (const d of entries) {
          expect(d.startDate).toMatch(dateRegex);
          expect(d.endDate).toMatch(dateRegex);
          expect(new Date(d.startDate).toString()).not.toBe('Invalid Date');
          expect(new Date(d.endDate).toString()).not.toBe('Invalid Date');
          if (d.subPeriods) checkDates(d.subPeriods);
        }
      }
      checkDates(dashas);
    });

    it('planetName includes yogini name in parentheses (en)', () => {
      const dashas = calculateYoginiDashas(0, 0, birthDate);
      // First dasha for Ashwini is Mangala -> Moon (Mangala)
      expect(dashas[0].planetName.en).toBe('Moon (Mangala)');
      expect(dashas[0].planetName.hi).toContain('मंगला');
    });

    it('Ashwini starts with Mangala/Moon dasha', () => {
      const dashas = calculateYoginiDashas(0, 0, birthDate);
      expect(dashas[0].planet).toBe('Moon');
      expect(dashas[0].planetName.en).toContain('Mangala');
    });

    it('Bharani starts with Pingala/Sun dasha', () => {
      const dashas = calculateYoginiDashas(1, 0, birthDate);
      expect(dashas[0].planet).toBe('Sun');
      expect(dashas[0].planetName.en).toContain('Pingala');
    });

    it('Ashlesha (8) starts with Mangala/Moon dasha (cycle wraps)', () => {
      const dashas = calculateYoginiDashas(8, 0, birthDate);
      expect(dashas[0].planet).toBe('Moon');
      expect(dashas[0].planetName.en).toContain('Mangala');
    });

    it('dasha sequence cycles correctly from starting lord', () => {
      // Start from Ulka (Saturn, index 5) for Ardra
      const dashas = calculateYoginiDashas(5, 0, birthDate);
      const expectedSequence = ['Saturn', 'Venus', 'Rahu', 'Moon', 'Sun', 'Jupiter', 'Mars', 'Mercury'];
      dashas.forEach((d, i) => {
        expect(d.planet).toBe(expectedSequence[i]);
      });
    });

    it('multiple 36-year cycles: end of one cycle aligns for next', () => {
      // With Moon at start of nakshatra, cycle is exactly 36 years
      const dashas = calculateYoginiDashas(0, 0, birthDate);
      const endOfCycle = new Date(dashas[7].endDate);
      // Start a second cycle from the end of the first
      const dashas2 = calculateYoginiDashas(0, 0, endOfCycle);
      expect(dashas2[0].startDate).toBe(dashas[7].endDate);
      const endOfCycle2 = new Date(dashas2[7].endDate);
      const totalYears = (endOfCycle2.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      expect(totalYears).toBeCloseTo(72, 0); // 2 cycles = 72 years
    });

    it('antar dasha durations are proportional to yogini years', () => {
      // For a full Ulka Maha (6 years), Mangala antar should be 1/36 * 6 = 1/6 year
      const dashas = calculateYoginiDashas(5, 0, birthDate);
      // First maha is Ulka (6 years, full since degree=0)
      const antarPeriods = dashas[0].subPeriods!;
      // First antar is Ulka itself (6 years lord), duration = 6/36 * 6 = 1.0 year
      const ulkaAntar = antarPeriods[0];
      const duration = (new Date(ulkaAntar.endDate).getTime() - new Date(ulkaAntar.startDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      expect(duration).toBeCloseTo(6 * 6 / 36, 1); // = 1.0 year
    });
  });
});
