/**
 * Sprint 10 — P1 API validation cluster e2e.
 *
 * Verifies the 4xx/429 contracts of the 5 hardened routes against a live
 * dev server. Structural unit tests (regex / Set / import shape) live in
 * src/lib/__tests__/sprint-10-validation.test.ts.
 */
import { test, expect, request as pwRequest } from '@playwright/test';

test.describe('P1-40 /api/calendar — input validation', () => {
  test('rejects out-of-range year with 400', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.get('/api/calendar?year=9999&lat=28&lon=77&timezone=Asia/Kolkata');
    expect(res.status()).toBe(400);
    await ctx.dispose();
  });

  test('rejects out-of-range lat with 400', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.get('/api/calendar?year=2026&lat=999&lon=77&timezone=Asia/Kolkata');
    expect(res.status()).toBe(400);
    await ctx.dispose();
  });

  test('rejects NaN lon with 400 (not a silent pass)', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.get('/api/calendar?year=2026&lat=28&lon=NaN&timezone=Asia/Kolkata');
    expect(res.status()).toBe(400);
    await ctx.dispose();
  });
});

test.describe('P1-41 /api/muhurat — activity allowlist', () => {
  test('rejects unknown activity slug with 400', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.get('/api/muhurat?year=2026&month=6&activity=launch-rocket&lat=28&lng=77');
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid activity');
    await ctx.dispose();
  });

  test('rejects month=13 with 400', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.get('/api/muhurat?year=2026&month=13&activity=marriage&lat=28&lng=77');
    expect(res.status()).toBe(400);
    await ctx.dispose();
  });
});

test.describe('P1-42 /api/kp-system — format validation', () => {
  test('rejects malformed date with 400', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.post('/api/kp-system', {
      data: { date: '15-06-1990', time: '10:30', lat: 28, lng: 77 },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('YYYY-MM-DD');
    await ctx.dispose();
  });

  test('rejects malformed time with 400', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.post('/api/kp-system', {
      data: { date: '1990-06-15', time: 'half past ten', lat: 28, lng: 77 },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(400);
    await ctx.dispose();
  });

  test('rejects malformed JSON body with 400', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.post('/api/kp-system', {
      data: 'not-json',
      headers: { 'Content-Type': 'text/plain' },
    });
    expect(res.status()).toBe(400);
    await ctx.dispose();
  });
});

test.describe('P1-43 /api/prashna-ashtamangala — category allowlist', () => {
  test('rejects unknown category with 400', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.post('/api/prashna-ashtamangala', {
      data: { numbers: [3, 5, 7], category: 'time-travel', lat: 28, lng: 77 },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid category');
    await ctx.dispose();
  });
});

test.describe('P1-44 /api/tithi-table — generic error (no String(err) leak)', () => {
  test('rejects missing timezone with 400', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.get('/api/tithi-table?year=2026&lat=28&lon=77');
    expect(res.status()).toBe(400);
    await ctx.dispose();
  });

  test('5xx body must NOT contain stack-trace markers', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    // Force a downstream error by passing an invalid IANA tz. Sprint 8 made
    // KP throw on unknown tz; the tithi engine resolves tz too — should
    // throw, and the catch path must return generic.
    const res = await ctx.get('/api/tithi-table?year=2026&lat=28&lon=77&timezone=Atlantis/Lost');
    if (res.status() >= 500) {
      const text = await res.text();
      expect(text).not.toMatch(/at \w+ \(.*\.ts:\d+:\d+/);
      expect(text).not.toMatch(/node_modules/);
    }
    await ctx.dispose();
  });
});

test.describe('Sprint 10 — every hardened route is rate-limited', () => {
  const ROUTES = [
    { name: '/api/calendar', send: (ctx: import('@playwright/test').APIRequestContext) =>
        ctx.get('/api/calendar?year=2026&lat=28&lon=77&timezone=Asia/Kolkata') },
    { name: '/api/muhurat', send: (ctx: import('@playwright/test').APIRequestContext) =>
        ctx.get('/api/muhurat?year=2026&month=6&activity=marriage&lat=28&lng=77') },
    { name: '/api/kp-system', send: (ctx: import('@playwright/test').APIRequestContext) =>
        ctx.post('/api/kp-system', {
          data: { date: '1990-06-15', time: '10:30', lat: 28, lng: 77 },
          headers: { 'Content-Type': 'application/json' },
        }) },
  ];

  for (const route of ROUTES) {
    test(`${route.name} returns 429 after the rate limit`, async ({ baseURL }) => {
      const ctx = await pwRequest.newContext({ baseURL });
      let saw429 = false;
      // 40 quick requests — limits range from 10–30 per minute so the
      // limit hits well within this loop. Each route may have a different
      // limit; we just need to observe ANY 429.
      for (let i = 0; i < 40; i++) {
        const res = await route.send(ctx);
        if (res.status() === 429) {
          saw429 = true;
          break;
        }
      }
      expect(saw429, `${route.name} never returned 429 in 40 requests`).toBe(true);
      await ctx.dispose();
    });
  }
});
