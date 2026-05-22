/**
 * Tests for the Layer-2 question classifier.
 *
 * The accuracy bar is ≥95% on the labelled corpus below per Phase 10.1 of
 * INFRASTRUCTURE.md. The corpus is the contract: when a real user types a
 * question that *looks like* one of these, the classifier MUST route it to
 * the listed category.
 */
import { describe, it, expect } from 'vitest';
import { classify } from './classifier';
import { BRIHASPATI_CATEGORIES, type BrihaspatiCategory } from './types';

interface Case { q: string; expect: BrihaspatiCategory }

const CORPUS: Case[] = [
  // ── marriage ──────────────────────────────────────────────
  { q: 'When will I get married?', expect: 'marriage' },
  { q: 'Do I have Mangal Dosha?', expect: 'marriage' },
  { q: 'क्या मेरी शादी 2027 में होगी?', expect: 'marriage' },
  { q: 'Will my marriage survive?', expect: 'marriage' },
  { q: 'Tell me about my soulmate', expect: 'marriage' },

  // ── career ────────────────────────────────────────────────
  { q: 'Will I get a promotion this year?', expect: 'career' },
  { q: 'Is this a good time to start a business?', expect: 'career' },
  { q: 'मुझे कौन सी नौकरी करनी चाहिए?', expect: 'career' },
  { q: 'Saturn is troubling my job — when does it end?', expect: 'career' },

  // ── health ────────────────────────────────────────────────
  { q: 'What health risks do I face?', expect: 'health' },
  { q: 'I am chronically sick — what does my chart say?', expect: 'health' },
  { q: 'मेरी सेहत कैसी रहेगी?', expect: 'health' },

  // ── finance ───────────────────────────────────────────────
  { q: 'Will I become wealthy?', expect: 'finance' },
  { q: 'Is this a good time to buy property?', expect: 'finance' },
  { q: 'पैसा कब आएगा?', expect: 'finance' },
  { q: 'I have a lot of debt — when will it clear?', expect: 'finance' },

  // ── children ──────────────────────────────────────────────
  { q: 'When will I have children?', expect: 'children' },
  { q: 'Will I have a son or a daughter?', expect: 'children' },
  { q: 'मेरी संतान कब होगी?', expect: 'children' },

  // ── education ─────────────────────────────────────────────
  { q: 'Will I pass my exam?', expect: 'education' },
  { q: 'Should I study abroad?', expect: 'education' },
  { q: 'क्या मैं परीक्षा में सफल हूँगा?', expect: 'education' },

  // ── dasha ─────────────────────────────────────────────────
  { q: 'What does my current dasha mean?', expect: 'dasha' },
  { q: 'When does my mahadasha change?', expect: 'dasha' },
  { q: 'मेरी अंतर्दशा क्या है?', expect: 'dasha' },

  // ── remedies ──────────────────────────────────────────────
  { q: 'Which gemstone should I wear?', expect: 'remedies' },
  { q: 'What mantra is best for me?', expect: 'remedies' },
  { q: 'मुझे कौन सा उपाय करना चाहिए?', expect: 'remedies' },

  // ── compatibility ─────────────────────────────────────────
  { q: 'Are my partner and I compatible?', expect: 'compatibility' },
  { q: 'Check gun milan for me and my partner', expect: 'compatibility' },
  { q: 'हमारा गुण मिलान कैसा है?', expect: 'compatibility' },

  // ── timing ────────────────────────────────────────────────
  { q: 'When is the best time to buy a car?', expect: 'timing' },
  { q: 'Is today auspicious for travel?', expect: 'timing' },
  { q: 'मुझे यात्रा के लिए शुभ मुहूर्त बताइए', expect: 'timing' },

  // ── transit ───────────────────────────────────────────────
  { q: 'How will the Saturn transit affect me?', expect: 'transit' },
  { q: 'Am I going through Sade Sati?', expect: 'transit' },
  { q: 'मेरी साढ़े साती कब समाप्त होगी?', expect: 'transit' },
  { q: 'Jupiter transit through my 7th house — what happens?', expect: 'transit' },

  // ── general ───────────────────────────────────────────────
  { q: 'Tell me about my chart', expect: 'general' },
  { q: 'What is my life path?', expect: 'general' },
  { q: 'मेरी कुंडली बताइए', expect: 'general' },
  { q: 'something completely unrelated to anything', expect: 'general' },
];

describe('Brihaspati classifier — accuracy on labelled corpus', () => {
  const results = CORPUS.map((c) => ({
    ...c,
    actual: classify(c.q).category,
  }));
  const wrong = results.filter((r) => r.actual !== r.expect);
  const accuracy = (CORPUS.length - wrong.length) / CORPUS.length;

  it('hits ≥95% accuracy on the corpus', () => {
    expect(
      accuracy,
      `accuracy ${(accuracy * 100).toFixed(1)}%; misclassifications: ${JSON.stringify(wrong, null, 2)}`,
    ).toBeGreaterThanOrEqual(0.95);
  });

  // Also enumerate every case so a single regression has a named failure.
  it.each(CORPUS)('"$q" → $expect', ({ q, expect: target }) => {
    const result = classify(q);
    expect(result.category, `got ${result.category} (matched: ${result.matchedKeywords.join(', ')})`).toBe(target);
  });
});

describe('Brihaspati classifier — fallback + confidence', () => {
  it('returns general with confidence 0 when no keyword matches', () => {
    const result = classify('asdf qwerty zxcv plain gibberish');
    expect(result.category).toBe('general');
    expect(result.confidence).toBe(0);
    expect(result.matchedKeywords).toEqual([]);
  });

  it('confidence grows with more matches', () => {
    const single = classify('marriage');
    const many = classify('marriage wedding spouse husband partner soulmate venus');
    expect(many.confidence).toBeGreaterThan(single.confidence);
    expect(many.confidence).toBeLessThanOrEqual(1);
  });

  it('always returns a category from the canonical 12', () => {
    for (const c of CORPUS) {
      const cat = classify(c.q).category;
      expect(BRIHASPATI_CATEGORIES, `unexpected category: ${cat}`).toContain(cat);
    }
  });

  it('is deterministic — same input twice gives the same result', () => {
    const a = classify('When will I get married?');
    const b = classify('When will I get married?');
    expect(a).toEqual(b);
  });

  it('does not crash on empty / whitespace input', () => {
    expect(() => classify('')).not.toThrow();
    expect(() => classify('   ')).not.toThrow();
    expect(classify('').category).toBe('general');
  });
});

describe('Brihaspati classifier — non-Latin script support', () => {
  it('matches Devanagari without word boundaries', () => {
    const result = classify('मेरी शादी कब होगी');
    expect(result.category).toBe('marriage');
    expect(result.matchedKeywords).toContain('शादी');
  });

  it('matches Tamil', () => {
    const result = classify('என் திருமணம் எப்போது நடக்கும்');
    expect(result.category).toBe('marriage');
  });

  it('matches Bengali', () => {
    const result = classify('আমার বিয়ে কখন হবে');
    expect(result.category).toBe('marriage');
  });
});
