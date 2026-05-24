/**
 * Tests for the credit + subscription manager.
 *
 * Uses an in-memory fake of the Supabase-like interface so we don't
 * touch real DB. Each test rebuilds the fake from scratch.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  getBalance,
  consumeCredit,
  grantCredits,
  getActiveSubscription,
  setSubscription,
  cancelSubscription,
  PACK_5_CONFIG,
  type SupabaseLike,
  type SubscriptionState,
} from './credit-manager';

// ── In-memory fake ──────────────────────────────────────────────────────

interface FakeRow extends Record<string, unknown> {}

function buildFake(initial: {
  credits?: FakeRow[];
  profiles?: FakeRow[];
} = {}): { db: SupabaseLike; state: { credits: FakeRow[]; profiles: FakeRow[] } } {
  const state = {
    credits: [...(initial.credits ?? [])],
    profiles: [...(initial.profiles ?? [])],
  };

  function tableArray(table: string): FakeRow[] {
    if (table === 'brihaspati_credits') return state.credits;
    if (table === 'user_profiles') return state.profiles;
    throw new Error(`[fake] unknown table ${table}`);
  }

  function query(table: string) {
    const rows = tableArray(table);
    let filtered: FakeRow[] = rows;
    let _ascendingOrderCol: string | null = null;
    let _ascending = true;
    let _limit: number | null = null;
    let _pendingInsert: FakeRow | null = null;
    let _pendingUpdate: FakeRow | null = null;

    const chain: any = {
      select(_cols: string) { return chain; },
      eq(col: string, val: unknown) {
        filtered = filtered.filter((r) => r[col] === val);
        return chain;
      },
      gt(col: string, val: unknown) {
        filtered = filtered.filter((r) => String(r[col]) > String(val));
        return chain;
      },
      order(col: string, opts: { ascending: boolean }) {
        _ascendingOrderCol = col;
        _ascending = opts.ascending;
        return chain;
      },
      limit(n: number) {
        _limit = n;
        return chain;
      },
      insert(values: FakeRow) {
        _pendingInsert = values;
        return chain;
      },
      update(values: FakeRow) {
        _pendingUpdate = values;
        return chain;
      },
      async maybeSingle() {
        if (_pendingInsert) {
          // Unique-constraint check for credits idempotency
          if (table === 'brihaspati_credits') {
            const dup = rows.find(
              (r) =>
                r.provider === _pendingInsert!.provider &&
                r.payment_ref === _pendingInsert!.payment_ref,
            );
            if (dup) {
              return { data: null, error: { message: 'duplicate key value violates unique constraint' } };
            }
          }
          const newRow = { id: `id-${rows.length + 1}`, ..._pendingInsert };
          rows.push(newRow);
          return { data: newRow, error: null };
        }
        if (_pendingUpdate) {
          for (const r of filtered) {
            for (const [k, v] of Object.entries(_pendingUpdate)) {
              r[k] = v;
            }
          }
          return { data: filtered[0] ?? null, error: null };
        }
        if (_ascendingOrderCol) {
          filtered.sort((a, b) => {
            const ka = String(a[_ascendingOrderCol!]);
            const kb = String(b[_ascendingOrderCol!]);
            return _ascending ? ka.localeCompare(kb) : kb.localeCompare(ka);
          });
        }
        if (_limit !== null) filtered = filtered.slice(0, _limit);
        return { data: filtered[0] ?? null, error: null };
      },
      async single() {
        const r = await chain.maybeSingle();
        if (!r.data && !r.error) {
          return { data: null, error: { message: 'no rows returned' } };
        }
        return r;
      },
      // Multi-row terminal: awaiting the chain directly returns all
      // filtered rows. Mirrors the real Supabase client (which is a
      // PromiseLike resolving to { data: row[], error }).
      then(onFulfilled: (value: { data: FakeRow[] | null; error: { message: string } | null }) => unknown) {
        if (_pendingInsert) {
          if (table === 'brihaspati_credits') {
            const dup = rows.find(
              (r) =>
                r.provider === _pendingInsert!.provider &&
                r.payment_ref === _pendingInsert!.payment_ref,
            );
            if (dup) {
              return Promise.resolve(onFulfilled({ data: null, error: { message: 'duplicate key value violates unique constraint' } }));
            }
          }
          const newRow = { id: `id-${rows.length + 1}`, ..._pendingInsert };
          rows.push(newRow);
          return Promise.resolve(onFulfilled({ data: [newRow], error: null }));
        }
        if (_pendingUpdate) {
          for (const r of filtered) {
            for (const [k, v] of Object.entries(_pendingUpdate)) {
              r[k] = v;
            }
          }
          return Promise.resolve(onFulfilled({ data: filtered, error: null }));
        }
        if (_ascendingOrderCol) {
          filtered.sort((a, b) => {
            const ka = String(a[_ascendingOrderCol!]);
            const kb = String(b[_ascendingOrderCol!]);
            return _ascending ? ka.localeCompare(kb) : kb.localeCompare(ka);
          });
        }
        if (_limit !== null) filtered = filtered.slice(0, _limit);
        return Promise.resolve(onFulfilled({ data: filtered, error: null }));
      },
    };
    return chain;
  }

  // P1-20 — consumeCredit now uses an atomic RPC (consume_brihaspati_credit).
  // Mock it in-memory by replicating the same semantics: find the
  // oldest unexpired credit row with capacity, decrement consumed,
  // return its id (or null if no row has capacity).
  async function rpc(fn: string, args: Record<string, unknown>): Promise<{ data: string | null; error: { message: string } | null }> {
    if (fn !== 'consume_brihaspati_credit') {
      return { data: null, error: { message: `[fake] unknown RPC ${fn}` } };
    }
    const targetUser = args.p_user_id as string;
    const now = Date.now();
    const candidates = state.credits
      .filter((r) => r.user_id === targetUser)
      .filter((r) => (Number(r.consumed) || 0) < (Number(r.granted) || 0))
      .filter((r) => !r.expires_at || new Date(r.expires_at as string).getTime() > now)
      .sort((a, b) => {
        // Match the live RPC's ORDER BY created_at ASC. Fixtures that omit
        // created_at all sort equal — order across them is unstable, which
        // is fine because the only invariant the tests assert is "some row
        // with capacity gets consumed."
        const aTime = a.created_at ? new Date(a.created_at as string).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at as string).getTime() : 0;
        return aTime - bTime;
      });
    const target = candidates[0];
    if (!target) return { data: null, error: null };
    target.consumed = (Number(target.consumed) || 0) + 1;
    return { data: target.id as string, error: null };
  }

  return {
    db: { from: (table: string) => query(table), rpc },
    state,
  };
}

const userId = 'user-1';

// ── Tests ───────────────────────────────────────────────────────────────

describe('getBalance', () => {
  it('returns 0 credits + none subscription for a brand new user', async () => {
    const { db } = buildFake({ profiles: [{ id: userId, brihaspati_subscription: null }] });
    const bal = await getBalance(db, userId);
    expect(bal).toEqual({ credits: 0, subscription: 'none' });
  });

  it('returns positive credits when an active credit row exists', async () => {
    const { db } = buildFake({
      profiles: [{ id: userId, brihaspati_subscription: null }],
      credits: [
        {
          id: 'c1',
          user_id: userId,
          granted: 5,
          consumed: 2,
          expires_at: '2099-01-01T00:00:00Z',
        },
      ],
    });
    const bal = await getBalance(db, userId);
    expect(bal.credits).toBe(3);
    expect(bal.subscription).toBe('none');
  });

  it('subscription wins over credits — returns 0 credits even with credit rows', async () => {
    const sub: SubscriptionState = {
      tier: 'monthly',
      expires_at: '2099-01-01T00:00:00Z',
      started_at: '2026-05-01T00:00:00Z',
      provider: 'stripe',
    };
    const { db } = buildFake({
      profiles: [{ id: userId, brihaspati_subscription: sub }],
      credits: [
        { id: 'c1', user_id: userId, granted: 5, consumed: 0, expires_at: '2099-01-01T00:00:00Z' },
      ],
    });
    const bal = await getBalance(db, userId);
    expect(bal).toEqual({
      credits: 0,
      subscription: 'monthly',
      subscriptionExpiresAt: '2099-01-01T00:00:00Z',
    });
  });

  it('treats expired subscription as none', async () => {
    const sub: SubscriptionState = {
      tier: 'annual',
      expires_at: '2000-01-01T00:00:00Z',
      started_at: '1999-01-01T00:00:00Z',
      provider: 'razorpay',
    };
    const { db } = buildFake({
      profiles: [{ id: userId, brihaspati_subscription: sub }],
    });
    const bal = await getBalance(db, userId);
    expect(bal.subscription).toBe('none');
  });
});

describe('consumeCredit', () => {
  it('returns true and increments consumed when credit available', async () => {
    const { db, state } = buildFake({
      profiles: [{ id: userId, brihaspati_subscription: null }],
      credits: [
        {
          id: 'c1', user_id: userId, granted: 5, consumed: 1, expires_at: '2099-01-01T00:00:00Z',
        },
      ],
    });
    const result = await consumeCredit(db, userId);
    expect(result).toBe(true);
    expect(state.credits[0].consumed).toBe(2);
  });

  it('returns false when no credits and no subscription', async () => {
    const { db } = buildFake({
      profiles: [{ id: userId, brihaspati_subscription: null }],
    });
    const result = await consumeCredit(db, userId);
    expect(result).toBe(false);
  });

  it('returns true on subscription without touching credit rows', async () => {
    const sub: SubscriptionState = {
      tier: 'monthly',
      expires_at: '2099-01-01T00:00:00Z',
      started_at: '2026-05-01T00:00:00Z',
      provider: 'razorpay',
    };
    const { db, state } = buildFake({
      profiles: [{ id: userId, brihaspati_subscription: sub }],
      credits: [
        { id: 'c1', user_id: userId, granted: 5, consumed: 0, expires_at: '2099-01-01T00:00:00Z' },
      ],
    });
    const result = await consumeCredit(db, userId);
    expect(result).toBe(true);
    expect(state.credits[0].consumed).toBe(0); // unchanged
  });

  it('returns false when only a fully-consumed credit row exists', async () => {
    const { db } = buildFake({
      profiles: [{ id: userId, brihaspati_subscription: null }],
      credits: [
        { id: 'c1', user_id: userId, granted: 5, consumed: 5, expires_at: '2099-01-01T00:00:00Z' },
      ],
    });
    // The .gt(expires_at, now) filter still admits this row; the
    // granted == consumed check inside consumeCredit catches it.
    const result = await consumeCredit(db, userId);
    expect(result).toBe(false);
  });

  // Regression: when the user has multiple active credit rows and the
  // earliest-expiring one is already drained, consumeCredit MUST move
  // on to the next row with remaining credit. The original bug picked
  // only the earliest row via .limit(1).maybeSingle() and returned
  // false even though balance summed to >0. The user-visible symptom
  // was "free with your plan" (UI) followed by "No balance — payment
  // required" (server) for the same click.
  it('drains the next row with remaining credit when the earliest-expiring is depleted', async () => {
    const { db, state } = buildFake({
      profiles: [{ id: userId, brihaspati_subscription: null }],
      credits: [
        // Earliest expiry, fully consumed
        { id: 'c1', user_id: userId, granted: 1, consumed: 1, expires_at: '2099-01-01T00:00:00Z' },
        // Later expiry, has credit
        { id: 'c2', user_id: userId, granted: 1, consumed: 0, expires_at: '2099-06-01T00:00:00Z' },
        // Even later, has credit
        { id: 'c3', user_id: userId, granted: 5, consumed: 2, expires_at: '2099-12-01T00:00:00Z' },
      ],
    });

    // Sanity: getBalance sees 4 credits (0 + 1 + 3)
    const bal = await getBalance(db, userId);
    expect(bal.credits).toBe(4);

    // consumeCredit must succeed and increment the next row with credit (c2)
    const result = await consumeCredit(db, userId);
    expect(result).toBe(true);

    const c1 = state.credits.find((r) => r.id === 'c1');
    const c2 = state.credits.find((r) => r.id === 'c2');
    const c3 = state.credits.find((r) => r.id === 'c3');
    expect(c1!.consumed).toBe(1); // untouched (already drained)
    expect(c2!.consumed).toBe(1); // drained next (earliest with credit)
    expect(c3!.consumed).toBe(2); // untouched
  });
});

describe('grantCredits', () => {
  it('inserts a 5-credit row with 30-day expiry for pack_5', async () => {
    const { db, state } = buildFake({
      profiles: [{ id: userId, brihaspati_subscription: null }],
    });
    await grantCredits(db, userId, 'pack_5', 'razorpay', 'pay_abc123');
    expect(state.credits).toHaveLength(1);
    const row = state.credits[0];
    expect(row.granted).toBe(PACK_5_CONFIG.credits);
    expect(row.consumed).toBe(0);
    expect(row.provider).toBe('razorpay');
    expect(row.payment_ref).toBe('pay_abc123');
    // expires_at must be ~30 days out
    const days = (new Date(row.expires_at as string).getTime() - Date.now()) / (86400 * 1000);
    expect(days).toBeGreaterThan(29);
    expect(days).toBeLessThan(31);
  });

  it('rejects unsupported tiers', async () => {
    const { db } = buildFake();
    await expect(grantCredits(db, userId, 'monthly', 'stripe', 'pi_x')).rejects.toThrow(
      /unsupported tier/,
    );
  });

  it('is idempotent on duplicate (provider, payment_ref)', async () => {
    const { db, state } = buildFake();
    await grantCredits(db, userId, 'pack_5', 'razorpay', 'pay_abc');
    await grantCredits(db, userId, 'pack_5', 'razorpay', 'pay_abc');
    expect(state.credits).toHaveLength(1); // duplicate silently dropped
  });
});

describe('getActiveSubscription', () => {
  it('none for fresh user', async () => {
    const { db } = buildFake({ profiles: [{ id: userId, brihaspati_subscription: null }] });
    const r = await getActiveSubscription(db, userId);
    expect(r.tier).toBe('none');
  });

  it('returns active monthly with expiresAt', async () => {
    const sub: SubscriptionState = {
      tier: 'monthly',
      expires_at: '2099-01-01T00:00:00Z',
      started_at: '2026-05-01T00:00:00Z',
      provider: 'razorpay',
    };
    const { db } = buildFake({ profiles: [{ id: userId, brihaspati_subscription: sub }] });
    const r = await getActiveSubscription(db, userId);
    expect(r.tier).toBe('monthly');
    if (r.tier !== 'none') expect(r.expiresAt).toBe('2099-01-01T00:00:00Z');
  });
});

describe('setSubscription + cancelSubscription', () => {
  it('writes subscription state, then cancel expires it', async () => {
    const { db, state } = buildFake({
      profiles: [{ id: userId, brihaspati_subscription: null }],
    });
    await setSubscription(db, userId, 'monthly', '2099-01-01T00:00:00Z', 'razorpay');
    const sub1 = state.profiles[0].brihaspati_subscription as SubscriptionState;
    expect(sub1.tier).toBe('monthly');
    expect(sub1.expires_at).toBe('2099-01-01T00:00:00Z');

    await cancelSubscription(db, userId);
    const sub2 = state.profiles[0].brihaspati_subscription as SubscriptionState;
    expect(new Date(sub2.expires_at).getTime()).toBeLessThanOrEqual(Date.now());
  });

  it('cancelSubscription no-ops on never-subscribed user', async () => {
    const { db } = buildFake({ profiles: [{ id: userId, brihaspati_subscription: null }] });
    await expect(cancelSubscription(db, userId)).resolves.toBeUndefined();
  });
});
