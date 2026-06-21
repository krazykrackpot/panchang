import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import proxy from '../proxy';

/**
 * Integration tests for the Next.js 16 proxy (was: middleware). Covers
 * the 2026-06-01 rollover-date follow-up: invalid date URLs must emit a
 * real HTTP 404 at the edge so Vercel ISR doesn't cache the
 * page-handler's soft-404 (HTTP 200 + not-found.tsx body).
 *
 * The proxy also handles the original responsibilities — locale prefix
 * detection, retired-locale redirect, Accept-Language fallback — and
 * those must keep working alongside the new 404 path.
 */

function makeRequest(url: string, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(new Request(url, { headers }));
}

describe('proxy — rollover date URLs return HTTP 404 at the edge', () => {
  const ROLLOVER_CASES: ReadonlyArray<{ url: string; route: string }> = [
    { url: 'https://dekhopanchang.com/en/panchang/date/2026-02-30', route: 'panchang/date' },
    { url: 'https://dekhopanchang.com/hi/panchang/date/2026-04-31', route: 'panchang/date HI' },
    { url: 'https://dekhopanchang.com/mr/panchang/date/2026-99-99', route: 'panchang/date MR with garbage' },
    { url: 'https://dekhopanchang.com/en/choghadiya/2026-02-30', route: 'choghadiya' },
    { url: 'https://dekhopanchang.com/mr/choghadiya/2026-13-01', route: 'choghadiya MR month 13' },
    { url: 'https://dekhopanchang.com/en/gauri-panchang/2026-02-30', route: 'gauri-panchang' },
    { url: 'https://dekhopanchang.com/en/daily/2026-02-30', route: 'daily' },
    { url: 'https://dekhopanchang.com/en/horoscope/aries/2026-02-30', route: 'horoscope rollover' },
    { url: 'https://dekhopanchang.com/mr/horoscope/mesh/2026-02-29', route: 'horoscope non-leap-year Feb 29' },
  ];

  it.each(ROLLOVER_CASES)('404s $route → $url', ({ url }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).toBe(404);
  });
});

describe('proxy — valid dates pass through to the page handler', () => {
  const VALID_CASES: ReadonlyArray<{ url: string }> = [
    { url: 'https://dekhopanchang.com/en/panchang/date/2026-06-01' },
    { url: 'https://dekhopanchang.com/hi/panchang/date/2024-02-29' }, // real leap day
    { url: 'https://dekhopanchang.com/mr/choghadiya/2026-06-01' },
    { url: 'https://dekhopanchang.com/en/gauri-panchang/2026-06-15' },
    // Stays within /daily/[date]'s current-year-±1 dynamic clamp by
    // pinning to a date computed from "now in Asia/Kolkata" — the same
    // clamp the proxy enforces (Gemini PR #402 round-2 CRITICAL).
    { url: `https://dekhopanchang.com/en/daily/${new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric' }).slice(0, 4)}-12-15` },
    // Use Vedic rashi; `aries` is 308-redirected by next.config.ts's
    // redirects() BEFORE reaching the proxy. PR #500's rashi gate
    // 404s `aries` when invoked directly (see SIBLING_CASES note).
    { url: 'https://dekhopanchang.com/en/horoscope/mesh/2026-06-01' },
  ];

  it.each(VALID_CASES)('lets through $url', ({ url }) => {
    const res = proxy(makeRequest(url));
    // NextResponse.next() returns 200 with a special x-middleware-next
    // header — we just care that it's NOT a 404 / 3xx.
    expect(res.status).not.toBe(404);
    expect([200, 204]).toContain(res.status);
  });
});

