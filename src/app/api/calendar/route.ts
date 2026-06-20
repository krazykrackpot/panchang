import { NextResponse } from 'next/server';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

export async function GET(request: Request) {
  // P1-40 — rate limit + input validation. Was unprotected on both axes.
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(ip, { maxRequests: 30, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');
  // Accept both 'timezone' (IANA string, preferred) and 'tz' (numeric offset, legacy)
  const timezoneParam = searchParams.get('timezone') || searchParams.get('tz');

  if (!latParam || !lonParam || !timezoneParam) {
    return NextResponse.json({ error: 'Location required. Provide lat, lon, and timezone (IANA string like Europe/Zurich) or tz (numeric offset).' }, { status: 400 });
  }

  const lat = parseFloat(latParam);
  const lon = parseFloat(lonParam);

  // Range validation — silently passing NaN / out-of-range coordinates
  // caused the festival generator to loop or throw with internal stack
  // traces. Reject early with a clean 400.
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return NextResponse.json({ error: 'year must be an integer between 1900 and 2100' }, { status: 400 });
  }
  if (!Number.isFinite(lat) || Math.abs(lat) > 90) {
    return NextResponse.json({ error: 'lat must be a number in [-90, 90]' }, { status: 400 });
  }
  if (!Number.isFinite(lon) || Math.abs(lon) > 180) {
    return NextResponse.json({ error: 'lon must be a number in [-180, 180]' }, { status: 400 });
  }

  try {
    const festivals = generateFestivalCalendarV2(year, lat, lon, timezoneParam);
    return NextResponse.json({ year, festivals }, {
      headers: { 'Cache-Control': 'public, s-maxage=86400' },
    });
  } catch (err) {
    // Generic error to the client — `String(err)` leaks the stack trace
    // and module paths to any unauthenticated caller. Round 4 audit.
    console.error('[calendar] computation error:', err);
    return NextResponse.json({ error: 'Failed to generate calendar' }, { status: 500 });
  }
}
