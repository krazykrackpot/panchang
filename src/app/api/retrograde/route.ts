import { NextRequest, NextResponse } from 'next/server';
import { generateRetrogradeCalendar } from '@/lib/calendar/retro-combust';

export async function GET(req: NextRequest) {
  const year = parseInt(req.nextUrl.searchParams.get('year') || String(new Date().getFullYear()));
  const periods = generateRetrogradeCalendar(year);
  return NextResponse.json({ year, periods }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600' },
  });
}
