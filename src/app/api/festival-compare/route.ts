import { NextResponse } from 'next/server';
import { generateFestivalCalendar } from '@/lib/calendar/festivals';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';

/**
 * Compare V1 vs V2 festival calendar output.
 * GET /api/festival-compare?year=2026&lat=46.4833&lon=6.8167&timezone=Europe/Zurich
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || '2026');
  const lat = parseFloat(searchParams.get('lat') || '0'); // DEPRECATED fallback: client should always provide location
  const lon = parseFloat(searchParams.get('lon') || '0'); // DEPRECATED fallback: client should always provide location
  const timezone = searchParams.get('timezone');
  if (!timezone) return Response.json({ error: 'timezone parameter required' }, { status: 400 });

  try {
    const v1 = generateFestivalCalendar(year, lat, lon, timezone);
    const v2 = generateFestivalCalendarV2(year, lat, lon, timezone);

    // Compare Ekadashis specifically
    const v1Ek = v1.filter(f => f.category === 'ekadashi').map(f => ({
      date: f.date,
      name: typeof f.name === 'object' ? f.name.en : f.name,
    }));
    const v2Ek = v2.filter(f => f.category === 'ekadashi').map(f => ({
      date: f.date,
      name: typeof f.name === 'object' ? f.name.en : f.name,
    }));

    // Compare major festivals
    const v1Maj = v1.filter(f => f.type === 'major').map(f => ({
      date: f.date,
      name: typeof f.name === 'object' ? f.name.en : f.name,
    }));
    const v2Maj = v2.filter(f => f.type === 'major').map(f => ({
      date: f.date,
      name: typeof f.name === 'object' ? f.name.en : f.name,
    }));

    return NextResponse.json({
      v1: { total: v1.length, ekadashis: v1Ek.length, majors: v1Maj.length },
      v2: { total: v2.length, ekadashis: v2Ek.length, majors: v2Maj.length },
      ekadashiComparison: v2Ek.map((e, i) => ({
        v2: e,
        v1: v1Ek[i] || null,
        match: v1Ek[i]?.date === e.date && v1Ek[i]?.name === e.name,
      })),
      majorComparison: v2Maj.map(m => {
        const v1Match = v1Maj.find(v => v.name === m.name);
        return { v2: m, v1: v1Match || null, match: v1Match?.date === m.date };
      }),
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=86400' },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