describe('proxy — sibling routes are NOT mistaken for date segments', () => {
  // CRITICAL: /horoscope/[rashi]/weekly and /monthly are separate
  // routes — they collide with the date-segment position but must NOT
  // 404. isRolloverDate returns false for these strings.
  //
  // Use VEDIC rashi slugs (mesh, etc.) — Western aliases like `aries`
  // are 308-redirected to Vedic by next.config.ts's redirects() rules
  // BEFORE the proxy fires, so they never reach the proxy in
  // production. PR #500's rashi gate (added after these fixtures were
  // written) correctly 404s `aries` when called directly. Using Vedic
  // slugs keeps the test asserting what the proxy actually sees on
  // production traffic.
  const SIBLING_CASES: ReadonlyArray<{ url: string; reason: string }> = [
    { url: 'https://dekhopanchang.com/en/horoscope/mesh/weekly', reason: 'weekly horoscope route' },
    { url: 'https://dekhopanchang.com/en/horoscope/mesh/monthly', reason: 'monthly horoscope route' },
    { url: 'https://dekhopanchang.com/en/horoscope/mesh', reason: 'rashi index page (no date segment)' },
    { url: 'https://dekhopanchang.com/en/panchang/delhi', reason: 'panchang city page (no /date prefix)' },
    { url: 'https://dekhopanchang.com/en/panchang', reason: 'panchang index' },
  ];

  it.each(SIBLING_CASES)('passes through $reason → $url', ({ url }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).not.toBe(404);
  });
});

describe('proxy — pre-existing locale behaviour still works', () => {
  it('returns HTTP 410 Gone for retired sa/ locale', () => {
    // Switched from 301 → 410 in 2026-06-04: high-volume same-target
    // redirects signal low quality to Google/Gemini. 410 is the
    // explicit "permanently gone" signal — cleaner index removal.
    const res = proxy(makeRequest('https://dekhopanchang.com/sa/panchang/date/2026-06-01'));
    expect(res.status).toBe(410);
    expect(res.headers.get('x-robots-tag')).toContain('noindex');
    expect(res.headers.get('content-type')).toContain('text/html');
  });

  it('sets NEXT_LOCALE cookie on first visit to a non-default locale', () => {
    const res = proxy(makeRequest('https://dekhopanchang.com/mr/panchang'));
    // NextResponse.next() exposes the Set-Cookie via headers
    const cookies = res.cookies.getAll();
    const next = cookies.find((c) => c.name === 'NEXT_LOCALE');
    expect(next?.value).toBe('mr');
  });

  it('does NOT set NEXT_LOCALE cookie on first visit to the DEFAULT locale (en) — Accept-Language fallback preserved', () => {
    // A non-English visitor (e.g. Accept-Language: hi) who lands on /en/...
    // from Google should NOT be locked into `en`. Without an explicit cookie,
    // their next bare `/` visit re-runs Accept-Language detection and
    // routes them to /hi/. Setting NEXT_LOCALE=en here would defeat that.
    const res = proxy(makeRequest('https://dekhopanchang.com/en/panchang'));
    const next = res.cookies.getAll().find((c) => c.name === 'NEXT_LOCALE');
    expect(next).toBeUndefined();
  });

  it('does NOT set NEXT_LOCALE cookie for bot User-Agents (Googlebot, Bingbot, etc.)', () => {
    // Bots crawl thousands of pages per session and never persist cookies,
    // so writing one buys nothing AND drops the response from cacheable to
    // private. This guard is the biggest single contributor to edge-cache
    // hit rate on crawl-heavy days.
    for (const ua of [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
      'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
    ]) {
      const res = proxy(makeRequest('https://dekhopanchang.com/mr/panchang', { 'user-agent': ua }));
      const next = res.cookies.getAll().find((c) => c.name === 'NEXT_LOCALE');
      expect(next, `bot UA "${ua}" should not get a cookie`).toBeUndefined();
    }
  });

  it('updates NEXT_LOCALE cookie when URL locale differs from cookie value', () => {
    // User had `en` cookie, navigates to `/mr/...` → cookie must update.
    const res = proxy(makeRequest('https://dekhopanchang.com/mr/panchang', { cookie: 'NEXT_LOCALE=en' }));
    const next = res.cookies.getAll().find((c) => c.name === 'NEXT_LOCALE');
    expect(next?.value).toBe('mr');
  });

  it('does NOT set NEXT_LOCALE cookie when URL locale matches existing cookie (cache-poisoning guard)', () => {
    // Setting a Set-Cookie on every locale-prefixed response forces Vercel
    // to mark the response `cache-control: private, no-cache, no-store`,
    // which disables the entire route tree's edge cache. Once the cookie
    // already matches the URL, the proxy must NOT echo it back.
    const res = proxy(makeRequest('https://dekhopanchang.com/mr/panchang', { cookie: 'NEXT_LOCALE=mr' }));
    const next = res.cookies.getAll().find((c) => c.name === 'NEXT_LOCALE');
    expect(next).toBeUndefined();
  });

  it('redirects bare paths to /en/ when no locale cookie or header', () => {
    const res = proxy(makeRequest('https://dekhopanchang.com/panchang'));
    // Either 307/308 redirect — depends on NextResponse.redirect default.
    expect([307, 308]).toContain(res.status);
    expect(res.headers.get('location')).toContain('/en/panchang');
  });

  it('bare-path redirect body carries AdSense verification meta tag', async () => {
    // AdSense verifies the apex (dekhopanchang.com), but the apex
    // redirects to /en — empty 307 body causes "Not found" rejection.
    // The verifier reads the body (and HTML meta refresh fallback);
    // browsers ignore the body and follow Location. 2026-06-10 incident.
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = 'ca-pub-4787764488539456';
    const res = proxy(makeRequest('https://dekhopanchang.com/'));
    expect([307, 308]).toContain(res.status);
    const body = await res.text();
    expect(body).toContain('google-adsense-account');
    expect(body).toContain('ca-pub-4787764488539456');
    expect(body).toContain('http-equiv="refresh"');
    expect(res.headers.get('content-type')).toContain('text/html');
  });

  it('honours Accept-Language for bare paths', () => {
    const res = proxy(
      makeRequest('https://dekhopanchang.com/panchang', {
        'accept-language': 'mr-IN,mr;q=0.9,en;q=0.5',
      }),
    );
    expect(res.headers.get('location')).toContain('/mr/panchang');
  });
});

