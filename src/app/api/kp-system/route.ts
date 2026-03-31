import { NextResponse } from 'next/server';
import { generateKPChart } from '@/lib/kp/kp-chart';
import { withFeatureGate } from '@/lib/subscription/api-gate';
import type { BirthData } from '@/types/kundali';

export async function POST(request: Request) {
  try {
    const gate = await withFeatureGate(request, 'kp_system');
    if (!gate.allowed) return gate.error;

    const body: BirthData = await request.json();

    if (!body.date || !body.time || !body.lat || !body.lng) {
      return NextResponse.json(
        { error: 'Missing required fields: date, time, lat, lng' },
        { status: 400 },
      );
    }

    const result = generateKPChart(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate KP chart' },
      { status: 500 },
    );
  }
}
