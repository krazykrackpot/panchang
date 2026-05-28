/**
 * Lock for the Festival Event JSON-LD helper.
 *
 * Critical: for single-day festivals the output MUST be byte-identical
 * (modulo whitespace) to the previous inline implementation that lived
 * in /festivals/[slug]/[year]/page.tsx at the time of PR #264. The
 * baseline below is hand-copied from that file (see commit 79fe9b09).
 *
 * If this test fails after a refactor, the helper has drifted from the
 * proven Google-Rich-Results-validated shape — fix the helper, do NOT
 * change the baseline.
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §4E
 */

import { describe, expect, it } from 'vitest';
import { generateFestivalEventLD } from '../event-ld';

const TEST_BASE_URL = 'https://dekhopanchang.com';

describe('generateFestivalEventLD — byte-identical refactor lock', () => {
  it('single-day Diwali 2026 matches the prior inline shape exactly', () => {
    const out = generateFestivalEventLD({
      slug: 'diwali',
      year: 2026,
      locale: 'en',
      festivalNameEn: 'Diwali',
      festivalDate: '2026-11-08',
      description: 'Diwali 2026. Puja muhurta: 18:45–20:25. City-wise timings for 6+ cities.',
      baseUrl: TEST_BASE_URL,
    });

    // Baseline from the previous inline implementation (page.tsx
    // commit 79fe9b09, lines 345-380). Any structural diff against
    // this object is a refactor regression.
    expect(out).toStrictEqual({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Diwali 2026',
      startDate: '2026-11-08',
      endDate: '2026-11-08',
      image: `${TEST_BASE_URL}/icon-512.png`,
      description: 'Diwali 2026. Puja muhurta: 18:45–20:25. City-wise timings for 6+ cities.',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: 'India',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
        },
      },
      performer: {
        '@type': 'PerformingGroup',
        name: 'Diwali',
      },
      organizer: {
        '@type': 'Organization',
        name: 'Dekho Panchang',
        url: TEST_BASE_URL,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `${TEST_BASE_URL}/en/festivals/diwali/2026`,
        validFrom: '2026-11-08',
      },
    });
  });
});

describe('generateFestivalEventLD — multi-day support (new in PR)', () => {
  it('Navratri 9-day sequence uses the multiDay date range', () => {
    const out = generateFestivalEventLD({
      slug: 'navratri',
      year: 2026,
      locale: 'en',
      festivalNameEn: 'Navratri',
      festivalDate: '2026-10-11',     // first day fallback (ignored when multiDay is set)
      description: '9 days of Devi worship culminating in Vijaya Dashami.',
      multiDay: { startDate: '2026-10-11', endDate: '2026-10-19' },
      baseUrl: TEST_BASE_URL,
    });

    expect(out.startDate).toBe('2026-10-11');
    expect(out.endDate).toBe('2026-10-19');
    expect((out.offers as Record<string, unknown>).validFrom).toBe('2026-10-11');
  });

  it('Pitru Paksha 15-day fortnight uses multiDay properly', () => {
    const out = generateFestivalEventLD({
      slug: 'pitru-paksha',
      year: 2026,
      locale: 'en',
      festivalNameEn: 'Pitru Paksha',
      festivalDate: '2026-09-17',
      description: 'Fifteen days of tarpan and shraddha for ancestors.',
      multiDay: { startDate: '2026-09-17', endDate: '2026-10-01' },
      baseUrl: TEST_BASE_URL,
    });

    expect(out.startDate).toBe('2026-09-17');
    expect(out.endDate).toBe('2026-10-01');
  });

  it('without multiDay, startDate === endDate === festivalDate (single-day)', () => {
    const out = generateFestivalEventLD({
      slug: 'holi',
      year: 2026,
      locale: 'en',
      festivalNameEn: 'Holi',
      festivalDate: '2026-03-04',
      description: 'Festival of colours.',
      baseUrl: TEST_BASE_URL,
    });
    expect(out.startDate).toBe('2026-03-04');
    expect(out.endDate).toBe('2026-03-04');
  });
});

describe('generateFestivalEventLD — schema invariants', () => {
  it('always includes the required schema.org fields', () => {
    const out = generateFestivalEventLD({
      slug: 'diwali',
      year: 2026,
      locale: 'en',
      festivalNameEn: 'Diwali',
      festivalDate: '2026-11-08',
      description: 'test',
      baseUrl: TEST_BASE_URL,
    });
    expect(out['@context']).toBe('https://schema.org');
    expect(out['@type']).toBe('Event');
    expect(out.eventAttendanceMode).toBe('https://schema.org/OfflineEventAttendanceMode');
    expect(out.eventStatus).toBe('https://schema.org/EventScheduled');
  });

  it('offers URL is locale-prefixed with /en/ regardless of caller locale (matches prior inline behavior)', () => {
    // The original inline implementation hardcoded /en/ in the offer URL
    // (even on Hindi pages). Preserving that exactly avoids changing the
    // Google-indexed URL for the offer entity.
    const out = generateFestivalEventLD({
      slug: 'diwali',
      year: 2026,
      locale: 'hi',
      festivalNameEn: 'Diwali',
      festivalDate: '2026-11-08',
      description: 'test',
      baseUrl: TEST_BASE_URL,
    });
    expect((out.offers as Record<string, unknown>).url).toBe(`${TEST_BASE_URL}/en/festivals/diwali/2026`);
  });
});
