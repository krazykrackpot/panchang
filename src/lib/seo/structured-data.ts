/**
 * Structured data (JSON-LD) helpers for SEO.
 */

import { locales } from '@/lib/i18n/config';

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
  muhurta: 'Muhurta',
  wedding: 'Wedding Muhurat',
  'griha-pravesh': 'Griha Pravesh Muhurat',
  'vehicle-purchase': 'Vehicle Purchase Muhurat',
  'business-start': 'Business Start Muhurat',
  'naming-ceremony': 'Naming Ceremony Muhurat',
  'property-purchase': 'Property Purchase Muhurat',
  mundan: 'Mundan Muhurat',
  annaprashan: 'Annaprashan Muhurat',
  upanayana: 'Upanayana Muhurat',
  travel: 'Travel Muhurat',
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
  vs: 'Compare',
  'drik-panchang': 'Drik Panchang',
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
  if ((locales as readonly string[]).includes(segments[0])) {
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
    founder: generatePersonLD(),
    foundingDate: '2026',
    sameAs: [
      'https://www.wikidata.org/wiki/Q139054863',
      'https://twitter.com/dekhopanchang',
      // Instagram/Facebook: add back when accounts are created
      // 'https://www.instagram.com/dekhopanchang/',
      'https://www.youtube.com/@DekhoPanchang',
    ].filter(Boolean),
  };
}

/**
 * Generate Person JSON-LD for the site author — E-E-A-T signal for Google.
 * Used on the About page and referenced from Organization schema.
 */
export function generatePersonLD(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Aditya Kumar',
    description:
      'Maithil Brahmin, Indophile, Seeker of Vedic Wisdom, Vedic Astrology and Astronomy Enthusiast',
    url: `${BASE_URL}/about`,
    sameAs: [
      'https://twitter.com/dekhopanchang',
      'https://www.linkedin.com/in/adityajha',
    ].filter(Boolean),
    knowsAbout: [
      'Vedic Astrology',
      'Jyotish',
      'Panchang',
      'Hindu Calendar',
      'Astronomical Calculations',
      'Surya Siddhanta',
      'Brihat Parashara Hora Shastra',
    ],
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

/**
 * Generate HowTo JSON-LD for puja/ritual pages.
 * See https://schema.org/HowTo
 * estimatedCost + totalTime increase rich result eligibility in Google Search.
 */
export function generateHowToLD(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTimeMinutes?: number;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    // All pujas on Dekho Panchang are free guides — no paid service
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
    // ISO 8601 duration: default 45 min if not specified
    totalTime: `PT${opts.totalTimeMinutes ?? 45}M`,
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/**
 * Generate Event JSON-LD for festival/calendar pages.
 * See https://schema.org/Event
 */
export function generateEventLD(opts: {
  name: string;
  startDate: string;
  description: string;
  url?: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: opts.name,
    startDate: opts.startDate,
    description: opts.description,
    image: `${BASE_URL}/icon-512.png`,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    ...(opts.url ? { url: opts.url } : {}),
    location: {
      '@type': 'VirtualLocation',
      url: opts.url || BASE_URL,
    },
    organizer: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: opts.url || BASE_URL,
      validFrom: opts.startDate,
    },
  };
}

/**
 * Generate expertise-focused JSON-LD for dosha, remedies, and health-related pages.
 * Signals E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) to Google.
 *
 * Uses SpecialAnnouncement-like patterns with author credentials and citation references.
 * Applicable to: dosha pages, remedies, medical astrology, health-related learn pages.
 */
export function generateExpertiseArticleLD(opts: {
  title: string;
  description: string;
  url: string;
  locale: string;
  /** Classical source texts referenced (e.g., "Brihat Parashara Hora Shastra Chapter 81") */
  citations?: string[];
  /** Specific area of expertise */
  expertise?: string[];
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    inLanguage: opts.locale,
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      name: 'Aditya Kumar',
      url: `${BASE_URL}/about`,
      knowsAbout: opts.expertise ?? [
        'Vedic Astrology (Jyotish)',
        'Brihat Parashara Hora Shastra',
        'Dosha Analysis',
        'Vedic Remedial Measures',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/apple-touch-icon.png` },
    },
    ...(opts.citations?.length
      ? {
          citation: opts.citations.map((c) => ({
            '@type': 'CreativeWork',
            name: c,
          })),
        }
      : {}),
    about: (opts.expertise ?? ['Vedic Astrology']).map((topic) => ({
      '@type': 'Thing',
      name: topic,
    })),
  };
}

export function generateWebSiteLD(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dekho Panchang',
    alternateName: ['DekhoPanchang', 'dekhopanchang'],
    url: BASE_URL,
    inLanguage: ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn'],
    publisher: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL, logo: `${BASE_URL}/apple-touch-icon.png` },
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
