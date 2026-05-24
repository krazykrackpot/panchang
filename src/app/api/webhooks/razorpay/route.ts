import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSupabase } from '@/lib/supabase/server';
import { invalidateTierCache } from '@/lib/subscription/check-access';

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    subscription: {
      entity: {
        id: string;
        plan_id: string;
        status: string;
        customer_id?: string;
        current_start: number | null;
        current_end: number | null;
        notes: {
          user_id?: string;
          tier?: string;
        };
      };
    };
  };
}

// PostgreSQL unique-violation SQLSTATE — used to detect that a webhook
// event was already dedup'd into processed_webhook_events.
const PG_UNIQUE_VIOLATION = '23505';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get('x-razorpay-signature') || '';
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();

    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    const expected = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
    // Timing-safe comparison to prevent signature forgery via timing analysis
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expected);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data: RazorpayWebhookPayload = JSON.parse(body);
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Round 2 SF-2 / IDEM-1 — event-id idempotency. Razorpay retries
    // deliveries for up to 24h with exponential backoff and can deliver
    // out of order. A replayed subscription.activated arriving after a
    // newer subscription.cancelled would silently resurrect the cancelled
    // sub without this dedup. Mirrors the Stripe handler's processed_
    // webhook_events pattern (migration 033).
    //
    // The dedup row is inserted with status='processing' first; only flips
    // to 'completed' after the work succeeds. On a unique-violation we
    // look up the existing row — if completed, dedup; if still processing
    // (previous attempt crashed mid-flight), fall through and reprocess.
    const eventId = req.headers.get('x-razorpay-event-id');
    if (!eventId) {
      console.error('[razorpay-webhook] missing x-razorpay-event-id header');
      return NextResponse.json({ error: 'Missing event id' }, { status: 400 });
    }
    const { error: idemErr } = await supabase
      .from('processed_webhook_events')
      .insert({
        provider: 'razorpay',
        provider_event_id: eventId,
        event_type: data.event,
        payload: data as unknown as Record<string, unknown>,
        status: 'processing',
      });
    if (idemErr && (idemErr as { code?: string }).code !== PG_UNIQUE_VIOLATION) {
      console.error('[razorpay-webhook] idempotency insert failed:', idemErr.message);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
    if (idemErr) {
      const { data: existing, error: lookupErr } = await supabase
        .from('processed_webhook_events')
        .select('status')
        .eq('provider', 'razorpay')
        .eq('provider_event_id', eventId)
        .single();
      if (lookupErr) {
        console.error('[razorpay-webhook] dedup lookup failed:', lookupErr.message);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
      }
      if (existing?.status === 'completed') {
        return NextResponse.json({ received: true, dedup: true });
      }
      // status === 'processing' — fall through and retry the work.
    }

    const entity = data.payload.subscription.entity;
    const metaUserId = entity.notes?.user_id;
    const tier = entity.notes?.tier;

    if (!metaUserId) {
      // Razorpay won't retry a 200, so a missing notes.user_id here
      // means the subscription is orphaned with no way to associate
      // it with a Panchang user — customer paid in INR and gets no
      // Pro entitlement, silently. Log loudly so ops can manually
      // remediate. Audit H3.
      console.error('[razorpay-webhook] missing user_id in notes:', {
        event: data.event,
        subscriptionId: entity.id,
        customerId: entity.customer_id,
      });
      // Still mark this event 'completed' so retries don't re-enter.
      await markEventCompleted(supabase, eventId);
      return NextResponse.json({ received: true });
    }

    // Round 2 SEC-3 / IDEM-2 — server-side binding verification. The
    // notes.user_id is attacker-influenceable at subscription-creation
    // time (an attacker who controls a Razorpay merchant account can
    // craft notes naming a victim's user_id). We MUST cross-check it
    // against the pending_razorpay_subscriptions row written by
    // /api/checkout on the authenticated path. Mirrors the Stripe
    // pattern (migration 035 / pending_checkouts).
    const { data: pending, error: pendingErr } = await supabase
      .from('pending_razorpay_subscriptions')
      .select('user_id, tier, completed_at')
      .eq('razorpay_subscription_id', entity.id)
      .single();

    if (pendingErr && pendingErr.code !== 'PGRST116') {
      console.error('[razorpay-webhook] pending lookup failed:', pendingErr.message);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
    if (!pending) {
      // No binding row — subscription was not created by our /api/checkout.
      // Could be: a pre-Sprint 18 subscription created before this migration
      // shipped, a manual Razorpay dashboard subscription, or a
      // notes-spoofed attack. Refuse to credit; return 200 so Razorpay
      // stops retrying.
      console.error('[razorpay-webhook] SECURITY: no pending_razorpay_subscriptions row for subscription', {
        subscriptionId: entity.id,
        metaUserId,
        tier,
        event: data.event,
      });
      await markEventCompleted(supabase, eventId);
      return NextResponse.json({ received: true, ignored: true });
    }
    if (metaUserId !== pending.user_id) {
      console.error('[razorpay-webhook] SECURITY: notes.user_id mismatch with pending row', {
        subscriptionId: entity.id,
        metaUserId,
        boundUserId: pending.user_id,
        event: data.event,
      });
      // Treat as attack signal. Mark event complete so we don't reprocess.
      await markEventCompleted(supabase, eventId);
      return NextResponse.json({ received: true, ignored: true });
    }

    // Trust the SERVER-bound user_id, not the metadata, even though they
    // match here. Defence-in-depth: if the comparison above ever loosens
    // by accident, the credit still goes to the right user.
    const userId = pending.user_id;
    const effectiveTier = pending.tier; // server-bound; notes only logged

    switch (data.event) {
      case 'subscription.activated': {
        // Round 2 SF-1 — fail-loud DB writes. Previous handler discarded
        // { error } so any RLS / column / connection blip would silently
        // fail and Razorpay would never retry (since we ACKed 200).
        const { error: upsertErr } = await supabase.from('subscriptions').upsert({
          user_id: userId,
          provider: 'razorpay',
          status: 'active',
          tier: effectiveTier,
          provider_subscription_id: entity.id,
          provider_customer_id: entity.customer_id || null,
          current_period_start: entity.current_start
            ? new Date(entity.current_start * 1000).toISOString()
            : null,
          current_period_end: entity.current_end
            ? new Date(entity.current_end * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
        if (upsertErr) {
          console.error('[razorpay-webhook] subscription upsert failed:', upsertErr.message, 'userId=', userId);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        invalidateTierCache(userId);

        // Stamp the pending row as completed for replay dedup.
        const { error: completeErr } = await supabase
          .from('pending_razorpay_subscriptions')
          .update({ completed_at: new Date().toISOString() })
          .eq('razorpay_subscription_id', entity.id);
        if (completeErr) {
          console.error('[razorpay-webhook] pending completion update failed:', completeErr.message);
        }
        break;
      }

      case 'subscription.charged': {
        const { error: updateErr } = await supabase.from('subscriptions').update({
          status: 'active',
          current_period_start: entity.current_start
            ? new Date(entity.current_start * 1000).toISOString()
            : null,
          current_period_end: entity.current_end
            ? new Date(entity.current_end * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId);
        if (updateErr) {
          console.error('[razorpay-webhook] subscription charge update failed:', updateErr.message, 'userId=', userId);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        invalidateTierCache(userId);
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.paused': {
        const { error: updateErr } = await supabase.from('subscriptions').update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId);
        if (updateErr) {
          console.error('[razorpay-webhook] subscription cancel update failed:', updateErr.message, 'userId=', userId);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        invalidateTierCache(userId);
        break;
      }
    }

    // Work succeeded — flip the dedup row to 'completed' so subsequent
    // retries of the same event.id from Razorpay short-circuit. If this
    // update fails, log but still return 200 — the work itself succeeded;
    // missing the status flip means at most a single reprocessing on
    // the next retry (handlers are idempotent: upsert on user_id,
    // updates by user_id).
    await markEventCompleted(supabase, eventId);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[razorpay-webhook] error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function markEventCompleted(
  supabase: NonNullable<ReturnType<typeof getServerSupabase>>,
  eventId: string,
): Promise<void> {
  const { error } = await supabase
    .from('processed_webhook_events')
    .update({ status: 'completed', processed_at: new Date().toISOString() })
    .eq('provider', 'razorpay')
    .eq('provider_event_id', eventId);
  if (error) {
    console.error('[razorpay-webhook] idempotency completion update failed:', error.message);
  }
}
