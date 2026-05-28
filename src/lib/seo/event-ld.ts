/**
 * Festival Event JSON-LD helper.
 *
 * Extracts the inline Event schema previously defined in
 * src/app/[locale]/festivals/[slug]/[year]/page.tsx (~lines 345-380)
 * so it can be reused + audited centrally + extended for multi-day
 * sequences (Navratri 9 days, Pitru Paksha 15 days) per spec §4E.
 *
 * Spec contract: for single-day festivals the output MUST be byte-
 * identical (modulo whitespace) to the previous inline version. The
 * event-ld.test.ts fixture asserts this against a hand-copied baseline
 * from the inline implementation as of 2026-05-28.
 *
 * Schema choice rationale (preserved from the original):
 *   - eventAttendanceMode: OfflineEventAttendanceMode (real-world
 *     cultural observance, not a virtual event — staying defensible
 *     against Google's spammy-event-markup penalties).
 *   - location.@type: Place + PostalAddress with addressCountry: IN
 *     (festival is observed in India and the global diaspora, not at
 *     a specific venue).
 *   - performer + organizer + offers preserved verbatim — the existing
 *     output passes Google's Rich Results test, so the refactor must
 *     not change them.
 */

import { BASE_URL } from '@/lib/seo/base-url';

export interface FestivalEventLDInput {
  /** Festival slug, e.g. 'diwali', 'navratri' */
  slug: string;
  /** Festival year, e.g. 2026 */
  year: number;
  /** English festival name (for schema.org name field — kept English for consistency with the original inline output) */
  festivalNameEn: string;
  /** ISO date string YYYY-MM-DD for single-day festivals */
  festivalDate: string;
  /** Plain-English event description used in the schema's description field */
  description: string;
  /** Optional override for multi-day sequences (Navratri, Pitru Paksha) */
  multiDay?: {
    startDate: string;  // YYYY-MM-DD
    endDate: string;    // YYYY-MM-DD
  };
  /** Optional override for the BASE_URL — defaults to process.env.NEXT_PUBLIC_SITE_URL */
  baseUrl?: string;
}

export function generateFestivalEventLD(input: FestivalEventLDInput): Record<string, unknown> {
  const {
    slug,
    year,
    festivalNameEn,
    festivalDate,
    description,
    multiDay,
    baseUrl = BASE_URL,
  } = input;

  const startDate = multiDay?.startDate ?? festivalDate;
  const endDate   = multiDay?.endDate   ?? festivalDate;

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${festivalNameEn} ${year}`,
    startDate,
    endDate,
    image: `${baseUrl}/icon-512.png`,
    description,
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
      name: festivalNameEn,
    },
    organizer: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: baseUrl,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/en/festivals/${slug}/${year}`,
      validFrom: startDate,
    },
  };
}
