import { NextResponse } from 'next/server';
import { loadPrecomputedTable } from '@/lib/calendar/tithi-table';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { getLunarMasaForDate } from '@/lib/calendar/hindu-months';

// Canonical 12-month order (Chaitra → Phalguna) — used to derive the
// purnimanta month from the amanta month during Krishna Paksha.
// Mirrors MONTH_ORDER in src/lib/constants/festival-details.ts.
const MASA_ORDER: string[] = [
  'chaitra', 'vaishakha', 'jyeshtha', 'ashadha',
  'shravana', 'bhadrapada', 'ashwina', 'kartika',
  'margashirsha', 'pausha', 'magha', 'phalguna',
];
import {
  dateToJD, moonLongitude, sunLongitude, toSidereal,
  getNakshatraNumber, calculateYoga, getRashiNumber, calculateTithi,
  calculateKarana, calculateRahuKaal,
  getMasa, MASA_NAMES, getRitu, RITU_NAMES, getSamvatsara, SAMVATSARA_NAMES,
  getAyana, lahiriAyanamsha,
} from '@/lib/ephem/astronomical';
import { getSunTimes, formatMinutesHHMM } from '@/lib/astronomy/sunrise';
import {
  elongationAt, moonSidAt, yogaAt, nextBoundary, formatLocalTimeFromUT,
} from '@/lib/calendar/tithi-grid-projection';
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
  const latRaw = searchParams.get('lat');
  const lonRaw = searchParams.get('lon');
  const lat = latRaw != null ? parseFloat(latRaw) : NaN;
  const lon = lonRaw != null ? parseFloat(lonRaw) : NaN;
  const timezone = searchParams.get('timezone')?.trim();

  // Tighter input validation — review finding M5 + CLAUDE.md Lesson AA.
  // (No silent default to Gulf of Guinea (0,0) — the project rule is no
  // hardcoded location defaults.)
  if (!timezone) {
    return NextResponse.json({ error: 'timezone parameter required' }, { status: 400 });
  }
  if (!Number.isFinite(year) || year < 1900 || year > 2100) {
    return NextResponse.json({ error: 'year must be a number 1900-2100' }, { status: 400 });
  }
  if (!Number.isFinite(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: 'month must be 1-12' }, { status: 400 });
  }
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    return NextResponse.json({ error: 'lat must be a number -90..90' }, { status: 400 });
  }
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
    return NextResponse.json({ error: 'lon must be a number -180..180' }, { status: 400 });
  }

  try {
    // Date.UTC + getUTCDate to avoid local-TZ drift (CLAUDE.md Lesson L).
    // Month "0" trick still works: Date.UTC(y, m, 0) → last day of month m.
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    interface DayOut {
      day: number;
      date: string;
      tithiNumber: number;
      tithiName: LocaleText;
      paksha: 'shukla' | 'krishna';
      masa?: { amanta: string; purnimanta: string; isAdhika: boolean };
      nakshatra?: LocaleText;
      nakshatraNum?: number;
      moonRashi?: LocaleText;
      moonRashiNum?: number;
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

      // 1. Sunrise/sunset. getSunTimes throws on polar latitudes (no sunrise
      // /sunset that day) — we fall back to noon/18:00 for the JD anchor so
      // the rest of the panchang chain stays computable. Any *other* throw
      // (TypeError, unexpected lat/lon edge) surfaces via console.error so
      // it doesn't hide silently behind the polar fallback (review M6).
      let sunrise = '';
      let sunset = '';
      let sunriseDecHr = 12;
      let sunsetDecHr = 18;
      try {
        const st = getSunTimes(year, month, d, lat, lon, tzOffset);
        // Use the tz-safe minute fields — Date accessors leak server-local tz.
        // (Audit P0-15 follow-up; Sprint 4 fixed eclipse-compute + panchang-calc.)
        sunrise = formatMinutesHHMM(st.sunriseMinutes);
        sunset = formatMinutesHHMM(st.sunsetMinutes);
        sunriseDecHr = st.sunriseMinutes / 60;
        sunsetDecHr = st.sunsetMinutes / 60;
      } catch (err) {
        const msg = err instanceof Error ? err.message.toLowerCase() : '';
        const isPolar = msg.includes('polar') || msg.includes('no sunrise') || msg.includes('no sunset');
        if (!isPolar) {
          console.error('[tithi-grid] getSunTimes unexpected error', { year, month, d, lat, lon, err });
        }
      }

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

      // Fallback masa: when the precomputed table is missing this year /
      // location, derive both amanta and purnimanta names from
      // `getLunarMasaForDate()`. Purnimanta during Krishna Paksha is the
      // NEXT amanta month (purnimant boundary is Purnima, so the Krishna
      // half belongs to the upcoming purnimant month); during Shukla
      // Paksha both conventions agree on the same month name.
      if (!masa) {
        const lm = getLunarMasaForDate(year, month, d);
        if (lm) {
          const amantaBase = lm.name.en.toLowerCase().replace(/^adhika /, '');
          const amantaIdx = MASA_ORDER.indexOf(amantaBase);
          const purnimantaBase = paksha === 'krishna' && amantaIdx >= 0
            ? MASA_ORDER[(amantaIdx + 1) % 12]
            : amantaBase;
          masa = {
            amanta: amantaBase,
            purnimanta: purnimantaBase,
            isAdhika: lm.isAdhika,
          };
        }
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

      // 6. Rahu Kaal — needs UT-decimal sunrise+sunset + weekday (0=Sun).
      // Date.UTC + getUTCDay so the weekday doesn't drift by a day in dev
      // (server-local TZ ≠ UTC). CLAUDE.md Lesson L bans the bare local
      // constructor and Lesson O fixes the 0=Sunday convention.
      const weekday = new Date(Date.UTC(year, month - 1, d)).getUTCDay();
      const rk = calculateRahuKaal(sunriseUT, sunsetUT, weekday);
      const rahuKaalStartHHMM = formatLocalTimeFromUT(rk.start, tzOffset);
      const rahuKaalEndHHMM = formatLocalTimeFromUT(rk.end, tzOffset);

      // Surface index-out-of-range as a loud log line instead of letting
      // `?.name` silently produce `undefined` and ghost the UI row
      // (review finding B4).
      const nakConst = NAKSHATRAS[nakshatraNum - 1];
      const moonRashiConst = RASHIS[moonRashiNum - 1];
      const yogaConst = YOGAS[yogaNum - 1];
      const karanaConst = KARANAS[karanaNum - 1];
      const sunRashiConst = RASHIS[sunRashiNum - 1];
      if (!nakConst || !moonRashiConst || !yogaConst || !karanaConst || !sunRashiConst) {
        console.error('[tithi-grid] panchang constant lookup out of range', {
          date: dateStr, nakshatraNum, moonRashiNum, yogaNum, karanaNum, sunRashiNum,
        });
      }

      days.push({
        day: d,
        date: dateStr,
        tithiNumber,
        tithiName,
        paksha,
        masa,
        nakshatra: nakConst?.name,
        nakshatraNum,
        moonRashi: moonRashiConst?.name,
        moonRashiNum,
        yoga: yogaConst?.name,
        karana: karanaConst?.name,
        sunRashi: sunRashiConst?.name,
        sunrise,
        sunset,
        tithiEnd,
        nakshatraEnd,
        yogaEnd,
        moonRashiEnd,
        rahuKaal: { start: rahuKaalStartHHMM, end: rahuKaalEndHHMM },
      });
    }

    // ── Monthly meta (samvatsara / masa / ritu / ayana / ayanamsha) ────
    // Sampled at mid-month noon UT so the values are representative even when
    // the calendar month spans two lunar months.
    const midDay = Math.min(15, daysInMonth);
    const jdMid = dateToJD(year, month, midDay, 12);
    const sunSidMid = toSidereal(sunLongitude(jdMid), jdMid);
    const masaIdx = getMasa(sunSidMid);
    const rituIdx = getRitu(masaIdx);
    const samvIdx = getSamvatsara(year);
    const ayanamshaDeg = lahiriAyanamsha(jdMid);
    // Note: `masaSolar` is derived from the Sun's sidereal longitude — this
    // is the solar masa, distinct from the lunar (Amanta/Purnimanta) masa
    // attached to each day. Renamed from `masa` to disambiguate (Lesson M).
    const meta = {
      samvatsara: SAMVATSARA_NAMES[samvIdx] ?? { en: '—', hi: '—', sa: '—' },
      masaSolar: MASA_NAMES[masaIdx] ?? { en: '—', hi: '—', sa: '—' },
      ritu: RITU_NAMES[rituIdx] ?? { en: '—', hi: '—', sa: '—' },
      ayana: getAyana(sunSidMid),
      ayanamshaDeg: Number(ayanamshaDeg.toFixed(4)),
    };

    return NextResponse.json({ year, month, meta, days });
  } catch (err: unknown) {
    console.error('[tithi-grid] error:', err);
    return NextResponse.json({ error: 'Failed to compute tithi grid' }, { status: 500 });
  }
}

// Helpers extracted to @/lib/calendar/tithi-grid-projection for testability
// (review M3 — CLAUDE.md Lessons L+V class of bug).
