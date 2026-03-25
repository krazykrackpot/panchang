import { NextResponse } from 'next/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/kundali';

export async function POST(request: Request) {
  try {
    const body: BirthData = await request.json();

    if (!body.date || !body.time || !body.lat || !body.lng) {
      return NextResponse.json(
        { error: 'Missing required fields: date, time, lat, lng' },
        { status: 400 }
      );
    }

    const kundali = generateKundali(body);

    return NextResponse.json(kundali);
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate kundali' },
      { status: 500 }
    );
  }
}
