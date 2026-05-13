import { describe, it, expect } from 'vitest';
import { fillTemplate } from '../templates';
import { generateTemplateNarrative } from '../templates/narratives';
import { getDisclaimer } from '../templates/disclaimer';
import { EXPECTED_SAC } from './fixtures/sample-sac';
import type { ClassifiedQuery, QueryCategory, Verdict, StructuredAstrologicalContext } from '../types';

function makeQuery(category: QueryCategory, locale: string): ClassifiedQuery {
  return {
    originalText: 'test',
    locale,
    category,
    complexity: 'factual',
    tier: 0,
    cacheKey: 'test',
  };
}

function makeSacWithVerdict(verdict: Verdict): StructuredAstrologicalContext {
  return {
    ...EXPECTED_SAC,
    primaryVerdict: verdict,
  };
}

describe('generateTemplateNarrative', () => {
  const categories: QueryCategory[] = ['career', 'relationship', 'health', 'wealth', 'children', 'education', 'spiritual', 'general'];
  const verdicts: Verdict[] = ['FAVOURABLE', 'MIXED', 'CAUTION', 'CHALLENGING'];

  // Test all 64 combos render without empty slots
  for (const locale of ['en', 'hi'] as const) {
    for (const verdict of verdicts) {
      for (const category of categories) {
        it(`${locale}/${verdict}/${category} renders non-empty`, () => {
          const sac = makeSacWithVerdict(verdict);
          const narrative = generateTemplateNarrative(sac, category, locale);
          expect(narrative.length).toBeGreaterThan(50);
          // No unfilled slots
          expect(narrative).not.toContain('{');
          expect(narrative).not.toContain('}');
          expect(narrative).not.toContain('undefined');
          expect(narrative).not.toContain('null');
        });
      }
    }
  }

  it('English template mentions dasha lord name', () => {
    const narrative = generateTemplateNarrative(EXPECTED_SAC, 'career', 'en');
    expect(narrative).toContain('Saturn'); // Mahadasha lord
  });

  it('Hindi template uses Hindi dasha lord name', () => {
    const narrative = generateTemplateNarrative(EXPECTED_SAC, 'career', 'hi');
    expect(narrative).toContain('शनि');
  });

  it('CAUTION template includes remedial language', () => {
    const sac = makeSacWithVerdict('CAUTION');
    const en = generateTemplateNarrative(sac, 'career', 'en');
    expect(en.toLowerCase()).toContain('remed');
    const hi = generateTemplateNarrative(sac, 'career', 'hi');
    expect(hi).toContain('उपाय');
  });

  it('Sade Sati note included when active', () => {
    const en = generateTemplateNarrative(EXPECTED_SAC, 'career', 'en');
    expect(en).toContain('Sade Sati');
    const hi = generateTemplateNarrative(EXPECTED_SAC, 'career', 'hi');
    expect(hi).toContain('साढ़ेसाती');
  });
});

describe('fillTemplate', () => {
  it('returns a complete LLMOutput', () => {
    const result = fillTemplate(EXPECTED_SAC, makeQuery('career', 'en'));
    expect(result.narrative.length).toBeGreaterThan(50);
    expect(result.claims).toEqual([]);
    expect(result.remedies).toEqual([]);
    expect(result.classicalCitations).toEqual([]);
  });
});

describe('getDisclaimer', () => {
  it('returns English standard disclaimer', () => {
    const d = getDisclaimer('career', 'MIXED', 'en');
    expect(d).toContain('Swiss Ephemeris');
    expect(d).toContain('guidance');
  });

  it('returns Hindi standard disclaimer', () => {
    const d = getDisclaimer('career', 'MIXED', 'hi');
    expect(d).toContain('स्विस एफेमेरिस');
    expect(d).toContain('मार्गदर्शन');
  });

  it('adds health contextual disclaimer', () => {
    const d = getDisclaimer('health', 'MIXED', 'en');
    expect(d).toContain('medical');
  });

  it('adds challenging verdict disclaimer', () => {
    const d = getDisclaimer('career', 'CAUTION', 'en');
    expect(d).toContain('remedies');
  });

  it('adds both contextual + verdict disclaimers when applicable', () => {
    const d = getDisclaimer('health', 'CHALLENGING', 'en');
    expect(d).toContain('medical');     // health contextual
    expect(d).toContain('remedies');    // challenging verdict
  });
});
