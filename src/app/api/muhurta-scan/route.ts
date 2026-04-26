/**
 * POST /api/muhurta-scan — Unified muhurta scanner endpoint
 *
 * Supports two resolution modes:
 * - "overview": 2-hour windows across a date range (for month heatmap)
 * - "detail": 15-minute windows for a single day (for sparkline drill-down)
 */

import { NextResponse } from 'next/server';
import { scanDateRangeV2 } from '@/lib/muhurta/time-window-scanner';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { ExtendedActivityId, MuhurtaScanResponse } from '@/types/muhurta-ai';

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const {
      activity,
      startDate,
      endDate,
      lat,
      lng,
      timezone,
      tz: tzFallback = 0,
      resolution = 'overview',
      birthNakshatra,
      birthRashi,
      dashaLords,
      detailDate,
    } = body as {
      activity: ExtendedActivityId;
      startDate: string;
      endDate: string;
      lat: number;
      lng: number;
      timezone?: string;
      tz?: number;
      resolution?: 'overview' | 'detail';
      birthNakshatra?: number;
      birthRashi?: number;
      dashaLords?: { maha: number; antar: number; pratyantar: number };
      detailDate?: string;
    };

    // Validate required fields
    if (!activity || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: activity, startDate, endDate' },
        { status: 400 },
      );
    }

    if (resolution === 'detail' && !detailDate) {
      return NextResponse.json(
        { error: 'detailDate is required for detail resolution' },
        { status: 400 },
      );
    }

    // Validate activity
    const rules = getExtendedActivity(activity);
    if (!rules) {
      return NextResponse.json(
        { error: `Unknown activity: ${activity}` },
        { status: 400 },
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return NextResponse.json(
        { error: 'Dates must be YYYY-MM-DD format' },
        { status: 400 },
      );
    }

    // Validate lat/lng
    if (
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return NextResponse.json(
        { error: 'Invalid lat/lng values' },
        { status: 400 },
      );
    }

    // Resolve timezone offset — IANA name takes priority over numeric fallback.
    // getUTCOffsetForDate handles DST transitions correctly per-date.
    let tz = tzFallback;
    if (timezone) {
      const [y, m, d] = (detailDate || startDate).split('-').map(Number);
      if (y && m && d) tz = getUTCOffsetForDate(y, m, d, timezone);
    }

    // Determine scan parameters based on resolution
    const isDetail = resolution === 'detail';
    const scanStart = isDetail && detailDate ? detailDate : startDate;
    const scanEnd = isDetail && detailDate ? detailDate : endDate;

    // ScanV2Window is a superset of HeatmapCell and DetailWindow — all fields
    // are present for both resolutions. The cast below is safe for serialization.
    const windows = scanDateRangeV2({
      startDate: scanStart,
      endDate: scanEnd,
      activity,
      lat,
      lng,
      tz,
      windowMinutes: isDetail ? 15 : 120,
      preSunriseHours: isDetail ? 2 : 0,
      postSunsetHours: isDetail ? 3 : 1,
      birthNakshatra,
      birthRashi,
      dashaLords,
    });

    // Track which personal factors were applied
    const personalFactorsUsed: MuhurtaScanResponse['meta']['personalFactorsUsed'] = [];
    if (birthNakshatra && birthNakshatra > 0) personalFactorsUsed.push('taraBala', 'chandraBala');
    if (dashaLords) personalFactorsUsed.push('dashaHarmony');

    const response: MuhurtaScanResponse = {
      // ScanV2Window is structurally compatible with HeatmapCell | DetailWindow
      windows: windows as unknown as MuhurtaScanResponse['windows'],
      meta: {
        activity,
        dateRange: [scanStart, scanEnd],
        resolution,
        personalFactorsUsed,
        computeTimeMs: Date.now() - startTime,
      },
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': isDetail
          ? 'private, max-age=300'
          : 'private, max-age=1800',
      },
    });
  } catch (err: unknown) {
    console.error('[muhurta-scan] Scan failed:', err);
    const message = err instanceof Error ? err.message : 'Muhurta scan failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
