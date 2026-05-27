/**
 * POST /api/brihaspati
 *
 * Verifies payment (or consumes credit / confirms subscription), then either:
 *   - Streams the LLM answer immediately (credit/subscription/already-verified path)
 *   - Returns JSON { questionId, status: 'awaiting_payment' } (Stripe pending path)
 *
 * The "awaiting_payment" response signals the client to open the SSE poll
 * route GET /api/brihaspati/wait?questionId=... which handles the webhook-
 * delivery race without holding this LLM-loaded function instance.
 *
 * Responses:
 *   - text/event-stream with events when payment is immediately confirmed
 *   - application/json { questionId, status: 'awaiting_payment' } when
 *     a Stripe webhook is still in flight (browser outran webhook delivery)
 *
 * Body: { questionId: string, paymentRef?: { provider, paymentId, signature } }
 *
 * Spec: docs/superpowers/specs/2026-05-27-vercel-cost-reduction-design.md §2 Fix 3
 */
import { NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { buildContext } from '@/lib/brihaspati/router';
import { normaliseSnapshot } from '@/lib/brihaspati/router/snapshot-normaliser';
import { loadSubjectKundali } from '@/lib/brihaspati/router/load-subject-kundali';
import { narrate } from '@/lib/brihaspati/narration/inference';
import { consumeCredit, getActiveSubscription } from '@/lib/brihaspati/credits/credit-manager';
import { verifyPaymentSignature } from '@/lib/brihaspati/payment/razorpay';
import { systemPromptVersion } from '@/lib/brihaspati/narration/prompts';
import { computeHealthDiagnosis } from '@/lib/kundali/health-diagnosis';
import { buildHealthContext, questionIsHealthRelated } from '@/lib/brihaspati/health-context';
import type { KundaliData } from '@/types/kundali';
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
  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7).trim());
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

  // ── Idempotent re-delivery ──────────────────────────────────────────
  // If the answer is already persisted, replay it without charging or
  // re-running the LLM. This is the resume path after the user navigated
  // away or refreshed mid-stream: the credit was already consumed, the
  // narration completed server-side, and the row holds the answer body.
  // Previously this returned 409 → user saw "Something went wrong" and
  // had no way to retrieve the reading they paid for.
  if (row.status === 'completed' && typeof row.answer === 'string' && row.answer.length > 0) {
    const cachedAnswer = row.answer;
    const cachedValidation =
      row.validation_passed === true ? 'passed' :
      row.validation_passed === false ? 'failed' : 'logged';
    return sseStream(async (controller) => {
      const encoder = new TextEncoder();
      for (const t of cachedAnswer.split(/(\s+)/)) {
        if (!t) continue;
        controller.enqueue(encoder.encode(sseEvent({ type: 'token', text: t })));
      }
      controller.enqueue(encoder.encode(sseEvent({ type: 'done', validation: cachedValidation })));
    });
  }
  if (row.status === 'completed') return sseError(409, 'Already answered'); // status=completed but answer body empty → corrupt row, refuse

  // ── Payment verification / balance consumption ──────────────────────
  let providerUsed: 'razorpay' | 'stripe' | 'credit' | 'subscription' = row.provider;
  let paymentVerified = false;

  // Short-circuit: the row may already be payment_verified by an earlier
  // webhook callback. This is the common case for Stripe-resume after
  // the user returns from Checkout — the webhook has flipped the flag
  // by the time the browser POSTs /api/brihaspati to start streaming.
  // No paymentRef is required in that path.
  if (row.payment_verified === true) {
    paymentVerified = true;
    providerUsed = (row.provider as typeof providerUsed) ?? 'stripe';
  } else if (paymentRef?.provider === 'razorpay') {
    const ok = verifyPaymentSignature(row.payment_ref ?? '', paymentRef.paymentId, paymentRef.signature);
    if (!ok) return sseError(401, 'Payment signature invalid');
    paymentVerified = true;
    providerUsed = 'razorpay';
  } else if (
    paymentRef?.provider === 'stripe' ||
    (row.provider === 'stripe' && row.payment_ref && typeof row.payment_ref === 'string' && row.payment_ref.startsWith('cs_'))
  ) {
    // Stripe webhook has not arrived yet (browser outran delivery).
    // Return immediately — the client opens GET /api/brihaspati/wait to
    // poll for payment_verified, then GET /api/brihaspati/stream to get
    // the answer. This frees this LLM-loaded function from a blocking
    // 5-second poll.
    // Spec: docs/superpowers/specs/2026-05-27-vercel-cost-reduction-design.md §2 Fix 3
    return new Response(
      JSON.stringify({ questionId, status: 'awaiting_payment' }),
      { headers: { 'Content-Type': 'application/json' } },
    );
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

  // P2-16 — record provider + status, but DEFER `payment_verified=true`
  // until after the answer has been generated and persisted (line ~285).
  // Previously this row was marked verified BEFORE narrate() ran; if the
  // process crashed mid-stream, the credit was burned with no answer
  // delivered AND the row claimed the payment was honoured — making it
  // impossible to tell consumed-but-undelivered apart from successful
  // completions. Now an unfinished row stays at payment_verified=false +
  // status='streaming', so a refund/reconcile job can find it.
  await supabase
    .from('brihaspati_questions')
    .update({ provider: providerUsed, status: 'streaming' })
    .eq('id', questionId);

  // ── Load subject kundali (self or family member) ───────────────────
  // subject_saved_chart_id is set at order time (auto-detected from the
  // question text OR explicit picker). NULL → asker's own chart.
  const subjectChartId = (row.subject_saved_chart_id as string | null) ?? null;
  const loaded = await loadSubjectKundali({
    supabase: supabase as never,
    userId: user.id,
    subjectChartId,
  });
  if (!loaded.ok) {
    const msg = loaded.reason === 'chart_not_found'
      ? 'Saved chart for that subject was not found'
      : loaded.reason === 'chart_missing_birth_data'
      ? 'Saved chart is missing birth details — please open it and add date/time/place'
      : 'No kundali found for your account — please create your birth chart first';
    return sseError(404, msg);
  }
  const kundali = normaliseSnapshot({
    computation_version: loaded.computation_version,
    chart_data: loaded.chart_data as never,
    full_kundali: loaded.full_kundali as never,
  });
  // Subject framing for the LLM. When the question is about a family
  // member, prompts use "your daughter's chart shows…" instead of "your
  // chart shows…". The buildContext consumer reads this off ctx.subject.
  const subject = loaded.kind === 'family' && loaded.subjectName
    ? { kind: 'family' as const, name: loaded.subjectName }
    : { kind: 'self' as const };

  const category = (row.query_category ?? 'general') as BrihaspatiCategory;
  const locale = (row.locale ?? 'en') as BrihaspatiLocale;
  // Read the parent-Bhava-proxy directive that the order route stored
  // when the user explicitly opted to read from their own chart's Nth
  // house instead of adding a missing relative's chart.
  const storedCtx = (row.context_json as { parentBhavaProxy?: { bhava: number; relative: string; label: { en: string; hi: string } } } | null) ?? null;
  const parentBhavaProxy = storedCtx?.parentBhavaProxy;

  // ── Health Diagnosis Context (health-related questions only) ──────────
  // `loaded.full_kundali` is the raw KundaliData from generateKundali().
  // We run computeHealthDiagnosis only when the question is health-related
  // (category === 'health' OR keyword detection on the free-text question)
  // to avoid bloating the prompt for unrelated questions.
  //
  // Failure is non-fatal: a corrupt kundali or missing optional fields
  // must not prevent the answer from streaming. The engine's own catch
  // block returns a safe fallback HealthDiagnosis; buildHealthContext
  // handles null gracefully.
  let healthContext: string | undefined;
  const isHealthQuestion = category === 'health' || questionIsHealthRelated(row.question);
  if (isHealthQuestion && loaded.full_kundali) {
    try {
      const diagnosis = computeHealthDiagnosis(
        loaded.full_kundali as KundaliData,
        { extended: false },
      );
      const built = buildHealthContext(diagnosis);
      if (built) healthContext = built;
    } catch (err) {
      // Log but do not block — the narration can still proceed without
      // the health context. The LLM will fall back to the chart JSON.
      console.error('[brihaspati] computeHealthDiagnosis failed:', err);
    }
  }

  const ctx = buildContext({
    category,
    locale,
    question: row.question,
    kundali,
    subject,
    parentBhavaProxy,
    healthContext,
  });

  return sseStream(async (controller) => {
    const encoder = new TextEncoder();
    const answer = await narrate(ctx);

    // Snapshot opt-out at write time for §11. FAIL SAFE: if the profile
    // lookup errors, default to opt-OUT (don't train on the user's data).
    // The previous code defaulted to false (i.e. data IS usable for
    // training) on any read failure, which is a privacy regression on
    // transient DB errors. Audit H6.
    const { data: profile, error: profileLookupErr } = await supabase
      .from('user_profiles')
      .select('brihaspati_training_opt_out')
      .eq('id', user.id)
      .maybeSingle();
    if (profileLookupErr) {
      console.error('[brihaspati] training opt-out lookup failed for', user.id, ':', profileLookupErr.message);
    }
    const optOut = profileLookupErr
      ? true // fail-safe: respect privacy when we can't determine the user's preference
      : profile?.brihaspati_training_opt_out === true;

    // Stream the full answer in modest chunks so the SSE wire format
    // works through any intermediary; the underlying narration was
    // already collected (see inference.ts). Word-by-word streaming
    // gives a believable typing rhythm to the user.
    const tokens = answer.narration.text.split(/(\s+)/);
    for (const t of tokens) {
      if (!t) continue;
      controller.enqueue(encoder.encode(sseEvent({ type: 'token', text: t })));
    }

    // Persist final state. P2-16 — `payment_verified=true` lives here, on
    // the same write as the answer body + `status: 'completed'`, so the
    // row only claims the payment was honoured once the answer actually
    // exists.
    await supabase
      .from('brihaspati_questions')
      .update({
        answer: answer.narration.text,
        tier: answer.tier,
        model_used: answer.narration.modelUsed,
        validation_passed: answer.validationPassed,
        validation_failures: answer.validationFailures.length > 0 ? answer.validationFailures : null,
        retry_count: answer.retryCount,
        payment_verified: true,
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

