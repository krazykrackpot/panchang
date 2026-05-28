/**
 * Content data-parity fixtures for the festival deep-dive layer.
 *
 * Locks the en + hi minimum coverage for the three content data files
 * landed in commits 5-7:
 *   - wishes.ts        — 3 wishes per festival, en + hi required
 *   - observances.ts   — 4 dos + 4 donts per festival, en + hi required
 *   - historical-dates.ts — past-year coverage 2020-2025 for all 20
 *
 * Fixture-test pattern matches the festival-data-parity.test.ts file
 * landed in commit 1 — adds these new files as additional invariants.
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §11
 */

import { describe, expect, it } from 'vitest';
import { TOP_FESTIVAL_SLUGS } from '@/lib/calendar/festival-defs';
import { FESTIVAL_WISHES } from '../wishes';
import { FESTIVAL_OBSERVANCES } from '../observances';
import { HISTORICAL_FESTIVAL_DATES } from '../historical-dates';

const ALL_TOP_SLUGS = [...TOP_FESTIVAL_SLUGS] as string[];

describe('FESTIVAL_WISHES — coverage + i18n shape', () => {
  it('has at least 5 wishes for every TOP_FESTIVAL_SLUGS slug (spec target)', () => {
    for (const slug of ALL_TOP_SLUGS) {
      expect(FESTIVAL_WISHES[slug], `Missing wishes for ${slug}`).toBeDefined();
      expect(FESTIVAL_WISHES[slug].length, `${slug} should have ≥5 wishes per spec §4B`).toBeGreaterThanOrEqual(5);
    }
  });

  it('every wish has non-empty en + hi text', () => {
    for (const [slug, wishes] of Object.entries(FESTIVAL_WISHES)) {
      wishes.forEach((w, i) => {
        expect(w.text.en, `${slug}[${i}].text.en empty`).toBeTruthy();
        expect(w.text.hi, `${slug}[${i}].text.hi empty`).toBeTruthy();
        // Sanity: en text isn't accidentally pasted into the hi slot
        expect(w.text.en, `${slug}[${i}] en/hi are identical`).not.toBe(w.text.hi);
      });
    }
  });

  it('every wish has a valid tone', () => {
    const validTones = new Set(['traditional', 'modern', 'family', 'business']);
    for (const [slug, wishes] of Object.entries(FESTIVAL_WISHES)) {
      wishes.forEach((w, i) => {
        expect(validTones.has(w.tone), `${slug}[${i}] has invalid tone "${w.tone}"`).toBe(true);
      });
    }
  });

  it('wish text stays under 280 chars (Twitter-like shareability)', () => {
    for (const [slug, wishes] of Object.entries(FESTIVAL_WISHES)) {
      wishes.forEach((w, i) => {
        expect(w.text.en.length, `${slug}[${i}].text.en too long`).toBeLessThanOrEqual(280);
        expect(w.text.hi.length, `${slug}[${i}].text.hi too long`).toBeLessThanOrEqual(280);
      });
    }
  });
});

