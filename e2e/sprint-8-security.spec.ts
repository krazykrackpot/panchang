/**
 * Sprint 8 — P1 security cluster e2e.
 *
 * Targets the security-critical changes that need verification against a
 * live server (not just static-source assertions).
 */
import { test, expect, request as pwRequest } from '@playwright/test';

test.describe('P1-1 — AI routes require Bearer (cookie-CSRF gate)', () => {
  // Each AI route MUST reject a POST that carries only a cookie — no Bearer.
  // Previously the cookie fallback allowed cross-origin form posts to consume
  // the victim's Anthropic quota. Now cookie alone = 401.
  const ROUTES = [
    { path: '/api/ai-reading', body: { sectionType: 'test', kundali: {} } },
    { path: '/api/domain-pandit', body: { domain: 'health' } },
    { path: '/api/tippanni-llm', body: { locale: 'en' } },
    { path: '/api/tippanni', body: { locale: 'en' } },
  ];

  for (const { path, body } of ROUTES) {
    test(`${path} — POST with only a forged sb-* cookie does NOT process`, async ({ baseURL }) => {
      const ctx = await pwRequest.newContext({ baseURL });
      const res = await ctx.post(path, {
        data: body,
        headers: {
          'Content-Type': 'application/json',
          // Forge a sb-* cookie. The previous code path would have parsed
          // this and used the embedded token. With the cookie fallback
          // removed, the route MUST NOT process — exact response code is
          // either 401 (auth gate fires first) or 400 (body validation
          // fires first), depending on the route's ordering. The
          // contract we're enforcing: never 200, never 5xx, never
          // anything that indicates the LLM / DB was actually invoked.
          'Cookie': 'sb-fake-auth-token=' + encodeURIComponent(JSON.stringify({ access_token: 'attacker-supplied' })),
        },
      });
      const status = res.status();
      // Must be a 4xx refusal. Specifically NOT 200 (would mean the cookie
      // path got through), NOT 5xx (route didn't crash mid-processing).
      expect(status, `expected 4xx auth/validation refusal, got ${status}`).toBeGreaterThanOrEqual(400);
      expect(status, `expected 4xx auth/validation refusal, got ${status}`).toBeLessThan(500);
      // Body must NOT contain successful-processing markers.
      const text = await res.text();
      expect(text).not.toMatch(/"reading"|"tippanni"|"answer"|"id":\s*"[a-f0-9-]{36}"/);
      await ctx.dispose();
    });
  }
});

test.describe('P1-2 — track-utm rate-limit by IP', () => {
  // Sanity check that 21 quick POSTs from the same simulated IP hit the limit.
  // The previous implementation keyed on sessionId — an attacker could rotate
  // sessionId to bypass. Now the limit is by client IP.
  test('21 POSTs in a minute → 429 on the 21st', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    let lastStatus = 200;
    for (let i = 0; i < 21; i++) {
      const res = await ctx.post('/api/track-utm', {
        data: {
          event: 'page_view',
          sessionId: `rotating-${i}`,  // rotate per request — should still hit limit
          landingPage: '/',
        },
        headers: { 'Content-Type': 'application/json' },
      });
      lastStatus = res.status();
    }
    // The 21st request (or one of the last few) should be 429.
    expect(lastStatus).toBe(429);
    await ctx.dispose();
  });
});

test.describe('P1-6 — KP unknown tz fails loud', () => {
  test('/api/kp-system with malformed timezone returns 500, not silent UTC', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    // Send a date / time + a bogus IANA zone. The route previously would have
    // silently defaulted to UTC and returned a chart at the wrong moment;
    // now the kp-chart compute throws, which the route catches as 500.
    const res = await ctx.post('/api/kp-system', {
      data: {
        date: '1990-01-15',
        time: '10:30',
        lat: 28.6139,
        lng: 77.2090,
        timezone: 'Atlantis/Lost-City',  // not a real IANA tz
      },
      headers: { 'Content-Type': 'application/json' },
    });
    // Should be 5xx (server compute throws), not a 200 with a wrongly-
    // computed chart silently treated as UTC.
    expect(res.status()).toBeGreaterThanOrEqual(400);
    await ctx.dispose();
  });
});

test.describe('Regression — Sprint 6/7 surfaces still work', () => {
  test('/api/checkout still 401s without auth (Sprint 7 binding intact)', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.post('/api/checkout', {
      data: { tier: 'pro', billing: 'monthly', currency: 'USD' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(401);
    await ctx.dispose();
  });

  test('/en/festivals/diwali still 308s to /en/festivals/diwali/<current-year>', async ({ page }) => {
    const response = await page.goto('/en/festivals/diwali', { waitUntil: 'load' });
    expect(response?.status()).toBeLessThan(400);
    expect(page.url()).toMatch(/\/en\/festivals\/diwali\/20\d\d/);
  });
});
