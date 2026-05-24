import { NextResponse } from 'next/server';
import { buildYearlyTithiTable, lookupAllTithiByNumber } from '@/lib/calendar/tithi-table';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

/**
 * Yearly tithi table endpoint.
 * GET /api/tithi-table?year=2026&lat=46.4833&lon=6.8167&timezone=Europe/Zurich
 */
export async function GET(request: Request) {
  // P1-44 — rate limit + input validation. Was unprotected; also leaked
  // String(err) in the catch path (now generic). The yearly table is
  // expensive to build, so the limit is tighter than other GETs.
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(ip, { maxRequests: 10, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || '2026');
  const lat = parseFloat(searchParams.get('lat') || '0'); // DEPRECATED fallback: client should always provide location
  const lon = parseFloat(searchParams.get('lon') || '0'); // DEPRECATED fallback: client should always provide location
  const timezone = searchParams.get('timezone');
  if (!timezone) return NextResponse.json({ error: 'timezone parameter required' }, { status: 400 });

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
    const table = buildYearlyTithiTable(year, lat, lon, timezone);

    // Summary stats
    const ekadashis11 = lookupAllTithiByNumber(table, 11);
    const ekadashis26 = lookupAllTithiByNumber(table, 26);
    const kshayaTithis = table.entries.filter(e => e.isKshaya);
    const pakshaCount = { shukla: table.entries.filter(e => e.paksha === 'shukla').length, krishna: table.entries.filter(e => e.paksha === 'krishna').length };

    // Ekadashi details
    const ekadashiDetails = [...ekadashis11, ...ekadashis26]
      .sort((a, b) => a.startJd - b.startJd)
      .map(e => ({
        date: e.sunriseDate,
        tithi: e.number,
        paksha: e.paksha,
        month: e.lunarMonth.name,
        isAdhika: e.lunarMonth.isAdhika,
        isKshaya: e.isKshaya,
        start: `${e.startLocal} ${e.startDate}`,
        end: `${e.endLocal} ${e.endDate}`,
        durationHours: Math.round(e.durationHours * 10) / 10,
      }));

    return NextResponse.json({
      year,
      location: { lat, lon, timezone },
      totalEntries: table.entries.length,
      pakshaCount,
      lunarMonths: table.lunarMonths.map(lm => ({ name: lm.name, isAdhika: lm.isAdhika, start: lm.startDate, end: lm.endDate })),
      kshayaTithis: kshayaTithis.map(e => ({
        number: e.number,
        name: e.name.en,
        sunriseDate: e.sunriseDate,
        start: `${e.startLocal} ${e.startDate}`,
        end: `${e.endLocal} ${e.endDate}`,
      })),
      ekadashis: ekadashiDetails,
      ekadashiCount: ekadashiDetails.length,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400' },
    });
  } catch (err) {
    // Generic error to the client — String(err) leaks stack traces +
    // internal module paths. Detail stays in server logs.
    console.error('[tithi-table] error:', err);
    return NextResponse.json({ error: 'Failed to build tithi table' }, { status: 500 });
  }
}
