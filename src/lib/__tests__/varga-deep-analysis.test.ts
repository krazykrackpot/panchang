/**
 * Tests for Varga Deep Analysis — Promise/Delivery Scoring Engine
 */
import { describe, it, expect } from 'vitest';
import {
  scorePromise,
  scoreDelivery,
  getVerdict,
  type PromiseInput,
  type DeliveryInput,
} from '../tippanni/varga-promise-delivery';
import {
  computeCombustionInDxx,
  computeRetroInDxx,
} from '../tippanni/varga-deep-analysis';

describe('scorePromise', () => {
  it('returns score ≥80 for strong signals', () => {
    const input: PromiseInput = {
      beneficOccupants: 2,
      maleficOccupants: 0,
      lordInKendra: true,
      lordInTrikona: true,
      lordInDusthana: false,
      lordDignity: 'exalted',
      beneficAspects: 2,
      maleficAspects: 0,
      karakaShadbala: 1.5,
      savScore: 35,
    };
    const score = scorePromise(input);
    expect(score).toBeGreaterThanOrEqual(80);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('returns score ≤30 for weak signals', () => {
    const input: PromiseInput = {
      beneficOccupants: 0,
      maleficOccupants: 3,
      lordInKendra: false,
      lordInTrikona: false,
      lordInDusthana: true,
      lordDignity: 'debilitated',
      beneficAspects: 0,
      maleficAspects: 2,
      karakaShadbala: 0.5,
      savScore: 18,
    };
    const score = scorePromise(input);
    expect(score).toBeLessThanOrEqual(30);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('returns baseline 50 for neutral signals', () => {
    const input: PromiseInput = {
      beneficOccupants: 0,
      maleficOccupants: 0,
      lordInKendra: false,
      lordDignity: 'neutral',
      beneficAspects: 0,
      maleficAspects: 0,
      karakaShadbala: 0.8,
      savScore: 26,
    };
    const score = scorePromise(input);
    expect(score).toBe(50);
  });

  it('clamps to 0 when extremely negative', () => {
    const input: PromiseInput = {
      beneficOccupants: 0,
      maleficOccupants: 5,
      lordInKendra: false,
      lordInDusthana: true,
      lordDignity: 'debilitated',
      beneficAspects: 0,
      maleficAspects: 5,
      karakaShadbala: 0.3,
      savScore: 10,
    };
    expect(scorePromise(input)).toBe(0);
  });

  it('clamps to 100 when extremely positive', () => {
    const input: PromiseInput = {
      beneficOccupants: 4,
      maleficOccupants: 0,
      lordInKendra: true,
      lordInTrikona: true,
      lordDignity: 'exalted',
      beneficAspects: 4,
      maleficAspects: 0,
      karakaShadbala: 2.0,
      savScore: 40,
    };
    expect(scorePromise(input)).toBe(100);
  });
});

describe('scoreDelivery', () => {
  it('returns high score with yogas, vargottama, and pushkara', () => {
    const input: DeliveryInput = {
      beneficOccupants: 1,
      maleficOccupants: 0,
      lordInKendra: true,
      lordDignity: 'own',
      beneficAspects: 1,
      maleficAspects: 0,
      karakaShadbala: 1.2,
      savScore: 32,
      yogaCount: 2,
      vargottamaCount: 2,
      pushkaraCount: 1,
      gandantaCount: 0,
    };
    const score = scoreDelivery(input);
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it('returns low score with gandanta and weak signals', () => {
    const input: DeliveryInput = {
      beneficOccupants: 0,
      maleficOccupants: 2,
      lordInKendra: false,
      lordInDusthana: true,
      lordDignity: 'enemy',
      beneficAspects: 0,
      maleficAspects: 2,
      karakaShadbala: 0.4,
      savScore: 15,
      yogaCount: 0,
      vargottamaCount: 0,
      pushkaraCount: 0,
      gandantaCount: 3,
    };
    const score = scoreDelivery(input);
    expect(score).toBeLessThanOrEqual(25);
  });
});

describe('getVerdict', () => {
  it('returns strong_excellent for high d1 + high dxx', () => {
    const result = getVerdict(85, 90);
    expect(result.verdictKey).toBe('strong_excellent');
    expect(result.verdict.en).toContain('Supreme');
    expect(result.d1Promise).toBe(85);
    expect(result.dxxDelivery).toBe(90);
  });

  it('returns weak_excellent for low d1 + high dxx', () => {
    const result = getVerdict(15, 85);
    expect(result.verdictKey).toBe('weak_excellent');
    expect(result.verdict.en).toContain('Unexpected');
    expect(result.verdict.hi).toBeTruthy();
  });

  it('returns strong_weak for high d1 + low dxx', () => {
    const result = getVerdict(80, 10);
    expect(result.verdictKey).toBe('strong_weak');
    expect(result.verdict.en).toBeTruthy();
    expect(result.verdict.hi).toBeTruthy();
  });

  it('returns modest_modest for mid-range scores', () => {
    const result = getVerdict(35, 40);
    expect(result.verdictKey).toBe('modest_modest');
    expect(result.verdict.en).toContain('Underwhelming');
  });

  it('returns weak_weak for very low scores', () => {
    const result = getVerdict(10, 15);
    expect(result.verdictKey).toBe('weak_weak');
  });

  it('returns good_favourable for moderate-high scores', () => {
    const result = getVerdict(60, 65);
    expect(result.verdictKey).toBe('good_favourable');
  });

  it('all 16 verdict keys are unique and well-formed', () => {
    const tiers = [10, 35, 60, 85]; // weak, modest, good, strong
    const keys = new Set<string>();
    for (const d1 of tiers) {
      for (const dxx of tiers) {
        const result = getVerdict(d1, dxx);
        keys.add(result.verdictKey);
        expect(result.verdict.en.length).toBeGreaterThan(20);
        expect(result.verdict.hi).toBeTruthy();
      }
    }
    expect(keys.size).toBe(16);
  });
});

describe('combustion in Dxx', () => {
  it('detects combust planets', () => {
    const mockPlanets = [
      { planet: { id: 5, name: { en: 'Venus', hi: 'शुक्र' } }, isCombust: true, isRetrograde: false, longitude: 45 },
      { planet: { id: 4, name: { en: 'Jupiter', hi: 'बृहस्पति' } }, isCombust: false, isRetrograde: false, longitude: 120 },
    ] as any;
    const result = computeCombustionInDxx(mockPlanets);
    expect(result.some(c => c.planetId === 5 && c.isCombust)).toBe(true);
    expect(result.some(c => c.planetId === 4 && c.isCombust)).toBe(false);
  });

  it('excludes Sun from combustion check', () => {
    const mockPlanets = [
      { planet: { id: 0, name: { en: 'Sun', hi: 'सूर्य' } }, isCombust: false, isRetrograde: false, longitude: 45 },
    ] as any;
    const result = computeCombustionInDxx(mockPlanets);
    expect(result.length).toBe(0);
  });

  it('generates narrative for combust planet', () => {
    const mockPlanets = [
      { planet: { id: 0, name: { en: 'Sun', hi: 'सूर्य' } }, isCombust: false, isRetrograde: false, longitude: 45 },
      { planet: { id: 5, name: { en: 'Venus', hi: 'शुक्र' } }, isCombust: true, isRetrograde: false, longitude: 48 },
    ] as any;
    const result = computeCombustionInDxx(mockPlanets);
    const venus = result.find(c => c.planetId === 5);
    expect(venus?.narrative.en).toContain('Venus is combust');
    expect(venus?.narrative.hi).toBeTruthy();
  });

  it('excludes Rahu and Ketu from combustion check', () => {
    const mockPlanets = [
      { planet: { id: 7, name: { en: 'Rahu', hi: 'राहु' } }, isCombust: false, isRetrograde: true, longitude: 100 },
      { planet: { id: 8, name: { en: 'Ketu', hi: 'केतु' } }, isCombust: false, isRetrograde: true, longitude: 280 },
    ] as any;
    const result = computeCombustionInDxx(mockPlanets);
    expect(result.length).toBe(0);
  });
});

describe('retrogression in Dxx', () => {
  it('detects retrograde Mars', () => {
    const mockPlanets = [
      { planet: { id: 2, name: { en: 'Mars', hi: 'मंगल' } }, isRetrograde: true, isCombust: false },
    ] as any;
    const result = computeRetroInDxx(mockPlanets);
    expect(result.some(r => r.planetId === 2 && r.isRetrograde)).toBe(true);
  });

  it('ignores Sun/Moon/Rahu/Ketu for retro', () => {
    const mockPlanets = [
      { planet: { id: 0 }, isRetrograde: false, isCombust: false },
      { planet: { id: 1 }, isRetrograde: false, isCombust: false },
      { planet: { id: 7 }, isRetrograde: true, isCombust: false },
      { planet: { id: 8 }, isRetrograde: true, isCombust: false },
    ] as any;
    const result = computeRetroInDxx(mockPlanets);
    expect(result.length).toBe(0);
  });

  it('generates narrative for retrograde Jupiter', () => {
    const mockPlanets = [
      { planet: { id: 4, name: { en: 'Jupiter', hi: 'गुरु' } }, isRetrograde: true, isCombust: false },
    ] as any;
    const result = computeRetroInDxx(mockPlanets);
    const jupiter = result.find(r => r.planetId === 4);
    expect(jupiter?.narrative.en).toContain('Jupiter retrograde');
    expect(jupiter?.narrative.hi).toBeTruthy();
  });

  it('returns empty narrative for non-retrograde planet', () => {
    const mockPlanets = [
      { planet: { id: 6, name: { en: 'Saturn', hi: 'शनि' } }, isRetrograde: false, isCombust: false },
    ] as any;
    const result = computeRetroInDxx(mockPlanets);
    const saturn = result.find(r => r.planetId === 6);
    expect(saturn?.isRetrograde).toBe(false);
    expect(saturn?.narrative.en).toBe('');
  });
});
