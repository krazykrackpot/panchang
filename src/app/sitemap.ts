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
  // Kundali sub-pages
  '/kundali/compare',
  '/kundali/rectify',
  // Learn modules (structured curriculum)
  '/learn/modules',
  '/learn/modules/0-1', '/learn/modules/0-2', '/learn/modules/0-3',
  '/learn/modules/0-4', '/learn/modules/0-5', '/learn/modules/0-6',
  '/learn/modules/1-1', '/learn/modules/1-2', '/learn/modules/1-3',
  '/learn/modules/2-1', '/learn/modules/2-2', '/learn/modules/2-3', '/learn/modules/2-4',
  '/learn/modules/3-1', '/learn/modules/3-2', '/learn/modules/3-3',
  '/learn/modules/4-1', '/learn/modules/4-2', '/learn/modules/4-3',
  '/learn/modules/5-1', '/learn/modules/5-2', '/learn/modules/5-3',
  '/learn/modules/6-1', '/learn/modules/6-2', '/learn/modules/6-3', '/learn/modules/6-4',
  '/learn/modules/7-1', '/learn/modules/7-2', '/learn/modules/7-3',
  '/learn/modules/8-1',
  '/learn/modules/9-1', '/learn/modules/9-2', '/learn/modules/9-3', '/learn/modules/9-4',
  '/learn/modules/10-1', '/learn/modules/10-2', '/learn/modules/10-3',
  '/learn/modules/11-1', '/learn/modules/11-2', '/learn/modules/11-3',
  '/learn/modules/12-1', '/learn/modules/12-2', '/learn/modules/12-3',
  '/learn/modules/13-1', '/learn/modules/13-2', '/learn/modules/13-3',
  '/learn/modules/14-1', '/learn/modules/14-2', '/learn/modules/14-3',
  '/learn/modules/15-1', '/learn/modules/15-2', '/learn/modules/15-3', '/learn/modules/15-4',
  '/learn/modules/16-1', '/learn/modules/16-2', '/learn/modules/16-3',
  '/learn/modules/17-1', '/learn/modules/17-2', '/learn/modules/17-3', '/learn/modules/17-4',
  '/learn/modules/18-1', '/learn/modules/18-2', '/learn/modules/18-3', '/learn/modules/18-4', '/learn/modules/18-5',
  '/learn/modules/19-1', '/learn/modules/19-2', '/learn/modules/19-3', '/learn/modules/19-4',
  '/learn/modules/20-1', '/learn/modules/20-2', '/learn/modules/20-3', '/learn/modules/20-4',
  '/learn/modules/21-1', '/learn/modules/21-2', '/learn/modules/21-3', '/learn/modules/21-4',
  '/learn/modules/22-1', '/learn/modules/22-2', '/learn/modules/22-3', '/learn/modules/22-4', '/learn/modules/22-5', '/learn/modules/22-6',
  '/learn/modules/23-1', '/learn/modules/23-2', '/learn/modules/23-3', '/learn/modules/23-4', '/learn/modules/23-5',
  // Interactive Labs
  '/learn/labs/panchang',
  '/learn/labs/moon',
  '/learn/labs/dasha',
  '/learn/labs/shadbala',
  '/learn/labs/kp',
  // Puja & Sankalpa
  '/puja',
  '/sankalpa',
  // Dashboard (public pages)
  '/dashboard',
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
