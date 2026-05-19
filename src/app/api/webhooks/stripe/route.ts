import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSupabase } from '@/lib/supabase/server';
import { invalidateTierCache } from '@/lib/subscription/check-access';

/** Safely extract an ID from a Stripe field that may be a string or expanded object. */
function getStripeId(data: string | { id: string } | null | undefined): string | undefined {
  if (!data) return undefined;
  return typeof data === 'string' ? data : data.id;
}

function getStripe() {
  return new Stripe((process.env.STRIPE_SECRET_KEY || '').trim(), {
    apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion,
    httpClient: Stripe.createFetchHttpClient(),
    maxNetworkRetries: 3,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const tier = session.metadata?.tier;

        if (userId && tier && session.subscription && session.customer) {
          // Retrieve full subscription for period dates. Let errors propagate
          // so Stripe retries the webhook (returns 500 via outer catch).
          const subId = getStripeId(session.subscription)!;
          const fullSub = await getStripe().subscriptions.retrieve(subId);
          const item = fullSub.items?.data?.[0];

          await supabase.from('subscriptions').upsert({
            user_id: userId,
            provider: 'stripe',
            status: 'active',
            tier,
            provider_subscription_id: subId,
            provider_customer_id: getStripeId(session.customer)!,
            current_period_start: item?.current_period_start ? new Date(item.current_period_start * 1000).toISOString() : null,
            current_period_end: item?.current_period_end ? new Date(item.current_period_end * 1000).toISOString() : null,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

          invalidateTierCache(userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = getStripeId(subscription.customer);
        if (!customerId) break;

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('provider_customer_id', customerId)
          .single();

        if (sub) {
          // 'cancelling' = scheduled to cancel at period end but still active until then.
          // check-access.ts treats 'cancelling' as active. Only 'cancelled' = actually expired.
          const status = subscription.cancel_at_period_end ? 'cancelling' : subscription.status;
          const item = subscription.items?.data?.[0];
          // Period dates: prefer subscription-level, fall back to item-level
          const stripeSub = subscription as unknown as Record<string, unknown>;
          const periodStart = (stripeSub.current_period_start as number | undefined) ?? item?.current_period_start;
          const periodEnd = (stripeSub.current_period_end as number | undefined) ?? item?.current_period_end;
          const updateData: Record<string, string> = {
            status,
            updated_at: new Date().toISOString(),
          };
          if (periodStart) {
            updateData.current_period_start = new Date(periodStart * 1000).toISOString();
          }
          if (periodEnd) {
            updateData.current_period_end = new Date(periodEnd * 1000).toISOString();
          }
          await supabase.from('subscriptions').update(updateData).eq('user_id', sub.user_id);

          invalidateTierCache(sub.user_id as string);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = getStripeId(subscription.customer);
        if (!customerId) break;

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('provider_customer_id', customerId)
          .single();

        if (sub) {
          await supabase.from('subscriptions').update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          }).eq('user_id', sub.user_id);

          invalidateTierCache(sub.user_id as string);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = getStripeId(invoice.customer);
        if (!customerId) break;

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('provider_customer_id', customerId)
          .single();

        if (sub) {
          await supabase.from('subscriptions').update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          }).eq('user_id', sub.user_id);

          invalidateTierCache(sub.user_id as string);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
