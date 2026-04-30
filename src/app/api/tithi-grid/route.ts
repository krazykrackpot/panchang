import { NextResponse } from 'next/server';
import { loadPrecomputedTable } from '@/lib/calendar/tithi-table';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { YOGAS } from '@/lib/constants/yogas';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import {
  dateToJD, moonLongitude, toSidereal, getNakshatraNumber,
  calculateYoga, getRashiNumber, calculateTithi,
} from '@/lib/ephem/astronomical';
import { getSunTimes } from '@/lib/astronomy/sunrise';
import type { LocaleText } from '@/types/panchang';

/**
 * GET /api/tithi-grid?year=2026&month=5&lat=46.48&lon=6.82&timezone=Europe/Zurich
 *
 * Two-tier strategy:
 * 1. FAST PATH: if precomputed tithi table exists (56 cities × 3 years),
 *    uses it for tithi data (instant JSON read). Then computes only
 *    Moon position + sunrise/sunset per day (~31 lightweight calls).
 * 2. FALLBACK: if no precomputed table (arbitrary location), computes
 *    tithi directly from calculateTithi() per day — still fast because
 *    it's just 31 Sun+Moon elongation calls, not the full yearly scan.
 *
 * Never calls computePanchang (all 9 planets) or builds the full yearly
 * tithi table on-demand (which scans 14 months of tithis).
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

    // ── FAST PATH: try precomputed tithi table (instant JSON read, no computation) ──
    const precomputed = loadPrecomputedTable(year, lat, lon);
    let tithiDateMap: Map<string, { number: number; name: LocaleText; paksha: 'shukla' | 'krishna'; masa?: { amanta: string; purnimanta: string; isAdhika: boolean } }> | null = null;
    if (precomputed) {
      tithiDateMap = new Map();
      for (const entry of precomputed.entries) {
        if (!tithiDateMap.has(entry.sunriseDate)) {
          const tithiConst = TITHIS[entry.number - 1];
          tithiDateMap.set(entry.sunriseDate, {
            number: entry.number,
            name: tithiConst?.name ?? entry.name,
            paksha: entry.paksha,
            masa: entry.masa,
          });
        }
      }
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const tzOffset = getUTCOffsetForDate(year, month, d, timezone);

      // 1. Sunrise/sunset — Meeus 2-pass (±1 min, fast)
      let sunrise = '';
      let sunset = '';
      try {
        const st = getSunTimes(year, month, d, lat, lon, tzOffset);
        sunrise = `${String(st.sunrise.getHours()).padStart(2, '0')}:${String(st.sunrise.getMinutes()).padStart(2, '0')}`;
        sunset = `${String(st.sunset.getHours()).padStart(2, '0')}:${String(st.sunset.getMinutes()).padStart(2, '0')}`;
      } catch { /* polar regions */ }

      // 2. JD at local sunrise (or noon fallback)
      const sunriseUT = sunrise
        ? parseInt(sunrise.split(':')[0]) + parseInt(sunrise.split(':')[1]) / 60 - tzOffset
        : 12 - tzOffset;
      const jdSunrise = dateToJD(year, month, d, sunriseUT);

      // 3. Tithi — from precomputed table (fast) or per-day calculation (fallback)
      let tithiNumber: number;
      let tithiName: LocaleText;
      let paksha: 'shukla' | 'krishna';
      let masa: { amanta: string; purnimanta: string; isAdhika: boolean } | undefined;

      const cached = tithiDateMap?.get(dateStr);
      if (cached) {
        tithiNumber = cached.number;
        tithiName = cached.name;
        paksha = cached.paksha;
        masa = cached.masa;
      } else {
        // Fallback: compute tithi from Sun-Moon elongation at sunrise
        const tithiResult = calculateTithi(jdSunrise);
        tithiNumber = tithiResult.number;
        const tithiConst = TITHIS[tithiNumber - 1];
        tithiName = tithiConst?.name ?? { en: '—', hi: '—', sa: '—' };
        paksha = tithiNumber <= 15 ? 'shukla' : 'krishna';
      }

      // 4. Moon position → nakshatra + rashi (Swiss Eph when available)
      const moonTropical = moonLongitude(jdSunrise);
      const moonSid = toSidereal(moonTropical, jdSunrise);
      const nakshatraNum = getNakshatraNumber(moonSid);
      const moonRashi = getRashiNumber(moonSid);

      // 5. Yoga — Sun + Moon sidereal sum (Swiss Eph for both)
      const yogaNum = calculateYoga(jdSunrise);

      days.push({
        day: d,
        date: dateStr,
        tithiNumber,
        tithiName,
        paksha,
        masa,
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
