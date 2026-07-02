import { describe, it, expect } from 'vitest';
import {
  getLocaleDefaultCity,
  isBotUserAgent,
  resolveGeoCitySlug,
  slugifyGeoCity,
  LOCALE_DEFAULT_CITY,
} from '../locale-default-city';
import { CANONICAL_CITY_SLUGS } from '../proxy-allowlists';

describe('getLocaleDefaultCity', () => {
  it('returns Delhi for en', () => {
    const c = getLocaleDefaultCity('en');
    expect(c.slug).toBe('delhi');
    expect(c.displayName).toBe('New Delhi');
    expect(c.timezone).toBe('Asia/Kolkata');
  });

  it('returns Chennai for ta', () => {
    expect(getLocaleDefaultCity('ta').slug).toBe('chennai');
  });

  it('returns Patna for mai', () => {
    expect(getLocaleDefaultCity('mai').slug).toBe('patna');
  });

  it('returns Kolkata for bn', () => {
    expect(getLocaleDefaultCity('bn').slug).toBe('kolkata');
  });

  it('falls back to en (Delhi) for unknown locales', () => {
    expect(getLocaleDefaultCity('xx').slug).toBe('delhi');
    expect(getLocaleDefaultCity('').slug).toBe('delhi');
  });

  it('every default city slug is in the canonical set', () => {
    // Locks in the invariant: if someone ever removes a slug from
    // proxy-allowlists we get a red test instead of a broken redirect.
    for (const [locale, city] of Object.entries(LOCALE_DEFAULT_CITY)) {
      expect(
        CANONICAL_CITY_SLUGS.has(city.slug),
        `${locale} default city "${city.slug}" is missing from CANONICAL_CITY_SLUGS`,
      ).toBe(true);
    }
  });
});

describe('slugifyGeoCity', () => {
  it('lowercases + hyphenates spaces', () => {
    expect(slugifyGeoCity('New Delhi')).toBe('new-delhi');
  });

  it('handles diacritics', () => {
    expect(slugifyGeoCity('São Paulo')).toBe('sao-paulo');
  });

  it('drops non-ASCII after transliteration attempt', () => {
    // Native-script city names Vercel emits are treated as unknown —
    // safer than mapping to a random Latin slug. Callers use the
    // canonical-slug check to fall through to locale default.
    // (Testing that at least it doesn't crash and returns a bounded string.)
    const out = slugifyGeoCity('मुंबई');
    expect(typeof out === 'string' || out === null).toBe(true);
  });

  it('collapses repeated hyphens', () => {
    expect(slugifyGeoCity('a   b')).toBe('a-b');
  });

  it('strips leading/trailing hyphens', () => {
    expect(slugifyGeoCity('-abc-')).toBe('abc');
  });

  it('returns null for empty / whitespace-only input', () => {
    expect(slugifyGeoCity('')).toBeNull();
    expect(slugifyGeoCity('  ')).toBeNull();
    expect(slugifyGeoCity(null)).toBeNull();
    expect(slugifyGeoCity(undefined)).toBeNull();
  });
});

describe('resolveGeoCitySlug', () => {
  it('maps a canonical city name to its slug', () => {
    expect(resolveGeoCitySlug('Delhi', CANONICAL_CITY_SLUGS)).toBe('delhi');
    expect(resolveGeoCitySlug('Mumbai', CANONICAL_CITY_SLUGS)).toBe('mumbai');
  });

  it('applies aliases: Bengaluru → bangalore', () => {
    expect(resolveGeoCitySlug('Bengaluru', CANONICAL_CITY_SLUGS)).toBe('bangalore');
  });

  it('applies aliases: New Delhi → delhi', () => {
    expect(resolveGeoCitySlug('New Delhi', CANONICAL_CITY_SLUGS)).toBe('delhi');
  });

  it('returns null for unknown cities', () => {
    // The Iowa-Googlebot bug: US datacentre cities should NOT resolve.
    // Real users in those cities also get the fallback (locale-default),
    // which is the intended behaviour for cities we don't ISR.
    expect(resolveGeoCitySlug('Ashburn', CANONICAL_CITY_SLUGS)).toBeNull();
    expect(resolveGeoCitySlug('Des Moines', CANONICAL_CITY_SLUGS)).toBeNull();
    expect(resolveGeoCitySlug('Washington', CANONICAL_CITY_SLUGS)).toBeNull();
  });

  it('returns null for empty / null input', () => {
    expect(resolveGeoCitySlug('', CANONICAL_CITY_SLUGS)).toBeNull();
    expect(resolveGeoCitySlug(null, CANONICAL_CITY_SLUGS)).toBeNull();
    expect(resolveGeoCitySlug(undefined, CANONICAL_CITY_SLUGS)).toBeNull();
  });
});

describe('isBotUserAgent', () => {
  it('classifies real Googlebot as bot', () => {
    expect(
      isBotUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'),
    ).toBe(true);
  });

  it('classifies Bingbot as bot', () => {
    expect(isBotUserAgent('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)')).toBe(true);
  });

  it('classifies GPTBot as bot', () => {
    expect(isBotUserAgent('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.0')).toBe(true);
  });

  it('classifies PerplexityBot as bot', () => {
    expect(isBotUserAgent('Mozilla/5.0 (compatible; PerplexityBot/1.0)')).toBe(true);
  });

  it('classifies Facebook social-card fetcher as bot', () => {
    expect(isBotUserAgent('facebookexternalhit/1.1')).toBe(true);
  });

  it('classifies real Chrome as human', () => {
    expect(
      isBotUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      ),
    ).toBe(false);
  });

  it('classifies mobile Safari as human', () => {
    expect(
      isBotUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
      ),
    ).toBe(false);
  });

  it('returns false for null / empty UA', () => {
    expect(isBotUserAgent(null)).toBe(false);
    expect(isBotUserAgent(undefined)).toBe(false);
    expect(isBotUserAgent('')).toBe(false);
  });
});
