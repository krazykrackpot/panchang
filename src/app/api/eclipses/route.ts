import { NextRequest, NextResponse } from 'next/server';
import { generateEclipseCalendar } from '@/lib/calendar/eclipses';

export async function GET(req: NextRequest) {
  const year = parseInt(req.nextUrl.searchParams.get('year') || String(new Date().getFullYear()));
  const eclipses = generateEclipseCalendar(year);
  return NextResponse.json({ year, eclipses });
}
