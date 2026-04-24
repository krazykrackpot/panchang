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

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD.' },
        { status: 400 }
      );
    }
    // Validate time format (HH:MM)
    if (!/^\d{2}:\d{2}$/.test(body.time)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM.' },
        { status: 400 }
      );
    }
    const [year, month, day] = body.date.split('-').map(Number);
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return NextResponse.json(
        { error: 'Date values out of range.' },
        { status: 400 }
      );
    }
    const [hour, minute] = body.time.split(':').map(Number);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return NextResponse.json(
        { error: 'Time values out of range.' },
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
