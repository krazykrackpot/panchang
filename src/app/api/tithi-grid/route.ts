import { NextResponse } from 'next/server';
import { buildYearlyTithiTable } from '@/lib/calendar/tithi-table';
import { TITHIS } from '@/lib/constants/tithis';
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

    const days: {
      day: number;
      date: string;
      tithiNumber: number;
      tithiName: LocaleText;
      paksha: 'shukla' | 'krishna';
      masa?: { amanta: string; purnimanta: string; isAdhika: boolean };
    }[] = [];

    // Build a map of sunriseDate → entry for O(1) lookup
    const dateMap = new Map<string, typeof table.entries[0]>();
    for (const entry of table.entries) {
      // Each entry has a sunriseDate (YYYY-MM-DD) — the date when this tithi prevails at sunrise
      // Multiple entries can share the same sunriseDate (Vriddhi tithi), but we want the first one
      if (!dateMap.has(entry.sunriseDate)) {
        dateMap.set(entry.sunriseDate, entry);
      }
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const entry = dateMap.get(dateStr);

      if (entry) {
        const tithiConst = TITHIS[entry.number - 1];
        const name: LocaleText = tithiConst?.name ?? entry.name;
        days.push({
          day: d,
          date: dateStr,
          tithiNumber: entry.number,
          tithiName: name,
          paksha: entry.paksha,
          masa: entry.masa,
        });
      } else {
        // Date not in this year's table (e.g., Jan 1 might belong to previous year's table)
        // Try previous year's table for edge cases
        days.push({
          day: d,
          date: dateStr,
          tithiNumber: 0,
          tithiName: { en: '—', hi: '—', sa: '—' },
          paksha: 'shukla',
        });
      }
    }

    return NextResponse.json({ year, month, days });
  } catch (err: unknown) {
    console.error('[tithi-grid] error:', err);
    return NextResponse.json({ error: 'Failed to compute tithi grid' }, { status: 500 });
  }
}
