import { NextRequest, NextResponse } from 'next/server';
import { isStrictYmd, isValidYear } from '@/lib/seo/date-validation';
import { todayInTimezone } from '@/lib/utils/now-in-timezone';
import { resolveCanonicalYogaSlug } from '@/lib/yogas/canonical-slugs';
import {
  CANONICAL_RASHI_SLUGS,
  CANONICAL_FESTIVAL_SLUGS,
  CANONICAL_CITY_SLUGS,
  CANONICAL_DEVOTIONAL_TYPES,
  CANONICAL_DEVOTIONAL_SLUGS,
} from '@/lib/seo/proxy-allowlists';
import {
  isSeoIndexableCity,
  wasLegacyIndexableSlug,
} from '@/lib/constants/cities-extended';

/**
 * Static sub-route names under /panchang/* that are NOT cities.
 * Length-3 paths starting with `/panchang/` whose segments[2] is in
 * neither this set nor CANONICAL_CITY_SLUGS are unknown — the city
 * validator hard-404s them.
 *
 * Keep tight — adding a route here without a matching page.tsx makes
 * an indexable URL silently render the default route. Cross-check
 * against `src/app/[locale]/panchang/*` when editing.
 */
const PANCHANG_RESERVED_SUBROUTES: ReadonlySet<string> = new Set([
  'date', 'rashi', 'nakshatra', 'masa', 'yoga', 'tithi', 'karana',
  'grahan', 'muhurta', 'samvatsara', 'yearly', 'auspicious',
  'inauspicious', 'nivas', 'planets', 'remedies', 'activity-guide',
  'locations',
]);


const LOCALES = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'] as const;
// Retired locales — return HTTP 410 Gone (permanent removal). Previously
// 301-redirected to /en/ equivalent, but a high volume of redirects to
// the same target (~thousands of /sa/* → /en/* per crawl) signals low
// quality to search engines and AI assistants — Gemini in particular
// will deprioritise URLs whose only response is a redirect to another
// locale. 410 explicitly tells crawlers "this URL is gone, drop it from
// your index" — cleaner than 404 (which is "not found right now") and
// avoids polluting indexable URLs with no-value redirects.
//
// `mr` was restored May 2026 (mr.json has substantial coverage); only
// `sa` (Sanskrit) remains retired.
const RETIRED_LOCALES = ['sa'] as const;
const DEFAULT_LOCALE = 'en';

// User-Agent patterns that identify bots / crawlers / social-card fetchers.
// Bots don't persist cookies between requests, so setting NEXT_LOCALE on
// them is wasted work and — more importantly — costs them an edge cache
// hit (any Set-Cookie response is marked `cache-control: private,
// no-cache, no-store` by Vercel). Substring matching is intentionally
// broad: false positives (a real browser flagged as bot) lose only the
// cookie write, which they'll get on their next request anyway.
const BOT_UA_PATTERN = /bot|crawl|spider|slurp|ia_archiver|facebookexternalhit/i;
function isBotUA(ua: string | null): boolean {
  return ua !== null && BOT_UA_PATTERN.test(ua);
}

/**
 * Asia/Kolkata anchors the `today` alias resolution on today-aware date
 * routes — matches the `SEO_CITY = 'delhi'` constant on the affected
 * pages so the redirect target matches what the page would render for
 * the default SEO city. Spec §3.5 + §4.2.
 */
const SEO_CITY_TZ = 'Asia/Kolkata';

/**
 * Date-based routes whose `[date]` segment must be a strict YYYY-MM-DD.
 * Each entry pins the position of the date segment AFTER the locale
 * prefix (segment[0] = locale).
 *
 * `todayAware` routes accept the literal slug 'today' as an alias that
 * 302-redirects to today's canonical YYYY-MM-DD URL (resolved in
 * {@link SEO_CITY_TZ}). On non-today-aware routes, 'today' is treated
 * as garbage and 404s. Spec §3.1 policy declaration.
 *
 * `yearMin` / `yearMax` mirror the per-route year clamp baked into each
 * page's `parseDate` helper. The proxy enforces the same clamp at the
 * edge so URLs the page would `notFound()` for never reach the ISR
 * cache (where their soft-404 status gets eaten). Routes are
 * intentionally heterogeneous — `panchang/date` runs 2024–2030 because
 * panchang spends more CPU per page; the others run 2020–2035 for the
 * wider crawl window. Routes without a hardcoded clamp (horoscope,
 * dynamic-clamp surfaces handled elsewhere) omit these fields. Gemini
 * PR #402 round-2 CRITICAL — a universal clamp on `isStrictYmd` would
 * either over-block horoscope (no clamp) or under-block panchang/date
 * (2024–2030); per-route is the only correct expression.
 *
 * Routes intentionally NOT listed here:
 *   - festivals/[slug]/[year], muhurta/[type]/[year]/[month] — year-keyed,
 *     handled in {@link isInvalidYearPath}.
 *   - hindu-calendar/[year], vivah-muhurat/[year], calendar/regional/bengali/[year]
 *     — year-keyed, handled in {@link isInvalidYearPath}.
 *   - horoscope/[rashi]/weekly|monthly — `weekly`/`monthly` are valid
 *     literals; handled inline.
 *   - daily/[date] — uses a dynamic clamp (current year ± 1) inside
 *     the page; handled inline so the proxy can resolve "current year"
 *     at request time in {@link SEO_CITY_TZ}.
 */
