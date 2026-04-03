import { NextResponse } from 'next/server';
import { generatePrashnaResult } from '@/lib/prashna/ashtamangala';
import { withFeatureGate } from '@/lib/subscription/api-gate';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { QuestionCategory } from '@/types/prashna';

export async function POST(request: Request) {
  try {
    const gate = await withFeatureGate(request, 'prashna');
    if (!gate.allowed) return gate.error;

    const body = await request.json();
    const {
      numbers,
      category = 'fortune',
      lat = 0, // DEPRECATED fallback: client should always provide location
      lng = 0, // DEPRECATED fallback: client should always provide location
      tz: tzFallback = 0,
      timezone,
    } = body as {
      numbers: [number, number, number];
      category?: QuestionCategory;
      lat?: number;
      lng?: number;
      tz?: number;
      timezone?: string;
    };

    // Resolve tz from IANA timezone string if provided
    const now = new Date();
    const tz = timezone
      ? getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), timezone)
      : tzFallback;

    if (!numbers || numbers.length !== 3) {
      return NextResponse.json(
        { error: 'Must provide exactly 3 numbers' },
        { status: 400 },
      );
    }

    const result = generatePrashnaResult(numbers, category, lat, lng, tz);
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, max-age=1800' },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate Ashtamangala Prashna' },
      { status: 500 },
    );
  }
}
