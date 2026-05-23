import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

// Tiny endpoint to capture client-side route-error boundaries into Vercel logs.
// Best-effort; never throws back at the caller. The body is logged with a stable
// prefix so `vercel logs | grep '[client-error]'` returns just these.
//
// SECURITY: unauthenticated + writes attacker-controlled content into Vercel
// logs. Without a rate limit and per-field length cap this is a log-flood
// DoS vector — a bot can balloon Vercel log storage cost and bury real
// errors under spam-noise. Round 2 audit added:
// - IP-based rate limit (30/min) so a single bad actor can't carpet-bomb.
// - Hard per-field length cap on every string before it reaches the log.

const MAX_FIELD = 500;
const MAX_STACK_LINES = 12;
const MAX_STACK_TOTAL = 2000;

interface ClientErrorPayload {
  source?: string;
  message?: string;
  digest?: string;
  stack?: string;
  url?: string;
  ua?: string;
  ts?: string;
}

function cap(s: unknown, max = MAX_FIELD): string | undefined {
  if (typeof s !== 'string') return undefined;
  return s.length > max ? s.slice(0, max) : s;
}

export async function POST(request: Request) {
  const { allowed } = checkRateLimit(`client-error:${getClientIP(request)}`, {
    maxRequests: 30,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: ClientErrorPayload | null = null;
  try {
    body = (await request.json()) as ClientErrorPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  // Cap each field BEFORE building the JSON. Stack: take up to 12 lines,
  // join with ' | ', and hard-cap the JOINED string at MAX_STACK_TOTAL
  // (~2 KB). The previous version capped each line at 200 chars × 12 lines
  // = up to ~2.4 KB, which contradicted its "200-char budget" comment —
  // a hostile client could pad a stack with 12 long lines and pump bytes
  // into Vercel log storage. Gemini #120 review.
  const stackJoined = typeof body?.stack === 'string'
    ? body.stack.split('\n').slice(0, MAX_STACK_LINES).join(' | ')
    : '';
  const stackCapped = stackJoined.length > MAX_STACK_TOTAL
    ? stackJoined.slice(0, MAX_STACK_TOTAL)
    : stackJoined;
  // Single-line log so each error stays grep-friendly even when stacks are long.
  console.error('[client-error]', JSON.stringify({
    source: cap(body?.source, 60),
    message: cap(body?.message, MAX_FIELD),
    digest: cap(body?.digest, 100),
    url: cap(body?.url, 500),
    ua: cap(body?.ua, 300),
    ts: cap(body?.ts, 40),
    stack: stackCapped,
  }));
  return NextResponse.json({ ok: true });
}