const DATE_SEGMENT_ROUTES: ReadonlyArray<{
  /** Path parts AFTER the locale, in order, before the [date] segment. */
  prefix: readonly string[];
  /** Zero-based index into segments where the date sits. segment[0] = locale. */
  dateIdx: number;
  /** Does this route accept `/today` as an alias for today's date? */
  todayAware: boolean;
  /** Minimum year accepted by the page-level parseDate, inclusive. Omit for no lower bound. */
  yearMin?: number;
  /** Maximum year accepted by the page-level parseDate, inclusive. Omit for no upper bound. */
  yearMax?: number;
}> = [
  // panchang/date/[date]/page.tsx: y < 2024 || y > 2030
  { prefix: ['panchang', 'date'], dateIdx: 3, todayAware: true, yearMin: 2024, yearMax: 2030 },
  // choghadiya/[date]/page.tsx: y < 2020 || y > 2035
  { prefix: ['choghadiya'], dateIdx: 2, todayAware: true, yearMin: 2020, yearMax: 2035 },
  // gauri-panchang/[date]/page.tsx: y < 2020 || y > 2035
  { prefix: ['gauri-panchang'], dateIdx: 2, todayAware: true, yearMin: 2020, yearMax: 2035 },
  // daily/[date]/page.tsx: Math.abs(d.getFullYear() - now.getFullYear()) > 1
  // (dynamic clamp resolved at request time — see DAILY_DYNAMIC_CLAMP)
  { prefix: ['daily'], dateIdx: 2, todayAware: true },
];

/**
 * `daily/[date]` uses a dynamic clamp (current year ± 1) inside its
 * page-level parseDate. Resolve "current year" in {@link SEO_CITY_TZ}
 * to match what the page would see when running on the Vercel UTC
 * server during the IST overnight window.
 */
function dailyYearClamp(): { yearMin: number; yearMax: number } {
  const currentYearStr = todayInTimezone(SEO_CITY_TZ).slice(0, 4);
  const currentYear = Number(currentYearStr);
  return { yearMin: currentYear - 1, yearMax: currentYear + 1 };
}

/**
 * Extract the year from a strict YYYY-MM-DD. Caller must have already
 * passed the string through {@link isStrictYmd}. Returns NaN if the
 * string isn't date-shaped (defensive — should not happen on the
 * proxy's hot path).
 */
function yearFromYmd(ymd: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return NaN;
  return Number(ymd.slice(0, 4));
}

/**
 * Year-based routes whose first dynamic segment must be a 4-digit year
 * in the {@link MIN_YEAR}–{@link MAX_YEAR} clamp from `date-validation`.
 * No route in this group accepts a `today` alias — year-keyed surfaces
 * are inherently year-scoped, "today" has no semantic meaning. Bad year
 * → real 404 (Spec §3.1).
 */
const YEAR_SEGMENT_ROUTES: ReadonlyArray<{
  prefix: readonly string[];
  yearIdx: number;
}> = [
  { prefix: ['hindu-calendar'], yearIdx: 2 },
  { prefix: ['vivah-muhurat'], yearIdx: 2 },
  { prefix: ['calendar', 'regional', 'bengali'], yearIdx: 4 },
];

/**
 * Builds the redirect target for `/today` on a today-aware route.
 * Preserves any trailing segments after the date (e.g. `/daily/today/delhi`
 * → `/daily/<today>/delhi`). Returns null if the request is not a
 * today-alias on a today-aware route.
 */
function todayRedirectPathname(
  locale: string,
  segmentsAfterLocale: string[],
): string | null {
  for (const route of DATE_SEGMENT_ROUTES) {
    if (!route.todayAware) continue;
    const prefixMatch = route.prefix.every((p, i) => segmentsAfterLocale[i] === p);
    if (!prefixMatch) continue;
    const dateSegIdx = route.dateIdx - 1; // segmentsAfterLocale is locale-stripped
    // `continue` (not `return null`) so future overlapping prefixes — e.g.
    // adding ['panchang'] later — don't silently short-circuit a longer
    // matching prefix. Current prefixes are disjoint; this is defensive.
    if (segmentsAfterLocale[dateSegIdx] !== 'today') continue;
    const today = todayInTimezone(SEO_CITY_TZ);
    const tail = segmentsAfterLocale.slice(dateSegIdx + 1).join('/');
    const base = [locale, ...route.prefix, today].join('/');
    return tail ? `/${base}/${tail}` : `/${base}`;
  }

  // horoscope/[rashi]/today — rashi is segments[1] from locale-stripped
  if (
    segmentsAfterLocale[0] === 'horoscope' &&
    segmentsAfterLocale.length >= 3 &&
    segmentsAfterLocale[2] === 'today'
  ) {
    const today = todayInTimezone(SEO_CITY_TZ);
    return `/${locale}/horoscope/${segmentsAfterLocale[1]}/${today}`;
  }

  return null;
}

/**
 * Returns true if `segments` (path components, locale at index 0) hit a
 * date-segment route with a date that isn't a strict YYYY-MM-DD — catches
 * both rollover dates like 2026-02-30 AND garbage like 'today', 'foo',
 * 'tomorrow' on routes where 'today' is not an accepted alias. For routes
 * where `/today` IS accepted, callers must short-circuit via
 * {@link todayRedirectPathname} BEFORE invoking this check.
 *
 * Horoscope `weekly` / `monthly` literals are explicitly allowed.
 *
 * Takes pre-split segments (rather than the raw pathname) so the proxy
 * can split once per request and share the result across both validators.
 */
