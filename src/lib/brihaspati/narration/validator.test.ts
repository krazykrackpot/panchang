import { describe, it, expect } from 'vitest';
import { validate } from './validator';
import type { BrihaspatiContext } from '../types';

function ctx(overrides: Partial<BrihaspatiContext> = {}): BrihaspatiContext {
  return {
    category: 'general',
    locale: 'en',
    question: 'q',
    engineVersion: 'v1',
    chart: {
      positions: [
        { planet: 'Venus', sign: 'Taurus', house: 7 },
        { planet: 'Saturn', sign: 'Capricorn', house: 3 },
        { planet: 'Jupiter', sign: 'Sagittarius', house: 2 },
        { planet: 'Moon', sign: 'Cancer', house: 4 },
      ],
    },
    dashas: { current: 'Jupiter', sub: 'Mercury', chain: ['Jupiter', 'Mercury', 'Venus'] },
    yogas: [{ name: 'Gajakesari' }, { name: 'Mahabhagya' }],
    doshas: [{ name: 'Mangal Dosha' }],
    transits: [],
    analysis: {},
    ...overrides,
  };
}

describe('Layer-4 validator — happy path', () => {
  it('passes when every claim is grounded in context', () => {
    const narration = `
      Your Venus in 7th house and Jupiter in Sagittarius are strong indicators of
      a meaningful partnership. The Gajakesari Yoga in your chart reinforces this.
      During your Jupiter-Mercury period, expect movement on this front.
    `;
    const r = validate(narration, ctx());
    expect(r.passed).toBe(true);
    expect(r.failures).toEqual([]);
    expect(r.claimsChecked).toBeGreaterThan(0);
  });

  it('accepts both bare and full yoga names', () => {
    const r1 = validate('Your chart has Gajakesari Yoga.', ctx());
    expect(r1.passed).toBe(true);
    const r2 = validate('Mangal Dosha is present.', ctx());
    expect(r2.passed).toBe(true);
  });

  it('accepts Sanskrit planet aliases (Surya, Shani, Guru)', () => {
    // "Shani in 3rd house" → maps to Saturn in 3rd, which IS in fixture
    const r = validate('Shani in 3rd house brings discipline.', ctx());
    expect(r.passed).toBe(true);
  });
});

describe('Layer-4 validator — catches hallucinations', () => {
  it('flags wrong house placement', () => {
    // Venus is in 7th in fixture, but LLM says 10th
    const r = validate('Your Venus in 10th house signals career success.', ctx());
    expect(r.passed).toBe(false);
    expect(r.failures[0].reason).toBe('planet_not_in_chart');
    expect(r.failures[0].claim).toMatch(/Venus.*10/);
  });

  it('flags wrong sign placement', () => {
    const r = validate('Your Saturn in Leo creates challenges.', ctx());
    expect(r.passed).toBe(false);
    expect(r.failures[0].reason).toBe('planet_not_in_chart');
  });

  it('flags fabricated yoga', () => {
    // "Raja Yoga" is not in the fixture's detected yogas
    const r = validate('You have a powerful Raja Yoga that drives success.', ctx());
    expect(r.passed).toBe(false);
    expect(r.failures[0].reason).toBe('yoga_not_detected');
    expect(r.failures[0].claim).toMatch(/Raja Yoga/);
  });

  it('flags fabricated dosha', () => {
    const r = validate('You have Kaal Sarpa Dosha.', ctx());
    expect(r.passed).toBe(false);
    expect(r.failures[0].reason).toBe('yoga_not_detected');
  });

  it('flags wrong dasha lord', () => {
    // Fixture has Jupiter mahadasha; LLM says Saturn
    const r = validate('During your Saturn mahadasha, expect delays.', ctx());
    expect(r.passed).toBe(false);
    expect(r.failures[0].reason).toBe('dasha_not_in_context');
  });

  it('flags wrong dasha pair', () => {
    // Jupiter-Mercury is fixture; LLM says Jupiter-Venus (Venus is in chain
    // but is not the current sub-period)
    const r = validate('Your current Jupiter-Saturn period (Saturn not in chain).', ctx());
    expect(r.passed).toBe(false);
  });

  it('collects multiple failures in one pass', () => {
    const r = validate(
      'Venus in 1st house and Saturn in Cancer create Raja Yoga in your chart.',
      ctx(),
    );
    expect(r.passed).toBe(false);
    expect(r.failures.length).toBeGreaterThanOrEqual(3);
  });
});

describe('Layer-4 validator — robustness', () => {
  it('does not crash on empty narration', () => {
    const r = validate('', ctx());
    expect(r.passed).toBe(true);
    expect(r.claimsChecked).toBe(0);
  });

  it('does not crash on context with no chart positions', () => {
    const r = validate('Your Venus in 7th house...', ctx({ chart: {} }));
    expect(r.passed).toBe(false);
    // No positions known → any planet claim fails
  });

  it('does not crash on context with no dashas', () => {
    const r = validate('During your Jupiter mahadasha...', ctx({ dashas: {} }));
    expect(r.passed).toBe(false);
  });

  it('handles alternative chart shapes (planets object)', () => {
    const altChart = {
      planets: { Venus: { sign: 'Taurus', house: 7 } },
    };
    const r = validate('Venus in 7th house.', ctx({ chart: altChart }));
    expect(r.passed).toBe(true);
  });

  it('handles alternative chart shapes (top-level planet keys)', () => {
    const altChart = { Venus: { sign: 'Taurus', house: 7 } };
    const r = validate('Venus in 7th house.', ctx({ chart: altChart }));
    expect(r.passed).toBe(true);
  });

  it('case-insensitive on planet/sign names', () => {
    const r = validate('venus in TAURUS feels strong.', ctx());
    expect(r.passed).toBe(true);
  });

  it('returns claimsChecked count for telemetry', () => {
    const r = validate(
      'Venus in 7th house. Jupiter in Sagittarius. Gajakesari Yoga. Jupiter-Mercury period.',
      ctx(),
    );
    expect(r.claimsChecked).toBeGreaterThanOrEqual(4);
  });
});
