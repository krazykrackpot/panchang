/**
 * Single source of truth for the high-traffic / flagship route list that:
 *   - must carry titles + descriptions for every active locale (enforced by
 *     `src/lib/__tests__/seo-metadata.test.ts`)
 *   - is the target of the bilingual-titles + mr-translation sweep
 *     (`scripts/add-mr-to-priority-routes.ts`)
 *
 * Keep this list ordered by traffic / SEO priority — top entries are the
 * first to receive bilingual title refactors when locales are added or
 * the codified bilingual-titles rule is rolled out further.
 */
export const PRIORITY_ROUTES = [
  '/panchang',
  '/kundali',
  '/horoscope',
  '/calendar',
  '/matching',
  '/brihaspati',
  '/sadhaka-path',
  '/muhurta-ai',
  '/choghadiya',
  '/festivals',
  '/devotional',
  '/learn',
  '/tools',
  '/calendars',
  '/calendars/masa',
  '/calendars/tithi',
  '/hora',
  '/rahu-kaal',
  '/sade-sati',
  '/baby-names',
  '/sign-calculator',
  '/charts',
  '/about',
  '/vrat-calendar',
  '/eclipses',
  '/transits',
  '/hindu-calendar/2026',
  '/vivah-muhurat/2026',
  '/dates/ekadashi',
  '/dates/purnima',
] as const;

export type PriorityRoute = (typeof PRIORITY_ROUTES)[number];
