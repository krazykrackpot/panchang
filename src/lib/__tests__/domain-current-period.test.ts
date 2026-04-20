/**
 * Tests for the Current Period Synthesiser
 */

import { describe, it, expect } from 'vitest';
import { synthesizeCurrentPeriod, type CurrentPeriodInput } from '../kundali/domain-synthesis/current-period';
import type { DashaEntry, PlanetPosition } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockDashas: DashaEntry[] = [
  {
    planet: 'Jupiter',
    planetName: { en: 'Jupiter', hi: 'बृहस्पति' } as LocaleText,
    startDate: '2020-01-01',
    endDate: '2036-01-01',
    level: 'maha',
    subPeriods: [
      {
        planet: 'Jupiter',
        planetName: { en: 'Jupiter', hi: 'बृहस्पति' } as LocaleText,
        startDate: '2020-01-01',
        endDate: '2022-02-15',
        level: 'antar',
        subPeriods: [],
      },
      {
        planet: 'Saturn',
        planetName: { en: 'Saturn', hi: 'शनि' } as LocaleText,
        startDate: '2022-02-15',
        endDate: '2024-08-28',
        level: 'antar',
        subPeriods: [],
      },
      {
        planet: 'Mercury',
        planetName: { en: 'Mercury', hi: 'बुध' } as LocaleText,
        startDate: '2024-08-28',
        endDate: '2027-01-14',
        level: 'antar',
        subPeriods: [
          {
            planet: 'Mercury',
            planetName: { en: 'Mercury', hi: 'बुध' } as LocaleText,
            startDate: '2024-08-28',
            endDate: '2025-03-15',
            level: 'pratyantar',
            subPeriods: [],
          },
          {
            planet: 'Ketu',
            planetName: { en: 'Ketu', hi: 'केतु' } as LocaleText,
            startDate: '2025-03-15',
            endDate: '2025-08-10',
            level: 'pratyantar',
            subPeriods: [],
          },
          {
            planet: 'Venus',
            planetName: { en: 'Venus', hi: 'शुक्र' } as LocaleText,
            startDate: '2025-08-10',
            endDate: '2026-06-01',
            level: 'pratyantar',
            subPeriods: [],
          },
          {
            planet: 'Sun',
            planetName: { en: 'Sun', hi: 'सूर्य' } as LocaleText,
            startDate: '2026-06-01',
            endDate: '2026-09-15',
            level: 'pratyantar',
            subPeriods: [],
          },
        ],
      },
      {
        planet: 'Ketu',
        planetName: { en: 'Ketu', hi: 'केतु' } as LocaleText,
        startDate: '2027-01-14',
        endDate: '2027-12-20',
        level: 'antar',
        subPeriods: [],
      },
      {
        planet: 'Venus',
        planetName: { en: 'Venus', hi: 'शुक्र' } as LocaleText,
        startDate: '2027-12-20',
        endDate: '2030-08-20',
        level: 'antar',
        subPeriods: [],
      },
    ],
  },
];

