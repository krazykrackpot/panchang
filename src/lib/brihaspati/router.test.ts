import { describe, it, expect } from 'vitest';
import {
  CATEGORY_ENGINES,
  buildContext,
  enginesFor,
  type RouterKundali,
} from './router';
import { BRIHASPATI_CATEGORIES } from './types';

const fixtureKundali: RouterKundali = {
  engineVersion: 'test-engine-v1',
  chart: { lagna: 'Aries', moonSign: 'Cancer' },
  dashas: { current: 'Jupiter', sub: 'Mercury' },
  yogas: [{ name: 'Gajakesari' }],
  doshas: [],
  transits: [{ planet: 'Saturn', sign: 'Aquarius' }],
  analysis: { strengths: ['Jupiter strong'] },
};

describe('router — engine map', () => {
  it('covers every category', () => {
    for (const cat of BRIHASPATI_CATEGORIES) {
      expect(CATEGORY_ENGINES[cat], `missing entry for ${cat}`).toBeTruthy();
      expect(CATEGORY_ENGINES[cat].length).toBeGreaterThan(0);
    }
  });

  it.each([
    ['career', ['domain', 'dasha', 'transit']],
    ['marriage', ['domain', 'tippanni']],
    ['health', ['domain', 'remedies']],
    ['finance', ['domain', 'muhurta']],
    ['children', ['domain', 'dasha']],
    ['compatibility', ['ashta-kuta']],
    ['timing', ['muhurta']],
    ['transit', ['transit']],
  ] as const)('%s engages %j', (cat, required) => {
    const wired = enginesFor(cat as never);
    for (const eng of required) {
      expect(wired, `${cat} must include ${eng}`).toContain(eng);
    }
  });

  it('enginesFor is referentially stable (no copy per call)', () => {
    expect(enginesFor('career')).toBe(enginesFor('career'));
  });
});

describe('router — buildContext', () => {
  it('produces a context with all required fields', () => {
    const ctx = buildContext({
      category: 'marriage',
      locale: 'en',
      question: 'When will I get married?',
      kundali: fixtureKundali,
    });
    expect(ctx).toMatchObject({
      category: 'marriage',
      locale: 'en',
      question: 'When will I get married?',
      engineVersion: 'test-engine-v1',
    });
    expect(ctx.chart).toBeDefined();
    expect(ctx.dashas).toBeDefined();
    expect(ctx.yogas).toBeInstanceOf(Array);
    expect(ctx.doshas).toBeInstanceOf(Array);
    expect(ctx.transits).toBeInstanceOf(Array);
    expect(ctx.analysis).toBeDefined();
  });

  it('preserves engineVersion verbatim (used by §11 training filter)', () => {
    const ctx = buildContext({
      category: 'general',
      locale: 'hi',
      question: 'मेरी कुंडली',
      kundali: { ...fixtureKundali, engineVersion: 'v42-abc123' },
    });
    expect(ctx.engineVersion).toBe('v42-abc123');
  });

  it('defaults empty arrays/objects when kundali fields are missing', () => {
    const ctx = buildContext({
      category: 'general',
      locale: 'en',
      question: 'tell me',
      kundali: { engineVersion: 'v1', chart: {} },
    });
    expect(ctx.dashas).toEqual({});
    expect(ctx.yogas).toEqual([]);
    expect(ctx.doshas).toEqual([]);
    expect(ctx.transits).toEqual([]);
    expect(ctx.analysis).toEqual({});
  });

  it('does not invent yogas/doshas — LLM must not hallucinate from missing fields', () => {
    // Layer 4 validator will reject any LLM claim about a yoga that
    // isn't in this list. So the context must be authoritative and not
    // populated with placeholder data.
    const ctx = buildContext({
      category: 'marriage',
      locale: 'en',
      question: 'q',
      kundali: { engineVersion: 'v1', chart: {}, yogas: [] },
    });
    expect(ctx.yogas).toEqual([]);
  });

  it('passes through locale to the LLM payload', () => {
    for (const locale of ['en', 'hi', 'ta', 'bn'] as const) {
      const ctx = buildContext({
        category: 'general',
        locale,
        question: 'q',
        kundali: fixtureKundali,
      });
      expect(ctx.locale).toBe(locale);
    }
  });
});
