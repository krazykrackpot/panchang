import { describe, it, expect } from 'vitest';
import {
  CITIES,
  SEO_CITY_BY_LOCALE,
  getSeoCityForLocale,
} from '../cities';

// The SEO city map exists to break cross-locale duplicate-content
// signals on templated date pages. Before the map, every /xx/choghadiya/
// /xx/panchang/date/ /xx/hora/ etc. rendered Delhi data — same times,
// same sunrise, same weekday — and Google's content-similarity classifier
// started consolidating canonicals across /hi/ and /mr/ around 2026-05-29
// (see GSC inspection in /tmp/cluster-out.log). These tests guard the
// invariants that make the map actually fix the problem.

describe('SEO_CITY_BY_LOCALE — locale-specific defaults', () => {
  it('every mapped slug exists in CITIES', () => {
    for (const [locale, slug] of Object.entries(SEO_CITY_BY_LOCALE)) {
      const city = CITIES.find(c => c.slug === slug);
      expect(city, `locale ${locale} → ${slug} must resolve to a real city`).toBeDefined();
    }
  });

  it('every active locale has a mapping', () => {
    // From CLAUDE.md / feedback_four_locales.md — 9 active locales as of
    // 2026-05-31. If a new locale ships, this test fails until the map
    // is updated, forcing the per-locale-default decision to be made
    // explicitly rather than silently defaulting to Delhi.
    const activeLocales = ['en', 'hi', 'mr', 'ta', 'te', 'bn', 'gu', 'kn', 'mai'];
    for (const loc of activeLocales) {
      expect(SEO_CITY_BY_LOCALE[loc], `${loc} must be in SEO_CITY_BY_LOCALE`).toBeDefined();
    }
  });

  it('produces enough variety to break cross-locale duplicate signal', () => {
    // The whole point is that /hi/ and /mr/ don't render identical data.
    // Require at least 6 distinct cities across the 9 active locales.
    // (Some grouping is fine — e.g. if /ta/ and /kn/ both pointed to
    // chennai it would still help, but ≥6 distinct keeps the safety
    // margin against accidental collapse.)
    const slugs = Object.values(SEO_CITY_BY_LOCALE);
    const distinct = new Set(slugs);
    expect(distinct.size).toBeGreaterThanOrEqual(6);
  });

  it('en and hi point to DIFFERENT cities', () => {
    // /en/ and /hi/ are the two biggest-traffic locales. If they
    // resolve to the same city the cross-locale duplicate signal
    // is unfixed for the biggest cluster pair.
    expect(SEO_CITY_BY_LOCALE.en).not.toBe(SEO_CITY_BY_LOCALE.hi);
  });
});

describe('getSeoCityForLocale', () => {
  it('returns the mapped city for a known locale', () => {
    const city = getSeoCityForLocale('hi');
    expect(city.slug).toBe(SEO_CITY_BY_LOCALE.hi);
  });

  it('falls back to the provided slug for unmapped locales', () => {
    const city = getSeoCityForLocale('xx', 'mumbai');
    expect(city.slug).toBe('mumbai');
  });

  it('defaults to delhi when no fallback provided and locale is unmapped', () => {
    const city = getSeoCityForLocale('xx');
    expect(city.slug).toBe('delhi');
  });

  it('never returns undefined even if both locale and fallback are unknown', () => {
    const city = getSeoCityForLocale('xx', 'this-slug-does-not-exist');
    // Final-fallback path returns CITIES[0] rather than undefined —
    // calling code should never have to null-check the result.
    expect(city).toBeDefined();
    expect(city.slug).toBeTruthy();
  });

  it('returns CityData with usable lat/lng/timezone fields', () => {
    // The handler immediately passes these into computePanchang, so a
    // city missing any of these would crash SSR.
    for (const locale of Object.keys(SEO_CITY_BY_LOCALE)) {
      const city = getSeoCityForLocale(locale);
      expect(typeof city.lat, `${locale}.lat`).toBe('number');
      expect(typeof city.lng, `${locale}.lng`).toBe('number');
      expect(typeof city.timezone, `${locale}.timezone`).toBe('string');
      expect(city.timezone.length).toBeGreaterThan(0);
    }
  });
});

describe('SEO_CITY_BY_LOCALE specific picks (intent regression guards)', () => {
  // These assertions encode the deliberate cultural-coding choices.
  // If a future PR tries to swap /gu/ from Vadodara to Ahmedabad
  // without thinking, this test fails and forces a conversation.
  it('/gu/ → Vadodara (Gujarati-coded over generic Ahmedabad)', () => {
    expect(SEO_CITY_BY_LOCALE.gu).toBe('vadodara');
  });
  it('/mai/ → Darbhanga (Mithila cultural capital, not Patna)', () => {
    expect(SEO_CITY_BY_LOCALE.mai).toBe('darbhanga');
  });
  it('/hi/ → Ujjain (Jyotish-coded, distinct from /en/ Delhi)', () => {
    expect(SEO_CITY_BY_LOCALE.hi).toBe('ujjain');
  });
  it('/mr/ → Mumbai', () => {
    expect(SEO_CITY_BY_LOCALE.mr).toBe('mumbai');
  });
});
