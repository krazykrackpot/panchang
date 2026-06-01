import { NextRequest, NextResponse } from 'next/server';
import { isRolloverDate } from '@/lib/seo/date-validation';

const LOCALES = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'] as const;
// Retired locales — 301 redirect to /en/ equivalent so Google stops crawling
// them. `mr` was restored May 2026 (mr.json has substantial coverage); only
// `sa` (Sanskrit) remains retired.
const RETIRED_LOCALES = ['sa'] as const;
const DEFAULT_LOCALE = 'en';

/**
 * Date-based routes whose `[date]` segment must be a strict YYYY-MM-DD.
 * Each entry pins the position of the date segment AFTER the locale
 * prefix (segment[0] = locale). Listed routes will emit a real HTTP 404
 * at the edge for rollover URLs like /en/horoscope/aries/2026-02-30 —
 * the page-level `notFound()` falls back to a soft-404 because Vercel
 * ISR caches the not-found render as HTTP 200.
 *
 * Routes intentionally NOT listed:
 *   - festivals/[slug]/[year] / [year]/[city]: year-only, no rollover
 *     condition (`isRolloverDate` only fires on YYYY-MM-DD shape).
 *   - muhurta/[type]/[year]/[month](/[city]): same.
 *   - hindu-calendar/[year], vivah-muhurat/[year], calendar/regional/bengali/[year]: same.
 *   - horoscope/[rashi]/weekly|monthly: the date segment is a literal,
 *     not a date; `isRolloverDate` returns false for non-date strings.
 */
const DATE_SEGMENT_ROUTES: ReadonlyArray<{
  /** Path parts AFTER the locale, in order, before the [date] segment. */
  prefix: readonly string[];
  /** Zero-based index into segments where the date sits. segment[0] = locale. */
  dateIdx: number;
}> = [
  { prefix: ['panchang', 'date'], dateIdx: 3 },
  { prefix: ['choghadiya'], dateIdx: 2 },
  { prefix: ['gauri-panchang'], dateIdx: 2 },
  { prefix: ['daily'], dateIdx: 2 },
];

/**
 * Returns true if `pathname` is a date-segment route whose date is a
 * rollover (e.g. 2026-02-30). Caller emits a 404 for true. The horoscope
 * route is handled separately because segment 3 is sometimes `weekly` /
 * `monthly` rather than a date — `isRolloverDate` returns false for
 * those, but we still need the prefix gate.
 */
function isInvalidDatePath(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  // Locale-less paths are handled by the redirect-to-locale branch; by
  // the time we check here we expect segments[0] to be the locale.
  if (segments.length < 2) return false;

  for (const route of DATE_SEGMENT_ROUTES) {
    const prefixMatch = route.prefix.every((p, i) => segments[1 + i] === p);
    if (!prefixMatch) continue;
    const dateSeg = segments[route.dateIdx];
    if (dateSeg && isRolloverDate(dateSeg)) return true;
  }

  // horoscope/[rashi]/[date] — segments[3] may be 'weekly' or 'monthly';
  // isRolloverDate returns false for both, so this check is safe.
  if (segments[1] === 'horoscope' && segments[3] && isRolloverDate(segments[3])) {
    return true;
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

  // Redirect retired locales (sa, mr) → /en/ equivalent with 301
  const retiredLocale = RETIRED_LOCALES.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (retiredLocale) {
    const url = request.nextUrl.clone();
    const rest = pathname === `/${retiredLocale}` ? '' : pathname.slice(retiredLocale.length + 1);
    url.pathname = `/en${rest}`;
    return NextResponse.redirect(url, 301);
  }

  // Check if the pathname already has a locale prefix
  const pathnameLocale = LOCALES.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    // Rollover date URLs (e.g. /en/horoscope/aries/2026-02-30) — return
    // a real HTTP 404 here so Google de-indexes them. Page-level
    // `notFound()` already renders not-found.tsx but Vercel ISR caches
    // the response with HTTP 200 (soft-404). Edge-level 404 is the only
    // way to get a real status code.
    if (isInvalidDatePath(pathname)) {
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
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
