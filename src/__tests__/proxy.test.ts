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
    { url: 'https://dekhopanchang.com/en/daily/2030-12-31' },
    { url: 'https://dekhopanchang.com/en/horoscope/aries/2026-06-01' },
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
  const SIBLING_CASES: ReadonlyArray<{ url: string; reason: string }> = [
    { url: 'https://dekhopanchang.com/en/horoscope/aries/weekly', reason: 'weekly horoscope route' },
    { url: 'https://dekhopanchang.com/en/horoscope/aries/monthly', reason: 'monthly horoscope route' },
    { url: 'https://dekhopanchang.com/en/horoscope/aries', reason: 'rashi index page (no date segment)' },
    { url: 'https://dekhopanchang.com/en/panchang/delhi', reason: 'panchang city page (no /date prefix)' },
    { url: 'https://dekhopanchang.com/en/panchang', reason: 'panchang index' },
  ];

  it.each(SIBLING_CASES)('passes through $reason → $url', ({ url }) => {
    const res = proxy(makeRequest(url));
    expect(res.status).not.toBe(404);
  });
});

describe('proxy — pre-existing locale behaviour still works', () => {
  it('redirects retired sa/ locale to /en/ with 301', () => {
    const res = proxy(makeRequest('https://dekhopanchang.com/sa/panchang/date/2026-06-01'));
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toContain('/en/panchang/date/2026-06-01');
  });

  it('sets NEXT_LOCALE cookie on a locale-prefixed request', () => {
    const res = proxy(makeRequest('https://dekhopanchang.com/mr/panchang'));
    // NextResponse.next() exposes the Set-Cookie via headers
    const cookies = res.cookies.getAll();
    const next = cookies.find((c) => c.name === 'NEXT_LOCALE');
    expect(next?.value).toBe('mr');
  });

  it('redirects bare paths to /en/ when no locale cookie or header', () => {
    const res = proxy(makeRequest('https://dekhopanchang.com/panchang'));
    // Either 307/308 redirect — depends on NextResponse.redirect default.
    expect([307, 308]).toContain(res.status);
    expect(res.headers.get('location')).toContain('/en/panchang');
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
