import type { MetadataRoute } from 'next';
import { statSync } from 'node:fs';
import { join } from 'node:path';
// City pages: Tier 1+2 (~250 cities) in sitemap. Tier 3 discovered via internal "nearby cities" links.
import { getCitiesByTier, getTier1And2Cities } from '@/lib/constants/cities-extended';
import { getAllPairSlugs } from '@/lib/constants/rashi-slugs';
import { getMuhurtaTypeSlugs } from '@/lib/constants/muhurta-types';
import { getTransitArticleSlugs } from '@/lib/content/transit-articles';
import { ALL_DEVOTIONAL_ITEMS } from '@/lib/content/devotional-content';
import { YOGA_DETAIL_DATA } from '@/lib/constants/yoga-details';
import { FESTIVAL_VALID_YEARS, TOP_FESTIVAL_SLUGS } from '@/lib/calendar/festival-defs';

// .trim() is critical  –  Vercel env vars can have trailing \n that corrupts sitemap XML
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

// Import from config so new locales are never missed
import { locales, visibleLocales } from '@/lib/i18n/config';

/**
 * Locales submitted to the sitemap for crawl.
 *
 * All 8 visible locales (en/hi/ta/te/bn/gu/kn/mai) get <loc> entries.
 * Previously this was capped at en/hi/mai — but hreflang on every page
 * advertised all 8, which Google couldn't independently verify via the
 * sitemap. That broke the hreflang cluster for ta/te/bn/gu/kn and let
 * CTR decay on those locale pages.
 *
 * sa, mr retired (Apr 2026) — middleware 301-redirects them to /en/.
 */
const sitemapLocales: ReadonlyArray<typeof locales[number]> = visibleLocales;

