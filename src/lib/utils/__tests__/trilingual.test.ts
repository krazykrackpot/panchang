import { describe, it, expect } from 'vitest';
import { tl, tlScript } from '../trilingual';

describe('tl() — English fallback only', () => {
  const obj = { en: 'Mars', hi: 'मंगल' };

  it('returns direct match when locale field is present', () => {
    expect(tl(obj, 'en')).toBe('Mars');
    expect(tl(obj, 'hi')).toBe('मंगल');
  });

  it('falls back to .en when locale field is missing (no Devanagari sibling rule)', () => {
    expect(tl(obj, 'mai')).toBe('Mars');
    expect(tl(obj, 'mr')).toBe('Mars');
    expect(tl(obj, 'ta')).toBe('Mars');
    expect(tl(obj, 'te')).toBe('Mars');
    expect(tl(obj, 'kn')).toBe('Mars');
    expect(tl(obj, 'gu')).toBe('Mars');
    expect(tl(obj, 'bn')).toBe('Mars');
  });

  it('returns empty string for null/undefined obj', () => {
    expect(tl(null, 'en')).toBe('');
    expect(tl(undefined, 'en')).toBe('');
  });

  it('falls back to .en when neither locale nor .en is set', () => {
    expect(tl({ hi: 'मंगल' } as Record<string, string>, 'ta')).toBe('');
  });
});

describe('tlScript() — Devanagari script-family fallback', () => {
  const obj = { en: 'Mars', hi: 'मंगल' };

  it('returns direct match when locale field is present (all 9 locales)', () => {
    const fullObj = {
      en: 'Mars',
      hi: 'मंगल',
      mai: 'मंगल',
      mr: 'मंगळ',
      ta: 'செவ்வாய்',
      te: 'కుజుడు',
      kn: 'ಮಂಗಳ',
      gu: 'મંગળ',
      bn: 'মঙ্গল',
    };
    expect(tlScript(fullObj, 'en')).toBe('Mars');
    expect(tlScript(fullObj, 'hi')).toBe('मंगल');
    expect(tlScript(fullObj, 'mai')).toBe('मंगल');
    expect(tlScript(fullObj, 'mr')).toBe('मंगळ');
    expect(tlScript(fullObj, 'ta')).toBe('செவ்வாய்');
    expect(tlScript(fullObj, 'te')).toBe('కుజుడు');
    expect(tlScript(fullObj, 'kn')).toBe('ಮಂಗಳ');
    expect(tlScript(fullObj, 'gu')).toBe('મંગળ');
    expect(tlScript(fullObj, 'bn')).toBe('মঙ্গল');
  });

  it('Devanagari-script locales (mai/mr/sa) fall back to .hi when their field is missing', () => {
    expect(tlScript(obj, 'mai')).toBe('मंगल');
    expect(tlScript(obj, 'mr')).toBe('मंगल');
    expect(tlScript(obj, 'sa')).toBe('मंगल');
  });

  it('non-Devanagari locales fall back to .en (no script-sibling rule)', () => {
    expect(tlScript(obj, 'ta')).toBe('Mars');
    expect(tlScript(obj, 'te')).toBe('Mars');
    expect(tlScript(obj, 'kn')).toBe('Mars');
    expect(tlScript(obj, 'gu')).toBe('Mars');
    expect(tlScript(obj, 'bn')).toBe('Mars');
  });

  it('en is direct match, never falls through', () => {
    expect(tlScript(obj, 'en')).toBe('Mars');
  });

  it('matches the legacy `isHi ? obj.hi : obj.en` behaviour for the 9 visible locales', () => {
    // The pattern this helper replaces routes 4 Devanagari locales to .hi
    // and the other 5 to .en. Verify identical output.
    const isDevanagari = (l: string) => ['hi', 'mai', 'mr', 'sa'].includes(l);
    for (const locale of ['en', 'hi', 'mai', 'mr', 'sa', 'ta', 'te', 'kn', 'gu', 'bn']) {
      const legacy = isDevanagari(locale) ? obj.hi : obj.en;
      expect(tlScript(obj, locale), `legacy mismatch for ${locale}`).toBe(legacy);
    }
  });

  it('direct match wins over Devanagari fallback (future-proof when mr/mai data ships)', () => {
    const objWithMr = { en: 'Strong', hi: 'सशक्त', mr: 'बलवान' };
    expect(tlScript(objWithMr, 'mr')).toBe('बलवान'); // not .hi
    // mai still falls back to .hi (no .mai field)
    expect(tlScript(objWithMr, 'mai')).toBe('सशक्त');
  });

  it('returns empty string for null/undefined obj', () => {
    expect(tlScript(null, 'mai')).toBe('');
    expect(tlScript(undefined, 'hi')).toBe('');
  });

  it('returns "" when neither locale, .hi, nor .en is set', () => {
    expect(tlScript({} as Record<string, string>, 'mai')).toBe('');
  });
});
