/**
 * Pandit subscription + cap-usage helpers.
 *
 * Single source of truth for:
 *   - Resolving the Pandit's current tier (free / pandit_pro / pandit_unlimited)
 *   - Computing cap usage (linked clients DON'T count; unlinked + invited DO)
 *   - The free-tier limit constant
 *
 * Keep FREE_TIER_UNLINKED_CAP in sync with the `k_free_cap` constant
 * inside the migration-055 trigger function. If you change one, change
 * the other in the same commit.
 *
 * Pandit CRM P10.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export const FREE_TIER_UNLINKED_CAP = 5;

export type PanditTier = 'free' | 'pandit_pro' | 'pandit_unlimited';

export interface PanditSubscriptionInfo {
  tier: PanditTier;
  status: 'active' | 'trialing' | 'cancelled' | 'past_due' | 'expired' | 'none';
  current_period_end: string | null;
  provider: 'stripe' | 'razorpay' | null;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
}

export interface PanditCapUsage {
  /**
   * The Pandit's current tier.
   */
  tier: PanditTier;
  /**
   * Number of clients that count against the cap (link_state in
   * 'unlinked' or 'invited').
   */
  unlinked_count: number;
  /**
   * Number of clients in 'linked' state (do not count, shown for UX
   * positive reinforcement: "X clients have joined the platform").
   */
  linked_count: number;
  /**
   * The cap — `Infinity` for paid tiers, FREE_TIER_UNLINKED_CAP for free.
   * Serialised as `null` over JSON.
   */
  cap: number | null;
  /**
   * True when the Pandit can add more unlinked clients. Paid tiers are
   * always true; free tier is true while `unlinked_count < cap`.
   */
  can_add_unlinked: boolean;
  /**
   * Remaining unlinked-slot count for free-tier (`null` for paid).
   */
  remaining: number | null;
}

/**
 * Resolve the Pandit's current subscription. Reads the same
 * `subscriptions` table used for seeker tiers — Pandit tiers are
 * orthogonal values on the same row.
 *
 * A Pandit who has never paid (or whose subscription expired) has
 * status='none' and tier='free'. A row with a non-Pandit tier
 * (e.g. user briefly held a seeker `pro` subscription) is also
 * treated as `free` from the Pandit-roster perspective — only the
 * two Pandit tiers bypass the cap.
 */
export async function getPanditSubscription(
  supabase: SupabaseClient,
  userId: string,
): Promise<PanditSubscriptionInfo> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('tier, status, current_period_end, provider, provider_customer_id, provider_subscription_id')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing', 'cancelled', 'past_due', 'expired'])
    .order('updated_at', { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[pandit/subscription] lookup failed:', error.message);
    return {
      tier: 'free',
      status: 'none',
      current_period_end: null,
      provider: null,
      provider_customer_id: null,
      provider_subscription_id: null,
    };
  }

  if (!data) {
    return {
      tier: 'free',
      status: 'none',
      current_period_end: null,
      provider: null,
      provider_customer_id: null,
      provider_subscription_id: null,
    };
  }

  // Map non-Pandit tiers to 'free' from the Pandit perspective.
  let tier: PanditTier = 'free';
  if (data.tier === 'pandit_pro' || data.tier === 'pandit_unlimited') {
    // Honour Pandit tier only while subscription is paying. cancelled/
    // past_due/expired all fall back to 'free' for cap purposes.
    if (data.status === 'active' || data.status === 'trialing') {
      tier = data.tier;
    }
  }

  return {
    tier,
    status: (data.status ?? 'none') as PanditSubscriptionInfo['status'],
    current_period_end: data.current_period_end ?? null,
    provider: (data.provider as PanditSubscriptionInfo['provider']) ?? null,
    provider_customer_id: data.provider_customer_id ?? null,
    provider_subscription_id: data.provider_subscription_id ?? null,
  };
}

/**
 * Compute the Pandit's cap-usage snapshot. Combines the tier lookup
 * with a single `pandit_clients` aggregate so callers get everything
 * they need in one round-trip.
 */
export async function getPanditCapUsage(
  supabase: SupabaseClient,
  userId: string,
): Promise<PanditCapUsage> {
  const sub = await getPanditSubscription(supabase, userId);

  // Fetch link_state distribution for the Pandit's roster. We only
  // need the two buckets relevant to the cap — everything else (paused,
  // declined, archived) doesn't count.
  const { data, error } = await supabase
    .from('pandit_clients')
    .select('link_state')
    .eq('pandit_user_id', userId)
    .in('link_state', ['unlinked', 'invited', 'linked']);

  let unlinkedCount = 0;
  let linkedCount = 0;
  if (error) {
    console.error('[pandit/subscription] cap-usage count failed:', error.message);
    // Fail safe: assume zero usage so the UI doesn't lock the Pandit
    // out on a transient DB error. The DB trigger remains the source
    // of truth at INSERT time.
  } else if (data) {
    for (const row of data) {
      if (row.link_state === 'linked') linkedCount += 1;
      else unlinkedCount += 1; // 'unlinked' | 'invited'
    }
  }

  const isPaid = sub.tier === 'pandit_pro' || sub.tier === 'pandit_unlimited';
  const cap = isPaid ? null : FREE_TIER_UNLINKED_CAP;
  const remaining = isPaid ? null : Math.max(0, FREE_TIER_UNLINKED_CAP - unlinkedCount);
  const canAdd = isPaid || unlinkedCount < FREE_TIER_UNLINKED_CAP;

  return {
    tier: sub.tier,
    unlinked_count: unlinkedCount,
    linked_count: linkedCount,
    cap,
    can_add_unlinked: canAdd,
    remaining,
  };
}

/**
 * Detect whether a Postgres error is the cap-exceeded raise from
 * the migration-055 trigger. The trigger's MESSAGE always starts
 * with `pandit_cap_exceeded:` — that prefix is the stable contract.
 */
export function isCapExceededError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const message = (err as { message?: unknown }).message;
  return typeof message === 'string' && message.startsWith('pandit_cap_exceeded:');
}

/**
 * Stripe price-ID env mapping for Pandit tiers + currencies.
 *
 * Env var convention:
 *   USD: STRIPE_PRICE_PANDIT_PRO_MONTHLY
 *   USD: STRIPE_PRICE_PANDIT_PRO_ANNUAL
 *   INR: STRIPE_PRICE_PANDIT_PRO_MONTHLY_INR
 *   INR: STRIPE_PRICE_PANDIT_PRO_ANNUAL_INR
 *
 * INR uses Stripe (NOT Razorpay) — same provider as Brihaspati INR.
 * Single webhook handler, single binding table. Brihaspati's INR
 * floor is ₹99 per Stripe CHF-settlement minimum; Pandit Pro at
 * ₹999 is comfortably above that.
 *
 * Read at runtime so Vercel env updates take effect without a redeploy.
 */
export function getPanditStripePriceId(
  tier: 'pandit_pro' | 'pandit_unlimited',
  billing: 'monthly' | 'annual',
  currency: 'USD' | 'INR' = 'USD',
): string | null {
  const suffix = currency === 'INR' ? `${billing.toUpperCase()}_INR` : billing.toUpperCase();
  const envName = `STRIPE_PRICE_${tier.toUpperCase()}_${suffix}`;
  const value = (process.env[envName] ?? '').trim();
  return value || null;
}
