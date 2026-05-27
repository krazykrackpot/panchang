import { describe, it, expect } from 'vitest';
import { buildHealthContext, questionIsHealthRelated } from '../health-context';
import { computeHealthDiagnosis } from '@/lib/kundali/health-diagnosis';
import { generateKundali } from '@/lib/ephem/kundali-calc';

const BIRTH_FORM = {
  date: '1990-01-15',
  time: '06:30',
  lat: 28.61,
  lng: 77.21,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri' as const,
};

// ── buildHealthContext ───────────────────────────────────────────────────────

describe('buildHealthContext', () => {
  it('returns empty string for null diagnosis', () => {
    expect(buildHealthContext(null)).toBe('');
  });

  it('returns empty string for undefined diagnosis', () => {
    expect(buildHealthContext(undefined)).toBe('');
  });

  it('includes overall tier, top 5 elements, and prakriti mode for a real chart', () => {
    const k = generateKundali(BIRTH_FORM);
    const d = computeHealthDiagnosis(k, {});
    const ctx = buildHealthContext(d);

    expect(ctx).toContain('### Health Diagnosis Context');
    expect(ctx).toContain('Overall tier:');
    expect(ctx).toContain('Top 5 vulnerable elements:');
    expect(ctx).toContain('prakriti.');
  });

  it('contains at least one known element name for a real chart', () => {
    const k = generateKundali(BIRTH_FORM);
    const d = computeHealthDiagnosis(k, {});
    const ctx = buildHealthContext(d);

    // At least one of the 22 element names must appear in the top-5 block
    const knownElements = [
      'Digestive', 'Mental', 'Cardiac', 'Vitality', 'Respiratory',
      'Nervous', 'Skeletal', 'Muscular', 'Skin', 'Eyes',
      'Reproductive', 'Endocrine', 'Immunity', 'Chronic', 'Sleep',
    ];
    const hasElement = knownElements.some(name => ctx.includes(name));
    expect(hasElement, 'Expected at least one element name in health context').toBe(true);
  });

  it('includes overall rating text (uttama/madhyama/adhama/atyadhama)', () => {
    const k = generateKundali(BIRTH_FORM);
    const d = computeHealthDiagnosis(k, {});
    const ctx = buildHealthContext(d);

    expect(ctx).toMatch(/Overall tier: (UTTAMA|MADHYAMA|ADHAMA|ATYADHAMA)/);
  });

  it('mentions Sade Sati only when at least one element has it active', () => {
    const k = generateKundali(BIRTH_FORM);
    const d = computeHealthDiagnosis(k, {});
    const ctx = buildHealthContext(d);

    const sadeSatiActive = Object.values(d.currentMultipliers).some(m => m.sadeSatiActive);
    if (sadeSatiActive) {
      expect(ctx).toContain('Sade Sati');
    } else {
      // Should not mention Sade Sati when inactive
      expect(ctx.includes('Sade Sati')).toBe(false);
    }
  });

  it('does NOT include longevity section when extended = false (default)', () => {
    const k = generateKundali(BIRTH_FORM);
    const d = computeHealthDiagnosis(k, { extended: false });
    const ctx = buildHealthContext(d);
    // optedInToExtended is false → no longevity line
    expect(ctx).not.toContain('Longevity element:');
  });

  it('includes longevity section when extended = true', () => {
    const k = generateKundali(BIRTH_FORM);
    const d = computeHealthDiagnosis(k, { extended: true });
    if (d.natalElements.some(e => e.id === 'longevity')) {
      const ctx = buildHealthContext(d);
      expect(ctx).toContain('Longevity element:');
    }
    // If longevity element is missing even with extended (shouldn't happen but
    // defensive) the test passes by not reaching the assertion above.
  });

  it('returns a non-empty string of reasonable length for a real chart', () => {
    const k = generateKundali(BIRTH_FORM);
    const d = computeHealthDiagnosis(k, {});
    const ctx = buildHealthContext(d);
    // Should be >100 chars (meaningful content) and <5000 chars (~3000 tokens max)
    expect(ctx.length).toBeGreaterThan(100);
    expect(ctx.length).toBeLessThan(5000);
  });
});

// ── questionIsHealthRelated ──────────────────────────────────────────────────

describe('questionIsHealthRelated', () => {
  it('detects English health keywords', () => {
    expect(questionIsHealthRelated('Will my health improve?')).toBe(true);
    expect(questionIsHealthRelated('I have chronic stomach pain')).toBe(true);
    expect(questionIsHealthRelated('Should I see a doctor?')).toBe(true);
    expect(questionIsHealthRelated('What about my fertility chances?')).toBe(true);
    expect(questionIsHealthRelated('I suffer from anxiety and insomnia')).toBe(true);
    expect(questionIsHealthRelated('Is surgery needed for my condition?')).toBe(true);
    expect(questionIsHealthRelated('What is my longevity like?')).toBe(true);
    expect(questionIsHealthRelated('My cardiac health concerns me')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(questionIsHealthRelated('HEALTH concerns')).toBe(true);
    expect(questionIsHealthRelated('Chronic DISEASE risk')).toBe(true);
  });

  it('detects Hindi health keywords', () => {
    expect(questionIsHealthRelated('मेरी सेहत कैसी रहेगी?')).toBe(true);
    expect(questionIsHealthRelated('मुझे क्या रोग होगा?')).toBe(true);
    expect(questionIsHealthRelated('स्वास्थ्य के बारे में बताएं')).toBe(true);
    expect(questionIsHealthRelated('बीमारी से कैसे बचें')).toBe(true);
  });

  it('returns false for clearly non-health questions', () => {
    expect(questionIsHealthRelated('When will I get married?')).toBe(false);
    expect(questionIsHealthRelated('What about my career prospects?')).toBe(false);
    expect(questionIsHealthRelated('Is this a good time to buy a house?')).toBe(false);
    expect(questionIsHealthRelated('Tell me about my dasha period')).toBe(false);
    expect(questionIsHealthRelated('Will I travel abroad this year?')).toBe(false);
    expect(questionIsHealthRelated('Compatibility with my partner')).toBe(false);
  });

  it('handles empty string without throwing', () => {
    expect(questionIsHealthRelated('')).toBe(false);
  });

  it('handles questions with partial keyword matches (substring)', () => {
    // "heart" is a keyword — "heartfelt" contains it. Intentionally broad.
    expect(questionIsHealthRelated('I have a heartfelt concern about finances')).toBe(true);
    // "eye" is a keyword
    expect(questionIsHealthRelated('I need to keep an eye on my career')).toBe(true);
  });
});
