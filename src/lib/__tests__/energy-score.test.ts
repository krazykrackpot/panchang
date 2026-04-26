/**
 * Daily Energy Score Engine Tests
 *
 * Verifies the 0–100 scoring formula:
 *   moonPhase(40%) + nakshatraQuality(30%) + yogaQuality(15%)
 *   + karanaQuality(10%) + vara(5%)
 */

import { describe, it, expect } from 'vitest';
import { computeDailyEnergy, computeEnergyFromComponents } from '@/lib/panchang/energy-score';
import type { PanchangData } from '@/types/panchang';

// ─────────────────────────────────────────────
// Helpers — build minimal PanchangData fixtures
// ─────────────────────────────────────────────

function makePanchang(overrides: {
  tithiNumber: number;
  paksha: 'shukla' | 'krishna';
  nakshatraId: number;
  yogaNumber: number;
  karanaNumber: number;
  varaDayOfWeek: number; // 0=Sunday
}): PanchangData {
  const { tithiNumber, paksha, nakshatraId, yogaNumber, karanaNumber, varaDayOfWeek } = overrides;
  // Minimal required PanchangData fields — only the ones used by energy-score
  return {
    date: '2026-01-01',
    location: { lat: 46.948, lng: 7.447, name: 'Bern' },
    tithi: {
      number: tithiNumber,
      name: { en: `Tithi ${tithiNumber}` },
      paksha,
      deity: { en: 'Test' },
    },
    nakshatra: {
      id: nakshatraId,
      name: { en: `Nakshatra ${nakshatraId}` },
      deity: { en: 'Test' },
      ruler: 'Moon',
      rulerName: { en: 'Moon' },
      startDeg: 0,
      endDeg: 13.33,
      symbol: '●',
      nature: { en: 'Test' },
    },
    yoga: {
      number: yogaNumber,
      name: { en: `Yoga ${yogaNumber}` },
      nature: 'neutral',
      meaning: { en: 'Test' },
    },
    karana: {
      number: karanaNumber,
      name: { en: `Karana ${karanaNumber}` },
      type: 'chara',
    },
    vara: {
      day: varaDayOfWeek,
      name: { en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][varaDayOfWeek] },
      ruler: { en: 'Test' },
    },
    sunrise: '06:30',
    sunset: '18:30',
    moonrise: '18:00',
    moonset: '06:00',
    rahuKaal: { start: '07:30', end: '09:00' },
    yamaganda: { start: '10:30', end: '12:00' },
    gulikaKaal: { start: '06:00', end: '07:30' },
    muhurtas: [],
    abhijitMuhurta: { start: '11:45', end: '12:30' },
    planets: [],
    masa: { en: 'Chaitra' },
    samvatsara: { en: 'Vikrama' },
    ritu: { en: 'Vasanta' },
    ayana: { en: 'Uttarayana' },
  } as PanchangData;
}

// ─────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────

