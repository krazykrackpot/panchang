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
  'page_engagement',
  // Paywall funnel (2026-06-26) — let us read chart→detailed→paywall→checkout
  // for each signed-in user. Without these we couldn't tell whether 0
  // purchases meant "snapshot is too generous" or "soft-prompt missed".
  'kundali_view_mode_switched',  // viewMode: simple|detailed|expert
  'paywall_impression',           // paywall card rendered to user
  'paywall_buy_clicked',          // Buy Single / Buy Family click
  'paywall_unlock_clicked',       // "Unlock this chart" credit-spend click
  'paywall_signin_required',      // anon user clicked Buy → routed to signin
  'snapshot_pdf_clicked',         // snapshot export buttons
  'snapshot_jpeg_clicked',
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
  // Hard memory cap: drop the oldest half once the map exceeds 10k
  // entries. JavaScript Map iteration follows INSERTION order, so the
  // first entries we encounter are the oldest — we don't need to read
  // timestamps to find them. The previous time-based prune was a bug
  // (Gemini #154): under steady high load every entry could be inside
  // the dedup window, so the prune walked all 10k each request without
  // freeing any memory — CPU spike + unbounded growth.
  if (recentEvents.size > 10_000) {
    let toDelete = 5_000;
    for (const [k] of recentEvents) {
      recentEvents.delete(k);
      if (--toDelete <= 0) break;
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

    // Optional auth — if the client sent a Bearer token, resolve it to a
    // user_id so post-signup tracking events get stitched to the right user.
    // Anonymous (pre-signup) visits are still accepted with user_id=null.
    //
    // Without this, every utm_visits row had user_id=null forever — even
    // post-signup events from authenticated users — making source-of-signup
    // attribution unmappable. The /api/user/signup-welcome → keepalive saga
    // (2026-06-14/15) made this lacuna visible.
    let userId: string | null = null;
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        // Gemini PR #709 MED: getUser() can resolve with data=null on
        // certain network/auth-server failures — destructuring data.user
        // would TypeError. Use safe optional chaining + capture the error
        // for ops visibility.
        const { data, error } = await supabase.auth.getUser(authHeader.slice(7).trim());
        if (data?.user) userId = data.user.id;
        if (error) console.warn('[track-utm] getUser returned error:', error.message);
      } catch (err) {
        // Invalid/expired token — fall through with userId=null. Don't
        // refuse the event; analytics shouldn't gate on auth strength.
        console.warn('[track-utm] getUser threw:', err);
      }
    }

    const { error } = await supabase.from('utm_visits').insert({
      session_id: sessionId,
      user_id: userId,
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

    // Retro-stitch: if we know the user_id NOW, backfill all earlier
    // rows for this same session_id whose user_id is still null. The
    // browser keeps the session_id constant across the same tab/cookie
    // window, so this captures the entire pre-signup browse trail and
    // ties it to the user that the session later became.
    //
    // Gemini PR #709 HIGH: must AWAIT in serverless. Fire-and-forget
    // promises in Next.js Route Handlers on Vercel get aborted when the
    // container freezes/terminates after sending the response. Indexing
    // on (session_id, user_id) keeps this update O(matched-rows), not a
    // table scan — see migration 075 in the same PR.
    if (userId) {
      try {
        const { error: stitchErr } = await supabase
          .from('utm_visits')
          .update({ user_id: userId })
          .eq('session_id', sessionId)
          .is('user_id', null);
        if (stitchErr) {
          console.warn('[track-utm] retro-stitch failed:', stitchErr.message);
        }
      } catch (err) {
        console.warn('[track-utm] retro-stitch threw:', err);
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[track-utm] Unexpected error:', err);
    return new NextResponse(null, { status: 500 });
  }
}
