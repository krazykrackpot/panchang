import type { MetadataRoute } from 'next';
import { getAllCitySlugs } from '@/lib/constants/cities';
import { getAllPairSlugs } from '@/lib/constants/rashi-slugs';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

// Import from config so new locales are never missed
import { locales } from '@/lib/i18n/config';

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
  '/learn/planets',
  '/learn/ashtakavarga',
  '/learn/shadbala',
  '/learn/bhavabala',
  '/learn/avasthas',
  '/learn/sphutas',
  '/learn/argala',
  '/learn/jaimini',
  '/learn/sade-sati',
  '/learn/planet-in-house',
  '/learn/aspects',
  '/learn/remedies',
  '/learn/cosmology',
  '/learn/vedanga',
  '/learn/observatories',
  '/learn/planetary-cycles',
  '/learn/career',
  '/learn/marriage',
  '/learn/wealth',
  '/learn/health',
  '/learn/children',
  '/learn/retrograde-effects',
  '/learn/combustion',
  '/learn/transit-guide',
  '/learn/hora',
  '/learn/advanced-houses',
  '/learn/compatibility',
  '/learn/birth-chart',
  '/learn/tippanni',
  '/learn/transits',
  '/learn/patrika',
  // Calendars
  '/calendar',
  '/transits',
  '/transits/graphic',
  '/retrograde',
  '/eclipses',
  '/muhurat',
  '/regional',
  '/calendar/regional/tamil',
  '/calendar/regional/bengali',
  '/calendar/regional/mithila',
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
  '/annual-forecast',
  '/kundali/compare',
  '/kp-system',
  '/muhurta-ai',
  '/horoscope',
  '/kaal-nirnaya',
  '/nivas-shool',
  '/rahu-kaal',
  '/choghadiya',
  // Date listing pages
  '/dates/ekadashi',
  '/dates/purnima',
  '/dates/amavasya',
  '/dates/pradosham',
  '/dates/chaturthi',
  // Learn modules (structured curriculum)
  '/learn/track/cosmology',
  '/learn/track/panchang',
  '/learn/track/kundali',
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
  // Legal
  '/privacy',
  '/terms',
  // Dashboard (public pages)
  '/dashboard',
];

// Puja Vidhi slugs (from PUJA_VIDHIS)
const pujaVidhiSlugs = [
  'ganesh-chaturthi', 'diwali', 'maha-shivaratri', 'holi', 'ram-navami',
  'janmashtami', 'navaratri', 'makar-sankranti', 'vasant-panchami',
  'hanuman-jayanti', 'raksha-bandhan', 'chhath-puja', 'dhanteras',
  'dussehra', 'guru-purnima', 'ekadashi', 'pradosham', 'satyanarayan',
  'karva-chauth', 'nag-panchami', 'amavasya-tarpan', 'masik-shivaratri',
  'somvar-vrat', 'mangalvar-vrat', 'sankashti-chaturthi', 'hartalika-teej',
  'vat-savitri', 'akshaya-tritiya', 'tulsi-vivah', 'ahoi-ashtami',
  'govardhan-puja', 'bhai-dooj', 'buddha-purnima', 'chaitra-navratri',
  'durga-ashtami', 'holika-dahan', 'anant-chaturdashi', 'guru-nanak-jayanti',
  'maha-navami', 'purnima-vrat',
  'pongal', 'baisakhi', 'ugadi', 'bihu',
  // Graha Shanti
  'graha-shanti-surya', 'graha-shanti-chandra', 'graha-shanti-mangal',
  'graha-shanti-budha', 'graha-shanti-guru', 'graha-shanti-shukra',
  'graha-shanti-shani', 'graha-shanti-rahu', 'graha-shanti-ketu',
];

