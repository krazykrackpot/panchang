/**
 * Festival Calendar Generator V2  –  table-based lookup
 *
 * Uses the pre-computed yearly tithi table + declarative festival definitions
 * to generate the complete festival calendar. Replaces the scanning-based approach.
 */

import { dateToJD, formatTime, normalizeDeg } from '@/lib/ephem/astronomical';
import { sunriseUTHoursOr, sunsetUTHoursOr } from '@/lib/ephem/swiss-ephemeris';
import { calculateMoonriseUT } from '@/lib/ephem/panchang-calc';
import { resolveSolarFestivals } from '@/lib/calendar/solar-festivals';

/**
 * Find when a sidereal sign occupies a specific horizon.
 * `mode`:
 *   'asc'  = scan the eastern horizon (ascendant / lagna)
 *   'desc' = scan the western horizon (descendant / 7th cusp)
 *
 * For Diwali Lakshmi Puja, tradition prescribes "Vrishabha Lagna"  –  but at
 * evening time Taurus (30°-60°) is setting in the west, not rising in the east.
 * The classical "Vrishabha Kaal" matches the period when the *descendant*
 * (ascendant + 180°) transits Taurus.  Pass mode='desc' for this case.
 */
function findSthiraLagna(
  startJd: number, lat: number, lon: number,
  minDeg: number, maxDeg: number, scanHours: number,
  mode: 'asc' | 'desc' = 'asc',
): { startUT: number; endUT: number } | null {
  // Ascendant calculation  –  mirrors kundali-calc.ts calculateTropicalAscendant()
  //
  // The raw atan2(y, x) result is the IC (Imum Coeli, nadir of the chart).
  // Adding 180° converts it to the Ascendant (ASC, eastern horizon).
  //
  // HISTORICAL BUG 1 (now fixed): this local copy of the formula omitted the
  //   asc = normalizeDeg(asc + 180)  step that kundali-calc.ts applies at
  //   line 47 before subtracting the ayanamsha.  Without it the function was
  //   returning the Descendant instead of the Ascendant  –  180° inverted.
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
    // Convert tropical to sidereal  –  full cubic Meeus polynomial (Bug 2 fix)
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
import {
  MAJOR_FESTIVALS, EKADASHI_DEFS, MONTHLY_VRATS,
  // REGIONAL_FESTIVALS + MORE_REGIONAL_FESTIVALS contain the lunar-tithi
  // regional defs (Durga Puja series, Kali Puja, Saraswati Puja Bengali,
  // Lakshmi Puja Bengali, sitala-ashtami, etc.). They were defined but
  // never iterated by this generator, so /hindu-calendar/[year],
  // /calendar/regional/bengali/[year], and every festival deep-dive route
  // that depended on them silently dropped those festivals. Solar-style
  // regional defs (poila-boishakh, bohag-bihu) sit in SOLAR_FESTIVALS and
  // are resolved separately by resolveSolarFestivals — that path was fine.
  REGIONAL_FESTIVALS, MORE_REGIONAL_FESTIVALS,
  // The next five arrays were defined in festival-defs.ts but never imported
  // anywhere in the codebase, so the festivals inside them silently dropped
  // from every calendar render path. Auditing for the pongal / guru-nanak-jayanti
  // verification on 2026-05-31 surfaced 40+ defined-but-orphaned festivals
  // including Pitru Paksha, Mahalaya Amavasya, Guru Nanak Jayanti, Mahavir
  // Jayanti, Vesak, Mauni Amavasya, Vaikuntha Ekadashi, Gita Jayanti, and the
  // Bhogi day of the Pongal cluster. The isLunarDef filter below safely
  // excludes the recurring/weekday-keyed defs (somvati-amavasya, shani-amavasya,
  // masik-panchami, etc.) which are handled elsewhere by MONTHLY_VRATS.
  PITRU_FESTIVALS, JAIN_SIKH_FESTIVALS, ADDITIONAL_VRATS,
  JAYANTI_FESTIVALS, ADDITIONAL_MAJOR_FESTIVALS,
  // NIRJALA_EKADASHI was missed in PR #310's first pass and surfaced
  // by Gemini's review. Without this it emits as a generic vrat instead
  // of a major festival — the most demanding ekadashi of the year.
  NIRJALA_EKADASHI,
  defToTithiNumber, isVratByDef, type FestivalDef,
} from './festival-defs';
import { getEkadashiName, getNextHinduMonth, getPreviousHinduMonth, ADHIKA_MASA_EKADASHI, resolveEkadashiDetail } from '@/lib/constants/festival-details-with-overlay';
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
  /**
   * Is this entry observed as a vrat (fast / penance)?
   *
   * Independent of `type` — Nirjala Ekadashi has type='major' AND
   * isVrat=true (it's a major festival escalation that's still observed
   * as a 24-hour waterless fast). Vaikuntha Ekadashi has type='regional'
   * AND isVrat=true. Without this separation, the calendar's Vrats &
   * Observances section (which previously filtered on type='vrat') was
   * silently dropping these items.
   *
   * Defaulted by the generator from `isVratByDef(def)` — see
   * festival-defs.ts. Generator-emitted entries (eclipses, derived
   * panchang observances) set it explicitly.
   */
  isVrat: boolean;
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
} from '@/lib/constants/festival-details-with-overlay';

