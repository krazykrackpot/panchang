import type { MetadataRoute } from 'next';
// City pages: SEO_INDEXABLE_CITY_SLUGS only — cut from Tier 1+2 (177 cities)
// to a 44-city keep-list on 2026-06-07. Tier 3 was already dropped from the
// sitemap 2026-06-03 in the first response to the May 31 demotion; this
// follow-up cuts the long tail of Tier 1/2 cities whose pages were thin
// duplicates of higher-traffic peers (within-locale Jaccard 79-85%).
//
// Dropped slugs are also `noindex`ed at the page level — see
// src/app/[locale]/panchang/[city]/page.tsx generateMetadata. Sitemap
// removal alone wouldn't drop already-indexed thin pages.
import { getSeoIndexableCities } from '@/lib/constants/cities-extended';
import { getAllPairSlugs } from '@/lib/constants/rashi-slugs';
import { getMuhurtaTypeSlugs } from '@/lib/constants/muhurta-types-with-overlay';
import { getTransitArticleSlugs } from '@/lib/content/transit-articles';
import { ALL_DEVOTIONAL_ITEMS } from '@/lib/content/devotional-content';
import { YOGA_DETAIL_DATA } from '@/lib/constants/yoga-details';
import { FESTIVAL_VALID_YEARS, TOP_FESTIVAL_SLUGS } from '@/lib/calendar/festival-defs';
import { buildHreflangMap } from '@/lib/seo/hreflang';
import { INDEXABLE_LAGNA_LOCALES } from '@/lib/seo/lagna-seo';
import { getIndexableLocales } from '@/lib/seo/indexable-locales';

// .trim() is critical  –  Vercel env vars can have trailing \n that corrupts sitemap XML
import { BASE_URL } from '@/lib/seo/base-url';

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
  // /features — capability catalog. Added 2026-06-02 as the LLM-grounding
  // canonical URL (referenced from /llms.txt). Emits SoftwareApplication
  // + ItemList JSON-LD so Gemini/Perplexity/SGE retrieval grounds on
  // structured data, not on guesswork from the SERP fragment.
  '/features',
  // /vs/* competitor-comparison landing pages — restored 2026-06-01
  // (intentional competitive positioning, distinct from the editorial
  // no-competitor-references rule).
  '/vs/drik-panchang',
  '/vs/prokerala',
  '/vs/astrosage',
  '/vs/mpanchang',
  '/vs/ganeshaspeaks',
  '/festivals',
  '/ekadashi',
  '/pricing',
  // Pandit CRM marketing landing — public B2B surface for jyotishis.
  // Added 2026-06-04 with the Pandit CRM ship.
  '/for-pandits',
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
  '/learn/ayanamsha-comparison',
  '/learn/sunrise-and-tithi',
  '/learn/sidereal-vs-tropical',
  '/learn/dasha-year-length',
  '/learn/navamsa-boundaries',
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
  '/learn/health-diagnosis',
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
  '/learn/career-muhurta',
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
  // Muhurta hub — added 2026-06-01 §2.2 internal-linking pass. Parent
  // page for the 12 /muhurta/[type] landings, previously orphaned.
  '/muhurta',
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
  // Bangla calendar yearly variants — keep in sync with the
  // generateStaticParams allowlist in
  // src/app/[locale]/calendar/regional/bengali/[year]/layout.tsx.
  '/calendar/regional/bengali/2025',
  '/calendar/regional/bengali/2026',
  '/calendar/regional/bengali/2027',
  '/calendar/regional/bengali/2028',
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
  '/kp/prashna',
  '/kp/transits',
  '/caesarean-muhurta',
  '/horoscope',
  '/kaal-nirnaya',
  '/nivas-shool',
  '/rahu-kaal',
  '/panchak',
  '/holashtak',
  '/choghadiya',
  '/gauri-panchang',
  '/career-muhurta',
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
  // Date listing pages — /dates hub (added 2026-06-02) is the parent
  // for the 6 category landings below; before the hub these were
  // structurally orphaned (linking-topology spec §2.2 follow-up).
  '/dates',
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
  // Learn tracks (top-level curriculum hubs — these ARE indexable)
  '/learn/track/cosmology',
  '/learn/track/panchang',
  '/learn/track/kundali',
  // NOTE: /learn/modules/* was removed from the sitemap on 2026-06-07.
  // Each module page emits `<meta name="robots" content="noindex, follow">`
  // (verified by curl on /mai/learn/modules/17-4), so shipping the URLs
  // in the sitemap was a mixed signal — sitemap says "please index,"
  // page says "don't index." GSC export 2026-06-07 confirmed 32 of the
  // 936 module URLs sitting in "Crawled, currently not indexed."
  //
  // The bare /learn/modules index page is still indexable (curriculum
  // landing); only the per-module pages are noindexed and now also
  // excluded from the sitemap. Re-include only if the modules become
  // indexable surfaces with substantial standalone content.
  '/learn/modules',
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
/**
 * ISR-revalidate the sitemap every 24h so each regen captures today's
 * date-rolling window without depending on a redeploy. The 2026-06-01
 * recovery cut the choghadiya / panchang/date / gauri-panchang windows
 * from 60 → 7 days as part of the response to Google's May 2026 Core
 * Update demotion. Without ISR, a 7-day window means a single missed
 * deploy puts the entire sitemap into the past.
 */
