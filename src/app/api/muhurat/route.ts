import { NextRequest, NextResponse } from 'next/server';
import { findMuhuratDates, getAllActivities, type MuhuratActivity } from '@/lib/calendar/muhurat-calendar';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

// Activity list is static — hoist Set construction to module load so every
// request does an O(1) lookup instead of rebuilding the Set + array each time.
const ACTIVITIES = getAllActivities();
const VALID_ACTIVITY_KEYS: ReadonlySet<string> = new Set<string>(
  ACTIVITIES.map((a) => a.key),
);

export async function GET(req: NextRequest) {
  // P1-41 — rate limit + input validation. Was unprotected.
  const ip = getClientIP(req);
  const { allowed } = checkRateLimit(ip, { maxRequests: 30, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
    const activityRaw = searchParams.get('activity') || 'marriage';
    const lat = parseFloat(searchParams.get('lat') || '0'); // DEPRECATED fallback: client should always provide location
    const lng = parseFloat(searchParams.get('lng') || '0'); // DEPRECATED fallback: client should always provide location

    // Validate against the canonical activity allowlist BEFORE casting.
    // Previous code cast any string to MuhuratActivity, allowing arbitrary
    // values to flow into the muhurat engine.
    if (!VALID_ACTIVITY_KEYS.has(activityRaw)) {
      return NextResponse.json(
        { error: `Invalid activity. Allowed: ${Array.from(VALID_ACTIVITY_KEYS).join(', ')}` },
        { status: 400 },
      );
    }
    const activity = activityRaw as MuhuratActivity;

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      return NextResponse.json({ error: 'year must be an integer between 1900 and 2100' }, { status: 400 });
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return NextResponse.json({ error: 'month must be an integer 1–12' }, { status: 400 });
    }
    if (!Number.isFinite(lat) || Math.abs(lat) > 90) {
      return NextResponse.json({ error: 'lat must be a number in [-90, 90]' }, { status: 400 });
    }
    if (!Number.isFinite(lng) || Math.abs(lng) > 180) {
      return NextResponse.json({ error: 'lng must be a number in [-180, 180]' }, { status: 400 });
    }

    const dates = findMuhuratDates(year, month, activity, lat, lng);
    return NextResponse.json({ year, month, activity, dates, activities: ACTIVITIES }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600' },
    });
  } catch (err) {
    console.error('[muhurat] error:', err);
    return NextResponse.json({ error: 'Failed to compute muhurat dates' }, { status: 500 });
  }
}
