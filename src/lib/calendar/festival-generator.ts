/**
 * Festival Calendar Generator V2 — table-based lookup
 *
 * Uses the pre-computed yearly tithi table + declarative festival definitions
 * to generate the complete festival calendar. Replaces the scanning-based approach.
 */

import { dateToJD, approximateSunrise, approximateSunset, formatTime, normalizeDeg, toSidereal, sunLongitude } from '@/lib/ephem/astronomical';
import { calculateMoonriseUT } from '@/lib/ephem/panchang-calc';

/**
 * Find when a sidereal sign occupies a specific horizon.
 * `mode`:
 *   'asc'  = scan the eastern horizon (ascendant / lagna)
 *   'desc' = scan the western horizon (descendant / 7th cusp)
 *
 * For Diwali Lakshmi Puja, tradition prescribes "Vrishabha Lagna" — but at
 * evening time Taurus (30°-60°) is setting in the west, not rising in the east.
 * The classical "Vrishabha Kaal" matches the period when the *descendant*
 * (ascendant + 180°) transits Taurus.  Pass mode='desc' for this case.
 */
function findSthiraLagna(
  startJd: number, lat: number, lon: number,
  minDeg: number, maxDeg: number, scanHours: number,
  mode: 'asc' | 'desc' = 'asc',
): { startUT: number; endUT: number } | null {
  // Ascendant calculation — mirrors kundali-calc.ts calculateTropicalAscendant()
  //
  // The raw atan2(y, x) result is the IC (Imum Coeli, nadir of the chart).
  // Adding 180° converts it to the Ascendant (ASC, eastern horizon).
  //
  // HISTORICAL BUG 1 (now fixed): this local copy of the formula omitted the
  //   asc = normalizeDeg(asc + 180)  step that kundali-calc.ts applies at
  //   line 47 before subtracting the ayanamsha.  Without it the function was
  //   returning the Descendant instead of the Ascendant — 180° inverted.
  //   Festival lagna windows (e.g. Diwali Lakshmi Puja Vrishabha Kaal) were
  //   therefore computing against the wrong sign entirely.
  //
  // HISTORICAL BUG 2 (now fixed): the ayanamsha formula used only the linear
  //   term (23.85306 + 1.39722*T) rather than the full Meeus cubic polynomial
  //   used in astronomical.ts _meeeusLahiriAyanamsha().  The quadratic term
  //   +0.00018*T*T is sub-arcminute for modern dates but grows to ~0.001° for
  //   dates far from J2000; the code should be consistent with the rest of the
  //   engine.  Fixed to match astronomical.ts exactly.
  function getAscendant(jd: number): number {
    const T = (jd - 2451545.0) / 36525.0;
    const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T;
    const lst = normalizeDeg(gmst + lon);
    const eps = 23.4393 - 0.013 * T;
    const epsR = eps * Math.PI / 180;
    const latR = lat * Math.PI / 180;
    const lstR = lst * Math.PI / 180;
    const y = -Math.cos(lstR);
    const x = Math.sin(epsR) * Math.tan(latR) + Math.cos(epsR) * Math.sin(lstR);
    let asc = Math.atan2(y, x) * 180 / Math.PI;
    // atan2 returns IC; add 180° to get the Ascendant (Bug 1 fix)
    asc = normalizeDeg(asc + 180);
    // Convert tropical to sidereal — full cubic Meeus polynomial (Bug 2 fix)
    const ayan = 23.85306 + 1.39722 * T + 0.00018 * T * T - 0.000005 * T * T * T;
    return normalizeDeg(asc - ayan);
  }

  const step = 1 / (60 * 24); // 1 minute in JD for accurate lagna boundaries
  let startFound: number | null = null;

  for (let jd = startJd; jd < startJd + scanHours / 24; jd += step) {
    const rawAsc = getAscendant(jd);
    const point = mode === 'desc' ? normalizeDeg(rawAsc + 180) : rawAsc;
    const inRange = point >= minDeg && point < maxDeg;

    if (inRange && startFound === null) {
      startFound = (jd - startJd) * 24; // hours from startJd
    } else if (!inRange && startFound !== null) {
      const endUT = (jd - startJd) * 24;
      // Return UT hours relative to midnight of the start date
      const baseUT = (startJd - Math.floor(startJd - 0.5) - 0.5) * 24;
      return { startUT: baseUT + startFound, endUT: baseUT + endUT };
    }
  }
  return null;
}
import { buildYearlyTithiTable, lookupAllTithiByNumber, getNextTithiEntry, type YearlyTithiTable, type TithiEntry } from './tithi-table';
import { MAJOR_FESTIVALS, EKADASHI_DEFS, MONTHLY_VRATS, defToTithiNumber, type FestivalDef } from './festival-defs';
import { getEkadashiName, getNextHinduMonth, getPreviousHinduMonth, ADHIKA_MASA_EKADASHI } from '@/lib/constants/festival-details';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { generateEclipseCalendar } from './eclipses';
import type { LocaleText} from '@/types/panchang';

