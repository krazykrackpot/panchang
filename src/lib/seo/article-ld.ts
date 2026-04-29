/**
 * Article JSON-LD generator for learn pages.
 *
 * Generates Article structured data for educational content pages.
 * Used by learn topic layouts to improve rich snippet eligibility.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

// Key learn topics with their publication dates and descriptions
const ARTICLE_META: Record<string, { datePublished: string; dateModified: string }> = {
  '/learn/grahas': { datePublished: '2026-03-01', dateModified: '2026-04-15' },
  '/learn/rashis': { datePublished: '2026-03-01', dateModified: '2026-04-15' },
  '/learn/nakshatras': { datePublished: '2026-03-01', dateModified: '2026-04-15' },
  '/learn/tithis': { datePublished: '2026-03-01', dateModified: '2026-04-15' },
  '/learn/yogas': { datePublished: '2026-03-01', dateModified: '2026-04-15' },
  '/learn/karanas': { datePublished: '2026-03-01', dateModified: '2026-04-15' },
  '/learn/muhurtas': { datePublished: '2026-03-05', dateModified: '2026-04-15' },
  '/learn/kundali': { datePublished: '2026-03-10', dateModified: '2026-04-20' },
  '/learn/dashas': { datePublished: '2026-03-15', dateModified: '2026-04-20' },
  '/learn/doshas': { datePublished: '2026-03-15', dateModified: '2026-04-20' },
  '/learn/aspects': { datePublished: '2026-03-20', dateModified: '2026-04-15' },
  '/learn/bhavas': { datePublished: '2026-03-20', dateModified: '2026-04-15' },
  '/learn/vargas': { datePublished: '2026-03-25', dateModified: '2026-04-20' },
  '/learn/shadbala': { datePublished: '2026-03-25', dateModified: '2026-04-20' },
  '/learn/jaimini': { datePublished: '2026-04-01', dateModified: '2026-04-20' },
  '/learn/transits': { datePublished: '2026-04-01', dateModified: '2026-04-15' },
  '/learn/remedies': { datePublished: '2026-04-05', dateModified: '2026-04-20' },
  '/learn/matching': { datePublished: '2026-04-05', dateModified: '2026-04-15' },
  '/learn/ashtakavarga': { datePublished: '2026-04-05', dateModified: '2026-04-20' },
  '/learn/compatibility': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/vedanga': { datePublished: '2026-03-01', dateModified: '2026-04-15' },
  '/learn/cosmology': { datePublished: '2026-03-01', dateModified: '2026-04-15' },
  '/learn/classical-texts': { datePublished: '2026-03-10', dateModified: '2026-04-15' },
  '/learn/avasthas': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/argala': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/bhavabala': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/sphutas': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/birth-chart': { datePublished: '2026-03-10', dateModified: '2026-04-15' },
  '/learn/lagna': { datePublished: '2026-03-15', dateModified: '2026-04-15' },
  '/learn/gochar': { datePublished: '2026-04-01', dateModified: '2026-04-15' },
  '/learn/hora': { datePublished: '2026-04-05', dateModified: '2026-04-15' },
  '/learn/eclipses': { datePublished: '2026-04-05', dateModified: '2026-04-15' },
  '/learn/health': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/ayurveda-jyotish': { datePublished: '2026-04-22', dateModified: '2026-04-22' },
  '/learn/wealth': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/career': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/marriage': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/children': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/sade-sati': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/combustion': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/planetary-cycles': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/retrograde-effects': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/advanced': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/advanced-houses': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/calculations': { datePublished: '2026-03-20', dateModified: '2026-04-15' },
  '/learn/planet-in-house': { datePublished: '2026-04-10', dateModified: '2026-04-20' },
  '/learn/patrika': { datePublished: '2026-04-15', dateModified: '2026-04-20' },
  '/learn/tippanni': { datePublished: '2026-04-15', dateModified: '2026-04-20' },
  '/learn/transit-guide': { datePublished: '2026-04-15', dateModified: '2026-04-20' },
  '/learn/observatories': { datePublished: '2026-04-05', dateModified: '2026-04-15' },
  '/learn/masa': { datePublished: '2026-04-05', dateModified: '2026-04-15' },
  '/learn/vara': { datePublished: '2026-04-05', dateModified: '2026-04-15' },
  '/learn/ayanamsha': { datePublished: '2026-04-05', dateModified: '2026-04-15' },
  '/learn/festival-rules': { datePublished: '2026-04-15', dateModified: '2026-04-29' },
  '/learn/smarta-vaishnava': { datePublished: '2026-04-15', dateModified: '2026-04-29' },
};

/**
 * Generates Article JSON-LD for a learn page.
 * Returns null if the route doesn't have article metadata.
 */
export function generateArticleLD(
  route: string,
  locale: string,
  title: string,
  description: string,
): Record<string, unknown> | null {
  const meta = ARTICLE_META[route];
  if (!meta) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    inLanguage: locale === 'hi' ? 'hi' : locale === 'ta' ? 'ta' : locale === 'bn' ? 'bn' : 'en',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${locale}${route}`,
    },
    isAccessibleForFree: true,
    educationalLevel: 'Beginner',
  };
}

/**
 * Returns all learn routes that have article metadata.
 */
export function getArticleRoutes(): string[] {
  return Object.keys(ARTICLE_META);
}
