/**
 * Comprehensive AI Reading — Unit Tests
 *
 * Tests for:
 * 1. Birth fingerprint generation (cache key stability)
 * 2. Planet table builder (correct formatting)
 * 3. Comprehensive prompt builder (all sections present)
 * 4. AI response parser (valid and invalid JSON)
 * 5. Special conditions detection
 * 6. Dasha chain builder
 * 7. Domain scores summary
 */

import { describe, it, expect } from 'vitest';
import {
  generateBirthFingerprint,
  buildPlanetTable,
  buildSpecialConditions,
  buildDashaChain,
  buildDomainScoresSummary,
  buildComprehensivePrompt,
  parseAIReadingResponse,
  PROMPT_VERSION,
  LIFE_DOMAINS,
} from '@/lib/kundali/domain-synthesis/comprehensive-prompt';
import type { KundaliData, PlanetPosition, DashaEntry } from '@/types/kundali';
import type { PersonalReading, DomainReading } from '@/lib/kundali/domain-synthesis/types';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

/** Minimal planet position for testing. */
function makePlanet(overrides: Partial<PlanetPosition> & { id: number }): PlanetPosition {
  const { id, ...rest } = overrides;
  return {
    planet: { id, name: { en: `Planet${id}` }, symbol: '', color: '' },
    longitude: 0,
    latitude: 0,
    speed: 0.5,
    sign: rest.sign ?? 1,
    signName: { en: 'Aries' },
    house: rest.house ?? 1,
    nakshatra: { id: rest.nakshatraId ?? 1, name: { en: 'Ashwini' }, lord: { en: 'Ketu' } },
    pada: rest.pada ?? 1,
    degree: rest.degree ?? "0°00'00\"",
    isRetrograde: rest.isRetrograde ?? false,
    isCombust: rest.isCombust ?? false,
    isExalted: rest.isExalted ?? false,
    isDebilitated: rest.isDebilitated ?? false,
    isOwnSign: rest.isOwnSign ?? false,
    isVargottama: rest.isVargottama ?? false,
    isMrityuBhaga: rest.isMrityuBhaga ?? false,
    isPushkarNavamsha: rest.isPushkarNavamsha ?? false,
    isPushkarBhaga: rest.isPushkarBhaga ?? false,
    ...rest,
  } as PlanetPosition;
}

/** Minimal kundali data for testing. */
function makeKundali(overrides?: Partial<KundaliData>): KundaliData {
  return {
    birthData: {
      name: 'Test Native',
      date: '1990-06-15',
      time: '14:30',
      place: 'Delhi, India',
      lat: 28.6139,
      lng: 77.209,
      timezone: 'Asia/Kolkata',
      ayanamsha: 'lahiri',
    },
    ascendant: { degree: 180.5, sign: 7, signName: { en: 'Libra' } },
    planets: [
      makePlanet({ id: 0, sign: 9, house: 4, degree: "26°19'56\"", isExalted: false }),
      makePlanet({ id: 1, sign: 8, house: 3, degree: "19°06'34\"" }),
      makePlanet({ id: 2, sign: 11, house: 6, degree: "1°03'26\"" }),
      makePlanet({ id: 3, sign: 10, house: 5, degree: "7°39'25\"", isRetrograde: true }),
      makePlanet({ id: 4, sign: 8, house: 3, degree: "9°24'30\"" }),
      makePlanet({ id: 5, sign: 10, house: 5, degree: "12°40'42\"" }),
      makePlanet({ id: 6, sign: 7, house: 2, degree: "9°53'35\"", isExalted: true }),
      makePlanet({ id: 7, sign: 3, house: 10, degree: "9°43'07\"", isRetrograde: true }),
      makePlanet({ id: 8, sign: 9, house: 4, degree: "9°43'07\"", isRetrograde: true }),
    ],
    houses: [
      { house: 1, degree: 180.5, sign: 7, signName: { en: 'Libra' }, lord: 'Venus', lordName: { en: 'Venus' } },
      { house: 2, degree: 210.0, sign: 8, signName: { en: 'Scorpio' }, lord: 'Mars', lordName: { en: 'Mars' } },
    ],
    chart: { houses: [], ascendantDeg: 180.5, ascendantSign: 7 },
    navamshaChart: { houses: [], ascendantDeg: 0, ascendantSign: 1 },
    dashas: [
      {
        planet: 'Saturn',
        planetName: { en: 'Saturn' },
        startDate: '2020-01-01',
        endDate: '2039-01-01',
        level: 'maha' as const,
        subPeriods: [
          {
            planet: 'Mercury',
            planetName: { en: 'Mercury' },
            startDate: '2025-01-01',
            endDate: '2027-09-01',
            level: 'antar' as const,
            subPeriods: [
              {
                planet: 'Venus',
                planetName: { en: 'Venus' },
                startDate: '2026-01-01',
                endDate: '2026-06-01',
                level: 'pratyantar' as const,
              },
            ],
          },
        ],
      },
      {
        planet: 'Mercury',
        planetName: { en: 'Mercury' },
        startDate: '2039-01-01',
        endDate: '2056-01-01',
        level: 'maha' as const,
      },
    ],
    shadbala: [
      {
        planet: 'Sun',
        planetName: { en: 'Sun' },
        totalStrength: 420.5,
        sthanaBala: 120.0,
        digBala: 40.0,
        kalaBala: 150.0,
        cheshtaBala: 30.0,
        naisargikaBala: 60.0,
        drikBala: 20.5,
      },
    ],
    ayanamshaValue: 24.125,
    julianDay: 2448087.5,
    ...overrides,
  } as KundaliData;
}

