import { NextResponse } from 'next/server';
import { generatePrashnaResult } from '@/lib/prashna/ashtamangala';
import { withFeatureGate } from '@/lib/subscription/api-gate';
import type { QuestionCategory } from '@/types/prashna';

export async function POST(request: Request) {
  try {
    const gate = await withFeatureGate(request, 'prashna');
    if (!gate.allowed) return gate.error;

    const body = await request.json();
    const {
      numbers,
      category = 'fortune',
      lat = 28.6139,
      lng = 77.2090,
      tz = 5.5,
    } = body as {
      numbers: [number, number, number];
      category?: QuestionCategory;
      lat?: number;
      lng?: number;
      tz?: number;
    };

    if (!numbers || numbers.length !== 3) {
      return NextResponse.json(
        { error: 'Must provide exactly 3 numbers' },
        { status: 400 },
      );
    }

    const result = generatePrashnaResult(numbers, category, lat, lng, tz);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate Ashtamangala Prashna' },
      { status: 500 },
    );
  }
}
