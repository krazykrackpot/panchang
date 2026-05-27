/**
 * GET /api/brihaspati/wait?questionId=...
 *
 * Lightweight SSE payment-verification poller. Replaces the
 * `pollForPaymentVerified` blocking loop that used to live inside POST
 * /api/brihaspati, freeing the heavy LLM function from waiting on webhook
 * delivery.
 *
 * Events emitted:
 *   data: { type: 'payment_pending' }            — every 1 s while waiting
 *   data: { type: 'payment_verified', streamUrl } — when row flips to verified
 *   data: { type: 'error', message }              — unrecoverable error
 *
 * The `streamUrl` in the `payment_verified` event is the URL the client
 * should open next to receive the LLM answer stream:
 *   `/api/brihaspati/stream?questionId=<id>`
 *
 * Auth: Bearer token in the Authorization header (identical to POST
 * /api/brihaspati). The client already uses fetch() for SSE reading, so
 * custom headers are supported — no native EventSource limitation applies.
 *
 * Max duration: 30 s (polls up to 28 times at 1 s intervals, well within
 * the 30-second timeout window). If payment hasn't arrived by then, the
 * client sees a final `payment_pending` event and can re-open the connection
 * or show a "check your payment" message.
 *
 * Spec: docs/superpowers/specs/2026-05-27-vercel-cost-reduction-design.md §2 Fix 3
 */

import { NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export const maxDuration = 30;

function sseEvent(payload: unknown): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function GET(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(sseEvent({ type: 'error', message: 'Not configured' })));
        controller.close();
      },
    });
    return new Response(stream, {
      status: 503,
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    });
  }

  // Auth: Bearer token from Authorization header.
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(sseEvent({ type: 'error', message: 'Unauthorized' })));
        controller.close();
      },
    });
    return new Response(stream, {
      status: 401,
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    });
  }

  const token = authHeader.slice(7).trim();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(sseEvent({ type: 'error', message: 'Unauthorized' })));
        controller.close();
      },
    });
    return new Response(stream, {
      status: 401,
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    });
  }

  const questionId = req.nextUrl.searchParams.get('questionId') ?? '';
  if (!questionId) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(sseEvent({ type: 'error', message: 'Missing questionId' })));
        controller.close();
      },
    });
    return new Response(stream, {
      status: 400,
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    });
  }

  // Verify question ownership before polling.
  const { data: row, error: rowErr } = await supabase
    .from('brihaspati_questions')
    .select('id, payment_verified, status')
    .eq('id', questionId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (rowErr || !row) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(sseEvent({ type: 'error', message: 'Question not found' })));
        controller.close();
      },
    });
    return new Response(stream, {
      status: 404,
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    });
  }

  // If already verified (fast browser / Razorpay), skip the wait loop.
  if (row.payment_verified === true) {
    const encoder = new TextEncoder();
    const streamUrl = `/api/brihaspati/stream?questionId=${questionId}`;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(sseEvent({ type: 'payment_verified', streamUrl })));
        controller.close();
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

  // Poll up to 28 times at 1 s intervals (28 s total, within the 30 s maxDuration).
  const db = supabase;
  const encoder = new TextEncoder();
  const MAX_POLLS = 28;
  const streamUrl = `/api/brihaspati/stream?questionId=${questionId}`;

  const responseStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (let i = 0; i < MAX_POLLS; i++) {
          // Emit a pending heartbeat.
          controller.enqueue(encoder.encode(sseEvent({ type: 'payment_pending' })));

          // Wait 1 second.
          await new Promise((resolve) => setTimeout(resolve, 1_000));

          // Check the row.
          const { data: fresh, error: pollErr } = await db
            .from('brihaspati_questions')
            .select('payment_verified')
            .eq('id', questionId)
            .maybeSingle();

          if (pollErr) {
            console.error('[brihaspati/wait] poll query failed:', pollErr.message);
            // Transient DB error — continue waiting.
            continue;
          }

          if (fresh?.payment_verified === true) {
            controller.enqueue(encoder.encode(sseEvent({ type: 'payment_verified', streamUrl })));
            controller.close();
            return;
          }
        }

        // Timed out — emit one final pending so the client knows we stopped.
        controller.enqueue(encoder.encode(sseEvent({ type: 'payment_pending' })));
        controller.close();
      } catch (err) {
        console.error('[brihaspati/wait] unexpected error:', err);
        try {
          controller.enqueue(encoder.encode(sseEvent({ type: 'error', message: 'Internal error' })));
        } catch {
          // Controller may already be closed.
        }
        controller.close();
      }
    },
  });

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