// Re-export FestivalEntry from the old module for compatibility
export interface FestivalEntry {
  name: LocaleText;
  date: string;
  tithi?: string;
  masa?: { amanta: string; purnimanta: string; isAdhika: boolean };
  paksha?: 'shukla' | 'krishna';
  type: 'major' | 'vrat' | 'regional' | 'eclipse';
  category: string;
  description: LocaleText;
  pujaMuhurat?: { start: string; end: string; name: string };
  slug?: string;
  paranaDate?: string;
  paranaStart?: string;
  paranaEnd?: string;
  paranaNote?: LocaleText;
  paranaSunrise?: string;
  paranaHariVasaraEnd?: string;
  paranaDwadashiEnd?: string;
  paranaEarlyEnd?: boolean;
  paranaMadhyahnaStart?: string;
  paranaMadhyahnaEnd?: string;
  eclipseType?: 'solar' | 'lunar';
  eclipseMagnitude?: string;
  eclipseMaxTime?: string;
  sutakStart?: string;
  sutakEnd?: string;
  sutakApplicable?: boolean;
  eclipsePhases?: { name: LocaleText; time: string }[];
  paranaMadhyahnaStart2?: string;
  paranaMadhyahnaEnd2?: string;
  ekadashiStart?: string;
  ekadashiStartDate?: string;
  ekadashiEnd?: string;
  ekadashiEndDate?: string;
  dwadashiEndTime?: string;
  dwadashiEndDate?: string;
}

// ─── Festival Detail Imports ───

import {
  FESTIVAL_DETAILS, CATEGORY_DETAILS,
  type FestivalDetail, type EkadashiDetail,
} from '@/lib/constants/festival-details';

// ─── Ekadashi Name Resolution ───

function resolveEkadashiName(entry: TithiEntry): { name: LocaleText; detail?: EkadashiDetail } {
  const { paksha, masa } = entry;

  if (masa.isAdhika) {
    const detail = paksha === 'shukla' ? ADHIKA_MASA_EKADASHI.shukla : ADHIKA_MASA_EKADASHI.krishna;
    return { name: detail.name, detail };
  }

  // EKADASHI_NAMES is keyed by Purnimant month names (standard Purnimant system).
  // entry.masa.purnimanta gives the correct Purnimant month — direct lookup.
  const monthForLookup = masa.purnimanta;

  const detail = getEkadashiName(monthForLookup, paksha);
  if (detail) return { name: detail.name, detail };

  return {
    name: {
      en: `${paksha === 'shukla' ? 'Shukla' : 'Krishna'} Ekadashi`,
      hi: `${paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण'} एकादशी`,
      sa: `${paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण'}एकादशी`,
    },
  };
}

// ─── Parana Calculation (from tithi table) ───

