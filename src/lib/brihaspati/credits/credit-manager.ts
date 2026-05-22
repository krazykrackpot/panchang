/**
 * Brihaspati credit + subscription manager.
 *
 * Authoritative access to:
 *   - brihaspati_credits table (5-question pack ledger)
 *   - user_profiles.brihaspati_subscription jsonb (monthly / annual state)
 *
 * Subscription state lives on user_profiles for cheap join-free reads.
 * Credit purchases live in brihaspati_credits with one row per purchase
 * (row may have consumed < granted as credits drain). Subscriptions
 * always win over credits — if a user is on monthly, their credits don't
 * drain.
 *
 * Tests inject a fake DB via the SupabaseLike interface so we never hit
 * a real network in CI.
 */

import {
  type BrihaspatiBalance,
  type BrihaspatiPricingTier,
  type BrihaspatiProvider,
} from '../types';

/** Minimal Supabase-shaped interface we depend on; lets tests inject a fake. */
export interface SupabaseLike {
  from(table: string): QueryChain;
}

interface QueryChain {
  select(cols: string): QueryChain;
  eq(col: string, val: unknown): QueryChain;
  gt(col: string, val: unknown): QueryChain;
  order(col: string, opts: { ascending: boolean }): QueryChain;
  limit(n: number): QueryChain;
  insert(values: Record<string, unknown>): QueryChain;
  update(values: Record<string, unknown>): QueryChain;
  maybeSingle(): Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
  single(): Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
  // For non-single mutating ops:
  then?: never;
}

/** Subscription state stored on user_profiles.brihaspati_subscription. */
export interface SubscriptionState {
  tier: 'monthly' | 'annual';
  expires_at: string; // ISO 8601
  started_at: string; // ISO 8601
  provider: BrihaspatiProvider;
}

const PACK_5_CREDITS = 5;
const PACK_5_VALIDITY_DAYS = 30;

function nowIso(): string {
  return new Date().toISOString();
}

function addDaysIso(days: number, from: Date = new Date()): string {
  const d = new Date(from.getTime() + days * 86400 * 1000);
  return d.toISOString();
}

/**
 * Get the user's current balance — combined view of credits + subscription.
 * Subscription wins; if active, credits aren't drained.
 */
export async function getBalance(db: SupabaseLike, userId: string): Promise<BrihaspatiBalance> {
  const sub = await getActiveSubscription(db, userId);
  if (sub.tier !== 'none') {
    return {
      credits: 0,
      subscription: sub.tier,
      subscriptionExpiresAt: sub.expiresAt,
    };
  }

  const now = nowIso();
  // .maybeSingle() returns { data: null, error: null } when no rows match —
  // which is the normal case for users without an active credit pack.
  // (Was .single() previously, which errors with PGRST116 "Cannot coerce
  // the result to a single JSON object" on 0 rows. That bug surfaced as a
  // 500 on the balance endpoint for every new user.)
  const { data, error } = await db
    .from('brihaspati_credits')
    .select('granted, consumed, expires_at')
    .eq('user_id', userId)
    .gt('expires_at', now)
    .maybeSingle();

  if (error) {
    throw new Error(`[brihaspati] credits read failed: ${error.message}`);
  }

  // Sum across multiple active credit rows. The .single() above only
  // returns one row though — full aggregation in the caller via a
  // proper sum query is fast-follow; for now, one row is typical.
  let credits = 0;
  if (data) {
    const granted = Number(data.granted) || 0;
    const consumed = Number(data.consumed) || 0;
    credits = Math.max(0, granted - consumed);
  }

  return { credits, subscription: 'none' };
}

/**
 * Try to deduct one credit. Returns true if successful, false if the
 * user has no active credit AND no active subscription.
 *
 * NOT a transaction — concurrent calls can race. In practice this is
 * OK because each Brihaspati question creates a row in
 * brihaspati_questions with payment_verified=false; the race only
 * affects which credit row gets debited, not whether the user gets
 * billed. A heavier transactional implementation is fast-follow.
 */
