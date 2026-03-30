import { NextResponse } from 'next/server';
import { generateFestivalCalendar } from '@/lib/calendar/festivals';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
  const lat = parseFloat(searchParams.get('lat') || '28.6139');
  const lon = parseFloat(searchParams.get('lon') || '77.209');
  const tz  = parseFloat(searchParams.get('tz')  || '5.5');

  try {
    const festivals = generateFestivalCalendar(year, lat, lon, tz);
    return NextResponse.json({ year, festivals });
  } catch {
    return NextResponse.json({ error: 'Failed to generate calendar' }, { status: 500 });
  }
}
