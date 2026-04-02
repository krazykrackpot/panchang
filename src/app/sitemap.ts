import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

const locales = ['en', 'hi', 'sa'] as const;

// All routes in the app
const routes = [
  '',
  '/panchang',
  '/kundali',
  '/matching',
  '/about',
  '/pricing',
  // Deep dives
  '/panchang/tithi',
  '/panchang/nakshatra',
  '/panchang/yoga',
  '/panchang/karana',
  '/panchang/muhurta',
  '/panchang/grahan',
  '/panchang/rashi',
  '/panchang/masa',
  '/panchang/samvatsara',
  '/panchang/yearly',
  // Learn
  '/learn',
  '/learn/grahas',
  '/learn/rashis',
  '/learn/nakshatras',
  '/learn/tithis',
  '/learn/yogas',
  '/learn/karanas',
  '/learn/muhurtas',
  '/learn/kundali',
  '/learn/advanced',
  '/learn/ayanamsha',
  '/learn/bhavas',
  '/learn/calculations',
  '/learn/classical-texts',
  '/learn/dashas',
  '/learn/doshas',
  '/learn/gochar',
  '/learn/lagna',
  '/learn/masa',
  '/learn/matching',
  '/learn/vara',
  '/learn/vargas',
  // Calendars
  '/calendar',
  '/transits',
  '/transits/graphic',
  '/retrograde',
  '/eclipses',
  '/muhurat',
  '/regional',
  // Tools
  '/sign-calculator',
  '/sade-sati',
  '/prashna',
  '/prashna-ashtamangala',
  '/baby-names',
  '/shraddha',
  '/vedic-time',
  '/upagraha',
  '/devotional',
  '/varshaphal',
  '/kp-system',
  '/muhurta-ai',
  '/horoscope',
  '/kaal-nirnaya',
  '/nivas-shool',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of locales) {
      const url = `${BASE_URL}/${locale}${route}`;
      const alternates: Record<string, string> = {};
      for (const alt of locales) {
        alternates[alt] = `${BASE_URL}/${alt}${route}`;
      }

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/panchang' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/panchang' ? 0.9 : route === '/kundali' ? 0.8 : 0.6,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return entries;
}
