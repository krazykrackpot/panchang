// @vitest-environment jsdom
/**
 * Tests for the `landingPage` override path in `trackUtmEvent` and the
 * way `trackPageEngagement` uses it. The override exists so SPA-fired
 * page_engagement beacons carry the route they're about, not whatever
 * `window.location.pathname` happens to be when the fetch flushes.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@vercel/analytics', () => ({
  track: vi.fn(),
}));

vi.mock('../utm', () => ({
  getUtmParams: () => ({
    sessionId: 'sess-1',
    utm_source: 'devto',
    utm_medium: 'article',
    utm_campaign: 'launch',
    landingPage: '/should-be-overridden',
    referrer: '',
  }),
  getReferrerContext: () => null,
}));

import { trackUtmEvent, trackPageEngagement } from '../analytics';

interface CapturedFetch {
  url: string;
  body: Record<string, unknown>;
}

let captured: CapturedFetch[] = [];
const originalFetch = globalThis.fetch;

beforeEach(() => {
  captured = [];
  globalThis.fetch = vi.fn(async (url: string, init?: RequestInit) => {
    captured.push({
      url,
      body: JSON.parse((init?.body as string) ?? '{}'),
    });
    return new Response(null, { status: 204 });
  }) as unknown as typeof fetch;

  // Anchor the "current" URL to /current so the test can detect the
  // difference between window.location.pathname and the override.
  Object.defineProperty(window, 'location', {
    value: { pathname: '/current', href: 'https://example.com/current' },
    writable: true,
  });
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('trackUtmEvent landingPage', () => {
  it('defaults to window.location.pathname when no override is passed', async () => {
    trackUtmEvent('checkout_started', { tier: 'pro' });
    // Microtask drain — fetch is fire-and-forget but synchronous to enqueue.
    await Promise.resolve();
    expect(captured).toHaveLength(1);
    expect(captured[0].url).toBe('/api/track-utm');
    expect(captured[0].body.landingPage).toBe('/current');
    expect(captured[0].body.event).toBe('checkout_started');
  });

  it('uses options.landingPage when provided, ignoring window.location.pathname', async () => {
    trackUtmEvent('page_engagement', { foo: 1 }, { landingPage: '/the-actual-route' });
    await Promise.resolve();
    expect(captured).toHaveLength(1);
    expect(captured[0].body.landingPage).toBe('/the-actual-route');
  });
});

describe('trackPageEngagement', () => {
  it('forwards params.route into trackUtmEvent as the landingPage override', async () => {
    trackPageEngagement({
      route: '/en/panchang',
      scrollMaxBucket: 75,
      dwellBucket: '30s-2m',
    });
    await Promise.resolve();
    expect(captured).toHaveLength(1);
    expect(captured[0].body).toMatchObject({
      event: 'page_engagement',
      landingPage: '/en/panchang',
      metadata: {
        route: '/en/panchang',
        scrollMaxBucket: 75,
        dwellBucket: '30s-2m',
      },
    });
    // Crucially: not '/current'.
    expect(captured[0].body.landingPage).not.toBe('/current');
  });
});