function isInvalidDatePath(segments: string[]): boolean {
  if (segments.length < 2) return false;

  for (const route of DATE_SEGMENT_ROUTES) {
    const prefixMatch = route.prefix.every((p, i) => segments[1 + i] === p);
    if (!prefixMatch) continue;
    const dateSeg = segments[route.dateIdx];
    if (!dateSeg) continue;
    if (!isStrictYmd(dateSeg)) return true;
    // Per-route year clamp — soft-404 leak found by Gemini PR #402 round 2.
    // `isStrictYmd` confirms the date is a real calendar day; we additionally
    // reject years outside each route's documented page-level clamp so the
    // proxy 404 matches what the page would `notFound()` for.
    const y = yearFromYmd(dateSeg);
    if (route.yearMin !== undefined && y < route.yearMin) return true;
    if (route.yearMax !== undefined && y > route.yearMax) return true;
  }

  // daily/[date] — dynamic clamp (current year ± 1) resolved at request time.
  if (segments[1] === 'daily' && segments[2]) {
    const dateSeg = segments[2];
    if (isStrictYmd(dateSeg)) {
      const y = yearFromYmd(dateSeg);
      const { yearMin, yearMax } = dailyYearClamp();
      if (y < yearMin || y > yearMax) return true;
    }
    // Note: `!isStrictYmd(dateSeg)` is already caught by the DATE_SEGMENT_ROUTES
    // loop above (daily is listed there). This block only handles the year clamp.
  }

  // horoscope/[rashi]/[date] — segments[3] is the date OR 'weekly' / 'monthly'.
  // Horoscope has NO year clamp (its page-level handler only calls isStrictYmd),
  // so any valid YYYY-MM-DD is accepted. Don't add a clamp here without first
  // adding one to the page handler — they must agree, otherwise either the
  // proxy 404s indexable URLs (regression) or the page soft-404s URLs the
  // proxy lets through (the very bug this PR exists to fix).
  if (segments[1] === 'horoscope' && segments[3]) {
    const seg = segments[3];
    if (seg !== 'weekly' && seg !== 'monthly' && !isStrictYmd(seg)) return true;
  }

  return false;
}

/**
 * Returns true if `segments` (path components, locale at index 0) hit a
 * year-keyed route with an invalid year or month.
 *
 * Covers: hindu-calendar, vivah-muhurat, calendar/regional/bengali,
 * festivals/[slug]/[year](/[city])?, muhurta/[type]/[year]/[month](/[city])?.
 *
 * Takes pre-split segments — see {@link isInvalidDatePath}.
 */
function isInvalidYearPath(segments: string[]): boolean {
  if (segments.length < 2) return false;

  for (const route of YEAR_SEGMENT_ROUTES) {
    const prefixMatch = route.prefix.every((p, i) => segments[1 + i] === p);
    if (!prefixMatch) continue;
    const yearSeg = segments[route.yearIdx];
    if (yearSeg && !isValidYear(yearSeg)) return true;
  }

  // festivals/[slug]/[year] and festivals/[slug]/[year]/[city] — year sits at
  // segments[3]. festivals/[slug] (no year) is a different route, not gated.
  if (segments[1] === 'festivals' && segments.length >= 4) {
    if (!isValidYear(segments[3])) return true;
  }

  // muhurta/[type]/[year]/[month](/[city]) is intentionally NOT gated here.
  //
  // PR #402's original muhurta clause assumed numeric months (1–12) and
  // hard-404'd every URL whose month segment didn't match `\d{1,2}`. But
  // the route uses NAMED months (january…december — see
  // src/app/[locale]/muhurta/[type]/[year]/[month]/[city]/shared.ts).
  // Result: every production /muhurta/<type>/<year>/<month>/<city> URL
  // hard-404'd at the edge — including tier-1 cities like delhi/mumbai.
  // Bingbot's 2026-06-05 09:00 UTC revalidation pass (~22h post-deploy)
  // made it visible: 445 sequential 404s in a single hour.
  //
  // Recovery posture: keep the route crawlable and signal "not a
  // standalone surface, equity belongs to the hub" via canonical +
  // noindex set on the [city] layout — same mechanism big sites use for
  // templated regional variants. Deep URLs were already removed from
  // the sitemap (#383); canonical tells Google to consolidate the
  // indexation it already has. Garbage inputs (bad year, unknown month,
  // missing city) fall through to the page's notFound() under the same
  // noindex layout — soft-404 status, but Google ignores noindex URLs
  // for ranking so the SEO blast is contained.

  return false;
}

/**
 * Returns true if `segments` hits `/learn/yoga/[slug]` with a slug that
 * isn't in CANONICAL_YOGA_SLUGS (after hyphen/underscore normalisation).
 *
 * Background — Next 16 ISR ate the page-level `notFound()` status:
 * `/learn/yoga/lagna_mallika` rendered the not-found.tsx body but
 * served it with HTTP 200, the textbook soft-404 GSC flagged
 * 2026-05-28/29. The fix in src/app/[locale]/learn/yoga/[slug]/layout.tsx
 * (PR #330, #362, #367, #71cf566e) called `notFound()` correctly but
 * Vercel's ISR adapter wrote a 200-status cache entry anyway. Same root
 * cause as the date/year soft-404s already gated by
 * {@link isInvalidDatePath} / {@link isInvalidYearPath}.
 *
 * Proxy gate is the only way to return a real 404 BEFORE the request
 * crosses the ISR cache boundary. Matches a request when:
 *   segments = [locale, 'learn', 'yoga', '<slug>']
 * and `resolveCanonicalYogaSlug(slug.toLowerCase())` returns null.
 *
 * Hyphen variants of REAL yogas (e.g. `/learn/yoga/gaja-kesari` →
 * canonical `gajakesari`) are intentionally NOT gated here — the
 * resolver returns the canonical key, the layout's `permanentRedirect`
 * fires, search engines follow to the canonical URL. Only unresolvable
 * slugs hit this gate.
 */