describe('FESTIVAL_OBSERVANCES — coverage + content shape', () => {
  it('has dos + donts for every TOP_FESTIVAL_SLUGS slug', () => {
    for (const slug of ALL_TOP_SLUGS) {
      expect(FESTIVAL_OBSERVANCES[slug], `Missing observance for ${slug}`).toBeDefined();
    }
  });

  it('every festival has between 4 and 6 dos + donts (baseline 4+4, spec ideal 6+6)', () => {
    // Spec §4C target is 6+6, ship baseline is 4+4. Festivals can sit
    // anywhere in [4, 6] — expansion is per-festival incremental, not
    // an all-or-nothing flag.
    for (const [slug, obs] of Object.entries(FESTIVAL_OBSERVANCES)) {
      expect(obs.dos.length, `${slug}.dos should be 4-6`).toBeGreaterThanOrEqual(4);
      expect(obs.dos.length, `${slug}.dos should be 4-6`).toBeLessThanOrEqual(6);
      expect(obs.donts.length, `${slug}.donts should be 4-6`).toBeGreaterThanOrEqual(4);
      expect(obs.donts.length, `${slug}.donts should be 4-6`).toBeLessThanOrEqual(6);
    }
  });

  it('every dos / donts item has non-empty en + hi text', () => {
    for (const [slug, obs] of Object.entries(FESTIVAL_OBSERVANCES)) {
      [...obs.dos, ...obs.donts].forEach((item, i) => {
        expect(item.text.en, `${slug}[item ${i}].text.en empty`).toBeTruthy();
        expect(item.text.hi, `${slug}[item ${i}].text.hi empty`).toBeTruthy();
        expect(item.text.en, `${slug}[item ${i}] en/hi are identical`).not.toBe(item.text.hi);
      });
    }
  });

  it('source citations (when present) are non-empty strings', () => {
    for (const [slug, obs] of Object.entries(FESTIVAL_OBSERVANCES)) {
      [...obs.dos, ...obs.donts].forEach((item, i) => {
        if (item.source !== undefined) {
          expect(typeof item.source, `${slug}[item ${i}].source`).toBe('string');
          expect(item.source.length, `${slug}[item ${i}].source empty`).toBeGreaterThan(0);
        }
      });
    }
  });
});

describe('HISTORICAL_FESTIVAL_DATES — coverage + format', () => {
  it('has historical dates for every TOP_FESTIVAL_SLUGS slug', () => {
    for (const slug of ALL_TOP_SLUGS) {
      expect(HISTORICAL_FESTIVAL_DATES[slug], `Missing historical dates for ${slug}`).toBeDefined();
    }
  });

  it('every festival has dates for all years 2020-2025 (6 entries)', () => {
    for (const [slug, dates] of Object.entries(HISTORICAL_FESTIVAL_DATES)) {
      for (const year of [2020, 2021, 2022, 2023, 2024, 2025]) {
        expect(dates[year], `${slug}.${year} missing`).toBeDefined();
      }
    }
  });

  it('every date is in YYYY-MM-DD format and in the right year', () => {
    const isoRe = /^(\d{4})-(\d{2})-(\d{2})$/;
    for (const [slug, dates] of Object.entries(HISTORICAL_FESTIVAL_DATES)) {
      for (const [yearStr, dateStr] of Object.entries(dates)) {
        const m = dateStr.match(isoRe);
        expect(m, `${slug}.${yearStr}: bad format "${dateStr}"`).not.toBeNull();
        expect(m![1], `${slug}.${yearStr}: year mismatch in date string`).toBe(yearStr);
        const month = parseInt(m![2], 10);
        const day = parseInt(m![3], 10);
        expect(month >= 1 && month <= 12, `${slug}.${yearStr}: invalid month ${month}`).toBe(true);
        expect(day >= 1 && day <= 31, `${slug}.${yearStr}: invalid day ${day}`).toBe(true);
      }
    }
  });

  it('Diwali 2024 was on Nov 1 (canonical historical anchor — Prokerala)', () => {
    expect(HISTORICAL_FESTIVAL_DATES['diwali'][2024]).toBe('2024-11-01');
  });

  it('Holi 2024 was on Mar 25 (canonical historical anchor)', () => {
    expect(HISTORICAL_FESTIVAL_DATES['holi'][2024]).toBe('2024-03-25');
  });

  it('Makar Sankranti stays around Jan 14-15 every year (solar festival anchor)', () => {
    for (const [year, dateStr] of Object.entries(HISTORICAL_FESTIVAL_DATES['makar-sankranti'])) {
      const day = parseInt(dateStr.split('-')[2], 10);
      expect(day, `Makar Sankranti ${year} should be Jan 14 or 15`).toBeGreaterThanOrEqual(14);
      expect(day, `Makar Sankranti ${year} should be Jan 14 or 15`).toBeLessThanOrEqual(15);
    }
  });
});
