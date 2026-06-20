import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { snapshotMtdCost, summarizeCost } from '../cost-rollup';

// Minimal Supabase mock that returns a fixed result for the
// .from(...).select(...).gte(...) chain used by snapshotMtdCost.
function mockSupabase(rows: Array<{ cost_micros: number; status: string }> | null, err: Error | null = null) {
  const chain = {
    select: vi.fn(() => chain),
    gte: vi.fn(() => Promise.resolve({ data: rows, error: err })),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { from: vi.fn(() => chain) } as any;
}

const ORIG_BUDGET = process.env.WHATSAPP_MONTHLY_BUDGET_USD;
beforeEach(() => {
  process.env.WHATSAPP_MONTHLY_BUDGET_USD = '25';
});
afterEach(() => {
  if (ORIG_BUDGET === undefined) delete process.env.WHATSAPP_MONTHLY_BUDGET_USD;
  else process.env.WHATSAPP_MONTHLY_BUDGET_USD = ORIG_BUDGET;
});

describe('snapshotMtdCost', () => {
  it('returns zeros when no rows', async () => {
    const sb = mockSupabase([]);
    const s = await snapshotMtdCost(sb);
    expect(s.mtdUsd).toBe(0);
    expect(s.messages).toBe(0);
    expect(s.skippedBudget).toBe(0);
    expect(s.alertLevel).toBe('none');
    expect(s.budgetUsd).toBe(25);
  });

  it('sums cost_micros into USD', async () => {
    // 5 messages at 14_000 micros (India utility) = 70_000 micros = $0.07
    const sb = mockSupabase(
      Array(5).fill({ cost_micros: 14_000, status: 'sent' }),
    );
    const s = await snapshotMtdCost(sb);
    expect(s.mtdUsd).toBeCloseTo(0.07, 6);
    expect(s.messages).toBe(5);
    expect(s.fraction).toBeCloseTo(0.07 / 25, 6);
    expect(s.alertLevel).toBe('none');
  });

  it('classifies warn-80 between 80% and 100% of cap', async () => {
    // 1429 messages × 14000 = 20,006,000 micros = $20.006 — just over 80%
    const sb = mockSupabase(
      Array(1429).fill({ cost_micros: 14_000, status: 'sent' }),
    );
    const s = await snapshotMtdCost(sb);
    expect(s.alertLevel).toBe('warn-80');
    expect(s.fraction).toBeGreaterThanOrEqual(0.8);
    expect(s.fraction).toBeLessThan(1.0);
  });

  it('classifies cap-100 at or above cap', async () => {
    // 1786 messages × 14000 = 25,004,000 micros = $25.004 — over cap
    const sb = mockSupabase(
      Array(1786).fill({ cost_micros: 14_000, status: 'sent' }),
    );
    const s = await snapshotMtdCost(sb);
    expect(s.alertLevel).toBe('cap-100');
    expect(s.fraction).toBeGreaterThanOrEqual(1.0);
  });

  it('excludes skipped_budget rows from cost but counts them separately', async () => {
    const sb = mockSupabase([
      ...Array(10).fill({ cost_micros: 14_000, status: 'sent' }),
      ...Array(3).fill({ cost_micros: 0, status: 'skipped_budget' }),
      { cost_micros: 0, status: 'skipped_paused' },
    ]);
    const s = await snapshotMtdCost(sb);
    expect(s.messages).toBe(10);
    expect(s.skippedBudget).toBe(3);
    expect(s.mtdUsd).toBeCloseTo(0.14, 6);
  });

  it('returns zeros on query error', async () => {
    const sb = mockSupabase(null, new Error('boom'));
    const s = await snapshotMtdCost(sb);
    expect(s.mtdUsd).toBe(0);
    expect(s.alertLevel).toBe('none');
  });
});

describe('summarizeCost', () => {
  it('formats a typical snapshot', () => {
    expect(
      summarizeCost({
        mtdUsd: 12.34, budgetUsd: 25, fraction: 12.34 / 25,
        alertLevel: 'warn-80', messages: 882, skippedBudget: 0,
      }),
    ).toBe('MTD WhatsApp cost: $12.34 of $25.00 (49.4%), 882 messages');
  });

  it('appends "skipped" count when > 0', () => {
    expect(
      summarizeCost({
        mtdUsd: 25.0, budgetUsd: 25, fraction: 1.0,
        alertLevel: 'cap-100', messages: 1786, skippedBudget: 17,
      }),
    ).toContain('17 skipped');
  });
});
