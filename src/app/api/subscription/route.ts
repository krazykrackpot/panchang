import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
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

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
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
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json() as { action: string };

    if (action === 'cancel') {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!subscription) {
        return NextResponse.json({ error: 'No active subscription' }, { status: 404 });
      }

      // Update DB to cancel at period end
      await supabase.from('subscriptions').update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id);

      // Optionally cancel with provider
      if (subscription.provider === 'stripe' && subscription.provider_subscription_id) {
        try {
          const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
          if (secretKey) {
            const { default: Stripe } = await import('stripe');
            const stripe = new Stripe(secretKey, {
              httpClient: Stripe.createFetchHttpClient(),
              maxNetworkRetries: 3,
            });
            await stripe.subscriptions.update(subscription.provider_subscription_id, {
              cancel_at_period_end: true,
            });
          }
        } catch (providerErr) {
          console.error('Failed to cancel with Stripe:', providerErr);
        }
      }

      if (subscription.provider === 'razorpay' && subscription.provider_subscription_id) {
        try {
          const keyId = process.env.RAZORPAY_KEY_ID;
          const keySecret = process.env.RAZORPAY_KEY_SECRET;
          if (keyId && keySecret) {
            const Razorpay = (await import('razorpay')).default;
            const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
            await razorpay.subscriptions.cancel(subscription.provider_subscription_id);
          }
        } catch (providerErr) {
          console.error('Failed to cancel with Razorpay:', providerErr);
        }
      }

      return NextResponse.json({ success: true, message: 'Subscription will cancel at period end' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Subscription POST error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
