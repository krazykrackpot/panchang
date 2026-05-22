import { NextResponse } from 'next/server';
import { loadPrecomputedTable } from '@/lib/calendar/tithi-table';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import {
  dateToJD, moonLongitude, sunLongitude, toSidereal, getAyanamsha,
  getNakshatraNumber, calculateYoga, getRashiNumber, calculateTithi,
  calculateKarana, calculateRahuKaal, normalizeDeg,
} from '@/lib/ephem/astronomical';
import { getSunTimes } from '@/lib/astronomy/sunrise';
import type { LocaleText } from '@/types/panchang';

/**
 * GET /api/tithi-grid?year=2026&month=5&lat=46.48&lon=6.82&timezone=Europe/Zurich
 *
 * Returns a per-day payload covering tithi, nakshatra, yoga, karana, moon
 * sign, sun sign, sunrise/sunset, Rahu Kaal, and end-times for the lunar
 * elements (so the calendar cell can render "Magha → 22:18" etc.).
 *
 * Two-tier strategy:
 * 1. FAST PATH: if precomputed tithi table exists (56 cities × 3 years),
 *    uses it for tithi data (instant JSON read). Then computes only
 *    Moon position + sunrise/sunset + end-time projections per day.
 * 2. FALLBACK: if no precomputed table (arbitrary location), computes
 *    tithi directly per day — still fast.
 *
 * Never calls computePanchang (all 9 planets) or builds the full yearly
 * tithi table on-demand.
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
      karana?: LocaleText;
      sunRashi?: LocaleText;
      sunrise?: string;
      sunset?: string;
      // Local HH:MM transition times. nextDay flag set when the transition
      // falls past midnight in the user's timezone.
      tithiEnd?: { hhmm: string; nextDay: boolean };
      nakshatraEnd?: { hhmm: string; nextDay: boolean };
      yogaEnd?: { hhmm: string; nextDay: boolean };
      moonRashiEnd?: { hhmm: string; nextDay: boolean };
      rahuKaal?: { start: string; end: string };
    }
    const days: DayOut[] = [];

    // ── FAST PATH: try precomputed tithi table (instant JSON read) ──────
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

      // 1. Sunrise/sunset
      let sunrise = '';
      let sunset = '';
      let sunriseDecHr = 12;
      let sunsetDecHr = 18;
      try {
        const st = getSunTimes(year, month, d, lat, lon, tzOffset);
        sunrise = `${String(st.sunrise.getHours()).padStart(2, '0')}:${String(st.sunrise.getMinutes()).padStart(2, '0')}`;
        sunset = `${String(st.sunset.getHours()).padStart(2, '0')}:${String(st.sunset.getMinutes()).padStart(2, '0')}`;
        sunriseDecHr = st.sunrise.getHours() + st.sunrise.getMinutes() / 60;
        sunsetDecHr = st.sunset.getHours() + st.sunset.getMinutes() / 60;
      } catch { /* polar regions */ }

      // 2. JD at local sunrise (or noon fallback)
      const sunriseUT = sunriseDecHr - tzOffset;
      const sunsetUT = sunsetDecHr - tzOffset;
      const jdSunrise = dateToJD(year, month, d, sunriseUT);

      // 3. Tithi
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
        const tithiResult = calculateTithi(jdSunrise);
        tithiNumber = tithiResult.number;
        const tithiConst = TITHIS[tithiNumber - 1];
        tithiName = tithiConst?.name ?? { en: ' – ', hi: ' – ', sa: ' – ' };
        paksha = tithiNumber <= 15 ? 'shukla' : 'krishna';
      }

      // 4. Moon + Sun sidereal positions (used for end-time projections too)
      const moonTropical = moonLongitude(jdSunrise);
      const moonSid = toSidereal(moonTropical, jdSunrise);
      const sunSid = toSidereal(sunLongitude(jdSunrise), jdSunrise);
      const nakshatraNum = getNakshatraNumber(moonSid);
      const moonRashiNum = getRashiNumber(moonSid);
      const sunRashiNum = getRashiNumber(sunSid);
      const yogaNum = calculateYoga(jdSunrise);
      const karanaNum = calculateKarana(jdSunrise);

      // 5. End-time projections — sample current value + value 24h ahead, then
      // linearly project to the next 360/segment boundary. Accuracy is well
      // within a minute or two for tithi/nakshatra/yoga/rashi, which is all
      // the calendar UI needs.
      const tithiEnd = nextBoundary(jdSunrise, elongationAt, 12, year, month, d, tzOffset);
      const nakshatraEnd = nextBoundary(jdSunrise, moonSidAt, 360 / 27, year, month, d, tzOffset);
      const yogaEnd = nextBoundary(jdSunrise, yogaAt, 360 / 27, year, month, d, tzOffset);
      const moonRashiEnd = nextBoundary(jdSunrise, moonSidAt, 30, year, month, d, tzOffset);

      // 6. Rahu Kaal — needs UT-decimal sunrise+sunset + weekday (0=Sun)
      const weekday = new Date(year, month - 1, d).getDay();
      const rk = calculateRahuKaal(sunriseUT, sunsetUT, weekday);
      const rahuKaalStartHHMM = formatLocalTimeFromUT(rk.start, tzOffset);
      const rahuKaalEndHHMM = formatLocalTimeFromUT(rk.end, tzOffset);

      days.push({
        day: d,
        date: dateStr,
        tithiNumber,
        tithiName,
        paksha,
        masa,
        nakshatra: NAKSHATRAS[nakshatraNum - 1]?.name,
        moonRashi: RASHIS[moonRashiNum - 1]?.name,
        yoga: YOGAS[yogaNum - 1]?.name,
        karana: KARANAS[karanaNum - 1]?.name,
        sunRashi: RASHIS[sunRashiNum - 1]?.name,
        sunrise,
        sunset,
        tithiEnd,
        nakshatraEnd,
        yogaEnd,
        moonRashiEnd,
        rahuKaal: { start: rahuKaalStartHHMM, end: rahuKaalEndHHMM },
      });
    }

    return NextResponse.json({ year, month, days });
  } catch (err: unknown) {
    console.error('[tithi-grid] error:', err);
    return NextResponse.json({ error: 'Failed to compute tithi grid' }, { status: 500 });
  }
}

