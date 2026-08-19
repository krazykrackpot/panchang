import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  gatherSummary,
  shouldRefreshBasket,
  median,
  type GscQueryFn,
  type GscResponse,
  type BasketQuery,
  type ClickBasket,
  type Summary,
} from '../gsc-health-monitor';

// The monitor issues at least 4 GSC calls per run in this order:
//   1. topline daily (dimensions=['date'])
//   2. canary daily (dimensions=['date'] + query filter)
//   3. IF basket refresh needed: basket seed (dimensions=['query'], 28d)
//   4. basket positions (dimensions=['query','date'], 14d)
//   5. page losses (dimensions=['page','date'], 14d)
// The test mock inspects the body to pick the right response, so the
// order of internal calls can be reshuffled without touching tests.

function makeMock(responses: {
  topline?: GscResponse;
  canary?: GscResponse;
  basketSeed?: GscResponse;
  basketPositions?: GscResponse;
  pages?: GscResponse;
}): { fn: GscQueryFn; calls: Array<Record<string, unknown>> } {
  const calls: Array<Record<string, unknown>> = [];
  const fn: GscQueryFn = vi.fn(async (body) => {
    calls.push(body);
    const dims = body.dimensions as string[];
    const hasQueryFilter = Array.isArray(body.dimensionFilterGroups)
      && (body.dimensionFilterGroups as Array<{ filters: Array<{ dimension: string }> }>)
        .some((g) => g.filters.some((f) => f.dimension === 'query'));

    if (dims.length === 1 && dims[0] === 'date' && !hasQueryFilter) return responses.topline ?? {};
    if (dims.length === 1 && dims[0] === 'date' && hasQueryFilter) return responses.canary ?? {};
    if (dims.length === 1 && dims[0] === 'query') return responses.basketSeed ?? {};
    if (dims.length === 2 && dims[0] === 'query' && dims[1] === 'date') return responses.basketPositions ?? {};
    if (dims.length === 2 && dims[0] === 'page' && dims[1] === 'date') return responses.pages ?? {};
    throw new Error(`Unexpected GSC call: ${JSON.stringify(body)}`);
  });
  return { fn, calls };
}

