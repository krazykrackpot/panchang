/**
 * Tests for /api/pandit/calendar — the month-validation logic.
 * We don't have an in-process Supabase, so this only exercises
 * the input-validation 400s. The query path is exercised by the
 * higher-level e2e smoke.
 *
 * Pandit CRM P11.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the auth helper to bypass JWT verification. We aren't testing
// the auth path here — only month parameter handling.
vi.mock('@/lib/pandit/auth', () => ({
  authenticatePandit: vi.fn(async () => ({
    ok: true,
    userId: 'test-user-id',
    user: { id: 'test-user-id', email: 'test@example.com' },
    supabase: {
      from: () => ({
        select: () => ({
          gte: () => ({
            lt: () => ({
              order: () => ({
                limit: async () => ({ data: [], error: null }),
              }),
            }),
          }),
        }),
      }),
    },
  })),
}));

import { GET } from '../route';

function makeReq(url: string): Request {
  return new Request(url, { headers: { authorization: 'Bearer test' } });
}

describe('GET /api/pandit/calendar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects missing month param', async () => {
    const res = await GET(makeReq('http://x/api/pandit/calendar'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid_month');
  });

  it('rejects malformed month string', async () => {
    for (const bad of ['2026', '2026-1', '2026-13', '202-06', '2026-00', 'abc-de']) {
      const res = await GET(makeReq(`http://x/api/pandit/calendar?month=${bad}`));
      expect(res.status, `expected 400 for "${bad}"`).toBe(400);
    }
  });

  it('rejects out-of-range year', async () => {
    for (const bad of ['1800-06', '2201-01']) {
      const res = await GET(makeReq(`http://x/api/pandit/calendar?month=${bad}`));
      expect(res.status).toBe(400);
    }
  });

  it('accepts valid YYYY-MM strings across the boundary', async () => {
    for (const good of ['2026-01', '2026-06', '2026-12', '1900-01', '2200-12']) {
      const res = await GET(makeReq(`http://x/api/pandit/calendar?month=${good}`));
      expect(res.status, `expected 200 for "${good}"`).toBe(200);
      const body = await res.json();
      expect(body.month).toBe(good);
      expect(Array.isArray(body.events)).toBe(true);
    }
  });
});
