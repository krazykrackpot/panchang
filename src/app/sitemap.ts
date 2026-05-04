import type { MetadataRoute } from 'next';
// City pages: Tier 1+2 (~250 cities) in sitemap. Tier 3 discovered via internal "nearby cities" links.
import { getCitiesByTier, getTier1And2Cities } from '@/lib/constants/cities-extended';
import { getAllPairSlugs } from '@/lib/constants/rashi-slugs';
import { getMuhurtaTypeSlugs } from '@/lib/constants/muhurta-types';
import { getTransitArticleSlugs } from '@/lib/content/transit-articles';
import { ALL_DEVOTIONAL_ITEMS } from '@/lib/content/devotional-content';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

// Import from config so new locales are never missed
import { locales } from '@/lib/i18n/config';

/**
 * Locales submitted to the sitemap for crawl.
 *
 * en + hi + mai are submitted as sitemap entries. mai (Maithili) added back
 * after GSC data showed strong organic traffic from Maithili daily pages.
 * Other active locales (ta, te, bn, gu, kn) appear in hreflang alternates.
 *
 * sa, mr retired (Apr 2026) — middleware 301-redirects them to /en/.
 */
const sitemapLocales: ReadonlyArray<typeof locales[number]> = ['en', 'hi', 'mai'];