function computeEkadashiParanaFromTable(
  ekadashiEntry: TithiEntry,
  table: YearlyTithiTable,
  lat: number,
  lon: number,
  timezone: string,
) {
  // Dwadashi = next entry after Ekadashi
  const dwadashiEntry = getNextTithiEntry(table, ekadashiEntry);
  if (!dwadashiEntry) return {};

  const paranaDate = ekadashiEntry.sunriseDate;
  // Parana is on the day AFTER the Ekadashi fasting day
  const pd = new Date(paranaDate);
  pd.setDate(pd.getDate() + 1);
  const paranaDayStr = `${pd.getFullYear()}-${(pd.getMonth()+1).toString().padStart(2,'0')}-${pd.getDate().toString().padStart(2,'0')}`;

  const [py, pm, pday] = paranaDayStr.split('-').map(Number);
  const tz = getUTCOffsetForDate(py, pm, pday, timezone);
  const jdApprox = dateToJD(py, pm, pday, 0);
  const sunriseUT = approximateSunrise(jdApprox, lat, lon);
  const sunsetUT = approximateSunset(jdApprox, lat, lon);

  // Hari Vasara = first 1/4 of Dwadashi duration
  const dwDuration = dwadashiEntry.endJd - dwadashiEntry.startJd;
  const hvEndJd = dwadashiEntry.startJd + dwDuration / 4;

  const jdSunrise = dateToJD(py, pm, pday, sunriseUT);
  const hvAlreadyOver = hvEndJd <= jdSunrise;

  // Day division (5 parts of daytime, per Dharma Sindhu):
  // Pratahkala (1/5), Sangava (1/5), Madhyahna (1/5), Aparahna (1/5), Sayahna (1/5)
  // Madhyahna = 3rd fifth of daytime. Parana MUST avoid this period.
  // Ideal parana = first 1/5 of daytime (Pratahkala) = classical standard.
  const dayLen = sunsetUT - sunriseUT;
  const pratahEndUT = sunriseUT + dayLen / 5;         // End of first 1/5 — ideal parana deadline
  const madhStartUT = sunriseUT + dayLen * (2 / 5);   // Madhyahna start — hard avoid
  const madhEndUT = sunriseUT + dayLen * (3 / 5);     // Madhyahna end

  const ft = (ut: number) => formatTime(((ut % 24) + 24) % 24, tz);

  // Convert Dwadashi end JD to UT hours on parana day
  const dwEndUTHours = (dwadashiEntry.endJd - dateToJD(py, pm, pday, 0)) * 24;
  const effectiveDeadline = Math.min(dwEndUTHours, sunsetUT);

  // Hari Vasara end in UT hours
  const hvEndUTHours = (hvEndJd - dateToJD(py, pm, pday, 0)) * 24;
  const earliestUT = hvAlreadyOver ? sunriseUT : Math.max(hvEndUTHours, sunriseUT);

  let recStartUT: number;
  let recEndUT: number;

  if (dwEndUTHours <= earliestUT) {
    // Dwadashi ends before we can even start — break fast ASAP at sunrise
    recStartUT = sunriseUT;
    recEndUT = dwEndUTHours;
  } else if (earliestUT < pratahEndUT) {
    // Ideal case: parana within Pratahkala (first 1/5 of day)
    recStartUT = earliestUT;
    recEndUT = Math.min(pratahEndUT, effectiveDeadline);
  } else if (earliestUT < madhStartUT) {
    // HV ended after Pratahkala but before Madhyahna — use window up to Madhyahna
    recStartUT = earliestUT;
    recEndUT = Math.min(madhStartUT, effectiveDeadline);
  } else if (earliestUT >= madhEndUT) {
    // HV ended after Madhyahna — use window after Madhyahna
    recStartUT = earliestUT;
    recEndUT = effectiveDeadline;
  } else {
    // HV ends during Madhyahna — wait until Madhyahna ends
    recStartUT = madhEndUT;
    recEndUT = effectiveDeadline;
  }

  // Format Dwadashi end with date if different day
  const dwEndLocalDate = dwadashiEntry.endDate;
  let dwEndStr = dwadashiEntry.endLocal;
  if (dwEndLocalDate !== paranaDayStr) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dd = new Date(dwEndLocalDate);
    dwEndStr = `${dwEndStr}, ${months[dd.getMonth()]} ${dd.getDate()}`;
  }

  // Ekadashi tithi times (from the ekadashi entry itself)
  const ekadashiStartLocal = ekadashiEntry.startLocal;
  const ekadashiStartDate = ekadashiEntry.startDate;
  const ekadashiEndLocal = ekadashiEntry.endLocal;
  const ekadashiEndDate = ekadashiEntry.endDate;

  // Dwadashi end with full date
  const dwadashiEndDate = dwadashiEntry.endDate;
  const dwadashiEndTime = dwadashiEntry.endLocal;

  return {
    paranaDate: paranaDayStr,
    paranaStart: ft(recStartUT),
    paranaEnd: ft(recEndUT),
    paranaSunrise: ft(sunriseUT),
    paranaHariVasaraEnd: hvAlreadyOver ? ft(sunriseUT) : ft(hvEndUTHours),
    paranaDwadashiEnd: dwEndStr,
    paranaEarlyEnd: dwEndUTHours <= earliestUT,
    paranaMadhyahnaStart: ft(madhStartUT),
    paranaMadhyahnaEnd: ft(madhEndUT),
    // Tithi timing data
    ekadashiStart: ekadashiStartLocal,
    ekadashiStartDate,
    ekadashiEnd: ekadashiEndLocal,
    ekadashiEndDate,
    dwadashiEndTime,
    dwadashiEndDate,
    paranaNote: {
      en: `Parana: ${ft(recStartUT)} to ${ft(recEndUT)}. Sunrise: ${ft(sunriseUT)}.`,
      hi: `पारण: ${ft(recStartUT)} से ${ft(recEndUT)}। सूर्योदय: ${ft(sunriseUT)}।`,
      sa: `पारणम्: ${ft(recStartUT)} तः ${ft(recEndUT)}। सूर्योदयः: ${ft(sunriseUT)}।`,
    },
  };
}