/** Minimal personal reading for testing. */
function makePersonalReading(): PersonalReading {
  const makeDomainReading = (domain: string): DomainReading => ({
    domain: domain as DomainReading['domain'],
    overallRating: { rating: 'madhyama', score: 5.5, label: { en: 'Moderate' }, color: '#f59e0b' },
    natalPromise: {
      rating: { rating: 'madhyama', score: 5.0, label: { en: 'Moderate' }, color: '#f59e0b' },
      houseScores: { 1: 6.0, 7: 5.0 },
      lordQualities: [{ lordId: 5, houseInD1: 5, signInD1: 10, dignity: 'neutral', score: 5.0 }],
      supportingYogas: [
        { name: { en: 'Gajakesari Yoga' }, category: 'wealth', strength: 7.0 },
      ],
      activeAfflictions: [
        { name: { en: 'Mangal Dosha' }, severity: 'moderate' as const },
      ],
      vargaConfirmations: [],
      summary: { en: 'Test natal summary' },
    },
    currentActivation: {
      isDashaActive: true,
      mahaDashaLordId: 6,
      antarDashaLordId: 3,
      dashaActivationScore: 6.0,
      transitInfluences: [],
      overallActivationScore: 5.5,
      summary: { en: 'Test activation summary' },
    },
    timelineTriggers: [],
    remedies: [],
    crossDomainLinks: [],
    headline: { en: 'Test headline for ' + domain },
    detailedNarrative: { en: 'Test narrative' },
  });

  return {
    kundaliId: 'test-123',
    computedAt: '2026-04-21T00:00:00Z',
    domains: LIFE_DOMAINS.map(makeDomainReading),
    currentPeriod: {
      dashaSummary: { en: 'Saturn Maha / Mercury Antar' },
      keyTransits: [],
      activeDomainsNow: ['career'],
      challengedDomainsNow: ['health'],
      periodScore: 5.5,
      periodRating: { rating: 'madhyama', score: 5.5, label: { en: 'Moderate' }, color: '#f59e0b' },
      summary: { en: 'Test period summary' },
    },
    topInsight: { en: 'Test top insight' },
  };
}

// ===========================================================================
// Tests
// ===========================================================================

