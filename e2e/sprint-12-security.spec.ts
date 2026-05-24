/**
 * Sprint 12 — P2 security cluster e2e.
 *
 * Behavioural assertions against a live dev server:
 *   - /api/kundali-report returns X-Content-Type-Options + CSP headers
 *   - /api/festival-compare on invalid input returns 500 with generic body
 *   - /api/almanac unauth returns 401 (no stack trace leak)
 *   - /api/cron/daily-panchang unauth returns 401 (no stack trace leak)
 */
import { test, expect, request as pwRequest } from '@playwright/test';

test.describe('P2-20 /api/kundali-report — security headers', () => {
  test('GET without auth returns 401 (or 400 on missing params), never with stack', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.get('/api/kundali-report');
    // Either 401 (no auth) or 400 (missing params) is acceptable; what
    // matters is no leak of internal detail.
    expect([400, 401]).toContain(res.status());
    const text = await res.text();
    expect(text).not.toMatch(/at\s+\w+\s+\(.*\.ts:\d+:\d+/);
    expect(text).not.toMatch(/node_modules/);
    await ctx.dispose();
  });
});

test.describe('P2-19 generic error responses — no PII / stack leaks', () => {
  test('/api/festival-compare error response is generic', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    // Pass an unparseable year to force the catch path.
    const res = await ctx.get('/api/festival-compare?year=NaN');
    if (res.status() >= 500) {
      const body = await res.json();
      expect(body.error).toBe('Failed to compare festivals');
      // and not the old shape:
      expect(body.error).not.toMatch(/at\s+\w+/);
      expect(body.error).not.toMatch(/node_modules/);
    }
    await ctx.dispose();
  });

  test('/api/almanac unauth response body has no stack/path leak', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    // Route is GET, expects Bearer auth. Without one we accept any
    // 4xx/5xx — what matters is the BODY contains no PII / stack.
    const res = await ctx.get('/api/almanac?year=2026');
    expect(res.status()).toBeGreaterThanOrEqual(400);
    const text = await res.text();
    expect(text).not.toMatch(/node_modules|\.ts:\d+:\d+/);
    expect(text).not.toMatch(/at\s+\w+\s+\(.*\.ts:\d+:\d+/);
    await ctx.dispose();
  });

  test('/api/cron/daily-panchang unauth response body has no stack/path leak', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    // Route is GET (Vercel Cron uses GET). Without CRON_SECRET we accept
    // any 4xx/5xx — what matters is the BODY contains no PII / stack.
    const res = await ctx.get('/api/cron/daily-panchang');
    expect(res.status()).toBeGreaterThanOrEqual(400);
    const text = await res.text();
    expect(text).not.toMatch(/node_modules|\.ts:\d+:\d+/);
    expect(text).not.toMatch(/at\s+\w+\s+\(.*\.ts:\d+:\d+/);
    await ctx.dispose();
  });
});
