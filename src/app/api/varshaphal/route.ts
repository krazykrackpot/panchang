import { NextResponse } from 'next/server';
import { generateVarshaphal } from '@/lib/varshaphal';
import { withFeatureGate } from '@/lib/subscription/api-gate';
import type { BirthData } from '@/types/kundali';

export async function POST(request: Request) {
  try {
    const gate = await withFeatureGate(request, 'varshaphal');
    if (!gate.allowed) return gate.error;

    const body = await request.json();
    const { birthData, year } = body as { birthData: BirthData; year: number };

    if (!birthData?.date || !birthData?.time || !birthData?.lat || !birthData?.lng) {
      return NextResponse.json(
        { error: 'Missing required birth data fields: date, time, lat, lng' },
        { status: 400 },
      );
    }

    if (!year || year < 1900 || year > 2100) {
      return NextResponse.json(
        { error: 'Invalid year. Must be between 1900 and 2100.' },
        { status: 400 },
      );
    }

    const result = generateVarshaphal(birthData, year);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate Varshaphal chart' },
      { status: 500 },
    );
  }
}