describe('generateBirthFingerprint', () => {
  it('produces a 32-char hex string', () => {
    const fp = generateBirthFingerprint(makeKundali());
    expect(fp).toMatch(/^[0-9a-f]{32}$/);
  });

  it('is deterministic — same input produces same output', () => {
    const k = makeKundali();
    const fp1 = generateBirthFingerprint(k);
    const fp2 = generateBirthFingerprint(k);
    expect(fp1).toBe(fp2);
  });

  it('changes when birth date changes', () => {
    const k1 = makeKundali();
    const k2 = makeKundali({
      birthData: { ...k1.birthData, date: '1990-06-16' },
    });
    expect(generateBirthFingerprint(k1)).not.toBe(generateBirthFingerprint(k2));
  });

  it('changes when birth time changes', () => {
    const k1 = makeKundali();
    const k2 = makeKundali({
      birthData: { ...k1.birthData, time: '14:31' },
    });
    expect(generateBirthFingerprint(k1)).not.toBe(generateBirthFingerprint(k2));
  });

  it('changes when coordinates change beyond 4dp', () => {
    const k1 = makeKundali();
    const k2 = makeKundali({
      birthData: { ...k1.birthData, lat: 28.614 },
    });
    // 28.6139 rounds to 28.6139, 28.614 rounds to 28.6140 — different at 4dp
    expect(generateBirthFingerprint(k1)).not.toBe(generateBirthFingerprint(k2));
  });

  it('is stable for insignificant coordinate changes (< 0.00005)', () => {
    const k1 = makeKundali();
    const k2 = makeKundali({
      birthData: { ...k1.birthData, lat: 28.61391 },
    });
    // Both round to 28.6139 at 4dp
    expect(generateBirthFingerprint(k1)).toBe(generateBirthFingerprint(k2));
  });

  it('changes when ayanamsha changes', () => {
    const k1 = makeKundali();
    const k2 = makeKundali({
      birthData: { ...k1.birthData, ayanamsha: 'raman' },
    });
    expect(generateBirthFingerprint(k1)).not.toBe(generateBirthFingerprint(k2));
  });
});

describe('buildPlanetTable', () => {
  it('produces a table with header + divider + 9 planet rows', () => {
    const k = makeKundali();
    const table = buildPlanetTable(k.planets);
    const lines = table.split('\n');
    // header + divider + 9 rows = 11 lines
    expect(lines.length).toBe(11);
  });

  it('includes planet names', () => {
    const k = makeKundali();
    const table = buildPlanetTable(k.planets);
    expect(table).toContain('Sun');
    expect(table).toContain('Moon');
    expect(table).toContain('Saturn');
    expect(table).toContain('Rahu');
    expect(table).toContain('Ketu');
  });

  it('marks retrograde planets with R', () => {
    const k = makeKundali();
    const table = buildPlanetTable(k.planets);
    const lines = table.split('\n');
    // Mercury (id=3) is retrograde
    const mercuryLine = lines.find(l => l.startsWith('Mercury'));
    expect(mercuryLine).toContain('| R');
  });

  it('includes degree values', () => {
    const k = makeKundali();
    const table = buildPlanetTable(k.planets);
    expect(table).toContain("26°19'56\"");
    expect(table).toContain("19°06'34\"");
  });
});

describe('buildSpecialConditions', () => {
  it('detects exalted planets', () => {
    const k = makeKundali();
    const conditions = buildSpecialConditions(k.planets);
    expect(conditions).toContain('Saturn is EXALTED');
  });

  it('detects retrograde planets', () => {
    const k = makeKundali();
    const conditions = buildSpecialConditions(k.planets);
    expect(conditions).toContain('Mercury is RETROGRADE');
    expect(conditions).toContain('Rahu is RETROGRADE');
    expect(conditions).toContain('Ketu is RETROGRADE');
  });

  it('returns "None of note." when no special conditions', () => {
    const planets = [makePlanet({ id: 0 })];
    const conditions = buildSpecialConditions(planets);
    expect(conditions).toBe('None of note.');
  });

  it('detects multiple conditions on same planet', () => {
    const planets = [
      makePlanet({ id: 3, isRetrograde: true, isCombust: true }),
    ];
    const conditions = buildSpecialConditions(planets);
    expect(conditions).toContain('RETROGRADE');
    expect(conditions).toContain('COMBUST');
  });

  it('detects vargottama and pushkar conditions', () => {
    const planets = [
      makePlanet({ id: 4, isVargottama: true, isPushkarNavamsha: true }),
    ];
    const conditions = buildSpecialConditions(planets);
    expect(conditions).toContain('VARGOTTAMA');
    expect(conditions).toContain('PUSHKAR NAVAMSHA');
  });
});

