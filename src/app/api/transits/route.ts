import { NextResponse } from 'next/server';
import { generateTransitCalendar } from '@/lib/calendar/transits';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

  if (isNaN(year) || year < 1900 || year > 2100) {
    return NextResponse.json({ error: 'Invalid year. Must be between 1900 and 2100.' }, { status: 400 });
  }

  try {
    const events = generateTransitCalendar(year);
    return NextResponse.json({ year, events }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600' },
    });
  } catch (err) {
    console.error('[transits] computation error:', err);
    return NextResponse.json({ error: 'Failed to generate transit calendar' }, { status: 500 });
  }
}
