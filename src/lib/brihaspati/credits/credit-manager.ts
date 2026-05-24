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
  // P1-20 — consume_brihaspati_credit RPC. Returns the consumed credit
  // row id as a string, or null when no credit row has capacity. Tests
  // can mock by returning either shape.
  rpc(fn: string, args: Record<string, unknown>): Promise<{ data: string | null; error: { message: string } | null }>;
}

/**
 * A multi-row query result. PostgREST chains in @supabase/supabase-js are
 * thenable — `await db.from(...).select(...).gt(...)` resolves to this
 * shape. We declare it explicitly so tests can mock it.
 */
type MultiRowResult = {
  data: Record<string, unknown>[] | null;
  error: { message: string } | null;
};

/**
 * QueryChain extends PromiseLike<MultiRowResult> so it can be awaited
 * directly for multi-row reads — matching the real Supabase client API.
 * The terminal methods `single()` / `maybeSingle()` are explicit when a
 * single-row shape is wanted.
 */
interface QueryChain extends PromiseLike<MultiRowResult> {
  select(cols: string): QueryChain;
  eq(col: string, val: unknown): QueryChain;
  gt(col: string, val: unknown): QueryChain;
  order(col: string, opts: { ascending: boolean }): QueryChain;
  limit(n: number): QueryChain;
  insert(values: Record<string, unknown>): QueryChain;
  update(values: Record<string, unknown>): QueryChain;
  maybeSingle(): Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
  single(): Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
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
  // Users can have multiple active credit rows simultaneously: one row
  // per pack purchase, plus an extra row for each single-question buy
  // that hasn't yet been consumed. We sum across all of them.
  //
  // History: was .single() → PGRST116 "no rows" on new users; then
  // .maybeSingle() → PGRST116 "multiple rows" once users had >1 purchase.
  // Plain .select() is correct — neither shape constraint applies.
  const { data, error } = await db
    .from('brihaspati_credits')
    .select('granted, consumed, expires_at')
    .eq('user_id', userId)
    .gt('expires_at', now);

  if (error) {
    throw new Error(`[brihaspati] credits read failed: ${error.message}`);
  }

  let credits = 0;
  for (const row of (data ?? [])) {
    const granted = Number(row.granted) || 0;
    const consumed = Number(row.consumed) || 0;
    credits += Math.max(0, granted - consumed);
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

  // P1-20 — atomic decrement via SQL function. The previous
  // read-then-update pattern was documented as racy (two concurrent
  // consumeCredit calls could both pass the consumed < granted check
  // and both write consumed + 1 → user got 2 answers for 1 credit).
  // consume_brihaspati_credit() uses FOR UPDATE SKIP LOCKED + an
  // in-statement WHERE re-assertion to guarantee at most one writer
  // per credit row. Returns the consumed row id on success, NULL when
  // no credit row has capacity.
  const { data, error } = await db.rpc('consume_brihaspati_credit', { p_user_id: userId });
  if (error) {
    throw new Error(`[brihaspati] consume_brihaspati_credit failed: ${error.message}`);
  }
  // data === null when no credit row had capacity. data === uuid string on success.
  return data != null;
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
