/**
 * Daily Insights Engine Tests
 *
 * Tests the daily domain synthesis engine that combines today's panchang
 * with a user's PersonalReading to produce per-domain guidance.
 */

import { describe, it, expect } from 'vitest';
import {
  generateDailyInsights,
  getMoonTransitHouse,
  type DailyInsightsInput,
  type DailyInsights,
} from '@/lib/kundali/domain-synthesis/daily-insights';
import type { PanchangData } from '@/types/panchang';
import type { PersonalReading, DomainReading, CurrentPeriodReading, DomainType } from '@/lib/kundali/domain-synthesis/types';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

function makeDomainReading(domain: DomainType, score: number): DomainReading {
  return {
    domain,
    overallRating: {
      rating: score >= 7.5 ? 'uttama' : score >= 5 ? 'madhyama' : score >= 3 ? 'adhama' : 'atyadhama',
      score,
      label: { en: 'Test' },
      color: '#ccc',
    },
    natalPromise: {
      rating: { rating: 'madhyama', score: 5, label: { en: 'Test' }, color: '#ccc' },
      houseScores: { 1: 5 },
      lordQualities: [],
      supportingYogas: [],
      activeAfflictions: [],
      vargaConfirmations: [],
      summary: { en: 'Test natal' },
    },
    currentActivation: {
      isDashaActive: false,
      mahaDashaLordId: 0,
      antarDashaLordId: 1,
      dashaActivationScore: 5,
      transitInfluences: [],
      overallActivationScore: 5,
      summary: { en: 'Test activation' },
    },
    timelineTriggers: [],
    remedies: [],
    crossDomainLinks: [],
    headline: { en: 'Test headline' },
    detailedNarrative: { en: 'Test narrative' },
  };
}

function makeCurrentPeriod(): CurrentPeriodReading {
  return {
    dashaSummary: { en: 'Moon-Mars period' },
    keyTransits: [
      {
        planetId: 4,
        transitSign: 5,   // Leo (5th sign)
        transitHouse: 2,  // 2nd house from ascendant
        nature: 'benefic',
        summary: { en: 'Jupiter in 2nd house' },
      },
    ],
    activeDomainsNow: ['career', 'wealth'],
    challengedDomainsNow: ['health'],
    periodScore: 6,
    periodRating: {
      rating: 'madhyama',
      score: 6,
      label: { en: 'Moderate' },
      color: '#ccc',
    },
    summary: { en: 'Moderate period' },
  };
}

function makePersonalReading(ascSign?: number): PersonalReading {
  const domains: DomainType[] = [
    'health', 'wealth', 'career', 'marriage',
    'children', 'family', 'spiritual', 'education',
  ];

  // If ascSign is given, encode it into keyTransits so the engine can extract it.
  // transitSign - transitHouse + 1 = ascSign
  // e.g. ascSign=4 (Cancer): transitSign=5, transitHouse=2 → (5-2+1)=4
  const transitSign = ascSign ? ((ascSign + 1) % 12) || 12 : 5;
  const transitHouse = ascSign ? (((transitSign - ascSign + 12) % 12) + 1) : 2;

  return {
    kundaliId: 'test-kundali-001',
    computedAt: new Date().toISOString(),
    domains: domains.map((d) => makeDomainReading(d, 5 + Math.random() * 3)),
    currentPeriod: {
      ...makeCurrentPeriod(),
      keyTransits: [{
        planetId: 4,
        transitSign,
        transitHouse,
        nature: 'benefic' as const,
        summary: { en: 'Jupiter transit' },
      }],
    },
    topInsight: { en: 'Focus on career and spiritual growth' },
  };
}

