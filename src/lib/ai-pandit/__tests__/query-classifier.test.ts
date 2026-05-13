/**
 * Query Classifier Tests — 40+ bilingual queries
 *
 * Tests: 20 English, 15 Hindi, 5 Hinglish queries.
 * Verifies category, complexity, and tier assignment.
 */

import { describe, it, expect } from 'vitest';
import { classifyCategory, classifyComplexity, assignTier, classifyQuery } from '../query/classifier';
import { normaliseToCategory, buildCacheKey, buildBirthFingerprint } from '../query/normaliser';

// ─────────────────────────────────────────────────────────────────────────────
// Category classification
// ─────────────────────────────────────────────────────────────────────────────

describe('classifyCategory', () => {
  // English (20)
  it.each([
    ['Is this a good time for a job change?', 'career'],
    ['How is my career looking this year?', 'career'],
    ['Will I get a promotion soon?', 'career'],
    ['When will I get married?', 'relationship'],
    ['Is my marriage compatible?', 'relationship'],
    ['How is my love life?', 'relationship'],
    ['Will my health improve?', 'health'],
    ['Any illness predicted?', 'health'],
    ['How are my finances?', 'wealth'],
    ['Will I earn more money?', 'wealth'],
    ['When will I have a child?', 'children'],
    ['Fertility prospects?', 'children'],
    ['Will my son do well?', 'children'],
    ['How are my exam results looking?', 'education'],
    ['Should I study abroad?', 'education'],
    ['What is my spiritual path?', 'spiritual'],
    ['How to achieve moksha?', 'spiritual'],
    ['Tell me about my chart', 'general'],
    ['What does my kundali say?', 'general'],
    ['What is my overall outlook?', 'general'],
  ])('EN: "%s" → %s', (text, expected) => {
    expect(classifyCategory(text)).toBe(expected);
  });

  // Hindi (15)
  it.each([
    ['क्या ये समय नौकरी बदलने के लिए सही है?', 'career'],
    ['मेरा व्यापार कैसा रहेगा?', 'career'],
    ['तरक्की कब होगी?', 'career'],
    ['मेरी शादी कब होगी?', 'relationship'],
    ['पति से रिश्ता कैसा रहेगा?', 'relationship'],
    ['मेरा स्वास्थ्य कैसा रहेगा?', 'health'],
    ['क्या कोई बीमारी का योग है?', 'health'],
    ['धन लाभ कब होगा?', 'wealth'],
    ['संपत्ति में निवेश करूँ?', 'wealth'],
    ['संतान सुख कैसा है?', 'children'],
    ['बेटी की परीक्षा कैसी रहेगी?', 'children'], // "बेटी" (daughter) + "परीक्षा" (exam) — child trumps education
    ['पढ़ाई में सफलता कब मिलेगी?', 'education'],
    ['आध्यात्मिक उन्नति कैसे होगी?', 'spiritual'],
    ['पूजा का लाभ कब दिखेगा?', 'spiritual'],
    ['मेरी कुण्डली में क्या है?', 'general'],
  ])('HI: "%s" → %s', (text, expected) => {
    expect(classifyCategory(text)).toBe(expected);
  });

  // Hinglish (5)
  it.each([
    ['career kaisa rahega?', 'career'],
    ['shaadi kab hogi?', 'relationship'],
    ['paisa kab milega?', 'wealth'],
    ['baccha kab hoga?', 'children'],
    ['padhai mein success milegi?', 'education'],
  ])('Hinglish: "%s" → %s', (text, expected) => {
    expect(classifyCategory(text)).toBe(expected);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Complexity classification
// ─────────────────────────────────────────────────────────────────────────────

describe('classifyComplexity', () => {
  it.each([
    ['What dasha am I in?', 'factual'],
    ['Which nakshatra is my Moon in?', 'factual'],
    ['मेरी दशा क्या चल रही है?', 'factual'],
    ['कौन सी राशि है मेरी?', 'factual'],
    ['When does my Sade Sati end?', 'factual'],
    ['कब खत्म होगी साढ़ेसाती?', 'factual'],
  ])('factual: "%s"', (text, expected) => {
    expect(classifyComplexity(text)).toBe(expected);
  });

  it.each([
    ['Which month is better — June or July?', 'comparative'],
    ['Compare my options', 'comparative'],
    ['कौन सा बेहतर है?', 'comparative'],
  ])('comparative: "%s"', (text, expected) => {
    expect(classifyComplexity(text)).toBe(expected);
  });

  it.each([
    ['What should I do about my career?', 'remedial'],
    ['Any remedy for Sade Sati?', 'remedial'],
    ['उपाय बताइए', 'remedial'],
    ['कैसे सुधारें ये स्थिति?', 'remedial'],
    ['Which gemstone should I wear?', 'remedial'],
    ['मंत्र जप करूँ?', 'remedial'],
  ])('remedial: "%s"', (text, expected) => {
    expect(classifyComplexity(text)).toBe(expected);
  });

  it.each([
    ['What will 2027 look like for me?', 'predictive'],
    ['When will my career improve?', 'predictive'],
    ['अगले साल कैसा रहेगा?', 'predictive'],
    ['भविष्य कैसा है?', 'predictive'],
  ])('predictive: "%s"', (text, expected) => {
    expect(classifyComplexity(text)).toBe(expected);
  });

  it.each([
    ['Is this a good time for business?', 'interpretive'],
    ['How is my career?', 'interpretive'],
    ['मेरा करियर कैसा रहेगा?', 'interpretive'],
  ])('interpretive (default): "%s"', (text, expected) => {
    expect(classifyComplexity(text)).toBe(expected);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tier assignment
// ─────────────────────────────────────────────────────────────────────────────

describe('assignTier', () => {
  it('factual → tier 0', () => expect(assignTier('factual')).toBe(0));
  it('interpretive → tier 1', () => expect(assignTier('interpretive')).toBe(1));
  it('remedial → tier 1', () => expect(assignTier('remedial')).toBe(1));
  it('predictive → tier 2', () => expect(assignTier('predictive')).toBe(2));
  it('comparative → tier 2', () => expect(assignTier('comparative')).toBe(2));
});

// ─────────────────────────────────────────────────────────────────────────────
// Normaliser
// ─────────────────────────────────────────────────────────────────────────────

describe('normaliseToCategory', () => {
  it('maps English synonyms', () => {
    expect(normaliseToCategory('how is my job?')).toBe('career');
    expect(normaliseToCategory('tell me about my spouse')).toBe('relationship');
  });

  it('maps Hindi synonyms', () => {
    expect(normaliseToCategory('नौकरी कैसी रहेगी?')).toBe('career');
    expect(normaliseToCategory('शादी कब होगी?')).toBe('relationship');
  });

  it('maps Hinglish', () => {
    expect(normaliseToCategory('paisa kab milega?')).toBe('wealth');
  });

  it('returns null for unrecognised queries', () => {
    expect(normaliseToCategory('hello world')).toBeNull();
  });
});

describe('buildCacheKey', () => {
  it('produces deterministic 16-char hex key', () => {
    const key = buildCacheKey('abc123', 'career', 'en');
    expect(key).toHaveLength(16);
    expect(key).toMatch(/^[0-9a-f]+$/);
  });

  it('same inputs produce same key', () => {
    const a = buildCacheKey('fp1', 'health', 'hi');
    const b = buildCacheKey('fp1', 'health', 'hi');
    expect(a).toBe(b);
  });

  it('different inputs produce different keys', () => {
    const a = buildCacheKey('fp1', 'health', 'hi');
    const b = buildCacheKey('fp1', 'health', 'en');
    expect(a).not.toBe(b);
  });
});

describe('buildBirthFingerprint', () => {
  it('produces deterministic fingerprint', () => {
    const a = buildBirthFingerprint('1990-06-15', '10:30', 46.9481, 7.4474);
    const b = buildBirthFingerprint('1990-06-15', '10:30', 46.9481, 7.4474);
    expect(a).toBe(b);
    expect(a).toHaveLength(16);
  });

  it('different birth data produces different fingerprint', () => {
    const a = buildBirthFingerprint('1990-06-15', '10:30', 46.9481, 7.4474);
    const b = buildBirthFingerprint('1990-06-16', '10:30', 46.9481, 7.4474);
    expect(a).not.toBe(b);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Full classifyQuery
// ─────────────────────────────────────────────────────────────────────────────

describe('classifyQuery', () => {
  const fp = 'testfingerprint1';

  it('produces a complete ClassifiedQuery', () => {
    const result = classifyQuery({ text: 'How is my career?', locale: 'en' }, fp);
    expect(result.originalText).toBe('How is my career?');
    expect(result.locale).toBe('en');
    expect(result.category).toBe('career');
    expect(result.complexity).toBe('interpretive');
    expect(result.tier).toBe(1);
    expect(result.cacheKey).toBeTruthy();
  });

  it('respects category override', () => {
    const result = classifyQuery({ text: 'tell me something', locale: 'en', category: 'health' }, fp);
    expect(result.category).toBe('health');
  });

  it('works with Hindi query', () => {
    const result = classifyQuery({ text: 'मेरी शादी कब होगी?', locale: 'hi' }, fp);
    expect(result.category).toBe('relationship');
  });
});
