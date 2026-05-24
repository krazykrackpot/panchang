import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getClientIP } from '@/lib/api/rate-limit';

const VALID_EVENTS = [
  'page_view',
  'kundali_generated',
  'matching_computed',
  'signup',
  'checkout_started',
  'checkout_completed',
  'tool_used',
] as const;

// Module-level Supabase client — reused across invocations within the same
// Fluid Compute instance. Avoids creating a new client per request.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory rate limit: best-effort in serverless (not shared across instances,
// lost on cold start). Acceptable for analytics — prevents abuse within a single
// warm instance without requiring a Redis dependency.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  entry.count++;
  return entry.count > 20;
}

// P2-27 — in-memory dedup window. Page-view events get fired on every
// route change (and sometimes on tab-focus / SPA hydrate); without a
// dedup gate the same session can spam the same event within ms.
// Keyed on `${sessionId}|${event}|${landingPage}`. 5s window is enough
// to absorb double-mount / strict-mode-double-effect duplicates without
// suppressing legitimately-separate user navigations.
const DEDUP_WINDOW_MS = 5_000;
const recentEvents = new Map<string, number>();

function isDuplicate(sessionId: string, event: string, landingPage?: string | null): boolean {
  const key = `${sessionId}|${event}|${landingPage ?? ''}`;
  const now = Date.now();
  const lastSeen = recentEvents.get(key);
  if (lastSeen !== undefined && now - lastSeen < DEDUP_WINDOW_MS) {
    return true;
  }
  recentEvents.set(key, now);
  // Best-effort prune: when the map outgrows a sensible cap, drop the
  // oldest half so this doesn't leak unbounded memory in a long-lived
  // Fluid Compute container.
  if (recentEvents.size > 10_000) {
    const cutoff = now - DEDUP_WINDOW_MS;
    for (const [k, t] of recentEvents) {
      if (t < cutoff) recentEvents.delete(k);
    }
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, sessionId, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, landingPage, referrer, metadata } = body;

    // Validate required fields
    if (!event || !sessionId) {
      return NextResponse.json({ error: 'event and sessionId are required' }, { status: 400 });
    }

    if (!(VALID_EVENTS as readonly string[]).includes(event)) {
      return NextResponse.json({ error: `Invalid event: ${event}` }, { status: 400 });
    }

    // Cap event_metadata size — without this the column accepts arbitrary
    // client JSON via the service-role insert below, which is a cheap
    // storage-bloat vector. 2KB is generous for legitimate UTM context.
    // Audit Round 2.
    if (metadata !== undefined && metadata !== null) {
      try {
        const serialized = JSON.stringify(metadata);
        if (serialized.length > 2048) {
          return NextResponse.json({ error: 'metadata too large' }, { status: 413 });
        }
      } catch {
        return NextResponse.json({ error: 'metadata not JSON-serializable' }, { status: 400 });
      }
    }

    // Rate-limit by IP, not sessionId. Previously keyed on sessionId, but
    // sessionId is attacker-supplied in the request body — rotating it
    // bypassed the limit entirely. Per audit P1-2, use the trusted
    // x-real-ip / last-hop x-forwarded-for via getClientIP.
    const clientIP = getClientIP(req);
    if (isRateLimited(clientIP)) {
      return new NextResponse(null, { status: 429 });
    }

    // P2-27 — drop duplicate events from the same session in a 5s window.
    // SPA route changes + Strict-Mode double-effect + tab focus all
    // tend to fire the same event back-to-back; without this gate the
    // utm_visits table grew by ~5x more rows than user actions.
    // The dedup is in-memory (per Fluid Compute container) so a
    // determined attacker rotating instances could bypass it — that's
    // the rate-limit's job, not this gate's.
    if (isDuplicate(sessionId, event, landingPage)) {
      return new NextResponse(null, { status: 204 });
    }

    if (!supabase) {
      console.error('[track-utm] Missing Supabase env vars');
      return new NextResponse(null, { status: 500 });
    }

    const { error } = await supabase.from('utm_visits').insert({
      session_id: sessionId,
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      utm_content: utmContent || null,
      utm_term: utmTerm || null,
      landing_page: landingPage || null,
      referrer: referrer || null,
      event,
      event_metadata: metadata || null,
    });

    if (error) {
      console.error('[track-utm] Supabase insert failed:', error);
      return new NextResponse(null, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[track-utm] Unexpected error:', err);
    return new NextResponse(null, { status: 500 });
  }
}
