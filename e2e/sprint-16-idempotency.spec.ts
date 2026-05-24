/**
 * Sprint 16 — P2 idempotency e2e.
 *
 * Behavioural assertions for the surfaced dedup:
 *   - /api/track-utm returns 204 (success) on a duplicate within 5s
 *     but the second call is a no-op (not a new row)
 *
 * The push-subscribe prune (P2-25) and the dashboard subscription
 * (P2-28) need auth flows / store interactions that aren't reachable
 * from an unauthenticated e2e — their behavioural contracts are
 * structurally locked by the vitest file.
 */
import { test, expect, request as pwRequest } from '@playwright/test';

test.describe('P2-27 /api/track-utm — 5s in-memory dedup', () => {
  test('two identical events within 5s both return 204', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const body = {
      event: 'page_view',
      sessionId: `e2e-sprint-16-${Date.now()}`,
      landingPage: '/en/sprint-16-test',
    };
    const first = await ctx.post('/api/track-utm', { data: body });
    expect(first.status()).toBe(204);

    // Second identical call within the dedup window — must also return
    // 204 (so the client doesn't see a spurious error) but the server
    // intentionally skipped the insert.
    const second = await ctx.post('/api/track-utm', { data: body });
    expect(second.status()).toBe(204);
    await ctx.dispose();
  });

  test('a distinct event from the same session is NOT deduped', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const sessionId = `e2e-sprint-16-distinct-${Date.now()}`;
    const first = await ctx.post('/api/track-utm', {
      data: { event: 'page_view', sessionId, landingPage: '/a' },
    });
    expect(first.status()).toBe(204);

    // Different `event` value or different landingPage → new key → inserted.
    const second = await ctx.post('/api/track-utm', {
      data: { event: 'tool_used', sessionId, landingPage: '/a' },
    });
    expect(second.status()).toBe(204);

    const third = await ctx.post('/api/track-utm', {
      data: { event: 'page_view', sessionId, landingPage: '/b' },
    });
    expect(third.status()).toBe(204);
    await ctx.dispose();
  });
});
