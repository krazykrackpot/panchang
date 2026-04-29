import { NextResponse } from 'next/server';
import { buildYearlyTithiTable } from '@/lib/calendar/tithi-table';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { TITHIS } from '@/lib/constants/tithis';
import { RASHIS } from '@/lib/constants/rashis';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { LocaleText } from '@/types/panchang';

/**
 * GET /api/tithi-grid?year=2026&month=5&lat=46.48&lon=6.82&timezone=Europe/Zurich
 *
 * Returns tithi data for every day of the given month — optimized for the calendar grid.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
  const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const timezone = searchParams.get('timezone')?.trim();

  if (!timezone) {
    return NextResponse.json({ error: 'timezone parameter required' }, { status: 400 });
  }
  if (month < 1 || month > 12) {
    return NextResponse.json({ error: 'month must be 1-12' }, { status: 400 });
  }

  try {
    const table = buildYearlyTithiTable(year, lat, lon, timezone);
    const daysInMonth = new Date(year, month, 0).getDate();

    interface DayOut {
      day: number;
      date: string;
      tithiNumber: number;
      tithiName: LocaleText;
      paksha: 'shukla' | 'krishna';
      masa?: { amanta: string; purnimanta: string; isAdhika: boolean };
      nakshatra?: LocaleText;
      moonRashi?: LocaleText;
      yoga?: LocaleText;
      sunrise?: string;
      sunset?: string;
    }
    const days: DayOut[] = [];

    // Tithi table for accurate tithi-at-sunrise
    const dateMap = new Map<string, typeof table.entries[0]>();
    for (const entry of table.entries) {
      if (!dateMap.has(entry.sunriseDate)) {
        dateMap.set(entry.sunriseDate, entry);
      }
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const tithiEntry = dateMap.get(dateStr);

      // Compute full panchang for this day
      const tzOffset = getUTCOffsetForDate(year, month, d, timezone);
      const panchang = computePanchang({ year, month, day: d, lat, lng: lon, tzOffset, timezone });

      const tithiNumber = tithiEntry?.number ?? panchang.tithi.number;
      const tithiConst = TITHIS[tithiNumber - 1];
      const tithiName: LocaleText = tithiConst?.name ?? tithiEntry?.name ?? panchang.tithi.name;
      const paksha = tithiEntry?.paksha ?? panchang.tithi.paksha;

      days.push({
        day: d,
        date: dateStr,
        tithiNumber,
        tithiName,
        paksha,
        masa: tithiEntry?.masa,
        nakshatra: panchang.nakshatra?.name,
        moonRashi: panchang.moonSign ? RASHIS[panchang.moonSign.rashi - 1]?.name : undefined,
        yoga: panchang.yoga?.name,
        sunrise: panchang.sunrise,
        sunset: panchang.sunset,
      });
    }

    return NextResponse.json({ year, month, days });
  } catch (err: unknown) {
    console.error('[tithi-grid] error:', err);
    return NextResponse.json({ error: 'Failed to compute tithi grid' }, { status: 500 });
  }
}
