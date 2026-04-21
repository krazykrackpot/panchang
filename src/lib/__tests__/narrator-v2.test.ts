/**
 * Narrator V2 — Emotionally Intelligent Narrative Enhancement Tests
 *
 * Verifies:
 * 1. narrateWithEmpathy produces 5-section narrative for adhama/atyadhama domains
 * 2. narrateStrength produces celebratory language for uttama domains
 * 3. generateActionPlan produces all required fields for any domain
 */

import { describe, it, expect } from 'vitest';
import {
  narrateWithEmpathy,
  narrateStrength,
  generateActionPlan,
} from '@/lib/kundali/domain-synthesis/narrator-v2';
import type { DomainReading } from '@/lib/kundali/domain-synthesis/types';

// ---------------------------------------------------------------------------
// Mock DomainReading factories
// ---------------------------------------------------------------------------

function makeMockReading(overrides: Partial<{
  domain: DomainReading['domain'];
  rating: DomainReading['overallRating']['rating'];
  score: number;
  yogas: DomainReading['natalPromise']['supportingYogas'];
  afflictions: DomainReading['natalPromise']['activeAfflictions'];
  lordQualities: DomainReading['natalPromise']['lordQualities'];
  transitInfluences: DomainReading['currentActivation']['transitInfluences'];
  timelineTriggers: DomainReading['timelineTriggers'];
  remedies: DomainReading['remedies'];
  mahaDashaLordId: number;
  antarDashaLordId: number;
}>): DomainReading {
  const {
    domain = 'career',
    rating = 'madhyama',
    score = 5.5,
    yogas = [],
    afflictions = [],
    lordQualities = [],
    transitInfluences = [],
    timelineTriggers = [],
    remedies = [],
    mahaDashaLordId = 6,
    antarDashaLordId = 3,
  } = overrides;

  return {
    domain,
    overallRating: {
      rating,
      score,
      label: { en: rating, hi: rating },
      color: '#d4a853',
    },
    natalPromise: {
      rating: { rating, score, label: { en: rating }, color: '#d4a853' },
      houseScores: { 10: score },
      lordQualities,
      supportingYogas: yogas,
      activeAfflictions: afflictions,
      vargaConfirmations: [],
      summary: { en: 'Natal summary.', hi: 'जन्म सारांश।' },
    },
    currentActivation: {
      isDashaActive: true,
      mahaDashaLordId,
      antarDashaLordId,
      dashaActivationScore: 6,
      transitInfluences,
      overallActivationScore: 5.5,
      summary: { en: 'Current activation.', hi: 'वर्तमान सक्रियता।' },
    },
    timelineTriggers,
    remedies,
    crossDomainLinks: [],
    headline: { en: 'Headline.', hi: 'शीर्षक।' },
    detailedNarrative: { en: 'Original narrative.', hi: 'मूल कथन।' },
  };
}

// ---------------------------------------------------------------------------
// Adhama mock — weak career reading
// ---------------------------------------------------------------------------

const adhamaReading = makeMockReading({
  domain: 'career',
  rating: 'adhama',
  score: 3.5,
  yogas: [
    { name: { en: 'Budhaditya Yoga', hi: 'बुधादित्य योग' }, category: 'career', strength: 6.5 },
  ],
  afflictions: [
    { name: { en: 'Saturn-Mars conjunction', hi: 'शनि-मंगल युति' }, severity: 'severe' },
  ],
  lordQualities: [
    { lordId: 6, houseInD1: 8, signInD1: 8, dignity: 'enemy', score: 3.0 },
  ],
  transitInfluences: [
    { planetId: 6, transitHouse: 10, nature: 'malefic', intensity: 'high', description: { en: 'Saturn transiting 10th house', hi: 'शनि दशम भाव में गोचर' } },
  ],
  timelineTriggers: [
    {
      startDate: '2026-09-15', endDate: '2027-03-15',
      triggerType: 'transit', planets: [4],
      nature: 'opportunity',
      description: { en: 'Jupiter enters a supportive sign', hi: 'बृहस्पति एक सहायक राशि में प्रवेश करता है' },
    },
  ],
  remedies: [
    {
      type: 'mantra',
      name: { en: 'Shani Mantra', hi: 'शनि मंत्र' },
      instructions: { en: 'Chant "Om Sham Shanaishcharaya Namah" 108 times.', hi: '"ओम शं शनैश्चराय नमः" 108 बार जपें।' },
      targetPlanetId: 6,
      difficulty: 'easy',
    },
  ],
  mahaDashaLordId: 6,
});

// ---------------------------------------------------------------------------
// Atyadhama mock — very weak health reading
// ---------------------------------------------------------------------------