// All routes in the app
const routes = [
  '',
  '/panchang',
  '/kundali',
  '/matching',
  '/about',
  '/about/methodology',
  // /vs/* competitor pages removed May 2026 per
  // feedback_no_competitor_references.md (no competitor mentions in
  // user-facing content). The pages, sitemap entries, FAQ Q/A pairs,
  // BreadcrumbList labels, and module 27-3 references were all stripped.
  '/festivals',
  '/ekadashi',
  '/pricing',
  '/videos',
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
  '/learn/surya', '/learn/chandra', '/learn/mangal', '/learn/budha',
  '/learn/guru', '/learn/shukra', '/learn/shani', '/learn/rahu', '/learn/ketu',
  '/learn/rashis',
  '/learn/mesha', '/learn/vrishabha', '/learn/mithuna', '/learn/karka',
  '/learn/simha', '/learn/kanya', '/learn/tula', '/learn/vrishchika',
  '/learn/dhanu', '/learn/makara', '/learn/kumbha', '/learn/meena',
  '/learn/nakshatras',
  '/learn/tithis',
  '/learn/yoga',
  '/learn/karanas',
  '/learn/muhurtas',
  '/learn/muhurta-selection',
  '/learn/kundali',
  '/learn/advanced',
  '/learn/ayanamsha',
  '/learn/bhavas',
  '/learn/lordship',
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
  '/learn/caesarean-muhurta',
  '/learn/vivah-muhurta',
  '/learn/prashna',
  '/learn/tithi-pravesha',
  '/learn/kaal-sarp',
  '/learn/tarabalam',
  '/learn/varshaphal',
  '/learn/kp-system',
  '/learn/mangal-dosha',
  '/learn/panchang-guide',
  '/learn/choghadiya',
  '/learn/gauri-panchang',
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
  '/calendars/masa',
  // Eclipses
  '/calendar/eclipses',
  '/eclipses/simulator',
  // Muhurta-AI sub
  '/muhurta-ai/annual',
  // Learn India contributions hub
  '/learn/contributions',
  // Muhurat + Rituals hubs (PAGE_META entries exist; were missing from sitemap)
  '/muhurat',
  '/rituals',
  // Calendars
  '/calendar',
  '/transits',
  '/transits/graphic',
  '/retrograde',
  '/eclipses',
  '/events',
  '/muhurta-ai',
  '/regional',
  '/calendar/regional/tamil',
  '/calendar/regional/bengali',
  '/calendar/regional/mithila',
  '/calendar/regional/telugu',
  '/calendar/regional/malayalam',
  '/calendar/regional/gujarati',
  '/calendar/regional/kannada',
  '/calendar/regional/odia',
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
  '/caesarean-muhurta',
  '/horoscope',
  '/kaal-nirnaya',
  '/nivas-shool',
  '/rahu-kaal',
  '/panchak',
  '/holashtak',
  '/choghadiya',
  '/gauri-panchang',
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
  '/accuracy',
  '/charts',
  '/transit-playground',
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
  // Vivah Muhurat (yearly SEO pages)
  '/vivah-muhurat/2026',
  '/vivah-muhurat/2027',
  // Hindu Calendar (yearly SEO pages)
  '/hindu-calendar/2026',
  '/hindu-calendar/2027',
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
  '/learn/modules/28-1', '/learn/modules/28-2',
  '/learn/modules/29-1', '/learn/modules/29-2',
  '/learn/modules/30-1', '/learn/modules/30-2', '/learn/modules/30-3',
  '/learn/modules/31-1',
  '/learn/modules/32-1',
  '/learn/modules/33-1',
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
  // AI Astrologer + Gamified Learning (public landings — separate from
  // /[locale]/path which is the noindexed personal-progress dashboard)
  '/brihaspati',
  '/sadhaka-path',
  // Legal
  '/privacy',
  '/terms',
  '/refunds',
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

// Festival/Calendar detail slugs (from FESTIVAL_DETAILS  –  includes items without puja vidhi)
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

/**
 * Best-effort lastModified for a route — the mtime of the page or layout
 * file under src/app/[locale]/${route}, falling back to "now" when the
 * file doesn't exist (dynamic routes generated from data sources). Real
 * mtimes give Google a more useful re-crawl signal than `new Date()` on
 * every request.
 */
const BUILD_NOW = new Date();
const mtimeCache = new Map<string, Date>();
function routeLastModified(route: string): Date {
  if (mtimeCache.has(route)) return mtimeCache.get(route)!;
  const dir = `src/app/[locale]${route}`;
  const candidates = [
    join(process.cwd(), dir, 'page.tsx'),
    join(process.cwd(), dir, 'layout.tsx'),
  ];
  for (const file of candidates) {
    try {
      const s = statSync(file);
      mtimeCache.set(route, s.mtime);
      return s.mtime;
    } catch {
      // missing — try next candidate
    }
  }
  mtimeCache.set(route, BUILD_NOW);
  return BUILD_NOW;
}

function addEntries(
  entries: MetadataRoute.Sitemap,
  route: string,
  opts: { changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number },
) {
  // Emit one entry per SITEMAP locale (all 8 visible locales — kept in
  // sync with hreflang so Google can verify every advertised cluster).
  // `alternates.languages` still includes every locale + x-default for
  // proper hreflang grouping.
  const lastMod = routeLastModified(route);
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
      lastModified: lastMod,
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
      priority: route === '' ? 1.0 : route === '/panchang' ? 0.9 : route === '/kundali' ? 0.8 : route === '/caesarean-muhurta' ? 0.7 : 0.6,
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
  // comprised ~43% of the sitemap  –  burning crawl budget on thin templated
  // content. The pages still exist for user navigation, but carry robots:
  // noindex in their metadata so Google doesn't waste budget on them.
  // See `src/app/[locale]/daily/[date]/layout.tsx` for the noindex config.

  // Daily index (hub page remains indexable  –  it's a real landing page)
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

  // Date-based horoscope routes (next 7 days) — captures long-tail queries
  // like "aries horoscope may 8 2026". Trimmed from 30 → 7 days May 2026
  // (Audit §D6) because Google treats daily-churn URLs as ephemeral and
  // wasn't indexing the back-of-window dates. 7 days × 12 rashi × 8 locales
  // = 672 URLs (was 2,880) — same SEO yield, 4× less crawl-budget pressure.
  // The daily cron redeploy keeps the window current.
  const horoscopeDateBase = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(horoscopeDateBase);
    // UTC arithmetic — getDate/setDate would drift on DST transitions
    // (Gemini #181 MED — Lesson L applied to sitemap generation).
    d.setUTCDate(d.getUTCDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    for (const slug of rashiSlugs) {
      addEntries(entries, `/horoscope/${slug}/${dateStr}`, {
        changeFrequency: 'daily',
        priority: 0.7,
      });
    }
  }

  // Choghadiya date pages (next 60 days) — captures "choghadiya tomorrow", "choghadiya [date]"
  // queries. Extended from 30 → 60 days to give Google two indexing-latency windows of headroom:
  // a page published 30 days before its date is comfortably crawled / indexed / cached before the
  // date-specific query spike. May 21 Maithili spike (445 clicks @ 7.2% CTR on
  // /mai/choghadiya/2026-05-21) proved the pattern works — wider forward window captures more.
  const choghadiyaDateBase = new Date();
  for (let i = 0; i <= 60; i++) {
    const d = new Date(choghadiyaDateBase);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    addEntries(entries, `/choghadiya/${dateStr}`, {
      changeFrequency: 'daily',
      priority: 0.6,
    });
  }

  // Gauri Panchang date pages — mirror of the Choghadiya forward window
  // for the South-Indian "gowri panchangam <date>" / "கௌரி பஞ்சாங்கம் <date>"
  // query pattern. Same 60-day forward horizon so crawl/index timing
  // lines up before the date-specific query spike.
  const gauriDateBase = new Date();
  for (let i = 0; i <= 60; i++) {
    const d = new Date(gauriDateBase);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    addEntries(entries, `/gauri-panchang/${dateStr}`, {
      changeFrequency: 'daily',
      priority: 0.6,
    });
  }

  // Nakshatra baby name pages — 27 pages targeting "[nakshatra] baby names" queries
  const babyNameNakshatras = [
    'ashwini', 'bharani', 'krittika', 'rohini', 'mrigashira', 'ardra', 'punarvasu',
    'pushya', 'ashlesha', 'magha', 'purva-phalguni', 'uttara-phalguni', 'hasta',
    'chitra', 'swati', 'vishakha', 'anuradha', 'jyeshtha', 'mula', 'purva-ashadha',
    'uttara-ashadha', 'shravana', 'dhanishta', 'shatabhisha', 'purva-bhadrapada',
    'uttara-bhadrapada', 'revati',
  ];
  for (const nak of babyNameNakshatras) {
    addEntries(entries, `/baby-names/${nak}`, {
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Western-name horoscope aliases (/horoscope/aries etc.) are 301 redirects.
  // Removed from sitemap  –  redirects burn crawl budget without adding indexable content.
  // Google discovers these via internal links and follows the redirect chain naturally.

  // City panchang pages — Tier 1 (priority 0.8, daily), Tier 2 (priority 0.5, weekly),
  // Tier 3 (priority 0.4, monthly). Tier 3 was previously discovered only via "nearby
  // cities" internal links and noindexed via the route, but every city is a legitimate
  // SEO surface (regional "panchang in <city>" queries). Adding 148 × 8 = 1,184 URLs
  // to the sitemap moves Tier 3 from internal-link-only discovery to explicit Google
  // notification — still under the 40K / 45 MB sitemap-budget gates.
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
  for (const city of getCitiesByTier(3)) {
    addEntries(entries, `/panchang/${city.slug}`, {
      changeFrequency: 'monthly',
      priority: 0.4,
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
  // Removed from sitemap  –  redirects burn crawl budget. Google follows them via internal links.

  // Muhurta type landing pages (/muhurta/{type})
  for (const slug of getMuhurtaTypeSlugs()) {
    addEntries(entries, `/muhurta/${slug}`, {
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Festival × Year canonical pages (/festivals/[slug]/[year])
  // City-variant pages deliberately excluded from sitemap — canonical consolidation.
  // City variants are noindexed (robots: noindex) and point canonical to no-city URLs.
  const festivalSeoSlugs = TOP_FESTIVAL_SLUGS;
  // All festivals × all years in FESTIVAL_VALID_YEARS (2025–2029). Previous code only
  // gave top-9 festivals the extended 2028/2029 years on the theory that the rest had
  // no GSC demand — but the long-tail queries ("hartalika teej 2028 date" etc.) still
  // exist, and Google can crawl-and-decide; we shouldn't pre-filter. All 20 festivals
  // now get all 5 years. Adds ~336 URLs total (20 × 5 × 8 = 800 advertised; 320 + 144
  // were already in the sitemap → net +336). Within the 40K / 45MB gate.
  //
  // City variants stay out of the sitemap — they remain noindexed with canonical
  // pointing at the no-city URL (see /[year]/[city]/layout.tsx).
  // Higher-demand festivals get higher priority within the same year set.
  const highDemandFestivals = new Set([
    'diwali', 'ganesh-chaturthi', 'holi', 'dussehra', 'akshaya-tritiya',
    'raksha-bandhan', 'hanuman-jayanti', 'janmashtami', 'chhath-puja',
  ]);
  // FESTIVAL_VALID_YEARS is the canonical year list (also consumed by the
  // /[slug]/[year] route's validation and the /[slug] bare-slug redirect).
  // Bumping the range in festival-defs.ts auto-grows the sitemap.
  for (const fSlug of festivalSeoSlugs) {
    for (const fYear of FESTIVAL_VALID_YEARS) {
      addEntries(entries, `/festivals/${fSlug}/${fYear}`, {
        changeFrequency: 'monthly',
        priority: highDemandFestivals.has(fSlug) ? 0.8 : 0.6,
      });
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

  // Muhurta × Activity × Month × Year × City combos are NOT in the
  // sitemap. The previous 10 × 12 × 2 × 20 = 4,800 entries (× 3 sitemap
  // locales = 14,400 URLs) were thin templated SEO pages that splattered
  // Google's crawl budget away from the high-value panchang / kundali /
  // festival surface. The /muhurta/[type] landings (see line 563 above)
  // remain — those are the canonical hub pages. Every combo still
  // renders on demand via ISR; Google discovers them through internal
  // "nearby cities" / "other activities" links on those hub pages.

  // Yoga index page (/learn/yoga)
  addEntries(entries, '/learn/yoga', {
    changeFrequency: 'monthly',
    priority: 0.7,
  });

  // Yoga detail pages (/learn/yoga/{slug})
  for (const slug of Object.keys(YOGA_DETAIL_DATA)) {
    addEntries(entries, `/learn/yoga/${slug}`, {
      changeFrequency: 'monthly',
      priority: 0.6,
    });
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
