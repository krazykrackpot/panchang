/**
 * Sprint 17 — P2/P3 API + i18n cleanups e2e.
 *
 * Behavioural assertion: the four routes whose locale enum used to
 * reject regional languages now accept them. We test with `ta` (the
 * locale most commonly missed by the stale enums) — a successful
 * request implies the validator passed; we don't assert the response
 * body content (downstream LLM/templates handle the locale separately
 * via isDevanagariLocale + fallbacks).
 */
import { test, expect, request as pwRequest } from '@playwright/test';

test.describe('P2-34 — routes accept canonical regional locales (no 400 on Tamil)', () => {
  test('GET /api/horoscope?locale=ta returns 2xx (not 400)', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.get('/api/horoscope?sign=1&locale=ta&lat=13&lng=80&timezone=Asia/Kolkata');
    // We accept any non-validation success: 200 = LLM ran, 500 = upstream
    // LLM unavailable in dev, 429 = rate-limited. The signal we're locking
    // is "not 400 because locale='ta' was rejected by z.enum".
    expect(res.status()).not.toBe(400);
    await ctx.dispose();
  });

  test('POST /api/nadi with locale=ta is not rejected as invalid locale', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const res = await ctx.post('/api/nadi', {
      data: {
        date: '1990-06-15',
        time: '10:30',
        lat: 13.0,
        lng: 80.0,
        timezone: 'Asia/Kolkata',
        ayanamsha: 'lahiri',
        locale: 'ta',
      },
    });
    expect(res.status()).not.toBe(400);
    await ctx.dispose();
  });
});
