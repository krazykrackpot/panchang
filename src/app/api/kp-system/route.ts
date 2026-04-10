import { NextResponse } from 'next/server';
import { generateKPChart } from '@/lib/kp/kp-chart';
import type { BirthData } from '@/types/kundali';

export async function POST(request: Request) {
  try {
    const body: BirthData = await request.json();

    if (!body.date || !body.time || !body.lat || !body.lng) {
      return NextResponse.json(
        { error: 'Missing required fields: date, time, lat, lng' },
        { status: 400 },
      );
    }

    const result = generateKPChart(body);
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, max-age=3600' },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate KP chart' },
      { status: 500 },
    );
  }
}