describe('buildDashaChain', () => {
  it('shows maha, antar, and pratyantar dashas', () => {
    const k = makeKundali();
    const chain = buildDashaChain(k.dashas);
    expect(chain).toContain('Maha Dasha: Saturn');
    expect(chain).toContain('Antar Dasha: Mercury');
    expect(chain).toContain('Pratyantar: Venus');
  });

  it('shows upcoming maha dashas', () => {
    const k = makeKundali();
    const chain = buildDashaChain(k.dashas);
    expect(chain).toContain('Upcoming Maha Dashas');
    expect(chain).toContain('Mercury');
  });

  it('handles empty dashas gracefully', () => {
    const chain = buildDashaChain([]);
    expect(chain).toBe('');
  });
});

describe('buildDomainScoresSummary', () => {
  it('includes all 8 domains', () => {
    const reading = makePersonalReading();
    const summary = buildDomainScoresSummary(reading);
    for (const domain of LIFE_DOMAINS) {
      expect(summary).toContain(domain.toUpperCase());
    }
  });

  it('includes scores and ratings', () => {
    const reading = makePersonalReading();
    const summary = buildDomainScoresSummary(reading);
    expect(summary).toContain('5.5/10');
    expect(summary).toContain('madhyama');
  });

  it('includes yoga and dosha names', () => {
    const reading = makePersonalReading();
    const summary = buildDomainScoresSummary(reading);
    expect(summary).toContain('Gajakesari Yoga');
    expect(summary).toContain('Mangal Dosha');
  });
});

describe('buildComprehensivePrompt', () => {
  it('returns systemPrompt, userPayload, and promptVersion', () => {
    const k = makeKundali();
    const reading = makePersonalReading();
    const result = buildComprehensivePrompt(k, reading, 35);
    expect(result.systemPrompt).toBeTruthy();
    expect(result.userPayload).toBeTruthy();
    expect(result.promptVersion).toBe(PROMPT_VERSION);
  });

  it('system prompt contains JSON format instructions', () => {
    const k = makeKundali();
    const reading = makePersonalReading();
    const { systemPrompt } = buildComprehensivePrompt(k, reading);
    expect(systemPrompt).toContain('overallInsight');
    expect(systemPrompt).toContain('health');
    expect(systemPrompt).toContain('wealth');
    expect(systemPrompt).toContain('career');
    expect(systemPrompt).toContain('marriage');
    expect(systemPrompt).toContain('valid JSON only');
  });

  it('system prompt includes age when provided', () => {
    const k = makeKundali();
    const reading = makePersonalReading();
    const { systemPrompt } = buildComprehensivePrompt(k, reading, 35);
    expect(systemPrompt).toContain('35 years old');
  });

  it('user payload includes all chart sections', () => {
    const k = makeKundali();
    const reading = makePersonalReading();
    const { userPayload } = buildComprehensivePrompt(k, reading);
    expect(userPayload).toContain('=== BIRTH DATA ===');
    expect(userPayload).toContain('=== ASCENDANT ===');
    expect(userPayload).toContain('=== PLANET POSITIONS ===');
    expect(userPayload).toContain('=== SPECIAL CONDITIONS ===');
    expect(userPayload).toContain('=== HOUSE CUSPS ===');
    expect(userPayload).toContain('=== VIMSHOTTARI DASHA (current) ===');
    expect(userPayload).toContain('=== DOMAIN ANALYSIS (from rule engine');
    expect(userPayload).toContain('=== SHADBALA (planetary strengths) ===');
  });

  it('user payload includes actual birth data values', () => {
    const k = makeKundali();
    const reading = makePersonalReading();
    const { userPayload } = buildComprehensivePrompt(k, reading);
    // Name is intentionally excluded from the prompt (chart-based, not name-based)
    expect(userPayload).not.toContain('Test Native');
    expect(userPayload).toContain('1990-06-15');
    expect(userPayload).toContain('14:30');
    expect(userPayload).toContain('Delhi, India');
    expect(userPayload).toContain('lahiri');
  });

  it('user payload includes planet positions with degrees', () => {
    const k = makeKundali();
    const reading = makePersonalReading();
    const { userPayload } = buildComprehensivePrompt(k, reading);
    expect(userPayload).toContain("26°19'56\"");
    expect(userPayload).toContain("9°53'35\"");
  });

  it('user payload includes shadbala data', () => {
    const k = makeKundali();
    const reading = makePersonalReading();
    const { userPayload } = buildComprehensivePrompt(k, reading);
    expect(userPayload).toContain('Sun: Total=420.5');
    expect(userPayload).toContain('Sthana=120.0');
  });
});