// Festival/Calendar detail slugs (from FESTIVAL_DETAILS — includes items without puja vidhi)
const festivalDetailSlugs = [
  'makar-sankranti', 'vasant-panchami', 'maha-shivaratri', 'holi',
  'ram-navami', 'hanuman-jayanti', 'guru-purnima', 'raksha-bandhan',
  'janmashtami', 'ganesh-chaturthi', 'navaratri', 'dussehra', 'diwali',
  'ratha-saptami', 'bhishma-ashtami', 'chaitra-navratri', 'akshaya-tritiya',
  'buddha-purnima', 'ganga-dussehra', 'nag-panchami', 'hariyali-teej',
  'anant-chaturdashi', 'dhanteras', 'narak-chaturdashi', 'govardhan-puja',
  'bhai-dooj', 'kartik-purnima',
];

// Deduplicated calendar slugs (union of puja + festival slugs)
const calendarSlugs = Array.from(new Set([...festivalDetailSlugs, ...pujaVidhiSlugs]));

function addEntries(
  entries: MetadataRoute.Sitemap,
  route: string,
  opts: { changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number },
) {
  for (const locale of locales) {
    const url = `${BASE_URL}/${locale}${route}`;
    const alternates: Record<string, string> = {};
    for (const alt of locales) {
      alternates[alt] = `${BASE_URL}/${alt}${route}`;
    }
    // x-default points to EN version (recommended by Google for multilingual sites)
    alternates['x-default'] = `${BASE_URL}/en${route}`;
    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: opts.changeFrequency,
      priority: opts.priority,
      alternates: { languages: alternates },
    });
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static routes
  for (const route of routes) {
    addEntries(entries, route, {
      changeFrequency: route === '' || route === '/panchang' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : route === '/panchang' ? 0.9 : route === '/kundali' ? 0.8 : 0.6,
    });
  }

  // Puja detail routes (/puja/[slug])
  for (const slug of pujaVidhiSlugs) {
    addEntries(entries, `/puja/${slug}`, {
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Calendar/festival detail routes (/calendar/[slug])
  for (const slug of calendarSlugs) {
    addEntries(entries, `/calendar/${slug}`, {
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Daily panchang articles (last 30 days + next 7 for Discover)
  const today = new Date();
  const dailyCitySlugs = ['mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'varanasi'];
  for (let i = -7; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    addEntries(entries, `/daily/${dateStr}`, {
      changeFrequency: 'daily',
      priority: i === 0 ? 0.9 : 0.6,
    });
    // City-specific daily articles
    for (const citySlug of dailyCitySlugs) {
      addEntries(entries, `/daily/${dateStr}/${citySlug}`, {
        changeFrequency: 'daily',
        priority: i === 0 ? 0.7 : 0.5,
      });
    }
  }

  // Daily index
  addEntries(entries, '/daily', {
    changeFrequency: 'daily',
    priority: 0.8,
  });

  // Rashi detail pages (/panchang/rashi/{slug})
  const rashiSlugs = ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya', 'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen'];
  for (const slug of rashiSlugs) {
    addEntries(entries, `/panchang/rashi/${slug}`, {
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // Nakshatra detail pages (/panchang/nakshatra/{id})
  for (let id = 1; id <= 27; id++) {
    addEntries(entries, `/panchang/nakshatra/${id}`, {
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Horoscope per-rashi pages (/horoscope/{rashi})
  for (const slug of rashiSlugs) {
    addEntries(entries, `/horoscope/${slug}`, {
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  // City panchang pages (/panchang/{city-slug})
  for (const slug of getAllCitySlugs()) {
    addEntries(entries, `/panchang/${slug}`, {
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  // Matching compatibility heatmap
  addEntries(entries, '/matching/compatibility', {
    changeFrequency: 'monthly',
    priority: 0.6,
  });

  // Rashi pair compatibility detail pages (/matching/{pair})
  for (const pairSlug of getAllPairSlugs()) {
    addEntries(entries, `/matching/${pairSlug}`, {
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  return entries;
}
