/**
 * Integration tests for muhurta scoring — Dur Muhurtam, Abhijit, Varjyam, Vishti.
 *
 * These verify that the scoring engine correctly applies bonuses/penalties
 * for periods that were previously computed but not integrated.
 */
import { describe, it, expect } from 'vitest';
import {
  computeInauspiciousForWindow,
  computeInauspiciousPenalty,
  computeDurMuhurtam,
  isVarjyamActive,
} from '@/lib/muhurta/inauspicious-periods';
import { scoreTimingFactors } from '@/lib/muhurta/ai-recommender';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import { DUR_MUHURTAM_A } from '@/lib/constants/dur-muhurtam';
import { VARJYAM_GHATI } from '@/lib/constants/varjyam';

describe('Dur Muhurtam integration', () => {
  it('computeDurMuhurtam returns correct number of windows per weekday', () => {
    // Sunday: 1 window (13th muhurta), Monday: 2 windows (8th & 11th)
    const sunday = computeDurMuhurtam(6, 18, 0); // sunrise 6UT, sunset 18UT, Sunday
    expect(sunday).toHaveLength(1);
    const monday = computeDurMuhurtam(6, 18, 1);
    expect(monday).toHaveLength(2);
  });

  it('computeDurMuhurtam windows have correct time ranges', () => {
    // Sunday sunrise 6UT, sunset 18UT → 12h day → muhurta = 48min = 0.8h
    // 13th muhurta (0-indexed) → start = 6 + 13*0.8 = 16.4UT
    const windows = computeDurMuhurtam(6, 18, 0);
    expect(windows[0].start).toBeCloseTo(16.4, 1);
    expect(windows[0].end).toBeCloseTo(17.2, 1);
  });

  it('Dur Muhurtam penalty is applied when window overlaps', () => {
    // Sunday: Dur Muhurtam at 13th muhurta = 16.4-17.2 UT (sunrise 6, sunset 18)
    // Score a window at 16.5-17.0 UT (overlaps)
    const periods = computeInauspiciousForWindow(
      16.5, 17.0,  // window
      6, 18,       // sunrise, sunset
      0,           // Sunday
      1,           // nakshatra (irrelevant here)
      2460800,     // JD (approximate)
      0,           // tz=UTC
    );
    const durPeriod = periods.find(p => p.name === 'Dur Muhurtam');
    expect(durPeriod).toBeDefined();
    expect(durPeriod!.active).toBe(true);
  });

  it('no Dur Muhurtam penalty when window does not overlap', () => {
    // Sunday: Dur Muhurtam at 16.4-17.2. Window at 10-11 UT (no overlap)
    const periods = computeInauspiciousForWindow(
      10, 11,
      6, 18,
      0, 1, 2460800, 0,
    );
    const durPeriod = periods.find(p => p.name === 'Dur Muhurtam');
    expect(durPeriod).toBeUndefined();
  });
});

describe('Varjyam integration', () => {
  it('detects Varjyam when Moon is in the window', () => {
    // Ashwini (nakshatra 1, index 0): Varjyam at ghati 50-54 of 60
    // Ashwini spans 0° to 13.333°. Ghati 50 = 50/60 * 13.333 = 11.111°
    const moonSidInVarjyam = 11.2; // ~ghati 50.4 of Ashwini
    expect(isVarjyamActive(moonSidInVarjyam)).toBe(true);
  });

  it('does not detect Varjyam when Moon is outside the window', () => {
    // Ashwini: Varjyam at ghati 50-54. Ghati 30 = 30/60 * 13.333 = 6.667°
    const moonSidOutside = 6.7; // ~ghati 30 of Ashwini
    expect(isVarjyamActive(moonSidOutside)).toBe(false);
  });

  it('detects secondary Varjyam for Mula (dual Thyajyam)', () => {
    // Mula is nakshatra 19 (index 18). Primary=20, secondary=56.
    // Mula spans (18 * 13.333)° = 240° to 253.333°
    // Secondary ghati 56 = 240 + (56/60)*13.333 = 240 + 12.444 = 252.444°
    const moonSidInSecondary = 252.5; // ~ghati 56.3 of Mula
    expect(isVarjyamActive(moonSidInSecondary)).toBe(true);
  });

  it('Varjyam period added to computeInauspiciousForWindow when moonSid is in Varjyam', () => {
    // Moon in Ashwini Varjyam window
    const moonSid = 11.2;
    const periods = computeInauspiciousForWindow(
      10, 11, 6, 18, 0, 1, 2460800, 0, moonSid,
    );
    const varjyam = periods.find(p => p.name === 'Varjyam');
    expect(varjyam).toBeDefined();
    expect(varjyam!.active).toBe(true);
  });
});

describe('Abhijit Muhurta bonus', () => {
  it('grants +8 bonus during Abhijit on non-Wednesday', () => {
    // Sunrise 6 local, sunset 18 local → muhurta = 0.8h
    // Abhijit (8th muhurta, 0-indexed 7): 6 + 7*0.8 = 11.6 to 12.4 local
    const rules = getExtendedActivity('marriage')!;
    const result = scoreTimingFactors(
      2460800,   // jd
      12.0,      // hourOfDay (noon — inside Abhijit)
      1,         // Monday (not Wednesday)
      6,         // sunriseUT
      18,        // sunsetUT
      0,         // tz=UTC
      rules,
    );
    const hasAbhijit = result.factors.some(f => f.en.includes('Abhijit'));
    expect(hasAbhijit).toBe(true);
  });

  it('does NOT grant bonus on Wednesday', () => {
    const rules = getExtendedActivity('marriage')!;
    const result = scoreTimingFactors(
      2460800, 12.0, 3, 6, 18, 0, rules, // weekday=3=Wednesday
    );
    const hasAbhijit = result.factors.some(f => f.en.includes('Abhijit'));
    expect(hasAbhijit).toBe(false);
  });

  it('does NOT grant bonus outside Abhijit window', () => {
    const rules = getExtendedActivity('marriage')!;
    const result = scoreTimingFactors(
      2460800, 8.0, 1, 6, 18, 0, rules, // 8 AM — well before Abhijit
    );
    const hasAbhijit = result.factors.some(f => f.en.includes('Abhijit'));
    expect(hasAbhijit).toBe(false);
  });
});

describe('Vishti penalty balance', () => {
  it('Vishti inauspicious penalty is reduced to -1 (main penalty is in panchang scoring)', () => {
    // Create a period set with only Vishti active
    const penalty = computeInauspiciousPenalty([
      { name: 'Vishti (Bhadra)', startTime: '10:00', endTime: '11:00', active: true },
    ]);
    // 10 - 1 = 9 (was 10 - 4 = 6 before)
    expect(penalty).toBe(9);
  });

  it('combined inauspicious penalty sums correctly with new periods', () => {
    const penalty = computeInauspiciousPenalty([
      { name: 'Rahu Kaal', startTime: '10:00', endTime: '11:00', active: true },
      { name: 'Dur Muhurtam', startTime: '10:00', endTime: '11:00', active: true },
      { name: 'Varjyam', startTime: '10:00', endTime: '11:00', active: true },
    ]);
    // 10 - 4 - 3 - 3 = 0
    expect(penalty).toBe(0);
  });
});