// =====================================================================
// Helpers
// =====================================================================

/** Elongation (Moon−Sun) sidereal at a JD — drives tithi boundaries. */
function elongationAt(jd: number): number {
  const sunSid = toSidereal(sunLongitude(jd), jd);
  const moonSid = toSidereal(moonLongitude(jd), jd);
  return normalizeDeg(moonSid - sunSid);
}

/** Moon sidereal longitude — drives nakshatra + rashi boundaries. */
function moonSidAt(jd: number): number {
  return toSidereal(moonLongitude(jd), jd);
}

/** Sun+Moon sidereal sum — drives yoga boundaries. */
function yogaAt(jd: number): number {
  const aya = getAyanamsha(jd);
  const sunSid = normalizeDeg(sunLongitude(jd) - aya);
  const moonSid = normalizeDeg(moonLongitude(jd) - aya);
  return normalizeDeg(sunSid + moonSid);
}

/**
 * Project the JD at which `valueAt(jd)` next crosses a `segment`-degree
 * boundary, using a single linear extrapolation from a 24-hour sample.
 * Returns the local HH:MM and a flag indicating whether the transition
 * falls past midnight in the caller's timezone.
 */
function nextBoundary(
  jdStart: number,
  valueAt: (jd: number) => number,
  segmentDeg: number,
  year: number,
  month: number,
  day: number,
  tzOffset: number,
): { hhmm: string; nextDay: boolean } | undefined {
  const v0 = valueAt(jdStart);
  const v1 = valueAt(jdStart + 1);
  let dv = v1 - v0;
  if (dv <= 0) dv += 360; // handle wrap (lunar elements always move forward)
  if (dv <= 0) return undefined;

  // Degrees remaining inside the current segment.
  const remaining = segmentDeg - (v0 % segmentDeg);
  const daysToCross = remaining / dv;
  const jdEnd = jdStart + daysToCross;
  return jdToLocalHHMM(jdEnd, year, month, day, tzOffset);
}

/**
 * Convert a Julian Day to a local-timezone HH:MM string, flagging whether
 * the moment falls on a later civil day than (year, month, day).
 *
 * We avoid jdToDate() because JD↔Date conversions for transition-time
 * resolution are delicate; instead, we work in fractional UT hours and add
 * the timezone offset, then split into calendar components.
 */
function jdToLocalHHMM(
  jd: number,
  year: number,
  month: number,
  day: number,
  tzOffset: number,
): { hhmm: string; nextDay: boolean } {
  // jd at 00:00 UT of the (year, month, day) date.
  const jd0 = dateToJD(year, month, day, 0);
  const hoursUT = (jd - jd0) * 24;
  const hoursLocal = hoursUT + tzOffset;

  // dayOffset 0 if 0 ≤ hoursLocal < 24, 1 if past midnight, -1 if before midnight (rare).
  const dayOffset = Math.floor(hoursLocal / 24);
  let h = hoursLocal - dayOffset * 24;
  if (h < 0) h += 24;

  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  // mm can round to 60 — carry into hh and clamp.
  const finalHH = (hh + Math.floor(mm / 60)) % 24;
  const finalMM = mm % 60;
  return {
    hhmm: `${String(finalHH).padStart(2, '0')}:${String(finalMM).padStart(2, '0')}`,
    nextDay: dayOffset > 0,
  };
}

/** UT decimal hours → local HH:MM (used for Rahu Kaal start/end). */
function formatLocalTimeFromUT(utDecHr: number, tzOffset: number): string {
  let local = utDecHr + tzOffset;
  while (local < 0) local += 24;
  while (local >= 24) local -= 24;
  const hh = Math.floor(local);
  const mm = Math.round((local - hh) * 60);
  const finalHH = (hh + Math.floor(mm / 60)) % 24;
  const finalMM = mm % 60;
  return `${String(finalHH).padStart(2, '0')}:${String(finalMM).padStart(2, '0')}`;
}
