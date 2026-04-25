import { describe, it, expect } from 'vitest';
import {
  extractDashaForDate,
  buildDenormalizedFields,
  buildPlanetarySnapshot,
} from '@/lib/journal/snapshot';
import type { DashaEntry } from '@/types/kundali';
import type { PlanetarySnapshot } from '@/types/journal';

// ── extractDashaForDate ──────────────────────────────────────

describe('extractDashaForDate', () => {
  const timeline: DashaEntry[] = [
    {
      planet: 'Jupiter',
      planetName: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पति' },
      startDate: '2020-01-01',
      endDate: '2036-01-01',
      level: 'maha',
      subPeriods: [
        {
          planet: 'Jupiter',
          planetName: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पति' },
          startDate: '2020-01-01',
          endDate: '2022-03-01',
          level: 'antar',
        },
        {
          planet: 'Saturn',
          planetName: { en: 'Saturn', hi: 'शनि', sa: 'शनि' },
          startDate: '2022-03-01',
          endDate: '2024-10-01',
          level: 'antar',
        },
        {
          planet: 'Mercury',
          planetName: { en: 'Mercury', hi: 'बुध', sa: 'बुध' },
          startDate: '2024-10-01',
          endDate: '2027-06-01',
          level: 'antar',
        },
      ],
    },
  ];

  it('finds correct maha and antar dasha for a date', () => {
    const result = extractDashaForDate(timeline, new Date('2025-06-15'));
    expect(result).toEqual({ mahaDasha: 'Jupiter', antarDasha: 'Mercury' });
  });

  it('finds first antar dasha correctly', () => {
    const result = extractDashaForDate(timeline, new Date('2021-01-15'));
    expect(result).toEqual({ mahaDasha: 'Jupiter', antarDasha: 'Jupiter' });
  });

  it('returns null for empty timeline', () => {
    expect(extractDashaForDate([], new Date())).toBeNull();
    expect(extractDashaForDate(null, new Date())).toBeNull();
    expect(extractDashaForDate(undefined, new Date())).toBeNull();
  });

  it('returns null for date outside timeline range', () => {
    const result = extractDashaForDate(timeline, new Date('2040-01-01'));
    expect(result).toBeNull();
  });
});

// ── buildDenormalizedFields ──────────────────────────────────

describe('buildDenormalizedFields', () => {
  it('extracts correct denormalized fields from snapshot', () => {
    const snapshot: PlanetarySnapshot = {
      tithi: { name: 'Trayodashi', number: 13, paksha: 'krishna' },
      nakshatra: { name: 'Pushya', number: 8, pada: 2 },
      yoga: { name: 'Shobhana', number: 4, },
      karana: { name: 'Vanija', number: 6 },
      weekday: 5, // Friday
      moonSign: 4, // Cancer
      planets: [],
      dasha: { mahaDasha: 'Jupiter', antarDasha: 'Mercury' },
      sadeSatiPhase: 'peak',
    };

    const result = buildDenormalizedFields(snapshot);
    expect(result.tithi_number).toBe(13);
    expect(result.nakshatra_number).toBe(8);
    expect(result.yoga_number).toBe(4);
    expect(result.karana_number).toBe(6);
    expect(result.weekday).toBe(5);
    expect(result.maha_dasha).toBe('Jupiter');
    expect(result.antar_dasha).toBe('Mercury');
    expect(result.moon_sign).toBe(4);
    expect(result.sade_sati_phase).toBe('peak');
  });

  it('handles null dasha gracefully', () => {
    const snapshot: PlanetarySnapshot = {
      tithi: { name: 'Pratipada', number: 1, paksha: 'shukla' },
      nakshatra: { name: 'Ashwini', number: 1, pada: 1 },
      yoga: { name: 'Vishkambha', number: 1 },
      karana: { name: 'Bava', number: 1 },
      weekday: 0,
      moonSign: 1,
      planets: [],
      dasha: null,
      sadeSatiPhase: null,
    };

    const result = buildDenormalizedFields(snapshot);
    expect(result.maha_dasha).toBeNull();
    expect(result.antar_dasha).toBeNull();
    expect(result.sade_sati_phase).toBeNull();
  });
});

