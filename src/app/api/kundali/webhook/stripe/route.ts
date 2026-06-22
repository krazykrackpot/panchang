/**
 * POST /api/kundali/webhook/stripe
 *
 * Stripe webhook handler for kundali-paywall purchases. Configured in
 * the Stripe dashboard with its own signing secret
 * (STRIPE_WEBHOOK_SECRET_KUNDALI). Subscribes to
 * checkout.session.completed.
 *
 * Filters by metadata.kundali_paywall === 'true' (set in /api/kundali/checkout),
 * so events from other product lines (subscription pro/jyotishi,
 * Brihaspati, Pandit CRM) are silently ignored — they have their own
 * dedicated webhook endpoints.
 *
 * Security:
 *   1. Verify Stripe signature with STRIPE_WEBHOOK_SECRET_KUNDALI.
 *   2. Look up pending_checkouts by session_id; the binding row was
 *      written server-side at /api/kundali/checkout from the
 *      authenticated user. NEVER trust session.metadata.user_id.
 *   3. The credit grant RPC (grant_chart_credits) is idempotent via
 *      UNIQUE(provider, provider_session_id) on chart_credit_purchases.
 *      Re-deliveries return status=duplicate without re-granting.
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSupabase } from '@/lib/supabase/server';
import {
  isValidKundaliSku,
  isValidCurrency,
  KUNDALI_PRODUCTS,
} from '@/lib/kundali/paywall-products';

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KUNDALI?.trim();
  if (!secretKey || !webhookSecret) {
    console.error('[kundali/webhook/stripe] missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET_KUNDALI');
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature') ?? '';

  const stripe = new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
    maxNetworkRetries: 3,
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[kundali/webhook/stripe] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // We only care about checkout.session.completed in this MVP.
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true, ignored: true, reason: 'event_type' });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  // Filter: only kundali-paywall events.
  if (session.metadata?.kundali_paywall !== 'true') {
    return NextResponse.json({ received: true, ignored: true, reason: 'not_kundali' });
  }

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  // Server-bind: trust pending_checkouts.user_id, not session.metadata.user_id.
  const { data: pending, error: pendingErr } = await supabase
    .from('pending_checkouts')
    .select('user_id, tier, currency, completed_at')
    .eq('stripe_session_id', session.id)
    .single();

  if (pendingErr) {
    // No binding row → session not created by our /api/kundali/checkout.
    // Could be a metadata-spoofed attack or a manual Stripe dashboard
    // session. Refuse to credit; return 200 so Stripe stops retrying.
    console.error('[kundali/webhook/stripe] SECURITY: no pending_checkouts row', {
      sessionId: session.id,
      metaUserId: session.metadata?.user_id,
      sku: session.metadata?.sku,
    });
    return NextResponse.json({ received: true, ignored: true, reason: 'no_binding' });
  }

  // The binding tier is `kundali_single` or `kundali_family`; strip the prefix.
  const tierMatch = /^kundali_(single|family)$/.exec(pending.tier ?? '');
  if (!tierMatch || !isValidKundaliSku(tierMatch[1])) {
    console.error('[kundali/webhook/stripe] pending tier not kundali_*:', pending.tier);
    return NextResponse.json({ received: true, ignored: true, reason: 'wrong_tier' });
  }
  const sku = tierMatch[1];

  // Cross-check metadata.user_id matches the bound user_id (defence-in-depth).
  if (session.metadata?.user_id && session.metadata.user_id !== pending.user_id) {
    console.error('[kundali/webhook/stripe] SECURITY: metadata.user_id mismatch with binding', {
      sessionId: session.id,
      metaUserId: session.metadata.user_id,
      boundUserId: pending.user_id,
    });
    return NextResponse.json({ received: true, ignored: true, reason: 'user_mismatch' });
  }

  // Cross-check metadata.sku matches the bound tier.
  if (session.metadata?.sku && session.metadata.sku !== sku) {
    console.error('[kundali/webhook/stripe] SECURITY: metadata.sku mismatch with binding', {
      sessionId: session.id,
      metaSku: session.metadata.sku,
      boundSku: sku,
    });
    return NextResponse.json({ received: true, ignored: true, reason: 'sku_mismatch' });
  }

  const currency = pending.currency;
  if (!currency || !isValidCurrency(currency)) {
    console.error('[kundali/webhook/stripe] pending.currency invalid:', currency);
    return NextResponse.json({ received: true, ignored: true, reason: 'bad_currency' });
  }

  // Resolve the credits + price from the trusted catalogue.
  const product = KUNDALI_PRODUCTS[sku];
  const creditsGranted = product.creditsGranted;
  const amountPaidMinor = product.priceMinor[currency];

  // Grant the credits atomically.
  const { data: result, error: grantErr } = await supabase.rpc('grant_chart_credits', {
    p_user_id: pending.user_id,
    p_sku: sku,
    p_credits_granted: creditsGranted,
    p_amount_paid_minor: amountPaidMinor,
    p_currency: currency,
    p_provider: 'stripe',
    p_provider_session_id: session.id,
    p_provider_payment_id: typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null,
  });

  if (grantErr) {
    console.error('[kundali/webhook/stripe] grant_chart_credits failed:', grantErr.message);
    // Return 500 so Stripe retries — credits not granted yet, transient DB issue.
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  // Stamp the binding row completed (best-effort; idempotency already
  // covered by the UNIQUE on chart_credit_purchases).
  if (!pending.completed_at) {
    await supabase
      .from('pending_checkouts')
      .update({ completed_at: new Date().toISOString() })
      .eq('stripe_session_id', session.id);
  }

  return NextResponse.json({ received: true, result });
}
