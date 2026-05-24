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
    } catch (err) {
      // Log the actual reason — without this, a rotated webhook secret or
      // a mangled body looks identical to a real attack in production
      // logs, and ops can't tell why legitimate Stripe events are being
      // rejected. Audit H2.
      console.error('[stripe-webhook] signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Idempotency: at-least-once delivery.
    //
    // We insert (provider, event_id) with status='processing' at the top.
    // After the work succeeds we flip it to 'completed'. On retry from
    // Stripe (3-day window, out-of-order delivery), the second handler
    // execution sees the existing row and only dedups if it's already
    // 'completed'. A row stuck in 'processing' means the previous attempt
    // failed mid-flight — we reprocess so Stripe doesn't lose the event.
    // (Without this, marking-before-work would silently drop events when
    // any downstream call — Stripe SDK retrieve, DB update — failed.
    // Gemini review on PR #133.)
    const PG_UNIQUE_VIOLATION = '23505';
    const { error: idemErr } = await supabase
      .from('processed_webhook_events')
      .insert({
        provider: 'stripe',
        provider_event_id: event.id,
        event_type: event.type,
        payload: event as unknown as Record<string, unknown>,
        status: 'processing',
      });

    if (idemErr && (idemErr as { code?: string }).code !== PG_UNIQUE_VIOLATION) {
      console.error('[stripe-webhook] idempotency insert failed:', idemErr.message);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }

    if (idemErr) {
      // Conflict — an earlier delivery already wrote this event.id. Check
      // whether the previous attempt completed; if so, dedup. If it's
      // still 'processing' (a previous handler crashed mid-flight), fall
      // through and reprocess.
      const { data: existing, error: lookupErr } = await supabase
        .from('processed_webhook_events')
        .select('status')
        .eq('provider', 'stripe')
        .eq('provider_event_id', event.id)
        .single();
      if (lookupErr) {
        console.error('[stripe-webhook] dedup lookup failed:', lookupErr.message);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
      }
      if (existing?.status === 'completed') {
        return NextResponse.json({ received: true, dedup: true });
      }
      // status === 'processing' — fall through and retry the work.
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metaUserId = session.metadata?.user_id;
        const tier = session.metadata?.tier;

        if (!session.subscription || !session.customer) {
          console.warn('[stripe-webhook] checkout.session.completed missing subscription/customer, skipping', {
            sessionId: session.id,
            hasSubscription: !!session.subscription,
            hasCustomer: !!session.customer,
          });
          break;
        }

        // P0-5 — server-side binding verification. The metadata.user_id is
        // attacker-influenceable at session-creation time; we MUST cross-
        // check it against the pending_checkouts row written by /api/checkout
        // on the authenticated path. Mirrors the brihaspati_questions pattern.
        const { data: pending, error: pendingErr } = await supabase
          .from('pending_checkouts')
          .select('user_id, tier, completed_at')
          .eq('stripe_session_id', session.id)
          .single();

        if (pendingErr && pendingErr.code !== 'PGRST116') {
          console.error('[stripe-webhook] pending_checkouts lookup failed:', pendingErr.message);
          return NextResponse.json({ error: 'Internal error' }, { status: 500 });
        }
        if (!pending) {
          // No binding row — session was not created by our /api/checkout.
          // Could be: very old session before P0-5 fix shipped, a manual
          // Stripe dashboard checkout, or a metadata-spoofed attack.
          console.error('[stripe-webhook] SECURITY: no pending_checkouts row for session', {
            sessionId: session.id,
            metaUserId,
            tier,
          });
          // Refuse to credit. Return 200 so Stripe stops retrying.
          break;
        }
        if (pending.completed_at) {
          // Already credited by an earlier webhook delivery (event.id dedup
          // above should have caught it, but this is a second line of defence).
          console.warn('[stripe-webhook] pending_checkouts already completed', { sessionId: session.id });
          break;
        }
        if (metaUserId !== pending.user_id) {
          console.error('[stripe-webhook] SECURITY: metadata.user_id mismatch with pending row', {
            sessionId: session.id,
            metaUserId,
            boundUserId: pending.user_id,
          });
          // Refuse to credit. Treat as attack signal.
          break;
        }

        // Trust the SERVER-bound user_id, not the metadata, even though they
        // match here. Defence-in-depth: if the comparison above ever loosens
        // by accident, the credit still goes to the right user.
        const userId = pending.user_id;
        const effectiveTier = pending.tier; // server-bound; metadata only logged

        const subId = getStripeId(session.subscription)!;
        const fullSub = await getStripe().subscriptions.retrieve(subId);
        const item = fullSub.items?.data?.[0];

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          provider: 'stripe',
          status: 'active',
          tier: effectiveTier,
          provider_subscription_id: subId,
          provider_customer_id: getStripeId(session.customer)!,
          current_period_start: item?.current_period_start ? new Date(item.current_period_start * 1000).toISOString() : null,
          current_period_end: item?.current_period_end ? new Date(item.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        invalidateTierCache(userId);

        // Stamp the pending row as completed for dedup on out-of-order replays
        const { error: completeErr } = await supabase
          .from('pending_checkouts')
          .update({ completed_at: new Date().toISOString() })
          .eq('stripe_session_id', session.id);
        if (completeErr) {
          console.error('[stripe-webhook] pending_checkouts completion update failed:', completeErr.message);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = getStripeId(subscription.customer);
        if (!customerId) break;

        const { data: sub, error: subLookupErr } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('provider_customer_id', customerId)
          .single();
        if (subLookupErr && subLookupErr.code !== 'PGRST116') {
          // PGRST116 = no rows (legitimate for unknown customer ids).
          // Any other error is a real DB problem — log AND return 500
          // so Stripe retries the webhook delivery. A silent fall-through
          // to the outer 200 here loses the event permanently. Audit H2
          // + Gemini #111 review.
          console.error('[stripe-webhook] subscription lookup failed:', subLookupErr.message, 'customerId=', customerId);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

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

        const { data: sub, error: subLookupErr } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('provider_customer_id', customerId)
          .single();
        if (subLookupErr && subLookupErr.code !== 'PGRST116') {
          // PGRST116 = no rows (legitimate for unknown customer ids).
          // Any other error is a real DB problem — log AND return 500
          // so Stripe retries the webhook delivery. A silent fall-through
          // to the outer 200 here loses the event permanently. Audit H2
          // + Gemini #111 review.
          console.error('[stripe-webhook] subscription lookup failed:', subLookupErr.message, 'customerId=', customerId);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

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

        const { data: sub, error: subLookupErr } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('provider_customer_id', customerId)
          .single();
        if (subLookupErr && subLookupErr.code !== 'PGRST116') {
          // PGRST116 = no rows (legitimate for unknown customer ids).
          // Any other error is a real DB problem — log AND return 500
          // so Stripe retries the webhook delivery. A silent fall-through
          // to the outer 200 here loses the event permanently. Audit H2
          // + Gemini #111 review.
          console.error('[stripe-webhook] subscription lookup failed:', subLookupErr.message, 'customerId=', customerId);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

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

    // Work succeeded — flip the dedup row to 'completed' so subsequent
    // retries of the same event.id from Stripe short-circuit at the
    // dedup check above. If this update fails, log but still return 200
    // — the work itself succeeded; missing the status flip means at most
    // a single re-processing on the next Stripe retry (work is idempotent
    // by construction: upserts on user_id, updates by customer_id).
    const { error: completeErr } = await supabase
      .from('processed_webhook_events')
      .update({ status: 'completed', processed_at: new Date().toISOString() })
      .eq('provider', 'stripe')
      .eq('provider_event_id', event.id);
    if (completeErr) {
      console.error('[stripe-webhook] idempotency completion update failed:', completeErr.message);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