// ─── Simple Parana Calculators ───

function computeSimpleParana(date: string, lat: number, lon: number, timezone: string, type: 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham') {
  const pd = new Date(date);
  if (type === 'amavasya') pd.setDate(pd.getDate() + 1); // next day

  const y = pd.getFullYear(), m = pd.getMonth() + 1, d = pd.getDate();
  const tz = getUTCOffsetForDate(y, m, d, timezone);
  const jd = dateToJD(y, m, d, 0);
  const srUT = approximateSunrise(jd, lat, lon);
  const ssUT = approximateSunset(jd, lat, lon);
  const ft = (ut: number) => formatTime(((ut % 24) + 24) % 24, tz);

  const paranaDate = `${y}-${m.toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;

  if (type === 'purnima') {
    return { paranaDate: date, paranaStart: ft(ssUT), paranaEnd: ft(ssUT + 1) };
  }
  if (type === 'amavasya') {
    return { paranaDate, paranaStart: ft(srUT), paranaEnd: ft(srUT + 3) };
  }
  if (type === 'chaturthi') {
    const moonriseUT = calculateMoonriseUT(jd, lat, lon) ?? (ssUT + 2);
    return { paranaDate: date, paranaStart: ft(moonriseUT % 24), paranaEnd: ft((moonriseUT + 1) % 24) };
  }
  // Pradosham
  const pujaEndUT = ssUT + 2.5;
  return { paranaDate: date, paranaStart: ft(pujaEndUT % 24), paranaEnd: ft((pujaEndUT + 1) % 24) };
}

// ─── Puja Muhurat Calculation ───

function computePujaMuhurat(
  slug: string,
  date: string,
  lat: number,
  lon: number,
  timezone: string,
): { start: string; end: string; name: string } | undefined {
  const [y, m, d] = date.split('-').map(Number);
  const tz = getUTCOffsetForDate(y, m, d, timezone);
  const jd = dateToJD(y, m, d, 0);
  const srUT = approximateSunrise(jd, lat, lon);
  const ssUT = approximateSunset(jd, lat, lon);
  const dayLen = ssUT - srUT;
  const ft = (ut: number) => formatTime(((ut % 24) + 24) % 24, tz);

  // Next day sunrise for night-length calculations
  const jdNext = dateToJD(y, m, d + 1, 0);
  const srNextUT = approximateSunrise(jdNext, lat, lon);
  const nightLen = (srNextUT + 24) - ssUT; // hours from sunset to next sunrise

  // Madhyahna = middle 1/5 of daytime (2/5 to 3/5) — matches The classical definition
  const madhStart = srUT + dayLen * (2 / 5);
  const madhEnd = srUT + dayLen * (3 / 5);
  // Aparahna = 3/5 to 4/5 of daytime
  const aparStart = srUT + dayLen * (3 / 5);
  const aparEnd = srUT + dayLen * (4 / 5);

  switch (slug) {
    case 'diwali': {
      // Lakshmi Puja during Vrishabha Kaal — when Taurus (30°-60°) is on the
      // western horizon (descendant / 7th cusp).  At evening time, the ascendant
      // is in Scorpio; Taurus is the setting sign.  The classical "Vrishabha Kaal"
      // matches this descendant-based window.
      const vr = findSthiraLagna(dateToJD(y, m, d, ssUT), lat, lon, 30, 60, 4, 'desc');
      if (vr) return { start: ft(vr.startUT), end: ft(vr.endUT), name: 'Lakshmi Puja (Vrishabha Kaal)' };
      // Fallback
      return { start: ft(ssUT + 17 / 60), end: ft(ssUT + 103 / 60), name: 'Lakshmi Puja (Pradosh Kaal)' };
    }
    case 'dussehra': {
      // Vijay Muhurat: during Aparahna, specifically the 2nd quarter
      // The classical window is ~43 minutes within Aparahna
      const midApar = (aparStart + aparEnd) / 2;
      const startUT = midApar - 0.36; // ~22 min before mid-aparahna
      const endUT = midApar + 0.36;   // ~22 min after
      return { start: ft(startUT), end: ft(endUT), name: 'Vijay Muhurat (Aparahna)' };
    }
    case 'ganesh-chaturthi': {
      // Madhyahna Puja: middle 1/5 of daytime (The classical definition)
      return { start: ft(madhStart), end: ft(madhEnd), name: 'Ganesh Puja (Madhyahna)' };
    }
    case 'navaratri': {
      // Ghatasthapana: first 1/3 of daytime (Pratah Kaal)
      const startUT = srUT;
      const endUT = srUT + dayLen / 3;
      return { start: ft(startUT), end: ft(endUT), name: 'Ghatasthapana (Pratah Kaal)' };
    }
    case 'maha-shivaratri': {
      // Nishita Kaal = 8th muhurta of the night (night divided into 15 muhurtas)
      // Night runs from sunset to next sunrise
      const nightLen = (srNextUT + 24) - ssUT; // total night in hours
      const muhurtaLen = nightLen / 15;
      const nishitaStart = ssUT + 7 * muhurtaLen; // start of 8th muhurta
      const nishitaEnd = ssUT + 8 * muhurtaLen;   // end of 8th muhurta
      return { start: ft(nishitaStart), end: ft(nishitaEnd), name: 'Nishita Kaal Puja' };
    }
    case 'dhanteras': {
      // Dhanteras Puja during Vrishabha Kaal (descendant in Taurus), same logic as Diwali
      const vrD = findSthiraLagna(dateToJD(y, m, d, ssUT), lat, lon, 30, 60, 4, 'desc');
      if (vrD) return { start: ft(vrD.startUT), end: ft(vrD.endUT), name: 'Dhanteras Puja (Vrishabha Kaal)' };
      return { start: ft(ssUT + 17 / 60), end: ft(ssUT + 103 / 60), name: 'Dhanteras Puja (Pradosh Kaal)' };
    }
    case 'ram-navami': {
      // Madhyahna: middle 1/5 of daytime (classical definition, birth time of Lord Rama)
      const startUT = madhStart;
      const endUT = madhEnd;
      return { start: ft(startUT), end: ft(endUT), name: 'Ram Navami Puja (Madhyahna)' };
    }
    default:
      return undefined;
  }
}

// ─── Main Generator ───

export function generateFestivalCalendarV2(
  year: number,
  lat: number,
  lon: number,
  timezone: string,
): FestivalEntry[] {
  const table = buildYearlyTithiTable(year, lat, lon, timezone);
  const festivals: FestivalEntry[] = [];

  // ── 1. Major Festivals from declarative definitions ───
  for (const def of MAJOR_FESTIVALS) {
    const tithiNum = defToTithiNumber(def);
    // Festival defs use Purnimant month names (standard Purnimant system).
    // Match against entry.masa.purnimanta — computed from Purnima boundaries.
    const matches = table.entries.filter(e =>
      e.number === tithiNum &&
      e.masa.purnimanta === def.masa &&
      !e.masa.isAdhika
    );

    for (const match of matches) {
      const detail = FESTIVAL_DETAILS[def.slug];

      // Pradosh rule: festivals observed in the EVENING when the tithi begins.
      // Classical rule for Diwali and similar festivals: observed on the evening
      // when the tithi is active, not the morning when it prevails at sunrise.
      //
      // Logic: the tithi table gives us `sunriseDate` (the day when the tithi
      // prevails at sunrise). But the tithi may have STARTED the previous evening.
      // If the tithi's startJd falls BEFORE sunset of the previous day, then the
      // festival is observed on that previous evening.
      //
      // Example: Amavasya starts Nov 8 at 16:30 IST. Sunset Nov 8 is 17:28.
      // Since 16:30 < 17:28, Amavasya is active at Pradosh Kaal (sunset) on Nov 8.
      // Diwali = Nov 8 (not Nov 9 when Amavasya prevails at sunrise).
      let festivalDate = match.sunriseDate;
      if (def.pradoshRule && match.startJd) {
        const [fy, fm, fd] = match.sunriseDate.split('-').map(Number);
        // Compute sunset of the PREVIOUS day
        const prevDayJd = dateToJD(fy, fm, fd - 1, 12 - (getUTCOffsetForDate(fy, fm, fd - 1, timezone)));
        const prevSunsetUT = approximateSunset(prevDayJd, lat, lon);
        const prevSunsetJd = dateToJD(fy, fm, fd - 1, prevSunsetUT);
        // If the tithi started before sunset of the previous day,
        // the festival is on the previous day (evening observation)
        if (match.startJd <= prevSunsetJd) {
          const prevDate = new Date(fy, fm - 1, fd - 1);
          festivalDate = `${prevDate.getFullYear()}-${String(prevDate.getMonth()+1).padStart(2,'0')}-${String(prevDate.getDate()).padStart(2,'0')}`;
        }
        // Otherwise, the tithi started after sunset → festival stays on sunriseDate
      }

      // Kshaya tithi: the tithi has no sunrise within it. Per Dharmasindhu,
      // the festival is observed on the preceding day. sunriseDate for kshaya
      // entries already points to the start date (previous day), so the date
      // mapping is correct. We note the kshaya condition for UI display.
      const isKshayaFestival = match.isKshaya;

      const entry: FestivalEntry = {
        name: detail?.name || def.name || { en: def.slug, hi: def.slug, sa: def.slug },
        date: festivalDate,
        tithi: `${match.masa.purnimanta} ${match.paksha} ${match.number <= 15 ? match.number : match.number - 15}${isKshayaFestival ? ' (Kshaya)' : ''}`,
        masa: match.masa,
        paksha: match.paksha,
        type: 'major',
        category: 'festival',
        description: detail?.significance || { en: '', hi: '', sa: '' },
        slug: def.slug,
      };

      // Compute puja muhurat for key festivals
      const muhurat = computePujaMuhurat(def.slug, match.sunriseDate, lat, lon, timezone);
      if (muhurat) {
        entry.pujaMuhurat = muhurat;
      }

      festivals.push(entry);
    }
  }

  // ── 1b. Solar festivals (Sankranti — Sun entering a sign) ───
  // Makar Sankranti: Sun enters Capricorn (sidereal longitude crosses 270°)
  {
    // Scan January for the date when Sun's sidereal longitude crosses 270° (Capricorn)
    for (let d = 10; d <= 18; d++) {
      const jd = dateToJD(year, 1, d, 12 - (timezone === 'Asia/Kolkata' ? 5.5 : 0));
      const sunSid = toSidereal(sunLongitude(jd), jd);
      const jdNext = dateToJD(year, 1, d + 1, 12 - (timezone === 'Asia/Kolkata' ? 5.5 : 0));
      const sunSidNext = toSidereal(sunLongitude(jdNext), jdNext);
      // Check if Sun crosses 270° between day d and d+1
      if (sunSid < 270 && sunSidNext >= 270) {
        festivals.push({
          name: { en: 'Makar Sankranti', hi: 'मकर संक्रान्ति', sa: 'मकरसंक्रान्तिः' },
          date: `${year}-01-${String(d).padStart(2, '0')}`, // Day Sun crosses into Capricorn
          tithi: 'Makar Sankranti (Solar)',
          masa: { purnimanta: 'பௌஷ', amanta: 'பௌஷ', isAdhika: false },
          paksha: 'shukla', // Solar festival — paksha not applicable, using placeholder
          type: 'major',
          category: 'festival',
          description: { en: 'Sun enters Capricorn — marks the northward journey (Uttarayana). Sacred bathing, charity, and sesame offerings.', hi: 'सूर्य मकर राशि में प्रवेश — उत्तरायण का आरम्भ। पवित्र स्नान, दान और तिल।', sa: 'सूर्यः मकरराशिं प्रविशति — उत्तरायणारम्भः।' },
          slug: 'makar-sankranti',
        });
        break;
      }
    }
  }

  // ── 2. Ekadashis from tithi table ───
  const allEkadashis = [
    ...lookupAllTithiByNumber(table, 11),  // Shukla Ekadashi
    ...lookupAllTithiByNumber(table, 26),  // Krishna Ekadashi
  ].sort((a, b) => a.startJd - b.startJd);

  for (const ek of allEkadashis) {
    const { name, detail } = resolveEkadashiName(ek);
    const parana = computeEkadashiParanaFromTable(ek, table, lat, lon, timezone);

    festivals.push({
      name,
      date: ek.sunriseDate,
      masa: ek.masa,
      paksha: ek.paksha,
      type: 'vrat',
      category: 'ekadashi',
      description: detail?.benefit || { en: 'Fasting for Lord Vishnu', hi: 'विष्णु व्रत', sa: 'विष्णुव्रतम्' },
      slug: 'ekadashi',
      ...parana,
    });
  }

  // ── 3. Monthly Recurring Vrats ───
  for (const def of MONTHLY_VRATS) {
    const tithiNum = defToTithiNumber(def);
    const matches = lookupAllTithiByNumber(table, tithiNum);

    for (const match of matches) {
      if (match.lunarMonth.isAdhika) continue; // skip Adhika months for recurring

      const catDetail = CATEGORY_DETAILS[def.slug.replace('-shukla', '').replace('-krishna', '')];
      const parana = computeSimpleParana(match.sunriseDate, lat, lon, timezone, def.category as 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham');

      const catName = def.category === 'pradosham'
        ? { en: `${match.paksha === 'shukla' ? 'Shukla' : 'Krishna'} Pradosham`, hi: `${match.paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण'} प्रदोष`, sa: `${match.paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण'}प्रदोषः` }
        : catDetail?.name || { en: def.slug, hi: def.slug, sa: def.slug };

      festivals.push({
        name: def.name || catName,
        date: match.sunriseDate,
        masa: match.masa,
        paksha: match.paksha,
        type: 'vrat',
        category: def.category,
        description: catDetail?.significance || { en: '', hi: '', sa: '' },
        slug: def.slug.replace('-shukla', '').replace('-krishna', ''),
        ...parana,
      });
    }
  }

  // ── 4. Eclipses ───
  try {
    const eclipses = generateEclipseCalendar(year);
    // ... eclipse handling (keep existing logic)
    // For now, skip eclipse integration — can be added later
  } catch { /* eclipses optional */ }

  // ── Sort, deduplicate, filter to year ───
  festivals.sort((a, b) => a.date.localeCompare(b.date));

  const seen = new Set<string>();
  const deduped = festivals.filter(f => {
    const key = `${f.date}:${f.category}:${f.name.en}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped.filter(f => f.date.startsWith(`${year}-`));
}