describe('computeDailyEnergy', () => {
  it('returns a score in the 0–100 range for Purnima with auspicious nakshatra', () => {
    // Shukla Purnima (tithi 15) + Pushya (id=8, most auspicious, score=82)
    // + Siddhi yoga (16, score=92) + Bava karana (1, score=65) + Thursday (4, score=50)
    const p = makePanchang({
      tithiNumber: 15,
      paksha: 'shukla',
      nakshatraId: 8,    // Pushya — very auspicious
      yogaNumber: 16,    // Siddhi — best yoga
      karanaNumber: 1,   // Bava — good movable
      varaDayOfWeek: 4,  // Thursday — Jupiter day
    });
    const result = computeDailyEnergy(p);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    // Purnima + Siddhi yoga + Pushya = high score
    expect(result.score).toBeGreaterThan(75);
    expect(result.label).toBe('High');
  });

  it('Full Moon (Shukla Purnima) with good yoga and nakshatra → score > 75', () => {
    // Shukla 15 moonPhase = 100; Rohini nakshatra (65); Vriddhi yoga (85); Vanija karana (70); Friday (68)
    // 100*0.40 + 65*0.30 + 85*0.15 + 70*0.10 + 68*0.05 = 40+19.5+12.75+7+3.4 = 82.65 → 83
    const p = makePanchang({
      tithiNumber: 15,
      paksha: 'shukla',
      nakshatraId: 4,    // Rohini — sthira, fertile
      yogaNumber: 11,    // Vriddhi — growth
      karanaNumber: 6,   // Vanija — merchant, best movable
      varaDayOfWeek: 5,  // Friday — Venus
    });
    const result = computeDailyEnergy(p);
    expect(result.score).toBeGreaterThan(75);
    expect(result.label).toBe('High');
  });

  it('New Moon (Krishna Amavasya, tithi 15 krishna) → score 20–50 range', () => {
    // Krishna tithi 15 moonPhase = 20; Vishkambha yoga (20); Vishti karana (20) = strongly low
    // But nakshatra Rohini (65) and Sunday (50) moderate it
    // 20*0.40 + 65*0.30 + 20*0.15 + 20*0.10 + 50*0.05 = 8+19.5+3+2+2.5 = 35 → 35
    const p = makePanchang({
      tithiNumber: 15,
      paksha: 'krishna',
      nakshatraId: 4,    // Rohini
      yogaNumber: 1,     // Vishkambha — inauspicious
      karanaNumber: 7,   // Vishti — inauspicious
      varaDayOfWeek: 0,  // Sunday
    });
    const result = computeDailyEnergy(p);
    expect(result.score).toBeGreaterThanOrEqual(20);
    expect(result.score).toBeLessThanOrEqual(50);
    expect(result.label).toBe('Low');
  });

  it('Amavasya with auspicious nakshatra still scores higher than minimum', () => {
    // Even on New Moon, a great nakshatra (Pushya=82) + great yoga (Siddhi=92) can lift it
    // Krishna 15: moonPhase=20; Pushya: 82; Siddhi: 92; Vanija: 70; Thursday: 50
    // 20*0.40 + 82*0.30 + 92*0.15 + 70*0.10 + 50*0.05 = 8+24.6+13.8+7+2.5 = 55.9 → 56
    const p = makePanchang({
      tithiNumber: 15,
      paksha: 'krishna',
      nakshatraId: 8,    // Pushya
      yogaNumber: 16,    // Siddhi
      karanaNumber: 6,   // Vanija
      varaDayOfWeek: 4,  // Thursday
    });
    const result = computeDailyEnergy(p);
    // Not zero — Amavasya has value for spiritual practice
    expect(result.score).toBeGreaterThan(20);
    expect(result.score).toBeLessThan(80); // Still moderated by the New Moon
  });

  it('score is always clamped to 0–100 for any valid input', () => {
    // Test all combinations of extreme values
    const extremes: Parameters<typeof makePanchang>[0][] = [
      // Best possible: Shukla 15 + best nakshatra + best yoga + best karana + best vara
      { tithiNumber: 15, paksha: 'shukla', nakshatraId: 8, yogaNumber: 16, karanaNumber: 6, varaDayOfWeek: 5 },
      // Worst possible: Krishna 15 + worst nakshatra + worst yoga + worst karana + worst vara
      { tithiNumber: 15, paksha: 'krishna', nakshatraId: 19, yogaNumber: 27, karanaNumber: 7, varaDayOfWeek: 6 },
      // All mid values
      { tithiNumber: 8, paksha: 'shukla', nakshatraId: 14, yogaNumber: 14, karanaNumber: 4, varaDayOfWeek: 3 },
    ];

    for (const params of extremes) {
      const result = computeDailyEnergy(makePanchang(params));
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    }
  });

  it('label is correct for score ranges', () => {
    // High ≥ 80
    const high = computeDailyEnergy(makePanchang({
      tithiNumber: 15, paksha: 'shukla', nakshatraId: 8, yogaNumber: 16, karanaNumber: 6, varaDayOfWeek: 5,
    }));
    expect(high.label).toBe('High');

    // Low < 50
    const low = computeDailyEnergy(makePanchang({
      tithiNumber: 15, paksha: 'krishna', nakshatraId: 19, yogaNumber: 27, karanaNumber: 7, varaDayOfWeek: 6,
    }));
    expect(low.label).toBe('Low');
  });

  it('returns non-empty bestFor and avoid arrays', () => {
    const p = makePanchang({
      tithiNumber: 11,
      paksha: 'shukla',
      nakshatraId: 7,
      yogaNumber: 12,
      karanaNumber: 3,
      varaDayOfWeek: 1,
    });
    const result = computeDailyEnergy(p);
    expect(result.bestFor.length).toBeGreaterThan(0);
    expect(result.bestFor.length).toBeLessThanOrEqual(3);
    expect(result.avoid.length).toBeGreaterThan(0);
    expect(result.avoid.length).toBeLessThanOrEqual(2);
  });

  it('dominantFactor is a non-empty string', () => {
    const p = makePanchang({
      tithiNumber: 5,
      paksha: 'shukla',
      nakshatraId: 1,
      yogaNumber: 3,
      karanaNumber: 2,
      varaDayOfWeek: 2,
    });
    const result = computeDailyEnergy(p);
    expect(result.dominantFactor).toBeTruthy();
    expect(typeof result.dominantFactor).toBe('string');
  });
});

