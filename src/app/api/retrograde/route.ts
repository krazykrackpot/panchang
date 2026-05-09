import { NextRequest, NextResponse } from 'next/server';
import { generateRetrogradeCalendar } from '@/lib/calendar/retro-combust';

export async function GET(req: NextRequest) {
  try {
    const year = parseInt(req.nextUrl.searchParams.get('year') || String(new Date().getFullYear()));
    const periods = generateRetrogradeCalendar(year);
    return NextResponse.json({ year, periods }, {
      headers: { 'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400' },
    });
  } catch (err) {
    console.error('[retrograde] error:', err);
    return NextResponse.json({ error: 'Failed to generate retrograde calendar' }, { status: 500 });
  }
}
