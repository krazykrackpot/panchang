/**
 * Tests for src/lib/pandit/subscription.ts — the cap usage helpers
 * and the cap-exceeded error detector. These exercise the
 * tier-mapping logic (only ACTIVE/TRIALING Pandit tiers bypass the
 * cap; cancelled/past_due/expired Pandit tiers fall back to free)
 * and the boolean output of `isCapExceededError`.
 *
 * Pandit CRM P10.
 */

import { describe, it, expect } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  FREE_TIER_UNLINKED_CAP,
  getPanditCapUsage,
  getPanditSubscription,
  isCapExceededError,
  getPanditStripePriceId,
} from '../subscription';

// Minimal Supabase-like mock that lets us script the responses of
// the two queries we make: `subscriptions` (single row) and
// `pandit_clients` (list of link_state rows).
function makeMockSupabase(opts: {
  subscriptionRow?: {
    tier: string;
    status: string;
    current_period_end?: string | null;
    provider?: string | null;
    provider_customer_id?: string | null;
    provider_subscription_id?: string | null;
  } | null;
  clientRows?: Array<{ link_state: string }>;
}): SupabaseClient {
  const subRow = opts.subscriptionRow ?? null;
  const clientRows = opts.clientRows ?? [];
  return {
    from(table: string) {
      if (table === 'subscriptions') {
        return {
          select() { return this; },
          eq() { return this; },
          in() { return this; },
          order() { return this; },
          limit() { return this; },
          async maybeSingle() {
            return { data: subRow, error: null };
          },
        };
      }
      if (table === 'pandit_clients') {
        return {
          select() { return this; },
          eq() { return this; },
          async in() {
            return { data: clientRows, error: null };
          },
        };
      }
      throw new Error(`unexpected table ${table}`);
    },
  } as unknown as SupabaseClient;
}

describe('getPanditSubscription', () => {
  it('returns free tier when no subscription row', async () => {
    const sb = makeMockSupabase({ subscriptionRow: null });
    const sub = await getPanditSubscription(sb, 'u1');
    expect(sub.tier).toBe('free');
    expect(sub.status).toBe('none');
    expect(sub.provider).toBe(null);
  });

  it('maps active pandit_pro to pandit_pro tier', async () => {
    const sb = makeMockSupabase({
      subscriptionRow: { tier: 'pandit_pro', status: 'active', provider: 'stripe' },
    });
    const sub = await getPanditSubscription(sb, 'u1');
    expect(sub.tier).toBe('pandit_pro');
    expect(sub.status).toBe('active');
    expect(sub.provider).toBe('stripe');
  });

  it('maps trialing pandit_unlimited to pandit_unlimited', async () => {
    const sb = makeMockSupabase({
      subscriptionRow: { tier: 'pandit_unlimited', status: 'trialing' },
    });
    const sub = await getPanditSubscription(sb, 'u1');
    expect(sub.tier).toBe('pandit_unlimited');
  });

  it('falls back to free when pandit tier is cancelled', async () => {
    // A Pandit whose subscription was cancelled loses paid-tier
    // privileges immediately for cap purposes. (Stripe access can
    // still run until period end via the portal; the cap engages
    // when status changes.)
    const sb = makeMockSupabase({
      subscriptionRow: { tier: 'pandit_pro', status: 'cancelled' },
    });
    const sub = await getPanditSubscription(sb, 'u1');
    expect(sub.tier).toBe('free');
  });

  it('treats non-Pandit tiers (seeker pro) as free for the cap', async () => {
    const sb = makeMockSupabase({
      subscriptionRow: { tier: 'pro', status: 'active' },
    });
    const sub = await getPanditSubscription(sb, 'u1');
    expect(sub.tier).toBe('free');
  });
});