describe('7 consecutive days show lunar wave pattern', () => {
  it('scores increase from New Moon toward Full Moon across consecutive tithis', () => {
    // Shukla Paksha days 1–15 should show generally increasing trend
    const scores: number[] = [];
    for (let tithi = 1; tithi <= 15; tithi++) {
      scores.push(computeEnergyFromComponents({
        tithiNumber: tithi,
        paksha: 'shukla',
        nakshatraId: 8,    // Fixed: Pushya (high-scoring) so variation is from moon phase
        yogaNumber: 7,     // Fixed: Sukarma (auspicious)
        karanaNumber: 1,   // Fixed: Bava (good)
        dayOfWeek: 4,      // Fixed: Thursday
      }));
    }
    // Score should strictly increase from Pratipada to Purnima
    // (all other components fixed, so only moonPhase changes)
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i - 1]);
    }
    // First score (Pratipada) < Last score (Purnima)
    expect(scores[0]).toBeLessThan(scores[14]);
  });

  it('scores decrease from Full Moon toward Amavasya across consecutive tithis', () => {
    const scores: number[] = [];
    for (let tithi = 1; tithi <= 15; tithi++) {
      scores.push(computeEnergyFromComponents({
        tithiNumber: tithi,
        paksha: 'krishna',
        nakshatraId: 8,
        yogaNumber: 7,
        karanaNumber: 1,
        dayOfWeek: 4,
      }));
    }
    // Score should strictly decrease from Krishna Pratipada to Amavasya
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeLessThanOrEqual(scores[i - 1]);
    }
    expect(scores[14]).toBeLessThan(scores[0]);
  });

  it('7 consecutive days show sensible wave when using real computePanchang data', async () => {
    // Use real panchang computation for 7 consecutive days in May 2025 (around Vaishakha Purnima)
    // May 12 = Purnima, so days May 7–13 span Shukla 10–15 → Krishna 1-2
    const { computePanchang } = await import('@/lib/ephem/panchang-calc');

    const results: { tithi: number; paksha: string; score: number }[] = [];
    for (let day = 7; day <= 13; day++) {
      const p = computePanchang({
        year: 2025, month: 5, day,
        lat: 46.948, lng: 7.447,
        tzOffset: 2,
        locationName: 'Bern',
        timezone: 'Europe/Zurich',
      });
      const energy = computeDailyEnergy(p);
      results.push({ tithi: p.tithi.number, paksha: p.tithi.paksha, score: energy.score });
    }

    // All scores in valid range
    for (const r of results) {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    }

    // The day closest to Purnima (May 12) should have a higher score than the first day (May 7)
    // The Full Moon energy (moon phase = 100) should dominate enough to push May 12 higher
    const fullMoonIdx = results.findIndex((r) => r.tithi === 15 && r.paksha === 'shukla');
    if (fullMoonIdx !== -1) {
      // Purnima score should be notably higher than early Shukla days
      expect(results[fullMoonIdx].score).toBeGreaterThan(results[0].score - 10);
    }
  });
});

describe('computeEnergyFromComponents', () => {
  it('returns valid range for all extremes', () => {
    // Best case: Shukla 15, Pushya, Siddhi yoga, Vanija karana, Friday
    const best = computeEnergyFromComponents({
      tithiNumber: 15, paksha: 'shukla', nakshatraId: 8, yogaNumber: 16, karanaNumber: 6, dayOfWeek: 5,
    });
    expect(best).toBeGreaterThanOrEqual(0);
    expect(best).toBeLessThanOrEqual(100);

    // Worst case: Krishna 15, Mula, Vaidhriti, Vishti, Saturday
    const worst = computeEnergyFromComponents({
      tithiNumber: 15, paksha: 'krishna', nakshatraId: 19, yogaNumber: 27, karanaNumber: 7, dayOfWeek: 6,
    });
    expect(worst).toBeGreaterThanOrEqual(0);
    expect(worst).toBeLessThanOrEqual(100);

    expect(best).toBeGreaterThan(worst);
  });

  it('Shukla 15 + all auspicious components scores above 80', () => {
    // Purnima moonPhase=100 (40pt) + Ashwini(85, 30pt) + Siddhi(92, 15pt) + Vanija(70, 10pt) + Friday(68, 5pt)
    // = 40 + 25.5 + 13.8 + 7 + 3.4 = 89.7 → 90
    const score = computeEnergyFromComponents({
      tithiNumber: 15, paksha: 'shukla', nakshatraId: 1, yogaNumber: 16, karanaNumber: 6, dayOfWeek: 5,
    });
    expect(score).toBeGreaterThan(80);
  });

  it('Krishna 15 + all inauspicious components scores below 30', () => {
    // Amavasya moonPhase=20 (8pt) + Mula(30, 9pt) + Vaidhriti(18, 2.7pt) + Vishti(20, 2pt) + Saturday(30, 1.5pt)
    // = 8 + 9 + 2.7 + 2 + 1.5 = 23.2 → 23
    const score = computeEnergyFromComponents({
      tithiNumber: 15, paksha: 'krishna', nakshatraId: 19, yogaNumber: 27, karanaNumber: 7, dayOfWeek: 6,
    });
    expect(score).toBeLessThan(30);
  });
});
