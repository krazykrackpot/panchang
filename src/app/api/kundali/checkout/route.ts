/**
 * POST /api/kundali/checkout
 *
 * Initiates a Stripe checkout session for a kundali-credit purchase.
 *
 * Body:  { sku: 'single' | 'family', currency: 'INR' | 'USD', locale: string }
 * Auth:  Bearer token (Supabase access_token); user must be signed in.
 * Returns: { url } — the Stripe checkout session URL to redirect the user to.
 *
 * Server-binding (P0 security — mirrors /api/checkout, /api/brihaspati/order):
 *   1. Reject if currency/sku invalid (anti-spoofing of pricing).
 *   2. Look up the authenticated user from the bearer token; never
 *      trust client-supplied user_id.
 *   3. Write a pending_checkouts row with stripe_session_id + user_id +
 *      tier='kundali_<sku>'. The webhook reads from this row instead of
 *      session.metadata.user_id (which is attacker-influenceable at
 *      session-creation time).
 *   4. Stripe success_url returns the user to /<locale>/account/credits
 *      with status=success.
 */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';
import { BASE_URL } from '@/lib/seo/base-url';
import {
  isValidKundaliSku,
  isValidCurrency,
  resolveStripePriceId,
  KUNDALI_PRODUCTS,
} from '@/lib/kundali/paywall-products';
import { locales } from '@/lib/i18n/config';

interface CheckoutBody {
  sku?: string;
  currency?: string;
  locale?: string;
}

export async function POST(req: Request) {
  // Rate limit by IP first (10/min — same as /api/checkout).
  const ip = getClientIP(req);
  const { allowed } = checkRateLimit(ip, { maxRequests: 10, windowMs: 60000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before trying again.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'Retry-After': '60' } },
    );
  }

  // Parse + validate body.
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const sku = body.sku;
  const currency = body.currency;
  const rawLocale = body.locale ?? 'en';

  if (!sku || !isValidKundaliSku(sku)) {
    return NextResponse.json({ error: 'Invalid sku. Must be "single" or "family".' }, { status: 400 });
  }
  if (!currency || !isValidCurrency(currency)) {
    return NextResponse.json({ error: 'Invalid currency. Must be "INR" or "USD".' }, { status: 400 });
  }
  // Validate locale against the visible-locales whitelist (anti-open-redirect via crafted locale).
  const locale = (locales as readonly string[]).includes(rawLocale) ? rawLocale : 'en';

  // Authenticate.
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Resolve the Stripe price ID for this (sku, currency) tuple.
  let priceId: string;
  try {
    priceId = resolveStripePriceId(sku, currency);
  } catch (err) {
    console.error('[kundali/checkout] resolveStripePriceId failed:', err);
    return NextResponse.json(
      { error: 'Payment not configured for this product. Operator must run the setup script.' },
      { status: 503 },
    );
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
  }

  // Short-circuit duplicate-click protection — if the same user opened
  // a kundali checkout within the last 5 minutes that hasn't completed,
  // refuse a new session. The previous one is still valid.
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data: recent } = await supabase
    .from('pending_checkouts')
    .select('stripe_session_id')
    .eq('user_id', user.id)
    .like('tier', 'kundali_%')
    .is('completed_at', null)
    .gt('created_at', fiveMinAgo)
    .limit(1);
  if (recent && recent.length > 0) {
    return NextResponse.json(
      { error: 'You already have a pending kundali checkout. Finish it first or wait a few minutes.' },
      { status: 429 },
    );
  }

  const stripe = new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
    maxNetworkRetries: 3,
  });

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      success_url: `${BASE_URL}/${locale}/account/credits?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${BASE_URL}/${locale}/account/credits?status=cancelled`,
      metadata: {
        kundali_paywall: 'true',
        sku,
        user_id: user.id, // logged + cross-checked against pending_checkouts at webhook time
        credits_granted: String(KUNDALI_PRODUCTS[sku].creditsGranted),
        currency,
      },
    });
  } catch (err) {
    console.error('[kundali/checkout] Stripe session create failed:', err);
    return NextResponse.json({ error: 'Failed to start checkout' }, { status: 502 });
  }
  if (!session.url) {
    return NextResponse.json({ error: 'Stripe returned no checkout URL' }, { status: 502 });
  }

  // Server-bound binding row — webhook trusts pending_checkouts.user_id,
  // not session.metadata.user_id. tier carries the kundali SKU prefix.
  const { error: bindErr } = await supabase
    .from('pending_checkouts')
    .insert({
      stripe_session_id: session.id,
      user_id: user.id,
      tier: `kundali_${sku}`,
      billing: 'one_time',
      currency,
    });
  if (bindErr) {
    console.error('[kundali/checkout] pending_checkouts insert failed:', bindErr.message);
    // The session is already created in Stripe — if we let the user
    // through and the webhook fires, it'll refuse to credit (no binding
    // row). Refuse here so the user retries cleanly.
    return NextResponse.json({ error: 'Internal error binding checkout' }, { status: 500 });
  }

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