describe('proxy — 404 path does NOT leak content or rewrite to /en/', () => {
  // Defense-in-depth: a rollover URL must not double through the
  // locale-redirect branch. Rollover + missing locale prefix shouldn't
  // happen in practice (proxy 404 runs after locale detection), but
  // verify a bare rollover path falls through to the locale redirect
  // (then the redirected URL hits 404 on next request). The point is:
  // the rollover gate is locale-aware, not a blanket regex.
  it('bare rollover path (no locale) → 307 redirect (gets locale prefix; 404 fires on follow-up)', () => {
    const res = proxy(makeRequest('https://dekhopanchang.com/panchang/date/2026-02-30'));
    // The locale-redirect branch runs first for paths without a locale
    // prefix. The 404 will fire on the follow-up request once /en/
    // gets prepended. We're documenting the intended layering here.
    expect([307, 308]).toContain(res.status);
  });
});

/* ──────────────────────────────────────────────────────────────────────
 * Soft-404 fix — spec docs/specs/2026-06-04-soft-404-date-keyed-routes.md
 *
 * Policy split (spec §3.1):
 *   today-aware date routes: /choghadiya, /gauri-panchang, /panchang/date,
 *     /daily, /horoscope/[rashi] → `/today` 302s to today's YYYY-MM-DD
 *   today-blind year routes:  /festivals, /hindu-calendar, /vivah-muhurat,
 *     /calendar/regional/bengali → 'today' (and any bad year) returns real
 *     HTTP 404. NOTE: /muhurta was previously here but is now intentionally
 *     not edge-gated — its deep URLs are crawlable with canonical+noindex
 *     pointing to the /muhurta/[type] hub. See the [city] layout.
 *   garbage slugs on date routes: anything non-YYYY-MM-DD that isn't
 *     'today' (and isn't a sibling literal like /horoscope/.../weekly)
 *     returns real HTTP 404
 * ─────────────────────────────────────────────────────────────────── */

