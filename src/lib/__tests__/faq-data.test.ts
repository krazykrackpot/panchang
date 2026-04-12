import { describe, it, expect } from 'vitest';
import { FAQ_DATA, generateFAQLD } from '@/lib/seo/faq-data';

describe('FAQ_DATA', () => {
  it('has entries for all required routes', () => {
    const required = ['/panchang', '/panchang/tithi', '/panchang/nakshatra', '/panchang/yoga',
      '/panchang/rashi', '/matching', '/horoscope', '/kundali', '/muhurta-ai', '/rahu-kaal', '/choghadiya'];
    required.forEach(route => {
      expect(FAQ_DATA[route]).toBeDefined();
      expect(FAQ_DATA[route].length).toBeGreaterThanOrEqual(3);
    });
  });

  it('each FAQ has en text for question and answer', () => {
    Object.values(FAQ_DATA).forEach(faqs => {
      faqs.forEach(faq => {
        expect(faq.question.en).toBeTruthy();
        expect(faq.answer.en).toBeTruthy();
      });
    });
  });

  it('each FAQ has hi text for question and answer', () => {
    Object.values(FAQ_DATA).forEach(faqs => {
      faqs.forEach(faq => {
        expect(faq.question.hi).toBeTruthy();
        expect(faq.answer.hi).toBeTruthy();
      });
    });
  });
});

describe('generateFAQLD', () => {
  it('returns FAQPage JSON-LD for known routes', () => {
    const ld = generateFAQLD('/panchang', 'en');
    expect(ld).toBeDefined();
    expect(ld!['@type']).toBe('FAQPage');
    expect(ld!.mainEntity).toHaveLength(FAQ_DATA['/panchang'].length);
  });

  it('returns null for unknown routes', () => {
    expect(generateFAQLD('/nonexistent', 'en')).toBeNull();
  });

  it('uses locale-specific text when available', () => {
    const ldEn = generateFAQLD('/panchang', 'en') as any;
    const ldHi = generateFAQLD('/panchang', 'hi') as any;
    expect(ldEn.mainEntity[0].name).not.toBe(ldHi.mainEntity[0].name);
  });

  it('falls back to en when locale is missing', () => {
    const ldEn = generateFAQLD('/panchang', 'en') as any;
    const ldSa = generateFAQLD('/panchang', 'sa') as any;
    // sa may not exist for all entries, should fall back to en
    expect(ldSa.mainEntity[0].name).toBeTruthy();
  });

  it('has correct schema.org context', () => {
    const ld = generateFAQLD('/kundali', 'en');
    expect(ld!['@context']).toBe('https://schema.org');
  });

  it('each mainEntity has Question type with acceptedAnswer', () => {
    const ld = generateFAQLD('/matching', 'en') as any;
    ld.mainEntity.forEach((entity: any) => {
      expect(entity['@type']).toBe('Question');
      expect(entity.name).toBeTruthy();
      expect(entity.acceptedAnswer['@type']).toBe('Answer');
      expect(entity.acceptedAnswer.text).toBeTruthy();
    });
  });
});
