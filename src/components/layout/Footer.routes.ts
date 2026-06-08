/**
 * Footer route → variant classifier (extracted from Footer.tsx for unit
 * testability — the parent component imports next-intl which is a
 * react-client module that doesn't load cleanly in vitest's pure env).
 *
 * Background: Diwali vs Holi page Jaccard was ~55% pre-cut despite their
 * bodies being completely different — page chrome (footer + nav + cross-
 * sells) dominated the literal-text ratio. The original footer rendered
 * all 4 link columns (~60 link labels × locale's label string) on every
 * single page, making the chrome a huge sitewide duplicate-text mass.
 *
 * This classifier picks 2 of the 4 columns per page-type so each page-
 * type shows ~30 labels instead of 60. The dropped links are still
 * reachable site-wide via the column that's surfaced on the topically-
 * relevant pages — the full link graph stays connected, just no longer
 * redundantly broadcast from every URL.
 *
 * 'all' is reserved for high-authority hub pages where the legacy
 * behaviour (all 4 columns) is preserved: home (`/`), /about, the
 * /vs/* competitor pages, and the four canonical hubs that consume the
 * full column list (/panchang, /kundali, /matching, /learn).
 */

export type FooterVariant = 'all' | 'tools-learn' | 'cals-deep' | 'cals-learn' | 'tools-deep' | 'learn-deep';

// Locale codes recognised at the URL prefix. Matches src/lib/i18n/config.ts
// visibleLocales + the retired `sa`. The regex below uses this set
// explicitly — an earlier `/[a-z]{2,4}/` was too permissive and matched
// `/vs/...` or `/puja/...` segments, stripping them to the wrong path.
const LOCALE_PREFIX_RE = /^\/(?:en|hi|mai|mr|ta|te|bn|gu|kn|sa)(?=\/|$)/;

export function classifyPath(pathname: string): FooterVariant {
  // Strip locale prefix (/en/foo → /foo). Constrained to the actual
  // locale code set — anything that isn't a locale is part of the path.
  const path = pathname.replace(LOCALE_PREFIX_RE, '') || '/';
  // Full footer on root, /about, /vs/* and the four canonical hubs.
  if (path === '/' || path === '/about' || path.startsWith('/about/') || path.startsWith('/vs/')) return 'all';
  if (path === '/panchang' || path === '/kundali' || path === '/matching' || path === '/learn') return 'all';
  // Date-keyed surfaces + Calendars → Calendars + Deep Dives.
  if (path.startsWith('/choghadiya') || path.startsWith('/gauri-panchang') || path.startsWith('/panchang/date')
      || path.startsWith('/calendar') || path.startsWith('/calendars') || path.startsWith('/festivals')
      || path.startsWith('/ekadashi') || path.startsWith('/transits') || path.startsWith('/retrograde')
      || path.startsWith('/eclipses') || path.startsWith('/events') || path.startsWith('/dates')
      || path.startsWith('/vrat-katha') || path.startsWith('/vrat-calendar')
      || path.startsWith('/hindu-calendar') || path.startsWith('/vivah-muhurat')
      || path.startsWith('/muhurat') || path.startsWith('/muhurta') || path.startsWith('/rituals')
      || path.startsWith('/puja') || path.startsWith('/regional')) return 'cals-deep';
  // City panchang + horoscope landings — Calendars + Learn.
  if (/^\/panchang\/[a-z]/.test(path) || path.startsWith('/horoscope')) return 'cals-learn';
  // Tools / calculators / advisory — Tools + Learn.
  if (path.startsWith('/kundali/') || path.startsWith('/matching/')
      || path.startsWith('/sign-') || path.startsWith('/sade-sati')
      || path.startsWith('/prashna') || path.startsWith('/baby-names')
      || path.startsWith('/shraddha') || path.startsWith('/vedic-time')
      || path.startsWith('/upagraha') || path.startsWith('/devotional')
      || path.startsWith('/varshaphal') || path.startsWith('/tithi-pravesha')
      || path.startsWith('/annual-forecast') || path.startsWith('/kp-system')
      || path.startsWith('/kp/') || path.startsWith('/caesarean-muhurta')
      || path.startsWith('/career-muhurta') || path.startsWith('/rahu-kaal')
      || path.startsWith('/panchak') || path.startsWith('/holashtak')
      || path.startsWith('/chandra-darshan') || path.startsWith('/hora')
      || path.startsWith('/chandrabalam') || path.startsWith('/tarabalam')
      || path.startsWith('/mangal-dosha') || path.startsWith('/kaal-sarp')
      || path.startsWith('/pitra-dosha') || path.startsWith('/sarvatobhadra')
      || path.startsWith('/cosmic-blueprint') || path.startsWith('/tropical-compare')
      || path.startsWith('/medical-astrology') || path.startsWith('/financial-astrology')
      || path.startsWith('/nadi-jyotish') || path.startsWith('/mundane')
      || path.startsWith('/kaal-nirnaya') || path.startsWith('/nivas-shool')
      || path.startsWith('/rudraksha') || path.startsWith('/brihaspati')
      || path.startsWith('/sadhaka-path') || path.startsWith('/sankalpa')
      || path === '/tools' || path === '/glossary') return 'tools-learn';
  // Learn topic pages + everything else educational/curriculum.
  if (path.startsWith('/learn/')) return 'learn-deep';
  // Default: Tools + Deep Dives — broadest coverage for unclassified
  // pages (legal pages, account pages, etc.).
  return 'tools-deep';
}

export function sectionsForVariant(variant: FooterVariant): number[] {
  // Indices into SECTIONS: 0 Tools, 1 Calendars, 2 Learn, 3 Deep Dives.
  switch (variant) {
    case 'all':          return [0, 1, 2, 3];
    case 'tools-learn':  return [0, 2];
    case 'cals-deep':    return [1, 3];
    case 'cals-learn':   return [1, 2];
    case 'tools-deep':   return [0, 3];
    case 'learn-deep':   return [2, 3];
  }
}
