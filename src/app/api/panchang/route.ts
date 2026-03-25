import { NextResponse } from 'next/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
  const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
  const day = parseInt(searchParams.get('day') || new Date().getDate().toString());
  const lat = parseFloat(searchParams.get('lat') || '28.6139');
  const lng = parseFloat(searchParams.get('lng') || '77.2090');
  const tzOffset = parseFloat(searchParams.get('tz') || '5.5');
  const locationName = searchParams.get('location') || 'New Delhi';

  try {
    const panchang = computePanchang({
      year, month, day, lat, lng, tzOffset, locationName,
    });

    return NextResponse.json(panchang);
  } catch {
    return NextResponse.json(
      { error: 'Failed to compute panchang' },
      { status: 500 }
    );
  }
}