function isInvalidYogaSlugPath(segments: string[]): boolean {
  if (segments.length !== 4) return false;
  if (segments[1] !== 'learn' || segments[2] !== 'yoga') return false;
  const slug = segments[3];
  if (!slug) return false;
  // Mirror the layout's normalisation (lowercase, then hyphen-variant
  // resolution). If the resolver returns null, the layout would call
  // notFound() — we 404 at the edge instead.
  return resolveCanonicalYogaSlug(slug.toLowerCase()) === null;
}

/**
 * Returns the canonical yoga slug if `/learn/yoga/[slug]` is a
 * hyphen/uppercase variant of a known yoga that needs a 308 redirect
 * to its canonical underscore-lowercase form. Returns null if no
 * redirect is needed (the slug is either already canonical, or
 * unresolvable — the latter is handled by isInvalidYogaSlugPath).
 *
 * Why this lives at the proxy: the layout's `permanentRedirect()` for
 * hyphen variants suffers the same ISR-eating that notFound() does —
 * Vercel caches the rendered body with HTTP 200 instead of issuing a
 * 308. Production confirmed 2026-06-07: /learn/yoga/gaja-kesari
 * returns 200 with x-vercel-cache: HIT/MISS, not 308 to
 * /learn/yoga/gajakesari. Moving the redirect to the edge bypasses
 * the cache layer entirely.
 */
function yogaCanonicalRedirect(segments: string[]): string | null {
  if (segments.length !== 4) return null;
  if (segments[1] !== 'learn' || segments[2] !== 'yoga') return null;
  const raw = segments[3];
  if (!raw) return null;
  const lowered = raw.toLowerCase();
  const canonical = resolveCanonicalYogaSlug(lowered);
  if (!canonical) return null;
  // Need a redirect only if the typed slug differs (either case or
  // hyphen variant). Already-canonical slugs pass through untouched.
  return canonical === raw ? null : canonical;
}

/**
 * Returns true if `segments` hits `/horoscope/[rashi](/...)` with a
 * rashi slug that isn't one of the 12 canonical Vedic names.
 *
 * The page calls `getRashiBySlug(slug)` and notFound()s on undefined;
 * ISR eats the 404 status (same root cause as the other gates here).
 *
 * Matches all three sub-routes via the same gate (segments[2] is the
 * rashi in all of them):
 *   /horoscope/[rashi]          (length 3)
 *   /horoscope/[rashi]/weekly   (length 4)
 *   /horoscope/[rashi]/monthly  (length 4)
 *   /horoscope/[rashi]/[date]   (length 4, date gated separately)
 */
function isInvalidRashiPath(segments: string[]): boolean {
  if (segments.length < 3) return false;
  if (segments[1] !== 'horoscope') return false;
  const rashi = segments[2];
  if (!rashi) return false;
  return !CANONICAL_RASHI_SLUGS.has(rashi);
}

/**
 * Returns true if `segments` hits `/festivals/[slug](/...)` with a
 * slug not in CANONICAL_FESTIVAL_SLUGS (= MAJOR_FESTIVALS ∩
 * FESTIVAL_DETAILS, the exact intersection the bare-slug page already
 * gates on; same intersection that page falls through to notFound()).
 *
 * Covers all three festival sub-routes via the same gate:
 *   /festivals/[slug]                  (length 3, bare-slug redirect)
 *   /festivals/[slug]/[year]           (length 4)
 *   /festivals/[slug]/[year]/[city]    (length 5)
 *
 * NOT touched: the bare `/festivals` index page (length 2) — that's
 * just `segments[1] === 'festivals'` with nothing else.
 */
function isInvalidFestivalSlugPath(segments: string[]): boolean {
  if (segments.length < 3) return false;
  if (segments[1] !== 'festivals') return false;
  const slug = segments[2];
  if (!slug) return false;
  return !CANONICAL_FESTIVAL_SLUGS.has(slug);
}

// NOTE: /calendar/[slug] is NOT gated here.
//
// The page intentionally has a permissive title-case fallback in
// resolveDisplayName() — unknown slugs render as e.g. "Satyanarayan"
// rather than triggering notFound(). This means /calendar/[slug] is
// NOT subject to the Next-16 ISR soft-404 bug — the page returns
// 200 with the title-cased content directly, not via a notFound()
// status that gets eaten.
//
// Sitemap audit 2026-06-07 confirmed multiple ranking calendar URLs
// (satyanarayan, amavasya-tarpan, masik-shivaratri, somvar-vrat …)
// that aren't in FESTIVAL_DETAILS / CATEGORY_DETAILS / EKADASHI_NAMES
// but still serve real content. Gating against the data files alone
// would 404 those indexed URLs — guaranteed SEO regression.
//
// If a soft-404 issue is ever observed on /calendar/[slug] in GSC,
// the right response is to either (a) tighten resolveDisplayName to
// throw notFound() for unknown slugs AND add the proxy gate, or (b)
// enrich the slug data so the fallback no longer fires.

/**
 * Returns true if `segments` hits `/panchang/[city]` (length 3
 * exactly) with a city slug that isn't in CANONICAL_CITY_SLUGS and
 * isn't a reserved structural sub-route (`date`, `rashi`, `yoga`,
 * etc. — see PANCHANG_RESERVED_SUBROUTES).
 *
 * Deeper /panchang/* paths use their own routes
 * (/panchang/date/[date], /panchang/rashi/[id], …) and are NOT
 * affected by this gate (length !== 3 short-circuits).
 *
 * CANONICAL_CITY_SLUGS holds ALL 325 cities across all tiers, not
 * just the 44 SEO-indexable ones. Tier-3 cities dropped from the
 * sitemap May-25 are still reachable via "nearby cities" links on
 * tier-1/2 pages — 404-ing them would break the link graph.
 */