const atyadhamaReading = makeMockReading({
  domain: 'health',
  rating: 'atyadhama',
  score: 2.0,
  afflictions: [
    { name: { en: 'Sixth lord debilitated', hi: 'छठे भाव का स्वामी नीच' }, severity: 'severe' },
  ],
  transitInfluences: [
    { planetId: 2, transitHouse: 1, nature: 'malefic', intensity: 'high', description: { en: 'Mars transiting ascendant', hi: 'मंगल लग्न में गोचर' } },
  ],
  mahaDashaLordId: 2,
});

// ---------------------------------------------------------------------------
// Uttama mock — strong marriage reading
// ---------------------------------------------------------------------------

const uttamaReading = makeMockReading({
  domain: 'marriage',
  rating: 'uttama',
  score: 8.5,
  yogas: [
    { name: { en: 'Venus-Jupiter conjunction', hi: 'शुक्र-बृहस्पति युति' }, category: 'marriage', strength: 9.0 },
    { name: { en: 'Shubha Kartari Yoga', hi: 'शुभ कर्तरी योग' }, category: 'protection', strength: 7.5 },
  ],
  lordQualities: [
    { lordId: 5, houseInD1: 7, signInD1: 2, dignity: 'own', score: 8.0 },
  ],
  transitInfluences: [
    { planetId: 5, transitHouse: 7, nature: 'benefic', intensity: 'high', description: { en: 'Venus transiting 7th house', hi: 'शुक्र सप्तम भाव में गोचर' } },
  ],
  timelineTriggers: [
    {
      startDate: '2026-12-01', endDate: '2027-06-01',
      triggerType: 'transit', planets: [5],
      nature: 'opportunity',
      description: { en: 'Venus enters exaltation', hi: 'शुक्र उच्च राशि में प्रवेश करता है' },
    },
    {
      startDate: '2027-08-01', endDate: '2028-02-01',
      triggerType: 'dasha_change', planets: [6],
      nature: 'challenge',
      description: { en: 'Saturn sub-period begins', hi: 'शनि अंतर्दशा शुरू होती है' },
    },
  ],
});

// ---------------------------------------------------------------------------
// Madhyama mock — moderate wealth reading
// ---------------------------------------------------------------------------

