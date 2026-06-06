/**
 * Tests for the rate-limit helper — `getClientIP` and `checkRateLimit`.
 *
 * Spoofability is the historical risk surface:
 *
 *   - The leftmost entry of `x-forwarded-for` is client-supplied and was
 *     used as the rate-limit key in an earlier implementation. An attacker
 *     could rotate the value per request to bypass the limit on any route
 *     keyed off `getClientIP` (Audit P1-3, since-fixed).
 *
 *   - The pre-2026-06-06 fallback for "no IP header at all" was the
 *     literal string `127.0.0.1`. A request without IP headers — local
 *     dev, tests, misconfigured edge — would share a single rate-limit
 *     bucket with every other unidentified request from every other
 *     route. One misbehaving anonymous client could exhaust the budget
 *     for all routes at once (memory
 *     `project_audit_deferred_rate_limit_ip`). Replaced with
 *     `unknown:<pathname>` so the blast radius is capped at one route.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getClientIP, checkRateLimit } from '../rate-limit';

function makeRequest(headers: Record<string, string>, url = 'https://dekhopanchang.com/api/test'): Request {
  return new Request(url, { headers });
}

describe('getClientIP', () => {
  it('prefers x-vercel-forwarded-for over every other source', () => {
    const ip = getClientIP(makeRequest({
      'x-vercel-forwarded-for': '203.0.113.5',
      'x-real-ip': '203.0.113.6',
      'x-forwarded-for': '203.0.113.7',
    }));
    expect(ip).toBe('203.0.113.5');
  });

  it('takes the RIGHTMOST hop of a multi-hop x-vercel-forwarded-for', () => {
    // Even though it's edge-stamped, Vercel can append multiple hops if
    // the request transited a private network in front of the platform.
    // The rightmost is closest to our infrastructure and therefore the
    // strongest trust signal.
    const ip = getClientIP(makeRequest({
      'x-vercel-forwarded-for': 'spoof.client, 198.51.100.1, 203.0.113.99',
    }));
    expect(ip).toBe('203.0.113.99');
  });

  it('falls back to x-real-ip when x-vercel-forwarded-for is absent', () => {
    const ip = getClientIP(makeRequest({
      'x-real-ip': '198.51.100.42',
      'x-forwarded-for': '10.0.0.1, 198.51.100.99',
    }));
    expect(ip).toBe('198.51.100.42');
  });

  it('falls back to the RIGHTMOST x-forwarded-for hop, never the leftmost', () => {
    // The regression we're guarding against: an attacker rotates the
    // leftmost xff entry per request to evade rate limits. The rightmost
    // hop is added by trusted infrastructure (Vercel's edge / Cloudflare /
    // similar) and is therefore the correct key.
    const ip = getClientIP(makeRequest({
      'x-forwarded-for': '1.2.3.4, 5.6.7.8, 9.10.11.12',
    }));
    expect(ip).toBe('9.10.11.12');
  });

  it("ignores a single-hop x-forwarded-for's leftmost when it's the only entry", () => {
    // A degenerate but real case: only one hop in xff means leftmost ==
    // rightmost. We still take that one value (we have no better signal).
    const ip = getClientIP(makeRequest({
      'x-forwarded-for': '203.0.113.7',
    }));
    expect(ip).toBe('203.0.113.7');
  });

  it('returns unknown:<pathname> when no IP header is present', () => {
    // Replaces the previous `127.0.0.1` shared-everywhere bucket — that
    // pool let one misbehaving anonymous client exhaust the rate-limit
    // budget for every route at once.
    const ip = getClientIP(makeRequest({}, 'https://dekhopanchang.com/api/kundali'));
    expect(ip).toBe('unknown:/api/kundali');
  });

  it('keeps unknown buckets segregated by route', () => {
    const a = getClientIP(makeRequest({}, 'https://dekhopanchang.com/api/checkout'));
    const b = getClientIP(makeRequest({}, 'https://dekhopanchang.com/api/horoscope'));
    expect(a).not.toBe(b);
    expect(a).toBe('unknown:/api/checkout');
    expect(b).toBe('unknown:/api/horoscope');
  });

  it('drops whitespace around the chosen value', () => {
    const ip = getClientIP(makeRequest({
      'x-vercel-forwarded-for': '  203.0.113.5  ',
    }));
    expect(ip).toBe('203.0.113.5');
  });

  it('ignores an empty x-vercel-forwarded-for and falls through', () => {
    // Empty / whitespace-only headers shouldn't claim a slot.
    const ip = getClientIP(makeRequest({
      'x-vercel-forwarded-for': '   ',
      'x-real-ip': '198.51.100.42',
    }));
    expect(ip).toBe('198.51.100.42');
  });
});

describe('checkRateLimit', () => {
  // Use a fresh key per test so the in-memory Map doesn't carry state
  // across tests in the same vitest run.
  let nextKeyId = 0;
  function freshKey(): string {
    nextKeyId += 1;
    return `__test__:${Date.now()}:${nextKeyId}`;
  }

  beforeEach(() => {
    nextKeyId += 1;
  });

  it('allows up to maxRequests in a window', () => {
    const key = freshKey();
    const cfg = { maxRequests: 3, windowMs: 60_000 };
    for (let i = 0; i < 3; i++) {
      const r = checkRateLimit(key, cfg);
      expect(r.allowed).toBe(true);
    }
    const denied = checkRateLimit(key, cfg);
    expect(denied.allowed).toBe(false);
    expect(denied.remaining).toBe(0);
  });

  it('decrements `remaining` per request', () => {
    const key = freshKey();
    const cfg = { maxRequests: 5, windowMs: 60_000 };
    expect(checkRateLimit(key, cfg).remaining).toBe(4);
    expect(checkRateLimit(key, cfg).remaining).toBe(3);
    expect(checkRateLimit(key, cfg).remaining).toBe(2);
  });

  it('keys distinct IPs into independent buckets', () => {
    const cfg = { maxRequests: 1, windowMs: 60_000 };
    const a = checkRateLimit(freshKey(), cfg);
    const b = checkRateLimit(freshKey(), cfg);
    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
  });
});