// ── buildPlanetarySnapshot (integration) ─────────────────────

describe('buildPlanetarySnapshot', () => {
  it('builds a valid snapshot for a known date and location', () => {
    // April 25 2026, Delhi (28.61, 77.21)
    const date = new Date(Date.UTC(2026, 3, 25, 4, 30)); // ~10:00 IST
    const { snapshot, denormalized } = buildPlanetarySnapshot(
      28.61, 77.21, 'Asia/Kolkata', date,
    );

    // Tithi should be a valid number 1-30
    expect(snapshot.tithi.number).toBeGreaterThanOrEqual(1);
    expect(snapshot.tithi.number).toBeLessThanOrEqual(30);
    expect(snapshot.tithi.name).toBeTruthy();

    // Nakshatra should be 1-27
    expect(snapshot.nakshatra.number).toBeGreaterThanOrEqual(1);
    expect(snapshot.nakshatra.number).toBeLessThanOrEqual(27);

    // Yoga 1-27
    expect(snapshot.yoga.number).toBeGreaterThanOrEqual(1);
    expect(snapshot.yoga.number).toBeLessThanOrEqual(27);

    // Karana 1-11
    expect(snapshot.karana.number).toBeGreaterThanOrEqual(1);
    expect(snapshot.karana.number).toBeLessThanOrEqual(11);

    // Weekday 0-6
    expect(snapshot.weekday).toBeGreaterThanOrEqual(0);
    expect(snapshot.weekday).toBeLessThanOrEqual(6);

    // 9 planets
    expect(snapshot.planets).toHaveLength(9);
    expect(snapshot.planets[0].name).toBe('Sun');

    // Moon sign should be 1-12
    expect(snapshot.moonSign).toBeGreaterThanOrEqual(1);
    expect(snapshot.moonSign).toBeLessThanOrEqual(12);

    // Denormalized fields should match snapshot
    expect(denormalized.tithi_number).toBe(snapshot.tithi.number);
    expect(denormalized.nakshatra_number).toBe(snapshot.nakshatra.number);
    expect(denormalized.weekday).toBe(snapshot.weekday);
    expect(denormalized.moon_sign).toBe(snapshot.moonSign);
  });

  it('includes dasha when timeline is provided', () => {
    const timeline: DashaEntry[] = [{
      planet: 'Venus',
      planetName: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र' },
      startDate: '2020-01-01',
      endDate: '2040-01-01',
      level: 'maha',
      subPeriods: [{
        planet: 'Mars',
        planetName: { en: 'Mars', hi: 'मंगल', sa: 'मंगल' },
        startDate: '2025-01-01',
        endDate: '2027-01-01',
        level: 'antar',
      }],
    }];

    const date = new Date(Date.UTC(2026, 3, 25));
    const { snapshot, denormalized } = buildPlanetarySnapshot(
      28.61, 77.21, 'Asia/Kolkata', date, timeline,
    );

    expect(snapshot.dasha).toEqual({ mahaDasha: 'Venus', antarDasha: 'Mars' });
    expect(denormalized.maha_dasha).toBe('Venus');
    expect(denormalized.antar_dasha).toBe('Mars');
  });

  it('handles missing dasha timeline', () => {
    const date = new Date(Date.UTC(2026, 3, 25));
    const { snapshot, denormalized } = buildPlanetarySnapshot(
      28.61, 77.21, 'Asia/Kolkata', date,
    );

    expect(snapshot.dasha).toBeNull();
    expect(denormalized.maha_dasha).toBeNull();
    expect(denormalized.antar_dasha).toBeNull();
  });
});
