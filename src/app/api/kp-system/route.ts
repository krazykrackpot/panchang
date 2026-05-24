import { NextResponse } from 'next/server';
import { generateKPChart } from '@/lib/kp/kp-chart';
import type { BirthData } from '@/types/kundali';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

// Strict format gates so malformed input is rejected at the boundary,
// not deep inside kp-chart's Swiss Ephemeris call.
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}(:\d{2})?$/;

export async function POST(request: Request) {
  // P1-42 — rate limit + format/range validation. Was unprotected.
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(ip, { maxRequests: 20, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: BirthData;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.date || !body.time || body.lat == null || body.lng == null) {
    return NextResponse.json(
      { error: 'Missing required fields: date, time, lat, lng' },
      { status: 400 },
    );
  }

  // Format gates — previous code accepted any string and let kp-chart's
  // Date(Date.UTC(...)) parser silently produce NaN-laden output.
  if (typeof body.date !== 'string' || !DATE_REGEX.test(body.date)) {
    return NextResponse.json({ error: 'date must be YYYY-MM-DD' }, { status: 400 });
  }
  if (typeof body.time !== 'string' || !TIME_REGEX.test(body.time)) {
    return NextResponse.json({ error: 'time must be HH:MM or HH:MM:SS' }, { status: 400 });
  }
  if (typeof body.lat !== 'number' || !Number.isFinite(body.lat) || Math.abs(body.lat) > 90) {
    return NextResponse.json({ error: 'lat must be a number in [-90, 90]' }, { status: 400 });
  }
  if (typeof body.lng !== 'number' || !Number.isFinite(body.lng) || Math.abs(body.lng) > 180) {
    return NextResponse.json({ error: 'lng must be a number in [-180, 180]' }, { status: 400 });
  }
  // timezone is optional in BirthData but recommended for accuracy.
  // kp-chart now throws on unknown IANA (Sprint 8 P1-6) — let that
  // surface as 500 with the generic message.

  try {
    const result = generateKPChart(body);
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, max-age=3600' },
    });
  } catch (err) {
    console.error('[kp-system] computation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate KP chart' },
      { status: 500 },
    );
  }
}
