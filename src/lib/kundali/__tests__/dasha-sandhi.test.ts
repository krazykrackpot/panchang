import { describe, it, expect } from 'vitest';
import { findDashaSandhiPeriods } from '@/lib/kundali/dasha-sandhi';
import type { DashaEntry } from '@/types/kundali';

function makeDasha(planet: string, start: string, end: string): DashaEntry {
  return {
    planet,
    planetName: { en: planet, hi: planet, sa: planet },
    startDate: start,
    endDate: end,
    level: 'maha',
  };
}

// Helper: parse ISO date and return Date
function d(iso: string) {
  return new Date(iso);
}

describe('findDashaSandhiPeriods', () => {
  it('returns one less than maha dasha count', () => {
    const dashas = [
      makeDasha('Sun', '2000-01-01', '2006-01-01'),
      makeDasha('Moon', '2006-01-01', '2016-01-01'),
      makeDasha('Mars', '2016-01-01', '2023-01-01'),
    ];
    const periods = findDashaSandhiPeriods(dashas);
    expect(periods).toHaveLength(2);
  });

  it('sandhi start is before transition date', () => {
    const dashas = [
      makeDasha('Sun', '2000-01-01', '2006-01-01'),
      makeDasha('Moon', '2006-01-01', '2016-01-01'),
    ];
    const [period] = findDashaSandhiPeriods(dashas);
    expect(d(period.sandhiStart) < d(period.transitionDate)).toBe(true);
  });

  it('sandhi end is after transition date', () => {
    const dashas = [
      makeDasha('Sun', '2000-01-01', '2006-01-01'),
      makeDasha('Moon', '2006-01-01', '2016-01-01'),
    ];
    const [period] = findDashaSandhiPeriods(dashas);
    expect(d(period.sandhiEnd) > d(period.transitionDate)).toBe(true);
  });

  it('transition date equals outgoing end date', () => {
    const dashas = [
      makeDasha('Sun', '2000-01-01', '2006-01-01'),
      makeDasha('Moon', '2006-01-01', '2016-01-01'),
    ];
    const [period] = findDashaSandhiPeriods(dashas);
    expect(period.transitionDate).toBe('2006-01-01');
  });

  it('duration is approximately 10% + 10% of adjacent dashas', () => {
    // Sun dasha: 6 years ≈ 2191.5 days — 10% ≈ 219.15 days
    // Moon dasha: 10 years ≈ 3652.5 days — 10% ≈ 365.25 days
    // Total sandhi ≈ 584.4 days ≈ 19.2 months
    const dashas = [
      makeDasha('Sun', '2000-01-01', '2006-01-01'),
      makeDasha('Moon', '2006-01-01', '2016-01-01'),
    ];
    const [period] = findDashaSandhiPeriods(dashas);
    // Tolerance: within 2 months of expected
    expect(period.durationMonths).toBeGreaterThan(15);
    expect(period.durationMonths).toBeLessThan(25);
  });

  it('friendly transition (Sun → Moon) → mild', () => {
    const dashas = [
      makeDasha('Sun', '2000-01-01', '2006-01-01'),
      makeDasha('Moon', '2006-01-01', '2016-01-01'),
    ];
    const [period] = findDashaSandhiPeriods(dashas);
    expect(period.intensity).toBe('mild');
  });

  it('enemy transition (Jupiter → Venus) → intense', () => {
    const dashas = [
      makeDasha('Jupiter', '2000-01-01', '2016-01-01'),
      makeDasha('Venus', '2016-01-01', '2036-01-01'),
    ];
    const [period] = findDashaSandhiPeriods(dashas);
    expect(period.intensity).toBe('intense');
  });

  it('enemy transition (Saturn → Sun) → intense', () => {
    const dashas = [
      makeDasha('Saturn', '2000-01-01', '2019-01-01'),
      makeDasha('Sun', '2019-01-01', '2025-01-01'),
    ];
    const [period] = findDashaSandhiPeriods(dashas);
    expect(period.intensity).toBe('intense');
  });

  it('neutral transition (Mars → Saturn) → moderate', () => {
    // Mars friends: Sun, Moon, Jupiter — Saturn is not friend or enemy of Mars
    const dashas = [
      makeDasha('Mars', '2000-01-01', '2007-01-01'),
      makeDasha('Saturn', '2007-01-01', '2026-01-01'),
    ];
    const [period] = findDashaSandhiPeriods(dashas);
    expect(period.intensity).toBe('moderate');
  });

  it('ignores non-maha entries (antar and pratyantar)', () => {
    const antarDasha: DashaEntry = {
      planet: 'Rahu',
      planetName: { en: 'Rahu', hi: 'Rahu', sa: 'Rahu' },
      startDate: '2000-01-01',
      endDate: '2001-01-01',
      level: 'antar',
    };
    const pratyantarDasha: DashaEntry = {
      planet: 'Ketu',
      planetName: { en: 'Ketu', hi: 'Ketu', sa: 'Ketu' },
      startDate: '2000-01-01',
      endDate: '2000-03-01',
      level: 'pratyantar',
    };
    const mahaDashas = [
      makeDasha('Sun', '2000-01-01', '2006-01-01'),
      makeDasha('Moon', '2006-01-01', '2016-01-01'),
    ];
    // Mix in antar/pratyantar entries
    const mixed = [antarDasha, mahaDashas[0], pratyantarDasha, mahaDashas[1]];
    const periods = findDashaSandhiPeriods(mixed);
    // Only 2 maha dashas → 1 sandhi period
    expect(periods).toHaveLength(1);
    expect(periods[0].outgoingPlanet).toBe('Sun');
    expect(periods[0].incomingPlanet).toBe('Moon');
  });

  it('empty input returns empty array', () => {
    expect(findDashaSandhiPeriods([])).toEqual([]);
  });

  it('single maha dasha returns empty array', () => {
    const dashas = [makeDasha('Sun', '2000-01-01', '2006-01-01')];
    expect(findDashaSandhiPeriods(dashas)).toEqual([]);
  });

  it('description is non-empty string for each intensity', () => {
    const pairs: Array<[string, string, string]> = [
      ['Sun', 'Moon', 'mild'],     // friendly
      ['Jupiter', 'Venus', 'intense'], // enemy
      ['Mars', 'Saturn', 'moderate'],  // neutral
    ];
    for (const [outgoing, incoming] of pairs) {
      const dashas = [
        makeDasha(outgoing, '2000-01-01', '2010-01-01'),
        makeDasha(incoming, '2010-01-01', '2020-01-01'),
      ];
      const [period] = findDashaSandhiPeriods(dashas);
      expect(typeof period.description).toBe('string');
      expect(period.description.length).toBeGreaterThan(0);
    }
  });

  it('includes correct planet names in result', () => {
    const dashas = [
      makeDasha('Jupiter', '2000-01-01', '2016-01-01'),
      makeDasha('Saturn', '2016-01-01', '2035-01-01'),
    ];
    const [period] = findDashaSandhiPeriods(dashas);
    expect(period.outgoingPlanet).toBe('Jupiter');
    expect(period.incomingPlanet).toBe('Saturn');
    expect(period.outgoingPlanetName.en).toBe('Jupiter');
    expect(period.incomingPlanetName.en).toBe('Saturn');
  });
});
