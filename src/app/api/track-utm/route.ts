import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

function isRateLimited(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(sessionId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(sessionId, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  entry.count++;
  return entry.count > 20;
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

    // Rate limit check
    if (isRateLimited(sessionId)) {
      return new NextResponse(null, { status: 429 });
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
