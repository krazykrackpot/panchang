/**
 * /api/pandit/checkout
 *
 * POST — create a Stripe checkout session for a Pandit-tier subscription
 *        (`pandit_pro` or `pandit_unlimited`, monthly or annual). Mirrors
 *        the binding pattern used by the seeker /api/checkout route:
 *        a `pending_checkouts` row binds the session to the
 *        authenticated user.id so the webhook handler can verify
 *        metadata.user_id at credit time (defence against metadata
 *        tampering at session-creation time).
 *
 * Auth: Bearer JWT of an account_type='pandit' user.
 *
 * Pandit CRM P10.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';
import { BASE_URL } from '@/lib/seo/base-url';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';
import { getPanditStripePriceId } from '@/lib/pandit/subscription';

interface CheckoutBody {
  tier?: 'pandit_pro' | 'pandit_unlimited';
  billing?: 'monthly' | 'annual';
}

export async function POST(req: Request) {
  // Rate-limit early — separate from auth so unauthenticated spam can't
  // exhaust DB connections via authenticatePandit's JWT verification.
  const ip = getClientIP(req);
  const { allowed } = checkRateLimit(ip, { maxRequests: 5, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'rate_limited', message: 'Please wait a minute before retrying.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase, userId, user } = auth;

  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const tier = body.tier;
  const billing = body.billing;
  if (tier !== 'pandit_pro' && tier !== 'pandit_unlimited') {
    return NextResponse.json({ error: 'invalid_tier' }, { status: 400 });
  }
  if (billing !== 'monthly' && billing !== 'annual') {
    return NextResponse.json({ error: 'invalid_billing' }, { status: 400 });
  }

  const secretKey = (process.env.STRIPE_SECRET_KEY ?? '').trim();
  if (!secretKey) {
    console.error('[pandit/checkout] STRIPE_SECRET_KEY missing');
    return NextResponse.json({ error: 'payment_not_configured' }, { status: 503 });
  }

  const priceId = getPanditStripePriceId(tier, billing);
  if (!priceId) {
    console.error(`[pandit/checkout] price id missing for ${tier}_${billing}`);
    return NextResponse.json({ error: 'payment_not_configured' }, { status: 503 });
  }

  // Short-circuit if there's already a pending Pandit checkout for this
  // user+tier in the last 5 minutes. Mirrors /api/checkout IDEM-3
  // (Round 2). Pandit checkouts share the `pending_checkouts` table.
  const FIVE_MIN_AGO = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data: pendingDup, error: pendingDupErr } = await supabase
    .from('pending_checkouts')
    .select('stripe_session_id')
    .eq('user_id', userId)
    .eq('tier', tier)
    .is('completed_at', null)
    .gte('created_at', FIVE_MIN_AGO)
    .limit(1)
    .maybeSingle();
  if (pendingDupErr) {
    console.error('[pandit/checkout] pending_checkouts dup lookup failed:', pendingDupErr.message);
    return NextResponse.json({ error: 'service_unavailable' }, { status: 503 });
  }
  if (pendingDup?.stripe_session_id) {
    return NextResponse.json(
      { error: 'checkout_in_progress', message: 'A checkout session is already open for this tier.' },
      { status: 409 },
    );
  }

  try {
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
      maxNetworkRetries: 3,
    });

    // Reuse an existing Stripe customer to avoid duplicates on re-subscribe.
    let customerId: string | undefined;
    if (user.email) {
      try {
        const existing = await stripe.customers.list({ email: user.email, limit: 1 });
        if (existing.data.length > 0) customerId = existing.data[0].id;
      } catch (err) {
        console.error('[pandit/checkout] Stripe customer lookup failed:', err);
      }
    }

    // Open-redirect guard: NEVER use the request Origin header for the
    // success/cancel URLs (see /api/checkout for the long-form reasoning).
    // BASE_URL is pinned to NEXT_PUBLIC_SITE_URL.
    const origin = BASE_URL;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${origin}/dashboard/settings?status=cancelled`,
      ...(customerId ? { customer: customerId } : { customer_email: user.email ?? undefined }),
      metadata: {
        user_id: userId,
        tier,
        // `product: 'pandit'` lets the webhook handler distinguish
        // Pandit checkouts from seeker checkouts without parsing the tier
        // string. The webhook trusts `pending_checkouts.tier` for the
        // actual subscription credit (server-bound).
        product: 'pandit',
      },
    });

    if (!session.id) {
      console.error('[pandit/checkout] Stripe session missing id; cannot bind');
      return NextResponse.json({ error: 'checkout_failed' }, { status: 500 });
    }

    const { error: pendingErr } = await supabase
      .from('pending_checkouts')
      .insert({
        stripe_session_id: session.id,
        user_id: userId,
        tier,
        billing,
        currency: 'USD',
      });
    if (pendingErr) {
      console.error('[pandit/checkout] pending_checkouts insert failed:', pendingErr.message);
      return NextResponse.json({ error: 'checkout_binding_failed' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[pandit/checkout] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