function ymd(offset: number, from: Date): string {
  const d = new Date(from);
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

// Build synthetic recent/prior daily rows for topline. Baseline expects
// ≥5 clicks and ≥100 imps to avoid noise-floor no-ops.
function healthyToplineRows(now: Date): GscResponse {
  const rows = [];
  for (let i = 9; i >= 1; i--) {
    rows.push({
      keys: [ymd(i, now)],
      clicks: 20,
      impressions: 500,
      ctr: 0.04,
      position: 12,
    });
  }
  return { rows };
}

function healthyCanaryRows(now: Date): GscResponse {
  const rows = [];
  for (let i = 9; i >= 1; i--) {
    rows.push({
      keys: [ymd(i, now)],
      clicks: 3,
      impressions: 200,
      ctr: 0.015,
      position: 8,
    });
  }
  return { rows };
}

// Reference basket used by rule-5 tests. Includes 5 winners so we can
// slip 0/1/2/3 of them independently.
const BASKET_WINNERS = ['aaj ka panchang', 'today panchang', 'tithi today', 'nakshatra today', 'aaj tithi'];
const BASKET_NON_WINNERS = ['bhrigu bindu meaning', 'pratyantar dasha chart']; // prior pos >20

function basketSeed(): GscResponse {
  return {
    rows: [
      ...BASKET_WINNERS.map((q) => ({ keys: [q], clicks: 30, impressions: 500, ctr: 0.06, position: 8 })),
      ...BASKET_NON_WINNERS.map((q) => ({ keys: [q], clicks: 5, impressions: 200, ctr: 0.025, position: 40 })),
    ],
  };
}

// Build query+date rows where the first `slipCount` winners each slip
// from priorPos=7 to recentPos=15 (delta 8, >= threshold 5). Remaining
// winners hold at priorPos=7 / recentPos=7. Non-winners always slip so
// we verify rule 5 filters them out.
function basketPositions(now: Date, slipCount: number): GscResponse {
  const rows: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> = [];
  const recentEnd = ymd(1, now);
  const recentStart = ymd(7, now);
  const priorEnd = ymd(8, now);
  const priorStart = ymd(14, now);

  BASKET_WINNERS.forEach((q, idx) => {
    const slips = idx < slipCount;
    const recentPos = slips ? 15 : 7;
    const priorPos = 7;
    rows.push({ keys: [q, recentStart], clicks: 3, impressions: 50, ctr: 0.06, position: recentPos });
    rows.push({ keys: [q, recentEnd], clicks: 3, impressions: 50, ctr: 0.06, position: recentPos });
    rows.push({ keys: [q, priorStart], clicks: 4, impressions: 50, ctr: 0.08, position: priorPos });
    rows.push({ keys: [q, priorEnd], clicks: 4, impressions: 50, ctr: 0.08, position: priorPos });
  });
  BASKET_NON_WINNERS.forEach((q) => {
    rows.push({ keys: [q, recentStart], clicks: 0, impressions: 50, ctr: 0, position: 65 });
    rows.push({ keys: [q, recentEnd], clicks: 0, impressions: 50, ctr: 0, position: 65 });
    rows.push({ keys: [q, priorStart], clicks: 0, impressions: 50, ctr: 0, position: 40 });
    rows.push({ keys: [q, priorEnd], clicks: 0, impressions: 50, ctr: 0, position: 40 });
  });
  return { rows };
}

function emptyPages(): GscResponse { return { rows: [] }; }

// ─────────────────────────────────────────────────────────────────────
// Basket refresh scheduling
// ─────────────────────────────────────────────────────────────────────

describe('shouldRefreshBasket', () => {
  it('returns true when no prior basket', () => {
    expect(shouldRefreshBasket(null, '2026-08-19')).toBe(true);
  });
  it('returns true when prior basket is >7 days old', () => {
    const prior: ClickBasket = { refreshedAt: '2026-08-11', windowDays: 28, queries: [] };
    expect(shouldRefreshBasket(prior, '2026-08-19')).toBe(true);
  });
  it('returns false when prior basket is 6 days old', () => {
    const prior: ClickBasket = { refreshedAt: '2026-08-13', windowDays: 28, queries: [] };
    expect(shouldRefreshBasket(prior, '2026-08-19')).toBe(false);
  });
  it('force flag overrides freshness', () => {
    const prior: ClickBasket = { refreshedAt: '2026-08-18', windowDays: 28, queries: [] };
    expect(shouldRefreshBasket(prior, '2026-08-19', true)).toBe(true);
  });
});

describe('gatherSummary basket refresh integration', () => {
  const now = new Date('2026-08-19T09:00:00Z');

  it('does NOT hit the basket-seed endpoint when prior basket is fresh', async () => {
    const priorBasket: ClickBasket = {
      refreshedAt: ymd(3, now),
      windowDays: 28,
      queries: BASKET_WINNERS.map((q) => ({
        query: q, clicks28d: 30, priorPos: 7, recentPos: 7, posDelta: 0,
        priorClicks7d: 4, recentClicks7d: 3,
      })),
    };
    const mock = makeMock({
      topline: healthyToplineRows(now),
      canary: healthyCanaryRows(now),
      basketPositions: basketPositions(now, 0),
      pages: emptyPages(),
    });
    const summary = await gatherSummary({ now, gscQuery: mock.fn, priorBasket });
    expect(summary.clickBasket.refreshedAt).toBe(priorBasket.refreshedAt);
    const basketSeedCalls = mock.calls.filter((c) => {
      const dims = c.dimensions as string[];
      return dims.length === 1 && dims[0] === 'query';
    });
    expect(basketSeedCalls).toHaveLength(0);
  });

  it('DOES hit the basket-seed endpoint when prior basket is stale', async () => {
    const priorBasket: ClickBasket = {
      refreshedAt: ymd(10, now),
      windowDays: 28,
      queries: [],
    };
    const mock = makeMock({
      topline: healthyToplineRows(now),
      canary: healthyCanaryRows(now),
      basketSeed: basketSeed(),
      basketPositions: basketPositions(now, 0),
      pages: emptyPages(),
    });
    const summary = await gatherSummary({ now, gscQuery: mock.fn, priorBasket });
    expect(summary.clickBasket.refreshedAt).toBe(ymd(0, now));
    const basketSeedCalls = mock.calls.filter((c) => {
      const dims = c.dimensions as string[];
      return dims.length === 1 && dims[0] === 'query';
    });
    expect(basketSeedCalls).toHaveLength(1);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Rule 5: click-basket rank slip
// ─────────────────────────────────────────────────────────────────────

describe('Rule 5: click-basket rank slip', () => {
  const now = new Date('2026-08-19T09:00:00Z');
  const freshBasket: ClickBasket = {
    refreshedAt: ymd(3, now),
    windowDays: 28,
    queries: BASKET_WINNERS.map((q) => ({
      query: q, clicks28d: 30, priorPos: 7, recentPos: 7, posDelta: 0,
      priorClicks7d: 4, recentClicks7d: 3,
    })),
  };

  it('fires when 3 winners slip ≥5 ranks (prior pos <20)', async () => {
    const mock = makeMock({
      topline: healthyToplineRows(now),
      canary: healthyCanaryRows(now),
      basketPositions: basketPositions(now, 3),
      pages: emptyPages(),
    });
    const s = await gatherSummary({ now, gscQuery: mock.fn, priorBasket: freshBasket });
    const rule5 = s.alerts.find((a) => a.startsWith('Basket rank slip'));
    expect(rule5).toBeDefined();
    expect(rule5).toContain('3 winners');
  });

  it('does NOT fire when only 2 winners slip', async () => {
    const mock = makeMock({
      topline: healthyToplineRows(now),
      canary: healthyCanaryRows(now),
      basketPositions: basketPositions(now, 2),
      pages: emptyPages(),
    });
    const s = await gatherSummary({ now, gscQuery: mock.fn, priorBasket: freshBasket });
    expect(s.alerts.find((a) => a.startsWith('Basket rank slip'))).toBeUndefined();
  });

  it('does NOT fire when non-winners (prior pos ≥20) slip', async () => {
    // Basket contains only non-winners (all prior pos ≥ 20). Even if they
    // all slip by 25 ranks, rule 5 must ignore them.
    const nonWinnerBasket: ClickBasket = {
      refreshedAt: ymd(3, now),
      windowDays: 28,
      queries: BASKET_NON_WINNERS.map((q) => ({
        query: q, clicks28d: 5, priorPos: 40, recentPos: 40, posDelta: 0,
        priorClicks7d: 0, recentClicks7d: 0,
      })),
    };
    const mock = makeMock({
      topline: healthyToplineRows(now),
      canary: healthyCanaryRows(now),
      basketPositions: basketPositions(now, 0),
      pages: emptyPages(),
    });
    const s = await gatherSummary({ now, gscQuery: mock.fn, priorBasket: nonWinnerBasket });
    expect(s.alerts.find((a) => a.startsWith('Basket rank slip'))).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────
// Rule 6: page-level impression collapse
// ─────────────────────────────────────────────────────────────────────

describe('Rule 6: page-level impression collapse', () => {
  const now = new Date('2026-08-19T09:00:00Z');
  const freshBasket: ClickBasket = {
    refreshedAt: ymd(3, now), windowDays: 28,
    queries: BASKET_WINNERS.map((q) => ({
      query: q, clicks28d: 30, priorPos: 7, recentPos: 7, posDelta: 0,
      priorClicks7d: 4, recentClicks7d: 3,
    })),
  };

  function pageRows(entries: Array<{ page: string; recent: number; prior: number }>): GscResponse {
    const rows = [];
    const recentEnd = ymd(1, now);
    const priorEnd = ymd(8, now);
    for (const e of entries) {
      rows.push({ keys: [e.page, recentEnd], clicks: 0, impressions: e.recent, ctr: 0, position: 15 });
      rows.push({ keys: [e.page, priorEnd], clicks: 0, impressions: e.prior, ctr: 0, position: 15 });
    }
    return { rows };
  }

  it('fires on page with ≥100 prior imps dropped >70%', async () => {
    const mock = makeMock({
      topline: healthyToplineRows(now),
      canary: healthyCanaryRows(now),
      basketPositions: basketPositions(now, 0),
      pages: pageRows([{ page: '/kn/hindu-calendar/2027', recent: 25, prior: 140 }]),
    });
    const s = await gatherSummary({ now, gscQuery: mock.fn, priorBasket: freshBasket });
    const alert = s.alerts.find((a) => a.startsWith('Page '));
    expect(alert).toBeDefined();
    expect(alert).toContain('/kn/hindu-calendar/2027');
    expect(s.pageLosses).toHaveLength(1);
    expect(s.pageLosses[0].dropPct).toBe(82);
  });

  it('does NOT fire on page with <100 prior imps even if drop >70%', async () => {
    const mock = makeMock({
      topline: healthyToplineRows(now),
      canary: healthyCanaryRows(now),
      basketPositions: basketPositions(now, 0),
      pages: pageRows([{ page: '/en/some-small-page', recent: 5, prior: 80 }]),
    });
    const s = await gatherSummary({ now, gscQuery: mock.fn, priorBasket: freshBasket });
    expect(s.alerts.find((a) => a.startsWith('Page '))).toBeUndefined();
    expect(s.pageLosses).toHaveLength(0);
  });

  it('does NOT fire when drop is exactly 70% (threshold is >70%)', async () => {
    const mock = makeMock({
      topline: healthyToplineRows(now),
      canary: healthyCanaryRows(now),
      basketPositions: basketPositions(now, 0),
      pages: pageRows([{ page: '/en/borderline', recent: 30, prior: 100 }]),
    });
    const s = await gatherSummary({ now, gscQuery: mock.fn, priorBasket: freshBasket });
    expect(s.alerts.find((a) => a.startsWith('Page '))).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────
// Regression: preserved rules 1/2/3
// ─────────────────────────────────────────────────────────────────────

describe('Preserved rules regression', () => {
  const now = new Date('2026-08-19T09:00:00Z');
  const freshBasket: ClickBasket = {
    refreshedAt: ymd(3, now), windowDays: 28,
    queries: BASKET_WINNERS.map((q) => ({
      query: q, clicks28d: 30, priorPos: 7, recentPos: 7, posDelta: 0,
      priorClicks7d: 4, recentClicks7d: 3,
    })),
  };

  function toplineWith(latestClicks: number, latestImps: number): GscResponse {
    const rows = [];
    for (let i = 9; i >= 1; i--) {
      const isLatest = i === 1;
      rows.push({
        keys: [ymd(i, now)],
        clicks: isLatest ? latestClicks : 20,
        impressions: isLatest ? latestImps : 500,
        ctr: 0.04,
        position: 12,
      });
    }
    return { rows };
  }

  function canaryWith(latestImps: number): GscResponse {
    const rows = [];
    for (let i = 9; i >= 1; i--) {
      const isLatest = i === 1;
      rows.push({
        keys: [ymd(i, now)],
        clicks: 3,
        impressions: isLatest ? latestImps : 200,
        ctr: 0.015,
        position: 8,
      });
    }
    return { rows };
  }

  it('Rule 1: fires when yesterday clicks <30% of 7d median', async () => {
    const mock = makeMock({
      topline: toplineWith(4, 500),
      canary: healthyCanaryRows(now),
      basketPositions: basketPositions(now, 0),
      pages: emptyPages(),
    });
    const s = await gatherSummary({ now, gscQuery: mock.fn, priorBasket: freshBasket });
    expect(s.alerts.find((a) => a.startsWith('Clicks -'))).toBeDefined();
  });

  it('Rule 1: does NOT fire on healthy click volume', async () => {
    const mock = makeMock({
      topline: toplineWith(19, 500),
      canary: healthyCanaryRows(now),
      basketPositions: basketPositions(now, 0),
      pages: emptyPages(),
    });
    const s = await gatherSummary({ now, gscQuery: mock.fn, priorBasket: freshBasket });
    expect(s.alerts.find((a) => a.startsWith('Clicks -'))).toBeUndefined();
  });

  it('Rule 2: fires when yesterday imps <30% of 7d median', async () => {
    const mock = makeMock({
      topline: toplineWith(20, 100),
      canary: healthyCanaryRows(now),
      basketPositions: basketPositions(now, 0),
      pages: emptyPages(),
    });
    const s = await gatherSummary({ now, gscQuery: mock.fn, priorBasket: freshBasket });
    expect(s.alerts.find((a) => a.startsWith('Impressions -'))).toBeDefined();
  });

  it('Rule 3: fires when canary imps drop >70%', async () => {
    const mock = makeMock({
      topline: healthyToplineRows(now),
      canary: canaryWith(30),
      basketPositions: basketPositions(now, 0),
      pages: emptyPages(),
    });
    const s = await gatherSummary({ now, gscQuery: mock.fn, priorBasket: freshBasket });
    expect(s.alerts.find((a) => a.includes('bangla calendar') && a.includes('imps -'))).toBeDefined();
  });

  it('Rule 3: does NOT fire on healthy canary volume', async () => {
    const mock = makeMock({
      topline: healthyToplineRows(now),
      canary: healthyCanaryRows(now),
      basketPositions: basketPositions(now, 0),
      pages: emptyPages(),
    });
    const s = await gatherSummary({ now, gscQuery: mock.fn, priorBasket: freshBasket });
    expect(s.alerts.find((a) => a.includes('bangla calendar'))).toBeUndefined();
  });

  it('Rule 4 (CANARY_POS_DROP) is removed — no position alert even on huge slip', async () => {
    const canary = healthyCanaryRows(now);
    // Slip the "latest" canary day's position hard (8 → 40).
    canary.rows![canary.rows!.length - 1].position = 40;
    const mock = makeMock({
      topline: healthyToplineRows(now),
      canary,
      basketPositions: basketPositions(now, 0),
      pages: emptyPages(),
    });
    const s = await gatherSummary({ now, gscQuery: mock.fn, priorBasket: freshBasket });
    expect(s.alerts.find((a) => a.includes('bangla calendar') && a.includes('position'))).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────
// Schema roundtrip
// ─────────────────────────────────────────────────────────────────────

describe('Schema roundtrip', () => {
  const now = new Date('2026-08-19T09:00:00Z');

  it('Summary survives JSON round-trip without loss (all new fields preserved)', async () => {
    const priorBasket: ClickBasket = {
      refreshedAt: ymd(3, now), windowDays: 28,
      queries: BASKET_WINNERS.map((q) => ({
        query: q, clicks28d: 30, priorPos: 7, recentPos: 7, posDelta: 0,
        priorClicks7d: 4, recentClicks7d: 3,
      })),
    };
    const mock = makeMock({
      topline: healthyToplineRows(now),
      canary: healthyCanaryRows(now),
      basketPositions: (() => {
        const r = { rows: [] as Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> };
        const recentEnd = ymd(1, now);
        const priorEnd = ymd(8, now);
        r.rows.push({ keys: ['aaj ka panchang', recentEnd], clicks: 3, impressions: 50, ctr: 0.06, position: 8.9 });
        r.rows.push({ keys: ['aaj ka panchang', priorEnd], clicks: 4, impressions: 50, ctr: 0.08, position: 6.4 });
        return r;
      })(),
      pages: (() => {
        const r = { rows: [] as Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> };
        const recentEnd = ymd(1, now);
        const priorEnd = ymd(8, now);
        r.rows.push({ keys: ['/kn/hindu-calendar/2027', recentEnd], clicks: 0, impressions: 25, ctr: 0, position: 30 });
        r.rows.push({ keys: ['/kn/hindu-calendar/2027', priorEnd], clicks: 0, impressions: 140, ctr: 0, position: 30 });
        return r;
      })(),
    });
    const summary = await gatherSummary({ now, gscQuery: mock.fn, priorBasket });

    const json = JSON.stringify(summary);
    const parsed = JSON.parse(json) as Summary;

    expect(parsed.ranAt).toBe(summary.ranAt);
    expect(parsed.range).toEqual(summary.range);
    expect(parsed.baseline).toEqual(summary.baseline);
    expect(parsed.clickBasket.refreshedAt).toBe(summary.clickBasket.refreshedAt);
    expect(parsed.clickBasket.windowDays).toBe(28);
    expect(parsed.clickBasket.queries).toHaveLength(summary.clickBasket.queries.length);
    const aaj = parsed.clickBasket.queries.find((q: BasketQuery) => q.query === 'aaj ka panchang');
    expect(aaj).toBeDefined();
    expect(aaj?.clicks28d).toBe(30);
    expect(aaj?.priorPos).toBeCloseTo(6.4, 5);
    expect(aaj?.recentPos).toBeCloseTo(8.9, 5);
    expect(aaj?.posDelta).toBeCloseTo(2.5, 5);
    expect(parsed.pageLosses).toEqual(summary.pageLosses);
    expect(parsed.pageLosses[0].page).toBe('/kn/hindu-calendar/2027');
    expect(parsed.pageLosses[0].dropPct).toBe(82);
  });
});

// ─────────────────────────────────────────────────────────────────────
// median() sanity check (used broadly, easy to regress)
// ─────────────────────────────────────────────────────────────────────

describe('median', () => {
  it('handles empty', () => expect(median([])).toBe(0));
  it('handles odd length', () => expect(median([3, 1, 2])).toBe(2));
  it('handles even length', () => expect(median([1, 2, 3, 4])).toBe(2.5));
});
