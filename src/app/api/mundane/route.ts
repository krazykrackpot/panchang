/**
 * GET /api/mundane?nation=india
 *
 * Returns a nation's mundane astrology chart and current forecast.
 * No authentication required — public data.
 */

import { NextResponse } from 'next/server';
import { getNationById, NATION_IDS } from '@/lib/mundane/nation-charts';
import { computeNationalForecast } from '@/lib/mundane/national-forecast';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nationParam = searchParams.get('nation')?.trim();
    const dateParam = searchParams.get('date')?.trim();

    if (!nationParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: nation', validIds: NATION_IDS },
        { status: 400 },
      );
    }

    const nation = getNationById(nationParam.toLowerCase());
    if (!nation) {
      return NextResponse.json(
        {
          error: `Unknown nation id: "${nationParam}"`,
          validIds: NATION_IDS,
        },
        { status: 404 },
      );
    }

    // Optional date validation
    if (dateParam && !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD.' },
        { status: 400 },
      );
    }

    const forecast = computeNationalForecast(nation, dateParam ?? undefined);

    return NextResponse.json(forecast, {
      headers: {
        // Cache for 1 hour — transits don't change faster than that
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    console.error('[API/mundane] Forecast generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate mundane astrology forecast' },
      { status: 500 },
    );
  }
}
