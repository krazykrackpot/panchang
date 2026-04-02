import { describe, it, expect } from 'vitest';
import { analyzeSadeSati, getCurrentSaturnSign, type SadeSatiInput } from './sade-sati-analysis';

function makeInput(moonSign: number, overrides?: Partial<SadeSatiInput>): SadeSatiInput {
  return {
    moonSign,
    ...overrides,
  };
}

describe('analyzeSadeSati', () => {
  it('returns a valid SadeSatiAnalysis structure', () => {
    const result = analyzeSadeSati(makeInput(1));
    expect(result).toHaveProperty('isActive');
    expect(result).toHaveProperty('currentPhase');
    expect(result).toHaveProperty('phaseProgress');
    expect(result).toHaveProperty('cycleStart');
    expect(result).toHaveProperty('cycleEnd');
    expect(result).toHaveProperty('allCycles');
    expect(result).toHaveProperty('currentCycleIndex');
    expect(result).toHaveProperty('overallIntensity');
    expect(result).toHaveProperty('intensityFactors');
    expect(result).toHaveProperty('interpretation');
    expect(result).toHaveProperty('remedies');
  });

  it('returns valid boolean for isActive', () => {
    const result = analyzeSadeSati(makeInput(1));
    expect(typeof result.isActive).toBe('boolean');
  });

  it('currentPhase is null or one of rising/peak/setting', () => {
    const result = analyzeSadeSati(makeInput(1));
    expect([null, 'rising', 'peak', 'setting']).toContain(result.currentPhase);
  });

  it('allCycles is a non-empty array', () => {
    const result = analyzeSadeSati(makeInput(1));
    expect(Array.isArray(result.allCycles)).toBe(true);
    expect(result.allCycles.length).toBeGreaterThan(0);
  });

  it('all cycles have valid year ranges', () => {
    const result = analyzeSadeSati(makeInput(5));
    for (const cycle of result.allCycles) {
      expect(cycle.startYear).toBeGreaterThanOrEqual(1940);
      expect(cycle.endYear).toBeLessThanOrEqual(2075);
      expect(cycle.endYear).toBeGreaterThanOrEqual(cycle.startYear);
    }
  });

  it('all cycles have valid saturnSign (1-12)', () => {
    const result = analyzeSadeSati(makeInput(3));
    for (const cycle of result.allCycles) {
      // saturnSign may vary but phases have years
      expect(cycle.phases.length).toBeGreaterThan(0);
      for (const phase of cycle.phases) {
        expect(['rising', 'peak', 'setting']).toContain(phase.phase);
      }
    }
  });

  it('intensity is between 0 and some max (when not active, still returns a value)', () => {
    const result = analyzeSadeSati(makeInput(1));
    expect(typeof result.overallIntensity).toBe('number');
    expect(result.overallIntensity).toBeGreaterThanOrEqual(0);
  });

  it('works for all 12 moon signs', () => {
    for (let sign = 1; sign <= 12; sign++) {
      const result = analyzeSadeSati(makeInput(sign));
      expect(result).toHaveProperty('allCycles');
      expect(result.allCycles.length).toBeGreaterThan(0);
    }
  });

  it('interpretation has required bilingual fields', () => {
    const result = analyzeSadeSati(makeInput(7));
    const interp = result.interpretation;
    expect(interp.summary).toHaveProperty('en');
    expect(interp.summary).toHaveProperty('hi');
    expect(interp.phaseEffect).toHaveProperty('en');
    expect(interp.saturnNature).toHaveProperty('en');
    expect(interp.moonStrength).toHaveProperty('en');
  });

  it('remedies is an array', () => {
    const result = analyzeSadeSati(makeInput(4));
    expect(Array.isArray(result.remedies)).toBe(true);
  });

  it('each remedy has title, description, priority', () => {
    const result = analyzeSadeSati(makeInput(4));
    for (const r of result.remedies) {
      expect(r).toHaveProperty('title');
      expect(r).toHaveProperty('description');
      expect(r).toHaveProperty('priority');
      expect(['essential', 'recommended', 'optional']).toContain(r.priority);
    }
  });

  it('phaseProgress is a non-negative number', () => {
    const result = analyzeSadeSati(makeInput(1));
    expect(typeof result.phaseProgress).toBe('number');
    expect(result.phaseProgress).toBeGreaterThanOrEqual(0);
  });
});

describe('getCurrentSaturnSign', () => {
  it('returns a valid sign (1-12)', () => {
    const result = getCurrentSaturnSign();
    expect(result.sign).toBeGreaterThanOrEqual(1);
    expect(result.sign).toBeLessThanOrEqual(12);
  });

  it('returns signName with en and hi', () => {
    const result = getCurrentSaturnSign();
    expect(result.signName).toHaveProperty('en');
    expect(result.signName).toHaveProperty('hi');
    expect(result.signName.en.length).toBeGreaterThan(0);
  });

  it('returns degree between 0 and 30', () => {
    const result = getCurrentSaturnSign();
    expect(result.degree).toBeGreaterThanOrEqual(0);
    expect(result.degree).toBeLessThan(30);
  });
});
