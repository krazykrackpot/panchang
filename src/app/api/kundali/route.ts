import { NextResponse } from 'next/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { withUsageGate } from '@/lib/subscription/api-gate';
import type { BirthData } from '@/types/kundali';

export async function POST(request: Request) {
  try {
    const gate = await withUsageGate(request, 'kundali', 'kundali_count');
    if (!gate.allowed) return gate.error;

    const body: BirthData = await request.json();

    if (!body.date || !body.time || !body.lat || !body.lng) {
      return NextResponse.json(
        { error: 'Missing required fields: date, time, lat, lng' },
        { status: 400 }
      );
    }

    const kundali = generateKundali(body);

    return NextResponse.json(kundali, {
      headers: { 'Cache-Control': 'private, max-age=3600' }, // Cache kundali result for 1 hour
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate kundali' },
      { status: 500 }
    );
  }
}