const madhyamaReading = makeMockReading({
  domain: 'wealth',
  rating: 'madhyama',
  score: 5.8,
  mahaDashaLordId: 4,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('narrateWithEmpathy', () => {
  it('produces a 5-section narrative for adhama domains', () => {
    const result = narrateWithEmpathy(adhamaReading, 'en');

    // Step 1: Acknowledge strength
    expect(result.en).toContain('has the support of');
    expect(result.en).toContain('Budhaditya Yoga');

    // Step 2: Name challenge
    expect(result.en).toContain('creates friction');
    expect(result.en).toContain('Saturn-Mars conjunction');

    // Step 3: Time context (dasha + timeline)
    expect(result.en).toContain('dasha');
    expect(result.en).toContain('eases');

    // Step 4: Concrete remedy
    expect(result.en).toContain('navigate this');
    expect(result.en).toContain('Saturday');

    // Step 5: Hope
    expect(result.en).toContain('Looking ahead');
    expect(result.en).toContain('Jupiter enters a supportive sign');
  });

  it('produces Hindi output for adhama domains', () => {
    const result = narrateWithEmpathy(adhamaReading, 'hi');

    expect(result.hi).toBeDefined();
    expect(result.hi!).toContain('बुधादित्य योग');
    expect(result.hi!).toContain('शनि-मंगल युति');
    expect(result.hi!).toContain('दशा');
    expect(result.hi!).toContain('आगे देखते हुए');
  });

  it('produces empathetic narrative for atyadhama domains', () => {
    const result = narrateWithEmpathy(atyadhamaReading, 'en');

    // Should still follow the 5-step framework
    expect(result.en).toContain('has the support of');
    expect(result.en).toContain('creates friction');
    expect(result.en).toContain('dasha');
    expect(result.en).toContain('navigate this');
    expect(result.en).toContain('Looking ahead');
  });

  it('returns original narrative for madhyama domains (no empathy wrapper)', () => {
    const result = narrateWithEmpathy(madhyamaReading, 'en');
    expect(result.en).toBe('Original narrative.');
  });

  it('returns original narrative for uttama domains (no empathy wrapper)', () => {
    const result = narrateWithEmpathy(uttamaReading, 'en');
    expect(result.en).toBe('Original narrative.');
  });
});

describe('narrateStrength', () => {
  it('produces celebratory language for uttama domains', () => {
    const result = narrateStrength(uttamaReading, 'en');

    // Validation
    expect(result.en).toContain('exceptionally well-supported');
    expect(result.en).toContain('rare alignment');

    // Should mention top factors
    expect(result.en).toContain('Venus-Jupiter conjunction');

    // Amplify — bold move suggestion
    expect(result.en).toContain('window for');

    // Timeline
    expect(result.en).toContain('favorable period');
  });

  it('includes strong dignity planets in celebration', () => {
    const result = narrateStrength(uttamaReading, 'en');
    expect(result.en).toContain('Venus');
  });

  it('produces Hindi celebratory output', () => {
    const result = narrateStrength(uttamaReading, 'hi');
    expect(result.hi).toBeDefined();
    expect(result.hi!).toContain('असाधारण');
    expect(result.hi!).toContain('दुर्लभ');
  });

  it('returns original narrative for adhama domains', () => {
    const result = narrateStrength(adhamaReading, 'en');
    expect(result.en).toBe('Original narrative.');
  });

  it('returns original narrative for madhyama domains', () => {
    const result = narrateStrength(madhyamaReading, 'en');
    expect(result.en).toBe('Original narrative.');
  });

  it('mentions challenge timeline as favorable-period endpoint', () => {
    const result = narrateStrength(uttamaReading, 'en');
    // The uttama mock has a challenge trigger in Aug 2027
    expect(result.en).toContain('August 2027');
  });
});

describe('generateActionPlan', () => {
  it('returns all required fields for adhama career reading', () => {
    const plan = generateActionPlan(adhamaReading, 'en');

    expect(plan.lifestyle).toBeDefined();
    expect(plan.lifestyle.en).toBeTruthy();
    expect(plan.lifestyle.hi).toBeTruthy();

    expect(plan.bestDays).toBeDefined();
    expect(Array.isArray(plan.bestDays)).toBe(true);
    expect(plan.bestDays.length).toBe(3);

    expect(plan.avoid).toBeDefined();
    expect(plan.avoid.en).toBeTruthy();

    expect(plan.affirmation).toBeDefined();
    expect(plan.affirmation.en).toBeTruthy();
    expect(plan.affirmation.hi).toBeTruthy();

    expect(plan.weeklyPractice).toBeDefined();
    expect(plan.weeklyPractice.en).toBeTruthy();
  });

  it('returns all required fields for uttama marriage reading', () => {
    const plan = generateActionPlan(uttamaReading, 'en');

    expect(plan.lifestyle.en).toBeTruthy();
    expect(plan.bestDays.length).toBe(3);
    expect(plan.avoid.en).toBeTruthy();
    expect(plan.affirmation.en).toBeTruthy();
    expect(plan.weeklyPractice.en).toBeTruthy();
  });

  it('returns all required fields for madhyama wealth reading', () => {
    const plan = generateActionPlan(madhyamaReading, 'en');

    expect(plan.lifestyle.en).toContain('Steady growth');
    expect(plan.bestDays.length).toBe(3);
    expect(plan.avoid.en).toBeTruthy();
    expect(plan.affirmation.en).toBeTruthy();
    expect(plan.weeklyPractice.en).toBeTruthy();
  });

  it('best days are valid ISO date strings on correct weekday', () => {
    // Career primary planet is Sun (0) → Sunday (0)
    const plan = generateActionPlan(adhamaReading, 'en');
    for (const day of plan.bestDays) {
      expect(day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const d = new Date(day);
      // Career config primaryPlanets[0] = Sun = 0 → Sunday = 0
      expect(d.getDay()).toBe(0);
    }
  });

  it('marriage best days fall on Friday (Venus day)', () => {
    const plan = generateActionPlan(uttamaReading, 'en');
    for (const day of plan.bestDays) {
      const d = new Date(day);
      // Marriage config primaryPlanets[0] = Venus = 5 → Friday = 5
      expect(d.getDay()).toBe(5);
    }
  });

  it('adhama career lifestyle mentions consolidation with Saturn transit', () => {
    const plan = generateActionPlan(adhamaReading, 'en');
    expect(plan.lifestyle.en).toContain('consolidation');
    expect(plan.lifestyle.en).toContain('Saturn');
  });

  it('uttama marriage lifestyle mentions relationship energy at peak', () => {
    const plan = generateActionPlan(uttamaReading, 'en');
    expect(plan.lifestyle.en).toContain('relationship energy');
    expect(plan.lifestyle.en).toContain('peak');
  });

  it('avoid guidance references malefic transit planet day', () => {
    // adhamaReading has Saturn malefic transit → avoid Saturdays
    const plan = generateActionPlan(adhamaReading, 'en');
    expect(plan.avoid.en).toContain('Saturday');
  });

  it('affirmation is domain-specific', () => {
    const careerPlan = generateActionPlan(adhamaReading, 'en');
    const marriagePlan = generateActionPlan(uttamaReading, 'en');
    expect(careerPlan.affirmation.en).not.toBe(marriagePlan.affirmation.en);
    expect(careerPlan.affirmation.en).toContain('work');
    expect(marriagePlan.affirmation.en).toContain('love');
  });
});
