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

  it('keeps the served locale when all prefixes resolve to full 9-locale parity', () => {
    // After PR #596 (2026-06-08) the /learn/ prefix was promoted to all
    // 9 locales, so there are no remaining thin-coverage clusters.
    // Every locale's canonical maps to itself for /learn/* slugs.
    expect(buildCanonicalUrl('/learn/surya', 'gu'))
      .toBe(`${BASE_URL}/gu/learn/surya`);
    expect(buildCanonicalUrl('/learn/surya', 'mr'))
      .toBe(`${BASE_URL}/mr/learn/surya`);
  });

  it('keeps gauri-panchang ta/te/kn indexable (partial-coverage policy)', () => {
    expect(buildCanonicalUrl('/gauri-panchang/2026-07-04', 'ta'))
      .toBe(`${BASE_URL}/ta/gauri-panchang/2026-07-04`);
    expect(buildCanonicalUrl('/gauri-panchang/2026-07-04', 'kn'))
      .toBe(`${BASE_URL}/kn/gauri-panchang/2026-07-04`);
  });

  it('keeps gauri-panchang mai/mr/gu/bn indexable after full 9-locale promotion', () => {
    // gauri-panchang policy was en+hi+ta+te+kn until GAURI_NAMES gained
    // mai/mr/gu/bn — promoted to all 9. mai/mr/gu/bn now resolve to
    // their own locale paths rather than the en fallback.
    expect(buildCanonicalUrl('/gauri-panchang/2026-07-04', 'mai'))
      .toBe(`${BASE_URL}/mai/gauri-panchang/2026-07-04`);
    expect(buildCanonicalUrl('/gauri-panchang/2026-07-04', 'mr'))
      .toBe(`${BASE_URL}/mr/gauri-panchang/2026-07-04`);
    expect(buildCanonicalUrl('/gauri-panchang/2026-07-04', 'gu'))
      .toBe(`${BASE_URL}/gu/gauri-panchang/2026-07-04`);
    expect(buildCanonicalUrl('/gauri-panchang/2026-07-04', 'bn'))
      .toBe(`${BASE_URL}/bn/gauri-panchang/2026-07-04`);
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

  it('emits all 9 locales for /learn/ after the 2026-06-08 promotion (PR #596)', () => {
    // The /learn/ prefix was promoted to full 9-locale parity once
    // every src/messages/learn/*.json file reached ≥86% per-locale
    // coverage. Previously this test expected en+hi+x-default only.
    const out = buildIndexableHreflang('/learn/surya');
    expect(Object.keys(out).sort()).toEqual(
      ['en', 'hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn', 'x-default'].sort(),
    );
    expect(out.mai).toContain('/mai/learn/surya');
    expect(out.gu).toContain('/gu/learn/surya');
  });

  it('emits all 9 locales for /matching/ after the rashi-compatibility overlay merge', () => {
    const out = buildIndexableHreflang('/matching/aries-and-leo');
    expect(Object.keys(out).sort()).toEqual(['en', 'hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn', 'x-default'].sort());
    expect(out.mai).toContain('/mai/matching/aries-and-leo');
    expect(out.bn).toContain('/bn/matching/aries-and-leo');
  });

  it('emits all 9 locales for /devotional/ after the locale-overlay merge', () => {
    const out = buildIndexableHreflang('/devotional/aarti/santoshi-maa-aarti');
    expect(Object.keys(out).sort()).toEqual(['en', 'hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn', 'x-default'].sort());
    expect(out.mai).toContain('/mai/devotional/aarti/santoshi-maa-aarti');
    expect(out.bn).toContain('/bn/devotional/aarti/santoshi-maa-aarti');
  });

  it('emits all 9 locales for /baby-names/ after the chrome promotion', () => {
    const out = buildIndexableHreflang('/baby-names/punarvasu');
    expect(Object.keys(out).sort()).toEqual(['en', 'hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn', 'x-default'].sort());
    expect(out.mai).toContain('/mai/baby-names/punarvasu');
    expect(out.bn).toContain('/bn/baby-names/punarvasu');
  });

  it('includes mai + ta + te + bn for /learn/yoga/ after option A expansion', () => {
    const out = buildIndexableHreflang('/learn/yoga/gajakesari');
    expect(Object.keys(out).sort()).toEqual(['en', 'hi', 'mai', 'ta', 'te', 'bn', 'gu', 'kn', 'mr', 'x-default'].sort());
    expect(out.mai).toContain('/mai/learn/yoga/gajakesari');
    expect(out.ta).toContain('/ta/learn/yoga/gajakesari');
    expect(out.te).toContain('/te/learn/yoga/gajakesari');
    expect(out.bn).toContain('/bn/learn/yoga/gajakesari');
  });

  it('emits all 9 locales for gauri-panchang after full-coverage promotion', () => {
    const out = buildIndexableHreflang('/gauri-panchang/2026-07-04');
    const keys = Object.keys(out).sort();
    expect(keys).toEqual(['en', 'hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn', 'x-default'].sort());
    expect(out.mai).toContain('/mai/gauri-panchang/2026-07-04');
    expect(out.bn).toContain('/bn/gauri-panchang/2026-07-04');
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