// All routes in the app
const routes = [
  '',
  '/panchang',
  '/kundali',
  '/matching',
  '/about',
  '/about/methodology',
  '/vs/drik-panchang',
  '/festivals',
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
  '/panchang/auspicious',
  '/panchang/inauspicious',
  '/panchang/nivas',
  '/panchang/planets',
  '/panchang/remedies',
  '/panchang/activity-guide',
  '/panchang/locations',
  // Learn
  '/learn',
  '/learn/grahas',
  '/learn/rashis',
  '/learn/nakshatras',
  '/learn/tithis',
  '/learn/yogas',
  '/learn/karanas',
  '/learn/muhurtas',
  '/learn/muhurta-selection',
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
  '/learn/adhika-masa',
  '/learn/festival-rules',
  '/learn/smarta-vaishnava',
  '/learn/matching',
  '/learn/vara',
  '/learn/vargas',
  '/learn/planets',
  '/learn/ashtakavarga',
  '/learn/ashtakavarga-dasha',
  '/learn/shadbala',
  '/learn/bhavabala',
  '/learn/avasthas',
  '/learn/sphutas',
  '/learn/argala',
  '/learn/jaimini',
  '/learn/sade-sati',
  '/learn/grahan-yoga',
  '/learn/planet-in-house',
  '/learn/nakshatra-pada',
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
  '/learn/ayurveda-jyotish',
  '/learn/children',
  '/learn/retrograde-effects',
  '/learn/retrograde-visualizer',
  '/learn/yoga-animator',
  '/learn/combustion',
  '/learn/transit-guide',
  '/learn/hora',
  '/learn/advanced-houses',
  '/learn/bhava-chalit',
  '/learn/compatibility',
  '/learn/compatibility-advanced',
  '/learn/birth-chart',
  '/learn/tippanni',
  '/learn/transits',
  '/learn/patrika',
  '/learn/library',
  '/learn/eclipses',
  '/learn/dasha-sandhi',
  '/learn/nadi-amsha',
  '/learn/pancha-pakshi',
  '/learn/chandra-darshan',
  '/learn/panchak',
  '/learn/holashtak',
  '/learn/doshas-detailed',
  '/learn/sarvartha-siddhi-yoga',
  '/learn/amrit-siddhi-yoga',
  '/learn/ravi-pushya-yoga',
  '/learn/guru-pushya-yoga',
  '/learn/dwipushkar-yoga',
  '/learn/tripushkar-yoga',
  '/learn/siddha-yoga',
  '/learn/rahu-kaal',
  '/learn/prashna',
  '/learn/tithi-pravesha',
  '/learn/kaal-sarp',
  '/learn/tarabalam',
  '/learn/varshaphal',
  '/learn/kp-system',
  '/learn/mangal-dosha',
  '/learn/panchang-guide',
  '/learn/choghadiya',
  '/learn/gun-milan',
  '/learn/hindu-calendar',
  '/learn/nakshatra-baby-names',
  // Learn Contributions (India's mathematical & astronomical heritage)
  '/learn/contributions/zero',
  '/learn/contributions/pi',
  '/learn/contributions/sine',
  '/learn/contributions/pythagoras',
  '/learn/contributions/fibonacci',
  '/learn/contributions/binary',
  '/learn/contributions/calculus',
  '/learn/contributions/negative-numbers',
  '/learn/contributions/kerala-school',
  '/learn/contributions/speed-of-light',
  '/learn/contributions/earth-rotation',
  '/learn/contributions/gravity',
  '/learn/contributions/cosmic-time',
  '/learn/contributions/timeline',
  '/learn/contributions/al-khwarizmi',
  // Calendars hub
  '/calendars',
  '/calendars/tithi',
  // Calendars
  '/calendar',
  '/transits',
  '/transits/graphic',
  '/retrograde',
  '/eclipses',
  '/events',
  '/muhurat',
  '/regional',
  '/calendar/regional/tamil',
  '/calendar/regional/bengali',
  '/calendar/regional/mithila',
  // Tools
  '/tools',
  '/medical-astrology',
  '/financial-astrology',
  '/nadi-jyotish',
  '/mundane',
  '/glossary',
  '/tropical-compare',
  '/sign-shift',
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
  '/tithi-pravesha',
  '/annual-forecast',
  '/kundali/compare',
  '/kundali/rectify',
  '/kp-system',
  '/muhurta-ai',
  '/horoscope',
  '/kaal-nirnaya',
  '/nivas-shool',
  '/rahu-kaal',
  '/panchak',
  '/holashtak',
  '/choghadiya',
  '/chandra-darshan',
  '/hora',
  '/chandrabalam',
  '/tarabalam',
  '/mangal-dosha',
  '/kaal-sarp',
  '/pitra-dosha',
  '/sarvatobhadra',
  '/dinacharya',
  '/cosmic-blueprint',
  '/lunar-calendar',
  '/sky',
  '/sky-map',
  '/matching/report',
  '/dashboard/family',
  '/vrat-calendar',
  // Date listing pages
  '/dates/ekadashi',
  '/dates/purnima',
  '/dates/amavasya',
  '/dates/pradosham',
  '/dates/chaturthi',
  '/dates/ganda-mool',
  // Vrat Kathas
  '/vrat-katha',
  '/vrat-katha/ekadashi',
  '/vrat-katha/satyanarayan',
  '/vrat-katha/karva-chauth',
  '/vrat-katha/somvar-vrat',
  '/vrat-katha/mangalvar-vrat',
  '/vrat-katha/pradosh-vrat',
  '/vrat-katha/shivratri',
  '/vrat-katha/santoshi-maa',
  '/vrat-katha/ganesh-chaturthi',
  '/vrat-katha/ahoi-ashtami',
  // Regional calendars (additions)
  '/calendar/regional/iskcon',
  // Tools (additions)
  '/rudraksha',
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
  '/learn/modules/7-1', '/learn/modules/7-2', '/learn/modules/7-3', '/learn/modules/7-4',
  '/learn/modules/8-1',
  '/learn/modules/9-1', '/learn/modules/9-2', '/learn/modules/9-3', '/learn/modules/9-4',
  '/learn/modules/10-1', '/learn/modules/10-2', '/learn/modules/10-3',
  '/learn/modules/11-1', '/learn/modules/11-2', '/learn/modules/11-3',
  '/learn/modules/12-1', '/learn/modules/12-2', '/learn/modules/12-3',
  '/learn/modules/13-1', '/learn/modules/13-2', '/learn/modules/13-3', '/learn/modules/13-4',
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
  '/learn/modules/24-1',
  '/learn/modules/25-1', '/learn/modules/25-2', '/learn/modules/25-3', '/learn/modules/25-4', '/learn/modules/25-5',
  '/learn/modules/25-6', '/learn/modules/25-7', '/learn/modules/25-8', '/learn/modules/25-9',
  '/learn/modules/26-1', '/learn/modules/26-2', '/learn/modules/26-3', '/learn/modules/26-4',
  '/learn/modules/27-1', '/learn/modules/27-2', '/learn/modules/27-3',
  // Interactive Labs
  '/learn/labs/panchang',
  '/learn/labs/moon',
  '/learn/labs/dasha',
  '/learn/labs/shadbala',
  '/learn/labs/kp',
  // Puja & Sankalpa
  '/puja',
  '/sankalpa',
  // Stories
  '/stories',
  // Legal
  '/privacy',
  '/terms',
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
  // Emit one entry per SITEMAP locale (currently en + hi only).
  // `alternates.languages` still includes ALL 10 locales so Google knows the
  // full set of language versions for proper hreflang grouping.
  for (const locale of sitemapLocales) {
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

  // NOTE: /daily/[date] and /daily/[date]/[city] are intentionally EXCLUDED from
  // the sitemap. They are ephemeral, algorithmically generated, and previously
  // comprised ~43% of the sitemap — burning crawl budget on thin templated
  // content. The pages still exist for user navigation, but carry robots:
  // noindex in their metadata so Google doesn't waste budget on them.
  // See `src/app/[locale]/daily/[date]/layout.tsx` for the noindex config.

  // Daily index (hub page remains indexable — it's a real landing page)
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

  // Horoscope weekly per-rashi pages (/horoscope/{rashi}/weekly)
  for (const slug of rashiSlugs) {
    addEntries(entries, `/horoscope/${slug}/weekly`, {
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // Horoscope monthly per-rashi pages (/horoscope/{rashi}/monthly)
  for (const slug of rashiSlugs) {
    addEntries(entries, `/horoscope/${slug}/monthly`, {
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Western-name horoscope aliases (/horoscope/aries etc.) are 301 redirects.
  // Removed from sitemap — redirects burn crawl budget without adding indexable content.
  // Google discovers these via internal links and follows the redirect chain naturally.

  // City panchang pages — Tier 1 (priority 0.8, daily) + Tier 2 (priority 0.5, weekly).
  // Tier 3 cities are NOT in sitemap — discovered via "nearby cities" internal links.
  for (const city of getCitiesByTier(1)) {
    addEntries(entries, `/panchang/${city.slug}`, {
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }
  for (const city of getCitiesByTier(2)) {
    addEntries(entries, `/panchang/${city.slug}`, {
      changeFrequency: 'weekly',
      priority: 0.5,
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

  // Western-name matching pair aliases (/matching/aries-and-leo etc.) are 301 redirects.
  // Removed from sitemap — redirects burn crawl budget. Google follows them via internal links.

  // Muhurta type landing pages (/muhurta/{type})
  for (const slug of getMuhurtaTypeSlugs()) {
    addEntries(entries, `/muhurta/${slug}`, {
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Festival × City × Year programmatic SEO pages (/festivals/[slug]/[year]/[city])
  const festivalSeoSlugs = [
    'diwali', 'janmashtami', 'maha-shivaratri', 'ram-navami', 'ganesh-chaturthi',
    'dussehra', 'holi', 'raksha-bandhan', 'dhanteras', 'narak-chaturdashi',
    'govardhan-puja', 'bhai-dooj', 'hanuman-jayanti', 'akshaya-tritiya',
    'guru-purnima', 'vasant-panchami', 'holika-dahan', 'hartalika-teej',
    'chhath-puja', 'makar-sankranti',
  ];
  // Top 50 cities by population (Tier 1) for festival × city SEO
  const festivalSeoCities = getCitiesByTier(1).slice(0, 50).map(c => c.slug);
  // Only current + next year — 2025 is past, 2028/2029 are too far out.
  // Expand yearly as time passes.
  const festivalSeoYears = [2026, 2027];
  for (const fSlug of festivalSeoSlugs) {
    for (const fYear of festivalSeoYears) {
      for (const fCity of festivalSeoCities) {
        addEntries(entries, `/festivals/${fSlug}/${fYear}/${fCity}`, {
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }
  }

  // Planet-in-House programmatic SEO pages (7 planets x 12 houses = 84 entries)
  const planetSlugs = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const houseSuffixes = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  for (const pSlug of planetSlugs) {
    for (const hSuffix of houseSuffixes) {
      addEntries(entries, `/learn/planet-in-house/${pSlug}-in-${hSuffix}-house`, {
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  // Nakshatra Pada pages (27 nakshatras × 4 padas = 108 pages)
  const nakSlugs = ['ashwini','bharani','krittika','rohini','mrigashira','ardra','punarvasu','pushya','ashlesha','magha','purva-phalguni','uttara-phalguni','hasta','chitra','swati','vishakha','anuradha','jyeshtha','mula','purva-ashadha','uttara-ashadha','shravana','dhanishta','shatabhisha','purva-bhadrapada','uttara-bhadrapada','revati'];
  for (const nak of nakSlugs) {
    for (let pada = 1; pada <= 4; pada++) {
      addEntries(entries, `/learn/nakshatra-pada/${nak}-pada-${pada}`, {
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  // Transit article pages (/learn/transits/[slug])
  for (const slug of getTransitArticleSlugs()) {
    addEntries(entries, `/learn/transits/${slug}`, {
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Muhurta × Activity × Month × Year × City programmatic SEO pages
  // 10 activities × 12 months × 2 years × 10 cities = 2,400 URLs
  const muhurtaActivitySlugs = [
    'marriage', 'griha-pravesh', 'mundan', 'property', 'business',
    'vehicle', 'travel', 'education', 'gold-purchase', 'spiritual',
  ];
  const muhurtaMonths = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
  ];
  const muhurtaYears = [2026, 2027];
  // Top 20 cities for muhurta SEO (keeping it smaller than festival to manage URL count)
  const muhurtaCities = getCitiesByTier(1).slice(0, 20).map(c => c.slug);
  for (const mActivity of muhurtaActivitySlugs) {
    for (const mYear of muhurtaYears) {
      for (const mMonth of muhurtaMonths) {
        for (const mCity of muhurtaCities) {
          addEntries(entries, `/muhurta/${mActivity}/${mYear}/${mMonth}/${mCity}`, {
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      }
    }
  }

  // Devotional content pages (/devotional/{type}/{slug})
  for (const item of ALL_DEVOTIONAL_ITEMS) {
    addEntries(entries, `/devotional/${item.type}/${item.slug}`, {
      changeFrequency: 'monthly',
      priority: item.slug === 'hanuman-chalisa' ? 0.9 : 0.7,
    });
  }

  return entries;
}