describe('soft-404 fix — /today alias redirects (302) on today-aware routes', () => {
  const todayYmdRegex = /^\d{4}-\d{2}-\d{2}$/;

  const TODAY_CASES: ReadonlyArray<{ url: string; expectedPrefix: string }> = [
    { url: 'https://dekhopanchang.com/en/choghadiya/today',     expectedPrefix: '/en/choghadiya/' },
    { url: 'https://dekhopanchang.com/mai/choghadiya/today',    expectedPrefix: '/mai/choghadiya/' },
    { url: 'https://dekhopanchang.com/en/gauri-panchang/today', expectedPrefix: '/en/gauri-panchang/' },
    { url: 'https://dekhopanchang.com/en/panchang/date/today',  expectedPrefix: '/en/panchang/date/' },
    { url: 'https://dekhopanchang.com/en/daily/today',          expectedPrefix: '/en/daily/' },
    { url: 'https://dekhopanchang.com/en/horoscope/mesh/today', expectedPrefix: '/en/horoscope/mesh/' },
    { url: 'https://dekhopanchang.com/hi/horoscope/simha/today',expectedPrefix: '/hi/horoscope/simha/' },
  ];

  it.each(TODAY_CASES)('302s $url to today\'s YYYY-MM-DD under $expectedPrefix', ({ url, expectedPrefix }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).toBe(302);
    const loc = res.headers.get('location') ?? '';
    expect(loc).toContain(expectedPrefix);
    // Tail after the prefix must be a YYYY-MM-DD (today in Asia/Kolkata).
    // We don't pin the exact date because tests can run across midnight,
    // so just shape-check.
    const tail = loc.slice(loc.indexOf(expectedPrefix) + expectedPrefix.length);
    expect(tail).toMatch(todayYmdRegex);
  });

  it('preserves trailing segments on /daily/today/<city>', () => {
    const res = proxy(makeRequest('https://dekhopanchang.com/en/daily/today/delhi'));
    expect(res.status).toBe(302);
    expect(res.headers.get('location') ?? '').toMatch(/\/en\/daily\/\d{4}-\d{2}-\d{2}\/delhi$/);
  });
});

describe('soft-404 fix — garbage slugs on today-aware routes → 404', () => {
  // 'today' is handled by the redirect group above. Everything ELSE that
  // isn't a strict YYYY-MM-DD must 404 at the edge.
  const GARBAGE_CASES: ReadonlyArray<{ url: string }> = [
    { url: 'https://dekhopanchang.com/en/choghadiya/tomorrow' },
    { url: 'https://dekhopanchang.com/en/choghadiya/yesterday' },
    { url: 'https://dekhopanchang.com/en/choghadiya/foo' },
    { url: 'https://dekhopanchang.com/en/choghadiya/invalid-date-xyz' },
    { url: 'https://dekhopanchang.com/en/gauri-panchang/tomorrow' },
    { url: 'https://dekhopanchang.com/en/panchang/date/now' },
    { url: 'https://dekhopanchang.com/en/daily/yesterday' },
    { url: 'https://dekhopanchang.com/en/horoscope/mesh/tomorrow' },
    { url: 'https://dekhopanchang.com/en/horoscope/mesh/garbage' },
  ];

  it.each(GARBAGE_CASES)('404s $url', ({ url }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).toBe(404);
  });
});

describe('soft-404 fix — year-keyed routes reject /today and bad years', () => {
  // No today alias for year-keyed surfaces — 'today' has no year semantics.
  //
  // /muhurta/[type]/[year]/[month](/[city]) is intentionally NOT in this list.
  // PR #402's clause assumed numeric months (1–12) but the route uses NAMED
  // months (january…december), so every production URL hard-404'd at the
  // edge. The route is now fully crawlable; canonical + noindex on the
  // [city] layout signals "regional variant, equity belongs to the hub"
  // without 404-flooding logs or Google's quality classifier. See
  // src/app/[locale]/muhurta/[type]/[year]/[month]/[city]/layout.tsx and
  // the comment in proxy.ts:isInvalidYearPath.
  const YEAR_404_CASES: ReadonlyArray<{ url: string; reason: string }> = [
    { url: 'https://dekhopanchang.com/en/hindu-calendar/today',                     reason: 'hindu-calendar /today' },
    { url: 'https://dekhopanchang.com/en/hindu-calendar/foo',                       reason: 'hindu-calendar garbage' },
    { url: 'https://dekhopanchang.com/en/hindu-calendar/1900',                      reason: 'hindu-calendar pre-clamp year' },
    { url: 'https://dekhopanchang.com/en/hindu-calendar/2999',                      reason: 'hindu-calendar post-clamp year' },
    { url: 'https://dekhopanchang.com/en/vivah-muhurat/today',                      reason: 'vivah-muhurat /today' },
    { url: 'https://dekhopanchang.com/en/calendar/regional/bengali/today',          reason: 'bengali calendar /today' },
    { url: 'https://dekhopanchang.com/en/festivals/diwali/today',                   reason: 'festival /today as year' },
    { url: 'https://dekhopanchang.com/en/festivals/diwali/foo',                     reason: 'festival garbage year' },
    { url: 'https://dekhopanchang.com/en/festivals/diwali/today/delhi',             reason: 'festival /today as year + city' },
  ];

  it.each(YEAR_404_CASES)('404s $reason → $url', ({ url }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).toBe(404);
  });
});

