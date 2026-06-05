import { NextRequest, NextResponse } from 'next/server';
import { isStrictYmd, isValidYear, isValidMonth } from '@/lib/seo/date-validation';
import { todayInTimezone } from '@/lib/utils/now-in-timezone';

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

  // muhurta/[type]/[year]/[month](/[city]) — type, year, month sit at 2/3/4.
  // type is a slug whitelist deferred to a follow-up; we only gate year/month here.
  if (segments[1] === 'muhurta' && segments.length >= 5) {
    if (!isValidYear(segments[3])) return true;
    if (!isValidMonth(segments[4])) return true;
  }

  return false;
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

    // Phase 2 — format validation → real HTTP 404.
    // Includes rollover dates (2026-02-30), garbage slugs ('today' on
    // today-blind routes, 'tomorrow', 'foo'), out-of-clamp years,
    // out-of-range months. Spec §3.3 table.
    if (isInvalidDatePath(segments) || isInvalidYearPath(segments)) {
      return new NextResponse(null, { status: 404 });
    }

    // Set locale cookie for future visits
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', pathnameLocale, { path: '/', sameSite: 'lax' });
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

  // Redirect to locale-prefixed path
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set('NEXT_LOCALE', locale, { path: '/', sameSite: 'lax' });
  return response;
}

export const config = {
  matcher: [
    '/',
    '/(en|hi|sa|ta|te|bn|kn|mr|gu|mai)/:path*',
    // Note: matcher keeps `sa` so the retired-locale 301 still fires; LOCALES
    // (active) and RETIRED_LOCALES are the runtime gates.
    '/((?!api|_next|_vercel|embed|.*\\..*).*)',
  ],
};
