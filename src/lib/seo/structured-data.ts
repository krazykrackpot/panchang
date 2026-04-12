/**
 * Structured data (JSON-LD) helpers for SEO.
 */

const BASE_URL = 'https://dekhopanchang.com';

const DISPLAY_NAMES: Record<string, string> = {
  panchang: 'Panchang',
  kundali: 'Kundali',
  learn: 'Learn',
  matching: 'Matching',
  calendar: 'Calendar',
  'sign-calculator': 'Sign Calculator',
  'baby-names': 'Baby Names',
  'sade-sati': 'Sade Sati',
  prashna: 'Prashna',
  'muhurta-ai': 'Muhurta AI',
  'kp-system': 'KP System',
  varshaphal: 'Varshaphal',
  'prashna-ashtamangala': 'Prashna Ashtamangala',
  puja: 'Puja Vidhi',
  festivals: 'Festivals',
  tools: 'Tools',
  about: 'About',
  pricing: 'Pricing',
  modules: 'Modules',
  regional: 'Regional Calendar',
  transits: 'Transits',
  retrograde: 'Retrograde',
  eclipses: 'Eclipses',
  muhurat: 'Muhurat',
  shraddha: 'Shraddha',
  devotional: 'Devotional',
  upagraha: 'Upagraha',
  'vedic-time': 'Vedic Time',
  horoscope: 'Horoscope',
  compare: 'Compare',
  rectify: 'Rectify',
  'rahu-kaal': 'Rahu Kaal',
  choghadiya: 'Choghadiya',
  compatibility: 'Compatibility',
  dates: 'Dates',
  ekadashi: 'Ekadashi',
  purnima: 'Purnima',
  amavasya: 'Amavasya',
  pradosham: 'Pradosham',
  chaturthi: 'Chaturthi',
};

/**
 * Generate BreadcrumbList JSON-LD from a pathname.
 * The pathname should include the locale prefix (e.g. /en/kundali).
 */
export function generateBreadcrumbLD(pathname: string, locale: string): object {
  const segments = pathname.split('/').filter(Boolean);

  // Remove locale prefix if present
  if (['en', 'hi', 'sa'].includes(segments[0])) {
    segments.shift();
  }

  const items: { name: string; url: string }[] = [
    { name: 'Home', url: `${BASE_URL}/${locale}` },
  ];

  let path = `/${locale}`;
  for (const seg of segments) {
    path += `/${seg}`;
    items.push({
      name:
        DISPLAY_NAMES[seg] ||
        seg
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      url: `${BASE_URL}${path}`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate SoftwareApplication JSON-LD for the site.
 */
export function generateSoftwareApplicationLD(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Dekho Panchang',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    url: BASE_URL,
    description:
      'Free Vedic Astrology — Daily Panchang, Kundali Generator, Muhurta Finder, and Kundali Matching.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: 'Dekho Panchang' },
  };
}

/**
 * Generate Organization JSON-LD — establishes "Dekho Panchang" as a known entity for Google.
 * This is critical for brand recognition and avoiding "Did you mean" suggestions.
 */
export function generateOrganizationLD(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dekho Panchang',
    alternateName: ['DekhoPanchang', 'dekhopanchang', 'Dekho Panchang - Vedic Astrology'],
    url: BASE_URL,
    logo: `${BASE_URL}/apple-touch-icon.png`,
    description:
      'Dekho Panchang is a free Vedic astrology platform offering daily Panchang, Kundali generation, Muhurta finding, and Kundali matching — powered by precise astronomical calculations.',
    foundingDate: '2024',
    sameAs: [
      'https://www.wikidata.org/wiki/Q139054863',
      // Add social profiles as you create them — each one strengthens brand signals
      // 'https://twitter.com/dekhopanchang',
      // 'https://www.youtube.com/@dekhopanchang',
      // 'https://www.instagram.com/dekhopanchang/',
      // 'https://github.com/dekhopanchang',
    ].filter(Boolean),
  };
}

/**
 * Generate WebSite JSON-LD with SearchAction.
 * Enables Google sitelinks search box and reinforces the site as a distinct web property.
 */
/**
 * Generate WebApplication JSON-LD for individual tool pages.
 */
export function generateToolLD(name: string, description: string, url: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
  };
}

export function generateWebSiteLD(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dekho Panchang',
    alternateName: ['DekhoPanchang', 'dekhopanchang'],
    url: BASE_URL,
    inLanguage: ['en', 'hi', 'sa'],
    publisher: { '@type': 'Organization', name: 'Dekho Panchang' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/en?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
