/**
 * POST /api/brihaspati/webhook/stripe
 *
 * Idempotent Stripe webhook handler for Brihaspati one-off + subscription
 * purchases. Verifies signature, dedups via brihaspati_webhook_events,
 * then updates question / credit / subscription state per event type.
 *
 * Round 2 hardening (SEC-1, SF-4):
 *   - Question rows are server-bound at /api/brihaspati/order via
 *     auth.uid(). The webhook MUST look up the question by metadata
 *     .question_id and verify the row's user_id matches metadata.user_id,
 *     then USE the row's user_id (not metadata.user_id) for downstream
 *     credit / subscription writes. This closes the metadata-spoofing
 *     attack where an attacker controlling a Stripe customer crafts a
 *     session whose metadata names a victim user_id + question_id.
 *   - DB writes destructure { error } and return 500 on error so Stripe
 *     retries — previously a silent failure left the user paying with
 *     no answer + Stripe unable to retry.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { verifyWebhookEvent } from '@/lib/brihaspati/payment/stripe';
import { grantCredits, setSubscription } from '@/lib/brihaspati/credits/credit-manager';

// PostgreSQL unique-violation SQLSTATE — used to detect that a webhook
// event was already dedup'd into brihaspati_webhook_events. Code-based
// match is more robust than regex on .message which can change between
// PostgREST versions / locales.
const PG_UNIQUE_VIOLATION = '23505';

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
    if (idemErr && (idemErr as { code?: string }).code !== PG_UNIQUE_VIOLATION) {
      console.error('[brihaspati/webhook/stripe] idempotency write failed:', idemErr.message);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
    if (idemErr) {
      return NextResponse.json({ received: true, dedup: true });
    }

    const metaUserId = obj.metadata.user_id;
    const metaQuestionId = obj.metadata.question_id;
    const metaTier = obj.metadata.tier;
    if (!metaUserId || !metaTier || !metaQuestionId) {
      // Every Brihaspati flow MUST carry user_id + question_id + tier in
      // metadata (set in createCheckoutSession). Missing fields means the
      // event isn't from our /api/brihaspati/order path — refuse to process.
      console.error('[brihaspati/webhook/stripe] metadata missing required fields:', {
        hasUserId: !!metaUserId,
        hasQuestionId: !!metaQuestionId,
        hasTier: !!metaTier,
        eventType: event.type,
      });
      return NextResponse.json({ received: true, ignored: true });
    }

    // Round 2 SEC-1 — server-side binding verification. brihaspati_questions
    // .user_id is set from auth.uid() at order-creation time; .payment_ref
    // holds the Stripe session.id. We trust THAT, not metadata, even though
    // they should agree on a legitimate flow.
    const { data: question, error: qErr } = await supabase
      .from('brihaspati_questions')
      .select('user_id, payment_ref')
      .eq('id', metaQuestionId)
      .single();

    if (qErr && qErr.code !== 'PGRST116') {
      console.error('[brihaspati/webhook/stripe] question lookup failed:', qErr.message);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
    if (!question) {
      // No question row for the metadata-named id. Could be a deleted
      // question or a spoofed metadata. Refuse to credit.
      console.error('[brihaspati/webhook/stripe] SECURITY: question not found', {
        questionId: metaQuestionId,
        metaUserId,
        eventType: event.type,
      });
      return NextResponse.json({ received: true, ignored: true });
    }
    if (metaUserId !== question.user_id) {
      console.error('[brihaspati/webhook/stripe] SECURITY: metadata.user_id mismatch with question row', {
        questionId: metaQuestionId,
        metaUserId,
        boundUserId: question.user_id,
        eventType: event.type,
      });
      return NextResponse.json({ received: true, ignored: true });
    }

    // Defence in depth: cross-check the session id against payment_ref
    // (the question row stores the session id we created at order time).
    // A mismatch means the metadata.question_id was crafted to point at
    // a different user's question. Only enforce when both ids are present.
    if (obj.id && question.payment_ref && obj.id !== question.payment_ref) {
      console.error('[brihaspati/webhook/stripe] SECURITY: session id mismatch with question.payment_ref', {
        questionId: metaQuestionId,
        sessionId: obj.id,
        boundRef: question.payment_ref,
        eventType: event.type,
      });
      return NextResponse.json({ received: true, ignored: true });
    }

    // Trust the SERVER-bound user_id from the question row, not metadata.
    const userId = question.user_id;
    const tier = metaTier;

    switch (event.type) {
      case 'checkout.session.completed': {
        // Round 2 SF-4 — fail loud on DB error. The previous handler
        // discarded { error } so if the payment_verified flip failed,
        // the user got "Awaiting payment confirmation" indefinitely AND
        // Stripe never retried.
        const { error: flipErr } = await supabase
          .from('brihaspati_questions')
          .update({ payment_verified: true, provider: 'stripe' })
          .eq('id', metaQuestionId)
          .eq('user_id', userId); // Belt-and-braces: scope by user_id too.
        if (flipErr) {
          console.error('[brihaspati/webhook/stripe] payment_verified flip failed:', flipErr.message, 'questionId=', metaQuestionId);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
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
