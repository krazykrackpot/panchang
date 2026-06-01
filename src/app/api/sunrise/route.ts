import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';
import { dateToJD } from '@/lib/ephem/astronomical';
import { sunriseUTHours, sunsetUTHours } from '@/lib/ephem/swiss-ephemeris';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

/**
 * GET /api/sunrise?date=YYYY-MM-DD&lat=&lng=&tz=&timezone=
 *
 * Returns sunrise/sunset UT hours for the given civil date and location.
 *
 * Why an endpoint: client-side hora and other UIs that need sunrise must
 * compute it consistently with the server-side panchang/kundali surfaces.
 * Native Swiss Ephemeris can't run in browsers; calling this server route
 * gives the client the same sweph-primary, Meeus-fallback precision as
 * the rest of the engine.
 *
 * Response:
 *   {
 *     sunriseUT: number | null,   // UT decimal hours; null on polar non-rise
 *     sunsetUT:  number | null,   // null on polar non-set
 *     warnings:  string[],         // populated when either is null
 *   }
 *
 * No silent fallback. Callers must handle null sunrise/sunset by surfacing
 * the "no sunrise on this day" UX state (Lesson F).
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  tz: z.coerce.number().min(-12).max(14).optional(),
  timezone: z.string().max(100).optional(),
});

export async function GET(request: Request): Promise<Response> {
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(`sunrise:${ip}`, { maxRequests: 240, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    date: searchParams.get('date'),
    lat: searchParams.get('lat'),
    lng: searchParams.get('lng'),
    tz: searchParams.get('tz') ?? undefined,
    timezone: searchParams.get('timezone') ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid parameters', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const { date, lat, lng, tz, timezone } = parsed.data;
    const [y, m, d] = date.split('-').map(Number);
    const jd = dateToJD(y, m, d, 0);
    const tzOffset = timezone
      ? getUTCOffsetForDate(y, m, d, timezone)
      : (tz ?? 0);

    const sunriseUT = sunriseUTHours(jd, lat, lng, tzOffset);
    const sunsetUT = sunsetUTHours(jd, lat, lng, tzOffset);

    const warnings: string[] = [];
    if (sunriseUT === null) {
      warnings.push(`No sunrise on ${date} at lat ${lat}°: polar non-rise day.`);
    }
    if (sunsetUT === null) {
      warnings.push(`No sunset on ${date} at lat ${lat}°: polar non-set day.`);
    }

    return NextResponse.json(
      { sunriseUT, sunsetUT, warnings },
      {
        headers: {
          // Sunrise for a given (date, lat, lng) is deterministic — safe to
          // cache for the day. Per-request rate limit still applies.
          'Cache-Control': 'public, s-maxage=3600, max-age=300',
        },
      },
    );
  } catch (err) {
    console.error('[API/sunrise] computation failed:', err);
    return NextResponse.json(
      { error: 'Failed to compute sunrise/sunset' },
      { status: 500 },
    );
  }
}
