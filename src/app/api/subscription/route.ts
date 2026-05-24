import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.slice(7).trim();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows; treat as "free tier". Anything else is a real
      // DB error — log it with a tag so a transient RLS/network glitch
      // doesn't silently downgrade a paying user to "no subscription" on
      // the dashboard. Audit H1.
      console.error('[subscription] GET fetch failed:', error.message);
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }

    return NextResponse.json({
      subscription: subscription || null,
      tier: subscription?.tier || 'free',
      status: subscription?.status || 'none',
    });
  } catch (err) {
    console.error('Subscription GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.slice(7).trim();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json() as { action: string };

    if (action === 'cancel') {
      const { data: subscription, error: lookupErr } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (lookupErr && lookupErr.code !== 'PGRST116') {
        console.error('[subscription] cancel lookup failed:', lookupErr.message);
        return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
      }
      if (!subscription) {
        return NextResponse.json({ error: 'No active subscription' }, { status: 404 });
      }

      // Round 3 R3-SF-1 / R3-SF-2 — provider-FIRST cancellation. The
      // previous order was: (1) update DB (no error capture), (2) try
      // provider call (error swallowed). Two half-states resulted:
      //   - DB write fails silently → UI says "will cancel" but DB
      //     unchanged → user keeps getting billed.
      //   - DB write succeeds, provider call fails → DB says cancelling,
      //     provider still billing → user thinks they cancelled but
      //     card is still being charged.
      // Provider-first ordering means: if the provider call fails we
      // return 502 to the user and the DB stays in its original state
      // (no inconsistency). Provider success is the prerequisite for
      // the DB update. If the DB update fails AFTER provider success
      // (rare but possible — RLS / transient blip), the user retries
      // and the provider call is idempotent (Stripe/Razorpay accept
      // repeated cancel-at-period-end without side effects).
      if (subscription.provider === 'stripe' && subscription.provider_subscription_id) {
        const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
        if (secretKey) {
          try {
            const { default: Stripe } = await import('stripe');
            const stripe = new Stripe(secretKey, {
              httpClient: Stripe.createFetchHttpClient(),
              maxNetworkRetries: 3,
            });
            await stripe.subscriptions.update(subscription.provider_subscription_id, {
              cancel_at_period_end: true,
            });
          } catch (providerErr) {
            console.error('[subscription] Stripe cancel failed:', providerErr, 'userId=', user.id);
            return NextResponse.json(
              { error: 'Unable to cancel with payment provider. Please try again.' },
              { status: 502 },
            );
          }
        }
      }

      if (subscription.provider === 'razorpay' && subscription.provider_subscription_id) {
        const keyId = process.env.RAZORPAY_KEY_ID?.trim();
        const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
        if (keyId && keySecret) {
          try {
            const Razorpay = (await import('razorpay')).default;
            const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
            await razorpay.subscriptions.cancel(subscription.provider_subscription_id);
          } catch (providerErr) {
            console.error('[subscription] Razorpay cancel failed:', providerErr, 'userId=', user.id);
            return NextResponse.json(
              { error: 'Unable to cancel with payment provider. Please try again.' },
              { status: 502 },
            );
          }
        }
      }

      // Provider cancel succeeded — now persist the DB flip with error
      // capture. If this fails, the provider has already cancelled but
      // our DB still shows active; the next webhook delivery from the
      // provider will reconcile, but surface the error so ops can see.
      const { error: dbErr } = await supabase.from('subscriptions').update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id);
      if (dbErr) {
        console.error('[subscription] DB cancel-flip failed:', dbErr.message, 'userId=', user.id);
        // Provider call already succeeded. Report the partial-state
        // 502 so the user retries; the provider cancel is idempotent.
        return NextResponse.json(
          { error: 'Cancellation processed at provider but database update failed. Please refresh.' },
          { status: 502 },
        );
      }

      return NextResponse.json({ success: true, message: 'Subscription will cancel at period end' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Subscription POST error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
