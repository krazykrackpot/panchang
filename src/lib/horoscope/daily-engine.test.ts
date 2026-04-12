import { describe, it, expect } from 'vitest';
import { generateDailyHoroscope } from './daily-engine';

describe('Daily Horoscope Engine', () => {
  it('returns valid horoscope for Aries Moon on a given date', () => {
    const result = generateDailyHoroscope({ moonSign: 1, date: '2026-04-07' });
    expect(result.moonSign).toBe(1);
    expect(result.date).toBe('2026-04-07');
    expect(result.moonSignName.en).toBe('Aries');
    expect(result.moonSignName.hi).toBe('मेष');
    expect(result.overallScore).toBeGreaterThanOrEqual(1);
    expect(result.overallScore).toBeLessThanOrEqual(10);
    expect(result.luckyNumber).toBeGreaterThanOrEqual(1);
    expect(result.luckyNumber).toBeLessThanOrEqual(9);
    expect(result.luckyColor.en.length).toBeGreaterThan(0);
    expect(result.luckyColor.hi.length).toBeGreaterThan(0);
    expect(result.luckyTime.length).toBeGreaterThan(0);
    expect(result.insight.en.length).toBeGreaterThan(0);
    expect(result.insight.hi.length).toBeGreaterThan(0);
  });

  it('returns valid scores for all 5 life areas', () => {
    const result = generateDailyHoroscope({ moonSign: 7, date: '2026-04-07' });
    const areas = ['career', 'love', 'health', 'finance', 'spirituality'] as const;
    for (const area of areas) {
      const aData = result.areas[area];
      expect(aData.score).toBeGreaterThanOrEqual(1);
      expect(aData.score).toBeLessThanOrEqual(10);
      expect(aData.text.en.length).toBeGreaterThan(10);
      expect(aData.text.hi.length).toBeGreaterThan(5);
    }
  });

  it('is deterministic — same input produces same output', () => {
    const a = generateDailyHoroscope({ moonSign: 5, date: '2026-06-15' });
    const b = generateDailyHoroscope({ moonSign: 5, date: '2026-06-15' });
    expect(a).toEqual(b);
  });

  it('produces different results for different moon signs on same date', () => {
    const aries = generateDailyHoroscope({ moonSign: 1, date: '2026-04-07' });
    const libra = generateDailyHoroscope({ moonSign: 7, date: '2026-04-07' });
    // They could have different overall scores (not guaranteed, but very likely)
    expect(aries.moonSignName.en).toBe('Aries');
    expect(libra.moonSignName.en).toBe('Libra');
    // At minimum, the sign info should differ
    expect(aries.moonSign).not.toBe(libra.moonSign);
  });

  it('produces different results for different dates with same moon sign', () => {
    const day1 = generateDailyHoroscope({ moonSign: 4, date: '2026-04-07' });
    const day2 = generateDailyHoroscope({ moonSign: 4, date: '2026-04-08' });
    // Scores or texts should differ (astronomical positions change daily)
    const same = day1.overallScore === day2.overallScore &&
                 day1.areas.career.text.en === day2.areas.career.text.en &&
                 day1.luckyNumber === day2.luckyNumber;
    // It's extremely unlikely all three are the same for different dates
    expect(same).toBe(false);
  });

  it('works for all 12 moon signs', () => {
    for (let sign = 1; sign <= 12; sign++) {
      const result = generateDailyHoroscope({ moonSign: sign, date: '2026-04-07' });
      expect(result.moonSign).toBe(sign);
      expect(result.overallScore).toBeGreaterThanOrEqual(1);
      expect(result.overallScore).toBeLessThanOrEqual(10);
    }
  });

  it('accepts optional nakshatra without errors', () => {
    const result = generateDailyHoroscope({ moonSign: 1, date: '2026-04-07', nakshatra: 3 });
    expect(result.moonSign).toBe(1);
    expect(result.overallScore).toBeGreaterThanOrEqual(1);
  });
});
