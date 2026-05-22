/**
 * POST /api/brihaspati/webhook/razorpay
 *
 * Idempotent Razorpay webhook handler. Verifies signature, deduplicates
 * via brihaspati_webhook_events, then updates question / credit /
 * subscription state per event type.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { verifyWebhookSignature } from '@/lib/brihaspati/payment/razorpay';
import { grantCredits, setSubscription } from '@/lib/brihaspati/credits/credit-manager';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get('x-razorpay-signature') || '';
    if (!verifyWebhookSignature(rawBody, sig)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const supabase = getServerSupabase();
    if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

    const event = JSON.parse(rawBody) as RazorpayEvent;
    const eventId = event?.payload?.payment?.entity?.id
      ?? event?.payload?.subscription?.entity?.id
      ?? event?.id
      ?? `${event.event}-${Date.now()}`;

    // Idempotency: insert into ledger; ON CONFLICT no-op (unique
    // constraint on (provider, provider_event_id)).
    const { error: idemErr } = await supabase
      .from('brihaspati_webhook_events')
      .insert({
        provider: 'razorpay',
        provider_event_id: eventId,
        event_type: event.event,
        payload: event,
      });
    if (idemErr && !/duplicate key|unique constraint/i.test(idemErr.message)) {
      console.error('[brihaspati/webhook/razorpay] idempotency write failed:', idemErr.message);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
    if (idemErr) {
      // Duplicate delivery — silently acknowledge.
      return NextResponse.json({ received: true, dedup: true });
    }

    switch (event.event) {
      case 'payment.captured': {
        const ent = event.payload?.payment?.entity;
        if (!ent) break;
        const userId = ent.notes?.user_id;
        const questionId = ent.notes?.question_id;
        const tier = ent.notes?.tier;
        if (!userId || !questionId || !tier) {
          console.error('[brihaspati/webhook/razorpay] payment missing notes');
          break;
        }
        await supabase
          .from('brihaspati_questions')
          .update({ payment_verified: true, provider: 'razorpay' })
          .eq('id', questionId);
        if (tier === 'pack_5') {
          await grantCredits(supabase as never, userId, 'pack_5', 'razorpay', ent.id);
        }
        break;
      }
      case 'subscription.activated':
      case 'subscription.charged': {
        const sub = event.payload?.subscription?.entity;
        if (!sub) break;
        const userId = sub.notes?.user_id;
        const tier = sub.notes?.tier;
        if (!userId || (tier !== 'monthly' && tier !== 'annual')) break;
        const expires = sub.current_end
          ? new Date(sub.current_end * 1000).toISOString()
          : new Date(Date.now() + (tier === 'annual' ? 365 : 30) * 86400 * 1000).toISOString();
        await setSubscription(supabase as never, userId, tier, expires, 'razorpay');
        break;
      }
      case 'subscription.cancelled': {
        // Handled by getActiveSubscription's expires_at check; nothing
        // to do here unless we want immediate cancellation.
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[brihaspati/webhook/razorpay] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

interface RazorpayEvent {
  id?: string;
  event: string;
  payload?: {
    payment?: {
      entity?: {
        id: string;
        amount: number;
        notes?: { user_id?: string; question_id?: string; tier?: string };
      };
    };
    subscription?: {
      entity?: {
        id: string;
        current_end?: number;
        notes?: { user_id?: string; tier?: string };
      };
    };
  };
}
