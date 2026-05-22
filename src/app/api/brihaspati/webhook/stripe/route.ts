/**
 * POST /api/brihaspati/webhook/stripe
 *
 * Idempotent Stripe webhook handler.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { verifyWebhookEvent } from '@/lib/brihaspati/payment/stripe';
import { grantCredits, setSubscription } from '@/lib/brihaspati/credits/credit-manager';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature') || '';
    const event = await verifyWebhookEvent(rawBody, sig);
    if (!event) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const supabase = getServerSupabase();
    if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

    // Skip events that aren't Brihaspati (metadata.brihaspati !== 'true').
    const obj = event.data?.object as StripeObject;
    if (!obj?.metadata || obj.metadata.brihaspati !== 'true') {
      return NextResponse.json({ received: true, ignored: true });
    }

    // Idempotency.
    const { error: idemErr } = await supabase
      .from('brihaspati_webhook_events')
      .insert({
        provider: 'stripe',
        provider_event_id: event.id,
        event_type: event.type,
        payload: event,
      });
    if (idemErr && !/duplicate key|unique constraint/i.test(idemErr.message)) {
      console.error('[brihaspati/webhook/stripe] idempotency write failed:', idemErr.message);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
    if (idemErr) {
      return NextResponse.json({ received: true, dedup: true });
    }

    const userId = obj.metadata.user_id;
    const questionId = obj.metadata.question_id;
    const tier = obj.metadata.tier;
    if (!userId || !tier) {
      return NextResponse.json({ received: true });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        if (questionId) {
          await supabase
            .from('brihaspati_questions')
            .update({ payment_verified: true, provider: 'stripe' })
            .eq('id', questionId);
        }
        if (tier === 'pack_5' && obj.id) {
          await grantCredits(supabase as never, userId, 'pack_5', 'stripe', obj.id);
        }
        if (tier === 'monthly' || tier === 'annual') {
          const expires = new Date(
            Date.now() + (tier === 'annual' ? 365 : 30) * 86400 * 1000,
          ).toISOString();
          await setSubscription(supabase as never, userId, tier, expires, 'stripe');
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'invoice.paid': {
        // Subscription renewals: extend expiry. The current_period_end
        // is on the subscription object, which may need a follow-up
        // API call to fetch — for now, conservative extension.
        if (tier === 'monthly' || tier === 'annual') {
          const expires = new Date(
            Date.now() + (tier === 'annual' ? 365 : 30) * 86400 * 1000,
          ).toISOString();
          await setSubscription(supabase as never, userId, tier, expires, 'stripe');
        }
        break;
      }
      case 'customer.subscription.deleted': {
        // Hard cancellation — expire now.
        if (tier === 'monthly' || tier === 'annual') {
          await setSubscription(supabase as never, userId, tier, new Date().toISOString(), 'stripe');
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[brihaspati/webhook/stripe] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

interface StripeObject {
  id?: string;
  metadata?: {
    brihaspati?: string;
    user_id?: string;
    question_id?: string;
    tier?: string;
  };
}
