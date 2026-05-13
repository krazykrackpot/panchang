/**
 * Integration Tests — End-to-End with MockProvider
 *
 * Tests the full consultPandit() flow: classify → context → prompt →
 * route → validate → respond. All via MockProvider — zero network calls.
 */

import { describe, it, expect } from 'vitest';
import { consultPandit } from '../index';
import { MockProvider } from '../providers/mock';
import { SAMPLE_KUNDALI } from './fixtures/sample-kundali';
import {
  GOOD_EN_CAREER_MIXED,
  GOOD_HI_RELATIONSHIP_CAUTION,
  BAD_L2_WRONG_CLAIM,
  BAD_L3_TRADITION_EN,
} from './fixtures/sample-narratives';

describe('consultPandit — integration', () => {

  it('English career query → valid response with disclaimer', async () => {
    const mock = new MockProvider({ response: JSON.stringify(GOOD_EN_CAREER_MIXED) });

    const result = await consultPandit(
      { text: 'How is my career looking?', locale: 'en' },
      SAMPLE_KUNDALI,
      { forceProvider: 'mock', _mockProvider: mock, forceTier: 1, skipCache: true },
    );

    expect(result.narrative).toContain('Saturn');
    expect(result.disclaimer).toContain('Swiss Ephemeris');
    expect(result.tier).toBe(1);
    expect(result.cached).toBe(false);
    expect(result.validation.passed).toBe(true);
    expect(result.validation.regenerationCount).toBe(0);
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.remedies.length).toBeGreaterThan(0);
  });

  it('Hindi relationship query → Hindi disclaimer', async () => {
    const mock = new MockProvider({ response: JSON.stringify(GOOD_HI_RELATIONSHIP_CAUTION) });

    const result = await consultPandit(
      { text: 'मेरी शादी कब होगी?', locale: 'hi' },
      SAMPLE_KUNDALI,
      { forceProvider: 'mock', _mockProvider: mock, forceTier: 1, skipCache: true },
    );

    expect(result.narrative).toContain('शनि');
    expect(result.disclaimer).toContain('स्विस एफेमेरिस');
    expect(result.validation.passed).toBe(true);
  });

  it('factual query → Tier 0 template (no LLM call)', async () => {
    const mock = new MockProvider({ response: 'should not be called' });

    const result = await consultPandit(
      { text: 'What dasha am I in?', locale: 'en' },
      SAMPLE_KUNDALI,
      { forceProvider: 'mock', _mockProvider: mock, skipCache: true },
    );

    expect(result.tier).toBe(0);
    expect(result.model).toBe('template');
    expect(result.narrative.length).toBeGreaterThan(50);
    expect(result.estimatedCostUsd).toBe(0);
    expect(mock.calls).toHaveLength(0); // No LLM call
  });

  it('validation failure → falls back to template', async () => {
    // BAD_L2_WRONG_CLAIM has Jupiter in house 10 (actually 4) — always fails
    const mock = new MockProvider({ response: JSON.stringify(BAD_L2_WRONG_CLAIM) });

    const result = await consultPandit(
      { text: 'How is my career?', locale: 'en' },
      SAMPLE_KUNDALI,
      { forceProvider: 'mock', _mockProvider: mock, forceTier: 1, skipCache: true },
    );

    // Should fall back to template after retries
    expect(result.model).toBe('template-fallback');
    expect(result.narrative.length).toBeGreaterThan(50);
    expect(result.validation.regenerationCount).toBeGreaterThan(0);
  });

  it('cache hit on second identical query', async () => {
    const mock = new MockProvider({ response: JSON.stringify(GOOD_EN_CAREER_MIXED) });

    // First call — cache miss
    const result1 = await consultPandit(
      { text: 'How is my career?', locale: 'en' },
      SAMPLE_KUNDALI,
      { forceProvider: 'mock', _mockProvider: mock, forceTier: 1 },
    );
    expect(result1.cached).toBe(false);

    // Second call — cache hit (same query, same chart)
    const result2 = await consultPandit(
      { text: 'How is my career?', locale: 'en' },
      SAMPLE_KUNDALI,
      { forceProvider: 'mock', _mockProvider: mock, forceTier: 1 },
    );
    expect(result2.cached).toBe(true);
    expect(result2.narrative).toBe(result1.narrative);

    // Mock should only have been called once (second was cache hit)
    expect(mock.calls).toHaveLength(1);
  });

  it('onValidatedResponse callback fires on success', async () => {
    const mock = new MockProvider({ response: JSON.stringify(GOOD_EN_CAREER_MIXED) });
    let callbackFired = false;
    let callbackData: any = null;

    const result = await consultPandit(
      { text: 'How is my career?', locale: 'en' },
      SAMPLE_KUNDALI,
      {
        forceProvider: 'mock',
        _mockProvider: mock,
        forceTier: 1,
        skipCache: true,
        onValidatedResponse: (data) => {
          callbackFired = true;
          callbackData = data;
        },
      },
    );

    expect(result.validation.passed).toBe(true);
    expect(callbackFired).toBe(true);
    expect(callbackData.sac).toBeDefined();
    expect(callbackData.query.category).toBe('career');
    expect(callbackData.model).toContain('mock');
  });

  it('onValidatedResponse does NOT fire on validation failure', async () => {
    const mock = new MockProvider({ response: JSON.stringify(BAD_L2_WRONG_CLAIM) });
    let callbackFired = false;

    await consultPandit(
      { text: 'How is my career?', locale: 'en' },
      SAMPLE_KUNDALI,
      {
        forceProvider: 'mock',
        _mockProvider: mock,
        forceTier: 1,
        skipCache: true,
        onValidatedResponse: () => { callbackFired = true; },
      },
    );

    expect(callbackFired).toBe(false);
  });

  it('response includes cost estimate', async () => {
    const mock = new MockProvider({ response: JSON.stringify(GOOD_EN_CAREER_MIXED) });

    const result = await consultPandit(
      { text: 'How is my career?', locale: 'en' },
      SAMPLE_KUNDALI,
      { forceProvider: 'mock', _mockProvider: mock, forceTier: 1, skipCache: true },
    );

    expect(typeof result.estimatedCostUsd).toBe('number');
  });
});