describe('soft-404 fix — year-keyed routes pass through valid years', () => {
  const VALID_YEAR_CASES: ReadonlyArray<{ url: string }> = [
    { url: 'https://dekhopanchang.com/en/hindu-calendar/2026' },
    { url: 'https://dekhopanchang.com/en/vivah-muhurat/2026' },
    { url: 'https://dekhopanchang.com/en/calendar/regional/bengali/2026' },
    { url: 'https://dekhopanchang.com/en/festivals/diwali/2026' },
    // Note: /festivals/diwali/2026/delhi is NOT in this set anymore —
    // PR #719 added a 308 redirect from city variants to the year page,
    // so the proxy intentionally returns 308 (not 200/204) for that URL.
    // Tested separately in the city-variant 308 redirect block below.
    // Muhurta deep URLs — all combinations pass through the proxy.
    // Named month (canonical form per shared.ts MONTH_MAP):
    { url: 'https://dekhopanchang.com/en/muhurta/marriage/2026/june/delhi' },
    { url: 'https://dekhopanchang.com/mai/muhurta/griha-pravesh/2027/march/bhiwani' },
    // Numeric month (passes proxy but page-level notFound — still not a 404 at edge):
    { url: 'https://dekhopanchang.com/en/muhurta/marriage/2026/6/delhi' },
    // Garbage inputs also pass through — page handler issues notFound under
    // the [city] layout's noindex + canonical, so SEO blast is contained:
    { url: 'https://dekhopanchang.com/en/muhurta/marriage/today/6/delhi' },
    { url: 'https://dekhopanchang.com/en/muhurta/marriage/2026/13/delhi' },
  ];

  it.each(VALID_YEAR_CASES)('passes through $url', ({ url }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).not.toBe(404);
    expect([200, 204]).toContain(res.status);
  });
});

describe('PR #719 — festival/[slug]/[year]/[city] 308 redirect', () => {
  it.each([
    { url: 'https://dekhopanchang.com/en/festivals/diwali/2026/delhi' },
    { url: 'https://dekhopanchang.com/hi/festivals/holi/2027/mumbai' },
    { url: 'https://dekhopanchang.com/en/festivals/janmashtami/2028/bangalore' },
  ])('redirects 308 to year page: $url', ({ url }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).toBe(308);
    const location = res.headers.get('location');
    expect(location).toBeTruthy();
    // Location strips the city segment, keeps locale + slug + year
    const expectedPath = url.replace(/\/[a-z]+$/, '').replace('https://dekhopanchang.com', '');
    expect(location).toContain(expectedPath);
  });

  it.each([
    // Out-of-range year (2025 not in FESTIVAL_VALID_YEARS [2026-2030]) — falls through.
    { url: 'https://dekhopanchang.com/en/festivals/diwali/2025/delhi' },
    // Non-canonical festival slug — falls through.
    { url: 'https://dekhopanchang.com/en/festivals/not-a-festival/2026/delhi' },
    // Non-canonical city slug — falls through.
    { url: 'https://dekhopanchang.com/en/festivals/diwali/2026/not-a-city' },
  ])('falls through (no 308) for garbage: $url', ({ url }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).not.toBe(308);
  });

  it('preserves query params across the redirect', () => {
    const res = proxy(makeRequest('https://dekhopanchang.com/en/festivals/diwali/2026/delhi?utm_source=test&utm_campaign=verify'));
    expect(res.status).toBe(308);
    const location = res.headers.get('location') ?? '';
    expect(location).toContain('utm_source=test');
    expect(location).toContain('utm_campaign=verify');
  });
});