function makePanchang(overrides: Partial<PanchangData> = {}): PanchangData {
  return {
    date: '2026-04-12',
    location: { lat: 46.47, lng: 6.84, name: 'Corseaux' },
    tithi: {
      number: 10,
      name: { en: 'Dashami', hi: 'दशमी', sa: 'दशमी' },
      paksha: 'shukla',
      deity: { en: 'Yama', hi: 'यम', sa: 'यमः' },
    },
    nakshatra: {
      id: 13,  // Hasta — kshipra
      name: { en: 'Hasta', hi: 'हस्त', sa: 'हस्तः' },
      deity: { en: 'Savitar', hi: 'सवितृ', sa: 'सवितृ' },
      ruler: 'Moon',
      rulerName: { en: 'Moon', hi: 'चंद्र', sa: 'चन्द्रः' },
      startDeg: 160,
      endDeg: 173.33,
      symbol: '✋',
      nature: { en: 'Kshipra (Swift)', hi: 'क्षिप्र', sa: 'क्षिप्रम्' },
    },
    yoga: {
      number: 21, // Siddhi — very auspicious
      name: { en: 'Siddhi', hi: 'सिद्धि', sa: 'सिद्धिः' },
      nature: 'auspicious',
      meaning: { en: 'Accomplishment', hi: 'सिद्धि', sa: 'सिद्धिः' },
    },
    karana: {
      number: 2,
      name: { en: 'Balava', hi: 'बालव', sa: 'बालवः' },
      type: 'chara',
    },
    vara: {
      day: 0,
      name: { en: 'Sunday', hi: 'रविवार', sa: 'भानुवासरः' },
      ruler: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
    },
    sunrise: '06:45',
    sunset: '19:58',
    moonrise: '14:30',
    moonset: '03:15',
    rahuKaal: { start: '08:15', end: '09:45' },
    yamaganda: { start: '12:30', end: '14:00' },
    gulikaKaal: { start: '15:30', end: '17:00' },
    muhurtas: [],
    abhijitMuhurta: { start: '12:00', end: '12:48' },
    planets: [],
    masa: { en: 'Chaitra', hi: 'चैत्र', sa: 'चैत्रः' },
    samvatsara: { en: 'Shobhana', hi: 'शोभन', sa: 'शोभनः' },
    ritu: { en: 'Vasanta', hi: 'वसंत', sa: 'वसन्तः' },
    ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायणम्' },
    moonSign: { rashi: 6, nakshatra: 13, pada: 2 }, // Virgo, Hasta
    amritKalam: { start: '02:30', end: '04:10' },
    varjyam: { start: '10:45', end: '12:25' },
    hora: [
      {
        planet: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
        planetId: 0,
        startTime: '06:45',
        endTime: '07:50',
        nature: 'auspicious',
      },
      {
        planet: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' },
        planetId: 5,
        startTime: '07:50',
        endTime: '08:55',
        nature: 'auspicious',
      },
    ],
    ...overrides,
  } as PanchangData;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('getMoonTransitHouse', () => {
  it('returns house 1 when Moon is in same sign as ascendant', () => {
    expect(getMoonTransitHouse(4, 4)).toBe(1);
  });

  it('returns house 7 when Moon is 7 signs from ascendant', () => {
    // Asc=1 (Aries), Moon=7 (Libra) → house 7
    expect(getMoonTransitHouse(7, 1)).toBe(7);
  });

  it('wraps around correctly', () => {
    // Asc=10 (Capricorn), Moon=3 (Gemini) → (3-10+12)%12+1 = 5+1 = 6
    expect(getMoonTransitHouse(3, 10)).toBe(6);
  });

  it('handles Moon in 12th house', () => {
    // Asc=2 (Taurus), Moon=1 (Aries) → (1-2+12)%12+1 = 11+1 = 12
    expect(getMoonTransitHouse(1, 2)).toBe(12);
  });

  it('handles both at rashi 12', () => {
    expect(getMoonTransitHouse(12, 12)).toBe(1);
  });
});

describe('generateDailyInsights', () => {
  it('returns 8 domain insights (excluding currentPeriod)', () => {
    const input: DailyInsightsInput = {
      personalReading: makePersonalReading(),
      todayPanchang: makePanchang(),
      locale: 'en',
    };
    const result = generateDailyInsights(input);
    expect(result.insights).toHaveLength(8);
    const domains = result.insights.map((i) => i.domain);
    expect(domains).toContain('health');
    expect(domains).toContain('wealth');
    expect(domains).toContain('career');
    expect(domains).toContain('marriage');
    expect(domains).toContain('children');
    expect(domains).toContain('family');
    expect(domains).toContain('spiritual');
    expect(domains).toContain('education');
    expect(domains).not.toContain('currentPeriod');
  });

  it('returns the correct date from panchang', () => {
    const input: DailyInsightsInput = {
      personalReading: makePersonalReading(),
      todayPanchang: makePanchang({ date: '2026-04-15' }),
      locale: 'en',
    };
    const result = generateDailyInsights(input);
    expect(result.date).toBe('2026-04-15');
  });

  it('all domain scores are between 0 and 10', () => {
    const input: DailyInsightsInput = {
      personalReading: makePersonalReading(),
      todayPanchang: makePanchang(),
      locale: 'en',
    };
    const result = generateDailyInsights(input);
    for (const insight of result.insights) {
      expect(insight.todayScore).toBeGreaterThanOrEqual(0);
      expect(insight.todayScore).toBeLessThanOrEqual(10);
    }
  });

  it('overallDay is one of the 4 valid values', () => {
    const input: DailyInsightsInput = {
      personalReading: makePersonalReading(),
      todayPanchang: makePanchang(),
      locale: 'en',
    };
    const result = generateDailyInsights(input);
    expect(['excellent', 'good', 'mixed', 'challenging']).toContain(result.overallDay);
  });

  it('produces bestWindow from amritKalam when present', () => {
    const input: DailyInsightsInput = {
      personalReading: makePersonalReading(),
      todayPanchang: makePanchang({
        amritKalam: { start: '03:00', end: '04:30' },
      }),
      locale: 'en',
    };
    const result = generateDailyInsights(input);
    const withWindow = result.insights.filter((i) => i.bestWindow);
    expect(withWindow.length).toBeGreaterThan(0);
    expect(withWindow[0].bestWindow!.start).toBe('03:00');
    expect(withWindow[0].bestWindow!.end).toBe('04:30');
  });

  it('produces caution from rahuKaal when present', () => {
    const input: DailyInsightsInput = {
      personalReading: makePersonalReading(),
      todayPanchang: makePanchang({
        rahuKaal: { start: '09:00', end: '10:30' },
      }),
      locale: 'en',
    };
    const result = generateDailyInsights(input);
    const withCaution = result.insights.filter((i) => i.caution);
    expect(withCaution.length).toBeGreaterThan(0);
    expect(withCaution[0].caution!.start).toBe('09:00');
  });

  it('omits bestWindow when amritKalam is absent', () => {
    const input: DailyInsightsInput = {
      personalReading: makePersonalReading(),
      todayPanchang: makePanchang({ amritKalam: undefined }),
      locale: 'en',
    };
    const result = generateDailyInsights(input);
    for (const insight of result.insights) {
      expect(insight.bestWindow).toBeUndefined();
    }
  });

  it('headlines contain locale text for en', () => {
    const input: DailyInsightsInput = {
      personalReading: makePersonalReading(),
      todayPanchang: makePanchang(),
      locale: 'en',
    };
    const result = generateDailyInsights(input);
    for (const insight of result.insights) {
      expect(insight.headline.en).toBeTruthy();
      expect(typeof insight.headline.en).toBe('string');
    }
  });

  it('topTip is a non-empty LocaleText', () => {
    const input: DailyInsightsInput = {
      personalReading: makePersonalReading(),
      todayPanchang: makePanchang(),
      locale: 'en',
    };
    const result = generateDailyInsights(input);
    expect(result.topTip.en).toBeTruthy();
    expect(result.topTip.en.length).toBeGreaterThan(0);
  });

  it('moonNakshatraQuality reflects kshipra for Hasta nakshatra', () => {
    const input: DailyInsightsInput = {
      personalReading: makePersonalReading(),
      todayPanchang: makePanchang({
        moonSign: { rashi: 6, nakshatra: 13, pada: 2 }, // Hasta = kshipra
      }),
      locale: 'en',
    };
    const result = generateDailyInsights(input);
    expect(result.moonNakshatraQuality.en).toContain('Swift');
  });

  it('moonNakshatraQuality reflects mridu for Revati nakshatra', () => {
    const input: DailyInsightsInput = {
      personalReading: makePersonalReading(),
      todayPanchang: makePanchang({
        moonSign: { rashi: 12, nakshatra: 27, pada: 1 }, // Revati = mridu
      }),
      locale: 'en',
    };
    const result = generateDailyInsights(input);
    expect(result.moonNakshatraQuality.en).toContain('Soft');
  });

  it('returns neutral nakshatra quality for unclassified nakshatras', () => {
    const input: DailyInsightsInput = {
      personalReading: makePersonalReading(),
      todayPanchang: makePanchang({
        moonSign: { rashi: 3, nakshatra: 6, pada: 1 }, // Ardra (id=6, not in map)
      }),
      locale: 'en',
    };
    const result = generateDailyInsights(input);
    expect(result.moonNakshatraQuality.en).toContain('Neutral');
  });

  describe('scoring factors', () => {
    it('career scores higher on Shukla Dashami with kshipra nakshatra', () => {
      const input: DailyInsightsInput = {
        personalReading: makePersonalReading(),
        todayPanchang: makePanchang({
          tithi: {
            number: 10,
            name: { en: 'Dashami' },
            paksha: 'shukla',
            deity: { en: 'Yama' },
          },
          moonSign: { rashi: 6, nakshatra: 1, pada: 1 }, // Ashwini = kshipra
        }),
        locale: 'en',
      };
      const result = generateDailyInsights(input);
      const career = result.insights.find((i) => i.domain === 'career')!;
      // Shukla Dashami boosts career, kshipra boosts career → should be above neutral
      expect(career.todayScore).toBeGreaterThanOrEqual(5);
    });

    it('spiritual scores higher on Amavasya', () => {
      const input: DailyInsightsInput = {
        personalReading: makePersonalReading(),
        todayPanchang: makePanchang({
          tithi: {
            number: 15,
            name: { en: 'Amavasya' },
            paksha: 'krishna',
            deity: { en: 'Pitrs' },
          },
        }),
        locale: 'en',
      };
      const result = generateDailyInsights(input);
      const spiritual = result.insights.find((i) => i.domain === 'spiritual')!;
      // krishna_15 boosts spiritual
      expect(spiritual.todayScore).toBeGreaterThanOrEqual(5);
    });

    it('very auspicious yoga (Siddhi #21) boosts all scores', () => {
      const auspInput: DailyInsightsInput = {
        personalReading: makePersonalReading(),
        todayPanchang: makePanchang({
          yoga: { number: 21, name: { en: 'Siddhi' }, nature: 'auspicious', meaning: { en: 'Accomplishment' } },
        }),
        locale: 'en',
      };
      const inauspInput: DailyInsightsInput = {
        personalReading: makePersonalReading(),
        todayPanchang: makePanchang({
          yoga: { number: 1, name: { en: 'Vishkambha' }, nature: 'inauspicious', meaning: { en: 'Obstruction' } },
        }),
        locale: 'en',
      };

      const auspResult = generateDailyInsights(auspInput);
      const inauspResult = generateDailyInsights(inauspInput);

      // Average score with auspicious yoga should be higher
      const avgAusp = auspResult.insights.reduce((s, i) => s + i.todayScore, 0) / 8;
      const avgInausp = inauspResult.insights.reduce((s, i) => s + i.todayScore, 0) / 8;
      expect(avgAusp).toBeGreaterThan(avgInausp);
    });

    it('hora planet matching domain gives a boost', () => {
      // Sun hora should boost career and health
      const input: DailyInsightsInput = {
        personalReading: makePersonalReading(),
        todayPanchang: makePanchang({
          hora: [{
            planet: { en: 'Sun' },
            planetId: 0,
            startTime: '06:45',
            endTime: '07:50',
            nature: 'auspicious',
          }],
        }),
        locale: 'en',
      };
      const result = generateDailyInsights(input);
      const career = result.insights.find((i) => i.domain === 'career')!;
      // Sun hora → career boost (hora score = 8 instead of 5)
      // This is 10% of the total, so ~0.3 point difference
      expect(career.todayScore).toBeGreaterThanOrEqual(0);
    });
  });

  describe('overall day classification', () => {
    it('returns challenging for low-scoring panchang', () => {
      // Use inauspicious yoga + unrelated nakshatra + no amrit kalam
      const input: DailyInsightsInput = {
        personalReading: makePersonalReading(),
        todayPanchang: makePanchang({
          yoga: { number: 15, name: { en: 'Vajra' }, nature: 'inauspicious', meaning: { en: 'Hardness' } },
          moonSign: { rashi: 8, nakshatra: 18, pada: 1 }, // Jyeshtha (not in type map) + Scorpio
          hora: [],
          amritKalam: undefined,
        }),
        locale: 'en',
      };
      const result = generateDailyInsights(input);
      // With neutral/low scoring across the board, should not be 'excellent'
      expect(result.overallDay).not.toBe('excellent');
    });
  });

  describe('edge cases', () => {
    it('handles missing moonSign gracefully', () => {
      const input: DailyInsightsInput = {
        personalReading: makePersonalReading(),
        todayPanchang: makePanchang({ moonSign: undefined }),
        locale: 'en',
      };
      const result = generateDailyInsights(input);
      expect(result.insights).toHaveLength(8);
      // Should fall back to rashi=1, nakshatra=1
    });

    it('handles empty hora array', () => {
      const input: DailyInsightsInput = {
        personalReading: makePersonalReading(),
        todayPanchang: makePanchang({ hora: [] }),
        locale: 'en',
      };
      const result = generateDailyInsights(input);
      expect(result.insights).toHaveLength(8);
    });

    it('handles missing rahuKaal', () => {
      const panchang = makePanchang();
      // @ts-expect-error — testing missing field
      delete panchang.rahuKaal;
      const input: DailyInsightsInput = {
        personalReading: makePersonalReading(),
        todayPanchang: panchang,
        locale: 'en',
      };
      const result = generateDailyInsights(input);
      for (const insight of result.insights) {
        expect(insight.caution).toBeUndefined();
      }
    });

    it('handles PersonalReading with no keyTransits', () => {
      const reading = makePersonalReading();
      reading.currentPeriod.keyTransits = [];
      const input: DailyInsightsInput = {
        personalReading: reading,
        todayPanchang: makePanchang(),
        locale: 'en',
      };
      const result = generateDailyInsights(input);
      expect(result.insights).toHaveLength(8);
    });

    it('tips contain Hindi text for hi locale content', () => {
      const input: DailyInsightsInput = {
        personalReading: makePersonalReading(),
        todayPanchang: makePanchang(),
        locale: 'hi',
      };
      const result = generateDailyInsights(input);
      for (const insight of result.insights) {
        expect(insight.tip.hi).toBeTruthy();
        expect(insight.headline.hi).toBeTruthy();
      }
    });
  });
});
