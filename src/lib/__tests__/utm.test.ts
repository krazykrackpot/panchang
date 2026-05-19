import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseUtmFromUrl, getUtmParams, type UtmParams } from '../utm';

describe('parseUtmFromUrl', () => {
  it('extracts all UTM params from a URL string', () => {
    const url = 'https://dekhopanchang.com/en/kundali?utm_source=devto&utm_medium=article&utm_campaign=vedic-astronomy-pt2&utm_content=cta-hero&utm_term=vedic+calendar';
    const result = parseUtmFromUrl(url);
    expect(result).toEqual({
      utm_source: 'devto',
      utm_medium: 'article',
      utm_campaign: 'vedic-astronomy-pt2',
      utm_content: 'cta-hero',
      utm_term: 'vedic calendar',
    });
  });

  it('returns null when no UTM params present', () => {
    const url = 'https://dekhopanchang.com/en/kundali';
    expect(parseUtmFromUrl(url)).toBeNull();
  });

  it('returns partial UTM params (only source)', () => {
    const url = 'https://dekhopanchang.com/?utm_source=google';
    const result = parseUtmFromUrl(url);
    expect(result).toEqual({
      utm_source: 'google',
      utm_medium: undefined,
      utm_campaign: undefined,
      utm_content: undefined,
      utm_term: undefined,
    });
  });

  it('trims whitespace from values', () => {
    const url = 'https://dekhopanchang.com/?utm_source=%20devto%20&utm_medium=article';
    const result = parseUtmFromUrl(url);
    expect(result?.utm_source).toBe('devto');
  });
});
