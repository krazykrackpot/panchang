/**
 * POST /api/brihaspati
 *
 * The main flow. Verifies payment (or consumes credit / confirms
 * subscription), runs Layer 2/3/4, persists the answer, and streams the
 * narration to the client via Server-Sent Events.
 *
 * Body: { questionId: string, paymentRef?: { provider, paymentId, signature }, birthData?: BirthData }
 *
 * Response: text/event-stream with events
 *   data: { type: 'token', text: '...' }
 *   data: { type: 'done', validation: 'passed' | 'failed' | 'logged' }
 */
import { NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { buildContext, type RouterKundali } from '@/lib/brihaspati/router';
import { narrate } from '@/lib/brihaspati/narration/inference';
import { consumeCredit, getActiveSubscription } from '@/lib/brihaspati/credits/credit-manager';
import { verifyPaymentSignature } from '@/lib/brihaspati/payment/razorpay';
import { systemPromptVersion } from '@/lib/brihaspati/narration/prompts';
import {
  type BrihaspatiCategory,
  type BrihaspatiLocale,
} from '@/lib/brihaspati/types';

// Allow streaming up to 5 minutes (Vercel default ceiling)
export const maxDuration = 300;

function sseEvent(payload: unknown): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

interface PaymentRef {
  provider: 'razorpay' | 'stripe';
  paymentId: string;
  signature: string;
}

function sseStream(start: (controller: ReadableStreamDefaultController<Uint8Array>) => Promise<void>): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await start(controller);
      } catch (err) {
        console.error('[brihaspati] stream start failed:', err);
        controller.enqueue(encoder.encode(sseEvent({ type: 'error', message: 'Internal error' })));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

function sseError(status: number, message: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(sseEvent({ type: 'error', message })));
      controller.close();
    },
  });
  return new Response(stream, {
    status,
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return sseError(503, 'Not configured');

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return sseError(401, 'Unauthorized');
  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7));
  if (authError || !user) return sseError(401, 'Unauthorized');

  let body: { questionId?: unknown; paymentRef?: unknown };
  try {
    body = await req.json();
  } catch {
    return sseError(400, 'Invalid JSON');
  }
  const questionId = typeof body.questionId === 'string' ? body.questionId : '';
  if (!questionId) return sseError(400, 'Missing questionId');
  const paymentRef = body.paymentRef as PaymentRef | undefined;

  // Load the question row.
  const { data: row, error: rowErr } = await supabase
    .from('brihaspati_questions')
    .select('*')
    .eq('id', questionId)
    .eq('user_id', user.id)
    .single();
  if (rowErr || !row) return sseError(404, 'Question not found');
  if (row.status === 'completed') return sseError(409, 'Already answered');

  // ── Payment verification / balance consumption ──────────────────────
  let providerUsed: 'razorpay' | 'stripe' | 'credit' | 'subscription' = row.provider;
  let paymentVerified = false;

  if (paymentRef?.provider === 'razorpay') {
    const ok = verifyPaymentSignature(row.payment_ref ?? '', paymentRef.paymentId, paymentRef.signature);
    if (!ok) return sseError(401, 'Payment signature invalid');
    paymentVerified = true;
    providerUsed = 'razorpay';
  } else if (paymentRef?.provider === 'stripe') {
    // Stripe payment is verified asynchronously by the webhook; here we
    // accept the sessionId reference and check the questions row was
    // marked paid by the webhook handler before this call.
    paymentVerified = row.payment_verified === true;
    if (!paymentVerified) return sseError(402, 'Awaiting payment confirmation');
    providerUsed = 'stripe';
  } else {
    // No payment ref → try subscription, then credit.
    const sub = await getActiveSubscription(supabase as never, user.id);
    if (sub.tier !== 'none') {
      paymentVerified = true;
      providerUsed = 'subscription';
    } else {
      const consumed = await consumeCredit(supabase as never, user.id);
      if (!consumed) return sseError(402, 'No balance — payment required');
      paymentVerified = true;
      providerUsed = 'credit';
    }
  }

  await supabase
    .from('brihaspati_questions')
    .update({ payment_verified: true, provider: providerUsed, status: 'streaming' })
    .eq('id', questionId);

  // ── Load kundali snapshot ──────────────────────────────────────────
  const { data: snapshot } = await supabase
    .from('kundali_snapshots')
    .select('chart_data, dasha_timeline, planet_positions, full_kundali, computation_version')
    .eq('user_id', user.id)
    .single();

  const kundali: RouterKundali = {
    engineVersion: typeof snapshot?.computation_version === 'string' ? snapshot.computation_version : 'unknown',
    chart: (snapshot?.chart_data ?? snapshot?.planet_positions ?? {}) as Record<string, unknown>,
    dashas: (snapshot?.dasha_timeline ?? {}) as Record<string, unknown>,
    yogas: extractArray(snapshot?.full_kundali, 'yogas'),
    doshas: extractArray(snapshot?.full_kundali, 'doshas'),
    transits: extractArray(snapshot?.full_kundali, 'transits'),
    analysis: (snapshot?.full_kundali && typeof snapshot.full_kundali === 'object'
      ? snapshot.full_kundali as Record<string, unknown>
      : {}),
  };

  const category = (row.query_category ?? 'general') as BrihaspatiCategory;
  const locale = (row.locale ?? 'en') as BrihaspatiLocale;
  const ctx = buildContext({
    category,
    locale,
    question: row.question,
    kundali,
  });

  return sseStream(async (controller) => {
    const encoder = new TextEncoder();
    const answer = await narrate(ctx);

    // Snapshot opt-out at write time for §11.
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('brihaspati_training_opt_out')
      .eq('id', user.id)
      .maybeSingle();
    const optOut = profile?.brihaspati_training_opt_out === true;

    // Stream the full answer in modest chunks so the SSE wire format
    // works through any intermediary; the underlying narration was
    // already collected (see inference.ts). Word-by-word streaming
    // gives a believable typing rhythm to the user.
    const tokens = answer.narration.text.split(/(\s+)/);
    for (const t of tokens) {
      if (!t) continue;
      controller.enqueue(encoder.encode(sseEvent({ type: 'token', text: t })));
    }

    // Persist final state.
    await supabase
      .from('brihaspati_questions')
      .update({
        answer: answer.narration.text,
        tier: answer.tier,
        model_used: answer.narration.modelUsed,
        validation_passed: answer.validationPassed,
        validation_failures: answer.validationFailures.length > 0 ? answer.validationFailures : null,
        retry_count: answer.retryCount,
        status: 'completed',
        input_tokens: answer.narration.inputTokens ?? null,
        output_tokens: answer.narration.outputTokens ?? null,
        context_json: ctx,
        engine_version: ctx.engineVersion,
        system_prompt_version: answer.narration.systemPromptVersion ?? systemPromptVersion(locale),
        training_opt_out: optOut,
        completed_at: new Date().toISOString(),
      })
      .eq('id', questionId);

    const validationLabel =
      answer.validationPassed === true ? 'passed'
      : answer.validationPassed === false ? 'failed'
      : 'logged';
    controller.enqueue(encoder.encode(sseEvent({ type: 'done', validation: validationLabel })));
  });
}

function extractArray(blob: unknown, key: string): Record<string, unknown>[] {
  if (!blob || typeof blob !== 'object') return [];
  const v = (blob as Record<string, unknown>)[key];
  if (Array.isArray(v)) {
    return v.filter((x): x is Record<string, unknown> => !!x && typeof x === 'object');
  }
  return [];
}
