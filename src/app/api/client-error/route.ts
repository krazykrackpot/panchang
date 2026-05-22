import { NextResponse } from 'next/server';

// Tiny endpoint to capture client-side route-error boundaries into Vercel logs.
// Best-effort; never throws back at the caller. The body is logged with a stable
// prefix so `vercel logs | grep '[client-error]'` returns just these.

interface ClientErrorPayload {
  source?: string;
  message?: string;
  digest?: string;
  stack?: string;
  url?: string;
  ua?: string;
  ts?: string;
}

export async function POST(request: Request) {
  let body: ClientErrorPayload | null = null;
  try {
    body = (await request.json()) as ClientErrorPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  // Single-line log so each error stays grep-friendly even when stacks are long.
  console.error('[client-error]', JSON.stringify({
    source: body?.source,
    message: body?.message?.slice(0, 500),
    digest: body?.digest,
    url: body?.url,
    ua: body?.ua,
    ts: body?.ts,
    stack: body?.stack?.split('\n').slice(0, 12).join(' | '),
  }));
  return NextResponse.json({ ok: true });
}
