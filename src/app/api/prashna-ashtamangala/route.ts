import { NextResponse } from 'next/server';
import { generatePrashnaResult } from '@/lib/prashna/ashtamangala';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { QuestionCategory } from '@/types/prashna';

export async function POST(request: Request) {
  try {
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

    // Validate each number is a finite positive integer
    if (!numbers.every((n: unknown) => typeof n === 'number' && Number.isFinite(n) && Number.isInteger(n) && n > 0)) {
      return NextResponse.json(
        { error: 'Each number must be a finite positive integer' },
        { status: 400 },
      );
    }

    // Validate lat/lng ranges when provided
    if (lat !== 0 || lng !== 0) {
      if (typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90) {
        return NextResponse.json(
          { error: 'lat must be a finite number between -90 and 90' },
          { status: 400 },
        );
      }
      if (typeof lng !== 'number' || !Number.isFinite(lng) || lng < -180 || lng > 180) {
        return NextResponse.json(
          { error: 'lng must be a finite number between -180 and 180' },
          { status: 400 },
        );
      }
    }

    const result = generatePrashnaResult(numbers, category, lat, lng, tz);
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, max-age=1800' },
    });
  } catch (err) {
    console.error('[prashna-ashtamangala] computation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate Ashtamangala Prashna' },
      { status: 500 },
    );
  }
}
