/**
 * Tests for the Layer-3 inference orchestrator.
 *
 * These tests stub the Claude call via __claudeOverride so we don't hit
 * the network. The validation logic, retry logic, and template fallback
 * are exercised end-to-end.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { narrate } from './inference';
import { BRIHASPATI_TIERS, type BrihaspatiContext, type BrihaspatiNarration } from '../types';

function ctx(overrides: Partial<BrihaspatiContext> = {}): BrihaspatiContext {
  return {
    category: 'general',
    locale: 'en',
    question: 'tell me about my chart',
    engineVersion: 'v1',
    chart: {
      positions: [
        { planet: 'Venus', sign: 'Taurus', house: 7 },
        { planet: 'Jupiter', sign: 'Sagittarius', house: 2 },
      ],
    },
    dashas: { current: 'Jupiter', sub: 'Mercury', chain: ['Jupiter', 'Mercury'] },
    yogas: [{ name: 'Gajakesari' }],
    doshas: [],
    transits: [],
    analysis: {},
    ...overrides,
  };
}

function fakeNarration(text: string): BrihaspatiNarration {
  return {
    text,
    modelUsed: 'claude-sonnet-4-6-fake',
    inputTokens: 100,
    outputTokens: text.length / 4,
    systemPromptVersion: 'fake-v1',
  };
}

describe('Layer-3 narrate — Tier 2 (Claude) happy path', () => {
  beforeEach(() => {
    delete process.env.BRIHASPATI_LAYER4_BLOCK;
  });

  it('returns Tier 2 result when Claude succeeds + Layer 4 passes', async () => {
    const result = await narrate(ctx(), {
      __claudeOverride: async () =>
        fakeNarration('Your Venus in 7th house and Jupiter in Sagittarius are favourable. Gajakesari Yoga is detected.'),
    });
    expect(result.tier).toBe(BRIHASPATI_TIERS.CLAUDE_API);
    expect(result.validationPassed).toBe(true);
    expect(result.validationFailures).toEqual([]);
    expect(result.retryCount).toBe(0);
    expect(result.narration.text).toMatch(/Venus in 7th house/);
  });
});

describe('Layer-3 narrate — Tier 2 with hallucinations (log-only mode)', () => {
  beforeEach(() => {
    delete process.env.BRIHASPATI_LAYER4_BLOCK;
  });

  it('still returns Claude output in log-only mode but records failures', async () => {
    const result = await narrate(ctx(), {
      __claudeOverride: async () =>
        fakeNarration('Your Venus in 10th house creates Raja Yoga. (planted hallucinations)'),
    });
    expect(result.tier).toBe(BRIHASPATI_TIERS.CLAUDE_API);
    expect(result.validationPassed).toBe(false);
    expect(result.validationFailures.length).toBeGreaterThan(0);
    expect(result.retryCount).toBeGreaterThan(0); // attempted retries on failure
  });
});

describe('Layer-3 narrate — Tier 2 strict-block mode', () => {
  beforeEach(() => {
    process.env.BRIHASPATI_LAYER4_BLOCK = 'true';
  });
  afterEach(() => {
    delete process.env.BRIHASPATI_LAYER4_BLOCK;
  });

  it('falls back to template when validation fails and block is on', async () => {
    const result = await narrate(ctx(), {
      __claudeOverride: async () =>
        fakeNarration('Your Venus in 10th house creates Raja Yoga.'),
    });
    expect(result.tier).toBe(BRIHASPATI_TIERS.TEMPLATE);
    expect(result.validationPassed).toBe(true); // templates pass by construction
    expect(result.narration.modelUsed).toBe('template-v1');
  });
});

describe('Layer-3 narrate — Tier 2 retries before giving up', () => {
  beforeEach(() => {
    process.env.BRIHASPATI_LAYER4_BLOCK = 'true'; // force fallback path
  });
  afterEach(() => {
    delete process.env.BRIHASPATI_LAYER4_BLOCK;
  });

  it('attempts up to 2 Claude calls before falling back to template', async () => {
    let calls = 0;
    const result = await narrate(ctx(), {
      __claudeOverride: async () => {
        calls++;
        return fakeNarration('Venus in 10th house (always wrong).');
      },
    });
    expect(calls).toBe(2);
    expect(result.tier).toBe(BRIHASPATI_TIERS.TEMPLATE);
    expect(result.retryCount).toBe(2);
  });

  it('returns first passing Claude attempt without retry', async () => {
    let calls = 0;
    const result = await narrate(ctx(), {
      __claudeOverride: async () => {
        calls++;
        return fakeNarration('Your Venus in 7th house and Gajakesari Yoga.');
      },
    });
    expect(calls).toBe(1);
    expect(result.tier).toBe(BRIHASPATI_TIERS.CLAUDE_API);
    expect(result.retryCount).toBe(0);
  });
});

describe('Layer-3 narrate — Claude API throw → template fallback', () => {
  beforeEach(() => {
    process.env.BRIHASPATI_LAYER4_BLOCK = 'true';
  });
  afterEach(() => {
    delete process.env.BRIHASPATI_LAYER4_BLOCK;
  });

  it('falls back to template when Claude throws', async () => {
    // Suppress noisy expected error
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await narrate(ctx(), {
      __claudeOverride: async () => {
        throw new Error('Anthropic 500');
      },
    });
    expect(result.tier).toBe(BRIHASPATI_TIERS.TEMPLATE);
    expect(result.retryCount).toBe(2); // tried twice, then gave up
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });
});

describe('Layer-3 narrate — forceTier escape hatch', () => {
  it('skips Claude entirely when forceTier=TEMPLATE', async () => {
    let claudeCalled = false;
    const result = await narrate(ctx(), {
      forceTier: BRIHASPATI_TIERS.TEMPLATE,
      __claudeOverride: async () => {
        claudeCalled = true;
        return fakeNarration('should never run');
      },
    });
    expect(claudeCalled).toBe(false);
    expect(result.tier).toBe(BRIHASPATI_TIERS.TEMPLATE);
  });
});

describe('Layer-3 narrate — template produces output for every category', () => {
  // Ensures the fallback bank is complete across all 12 categories.
  const categories = [
    'career', 'marriage', 'health', 'finance', 'children', 'education',
    'dasha', 'remedies', 'compatibility', 'timing', 'transit', 'general',
  ] as const;

  it.each(categories)('%s category template returns non-empty answer', async (category) => {
    const result = await narrate(ctx({ category }), {
      forceTier: BRIHASPATI_TIERS.TEMPLATE,
    });
    expect(result.tier).toBe(BRIHASPATI_TIERS.TEMPLATE);
    expect(result.narration.text.length).toBeGreaterThan(80);
  });

  it('Hindi template uses Devanagari', async () => {
    const result = await narrate(ctx({ locale: 'hi', category: 'general' }), {
      forceTier: BRIHASPATI_TIERS.TEMPLATE,
    });
    expect(result.narration.text).toMatch(/[ऀ-ॿ]/);
  });

  it('non-launch locales fall back to English templates', async () => {
    const result = await narrate(ctx({ locale: 'te', category: 'general' }), {
      forceTier: BRIHASPATI_TIERS.TEMPLATE,
    });
    // English template — should contain Latin chars and no Devanagari
    expect(result.narration.text).toMatch(/[A-Za-z]/);
  });
});