// ─── Ekadashi Name Resolution ───
//
// Thin wrapper over the canonical `resolveEkadashiDetail` helper in
// festival-details.ts. We keep this local function only because the
// generator needs a generic fallback when the masa isn't in
// EKADASHI_NAMES (rare — Adhika months that aren't classified, or
// edge cases at year boundaries). Both this and /app/[locale]/ekadashi
// MUST go through resolveEkadashiDetail so they never diverge.

function resolveEkadashiName(entry: TithiEntry): { name: LocaleText; detail?: EkadashiDetail } {
  const detail = resolveEkadashiDetail(entry.masa, entry.paksha);
  if (detail) return { name: detail.name, detail };

  // Fallback: generic name when no canonical entry exists for this
  // masa+paksha combination.
  return {
    name: {
      en: `${entry.paksha === 'shukla' ? 'Shukla' : 'Krishna'} Ekadashi`,
      hi: `${entry.paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण'} एकादशी`,
      sa: `${entry.paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण'}एकादशी`,
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
  // H2 fix: new Date("YYYY-MM-DD") parses as UTC midnight — use UTC accessors to avoid off-by-one on UTC- servers
  const pd = new Date(paranaDate);
  pd.setUTCDate(pd.getUTCDate() + 1);
  let paranaDayStr = `${pd.getUTCFullYear()}-${(pd.getUTCMonth()+1).toString().padStart(2,'0')}-${pd.getUTCDate().toString().padStart(2,'0')}`;

  let [py, pm, pday] = paranaDayStr.split('-').map(Number);
  let tz = getUTCOffsetForDate(py, pm, pday, timezone);
  let jdApprox = dateToJD(py, pm, pday, 0);
  // Polar non-rise days: fall back to 6:00 / 18:00 with the fallback flag
  // surfaced at the call site (Lesson F: no silent defaults hidden in
  // wrapper names). For the festival generator we proceed with synthetic
  // values rather than skip the day — festivals are festival-of-record;
  // we don't want to silently drop them from any year-table even at high
  // latitudes. The isFallback flag is currently consumed by tests; future
  // work can surface a per-festival warning if needed.
  let sunriseUT = sunriseUTHoursOr(jdApprox, lat, lon, 0, 6).value;
  let sunsetUT = sunsetUTHoursOr(jdApprox, lat, lon, 0, 18).value;

  // ── UT day-boundary normalisation ──
  // sunriseUTHoursOr / sunsetUTHoursOr return values in [0, 24) — UT hours
  // INTO the input JD's UT day. For cities where local sunrise (or sunset)
  // straddles a UT day boundary relative to the parana day's UT midnight
  // reference, the two returned values can be in DIFFERENT UT day frames,
  // making `dayLen = sunsetUT − sunriseUT` go negative and the downstream
  // Pratahkala / Madhyahna math completely wrong.
  //
  // Concrete user-reported example 2026-06-07 (Delhi, IST = UT+5:30):
  //   sunrise local 05:25 IST = 23:55 UT on the PREVIOUS UT calendar day
  //   sunriseUTHoursOr returned 23.92 (positive, treating as if on parana day)
  //   sunsetUT = 13.85 (correctly in parana day frame)
  //   dayLen = 13.85 − 23.92 = −10.07 ← buggy
  //   Madhyahna start = sunriseUT + dayLen × 2/5 = 19.84 = "01:24 IST" ←
  //     geometrically impossible (Madhyahna is by definition the middle of
  //     daytime).
  //   Parana window then fell through to "sunrise to sunset" ≈ 14 hours
  //   instead of the classical Pratahkala ≈ 3 hours.
  //
  // Symmetric bug for western locations (e.g. NewYork EDT, Seattle PDT):
  // local sunset straddles into the NEXT UT day; sunsetUT returned as
  // small positive (~0.5–4) instead of large (~24.5–28). dayLen still
  // wrong.
  //
  // Fix: ensure sunset is later than sunrise in the same UT-hour frame.
  // 2026-06-09 bug: the previous heuristic — "if sunriseUT > 12 ⇒
  // previous-day sunrise" — conflated two cases:
  //   - Eastern hemisphere (Asia +5/+9): Delhi sunrise 05:25 IST = 23:55
  //     UT previous day → sunriseUTHoursOr returns ~23.92 → must subtract 24.
  //   - Western hemisphere (Americas -5/-7/-8): Seattle sunrise 05:11 PDT
  //     = 12:11 UT parana day → sunriseUTHoursOr returns 12.18 →
  //     ⚠ heuristic also fires because 12.18 > 12, but here the correct
  //     fix is to add 24 to sunsetUT (June 12 21:06 PDT = 04:06 UT next
  //     day → sunsetUT = 4.10 → should be 28.10).
  //
  // Concrete failure mode (Seattle Parama Ekadashi 2026-06-12): the bad
  // sunriseUT = -11.82 produced jdSunrise on the WRONG UT day, which
  // made `hvAlreadyOver` (line 311) evaluate false even though Hari
  // Vasara had ended ~14 hours before parana day's actual sunrise. UI
  // then rendered "Parana Window 15:21–21:06" instead of the correct
  // 05:11–07:06. (Drik Panchang reference for the same chart.)
  //
  // Correct disambiguator: which hemisphere is the location in? Use the
  // longitude (already a function parameter) — negative longitude
  // (Americas) means sunset wraps to the next UT day; non-negative means
  // sunrise is on the previous UT day. Unaffected: cities where sunrise
  // and sunset are both on the same UT day as the parana day (Mumbai,
  // Bengaluru, London, Corseaux, etc.) — sunriseUT < sunsetUT already
  // and the condition is a no-op.
  if (sunriseUT > sunsetUT) {
    if (lon < 0) {
      // Western hemisphere: sunset UT is on the next UT day. Add 24 so
      // sunset is later than sunrise on the number line.
      sunsetUT += 24;
    } else {
      // Eastern hemisphere: sunrise UT is on the previous UT day.
      // Subtract 24 so dayLen comes out as the real day length.
      sunriseUT -= 24;
    }
  }

  // Hari Vasara = first 1/4 of Dwadashi duration
  const dwDuration = dwadashiEntry.endJd - dwadashiEntry.startJd;
  const hvEndJd = dwadashiEntry.startJd + dwDuration / 4;

  // ── Parana-day deferral check ──
  // For some locations the tithi table's ekadashi.sunriseDate identifies the
  // day BEFORE the Udaya Tithi observance day (the engine treats "tithi-active-
  // at-any-sunrise" rather than "tithi-active-at-LOCAL-sunrise"). When that
  // happens, Dwadashi has not even started by local sunrise of the engine's
  // chosen parana day, and Hari Vasara ends after the day's sunset — leaving
  // no viable parana window. Concretely 2026-06-25 Delhi:
  //   engine parana day = June 25; Dwadashi only starts 20:09 IST that evening;
  //   HV end = 02:42 IST June 26 = 21:12 UT June 25 (after sunset 13:51 UT).
  // Without this shift, recStart (21:12 UT) > recEnd (13:51 UT) and the window
  // is backwards in time. The fix moves the parana day forward by one and
  // recomputes sunrise/sunset — for Delhi this yields the Udaya-Tithi-correct
  // June 26 morning Pratahkala.
  const hvEndUTHoursPreCheck = (hvEndJd - dateToJD(py, pm, pday, 0)) * 24;
  if (hvEndUTHoursPreCheck > sunsetUT) {
    pd.setUTCDate(pd.getUTCDate() + 1);
    paranaDayStr = `${pd.getUTCFullYear()}-${(pd.getUTCMonth()+1).toString().padStart(2,'0')}-${pd.getUTCDate().toString().padStart(2,'0')}`;
    [py, pm, pday] = paranaDayStr.split('-').map(Number);
    tz = getUTCOffsetForDate(py, pm, pday, timezone);
    jdApprox = dateToJD(py, pm, pday, 0);
    sunriseUT = sunriseUTHoursOr(jdApprox, lat, lon, 0, 6).value;
    sunsetUT = sunsetUTHoursOr(jdApprox, lat, lon, 0, 18).value;
    // Same hemisphere-based disambiguation as the initial normalisation
    // above (Western lon < 0 ⇒ sunset wraps next UT day).
    if (sunriseUT > sunsetUT) {
      if (lon < 0) sunsetUT += 24;
      else sunriseUT -= 24;
    }
  }

  const jdSunrise = dateToJD(py, pm, pday, sunriseUT);
  const hvAlreadyOver = hvEndJd <= jdSunrise;

  // Day division (5 parts of daytime, per Dharma Sindhu):
  // Pratahkala (1/5), Sangava (1/5), Madhyahna (1/5), Aparahna (1/5), Sayahna (1/5)
  // Madhyahna = 3rd fifth of daytime. Parana MUST avoid this period.
  // Ideal parana = first 1/5 of daytime (Pratahkala) = classical standard.
  const dayLen = sunsetUT - sunriseUT;
  const pratahEndUT = sunriseUT + dayLen / 5;         // End of first 1/5  –  ideal parana deadline
  const madhStartUT = sunriseUT + dayLen * (2 / 5);   // Madhyahna start  –  hard avoid
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

  // Minimum usable parana window — anything narrower is unrealistic for a
  // human to actually break fast in, and is a sign that the chosen branch is
  // pinned against a hard cutoff (Dwadashi end, Madhyahna start, etc.). We
  // fall through to a wider branch in those cases. 10 minutes is the smallest
  // practical breakfast preparation interval per traditional almanacs.
  const MIN_WINDOW_HOURS = 10 / 60;

  if (dwEndUTHours <= earliestUT) {
    // Dwadashi ends before parana day's sunrise (or before HV ends locally).
    // The user CANNOT break fast during Dwadashi this morning — classical
    // "delayed parana" applies: break fast IMMEDIATELY at first opportunity
    // (sunrise or HV end), with Pratahkala as soft deadline. Previously this
    // branch returned `recEnd = dwEndUTHours` which produced a backwards-in-
    // time window for cities where Dwadashi ended overnight UT (NewYork
    // kamika 2026-09-08, mokshada 2026-12-21).
    recStartUT = earliestUT;
    recEndUT = Math.min(pratahEndUT, sunsetUT);
  } else if (earliestUT < pratahEndUT) {
    // Ideal case: parana within Pratahkala (first 1/5 of day)
    recStartUT = earliestUT;
    recEndUT = Math.min(pratahEndUT, effectiveDeadline);
    // If HV ends almost exactly at Pratahkala end (e.g. NewYork devshayani
    // 2026-07-25 — HV ends 1 minute before Pratahkala close), the window
    // collapses to ~0 and is unusable. Fall through to Sangava (between
    // Pratahkala end and Madhyahna start).
    if (recEndUT - recStartUT < MIN_WINDOW_HOURS) {
      recStartUT = Math.max(earliestUT, pratahEndUT);
      recEndUT = Math.min(madhStartUT, effectiveDeadline);
    }
  } else if (earliestUT < madhStartUT) {
    // HV ended after Pratahkala but before Madhyahna  –  use window up to Madhyahna
    recStartUT = earliestUT;
    recEndUT = Math.min(madhStartUT, effectiveDeadline);
  } else if (earliestUT >= madhEndUT) {
    // HV ended after Madhyahna  –  use window after Madhyahna
    recStartUT = earliestUT;
    recEndUT = effectiveDeadline;
  } else {
    // HV ends during Madhyahna  –  wait until Madhyahna ends
    recStartUT = madhEndUT;
    recEndUT = effectiveDeadline;
  }

  // Format Dwadashi end with date if different day
  const dwEndLocalDate = dwadashiEntry.endDate;
  let dwEndStr = dwadashiEntry.endLocal;
  if (dwEndLocalDate !== paranaDayStr) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    // dwEndLocalDate is a YYYY-MM-DD string parsed as UTC — use UTC accessors (Lesson L)
    const dd = new Date(dwEndLocalDate);
    dwEndStr = `${dwEndStr}, ${months[dd.getUTCMonth()]} ${dd.getUTCDate()}`;
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
  // H3 fix: new Date("YYYY-MM-DD") parses as UTC midnight — use UTC accessors to avoid off-by-one on UTC- servers
  const pd = new Date(date);
  if (type === 'amavasya') pd.setUTCDate(pd.getUTCDate() + 1); // next day

  const y = pd.getUTCFullYear(), m = pd.getUTCMonth() + 1, d = pd.getUTCDate();
  const tz = getUTCOffsetForDate(y, m, d, timezone);
  const jd = dateToJD(y, m, d, 0);
  // Polar fallback: 6:00 / 18:00 explicit at call site (no silent default).
  const srUT = sunriseUTHoursOr(jd, lat, lon, 0, 6).value;
  const ssUT = sunsetUTHoursOr(jd, lat, lon, 0, 18).value;
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
  // Polar fallback: 6:00 / 18:00 explicit at call site (no silent default).
  const srUT = sunriseUTHoursOr(jd, lat, lon, 0, 6).value;
  const ssUT = sunsetUTHoursOr(jd, lat, lon, 0, 18).value;
  const dayLen = ssUT - srUT;
  const ft = (ut: number) => formatTime(((ut % 24) + 24) % 24, tz);

  // Next day sunrise for night-length calculations
  const jdNext = dateToJD(y, m, d + 1, 0);
  const srNextUT = sunriseUTHoursOr(jdNext, lat, lon, 0, 6).value;
  const nightLen = (srNextUT + 24) - ssUT; // hours from sunset to next sunrise

  // Madhyahna = middle 1/5 of daytime (2/5 to 3/5)  –  matches The classical definition
  const madhStart = srUT + dayLen * (2 / 5);
  const madhEnd = srUT + dayLen * (3 / 5);
  // Aparahna = 3/5 to 4/5 of daytime
  const aparStart = srUT + dayLen * (3 / 5);
  const aparEnd = srUT + dayLen * (4 / 5);

  switch (slug) {
    case 'diwali': {
      // Lakshmi Puja during Vrishabha Kaal  –  when Taurus (30°-60°) is on the
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

// ─── Kala-Vyapti (Time-Prevalence) Helpers ───

/**
 * Calculates the exact Julian Day boundaries for a specific Kala (Muhurta)
 * on a given calendar day. Used for festival date resolution.
 */
function getKalaWindow(y: number, m: number, d: number, lat: number, lon: number, timezone: string, rule: string) {
  const tzOff = getUTCOffsetForDate(y, m, d, timezone);
  const jdNoon = dateToJD(y, m, d, 12 - tzOff);
  const srUT = sunriseUTHoursOr(jdNoon, lat, lon, 0, 6).value;
  const ssUT = sunsetUTHoursOr(jdNoon, lat, lon, 0, 18).value;
  const dayLen = ssUT - srUT;
  const nightLen = 24 - dayLen;
  const srJd = dateToJD(y, m, d, srUT);
  const ssJd = dateToJD(y, m, d, ssUT);

  switch (rule) {
    case 'madhyahna':  return { startJd: srJd + (dayLen * 2 / 5) / 24, endJd: srJd + (dayLen * 3 / 5) / 24 };
    case 'aparahna':   return { startJd: srJd + (dayLen * 3 / 5) / 24, endJd: srJd + (dayLen * 4 / 5) / 24 };
    case 'pradosh':    return { startJd: ssJd, endJd: ssJd + 2.4 / 24 }; // 4 ghatis (96m) after sunset
    case 'nishita':    return { startJd: ssJd + (nightLen * 7.5 / 15) / 24 - 0.4 / 24, endJd: ssJd + (nightLen * 7.5 / 15) / 24 + 0.4 / 24 };
    case 'arunodaya':  return { startJd: srJd - 1.6 / 24, endJd: srJd }; // 4 ghatis before sunrise
    case 'chandrodaya': {
      // Moonrise window: ~1 hour around moonrise. Used for Karwa Chauth, Sankashti Chaturthi.
      const baseJd = Math.floor(jdNoon - 0.5) + 0.5; // midnight UT
      const mrUT = calculateMoonriseUT(baseJd + 0.5, lat, lon);
      if (mrUT !== null) {
        let mrJd = baseJd + mrUT / 24;
        // If moonrise UT is before sunrise UT, it's an early morning moonrise (next day UT)
        if (mrUT < srUT) mrJd += 1;
        return { startJd: mrJd - 0.5 / 24, endJd: mrJd + 0.5 / 24 }; // ±30 min around moonrise
      }
      // Moon doesn't rise  –  fall back to pradosh window
      return { startJd: ssJd, endJd: ssJd + 2.4 / 24 };
    }
    default:           return { startJd: srJd - 0.01, endJd: srJd + 0.01 }; // tight sunrise window
  }
}

/** Measure how much a tithi overlaps with a time window (in JD days). */
function getOverlap(tithiStart: number, tithiEnd: number, windowStart: number, windowEnd: number): number {
  return Math.max(0, Math.min(tithiEnd, windowEnd) - Math.max(tithiStart, windowStart));
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

  // ── 1. Major + lunar-regional Festivals from declarative definitions ───
  // Iterate MAJOR_FESTIVALS plus the two regional arrays that share the
  // same lunar-tithi shape. The regional arrays mix solar-style entries
  // (which use `solarMonth` + `tithi`, handled elsewhere via
  // resolveSolarFestivals) with lunar-style entries (which use `masa`
  // + `paksha` + `tithi`). Filter to ONLY the lunar-style ones — without
  // the `paksha`/`tithi` checks, defToTithiNumber would receive
  // undefined and either crash or produce NaN. Each def's own `type`
  // field (when present) overrides the default 'major' label downstream.
  const isLunarDef = (d: FestivalDef): d is FestivalDef & { masa: string; paksha: 'shukla' | 'krishna'; tithi: number } =>
    // `d && typeof d === 'object'` guards against a null/undefined entry
    // sneaking into REGIONAL_FESTIVALS (e.g. via a trailing comma in
    // the array literal) — without it, `'masa' in d` would throw
    // `TypeError: Cannot use 'in' operator to search for 'masa' in null`.
    !!d && typeof d === 'object' &&
    'masa' in d && typeof d.masa === 'string' &&
    'paksha' in d && (d.paksha === 'shukla' || d.paksha === 'krishna') &&
    'tithi' in d && typeof d.tithi === 'number';
  const LUNAR_FESTIVAL_DEFS: FestivalDef[] = [
    ...MAJOR_FESTIVALS,
    ...REGIONAL_FESTIVALS.filter(isLunarDef),
    ...MORE_REGIONAL_FESTIVALS.filter(isLunarDef),
    // 6 previously-orphaned arrays — see import block comment above.
    ...PITRU_FESTIVALS.filter(isLunarDef),
    ...JAIN_SIKH_FESTIVALS.filter(isLunarDef),
    ...ADDITIONAL_VRATS.filter(isLunarDef),
    ...JAYANTI_FESTIVALS.filter(isLunarDef),
    ...ADDITIONAL_MAJOR_FESTIVALS.filter(isLunarDef),
    ...NIRJALA_EKADASHI.filter(isLunarDef),
  ];
  for (const def of LUNAR_FESTIVAL_DEFS) {
    const tithiNum = defToTithiNumber(def);
    // Festival defs use the standard Indian convention (Prokerala, Drik Panchang):
    // All festivals use Purnimant month naming. For Shukla paksha tithis, Amant and
    // Purnimant agree. For Krishna paksha, Purnimant = Amant's NEXT month
    // (e.g., Diwali is "Kartika Kr Amavasya" in Purnimant = "Ashwina Kr Amavasya" in Amant).
    // Our tithi table's purnimanta field lags by 1, so for Krishna we match against
    // the Amant month that's one BEFORE the def's Purnimant name.
    const matches = table.entries.filter(e => {
      if (e.number !== tithiNum || e.masa.isAdhika) return false;
      if (tithiNum <= 15) {
        // Shukla: Amant and Purnimant agree
        return e.masa.amanta === def.masa;
      }
      // Krishna: def.masa is Purnimant = Amant + 1, so match Amant = previous(def.masa)
      return getNextHinduMonth(e.masa.amanta) === def.masa;
    });

    for (const match of matches) {
      const detail = FESTIVAL_DETAILS[def.slug];

      // ── Kala-Vyapti Resolution ──
      // Each festival has a muhurtaRule specifying which time window (Kala) the
      // tithi must be active during. We compute the overlap of the tithi with
      // that window on both the sunriseDate (Day 2) and the previous day (Day 1),
      // then apply Dharmasindhu/Nirnayasindhu tie-breaking rules.
      let festivalDate = match.sunriseDate;
      const rule = def.muhurtaRule || 'sunrise';

      if (match.startJd && match.endJd && rule !== 'sunrise') {
        const [y2, m2, d2] = match.sunriseDate.split('-').map(Number);
        // Use Date.UTC to avoid local-timezone shifts (Lesson L)
        const date1 = new Date(Date.UTC(y2, m2 - 1, d2 - 1));
        const [y1, m1, d1] = [date1.getUTCFullYear(), date1.getUTCMonth() + 1, date1.getUTCDate()];

        const win1 = getKalaWindow(y1, m1, d1, lat, lon, timezone, rule);
        const win2 = getKalaWindow(y2, m2, d2, lat, lon, timezone, rule);

        const overlap1 = getOverlap(match.startJd, match.endJd, win1.startJd, win1.endJd);
        const overlap2 = getOverlap(match.startJd, match.endJd, win2.startJd, win2.endJd);

        // Dharmasindhu resolution:
        // 1. Active only on Day 1 → pick Day 1
        // 2. Active only on Day 2 → keep Day 2 (sunriseDate)
        // 3. Active on both → purva-vyapini festivals (pradosh/nishita) prefer
        //    Day 1 regardless of overlap size; other day-festivals (including
        //    aparahna-vyapini) pick the greater overlap (bhuyo-vyapini).
        //
        //    Why 'aparahna' is NOT in the priority list (2026-06-11 revert):
        //    The original PR #669 added 'aparahna' here based on the assumption
        //    that Bhai Dooj is purva-vyapini ("observe Day 1 if Dwitiya touches
        //    aparahna at all"). Direct Drik fetch on Bhai Dooj 2026 page shows
        //    Drik = Nov 11, NOT Nov 10 as PR #669 claimed, and Drik's own
        //    explanation on that page uses the aparahna-vyapini framing —
        //    Drik picks the day where Dwitiya occupies the larger portion of
        //    aparahna (bhuyo-vyapini). For 2026 that's Day 2 (full ~130 min)
        //    over Day 1 (~80 min). pradosh and nishita ARE classically
        //    purva-vyapini (no real lineage disagreement); aparahna is split,
        //    and Drik + Prokerala + AstroSage + mainstream panchangs all
        //    apply bhuyo-vyapini. Going with the majority + verifiable
        //    reference. Bhai Dooj 2026: engine pre-revert Nov 10, Drik Nov 11,
        //    engine post-revert Nov 11.
        if (overlap1 > 0 && overlap2 === 0) {
          festivalDate = `${y1}-${String(m1).padStart(2, '0')}-${String(d1).padStart(2, '0')}`;
        } else if (overlap1 > 0 && overlap2 > 0) {
          if (['pradosh', 'nishita'].includes(rule) || overlap1 >= overlap2) {
            festivalDate = `${y1}-${String(m1).padStart(2, '0')}-${String(d1).padStart(2, '0')}`;
          }
        }
      }

      // Kshaya tithi: the tithi has no sunrise within it. Per Dharmasindhu,
      // the festival is observed on the preceding day. sunriseDate for kshaya
      // entries already points to the start date (previous day), so the date
      // mapping is correct. We note the kshaya condition for UI display.
      const isKshayaFestival = match.isKshaya;

      const entryType = (def.type ?? 'major') as FestivalEntry['type'];
      const entryCategory = def.category ?? 'festival';
      const entry: FestivalEntry = {
        name: detail?.name || def.name || { en: def.slug, hi: def.slug, sa: def.slug },
        date: festivalDate,
        tithi: `${match.masa.amanta} ${match.paksha} ${match.number <= 15 ? match.number : match.number - 15}${isKshayaFestival ? ' (Kshaya)' : ''}`,
        masa: match.masa,
        paksha: match.paksha,
        // Use the def's own type when set ('regional' for the Bengali / Tamil
        // / Punjabi lunar regional defs) — falls back to 'major' for MAJOR_FESTIVALS.
        type: entryType,
        category: entryCategory,
        isVrat: isVratByDef({
          type: (def.type ?? 'major') as FestivalDef['type'],
          category: entryCategory as FestivalDef['category'],
          isVrat: def.isVrat,
        }),
        description: detail?.significance || { en: '', hi: '', sa: '' },
        slug: def.slug,
      };

      // Compute puja muhurat for key festivals
      const muhurat = computePujaMuhurat(def.slug, match.sunriseDate, lat, lon, timezone);
      if (muhurat) {
        entry.pujaMuhurat = muhurat;
      }

      // Parana for named ekadashis (such as Nirjala) that go through
      // this major-festival emission path. Without this the user-visible
      // card shows the same name + date as a generic ekadashi but is
      // missing the parana window — the bug a user surfaced on
      // 2026-06-07 (Nirjala Ekadashi displayed in a different format
      // from Apara / Padmini etc.). The generic ekadashi pass at step 2
      // already computes parana via computeEkadashiParanaFromTable;
      // named ekadashis just needed the same call here. Mokshada (the
      // former Vaikuntha alias) flows through the generic pass and
      // already gets parana there — no separate handling needed.
      if (entryCategory === 'ekadashi') {
        Object.assign(entry, computeEkadashiParanaFromTable(match, table, lat, lon, timezone));
      }

      festivals.push(entry);
    }
  }

  // ── 1b. Solar festivals (all 22 Sankranti-based festivals via solar-festivals engine) ───
  {
    const solarFests = resolveSolarFestivals(year, timezone);
    for (const sf of solarFests) {
      festivals.push({
        name: sf.name,
        date: sf.date,
        tithi: `${sf.signName.en} Sankranti (Solar)`,
        masa: { purnimanta: '', amanta: '', isAdhika: false },
        paksha: 'shukla',
        type: sf.type,
        category: sf.category,
        // Solar Sankranti festivals (Makar, Mesha, Karka, etc.) are
        // observances of the Sun's ingress, not vrats. Some are paired
        // with optional rituals but the entry itself is a marker not a
        // fast. False here matches the previous (type==='vrat')-based
        // section logic.
        isVrat: isVratByDef({
          type: sf.type as FestivalDef['type'],
          category: sf.category as FestivalDef['category'],
        }),
        description: sf.isUttarayana
          ? { en: 'Sun enters Capricorn  –  marks the northward journey (Uttarayana). Sacred bathing, charity, and sesame offerings.', hi: 'सूर्य मकर राशि में प्रवेश  –  उत्तरायण का आरम्भ। पवित्र स्नान, दान और तिल।', sa: 'सूर्यः मकरराशिं प्रविशति  –  उत्तरायणारम्भः।' }
          : sf.isDakshinayana
            ? { en: `Sun enters Cancer  –  marks the southward journey (Dakshinayana).`, hi: 'सूर्य कर्क राशि में प्रवेश  –  दक्षिणायन का आरम्भ।', sa: 'सूर्यः कर्कराशिं प्रविशति  –  दक्षिणायनारम्भः।' }
            : { en: `Sun enters ${sf.signName.en}  –  ${sf.name.en}.`, hi: `सूर्य ${sf.signName.hi} राशि में प्रवेश  –  ${sf.name.hi}।`, sa: `सूर्यः ${sf.signName.sa} राशिं प्रविशति।` },
        slug: sf.slug,
      });
    }
  }

  // ── 2. Ekadashis from tithi table ───
  const allEkadashis = [
    ...lookupAllTithiByNumber(table, 11),  // Shukla Ekadashi
    ...lookupAllTithiByNumber(table, 26),  // Krishna Ekadashi
  ].sort((a, b) => a.startJd - b.startJd);

  // Collect dates that already have a named Ekadashi from the major festival defs
  const namedEkadashiDates = new Set(
    festivals.filter(f => f.slug && f.slug.includes('ekadashi') && f.slug !== 'ekadashi').map(f => f.date),
  );

  for (const ek of allEkadashis) {
    // Skip if a named Ekadashi festival already exists on this date
    // (e.g., Nirjala Ekadashi, Devshayani Ekadashi from the major defs)
    if (namedEkadashiDates.has(ek.sunriseDate)) continue;

    const { name, detail } = resolveEkadashiName(ek);
    const parana = computeEkadashiParanaFromTable(ek, table, lat, lon, timezone);

    // Derive a named slug from the English ekadashi name (e.g., "Kamada Ekadashi" → "kamada-ekadashi")
    // Falls back to generic 'ekadashi' for Adhika month or unresolved names
    const ekSlug = name.en
      ? name.en.toLowerCase().replace(/\s+/g, '-')
      : 'ekadashi';

    festivals.push({
      name,
      date: ek.sunriseDate,
      masa: ek.masa,
      paksha: ek.paksha,
      type: 'vrat',
      category: 'ekadashi',
      // Generic ekadashis (Kamada, Papamochani, Adhika Padmini/Parama,
      // etc.) are always observed as vrats. The Nirjala / Vaikuntha
      // overrides flow through the named-def branch above and already
      // get isVrat=true via isVratByDef on category='ekadashi'.
      isVrat: true,
      description: detail?.benefit || { en: 'Fasting for Lord Vishnu', hi: 'विष्णु व्रत', sa: 'विष्णुव्रतम्' },
      slug: ekSlug,
      ...parana,
    });
  }

  // ── 3. Monthly Recurring Vrats ───
  for (const def of MONTHLY_VRATS) {
    const tithiNum = defToTithiNumber(def);
    const matches = lookupAllTithiByNumber(table, tithiNum);

    for (const match of matches) {
      // Skip Adhika months for recurring vrats EXCEPT purnima/amavasya date listings
      // which should show ALL occurrences including during Adhika months
      if (match.lunarMonth.isAdhika && def.category !== 'purnima' && def.category !== 'amavasya') continue;

      const catDetail = CATEGORY_DETAILS[def.slug.replace('-shukla', '').replace('-krishna', '')];
      const parana = computeSimpleParana(match.sunriseDate, lat, lon, timezone, def.category as 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham');

      const catName = def.category === 'pradosham'
        ? { en: `${match.paksha === 'shukla' ? 'Shukla' : 'Krishna'} Pradosham`, hi: `${match.paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण'} प्रदोष`, sa: `${match.paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण'}प्रदोषः` }
        : catDetail?.name || { en: def.slug, hi: def.slug, sa: def.slug };

      // Check if a named major festival already exists on this date  –  use its name.
      // E.g., "Guru Purnima" instead of generic "Purnima Vrat" for Jul 29.
      const existingMajor = festivals.find(f =>
        f.date === match.sunriseDate && f.type === 'major' &&
        (f.category === def.category || f.slug?.includes(def.category)),
      );

      // For purnima/amavasya: always derive the month-based name (e.g., "Pausha Purnima").
      // If a major festival also falls on this date (e.g., Holi), show BOTH:
      // "Phalguna Purnima (Holi)"
      let resolvedName = def.name || catName;
      if (def.category === 'purnima' || def.category === 'amavasya') {
        const masaName = match.masa?.amanta || '';
        const masaCapitalized = masaName.charAt(0).toUpperCase() + masaName.slice(1);
        const isAdhika = match.lunarMonth?.isAdhika || match.masa?.isAdhika;
        const prefix = isAdhika ? 'Adhika ' : '';
        const prefixHi = isAdhika ? 'अधिक ' : '';
        const tithiLabel = def.category === 'purnima' ? 'Purnima' : 'Amavasya';
        const tithiLabelHi = def.category === 'purnima' ? 'पूर्णिमा' : 'अमावस्या';

        const baseName = `${prefix}${masaCapitalized} ${tithiLabel}`;
        const baseNameHi = `${prefixHi}${masaCapitalized} ${tithiLabelHi}`;

        // Append major festival name if one exists on this date
        const majorOnDate = existingMajor?.name?.en;
        if (majorOnDate) {
          resolvedName = {
            en: `${baseName} (${majorOnDate})`,
            hi: `${baseNameHi} (${existingMajor?.name?.hi || majorOnDate})`,
            sa: `${baseName}`,
          };
        } else {
          resolvedName = { en: baseName, hi: baseNameHi, sa: baseName };
        }
      }

      festivals.push({
        name: resolvedName,
        date: match.sunriseDate,
        masa: match.masa,
        paksha: match.paksha,
        type: 'vrat',
        category: def.category,
        isVrat: isVratByDef({
          type: 'vrat',
          category: def.category,
          isVrat: def.isVrat,
        }),
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
    // For now, skip eclipse integration  –  can be added later
  } catch (err) { console.error('[festival-generator] eclipse computation failed:', err); }

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
