import { NextRequest, NextResponse } from 'next/server';
import { generateCombustionCalendar } from '@/lib/calendar/retro-combust';

export async function GET(req: NextRequest) {
  const year = parseInt(req.nextUrl.searchParams.get('year') || String(new Date().getFullYear()));
  const events = generateCombustionCalendar(year);
  return NextResponse.json({ year, events }, {
    headers: { 'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400' },
  });
}
