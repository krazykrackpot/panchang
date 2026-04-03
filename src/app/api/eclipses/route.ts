import { NextRequest, NextResponse } from 'next/server';
import { generateEclipseCalendar } from '@/lib/calendar/eclipses';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
  const eclipses = generateEclipseCalendar(year);
  return NextResponse.json({ year, eclipses }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600' },
  });
}