describe('soft-404 fix — per-route year clamps (Gemini round 2 CRITICAL)', () => {
  // `isStrictYmd` returns true for any real calendar date (e.g. 2036-01-01),
  // but each page-level parseDate has its OWN year clamp:
  //   choghadiya     2020-2035
  //   gauri-panchang 2020-2035
  //   panchang/date  2024-2030 (narrower — heavier compute per page)
  //   daily          current year ± 1 (dynamic)
  //   horoscope      no clamp (accepts any valid YMD)
  //
  // Without per-route clamps in the proxy, out-of-clamp YYYY-MM-DD URLs
  // would pass the edge check, hit the page handler, get `notFound()`d,
  // and Vercel ISR would cache the response as HTTP 200 — exactly the
  // soft-404 bug this PR exists to kill.

  const CLAMP_404_CASES: ReadonlyArray<{ url: string; reason: string }> = [
    { url: 'https://dekhopanchang.com/en/choghadiya/2036-01-01',     reason: 'choghadiya post-clamp (2036)' },
    { url: 'https://dekhopanchang.com/en/choghadiya/2019-12-31',     reason: 'choghadiya pre-clamp (2019)' },
    { url: 'https://dekhopanchang.com/en/gauri-panchang/2036-01-01', reason: 'gauri-panchang post-clamp' },
    { url: 'https://dekhopanchang.com/en/gauri-panchang/2019-06-15', reason: 'gauri-panchang pre-clamp' },
    { url: 'https://dekhopanchang.com/en/panchang/date/2031-01-01',  reason: 'panchang/date post-clamp (narrower: 2024-2030)' },
    { url: 'https://dekhopanchang.com/en/panchang/date/2023-12-31',  reason: 'panchang/date pre-clamp' },
    { url: 'https://dekhopanchang.com/en/panchang/date/2020-06-15',  reason: 'panchang/date pre-clamp deep (inside choghadiya clamp but outside its own)' },
  ];

  it.each(CLAMP_404_CASES)('404s $reason → $url', ({ url }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).toBe(404);
  });

  it('lets through valid YMD inside each route\'s clamp', () => {
    expect(proxy(makeRequest('https://dekhopanchang.com/en/choghadiya/2020-01-01')).status).not.toBe(404);
    expect(proxy(makeRequest('https://dekhopanchang.com/en/choghadiya/2035-12-31')).status).not.toBe(404);
    expect(proxy(makeRequest('https://dekhopanchang.com/en/panchang/date/2024-01-01')).status).not.toBe(404);
    expect(proxy(makeRequest('https://dekhopanchang.com/en/panchang/date/2030-12-31')).status).not.toBe(404);
  });

  it('does NOT clamp horoscope/[rashi]/[date] — page has no year clamp', () => {
    // Horoscope page only calls isStrictYmd; any real calendar date is
    // indexable. If a future PR adds a clamp to the horoscope page,
    // mirror it in DATE_SEGMENT_ROUTES — not in isStrictYmd.
    const res = proxy(makeRequest('https://dekhopanchang.com/en/horoscope/mesh/2036-01-01'));
    expect(res.status).not.toBe(404);
  });

  it('daily/[date] uses dynamic ±1 year clamp around current year', () => {
    // Resolve the SAME way the proxy resolves it so we're not
    // duplicating the dailyYearClamp logic in a test (which would just
    // re-encode the bug if the proxy logic is wrong).
    const currentYear = Number(new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
    }).slice(0, 4));

    expect(proxy(makeRequest(`https://dekhopanchang.com/en/daily/${currentYear}-06-15`)).status).not.toBe(404);
    expect(proxy(makeRequest(`https://dekhopanchang.com/en/daily/${currentYear - 1}-06-15`)).status).not.toBe(404);
    expect(proxy(makeRequest(`https://dekhopanchang.com/en/daily/${currentYear + 1}-06-15`)).status).not.toBe(404);
    expect(proxy(makeRequest(`https://dekhopanchang.com/en/daily/${currentYear + 2}-06-15`)).status).toBe(404);
    expect(proxy(makeRequest(`https://dekhopanchang.com/en/daily/${currentYear - 2}-06-15`)).status).toBe(404);
  });
});

