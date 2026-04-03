import { NextResponse } from 'next/server';
import { generateTransitCalendar } from '@/lib/calendar/transits';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

  try {
    const events = generateTransitCalendar(year);
    return NextResponse.json({ year, events }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate transit calendar' }, { status: 500 });
  }
}
