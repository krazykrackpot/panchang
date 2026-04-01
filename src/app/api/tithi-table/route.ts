import { NextResponse } from 'next/server';
import { buildYearlyTithiTable, lookupAllTithiByNumber } from '@/lib/calendar/tithi-table';

/**
 * Test endpoint for the yearly tithi table.
 * GET /api/tithi-table?year=2026&lat=46.4833&lon=6.8167&timezone=Europe/Zurich
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || '2026');
  const lat = parseFloat(searchParams.get('lat') || '28.6139');
  const lon = parseFloat(searchParams.get('lon') || '77.2090');
  const timezone = searchParams.get('timezone') || 'Asia/Kolkata';

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
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