describe('GSC Coverage Drilldown 2026-06-12 — bare hub redirects (308)', () => {
  // 3 of 234 404s in GSC Coverage Drilldown were external typos hitting
  // bare hub paths. 308 to the canonical surface; SEO equity follows.
  const BARE_HUB_CASES: ReadonlyArray<{ url: string; expected: RegExp }> = [
    { url: 'https://dekhopanchang.com/te/pancha-pakshi',  expected: /^\/te\/learn\/pancha-pakshi$/ },
    { url: 'https://dekhopanchang.com/gu/hindu-calendar', expected: /^\/gu\/hindu-calendar\/\d{4}$/ },
    { url: 'https://dekhopanchang.com/ta/hindu-calendar', expected: /^\/ta\/hindu-calendar\/\d{4}$/ },
    { url: 'https://dekhopanchang.com/en/pancha-pakshi',  expected: /^\/en\/learn\/pancha-pakshi$/ },
    { url: 'https://dekhopanchang.com/mai/hindu-calendar', expected: /^\/mai\/hindu-calendar\/\d{4}$/ },
  ];

  it.each(BARE_HUB_CASES)('308 redirects $url → matches $expected', ({ url, expected }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).toBe(308);
    const location = res.headers.get('location') ?? '';
    expect(new URL(location).pathname).toMatch(expected);
  });
});

describe('GSC Coverage Drilldown 2026-06-12 — puja-vidhi typo redirects (308)', () => {
  // 2 of 234 404s were `/learn/puja-vidhi/<slug>` — the data-file path
  // pattern. Canonical route is `/[locale]/puja/<slug>`.
  const PUJA_VIDHI_CASES: ReadonlyArray<{ url: string; expected: string }> = [
    { url: 'https://dekhopanchang.com/te/learn/puja-vidhi/raksha-bandhan', expected: '/te/puja/raksha-bandhan' },
    { url: 'https://dekhopanchang.com/hi/learn/puja-vidhi/dhanteras',      expected: '/hi/puja/dhanteras' },
    { url: 'https://dekhopanchang.com/en/learn/puja-vidhi/diwali',         expected: '/en/puja/diwali' },
  ];

  it.each(PUJA_VIDHI_CASES)('308 redirects $url → $expected', ({ url, expected }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).toBe(308);
    const location = res.headers.get('location') ?? '';
    expect(new URL(location).pathname).toBe(expected);
  });
});

describe('GSC Coverage Drilldown 2026-06-12 — double-locale strip (308)', () => {
  // 2 of 234 404s were /<loc1>/<loc2>/<rest> — strip outer locale, keep inner.
  const DOUBLE_LOCALE_CASES: ReadonlyArray<{ url: string; expected: string }> = [
    { url: 'https://dekhopanchang.com/en/bn/panchang/mumbai', expected: '/bn/panchang/mumbai' },
    { url: 'https://dekhopanchang.com/en/gu/panchang/nagpur', expected: '/gu/panchang/nagpur' },
    { url: 'https://dekhopanchang.com/hi/ta/learn/kundali',    expected: '/ta/learn/kundali' },
    // Gemini PR #689: bare double-locale (no rest) → inner locale home
    { url: 'https://dekhopanchang.com/en/bn',                  expected: '/bn' },
    { url: 'https://dekhopanchang.com/hi/te',                  expected: '/te' },
  ];

  it.each(DOUBLE_LOCALE_CASES)('308 redirects $url → $expected', ({ url, expected }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).toBe(308);
    const location = res.headers.get('location') ?? '';
    expect(new URL(location).pathname).toBe(expected);
  });

  it('does NOT mistake non-locale segment as inner locale (/en/foo/bar → pass-through)', () => {
    const res = proxy(makeRequest('https://dekhopanchang.com/en/calendar/today'));
    // Should hit the existing pass-through (200 next response), not 308
    expect(res.status).not.toBe(308);
  });
});

describe('soft-404 fix — adjacent surfaces unaffected', () => {
  // Routes that look related but are distinct page handlers must not be
  // accidentally gated. Spec §3.5 (city / type whitelists deferred).
  const UNGATED_CASES: ReadonlyArray<{ url: string; reason: string }> = [
    { url: 'https://dekhopanchang.com/en/festivals/diwali',          reason: 'festival index (no year) — slug whitelist deferred' },
    { url: 'https://dekhopanchang.com/en/calendar/today',            reason: 'calendar/[slug] — slug whitelist deferred (ships broken per spec §5)' },
    { url: 'https://dekhopanchang.com/en/career-muhurta/today',      reason: 'career-muhurta/[activity] — slug whitelist deferred (ships broken per spec §5)' },
    { url: 'https://dekhopanchang.com/en/muhurta/marriage/2026/6',   reason: 'muhurta without city (city is optional)' },
  ];

  it.each(UNGATED_CASES)('does NOT 404 $reason', ({ url }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).not.toBe(404);
  });
});