describe('parseAIReadingResponse', () => {
  it('parses valid JSON response', () => {
    const response = JSON.stringify({
      overallInsight: 'Test insight covering all domains.',
      health: { reading: 'Health reading text.' },
      wealth: { reading: 'Wealth reading text.' },
      career: { reading: 'Career reading text.' },
      marriage: { reading: 'Marriage reading text.' },
      children: { reading: 'Children reading text.' },
      family: { reading: 'Family reading text.' },
      spiritual: { reading: 'Spiritual reading text.' },
      education: { reading: 'Education reading text.' },
    });

    const parsed = parseAIReadingResponse(response);
    expect(parsed.overallInsight).toBe('Test insight covering all domains.');
    expect(parsed.domains.health).toBe('Health reading text.');
    expect(parsed.domains.wealth).toBe('Wealth reading text.');
    expect(Object.keys(parsed.domains)).toHaveLength(8);
  });

  it('strips markdown code fences', () => {
    const inner = JSON.stringify({
      overallInsight: 'Insight.',
      health: { reading: 'H' },
      wealth: { reading: 'W' },
      career: { reading: 'C' },
      marriage: { reading: 'M' },
      children: { reading: 'Ch' },
      family: { reading: 'F' },
      spiritual: { reading: 'S' },
      education: { reading: 'E' },
    });
    const wrapped = '```json\n' + inner + '\n```';
    const parsed = parseAIReadingResponse(wrapped);
    expect(parsed.overallInsight).toBe('Insight.');
    expect(parsed.domains.health).toBe('H');
  });

  it('throws on missing overallInsight', () => {
    const response = JSON.stringify({
      health: { reading: 'H' },
    });
    expect(() => parseAIReadingResponse(response)).toThrow('Missing or invalid overallInsight');
  });

  it('throws on missing domain reading', () => {
    const response = JSON.stringify({
      overallInsight: 'Test.',
      health: { reading: 'H' },
      wealth: { reading: 'W' },
      // missing career, marriage, children, family, spiritual, education
    });
    expect(() => parseAIReadingResponse(response)).toThrow('Missing or invalid reading for domain: career');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseAIReadingResponse('not json at all')).toThrow();
  });

  it('throws when domain has wrong structure', () => {
    const response = JSON.stringify({
      overallInsight: 'Test.',
      health: 'just a string not an object',
      wealth: { reading: 'W' },
      career: { reading: 'C' },
      marriage: { reading: 'M' },
      children: { reading: 'Ch' },
      family: { reading: 'F' },
      spiritual: { reading: 'S' },
      education: { reading: 'E' },
    });
    expect(() => parseAIReadingResponse(response)).toThrow('Missing or invalid reading for domain: health');
  });
});

describe('PROMPT_VERSION and LIFE_DOMAINS', () => {
  it('PROMPT_VERSION is a non-empty string', () => {
    expect(PROMPT_VERSION).toBeTruthy();
    expect(typeof PROMPT_VERSION).toBe('string');
  });

  it('LIFE_DOMAINS contains exactly 8 domains', () => {
    expect(LIFE_DOMAINS).toHaveLength(8);
    expect(LIFE_DOMAINS).toContain('health');
    expect(LIFE_DOMAINS).toContain('wealth');
    expect(LIFE_DOMAINS).toContain('career');
    expect(LIFE_DOMAINS).toContain('marriage');
    expect(LIFE_DOMAINS).toContain('children');
    expect(LIFE_DOMAINS).toContain('family');
    expect(LIFE_DOMAINS).toContain('spiritual');
    expect(LIFE_DOMAINS).toContain('education');
  });

  it('LIFE_DOMAINS does NOT contain currentPeriod', () => {
    expect(LIFE_DOMAINS).not.toContain('currentPeriod');
  });
});