function isInvalidPanchangCityPath(segments: string[]): boolean {
  if (segments.length !== 3) return false;
  if (segments[1] !== 'panchang') return false;
  const slug = segments[2];
  if (!slug) return false;
  if (PANCHANG_RESERVED_SUBROUTES.has(slug)) return false;
  return !CANONICAL_CITY_SLUGS.has(slug);
}

/**
 * Returns the 308 target if `segmentsAfterLocale` is one of the bare hub
 * paths that GSC found 404ing from external backlinks / guessed URLs:
 *
 *   /<locale>/hindu-calendar         → /<locale>/hindu-calendar/<curYear>
 *   /<locale>/pancha-pakshi          → /<locale>/learn/pancha-pakshi
 *
 * GSC Coverage Drilldown 2026-06-12 surfaced 3 such 404s
 * (te/pancha-pakshi, gu/hindu-calendar, ta/hindu-calendar). They aren't
 * in our sitemap — external typos / guess-the-URL crawlers landing on the
 * obvious hub path. Permanent 308 sends them to the canonical surface.
 *
 * Year resolved in {@link SEO_CITY_TZ} so the redirect target tracks the
 * current Gregorian year — we publish hindu-calendar/2026 and /2027 in
 * the sitemap. Returns null if no bare-hub match.
 */
function bareHubRedirect(
  locale: string,
  segmentsAfterLocale: string[],
): string | null {
  if (segmentsAfterLocale.length !== 1) return null;
  const hub = segmentsAfterLocale[0];
  if (hub === 'hindu-calendar') {
    const year = todayInTimezone(SEO_CITY_TZ).slice(0, 4);
    return `/${locale}/hindu-calendar/${year}`;
  }
  if (hub === 'pancha-pakshi') {
    return `/${locale}/learn/pancha-pakshi`;
  }
  return null;
}

/**
 * Returns the 308 target if the path is `/learn/puja-vidhi/<slug>` —
 * a known external-typo pattern (people guess the data-file path based
 * on `src/lib/constants/puja-vidhi/`). The canonical route is
 * `/[locale]/puja/[slug]`. GSC Coverage Drilldown 2026-06-12 surfaced 2
 * (te/raksha-bandhan, hi/dhanteras).
 *
 * Slug pass-through — the canonical `/puja/[slug]` route's own
 * `getPujaVidhiBySlug` + notFound() handles unknown slugs. The proxy
 * doesn't need to know the slug catalogue.
 */
function pujaVidhiTypoRedirect(
  locale: string,
  segmentsAfterLocale: string[],
): string | null {
  if (segmentsAfterLocale.length !== 3) return null;
  if (segmentsAfterLocale[0] !== 'learn') return null;
  if (segmentsAfterLocale[1] !== 'puja-vidhi') return null;
  const slug = segmentsAfterLocale[2];
  if (!slug) return null;
  return `/${locale}/puja/${slug}`;
}

/**
 * Returns the 308 target if the path is `/<loc1>/<loc2>/<rest>` —
 * a double-locale typo where the URL has BOTH an outer locale prefix
 * AND another active locale as the next segment. Caller has already
 * confirmed the OUTER `<loc1>` is a valid locale (via `pathnameLocale`);
 * we just check whether the next segment is also one of LOCALES and
 * strip the outer.
 *
 * GSC Coverage Drilldown 2026-06-12 surfaced 2 examples:
 *   /en/bn/panchang/mumbai → /bn/panchang/mumbai
 *   /en/gu/panchang/nagpur → /gu/panchang/nagpur
 *
 * Both came from external backlinks. We strip the outer locale (not the
 * inner) because the inner is the intent — someone meant Bengali Mumbai
 * panchang, not English-with-spurious-bn-segment.
 *
 * Bare double-locale paths (`/en/bn`, no rest) redirect to the inner
 * locale's homepage (`/bn`). They DON'T fall through to bare-locale
 * handling — the outer `/en` already satisfied `pathnameLocale`, so the
 * page router would receive `/en/bn` and 404 (no `/[locale]/bn` page).
 * Gemini PR #689 — caught the comment's earlier wrong assumption.
 *
 * Returns null only when `segmentsAfterLocale[0]` isn't a locale.
 */
function doubleLocaleRedirect(
  segmentsAfterLocale: string[],
): string | null {
  if (segmentsAfterLocale.length < 1) return null;
  const inner = segmentsAfterLocale[0];
  if (!LOCALES.includes(inner as (typeof LOCALES)[number])) return null;
  const rest = segmentsAfterLocale.slice(1).join('/');
  return rest ? `/${inner}/${rest}` : `/${inner}`;
}

