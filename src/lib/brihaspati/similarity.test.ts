/**
 * Similarity matrix tuned against the actual Madhavi 2026-05-25
 * incident. Eight questions she submitted in a 25-minute window
 * spanning three distinct topics with multiple rewords each.
 */
import { describe, it, expect } from 'vitest';
import {
  questionSimilarity,
  findNearDuplicates,
  tokeniseQuestion,
  NEAR_DUPLICATE_THRESHOLD,
} from './similarity';

// Madhavi's actual question texts, 2026-05-25 18:05-18:29 UTC.
// jha.madhavi85@gmail.com, user_id a6314664-0eca-4219-a507-089bbb1e5417.
const M = {
  // Topic 1: child (Ishaan) attention / language development
  ishaan_a: 'When will he start making language and comprehension progress. His learning looks weak and his attention is low',
  ishaan_b: 'Ishaan attention and learning is low. When will he pick up language and comprehension. He is still not conversational',

  // Topic 2: spouse (Abhishek) career
  abhishek_a: 'Why is Abhishek career not taking off. He is sharp but never truly acknowledged for his true capabilities and leadership',
  abhishek_b: 'Abhishek is highly intelligent but he has never reached his true potential. In job he is average when he is actually very capable',

  // Topic 3: her own career
  career_a: 'Tell me about my career. I think I work hard but don\'t get enough credit',
  career_b: 'Tell me about my career . I think I work hard but don\'t get enough credit',
  career_c: 'Tell em about my career. I work hard but feel don\'t get right credit or due.',
  career_d: 'Tell me about my career. I feel I am smart and work hard but don\'t get right credit or due.',
};

describe('tokeniseQuestion', () => {
  it('lowercases, strips punctuation, removes short tokens and stopwords', () => {
    const toks = tokeniseQuestion("Tell me about my career. I'm tired!");
    // 'tell', 'about', 'are' (none of these), 'me', 'my', 'I', 'm' all
    // get filtered. 'career' and 'tired' remain.
    expect(toks.has('career')).toBe(true);
    expect(toks.has('tired')).toBe(true);
    expect(toks.has('tell')).toBe(false); // stopword
    expect(toks.has('me')).toBe(false);   // too short
    expect(toks.has("i'm")).toBe(false);  // apostrophe → token boundary
  });

  it('handles empty / non-string input', () => {
    expect(tokeniseQuestion('').size).toBe(0);
    expect(tokeniseQuestion('   ').size).toBe(0);
    // @ts-expect-error — defensive against runtime non-strings
    expect(tokeniseQuestion(null).size).toBe(0);
  });

  it('preserves non-Latin scripts (Hindi sample)', () => {
    const toks = tokeniseQuestion('मेरा करियर कैसा होगा');
    // The Hindi tokens are all length ≥ 3 and not in the English
    // stopword list, so they survive. Specific membership not asserted
    // since char-count semantics vary; we just assert nothing collapses
    // to empty.
    expect(toks.size).toBeGreaterThan(0);
  });
});

describe('questionSimilarity — Madhavi same-topic pairs ≥ threshold', () => {
  it('Ishaan rewords', () => {
    const sim = questionSimilarity(M.ishaan_a, M.ishaan_b);
    expect(sim).toBeGreaterThanOrEqual(NEAR_DUPLICATE_THRESHOLD);
  });

  it('Abhishek rewords', () => {
    const sim = questionSimilarity(M.abhishek_a, M.abhishek_b);
    expect(sim).toBeGreaterThanOrEqual(NEAR_DUPLICATE_THRESHOLD);
  });

  it('career rewords (a ↔ b — punctuation-only difference)', () => {
    const sim = questionSimilarity(M.career_a, M.career_b);
    expect(sim).toBeGreaterThanOrEqual(0.95);
  });

  it('career rewords (a ↔ c)', () => {
    const sim = questionSimilarity(M.career_a, M.career_c);
    expect(sim).toBeGreaterThanOrEqual(NEAR_DUPLICATE_THRESHOLD);
  });

  it('career rewords (c ↔ d)', () => {
    const sim = questionSimilarity(M.career_c, M.career_d);
    expect(sim).toBeGreaterThanOrEqual(NEAR_DUPLICATE_THRESHOLD);
  });
});

