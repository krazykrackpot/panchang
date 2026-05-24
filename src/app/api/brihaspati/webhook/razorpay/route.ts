/**
 * POST /api/brihaspati/webhook/razorpay
 *
 * Idempotent Razorpay webhook handler. Verifies signature, deduplicates
 * via brihaspati_webhook_events, then updates question / credit /
 * subscription state per event type.
 *
 * Round 2 hardening (SEC-2, SF-8):
 *   - Question rows are server-bound at /api/brihaspati/order via
 *     auth.uid(). The webhook MUST look up the question by
 *     notes.question_id and verify the row's user_id matches notes
 *     .user_id, then USE the row's user_id for downstream credit /
 *     subscription writes. Same shape as the Brihaspati Stripe webhook.
 *   - PG_UNIQUE_VIOLATION code (23505) is checked instead of regex on
 *     .message — robust against PostgREST locale / version drift.
 *   - DB writes destructure { error } and surface failures.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { verifyWebhookSignature } from '@/lib/brihaspati/payment/razorpay';
import { grantCredits, setSubscription } from '@/lib/brihaspati/credits/credit-manager';

const PG_UNIQUE_VIOLATION = '23505';

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

    // Idempotency key: prefer Razorpay's x-razorpay-event-id header — it's
    // unique per delivery and stable across retries of the *same* event.
    // Falling back to payload.{payment,subscription}.entity.id was wrong:
    // a single subscription emits both `subscription.activated` AND
    // `subscription.charged` events with the same entity.id but different
    // event types, so keying on entity.id alone caused the second to be
    // dedup'd as a "duplicate" even though both are real, distinct events.
    // (Audit P0-11 / 2026-05-23.)
    const eventIdHeader = req.headers.get('x-razorpay-event-id');
    const eventId = eventIdHeader
      ?? event?.payload?.payment?.entity?.id
      ?? event?.payload?.subscription?.entity?.id
      ?? event?.id;
    if (!eventId) {
      console.error('[brihaspati/webhook/razorpay] missing x-razorpay-event-id header and no derivable id from payload');
      return NextResponse.json({ error: 'Missing event id' }, { status: 400 });
    }

    // Idempotency: insert into ledger; ON CONFLICT no-op (unique
    // constraint on (provider, provider_event_id)). Round 2 SEC-21:
    // detect duplicates via PG_UNIQUE_VIOLATION code rather than regex
    // on .message.
    const { error: idemErr } = await supabase
      .from('brihaspati_webhook_events')
      .insert({
        provider: 'razorpay',
        provider_event_id: eventId,
        event_type: event.event,
        payload: event,
      });
    if (idemErr && (idemErr as { code?: string }).code !== PG_UNIQUE_VIOLATION) {
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
        const metaUserId = ent.notes?.user_id;
        const metaQuestionId = ent.notes?.question_id;
        const tier = ent.notes?.tier;
        if (!metaUserId || !metaQuestionId || !tier) {
          console.error('[brihaspati/webhook/razorpay] payment missing notes');
          break;
        }

        // Round 2 SEC-2 — verify against brihaspati_questions before
        // crediting. The question row's user_id is server-bound at
        // /api/brihaspati/order via auth.uid().
        const { data: question, error: qErr } = await supabase
          .from('brihaspati_questions')
          .select('user_id, payment_ref')
          .eq('id', metaQuestionId)
          .single();
        if (qErr && qErr.code !== 'PGRST116') {
          console.error('[brihaspati/webhook/razorpay] question lookup failed:', qErr.message);
          return NextResponse.json({ error: 'Internal error' }, { status: 500 });
        }
        if (!question) {
          console.error('[brihaspati/webhook/razorpay] SECURITY: question not found', {
            questionId: metaQuestionId,
            metaUserId,
            paymentId: ent.id,
          });
          break;
        }
        if (metaUserId !== question.user_id) {
          console.error('[brihaspati/webhook/razorpay] SECURITY: notes.user_id mismatch', {
            questionId: metaQuestionId,
            metaUserId,
            boundUserId: question.user_id,
            paymentId: ent.id,
          });
          break;
        }

        const userId = question.user_id;

        // Round 2 SF-8 — fail loud on DB error.
        const { error: flipErr } = await supabase
          .from('brihaspati_questions')
          .update({ payment_verified: true, provider: 'razorpay' })
          .eq('id', metaQuestionId)
          .eq('user_id', userId);
        if (flipErr) {
          console.error('[brihaspati/webhook/razorpay] payment_verified flip failed:', flipErr.message);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
        if (tier === 'pack_5') {
          try {
            await grantCredits(supabase as never, userId, 'pack_5', 'razorpay', ent.id);
          } catch (err) {
            console.error('[brihaspati/webhook/razorpay] grantCredits failed:', err, 'userId=', userId, 'paymentId=', ent.id);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
          }
        }
        break;
      }
      case 'subscription.activated':
      case 'subscription.charged': {
        const sub = event.payload?.subscription?.entity;
        if (!sub) break;
        const metaUserId = sub.notes?.user_id;
        const metaQuestionId = sub.notes?.question_id;
        const tier = sub.notes?.tier;
        if (!metaUserId || (tier !== 'monthly' && tier !== 'annual')) break;

        // Gemini #156 review — strict question-row verification for
        // subscription events too. Notes are attacker-influenceable on
        // an attacker-controlled Razorpay merchant; without the question
        // row + server-bound user_id check, a crafted subscription with
        // a non-existent question_id (or missing question_id) would
        // silently fall back to trusting notes.user_id. The Brihaspati
        // Stripe twin is strict; this is now the same shape.
        if (!metaQuestionId) {
          console.error('[brihaspati/webhook/razorpay] SECURITY: subscription event missing notes.question_id', {
            metaUserId,
            subscriptionId: sub.id,
            eventType: event.event,
          });
          break;
        }
        const { data: question, error: qErr } = await supabase
          .from('brihaspati_questions')
          .select('user_id')
          .eq('id', metaQuestionId)
          .single();
        if (qErr && qErr.code !== 'PGRST116') {
          console.error('[brihaspati/webhook/razorpay] question lookup failed:', qErr.message);
          return NextResponse.json({ error: 'Internal error' }, { status: 500 });
        }
        if (!question) {
          console.error('[brihaspati/webhook/razorpay] SECURITY: subscription event references non-existent question', {
            questionId: metaQuestionId,
            metaUserId,
            subscriptionId: sub.id,
          });
          break;
        }
        if (metaUserId !== question.user_id) {
          console.error('[brihaspati/webhook/razorpay] SECURITY: notes.user_id mismatch on subscription', {
            questionId: metaQuestionId,
            metaUserId,
            boundUserId: question.user_id,
            subscriptionId: sub.id,
          });
          break;
        }
        const userId = question.user_id;

        const expires = sub.current_end
          ? new Date(sub.current_end * 1000).toISOString()
          : new Date(Date.now() + (tier === 'annual' ? 365 : 30) * 86400 * 1000).toISOString();
        // Gemini #156 review — explicit fail-loud wrap so Razorpay retries
        // on DB error. Helper throws on real errors (only swallows
        // PG duplicate-key as idempotency). Tagged log surfaces the
        // failure path to ops.
        try {
          await setSubscription(supabase as never, userId, tier, expires, 'razorpay');
        } catch (err) {
          console.error('[brihaspati/webhook/razorpay] setSubscription failed:', err, 'userId=', userId, 'tier=', tier);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
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
        notes?: { user_id?: string; question_id?: string; tier?: string };
      };
    };
  };
}
