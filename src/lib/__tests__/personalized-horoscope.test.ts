import { describe, it, expect } from 'vitest';
import { buildPersonalizedFallback } from '@/lib/llm/personalized-horoscope';
import type { PersonalizedHoroscopeData, PersonalChartSnapshot } from '@/lib/llm/personalized-horoscope';

describe('personalized-horoscope', () => {
  const mockChart: PersonalChartSnapshot = {
    name: 'Test User',
    ascendantSign: 1,
    moonSign: 4,
    currentMahaDasha: 'Jupiter',
    currentAntarDasha: 'Saturn',
    savTable: [25, 28, 22, 30, 20, 26, 24, 29, 21, 27, 23, 25],
    keyYogas: ['Gajakesari'],
    keyDoshas: [],
  };

  const mockData: PersonalizedHoroscopeData = {
    chart: mockChart,
    moonTransitHouse: 5,
    moonTransitSign: 5,
    slowTransits: [
      { planet: 'Saturn', sign: 11, house: 11, savBindu: 23, isRetrograde: false },
      { planet: 'Jupiter', sign: 2, house: 2, savBindu: 28, isRetrograde: true },
      { planet: 'Rahu', sign: 12, house: 12, savBindu: 25, isRetrograde: false },
      { planet: 'Ketu', sign: 6, house: 6, savBindu: 26, isRetrograde: false },
    ],
    tithi: 'Shukla Dashami',
    nakshatra: 'Rohini',
    yoga: 'Siddha',
    dayOfWeek: 'Monday',
  };

  it('generates English fallback with dasha info', () => {
    const result = buildPersonalizedFallback(mockData, 'en');
    expect(result).toContain('Jupiter/Saturn dasha');
    expect(result).toContain('5th house');
  });

  it('generates Hindi fallback', () => {
    const result = buildPersonalizedFallback(mockData, 'hi');
    expect(result).toContain('Jupiter/Saturn');
    expect(result).toContain('भाव');
  });

  it('mentions strong transits when SAV >= 28', () => {
    const result = buildPersonalizedFallback(mockData, 'en');
    expect(result).toContain('Jupiter');
    expect(result).toContain('strong');
  });

  it('handles case with no strong/weak transits', () => {
    const neutralData = {
      ...mockData,
      slowTransits: mockData.slowTransits.map(t => ({ ...t, savBindu: 25 })),
    };
    const result = buildPersonalizedFallback(neutralData, 'en');
    expect(result).toContain('dasha');
    expect(result).not.toContain('strong');
    expect(result).not.toContain('weak');
  });
});