export async function consumeCredit(db: SupabaseLike, userId: string): Promise<boolean> {
  const sub = await getActiveSubscription(db, userId);
  if (sub.tier !== 'none') {
    // Subscriptions don't consume credits.
    return true;
  }

  const now = nowIso();
  const { data, error } = await db
    .from('brihaspati_credits')
    .select('id, granted, consumed')
    .eq('user_id', userId)
    .gt('expires_at', now)
    .order('expires_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`[brihaspati] credit select failed: ${error.message}`);
  }
  if (!data) return false;

  const granted = Number(data.granted) || 0;
  const consumed = Number(data.consumed) || 0;
  if (granted <= consumed) return false;

  const { error: updErr } = await db
    .from('brihaspati_credits')
    .update({ consumed: consumed + 1 })
    .eq('id', data.id)
    .maybeSingle();

  if (updErr) {
    throw new Error(`[brihaspati] credit deduct failed: ${updErr.message}`);
  }
  return true;
}

/**
 * Insert a credit grant. Idempotent via the (provider, payment_ref)
 * unique constraint — duplicate webhook deliveries silently no-op.
 */
export async function grantCredits(
  db: SupabaseLike,
  userId: string,
  tier: BrihaspatiPricingTier,
  provider: BrihaspatiProvider,
  paymentRef: string,
): Promise<void> {
  if (tier !== 'pack_5') {
    throw new Error(`[brihaspati] grantCredits: unsupported tier ${tier}`);
  }
  const { error } = await db
    .from('brihaspati_credits')
    .insert({
      user_id: userId,
      granted: PACK_5_CREDITS,
      consumed: 0,
      pricing_tier: 'pack_5',
      provider,
      payment_ref: paymentRef,
      expires_at: addDaysIso(PACK_5_VALIDITY_DAYS),
    })
    .maybeSingle();

  // Unique-constraint violation = idempotent retry; silent ok.
  if (error && !/duplicate key|unique constraint|conflict/i.test(error.message)) {
    throw new Error(`[brihaspati] grant credits failed: ${error.message}`);
  }
}

/** Returns the active subscription if any; { tier: 'none' } if not. */
export async function getActiveSubscription(
  db: SupabaseLike,
  userId: string,
): Promise<{ tier: 'none' } | { tier: 'monthly' | 'annual'; expiresAt: string }> {
  const { data, error } = await db
    .from('user_profiles')
    .select('brihaspati_subscription')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(`[brihaspati] subscription read failed: ${error.message}`);
  }
  const raw = data?.brihaspati_subscription as SubscriptionState | null | undefined;
  if (!raw) return { tier: 'none' };
  if (new Date(raw.expires_at).getTime() <= Date.now()) return { tier: 'none' };
  return { tier: raw.tier, expiresAt: raw.expires_at };
}

/** Activate / extend a subscription. Webhook-handler only. */
export async function setSubscription(
  db: SupabaseLike,
  userId: string,
  tier: 'monthly' | 'annual',
  expiresAt: string,
  provider: BrihaspatiProvider,
): Promise<void> {
  const sub: SubscriptionState = {
    tier,
    expires_at: expiresAt,
    started_at: nowIso(),
    provider,
  };
  const { error } = await db
    .from('user_profiles')
    .update({ brihaspati_subscription: sub })
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new Error(`[brihaspati] subscription write failed: ${error.message}`);
}

/** Cancel — set expires_at to now so getActiveSubscription returns 'none'. */
export async function cancelSubscription(db: SupabaseLike, userId: string): Promise<void> {
  const { data } = await db
    .from('user_profiles')
    .select('brihaspati_subscription')
    .eq('id', userId)
    .maybeSingle();
  const cur = data?.brihaspati_subscription as SubscriptionState | null | undefined;
  if (!cur) return;
  const updated: SubscriptionState = { ...cur, expires_at: nowIso() };
  const { error } = await db
    .from('user_profiles')
    .update({ brihaspati_subscription: updated })
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new Error(`[brihaspati] subscription cancel failed: ${error.message}`);
}

/** Pricing-tier shape (helper for tests and webhook handlers). */
export const PACK_5_CONFIG = {
  credits: PACK_5_CREDITS,
  validityDays: PACK_5_VALIDITY_DAYS,
} as const;
