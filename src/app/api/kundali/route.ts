import { NextResponse } from 'next/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/kundali';

export async function POST(request: Request) {
  try {
    const body: BirthData = await request.json();

    if (!body.date || !body.time || !body.lat || !body.lng || !body.timezone) {
      return NextResponse.json(
        { error: 'Missing required fields: date, time, lat, lng, timezone' },
        { status: 400 }
      );
    }
    // Validate coordinate bounds
    if (Math.abs(body.lat) > 90 || Math.abs(body.lng) > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates: lat must be -90 to 90, lng must be -180 to 180' },
        { status: 400 }
      );
    }

    const kundali = generateKundali(body);

    return NextResponse.json(kundali, {
      headers: { 'Cache-Control': 'no-store' }, // Never cache — birth data varies per request
    });
  } catch (err) {
    console.error('[API/kundali] Generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate kundali' },
      { status: 500 }
    );
  }
}
