import { describe, it, expect } from 'vitest';
import { buildVargaNarrative } from '../tippanni/varga-narrative';
import type { DeepVargaResult } from '../tippanni/varga-tippanni-types-v2';

// ---------------------------------------------------------------------------
// Mock data — shape matches varga-tippanni-types-v2.ts exactly
// ---------------------------------------------------------------------------

const mockResult: DeepVargaResult = {
  chartId: 'D9',
  domain: 'marriage',
  crossCorrelation: {
    dignityShifts: [
      {
        planetId: 5,
        planetName: { en: 'Venus', hi: 'शुक्र' },
        d1Sign: 11,
        dxxSign: 2,
        d1Dignity: 'neutral',
        dxxDignity: 'own',
        shift: 'improved',
        isVargottama: false,
        narrative: { en: 'Venus improves from Aquarius to Taurus (own sign)', hi: 'शुक्र कुम्भ से वृषभ (स्वगृह) में सुधार' },
      },
      {
        planetId: 2,
        planetName: { en: 'Mars', hi: 'मंगल' },
        d1Sign: 1,
        dxxSign: 1,
        d1Dignity: 'own',
        dxxDignity: 'own',
        shift: 'same',
        isVargottama: true,
        narrative: { en: 'Mars is vargottama in Aries', hi: 'मंगल मेष में वर्गोत्तम' },
      },
      {
        planetId: 6,
        planetName: { en: 'Saturn', hi: 'शनि' },
        d1Sign: 10,
        dxxSign: 4,
        d1Dignity: 'own',
        dxxDignity: 'debilitated',
        shift: 'declined',
        isVargottama: false,
        narrative: { en: 'Saturn declines from Capricorn to Cancer (debilitated)', hi: 'शनि मकर से कर्क (नीच) में गिरावट' },
      },
    ],
    vargottamaPlanets: [2],
    pushkaraChecks: [
      { planetId: 5, isPushkaraNavamsha: true, isPushkaraBhaga: false, degree: 14.5 },
    ],
    gandantaChecks: [
      { planetId: 8, isGandanta: true, severity: 'moderate', proximityDegrees: 1.2, junction: 'Pisces-Aries' },
    ],
    vargaVisesha: [
      { planetId: 4, classification: 'gopuramsha' },
      { planetId: 0, classification: 'none' },
    ],
    keyHouseLords: [
      { house: 1, lordId: 1, lordSign: 11, lordDignity: 'friend', narrative: { en: 'Lagna lord Moon in 11th', hi: 'लग्नेश चन्द्र 11वें में' } },
      { house: 7, lordId: 6, lordSign: 9, lordDignity: 'neutral', narrative: { en: '7th lord Saturn in 9th', hi: '7वें भाव का स्वामी शनि 9वें में' } },
      { house: 9, lordId: 4, lordSign: 4, lordDignity: 'exalted', narrative: { en: '9th lord Jupiter exalted in 4th', hi: '9वें भाव का स्वामी गुरु उच्च 4थे में' } },
    ],
    jaiminiKarakas: [
      { karaka: 'Darakaraka', planetId: 6, sign: 9, house: 10, narrative: { en: 'DK Saturn in 10th in Sagittarius', hi: 'दारकारक शनि 10वें में धनु में' } },
    ],
    argalaOnKeyHouses: [
      { house: 7, supporting: [4], obstructing: [] },
    ],
    savOverlay: [
      { sign: 2, bindus: 32, quality: 'strong' },
      { sign: 8, bindus: 18, quality: 'weak' },
    ],
    dashaLordPlacement: {
      lordId: 4,
      sign: 4,
      house: 4,
      dignity: 'exalted',
      narrative: { en: 'Jupiter Mahadasha lord exalted in 4th', hi: 'गुरु महादशा स्वामी 4थे में उच्च' },
    },
    yogasInChart: [
      {
        name: 'Gajakesari Yoga',
        planets: [1, 4],
        significance: { en: 'Wisdom and fortune in marriage', hi: 'विवाह में बुद्धि और भाग्य' },
      },
    ],
    aspectsOnKeyHouses: [
      {
        house: 7,
        aspectingPlanets: [
          { id: 4, type: 'benefic' },
          { id: 6, type: 'malefic' },
        ],
      },
    ],
    parivartanas: [
      {
        planet1Id: 1,
        planet2Id: 6,
        sign1: 11,
        sign2: 4,
        significance: { en: 'Moon-Saturn exchange strengthens emotional discipline', hi: 'चन्द्र-शनि विनिमय भावनात्मक अनुशासन को बल देता है' },
      },
    ],
    dispositorChain: {
      chain: [{ planetId: 1, sign: 11 }, { planetId: 6, sign: 4 }, { planetId: 1, sign: 11 }],
      finalDispositor: null,
      isCircular: true,
      narrative: { en: 'Circular dispositor chain between Moon and Saturn', hi: 'चन्द्र और शनि के बीच वृत्ताकार अधिपति-श्रृंखला' },
    },
  },
  promiseDelivery: {
    d1Promise: 72,
    dxxDelivery: 81,
    verdictKey: 'strong_excellent',
    verdict: { en: 'Supreme manifestation — both promise and delivery are powerful.', hi: 'सर्वोच्च अभिव्यक्ति — वचन और फल दोनों प्रबल हैं।' },
  },
  narrative: { en: '', hi: '' },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('buildVargaNarrative', () => {
  it('produces non-empty en and hi text', () => {
    const result = buildVargaNarrative(mockResult, 'en');
    expect(result.en.length).toBeGreaterThan(100);
    expect(result.hi.length).toBeGreaterThan(50);
  });

  it('contains multiple paragraphs (at least 5 for a rich dataset)', () => {
    const result = buildVargaNarrative(mockResult, 'en');
    const paragraphs = result.en.split('\n\n').filter(Boolean);
    expect(paragraphs.length).toBeGreaterThanOrEqual(5);
  });

  it('mentions chart ID and domain in the opening paragraph', () => {
    const result = buildVargaNarrative(mockResult, 'en');
    expect(result.en).toContain('D9');
    expect(result.en).toContain('marriage');
  });

  it('includes dignity shift information', () => {
    const result = buildVargaNarrative(mockResult, 'en');
    expect(result.en).toContain('Venus');
    expect(result.en).toContain('improves');
  });

  it('includes promise/delivery scores', () => {
    const result = buildVargaNarrative(mockResult, 'en');
    expect(result.en).toContain('72/100');
    expect(result.en).toContain('81/100');
  });

  it('includes dasha information when available', () => {
    const result = buildVargaNarrative(mockResult, 'en');
    expect(result.en).toContain('Mahadasha');
    expect(result.en).toContain('Jupiter');
  });

  it('includes vargottama mention', () => {
    const result = buildVargaNarrative(mockResult, 'en');
    expect(result.en).toContain('Vargottama');
  });

  it('includes practical guidance', () => {
    const result = buildVargaNarrative(mockResult, 'en');
    expect(result.en).toContain('Practical guidance');
  });

  it('handles empty cross-correlation gracefully', () => {
    const empty: DeepVargaResult = {
      chartId: 'D10',
      domain: 'career',
      crossCorrelation: {
        dignityShifts: [],
        vargottamaPlanets: [],
        pushkaraChecks: [],
        gandantaChecks: [],
        vargaVisesha: [],
        keyHouseLords: [],
        jaiminiKarakas: [],
        argalaOnKeyHouses: [],
        savOverlay: [],
        dashaLordPlacement: null,
        yogasInChart: [],
        aspectsOnKeyHouses: [],
        parivartanas: [],
        dispositorChain: {
          chain: [],
          finalDispositor: null,
          isCircular: false,
          narrative: { en: '', hi: '' },
        },
      },
      promiseDelivery: {
        d1Promise: 45,
        dxxDelivery: 30,
        verdictKey: 'good_modest',
        verdict: { en: 'Moderate results expected.', hi: 'मध्यम परिणाम अपेक्षित।' },
      },
      narrative: { en: '', hi: '' },
    };
    const result = buildVargaNarrative(empty, 'en');
    // Should still produce at least P1 (minimal) + P5 (always present) + P7 (always present)
    expect(result.en.length).toBeGreaterThan(20);
    const paragraphs = result.en.split('\n\n').filter(Boolean);
    expect(paragraphs.length).toBeGreaterThanOrEqual(3);
  });

  it('produces Hindi output matching paragraph count', () => {
    const result = buildVargaNarrative(mockResult, 'hi');
    const enParagraphs = result.en.split('\n\n').filter(Boolean);
    const hiParagraphs = result.hi.split('\n\n').filter(Boolean);
    expect(hiParagraphs.length).toBe(enParagraphs.length);
  });

  it('handles a career chart (D10) domain correctly', () => {
    const careerResult: DeepVargaResult = {
      ...mockResult,
      chartId: 'D10',
      domain: 'career',
    };
    const result = buildVargaNarrative(careerResult, 'en');
    expect(result.en).toContain('D10');
    expect(result.en).toContain('career');
  });
});
