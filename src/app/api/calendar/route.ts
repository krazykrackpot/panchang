import { NextResponse } from 'next/server';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');
  // Accept both 'timezone' (IANA string, preferred) and 'tz' (numeric offset, legacy)
  const timezoneParam = searchParams.get('timezone') || searchParams.get('tz');

  if (!latParam || !lonParam || !timezoneParam) {
    return NextResponse.json({ error: 'Location required. Provide lat, lon, and timezone (IANA string like Europe/Zurich) or tz (numeric offset).' }, { status: 400 });
  }

  const lat = parseFloat(latParam);
  const lon = parseFloat(lonParam);

  try {
    const festivals = generateFestivalCalendarV2(year, lat, lon, timezoneParam);
    return NextResponse.json({ year, festivals }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600' },
    });
  } catch (err) {
    console.error('[calendar] computation error:', err);
    return NextResponse.json({ error: 'Failed to generate calendar: ' + String(err) }, { status: 500 });
  }
}