describe('getPanditCapUsage', () => {
  it('counts unlinked + invited toward the cap; linked separately', async () => {
    const sb = makeMockSupabase({
      subscriptionRow: null,
      clientRows: [
        { link_state: 'unlinked' },
        { link_state: 'unlinked' },
        { link_state: 'invited' },
        { link_state: 'linked' },
        { link_state: 'linked' },
      ],
    });
    const usage = await getPanditCapUsage(sb, 'u1');
    expect(usage.tier).toBe('free');
    expect(usage.unlinked_count).toBe(3); // 2 unlinked + 1 invited
    expect(usage.linked_count).toBe(2);
    expect(usage.cap).toBe(FREE_TIER_UNLINKED_CAP);
    expect(usage.remaining).toBe(FREE_TIER_UNLINKED_CAP - 3);
    expect(usage.can_add_unlinked).toBe(true);
  });

  it('blocks new unlinked clients when at cap', async () => {
    const rows = Array.from({ length: FREE_TIER_UNLINKED_CAP }, () => ({
      link_state: 'unlinked',
    }));
    const sb = makeMockSupabase({ subscriptionRow: null, clientRows: rows });
    const usage = await getPanditCapUsage(sb, 'u1');
    expect(usage.unlinked_count).toBe(FREE_TIER_UNLINKED_CAP);
    expect(usage.remaining).toBe(0);
    expect(usage.can_add_unlinked).toBe(false);
  });

  it('paid tier reports null cap + unlimited can_add', async () => {
    const sb = makeMockSupabase({
      subscriptionRow: { tier: 'pandit_pro', status: 'active' },
      clientRows: Array.from({ length: 50 }, () => ({ link_state: 'unlinked' })),
    });
    const usage = await getPanditCapUsage(sb, 'u1');
    expect(usage.tier).toBe('pandit_pro');
    expect(usage.cap).toBe(null);
    expect(usage.remaining).toBe(null);
    expect(usage.can_add_unlinked).toBe(true);
  });
});

describe('isCapExceededError', () => {
  it('detects the trigger error by message prefix', () => {
    expect(
      isCapExceededError({ message: 'pandit_cap_exceeded: free tier allows up to 5 unlinked clients' }),
    ).toBe(true);
  });

  it('rejects unrelated errors', () => {
    expect(isCapExceededError({ message: 'duplicate key value' })).toBe(false);
    expect(isCapExceededError({ message: '' })).toBe(false);
    expect(isCapExceededError(null)).toBe(false);
    expect(isCapExceededError({ code: 'P0001' })).toBe(false); // no message
  });
});

describe('getPanditStripePriceId', () => {
  it('reads price id from STRIPE_PRICE_ env var matching tier+billing', () => {
    process.env.STRIPE_PRICE_PANDIT_PRO_MONTHLY = 'price_test_pro_mo';
    process.env.STRIPE_PRICE_PANDIT_UNLIMITED_ANNUAL = 'price_test_unl_an';
    try {
      expect(getPanditStripePriceId('pandit_pro', 'monthly')).toBe('price_test_pro_mo');
      expect(getPanditStripePriceId('pandit_unlimited', 'annual')).toBe('price_test_unl_an');
    } finally {
      delete process.env.STRIPE_PRICE_PANDIT_PRO_MONTHLY;
      delete process.env.STRIPE_PRICE_PANDIT_UNLIMITED_ANNUAL;
    }
  });

  it('returns null when env var missing or empty', () => {
    delete process.env.STRIPE_PRICE_PANDIT_PRO_ANNUAL;
    expect(getPanditStripePriceId('pandit_pro', 'annual')).toBe(null);
    process.env.STRIPE_PRICE_PANDIT_PRO_ANNUAL = '   ';
    try {
      expect(getPanditStripePriceId('pandit_pro', 'annual')).toBe(null);
    } finally {
      delete process.env.STRIPE_PRICE_PANDIT_PRO_ANNUAL;
    }
  });

  it('trims whitespace from env var values', () => {
    process.env.STRIPE_PRICE_PANDIT_PRO_MONTHLY = '  price_padded  ';
    try {
      expect(getPanditStripePriceId('pandit_pro', 'monthly')).toBe('price_padded');
    } finally {
      delete process.env.STRIPE_PRICE_PANDIT_PRO_MONTHLY;
    }
  });
});
