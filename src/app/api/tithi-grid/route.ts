import { NextResponse } from 'next/server';
import { buildYearlyTithiTable } from '@/lib/calendar/tithi-table';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { YOGAS } from '@/lib/constants/yogas';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import {
  dateToJD, moonLongitude, toSidereal, getNakshatraNumber,
  getNakshatraPada, calculateYoga, getRashiNumber,
} from '@/lib/ephem/astronomical';
import { getSunTimes } from '@/lib/astronomy/sunrise';
import type { LocaleText } from '@/types/panchang';

/**
 * GET /api/tithi-grid?year=2026&month=5&lat=46.48&lon=6.82&timezone=Europe/Zurich
 *
 * Returns tithi + panchang summary for every day of the month.
 * Optimized: uses tithi table (pre-cached) + individual Swiss Ephemeris
 * calls for Moon position only. Does NOT call computePanchang (which
 * computes all 9 planetary positions — ~30x slower than needed).
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
    // Tithi table — yearly, cached internally by buildYearlyTithiTable
    const table = buildYearlyTithiTable(year, lat, lon, timezone);
    const dateMap = new Map<string, typeof table.entries[0]>();
    for (const entry of table.entries) {
      if (!dateMap.has(entry.sunriseDate)) {
        dateMap.set(entry.sunriseDate, entry);
      }
    }

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

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const tithiEntry = dateMap.get(dateStr);
      const tzOffset = getUTCOffsetForDate(year, month, d, timezone);

      // 1. Sunrise/sunset — Meeus 2-pass (accurate to ±1 min, fast)
      let sunrise = '';
      let sunset = '';
      try {
        const st = getSunTimes(year, month, d, lat, lon, tzOffset);
        sunrise = `${String(st.sunrise.getHours()).padStart(2, '0')}:${String(st.sunrise.getMinutes()).padStart(2, '0')}`;
        sunset = `${String(st.sunset.getHours()).padStart(2, '0')}:${String(st.sunset.getMinutes()).padStart(2, '0')}`;
      } catch { /* polar regions — sunrise may not exist */ }

      // 2. Moon position at sunrise — Swiss Ephemeris when available
      const sunriseUT = sunrise
        ? parseInt(sunrise.split(':')[0]) + parseInt(sunrise.split(':')[1]) / 60 - tzOffset
        : 12 - tzOffset; // fallback to noon
      const jdSunrise = dateToJD(year, month, d, sunriseUT);
      const moonTropical = moonLongitude(jdSunrise); // Swiss Eph if available
      const moonSid = toSidereal(moonTropical, jdSunrise);
      const nakshatraNum = getNakshatraNumber(moonSid);
      const moonRashi = getRashiNumber(moonSid);

      // 3. Yoga — needs Sun + Moon sidereal (Swiss Eph for both)
      const yogaNum = calculateYoga(jdSunrise);

      // 4. Tithi from pre-computed table
      const tithiNumber = tithiEntry?.number ?? 1;
      const tithiConst = TITHIS[tithiNumber - 1];
      const tithiName: LocaleText = tithiConst?.name ?? tithiEntry?.name ?? { en: '—', hi: '—', sa: '—' };
      const paksha = tithiEntry?.paksha ?? 'shukla';

      days.push({
        day: d,
        date: dateStr,
        tithiNumber,
        tithiName,
        paksha,
        masa: tithiEntry?.masa,
        nakshatra: NAKSHATRAS[nakshatraNum - 1]?.name,
        moonRashi: RASHIS[moonRashi - 1]?.name,
        yoga: YOGAS[yogaNum - 1]?.name,
        sunrise,
        sunset,
      });
    }

    return NextResponse.json({ year, month, days });
  } catch (err: unknown) {
    console.error('[tithi-grid] error:', err);
    return NextResponse.json({ error: 'Failed to compute tithi grid' }, { status: 500 });
  }
}
