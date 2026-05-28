import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

export async function POST(req: Request) {
  const ip = getClientIP(req);
  const { allowed } = checkRateLimit(ip, { maxRequests: 10, windowMs: 60000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before making more requests.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'Retry-After': '60' } },
    );
  }

  let body: { tier: 'pro' | 'jyotishi'; billing: 'monthly' | 'annual'; currency: 'INR' | 'USD' };
  try {
    body = await req.json() as typeof body;
  } catch {
    // req.json() fails when body is missing or not valid JSON
    return NextResponse.json({ error: 'Invalid or missing JSON body' }, { status: 400 });
  }

  try {
    const { tier, billing, currency } = body;

    if (!tier || !billing || !currency) {
      return NextResponse.json({ error: 'Missing required fields: tier, billing, currency' }, { status: 400 });
    }

    // Authenticate user
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
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Round 2 IDEM-3 — short-circuit recent pending checkouts to prevent
    // duplicate Stripe sessions / Razorpay subscriptions from rapid clicks.
    // The client-side `isSubmitting` guard (pricing/page.tsx) is first
    // line of defence; this is server-side defence-in-depth for retries
    // from a stuck network. Window: 5 minutes.
    const FIVE_MIN_AGO = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    if (currency === 'USD') {
      // Stripe checkout
      const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
      if (!secretKey) {
        return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
      }

      // Look up an open pending row for this user + tier + billing
      // in the last 5 minutes. If found, refuse the duplicate request
      // (the client should poll the existing session). We don't return
      // the original URL because the Stripe session URL is a one-time
      // use that may have been consumed already.
      const { data: pendingDup, error: pendingDupErr } = await supabase
        .from('pending_checkouts')
        .select('stripe_session_id')
        .eq('user_id', user.id)
        .eq('tier', tier)
        .is('completed_at', null)
        .gte('created_at', FIVE_MIN_AGO)
        .limit(1)
        .maybeSingle();
      if (pendingDupErr) {
        console.error('[checkout] pending_checkouts dup lookup failed:', pendingDupErr.message);
        // Fail closed — better to refuse than to double-charge.
        return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
      }
      if (pendingDup?.stripe_session_id) {
        return NextResponse.json({
          error: 'A checkout session is already in progress. Please complete or cancel it first.',
          duplicate: true,
        }, { status: 409 });
      }

      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(secretKey, {
        httpClient: Stripe.createFetchHttpClient(),
        maxNetworkRetries: 3,
      });

      const priceMap: Record<string, string | undefined> = {
        'pro_monthly': process.env.STRIPE_PRICE_PRO_MONTHLY,
        'pro_annual': process.env.STRIPE_PRICE_PRO_ANNUAL,
        'jyotishi_monthly': process.env.STRIPE_PRICE_JYOTISHI_MONTHLY,
        'jyotishi_annual': process.env.STRIPE_PRICE_JYOTISHI_ANNUAL,
      };

      const priceId = priceMap[`${tier}_${billing}`]?.trim();
      if (!priceId) {
        return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
      }

      // Open-redirect guard: NEVER use the request Origin header for the
      // Stripe success/cancel URLs — it's attacker-controlled and Stripe
      // will happily redirect there post-payment (phishing). Pin to the
      // server-controlled NEXT_PUBLIC_SITE_URL. Strip a trailing slash so
      // path concatenation doesn't produce `//pricing`.
      const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim().replace(/\/+$/, '');

      // Reuse existing Stripe customer to avoid duplicates on resubscribe
      let customerId: string | undefined;
      if (user.email) {
        try {
          const existing = await stripe.customers.list({ email: user.email, limit: 1 });
          if (existing.data.length > 0) customerId = existing.data[0].id;
        } catch (err) {
          console.error('[checkout] Stripe customer lookup failed:', err);
        }
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/pricing?session_id={CHECKOUT_SESSION_ID}&status=success`,
        cancel_url: `${origin}/pricing?status=cancelled`,
        ...(customerId ? { customer: customerId } : { customer_email: user.email }),
        metadata: { user_id: user.id, tier },
      });

      // P0-5 — bind the session to this authenticated user server-side.
      // The Stripe webhook will verify the metadata.user_id matches this
      // row before crediting the subscription, preventing an attacker who
      // controls a Stripe customer from crafting a session with a victim's
      // user_id in the metadata.
      if (!session.id) {
        // Defensive — Stripe always returns an id on successful create
        console.error('[checkout] Stripe session missing id; cannot bind');
        return NextResponse.json({ error: 'Checkout session creation failed' }, { status: 500 });
      }
      const { error: pendingErr } = await supabase
        .from('pending_checkouts')
        .insert({
          stripe_session_id: session.id,
          user_id: user.id,
          tier,
          billing,
          currency,
        });
      if (pendingErr) {
        // Fail loud: an un-bound session means the webhook can't verify the
        // user_id later. Better to refuse the checkout than ship a session
        // that bypasses the binding gate.
        console.error('[checkout] pending_checkouts insert failed:', pendingErr.message);
        return NextResponse.json({ error: 'Checkout binding failed' }, { status: 500 });
      }

      return NextResponse.json({ url: session.url });
    }

    if (currency === 'INR') {
      // Razorpay checkout
      const keyId = process.env.RAZORPAY_KEY_ID?.trim();
      const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
      if (!keyId || !keySecret) {
        return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
      }

      // Round 2 IDEM-3 — same short-circuit as the Stripe branch above.
      // Razorpay duplicates are worse: two subscriptions = two monthly
      // bills until manual cancellation, with no auto-merge.
      const { data: pendingDup, error: pendingDupErr } = await supabase
        .from('pending_razorpay_subscriptions')
        .select('razorpay_subscription_id')
        .eq('user_id', user.id)
        .eq('tier', tier)
        .is('completed_at', null)
        .gte('created_at', FIVE_MIN_AGO)
        .limit(1)
        .maybeSingle();
      if (pendingDupErr) {
        console.error('[checkout] pending_razorpay_subscriptions dup lookup failed:', pendingDupErr.message);
        return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
      }
      if (pendingDup?.razorpay_subscription_id) {
        return NextResponse.json({
          error: 'A subscription request is already in progress. Please complete or cancel it first.',
          duplicate: true,
        }, { status: 409 });
      }

      const Razorpay = (await import('razorpay')).default;
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

      const planMap: Record<string, string | undefined> = {
        'pro_monthly': process.env.RAZORPAY_PLAN_PRO_MONTHLY,
        'pro_annual': process.env.RAZORPAY_PLAN_PRO_ANNUAL,
        'jyotishi_monthly': process.env.RAZORPAY_PLAN_JYOTISHI_MONTHLY,
        'jyotishi_annual': process.env.RAZORPAY_PLAN_JYOTISHI_ANNUAL,
      };

      const planId = planMap[`${tier}_${billing}`]?.trim();
      if (!planId) {
        return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
      }

      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        total_count: billing === 'annual' ? 1 : 12,
        notes: { user_id: user.id, tier },
      });

      // Round 2 SEC-3/SEC-4/IDEM-2 — bind the Razorpay subscription to this
      // authenticated user server-side. The webhook will verify notes.user_id
      // matches this row before crediting, preventing an attacker who
      // controls a Razorpay merchant account from crafting a subscription
      // whose notes name a victim's user_id. Mirrors the Stripe pattern at
      // line 109 above.
      if (!subscription.id) {
        console.error('[checkout] Razorpay subscription missing id; cannot bind');
        return NextResponse.json({ error: 'Checkout session creation failed' }, { status: 500 });
      }
      const { error: pendingErr } = await supabase
        .from('pending_razorpay_subscriptions')
        .insert({
          razorpay_subscription_id: subscription.id,
          user_id: user.id,
          tier,
          billing,
        });
      if (pendingErr) {
        // Fail loud: an un-bound subscription means the webhook can't verify
        // the user_id later. Better to refuse than to ship a subscription
        // that bypasses the binding gate.
        console.error('[checkout] pending_razorpay_subscriptions insert failed:', pendingErr.message);
        return NextResponse.json({ error: 'Checkout binding failed' }, { status: 500 });
      }

      return NextResponse.json({ url: subscription.short_url });
    }

    return NextResponse.json({ error: 'Invalid currency' }, { status: 400 });
  } catch (err) {
    console.error('[checkout] error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
