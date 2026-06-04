/**
 * Tests for the hreflang/canonical helpers in src/lib/seo/hreflang.ts.
 * Focus: defaultLocale-not-in-indexable-set edge cases (Gemini PR #408
 * cycle-2 MED) — today every prefix policy includes 'en', so the
 * fallback path is theoretical, but the pickFallbackLocale guard
 * prevents canonical/x-default from ever pointing at a noindex page.
 *
 * Spec: docs/specs/2026-06-04-noindex-thin-translation-locales.md §5.1
 */

import { describe, it, expect } from 'vitest';
import { buildIndexableHreflang, buildCanonicalUrl } from '../hreflang';
import { BASE_URL } from '../base-url';

describe('buildCanonicalUrl', () => {
  it('uses the input locale on a full-coverage route', () => {
    expect(buildCanonicalUrl('/panchang/date/2026-06-04', 'mai'))
      .toBe(`${BASE_URL}/mai/panchang/date/2026-06-04`);
  });

  it('uses the input locale when it is indexable for a thin route', () => {
    // /learn/yoga/ policy is en+hi
    expect(buildCanonicalUrl('/learn/yoga/gajakesari', 'en'))
      .toBe(`${BASE_URL}/en/learn/yoga/gajakesari`);
    expect(buildCanonicalUrl('/learn/yoga/gajakesari', 'hi'))
      .toBe(`${BASE_URL}/hi/learn/yoga/gajakesari`);
  });

  it('falls back to defaultLocale when the input locale is non-indexable but defaultLocale IS indexable', () => {
    // gu is not in /learn/yoga/ policy (en+hi). defaultLocale is en.
    // Fallback should be en.
    expect(buildCanonicalUrl('/learn/yoga/gajakesari', 'gu'))
      .toBe(`${BASE_URL}/en/learn/yoga/gajakesari`);
  });

  it('keeps gauri-panchang ta/te/kn indexable (partial-coverage policy)', () => {
    expect(buildCanonicalUrl('/gauri-panchang/2026-07-04', 'ta'))
      .toBe(`${BASE_URL}/ta/gauri-panchang/2026-07-04`);
    expect(buildCanonicalUrl('/gauri-panchang/2026-07-04', 'kn'))
      .toBe(`${BASE_URL}/kn/gauri-panchang/2026-07-04`);
  });

  it('falls back to defaultLocale for non-indexable locale on gauri-panchang', () => {
    // gauri-panchang policy is en+hi+ta+te+kn. mai not in set.
    expect(buildCanonicalUrl('/gauri-panchang/2026-07-04', 'mai'))
      .toBe(`${BASE_URL}/en/gauri-panchang/2026-07-04`);
  });

  it('normalises a missing leading slash', () => {
    expect(buildCanonicalUrl('panchang', 'en'))
      .toBe(`${BASE_URL}/en/panchang`);
  });
});

describe('buildIndexableHreflang', () => {
  it('emits a key per visible locale for a full-coverage route', () => {
    const out = buildIndexableHreflang('/panchang/date/2026-06-04');
    expect(out.en).toBe(`${BASE_URL}/en/panchang/date/2026-06-04`);
    expect(out.hi).toBe(`${BASE_URL}/hi/panchang/date/2026-06-04`);
    expect(out.mai).toBe(`${BASE_URL}/mai/panchang/date/2026-06-04`);
    expect(out['x-default']).toBe(`${BASE_URL}/en/panchang/date/2026-06-04`);
    // sa is retired; must not appear (would cause "Hreflang to redirect"
    // — Gemini PR #407 cycle-2)
    expect(out.sa).toBeUndefined();
  });

  it('restricts to indexable locales for a thin-coverage route', () => {
    // /matching/ is still en+hi only — /learn/yoga/ was promoted to
    // en+hi+mai by the option A pilot (covered separately below).
    const out = buildIndexableHreflang('/matching/aries-and-leo');
    expect(Object.keys(out).sort()).toEqual(['en', 'hi', 'x-default'].sort());
    expect(out.mai).toBeUndefined();
    expect(out.gu).toBeUndefined();
  });

  it('includes mai + ta + te + bn for /learn/yoga/ after option A expansion', () => {
    const out = buildIndexableHreflang('/learn/yoga/gajakesari');
    expect(Object.keys(out).sort()).toEqual(['en', 'hi', 'mai', 'ta', 'te', 'bn', 'x-default'].sort());
    expect(out.mai).toContain('/mai/learn/yoga/gajakesari');
    expect(out.ta).toContain('/ta/learn/yoga/gajakesari');
    expect(out.te).toContain('/te/learn/yoga/gajakesari');
    expect(out.bn).toContain('/bn/learn/yoga/gajakesari');
  });

  it('emits en+hi+ta+te+kn for gauri-panchang (preserves partial coverage)', () => {
    const out = buildIndexableHreflang('/gauri-panchang/2026-07-04');
    const keys = Object.keys(out).sort();
    expect(keys).toEqual(['en', 'hi', 'kn', 'ta', 'te', 'x-default'].sort());
  });

  it('x-default falls back to defaultLocale when defaultLocale is in the indexable set', () => {
    // /learn/yoga/ is en+hi; defaultLocale (en) is in there.
    const out = buildIndexableHreflang('/learn/yoga/gajakesari');
    expect(out['x-default']).toBe(`${BASE_URL}/en/learn/yoga/gajakesari`);
  });

  it('hub pages get full-coverage hreflang (hub protection)', () => {
    const out = buildIndexableHreflang('/learn');
    expect(Object.keys(out)).toContain('mai');
    expect(Object.keys(out)).toContain('gu');
    expect(Object.keys(out)).toContain('en');
  });
});
