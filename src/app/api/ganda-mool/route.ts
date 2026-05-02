import { NextRequest, NextResponse } from 'next/server';
import { computeGandaMoolDates } from '@/lib/calendar/ganda-mool';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || '2026', 10);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lon = parseFloat(searchParams.get('lon') || '0');
    const tz = (searchParams.get('tz') || 'UTC').trim();

    if (isNaN(year) || year < 1900 || year > 2100) {
      return NextResponse.json({ error: 'Invalid year (1900-2100)' }, { status: 400 });
    }
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return NextResponse.json({ error: 'Invalid latitude' }, { status: 400 });
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      return NextResponse.json({ error: 'Invalid longitude' }, { status: 400 });
    }

    const entries = computeGandaMoolDates(year, lat, lon, tz);
    return NextResponse.json({ year, entries });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/ganda-mool] error:', message);
    return NextResponse.json({ error: 'Failed to compute Ganda Mool dates' }, { status: 500 });
  }
}
