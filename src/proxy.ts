import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai'] as const;
// Retired locales — 301 redirect to /en/ equivalent so Google stops crawling them
const RETIRED_LOCALES = ['sa', 'mr'] as const;
const DEFAULT_LOCALE = 'en';

/**
 * Lightweight locale middleware — replaces next-intl/middleware to stay under
 * the 1 MB Edge Function size limit. Detects locale from URL path prefix,
 * Accept-Language header, or cookie. Redirects bare paths to /{locale}/path.
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect retired locales (sa, mr, mai) → /en/ equivalent with 301
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
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