/**
 * Returns true if `segments` hits `/devotional/[type]/[slug]` with
 * either an unknown `type` (not aarti/chalisa/mantra/stotram) or an
 * unknown `slug` (not in CANONICAL_DEVOTIONAL_SLUGS).
 *
 * Background — Next 16 ISR ate the page-level `notFound()` status
 * the same way it did for /learn/yoga/[slug]: `getDevotionalItem()`
 * in layout.tsx triggers `notFound()` for unknown items (PR #626),
 * which throws correctly, but the ISR adapter caches the response
 * as HTTP 200. Inbound traffic this hits:
 *   - sitemap remnants from before the 2026-06-09 CHALISAS expansion
 *     (e.g. /devotional/chalisa/vishnu-chalisa was in the sitemap
 *     before its source content existed — covered now)
 *   - typo'd referrers ("krishna-chalisa" was a common GSC-discovered
 *     URL with no source entry until PR #630)
 *   - guess-the-URL crawlers exploring /devotional/chalisa/* + a
 *     deity name they've heard of
 *
 * Validates BOTH the type AND the slug. Mismatched pairs
 * (e.g. /devotional/chalisa/gayatri-mantra — slug is valid but
 * belongs to a different type) currently fall through to the page's
 * `getDevotionalItem(type, slug)` lookup which soft-404s. A future
 * round can tighten this by exporting a `(type, slug) → boolean`
 * map from proxy-allowlists.ts; for now the type+slug union is the
 * 80/20 fix that closes the worst of the leak.
 *
 * Segment shape: `[locale, 'devotional', '<type>', '<slug>']`.
 * Deeper paths (e.g. /devotional/[type]/[slug]/<extra>) and the bare
 * /devotional index (length 2) are NOT gated.
 */
function isInvalidDevotionalPath(segments: string[]): boolean {
  if (segments.length !== 4) return false;
  if (segments[1] !== 'devotional') return false;
  const type = segments[2];
  const slug = segments[3];
  if (!type || !slug) return false;
  // Either invalid type OR invalid slug → reject. Pair-mismatch
  // (valid type + valid slug from a different type, e.g.
  // /devotional/chalisa/lakshmi-mantra) is caught downstream by
  // getDevotionalItem(type, slug); the proxy only closes the
  // soft-404 hole on totally-unknown identifiers.
  return !CANONICAL_DEVOTIONAL_TYPES.has(type) || !CANONICAL_DEVOTIONAL_SLUGS.has(slug);
}

