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

    if (currency === 'USD') {
      // Stripe checkout
      const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
      if (!secretKey) {
        return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
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
      const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim().replace(/\/$/, '');

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

      return NextResponse.json({ url: session.url });
    }

    if (currency === 'INR') {
      // Razorpay checkout
      const keyId = process.env.RAZORPAY_KEY_ID?.trim();
      const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
      if (!keyId || !keySecret) {
        return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
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

      return NextResponse.json({ url: subscription.short_url });
    }

    return NextResponse.json({ error: 'Invalid currency' }, { status: 400 });
  } catch (err) {
    console.error('[checkout] error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