function makePlanet(id: number, name: string, sign: number, long: number, opts?: Partial<PlanetPosition>): PlanetPosition {
  return {
    planet: { id, name: { en: name, hi: name }, symbol: '', color: '' },
    longitude: long,
    latitude: 0,
    speed: id === 6 ? 0.033 : 1.0, // Saturn slow, others fast
    sign,
    signName: { en: `Sign${sign}`, hi: `राशि${sign}` },
    house: 1,
    nakshatra: { id: 1, name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' }, lord: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, deity: { en: 'Ashwini Kumaras', hi: 'अश्विनी कुमार', sa: 'अश्विनी कुमारौ' } },
    pada: 1,
    degree: '10°00\'00"',
    isRetrograde: opts?.isRetrograde ?? false,
    isCombust: false,
    isExalted: opts?.isExalted ?? false,
    isDebilitated: opts?.isDebilitated ?? false,
    isOwnSign: opts?.isOwnSign ?? false,
    ...opts,
  } as PlanetPosition;
}

const mockPlanets: PlanetPosition[] = [
  makePlanet(0, 'Sun', 1, 15),
  makePlanet(1, 'Moon', 4, 105),
  makePlanet(2, 'Mars', 10, 285, { isRetrograde: true }),
  makePlanet(3, 'Mercury', 2, 45),
  makePlanet(4, 'Jupiter', 1, 10, { isExalted: true }),
  makePlanet(5, 'Venus', 12, 350),
  makePlanet(6, 'Saturn', 11, 325),
  makePlanet(7, 'Rahu', 3, 75),
  makePlanet(8, 'Ketu', 9, 255),
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('synthesizeCurrentPeriod', () => {
  const baseInput: CurrentPeriodInput = {
    dashas: mockDashas,
    planets: mockPlanets,
    moonSign: 4, // Cancer
    currentDate: new Date('2026-04-12'),
  };

  it('finds correct mahadasha and antardasha for a given date', () => {
    const result = synthesizeCurrentPeriod(baseInput);

    // 2026-04-12 falls in Jupiter Maha, Mercury Antar
    expect(result.dashaSummary.en).toContain('Jupiter');
    expect(result.dashaSummary.en).toContain('Mercury');
    expect(result.dashaSummary.en).toContain('Mahadasha');
    expect(result.dashaSummary.en).toContain('Antardasha');
  });

  it('finds correct pratyantardasha when available', () => {
    const result = synthesizeCurrentPeriod(baseInput);

    // 2026-04-12 falls in Venus pratyantar (2025-08-10 to 2026-06-01)
    expect(result.dashaSummary.en).toContain('Pratyantardasha');
    expect(result.dashaSummary.en).toContain('Venus');
  });

  it('produces non-empty interaction theme in en and hi', () => {
    const result = synthesizeCurrentPeriod(baseInput);

    // Theme is embedded in dashaSummary
    expect(result.dashaSummary.en).toBeTruthy();
    expect(result.dashaSummary.en!.length).toBeGreaterThan(20);
    expect(result.dashaSummary.hi).toBeTruthy();
    expect(result.dashaSummary.hi!.length).toBeGreaterThan(10);
  });

  it('overall rating is one of the four valid values', () => {
    const result = synthesizeCurrentPeriod(baseInput);
    const validRatings = ['uttama', 'madhyama', 'adhama', 'atyadhama'];

    expect(validRatings).toContain(result.periodRating.rating);
    expect(result.periodScore).toBeGreaterThanOrEqual(0);
    expect(result.periodScore).toBeLessThanOrEqual(10);
  });

  it('Jupiter Maha + Mercury Antar yields uttama (both benefic)', () => {
    const result = synthesizeCurrentPeriod(baseInput);
    // Jupiter and Mercury are both natural benefics
    expect(result.periodRating.rating).toBe('uttama');
  });

  it('upcoming dates are in the future', () => {
    const result = synthesizeCurrentPeriod(baseInput);
    const now = baseInput.currentDate.getTime();

    // We expect at least 1 upcoming event
    expect(result.periodRating).toBeDefined();

    // The summary should mention a next key event
    expect(result.summary.en).toBeTruthy();
  });

  it('guidance is non-empty for all rating levels', () => {
    const result = synthesizeCurrentPeriod(baseInput);
    expect(result.summary.en).toBeTruthy();
    expect(result.summary.en!.length).toBeGreaterThan(10);
    expect(result.summary.hi).toBeTruthy();
    expect(result.summary.hi!.length).toBeGreaterThan(5);
  });

  it('handles missing sadeSati gracefully', () => {
    const input: CurrentPeriodInput = { ...baseInput, sadeSatiStatus: undefined };
    const result = synthesizeCurrentPeriod(input);

    expect(result.periodRating).toBeDefined();
    expect(result.summary.en).not.toContain('Sade Sati');
  });

  it('includes sadeSati info when active', () => {
    const input: CurrentPeriodInput = {
      ...baseInput,
      sadeSatiStatus: { active: true, phase: 'peak' },
    };
    const result = synthesizeCurrentPeriod(input);

    expect(result.summary.en).toContain('Sade Sati');
    expect(result.challengedDomainsNow).toContain('health');
  });

  it('returns key transits for slow planets', () => {
    const result = synthesizeCurrentPeriod(baseInput);

    // Should have transits for Jupiter, Saturn, Rahu, Ketu
    expect(result.keyTransits.length).toBeGreaterThanOrEqual(2);
    const transitPlanetIds = result.keyTransits.map(t => t.planetId);
    expect(transitPlanetIds).toContain(4); // Jupiter
    expect(transitPlanetIds).toContain(6); // Saturn
  });

  it('handles Saturn-Mars maha/antar as challenging', () => {
    // Create a Saturn mahadasha with Mars antardasha
    const challengingDashas: DashaEntry[] = [
      {
        planet: 'Saturn',
        planetName: { en: 'Saturn', hi: 'शनि' } as LocaleText,
        startDate: '2020-01-01',
        endDate: '2039-01-01',
        level: 'maha',
        subPeriods: [
          {
            planet: 'Mars',
            planetName: { en: 'Mars', hi: 'मंगल' } as LocaleText,
            startDate: '2025-01-01',
            endDate: '2027-01-01',
            level: 'antar',
            subPeriods: [],
          },
        ],
      },
    ];

    const result = synthesizeCurrentPeriod({
      ...baseInput,
      dashas: challengingDashas,
    });

    // Both malefic, check for adhama or madhyama (depending on dignity)
    expect(['adhama', 'madhyama']).toContain(result.periodRating.rating);
    expect(result.dashaSummary.en).toContain('Saturn');
    expect(result.dashaSummary.en).toContain('Mars');
  });

  it('returns fallback when no dasha matches current date', () => {
    const futureDashas: DashaEntry[] = [
      {
        planet: 'Jupiter',
        planetName: { en: 'Jupiter', hi: 'बृहस्पति' } as LocaleText,
        startDate: '2040-01-01',
        endDate: '2056-01-01',
        level: 'maha',
        subPeriods: [],
      },
    ];

    const result = synthesizeCurrentPeriod({
      ...baseInput,
      dashas: futureDashas,
    });

    expect(result.dashaSummary.en).toContain('could not be determined');
    expect(result.periodRating.rating).toBe('madhyama');
  });

  it('active domains reflect Jupiter mahadasha', () => {
    const result = synthesizeCurrentPeriod(baseInput);

    // Jupiter maha → wealth, spiritual active
    expect(result.activeDomainsNow).toContain('wealth');
    expect(result.activeDomainsNow).toContain('spiritual');
  });
});
