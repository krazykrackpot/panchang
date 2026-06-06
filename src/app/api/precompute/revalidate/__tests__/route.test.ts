/**
 * Unit tests for /api/precompute/revalidate.
 *
 * Locks the security contract:
 *   - Refuses to default when PRECOMPUTE_REVALIDATE_SECRET is unset
 *   - Constant-time bearer check rejects wrong secrets
 *   - Wrong length secret is rejected (no early-return timing leak)
 *   - Rate limit caps the cron — even authenticated callers
 *   - Malformed body returns 400 (with [tag] logged per Lesson AA)
 *   - Successful body returns the count of revalidated entries
 *   - Partial failure returns 207 with the failed list
 *   - Empty body is a valid no-op (smoke test path)
 *
 * Next 16 cache APIs (updateTag, revalidatePath) are mocked. We can't
 * actually flip an edge cache from vitest, and the test is about the
 * route contract, not the cache mechanism.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const cacheMock = vi.hoisted(() => ({
  updateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));
vi.mock('next/cache', () => cacheMock);

// Mock the rate limiter too — we want to test the route's response to
// allowed/blocked states, not the limiter's own logic.
const rateLimitMock = vi.hoisted(() => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 29 })),
  getClientIP: vi.fn(() => '127.0.0.1'),
}));
vi.mock('@/lib/api/rate-limit', () => rateLimitMock);

import { POST } from '@/app/api/precompute/revalidate/route';

const SECRET = 'super-secret-test-token-with-enough-entropy';

function makeRequest(opts: {
  body?: unknown;
  bearer?: string | null;
  bodyOverride?: BodyInit;
}) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (opts.bearer !== null) headers.authorization = `Bearer ${opts.bearer ?? SECRET}`;
  const body = opts.bodyOverride ?? (opts.body !== undefined ? JSON.stringify(opts.body) : '{}');
  return new Request('https://example.com/api/precompute/revalidate', {
    method: 'POST',
    headers,
    body,
  }) as unknown as Parameters<typeof POST>[0];
}

describe('POST /api/precompute/revalidate', () => {
  beforeEach(() => {
    cacheMock.updateTag.mockReset();
    cacheMock.revalidatePath.mockReset();
    rateLimitMock.checkRateLimit.mockReturnValue({ allowed: true, remaining: 29 });
    process.env.PRECOMPUTE_REVALIDATE_SECRET = SECRET;
  });

  it('returns 500 when PRECOMPUTE_REVALIDATE_SECRET is unset', async () => {
    delete process.env.PRECOMPUTE_REVALIDATE_SECRET;
    const res = await POST(makeRequest({ body: { tags: ['x'] } }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/misconfigured/);
  });

  it('returns 401 on missing Authorization header', async () => {
    const res = await POST(makeRequest({ body: { tags: ['x'] }, bearer: null }));
    expect(res.status).toBe(401);
  });

  it('returns 401 on wrong secret (same length)', async () => {
    const wrong = 'X'.repeat(SECRET.length); // same length, wrong content
    const res = await POST(makeRequest({ body: { tags: ['x'] }, bearer: wrong }));
    expect(res.status).toBe(401);
    expect(cacheMock.updateTag).not.toHaveBeenCalled();
  });

  it('returns 401 on wrong-length secret without crashing on timingSafeEqual', async () => {
    const res = await POST(makeRequest({ body: { tags: ['x'] }, bearer: 'short' }));
    expect(res.status).toBe(401);
  });

  it('returns 429 when rate limit is blown', async () => {
    rateLimitMock.checkRateLimit.mockReturnValue({ allowed: false, remaining: 0 });
    const res = await POST(makeRequest({ body: { tags: ['x'] } }));
    expect(res.status).toBe(429);
  });

  it('returns 400 on malformed JSON body', async () => {
    const res = await POST(makeRequest({ bodyOverride: 'not json{{{' }));
    expect(res.status).toBe(400);
  });

  it('returns 200 + counts on successful revalidation', async () => {
    const res = await POST(
      makeRequest({
        body: {
          tags: ['precompute:choghadiya/2026-06-07/delhi', 'precompute:choghadiya/2026-06-07/mumbai'],
          paths: ['/en/choghadiya/2026-06-07'],
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(cacheMock.updateTag).toHaveBeenCalledTimes(2);
    expect(cacheMock.revalidatePath).toHaveBeenCalledTimes(1);
    expect(cacheMock.revalidatePath).toHaveBeenCalledWith('/en/choghadiya/2026-06-07', 'page');

    const body = await res.json();
    expect(body.revalidated.tags).toBe(2);
    expect(body.revalidated.paths).toBe(1);
    expect(body.failed).toBeUndefined();
  });

  it('returns 207 partial when some entries fail', async () => {
    cacheMock.updateTag.mockImplementationOnce(() => {
      throw new Error('cache infrastructure flake');
    });

    const res = await POST(
      makeRequest({
        body: {
          tags: ['will-fail', 'will-succeed'],
        },
      }),
    );
    expect(res.status).toBe(207);
    const body = await res.json();
    expect(body.revalidated.tags).toBe(1);
    expect(body.failed.tags).toEqual(['will-fail']);
  });

  it('empty body is a valid no-op (smoke-test entrypoint)', async () => {
    const res = await POST(makeRequest({ body: {} }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.revalidated).toEqual({ tags: 0, paths: 0 });
    expect(cacheMock.updateTag).not.toHaveBeenCalled();
    expect(cacheMock.revalidatePath).not.toHaveBeenCalled();
  });

  it('ignores non-string entries in tags/paths arrays defensively', async () => {
    const res = await POST(
      makeRequest({
        body: {
          tags: ['real-tag', 123, null, { nested: 'object' }],
          paths: ['/en/real-path', undefined, false],
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(cacheMock.updateTag).toHaveBeenCalledTimes(1); // only 'real-tag'
    expect(cacheMock.revalidatePath).toHaveBeenCalledTimes(1); // only '/en/real-path'
  });
});