export const revalidate = 86400;

// Per-invocation reference dates, refreshed at the start of every
// `sitemap()` call. Stored at module scope so the existing addEntries /
// routeLastModified call sites don't need to thread a context arg.
//
// Safe at module scope because: Next.js invokes `sitemap()` serially
// for a given regeneration (not concurrent within one process tick),
// and the entire generation runs to completion before the next regen
// fires. Each ISR regen calls `refreshReferences()` first; addEntries
// only reads from `_nowRef` inside that synchronous window.
//
// The previous module-level `BUILD_NOW` / `BUILD_UTC_MIDNIGHT` constants
// were captured at first import and would freeze in a long-lived ISR
// server — wrong scope for a daily regen. (Lesson L applied to sitemap
// generation.)
let _nowRef: Date = new Date();
let _utcMidnight: Date = utcMidnightOf(_nowRef);

function utcMidnightOf(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function refreshReferences(): void {
  _nowRef = new Date();
  _utcMidnight = utcMidnightOf(_nowRef);
}

// Sitemap lastModified = build/refresh time, NOT per-page file mtime.
//
// Previously this statSync'd src/app/[locale]<route>/page.tsx at runtime via
// `join(process.cwd(), dir, ...)`. The dynamic process.cwd()-joined path
// told Turbopack's NFT tracer it might read anything under cwd, so the
// tracer pulled the entire project into the serverless function bundle —
// 342MB, blowing Vercel's 250MB per-function ceiling.
// `/* turbopackIgnore: true */` comments did not suppress this (the hint
// applies to dynamic require/import, not path.join). Removing the read is
// the correct fix: bundling pages into one Next.js build means their
// effective freshness IS the build time. Per-file mtimes added no SEO
// signal that crawlers would distinguish.
function routeLastModified(_route: string): Date {
  return _nowRef;
}

function addEntries(
  entries: MetadataRoute.Sitemap,
  route: string,
  opts: {
    changeFrequency: 'daily' | 'weekly' | 'monthly';
    priority: number;
    /**
     * Override the route-mtime-based lastModified for date-based URLs.
     * For `/panchang/date/2026-06-01` the meaningful freshness signal is
     * the URL's date itself, not the regen timestamp — without this
     * override every entry shared a single regen reference and Google
     * saw "this page hasn't updated since the last regen" for routes
     * that are inherently fresh data. 2026-06-01 hotfix.
     */
    lastModified?: Date;
  },
) {
  // Emit one entry per SITEMAP locale (all 8 visible locales — kept in
  // sync with hreflang so Google can verify every advertised cluster).
  // `alternates.languages` still includes every locale + x-default for
  // proper hreflang grouping.
  //
  // Cap future `lastModified` values at `_nowRef` (today). The date-based
  // blocks pass each URL's own date as the freshness signal, but for
  // URLs whose dates are in the future (the 7-day forward window)
  // Google treats a future `<lastmod>` as invalid / spammy — it can't
  // have been "last modified" in the future. The cap means future
  // dates fall back to today's regen time while past + today's dates
  // keep their precise URL-date signal. Gemini PR #329 cycle-4 MEDIUM.
  const lastMod = opts.lastModified
    ? (opts.lastModified > _nowRef ? _nowRef : opts.lastModified)
    : routeLastModified(route);
  // Thin-coverage routes (see indexable-locales.ts) ship en+hi only.
  // For those, both the `<loc>` fan-out AND the `alternates.languages`
  // list shrink to the indexable set — otherwise Google sees the URL
  // claim 7 missing locales in hreflang and dedups against the EN copy.
  // `undefined` means full 9-locale fan-out (the default).
  const indexableLocales = getIndexableLocales(route);
  const locOutLocales: ReadonlyArray<string> = indexableLocales ?? sitemapLocales;
  const hreflangLocales: ReadonlyArray<string> = indexableLocales ?? locales;
  for (const locale of locOutLocales) {
    const url = `${BASE_URL}/${locale}${route}`;
    const alternates: Record<string, string> = {};
    for (const alt of hreflangLocales) {
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

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  // Capture today's UTC midnight + now references for this regen. Every
  // helper below (addEntries, routeLastModified, the four date-rolling
  // blocks) reads from `_nowRef` / `_utcMidnight`. Without this call
  // the module-load-time references would be returned across all ISR
  // regens — the 7-day windows would freeze on the day of first import.
  refreshReferences();

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
  // Normalise to UTC midnight so `lastModified` doesn't include
  // build-time hours/minutes/seconds — same pattern as the choghadiya
  // + panchang blocks. Reusing the module-level `BUILD_NOW` constant
  // (frozen at module-load) instead of a fresh `new Date()` avoids
  // a midnight-build race where the horoscope block could see the
  // next day while choghadiya/panchang saw the previous day.
  // Gemini PR #329 cycle-2 MEDIUM.
  const horoscopeDateBase = _utcMidnight;
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
        // Per-URL lastModified — the URL date is the freshness signal,
        // not the build timestamp. Google ignores re-crawl-prompts for
        // URLs whose lastmod has frozen across multiple sitemap fetches.
        // `d` is already UTC-midnight thanks to the normalised base above.
        lastModified: d,
      });
    }
  }

  // Choghadiya date pages (next 60 days) — captures "choghadiya tomorrow", "choghadiya [date]"
  // queries. Extended from 30 → 60 days to give Google two indexing-latency windows of headroom:
  // a page published 30 days before its date is comfortably crawled / indexed / cached before the
  // date-specific query spike. May 21 Maithili spike (445 clicks @ 7.2% CTR on
  // /mai/choghadiya/2026-05-21) proved the pattern works — wider forward window captures more.
  // Gemini #266 leftover MED — same drift fix applied to panchang base
  // last time. Construct from UTC components so a build at 18:00 local
  // doesn't bake yesterday's date list compared to a build at 04:00 local.
  // Reuse BUILD_NOW for the same reason as horoscope above — single
  // module-level timestamp prevents midnight-race between sitemap
  // sections.
  const choghadiyaDateBase = _utcMidnight;
  for (let i = 0; i < 7; i++) {
    const d = new Date(choghadiyaDateBase);
    d.setUTCDate(d.getUTCDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    addEntries(entries, `/choghadiya/${dateStr}`, {
      changeFrequency: 'daily',
      priority: 0.6,
      lastModified: d, // Per-URL freshness signal — see addEntries notes.
    });
  }

  // Panchang date pages (next 60 days) — SEO step 2. Captures
  // "aaj ka panchang", "1 june 2026 panchang", "panchang [date]"
  // queries that currently lose to Drik/Prokerala at position 68.
  // Lives under /panchang/date/[date] to avoid the /panchang/[city]
  // sibling-route conflict (see page.tsx docstring).
  //
  // Gemini #240 MED + re-review MED: normalise base to UTC midnight
  // from UTC date components so the sitemap is deterministic regardless
  // of where (or when) the build runs. `getFullYear()/getMonth()/getDate()`
  // is the server's local-tz read — if the build server is in
  // America/Los_Angeles at 18:00 local on May 27, those return
  // (2026, 4, 27) but UTC is already May 28. UTC components throughout
  // eliminate the drift.
  // Same BUILD_NOW reuse as horoscope + choghadiya — all three
  // date-base computations share one frozen reference timestamp.
  const panchangDateBase = _utcMidnight;
  for (let i = 0; i < 7; i++) {
    const d = new Date(panchangDateBase);
    d.setUTCDate(d.getUTCDate() + i); // Lesson L: UTC arithmetic so DST doesn't drift
    const dateStr = d.toISOString().slice(0, 10);
    addEntries(entries, `/panchang/date/${dateStr}`, {
      changeFrequency: 'daily',
      priority: 0.6,
      lastModified: d, // Per-URL freshness signal — see addEntries notes.
    });
  }

  // Kundali lagna landing pages — SEO step 3 PR-1. 12 ascendant guides.
  // EN is the only indexable copy in this PR (HI follows in PR-2), but
  // we still emit hreflang alternates fanned out to all visible locales
  // — the sitemap-budget invariant requires every entry to expose an
  // alternates.languages map. Non-EN URLs render the same EN content
  // with `noindex` set in generateMetadata.
  const lagnaSlugs = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
  ];
  // Use the routeLastModified file-mtime helper (Gemini #243) so the
  // sitemap doesn't churn every build — search engines re-crawl only
  // when the underlying page file actually changes.
  const lagnaLastMod = routeLastModified('/kundali/lagna/[sign]');
  // Emit a sitemap entry per (slug, indexable-locale) so Google sees
  // each canonical; other locales surface only as hreflang alternates.
  // Indexable locale list lives in @/lib/seo/lagna-seo and is shared
  // with the page component (Lesson Q, Gemini #245).
  for (const slug of lagnaSlugs) {
    for (const loc of INDEXABLE_LAGNA_LOCALES) {
      entries.push({
        url: `${BASE_URL}/${loc}/kundali/lagna/${slug}`,
        lastModified: lagnaLastMod,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: buildHreflangMap(`/kundali/lagna/${slug}`),
        },
      });
    }
  }

  // Gauri Panchang date pages — mirror of the Choghadiya forward window
  // for the South-Indian "gowri panchangam <date>" / "கௌரி பஞ்சாங்கம் <date>"
  // query pattern. Same 60-day forward horizon so crawl/index timing
  // lines up before the date-specific query spike.
  // Gemini #266 leftover MED — same UTC-base treatment as choghadiya above.
  // Same BUILD_NOW + per-URL lastModified pattern as the other three
  // date-based blocks. Cycle-3 caught that this block was missed in
  // the first hotfix pass.
  const gauriDateBase = _utcMidnight;
  for (let i = 0; i < 7; i++) {
    const d = new Date(gauriDateBase);
    d.setUTCDate(d.getUTCDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    addEntries(entries, `/gauri-panchang/${dateStr}`, {
      changeFrequency: 'daily',
      priority: 0.6,
      lastModified: d,
    });
  }

  // Career muhurta activity pages — 8 high-intent landing pages, one
  // per career activity. These are not date-keyed (the 30-day calendar
  // lives client-side on the page) so the sitemap just lists the 8
  // canonical URLs.
  const careerSlugs = [
    'job-interview', 'job-application', 'salary-negotiation', 'contract-signing',
    'first-day-at-job', 'resignation', 'business-launch', 'asking-promotion',
  ];
  for (const slug of careerSlugs) {
    addEntries(entries, `/career-muhurta/${slug}`, {
      changeFrequency: 'weekly',
      priority: 0.7,
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

  // City panchang pages — SEO_INDEXABLE_CITY_SLUGS only (44 cities × 9
  // locales = 396 URLs, down from 1,593 with the old Tier 1 + Tier 2 fan-out).
  // Background: Tier 3 dropped 2026-06-03; the surviving 177 Tier 1+2 cities
  // were still flooding the sitemap with thin near-duplicate URLs that
  // contributed 1.35% of GSC clicks while occupying 22% of the sitemap
  // (within-locale Jaccard between any two city pages was 79-85%). The
  // 44-city keep-list is the post-demotion floor: metros + state capitals
  // + canonical pilgrimage + diaspora with measured demand. Dropped slugs
  // also carry `robots: noindex` so Google deindexes them over crawl cycles
  // — sitemap removal alone wouldn't drop already-indexed thin pages.
  for (const city of getSeoIndexableCities()) {
    addEntries(entries, `/panchang/${city.slug}`, {
      changeFrequency: 'daily',
      priority: 0.7,
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

