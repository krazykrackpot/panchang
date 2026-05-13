import { describe, it, expect } from 'vitest';
import { route, parseLLMOutput } from '../providers/router';
import { MockProvider } from '../providers/mock';
import { EXPECTED_SAC } from './fixtures/sample-sac';
import { GOOD_EN_CAREER_MIXED, BAD_L2_WRONG_CLAIM } from './fixtures/sample-narratives';
import type { ClassifiedQuery, PanditConfig, LLMOutput, StructuredAstrologicalContext } from '../types';
import { fillTemplate } from '../templates';

const QUERY: ClassifiedQuery = {
  originalText: 'How is my career?',
  locale: 'en',
  category: 'career',
  complexity: 'interpretive',
  tier: 1,
  cacheKey: 'test-key',
};

const CONFIG: PanditConfig = {
  tradition: 'parashari',
  maxRetries: 2,
};

const PROMPTS = { system: 'test system prompt', user: 'test user prompt' };

describe('parseLLMOutput', () => {
  it('parses valid JSON', () => {
    const result = parseLLMOutput(JSON.stringify(GOOD_EN_CAREER_MIXED));
    expect(result).not.toBeNull();
    expect(result!.narrative).toContain('Saturn');
    expect(result!.claims.length).toBeGreaterThan(0);
  });

  it('strips markdown fences', () => {
    const wrapped = '```json\n' + JSON.stringify(GOOD_EN_CAREER_MIXED) + '\n```';
    const result = parseLLMOutput(wrapped);
    expect(result).not.toBeNull();
    expect(result!.narrative).toContain('Saturn');
  });

  it('falls back to plain text when JSON fails', () => {
    const plainText = 'This is a long narrative about career prospects that does not have JSON structure but is over 100 characters long so it should be accepted as plain text.';
    const result = parseLLMOutput(plainText);
    expect(result).not.toBeNull();
    expect(result!.narrative).toBe(plainText);
    expect(result!.claims).toHaveLength(0);
  });

  it('returns null for short garbage', () => {
    expect(parseLLMOutput('err')).toBeNull();
    expect(parseLLMOutput('')).toBeNull();
  });

  it('returns null for JSON with short narrative', () => {
    const short = JSON.stringify({ narrative: 'Too short', claims: [] });
    expect(parseLLMOutput(short)).toBeNull();
  });

  it('defaults missing arrays to empty', () => {
    const minimal = JSON.stringify({ narrative: 'A'.repeat(100) });
    const result = parseLLMOutput(minimal);
    expect(result!.claims).toEqual([]);
    expect(result!.remedies).toEqual([]);
    expect(result!.classicalCitations).toEqual([]);
  });
});

describe('route', () => {
  it('Tier 0 returns template without LLM call', async () => {
    const mock = new MockProvider({ response: 'should not be called' });
    const result = await route(0, PROMPTS, EXPECTED_SAC, QUERY, CONFIG, { selfHosted: mock, anthropic: mock }, fillTemplate);

    expect(result.tier).toBe(0);
    expect(result.model).toBe('template');
    expect(result.output.narrative).toBeTruthy();
    expect(mock.calls).toHaveLength(0); // No LLM call
  });

  it('Tier 1 calls self-hosted and returns on validation pass', async () => {
    const mock = new MockProvider({ response: JSON.stringify(GOOD_EN_CAREER_MIXED) });
    const noApi = new MockProvider({ response: '', unavailable: true });

    const result = await route(1, PROMPTS, EXPECTED_SAC, QUERY, CONFIG, { selfHosted: mock, anthropic: noApi }, fillTemplate);

    expect(result.tier).toBe(1);
    expect(result.model).toContain('self-hosted');
    expect(result.regenerationCount).toBe(0);
    expect(mock.calls).toHaveLength(1);
  });

  it('Tier 1 retries on validation failure, then escalates to Tier 2', async () => {
    // Self-hosted always returns wrong claims → always fails validation
    const badSelfHosted = new MockProvider({ response: JSON.stringify(BAD_L2_WRONG_CLAIM) });
    // Anthropic returns good response
    const goodApi = new MockProvider({ response: JSON.stringify(GOOD_EN_CAREER_MIXED) });

    const result = await route(1, PROMPTS, EXPECTED_SAC, QUERY, CONFIG, { selfHosted: badSelfHosted, anthropic: goodApi }, fillTemplate);

    // Should have tried self-hosted 3 times (initial + 2 retries), then escalated to anthropic
    expect(badSelfHosted.calls.length).toBe(3);
    expect(goodApi.calls.length).toBe(1);
    expect(result.model).toContain('anthropic');
  });

  it('falls back to template when both providers fail', async () => {
    const badSelfHosted = new MockProvider({ response: JSON.stringify(BAD_L2_WRONG_CLAIM) });
    const badApi = new MockProvider({ response: JSON.stringify(BAD_L2_WRONG_CLAIM) });

    const result = await route(1, PROMPTS, EXPECTED_SAC, QUERY, CONFIG, { selfHosted: badSelfHosted, anthropic: badApi }, fillTemplate);

    expect(result.model).toBe('template-fallback');
    expect(result.tier).toBe(0);
    expect(result.output.narrative).toBeTruthy();
  });

  it('falls back to template when provider is unavailable', async () => {
    const unavailable = new MockProvider({ response: '', unavailable: true });

    const result = await route(1, PROMPTS, EXPECTED_SAC, QUERY, CONFIG, { selfHosted: unavailable, anthropic: unavailable }, fillTemplate);

    expect(result.model).toBe('template-fallback');
  });

  it('handles network failure gracefully', async () => {
    const failing = new MockProvider({ response: '', failOnCall: 1 });
    const goodApi = new MockProvider({ response: JSON.stringify(GOOD_EN_CAREER_MIXED) });

    const result = await route(1, PROMPTS, EXPECTED_SAC, QUERY, CONFIG, { selfHosted: failing, anthropic: goodApi }, fillTemplate);

    // Should escalate to API after network failure (no retries on network error)
    expect(result.model).toContain('anthropic');
  });
});