/**
 * Lightweight locale proxy — Next.js 16 renamed `middleware` to `proxy` to
 * clarify it sits at the network boundary. The exported function must
 * match. Detects locale from URL path prefix, Accept-Language header, or
 * cookie. Redirects bare paths to /{locale}/path.
 *
 * Stays small to keep under the 1 MB Edge Function size limit (replaces
 * the much heavier next-intl/middleware).
 *
 * Export shape: Next.js 16 `proxy.ts` uses a **default export** (same as
 * the legacy `middleware.ts` convention). The function name is what
 * changed (`middleware` → `proxy`), not the export style.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Return HTTP 410 Gone for retired locales (currently just `sa`).
  // Cleaner permanent-removal signal than 301→/en — Google + Gemini drop
  // 410 URLs from the index instead of treating them as low-quality
  // redirects. Body intentionally minimal: search-engine crawlers parse
  // the status code, not the markup.
  const retiredLocale = RETIRED_LOCALES.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (retiredLocale) {
    return new NextResponse(
      `<!doctype html><meta charset="utf-8"><title>410 Gone</title><h1>410 Gone</h1><p>The <code>/${retiredLocale}</code> locale has been retired. <a href="/en/">Browse the site in English</a> instead.</p>`,
      {
        status: 410,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, follow',
          'Cache-Control': 'public, s-maxage=31536000, max-age=86400, immutable',
        },
      },
    );
  }

  // Phase 1 (2026-06-10) — /panchang/[city] (locale, slug) pairs that
  // were in the legacy SEO_INDEXABLE_CITY_SLUGS but aren't in the new
  // per-locale CITIES_BY_LOCALE return HTTP 410 Gone. These URLs were
  // indexed under Phase 0's all-locales-indexable grid; without an
  // explicit 410 they'd hang in Google's index for weeks while the
  // noindex signal slowly drains. Targeted at the actual "intentionally
  // removed" surface — non-legacy slugs (Tier 2/3 cities never in the
  // indexable set) keep their normal render + noindex path.
  //
  // Regex pinned to the exact /(locale)/panchang/(slug) shape to avoid
  // colliding with /panchang/date/<date>, /panchang/rashi/<rashi>, etc.
  // — those use reserved sub-route names handled below.
  // /[locale]/festivals/[slug]/[year]/[city] → 308 to /[locale]/festivals/[slug]/[year]
  //
  // The city-variant page is `noindex` + has canonical pointing to the year
  // page + isn't in the sitemap — Google was never sent there. But bots
  // (crawlers + scrapers) were still hitting it at 19-21K req/day with P75
  // 3 seconds CPU per request (16h CPU/day, 970 MB/day egress). At noindex
  // there's no SEO reason to render: 308 collapses the route to a 1ms edge
  // redirect, freeing function CPU entirely.
  //
  // The year page already shows a 6-city muhurat table (Delhi/Mumbai/
  // Bangalore/Chennai/Kolkata/Pune) — that's the better landing surface
  // for any real human visit.
  //
  // 308 (Permanent Redirect, method-preserving) is the SEO-correct choice
  // for a noindex + non-canonical surface per Google's guidelines: external
  // backlinks consolidate into the year page, crawl budget reclaimed.
  // Pinned regex avoids colliding with /festivals/[slug] (bare) and
  // /festivals/[slug]/[year] (year-only, length 4).
  const festivalCityMatch = pathname.match(/^\/([a-z]{2,3})\/festivals\/([a-z0-9-]+)\/(\d{4})\/([a-z0-9-]+)\/?$/);
  if (festivalCityMatch) {
    const [, fcLocale, fcSlug, fcYear] = festivalCityMatch;
    // Validate locale, festival slug, and year before redirecting.
    // Garbage paths (typos, scraper noise) fall through to Next's 404
    // handler instead of getting a 308 that points at a 404 target.
    // Gemini PR #719 r2 MED.
    if (
      LOCALES.includes(fcLocale as (typeof LOCALES)[number]) &&
      CANONICAL_FESTIVAL_SLUGS.has(fcSlug) &&
      isValidYear(fcYear)
    ) {
      // Clone nextUrl to preserve query parameters (UTM codes, search
      // params) across the redirect. Gemini PR #719 r2 MED.
      const url = request.nextUrl.clone();
      url.pathname = `/${fcLocale}/festivals/${fcSlug}/${fcYear}`;
      return NextResponse.redirect(url, 308);
    }
  }

  const cityRouteMatch = pathname.match(/^\/([a-z]{2,3})\/panchang\/([a-z0-9-]+)\/?$/);
  if (cityRouteMatch) {
    const [, cityLocale, citySlug] = cityRouteMatch;
    if (
      LOCALES.includes(cityLocale as (typeof LOCALES)[number]) &&
      !PANCHANG_RESERVED_SUBROUTES.has(citySlug) &&
      wasLegacyIndexableSlug(citySlug) &&
      !isSeoIndexableCity(citySlug, cityLocale)
    ) {
      return new NextResponse(
        `<!doctype html><meta charset="utf-8"><title>410 Gone</title><h1>410 Gone</h1><p>The <code>/${cityLocale}/panchang/${citySlug}</code> page has been retired. <a href="/${cityLocale}/panchang">Browse current city panchang options</a>.</p>`,
        {
          status: 410,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Robots-Tag': 'noindex, follow',
            'Cache-Control': 'public, s-maxage=31536000, max-age=86400, immutable',
          },
        },
      );
    }
  }

  // Check if the pathname already has a locale prefix
  const pathnameLocale = LOCALES.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    // Spec §3.1 policy:
    //  - today-aware date routes accept `/today` → 302 to today's YYYY-MM-DD
    //  - everything else with a malformed date/year segment → real HTTP 404
    //
    // Page-level `notFound()` renders not-found.tsx but Vercel ISR caches
    // the response with HTTP 200 (soft-404). Edge-level 404 is the only
    // way to get a real status code through the cache boundary. Spec §2.
    //
    // Split pathname ONCE per request and share the result across both
    // the today-redirect resolver and the two format validators — saves
    // 3 redundant split/filter passes on the hot path.
    const segments = pathname.split('/').filter(Boolean);
    const segmentsAfterLocale = segments.slice(1);

    // Phase 1 — `/today` alias on today-aware routes → 302.
    // 302 (temporary) is required because the target changes daily; a
    // 301/308 would let browsers and CDNs memoise today's date as the
    // permanent target. Spec §4.2.
    const todayTarget = todayRedirectPathname(pathnameLocale, segmentsAfterLocale);
    if (todayTarget) {
      const url = request.nextUrl.clone();
      url.pathname = todayTarget;
      return NextResponse.redirect(url, 302);
    }

    // Phase 1.5 — yoga hyphen/uppercase variant → 308 to canonical.
    // The layout's `permanentRedirect()` for the same case is eaten by
    // Next 16's ISR cache (production-confirmed 2026-06-07: hyphen
    // variants return 200 with x-vercel-cache: HIT instead of 308).
    // Moving the redirect to the edge bypasses the cache layer.
    const yogaCanonical = yogaCanonicalRedirect(segments);
    if (yogaCanonical !== null) {
      const url = request.nextUrl.clone();
      url.pathname = `/${pathnameLocale}/learn/yoga/${yogaCanonical}`;
      return NextResponse.redirect(url, 308);
    }

    // Phase 1.6 — double-locale strip → 308. `/en/bn/panchang/mumbai`
    // → `/bn/panchang/mumbai`. Surfaced by GSC Coverage Drilldown
    // 2026-06-12 as external typos on backlinks. Runs BEFORE the bare-hub
    // and puja-vidhi-typo redirects so the inner locale handles those
    // checks (a double-locale + bare-hub stack like /en/bn/hindu-calendar
    // strips to /bn/hindu-calendar and re-enters the proxy on the next
    // request, which then hits the bare-hub redirect for bn).
    const doubleLocale = doubleLocaleRedirect(segmentsAfterLocale);
    if (doubleLocale !== null) {
      const url = request.nextUrl.clone();
      url.pathname = doubleLocale;
      return NextResponse.redirect(url, 308);
    }

    // Phase 1.7 — bare hub paths → 308 to canonical hub URL.
    //   /<loc>/hindu-calendar → /<loc>/hindu-calendar/<currentYear>
    //   /<loc>/pancha-pakshi  → /<loc>/learn/pancha-pakshi
    // GSC Coverage Drilldown 2026-06-12: 3 of 234 404s; external typos
    // not in our sitemap but worth catching for UX + crawl-budget hygiene.
    const bareHub = bareHubRedirect(pathnameLocale, segmentsAfterLocale);
    if (bareHub !== null) {
      const url = request.nextUrl.clone();
      url.pathname = bareHub;
      return NextResponse.redirect(url, 308);
    }

    // Phase 1.8 — puja-vidhi data-file-path typo → 308 to canonical
    // `/[locale]/puja/[slug]` route. People guess the URL from
    // `src/lib/constants/puja-vidhi/`; the canonical route is `/puja/<slug>`.
    // GSC Coverage Drilldown 2026-06-12: 2 of 234 404s.
    const pujaVidhi = pujaVidhiTypoRedirect(pathnameLocale, segmentsAfterLocale);
    if (pujaVidhi !== null) {
      const url = request.nextUrl.clone();
      url.pathname = pujaVidhi;
      return NextResponse.redirect(url, 308);
    }

    // Phase 2 — format validation → real HTTP 404.
    // Covers: rollover dates (2026-02-30), garbage date slugs ('today'
    // on today-blind routes, 'tomorrow', 'foo'), out-of-clamp years,
    // out-of-range months, unknown yoga/rashi/festival/calendar/city
    // slugs. Spec §3.3 table.
    //
    // All these would otherwise hit a page-level `notFound()` that Next
    // 16's ISR adapter caches with HTTP 200 (the systemic soft-404 bug
    // documented at line 351-353 below).
    if (
      isInvalidDatePath(segments) ||
      isInvalidYearPath(segments) ||
      isInvalidYogaSlugPath(segments) ||
      isInvalidRashiPath(segments) ||
      isInvalidFestivalSlugPath(segments) ||
      isInvalidPanchangCityPath(segments) ||
      isInvalidDevotionalPath(segments)
    ) {
      return new NextResponse(null, { status: 404 });
    }

    // Setting a Set-Cookie header on every response forces Vercel's edge to
    // mark it `cache-control: private, no-cache, no-store` (so different
    // users' cookies don't cross-pollinate), which disables the entire
    // route tree's edge cache. Before this guard, every /{locale}/* request
    // was MISS — the precompute migration's Fluid CPU and ISR Writes
    // savings still worked (~90% drop), but Function Invocations cost more
    // than necessary because the function fired on every request instead
    // of serving from cache.
    //
    // Skip the cookie write in three independent scenarios — each enables
    // edge caching for that request:
    //   1. existingCookie matches pathnameLocale → write would be a no-op.
    //   2. Request is from a bot/crawler → cookies never persist; the write
    //      buys nothing AND demotes the response from cacheable to
    //      private. Bots get the biggest cache benefit per saved write
    //      because they crawl thousands of pages per session.
    //   3. First-time visitor accessing the default locale → absence of
    //      cookie already maps to DEFAULT_LOCALE on bare `/` visits via
    //      the Accept-Language fallback below. Explicitly setting `en`
    //      would lock a non-English user into `en` even if their
    //      Accept-Language header would have routed them to a regional
    //      locale on later bare visits.
    const existingCookie = request.cookies.get('NEXT_LOCALE')?.value;
    const response = NextResponse.next();
    const isBot = isBotUA(request.headers.get('user-agent'));
    const isDefaultLocaleFirstVisit = existingCookie === undefined && pathnameLocale === DEFAULT_LOCALE;
    const shouldSkipCookie =
      existingCookie === pathnameLocale ||
      isBot ||
      isDefaultLocaleFirstVisit;
    if (!shouldSkipCookie) {
      response.cookies.set('NEXT_LOCALE', pathnameLocale, { path: '/', sameSite: 'lax' });
    }
    return response;
  }

  // Determine locale: cookie → Accept-Language → default
  let locale = DEFAULT_LOCALE;

  // Check cookie first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale as typeof LOCALES[number])) {
    locale = cookieLocale;
  } else {
    // Parse Accept-Language header
    const acceptLang = request.headers.get('accept-language');
    if (acceptLang) {
      const preferred = acceptLang
        .split(',')
        .map((lang) => {
          const [code, q] = lang.trim().split(';q=');
          return { code: code.split('-')[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
        })
        .sort((a, b) => b.q - a.q);

      for (const { code } of preferred) {
        if (LOCALES.includes(code as typeof LOCALES[number])) {
          locale = code;
          break;
        }
      }
    }
  }

  // Redirect to locale-prefixed path.
  //
  // The response body carries the AdSense site-verification meta tag in
  // addition to the standard `Location` redirect header. Without this,
  // AdSense's verifier hits the apex domain, gets a 307 with an empty
  // body, can't find the meta tag, and rejects the site with "Not
  // found" status — even when /en/ has the meta tag, the script, and
  // /ads.txt is correct. (Rejection reproduced 2026-06-10 00:37 CEST.)
  // The body is also useful for any static-fetch consumer that doesn't
  // follow 307s (some social-card scrapers, some custom monitors).
  // Browsers and proper crawlers continue to follow the `Location`
  // header and ignore the body.
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
  const verificationBody = `<!DOCTYPE html><html><head>${
    adsenseClient ? `<meta name="google-adsense-account" content="${adsenseClient}">` : ''
  }<meta http-equiv="refresh" content="0;url=${url.pathname}"><title>Redirecting…</title></head><body><p>Redirecting to <a href="${url.pathname}">${url.pathname}</a>…</p></body></html>`;
  const response = new NextResponse(verificationBody, {
    status: 307,
    headers: {
      Location: url.toString(),
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
  response.cookies.set('NEXT_LOCALE', locale, { path: '/', sameSite: 'lax' });
  return response;
}

export const config = {
  matcher: [
    '/',
    '/(en|hi|sa|ta|te|bn|kn|mr|gu|mai)/:path*',
    // Note: matcher keeps `sa` so the retired-locale 301 still fires; LOCALES
    // (active) and RETIRED_LOCALES are the runtime gates.
    //
    // `sitemaps` is excluded so the per-locale sitemap shards at
    // /sitemaps/{en,hi,…} don't get the auto-locale prefix the proxy
    // applies to unprefixed paths. Without this exemption,
    // /sitemaps/en redirects 307 → /en/sitemaps/en → 404. (The literal
    // sitemap path /sitemap.xml is already exempt via the `.*\\..*`
    // file-extension catch.)
    '/((?!api|_next|_vercel|embed|sitemaps|.*\\..*).*)',
  ],
};
