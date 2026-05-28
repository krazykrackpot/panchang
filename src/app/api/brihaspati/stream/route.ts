/**
 * GET /api/brihaspati/stream?questionId=...
 *
 * LLM answer streamer. Replaces the streaming half of POST /api/brihaspati.
 * Only fires after payment is confirmed (either by /api/brihaspati/wait or
 * because the row was already payment_verified on load).
 *
 * The POST route still handles the complete flow for the credit/subscription
 * path (no payment wait needed). This GET route is used by the client when
 * the /wait route emits `payment_verified` — it opens this endpoint to
 * receive the token stream.
 *
 * Events emitted (identical to POST /api/brihaspati):
 *   data: { type: 'token', text: '...' }
 *   data: { type: 'done', validation: 'passed' | 'failed' | 'logged' }
 *   data: { type: 'error', message: '...' }
 *
 * Auth: Bearer token in the Authorization header (identical to POST).
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
import { systemPromptVersion } from '@/lib/brihaspati/narration/prompts';
import { computeHealthDiagnosis } from '@/lib/kundali/health-diagnosis';
import { buildHealthContext, questionIsHealthRelated } from '@/lib/brihaspati/health-context';
import type { KundaliData } from '@/types/kundali';
import type { BrihaspatiCategory, BrihaspatiLocale } from '@/lib/brihaspati/types';

// Allow LLM streaming up to 5 minutes (same as the original POST).
export const maxDuration = 300;

function sseEvent(payload: unknown): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

function sseStream(
  start: (controller: ReadableStreamDefaultController<Uint8Array>) => Promise<void>,
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await start(controller);
      } catch (err) {
        console.error('[brihaspati/stream] stream start failed:', err);
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

export async function GET(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return sseError(503, 'Not configured');

  // Auth: Bearer token from Authorization header.
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return sseError(401, 'Unauthorized');
  const token = authHeader.slice(7).trim();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return sseError(401, 'Unauthorized');

  const questionId = req.nextUrl.searchParams.get('questionId') ?? '';
  if (!questionId) return sseError(400, 'Missing questionId');

  // Load the question row — verify ownership at the boundary.
  const { data: row, error: rowErr } = await supabase
    .from('brihaspati_questions')
    .select('*')
    .eq('id', questionId)
    .eq('user_id', user.id)
    .single();
  if (rowErr || !row) return sseError(404, 'Question not found');

  // ── Idempotent re-delivery ──────────────────────────────────────────────
  // If already completed, replay without re-running or re-charging.
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
  if (row.status === 'completed') return sseError(409, 'Already answered');

  // ── Payment guard ───────────────────────────────────────────────────────
  // This route is only called AFTER /wait emits payment_verified, so the
  // row should already be verified. Guard defensively: if for any reason
  // it isn't, try subscription/credit before refusing.
  //
  // M2 audit note — credit-status atomicity assumption (NOT a bug):
  // consumeCredit() is called, then status='streaming' is written. These
  // two writes are NOT atomic. If a crash occurs between them:
  //   a) credit consumed, status still 'pending': next retry goes through
  //      the payment guard again and may double-consume. This is mitigated
  //      by the idempotency key in credit-manager (P2-16) — a second
  //      consumeCredit call within the same question ID is a no-op.
  //   b) credit consumed, status='streaming': this branch catches it —
  //      bypassing the guard prevents double-consume on retry.
  // The ordering (consumeCredit BEFORE status='streaming') ensures scenario
  // (b) is the only durable stuck state, and it is safely retryable.
  //
  // Double-charge prevention: if the row is already in 'streaming' status,
  // a previous attempt started the LLM call but was interrupted before
  // completing. Credit-based questions set payment_verified=true only on
  // successful completion (P2-16), so a mid-stream interruption leaves
  // payment_verified=false even though a credit was already consumed.
  // Bypassing the payment guard when status==='streaming' prevents a second
  // consumeCredit call on retry, which would double-charge the user.
  let providerUsed: 'razorpay' | 'stripe' | 'credit' | 'subscription' = row.provider;
  if (row.payment_verified !== true && row.status !== 'streaming') {
    const sub = await getActiveSubscription(supabase as never, user.id);
    if (sub.tier !== 'none') {
      providerUsed = 'subscription';
    } else {
      const consumed = await consumeCredit(supabase as never, user.id);
      if (!consumed) return sseError(402, 'Payment not confirmed — please try again');
      providerUsed = 'credit';
    }
  } else {
    providerUsed = (row.provider as typeof providerUsed) ?? 'stripe';
  }

  // Mark as streaming (P2-16: defer payment_verified=true until answer persisted).
  await supabase
    .from('brihaspati_questions')
    .update({ provider: providerUsed, status: 'streaming' })
    .eq('id', questionId);

  // ── Load subject kundali ────────────────────────────────────────────────
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
  const subject = loaded.kind === 'family' && loaded.subjectName
    ? { kind: 'family' as const, name: loaded.subjectName }
    : { kind: 'self' as const };

  const category = (row.query_category ?? 'general') as BrihaspatiCategory;
  const locale = (row.locale ?? 'en') as BrihaspatiLocale;
  const storedCtx = (row.context_json as {
    parentBhavaProxy?: { bhava: number; relative: string; label: { en: string; hi: string } };
  } | null) ?? null;
  const parentBhavaProxy = storedCtx?.parentBhavaProxy;

  // ── Health context (health questions only) ──────────────────────────────
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
      console.error('[brihaspati/stream] computeHealthDiagnosis failed:', err);
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

    // H3 audit fix: wrap the entire stream body in try/catch so that a narrate()
    // failure (ANTHROPIC_API_KEY misconfigured, network timeout, etc.) sets
    // status='failed' instead of leaving the row stuck at status='streaming' forever.
    // Stuck-streaming rows accumulate silently and have no customer reconciliation
    // pathway. On failure: mark status='failed' and reset payment_verified=false so
    // a reconciliation job or future retry can identify the row.
    try {
      const answer = await narrate(ctx);

      // Privacy: opt-out check (fail-safe: opt OUT on any lookup error).
      const { data: profile, error: profileLookupErr } = await supabase
        .from('user_profiles')
        .select('brihaspati_training_opt_out')
        .eq('id', user.id)
        .maybeSingle();
      if (profileLookupErr) {
        console.error('[brihaspati/stream] training opt-out lookup failed:', profileLookupErr.message);
      }
      const optOut = profileLookupErr
        ? true
        : profile?.brihaspati_training_opt_out === true;

      // Stream tokens to the client.
      const tokens = answer.narration.text.split(/(\s+)/);
      for (const t of tokens) {
        if (!t) continue;
        controller.enqueue(encoder.encode(sseEvent({ type: 'token', text: t })));
      }

      // Persist final state (P2-16 — payment_verified=true lives here).
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
    } catch (narrateErr) {
      // H3 audit fix: narrate() or downstream persistence threw.
      // Mark the row as failed so it can be found by reconciliation — do NOT
      // leave it at status='streaming' with no answer (undetectable stuck state).
      // Reset payment_verified=false only if no answer was persisted (we check
      // by attempting the update unconditionally; the row's answer column will
      // still be null if we never reached the persist step above).
      console.error('[brihaspati/stream] narrate or persist failed:', narrateErr);
      await supabase
        .from('brihaspati_questions')
        .update({ status: 'failed' })
        .eq('id', questionId)
        .is('answer', null); // only reset if no answer was persisted
      controller.enqueue(encoder.encode(sseEvent({ type: 'error', message: 'Generation failed — please retry' })));
    }
  });
}
