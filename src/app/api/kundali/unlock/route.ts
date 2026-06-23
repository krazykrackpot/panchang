/**
 * POST /api/kundali/unlock
 *
 * Spends 1 credit from the authenticated user's balance and grants
 * tippanni access for the kundali identified by birth params.
 *
 * Body:  { date: "YYYY-MM-DD", time: "HH:MM", lat: number, lng: number, displayName?: string }
 * Auth:  Bearer token (Supabase access_token).
 * Returns:
 *   { status: 'unlocked', entitlementId, creditsRemaining }
 *   { status: 'already_unlocked', entitlementId, creditsRemaining }
 *   { status: 'insufficient_credits', creditsRemaining }
 *
 * The fingerprint is computed SERVER-SIDE from the birth params (lat/lng
 * rounded to 4dp, date YYYY-MM-DD, time HH:MM) — clients can't craft a
 * fingerprint to bypass payment. Re-unlock with the same params is
 * idempotent (returns the existing entitlement, no credit spent).
 */
import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';
import { computeKundaliFingerprint } from '@/lib/kundali/fingerprint';

interface UnlockBody {
  date?: string;
  time?: string;
  lat?: number;
  lng?: number;
  displayName?: string;
}

export async function POST(req: Request) {
  // Rate-limit by IP. Unlock can be called rapidly on re-render but
  // never more than ~1/sec from a real user. 20/min is generous.
  const ip = getClientIP(req);
  const { allowed } = checkRateLimit(ip, { maxRequests: 20, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: UnlockBody;
  try {
    body = (await req.json()) as UnlockBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { date, time, lat, lng, displayName } = body;
  if (
    typeof date !== 'string' ||
    typeof time !== 'string' ||
    typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90 ||
    typeof lng !== 'number' || !Number.isFinite(lng) || lng < -180 || lng > 180
  ) {
    return NextResponse.json({ error: 'Missing or invalid birth params (date, time, lat in [-90,90], lng in [-180,180])' }, { status: 400 });
  }

  // Compute the fingerprint — throws on malformed date/time.
  let fingerprint: string;
  try {
    fingerprint = computeKundaliFingerprint({ date, time, lat, lng });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid birth params' },
      { status: 400 },
    );
  }

  // Authenticate.
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Sanitise displayName (optional friendly label for the credits page).
  // Cap at 80 chars to prevent storage abuse.
  const safeName = typeof displayName === 'string' && displayName.length > 0
    ? displayName.slice(0, 80)
    : null;

  // Atomic spend via SECURITY DEFINER RPC.
  const { data, error } = await supabase.rpc('spend_chart_credit', {
    p_user_id: user.id,
    p_fingerprint: fingerprint,
    p_display_name: safeName,
    p_source: 'single', // Source label for audit; per-credit source tracking can be added later.
  });

  if (error) {
    console.error('[kundali/unlock] spend_chart_credit failed:', error.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
  if (!data || typeof data !== 'object') {
    console.error('[kundali/unlock] spend_chart_credit returned null/non-object data');
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  // RPC returns { status, entitlement_id? | credits_remaining? }.
  // It already gives us credits_remaining on every branch — no need to
  // do a second SELECT round-trip on chart_credits.
  const result = data as { status: string; entitlement_id?: string; credits_remaining?: number };

  return NextResponse.json({
    status: result.status,
    entitlementId: result.entitlement_id ?? null,
    creditsRemaining: result.credits_remaining ?? 0,
    fingerprint,
  });
}
