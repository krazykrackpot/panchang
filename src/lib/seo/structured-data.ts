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
  };
}
