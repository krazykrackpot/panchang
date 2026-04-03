import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { tier, billing, currency } = await req.json() as {
      tier: 'pro' | 'jyotishi';
      billing: 'monthly' | 'annual';
      currency: 'INR' | 'USD';
    };

    if (!tier || !billing || !currency) {
      return NextResponse.json({ error: 'Missing required fields: tier, billing, currency' }, { status: 400 });
    }

    // Authenticate user
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currency === 'USD') {
      // Stripe checkout
      const secretKey = process.env.STRIPE_SECRET_KEY;
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

      const priceId = priceMap[`${tier}_${billing}`];
      if (!priceId) {
        return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
      }

      const origin = req.headers.get('origin') || 'http://localhost:3000';
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/pricing?session_id={CHECKOUT_SESSION_ID}&status=success`,
        cancel_url: `${origin}/pricing?status=cancelled`,
        customer_email: user.email,
        metadata: { user_id: user.id, tier },
      });

      return NextResponse.json({ url: session.url });
    }

    if (currency === 'INR') {
      // Razorpay checkout
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
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

      const planId = planMap[`${tier}_${billing}`];
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
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Checkout error:', msg, err);
    return NextResponse.json({ error: msg || 'Failed to create checkout session' }, { status: 500 });
  }
}