describe('questionSimilarity — cross-topic pairs below threshold', () => {
  const pairs: Array<[string, string, string]> = [
    ['ishaan vs abhishek', M.ishaan_a, M.abhishek_a],
    ['ishaan vs career', M.ishaan_a, M.career_a],
    ['abhishek vs career', M.abhishek_a, M.career_a],
    ['abhishek_b vs career_d', M.abhishek_b, M.career_d],
  ];
  it.each(pairs)('%s', (_label, a, b) => {
    const sim = questionSimilarity(a, b);
    expect(sim).toBeLessThan(NEAR_DUPLICATE_THRESHOLD);
  });
});

describe('questionSimilarity — short-question false-positive guard', () => {
  it('does NOT flag "how will my career" vs "how will my finances" as duplicates', () => {
    // The classic short-question stopword-domination case. With
    // stopwords removed, "career" vs "finances" share no real tokens.
    const sim = questionSimilarity('How will my career go?', 'How will my finances go?');
    expect(sim).toBeLessThan(NEAR_DUPLICATE_THRESHOLD);
  });

  it('does NOT flag completely different short questions', () => {
    const sim = questionSimilarity('When will I get married?', 'What career suits me?');
    expect(sim).toBeLessThan(NEAR_DUPLICATE_THRESHOLD);
  });
});

describe('findNearDuplicates', () => {
  const now = new Date('2026-05-25T18:30:00Z');

  it('returns matches sorted by similarity desc and computes minutesAgo', () => {
    const newQ = M.career_d;
    const candidates = [
      { questionId: 'ishaan', question: M.ishaan_a, status: 'pending',   createdAt: '2026-05-25T18:05:00Z' },
      { questionId: 'career-c', question: M.career_c, status: 'completed', createdAt: '2026-05-25T18:29:00Z' },
      { questionId: 'career-a', question: M.career_a, status: 'completed', createdAt: '2026-05-25T18:27:00Z' },
      { questionId: 'abhishek', question: M.abhishek_a, status: 'completed', createdAt: '2026-05-25T18:14:00Z' },
    ];
    const dups = findNearDuplicates(newQ, candidates, now);
    expect(dups.length).toBeGreaterThanOrEqual(2);
    // First match must be the highest-similarity one.
    expect(dups[0].similarity).toBeGreaterThanOrEqual(dups[1].similarity);
    // Both career rewords should show up; ishaan/abhishek must not.
    const ids = dups.map((d) => d.questionId);
    expect(ids).toContain('career-c');
    expect(ids).toContain('career-a');
    expect(ids).not.toContain('ishaan');
    expect(ids).not.toContain('abhishek');
    // minutesAgo for the career-c row (created 18:29, now 18:30) = 1.
    const cMatch = dups.find((d) => d.questionId === 'career-c');
    expect(cMatch?.minutesAgo).toBe(1);
  });

  it('returns empty when no candidates clear the threshold', () => {
    const candidates = [
      { questionId: 'q1', question: 'totally unrelated thing', status: 'completed', createdAt: '2026-05-25T18:00:00Z' },
    ];
    expect(findNearDuplicates(M.career_a, candidates, now).length).toBe(0);
  });

  it('respects a custom threshold', () => {
    const candidates = [
      { questionId: 'q1', question: M.career_c, status: 'pending', createdAt: '2026-05-25T18:29:00Z' },
    ];
    // career_d vs career_c is well above 0.55 but well below 0.99.
    expect(findNearDuplicates(M.career_d, candidates, now, 0.99).length).toBe(0);
    expect(findNearDuplicates(M.career_d, candidates, now, 0.20).length).toBe(1);
  });
});
