/**
 * Festival Calendar Generator V2 — table-based lookup
 *
 * Uses the pre-computed yearly tithi table + declarative festival definitions
 * to generate the complete festival calendar. Replaces the scanning-based approach.
 */

import { dateToJD, approximateSunrise, approximateSunset, formatTime } from '@/lib/ephem/astronomical';
import { buildYearlyTithiTable, lookupAllTithiByNumber, getNextTithiEntry, type YearlyTithiTable, type TithiEntry } from './tithi-table';
import { MAJOR_FESTIVALS, EKADASHI_DEFS, MONTHLY_VRATS, defToTithiNumber, type FestivalDef } from './festival-defs';
import { getEkadashiName, getNextHinduMonth, getPreviousHinduMonth, ADHIKA_MASA_EKADASHI } from '@/lib/constants/festival-details';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { generateEclipseCalendar } from './eclipses';
import type { Trilingual } from '@/types/panchang';

// Re-export FestivalEntry from the old module for compatibility
export interface FestivalEntry {
  name: Trilingual;
  date: string;
  tithi?: string;
  masa?: { amanta: string; purnimanta: string; isAdhika: boolean };
  paksha?: 'shukla' | 'krishna';
  type: 'major' | 'vrat' | 'regional' | 'eclipse';
  category: string;
  description: Trilingual;
  pujaMuhurat?: { start: string; end: string; name: string };
  slug?: string;
  paranaDate?: string;
  paranaStart?: string;
  paranaEnd?: string;
  paranaNote?: Trilingual;
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
  eclipsePhases?: { name: Trilingual; time: string }[];
  paranaMadhyahnaStart2?: string;
  paranaMadhyahnaEnd2?: string;
}

// ─── Festival Detail Imports ───

import {
  FESTIVAL_DETAILS, CATEGORY_DETAILS,
  type FestivalDetail, type EkadashiDetail,
} from '@/lib/constants/festival-details';

// ─── Ekadashi Name Resolution ───

function resolveEkadashiName(entry: TithiEntry): { name: Trilingual; detail?: EkadashiDetail } {
  const { paksha, masa } = entry;

  if (masa.isAdhika) {
    const detail = paksha === 'shukla' ? ADHIKA_MASA_EKADASHI.shukla : ADHIKA_MASA_EKADASHI.krishna;
    return { name: detail.name, detail };
  }

  // EKADASHI_NAMES is keyed by Purnimant month names (same as Drik).
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

  // Madhyahna = middle 1/5 of daytime
  const dayLen = sunsetUT - sunriseUT;
  const madhStartUT = sunriseUT + dayLen * (2 / 5);
  const madhEndUT = sunriseUT + dayLen * (3 / 5);

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
    recStartUT = sunriseUT;
    recEndUT = dwEndUTHours;
  } else if (earliestUT < madhStartUT) {
    recStartUT = earliestUT;
    recEndUT = Math.min(madhStartUT, effectiveDeadline);
  } else if (earliestUT >= madhEndUT) {
    recStartUT = earliestUT;
    recEndUT = effectiveDeadline;
  } else {
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
    const moonriseUT = ssUT + 2; // approximate
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

  // Madhyahna = middle 1/5 of daytime (2/5 to 3/5) — matches Drik's definition
  const madhStart = srUT + dayLen * (2 / 5);
  const madhEnd = srUT + dayLen * (3 / 5);
  // Aparahna = 3/5 to 4/5 of daytime
  const aparStart = srUT + dayLen * (3 / 5);
  const aparEnd = srUT + dayLen * (4 / 5);

  switch (slug) {
    case 'diwali': {
      // Lakshmi Puja during Pradosh Kaal: sunset to sunset + ~3h
      // Drik uses Vrishabha Lagna for optimal time — approximate as sunset+17m to sunset+1h43m
      const startUT = ssUT + 17 / 60;
      const endUT = ssUT + 103 / 60;
      return { start: ft(startUT), end: ft(endUT), name: 'Lakshmi Puja (Pradosh Kaal)' };
    }
    case 'dussehra': {
      // Vijay Muhurat: during Aparahna, specifically the 2nd quarter
      // Drik's window is ~43 minutes within Aparahna
      const midApar = (aparStart + aparEnd) / 2;
      const startUT = midApar - 0.36; // ~22 min before mid-aparahna
      const endUT = midApar + 0.36;   // ~22 min after
      return { start: ft(startUT), end: ft(endUT), name: 'Vijay Muhurat (Aparahna)' };
    }
    case 'ganesh-chaturthi': {
      // Madhyahna Puja: middle 1/5 of daytime (Drik's definition)
      return { start: ft(madhStart), end: ft(madhEnd), name: 'Ganesh Puja (Madhyahna)' };
    }
    case 'navaratri': {
      // Ghatasthapana: first 1/3 of daytime (Pratah Kaal)
      const startUT = srUT;
      const endUT = srUT + dayLen / 3;
      return { start: ft(startUT), end: ft(endUT), name: 'Ghatasthapana (Pratah Kaal)' };
    }
    case 'maha-shivaratri': {
      // Nishita Kaal = the midnight muhurta (most auspicious for Shiva puja)
      // It's the 8th muhurta of the night (night divided into 15 muhurtas)
      // Approximately: midnight - 24min to midnight + 24min
      // Midnight = (sunset + next_sunrise) / 2
      const midnightUT = (ssUT + srNextUT + 24) / 2; // average of sunset and next sunrise
      const nishitaStart = midnightUT - 0.46; // ~28 min before midnight
      const nishitaEnd = midnightUT + 0.46;   // ~28 min after midnight
      return { start: ft(nishitaStart), end: ft(nishitaEnd), name: 'Nishita Kaal Puja' };
    }
    case 'dhanteras': {
      // Pradosh Kaal: sunset+17m to sunset+1h43m (same as Diwali Vrishabha approximation)
      const startUT = ssUT + 17 / 60;
      const endUT = ssUT + 103 / 60;
      return { start: ft(startUT), end: ft(endUT), name: 'Dhanteras Puja (Pradosh Kaal)' };
    }
    case 'ram-navami': {
      // Madhyahna: middle 1/5 of daytime (Drik definition, birth time of Lord Rama)
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
    // Festival defs use Purnimant month names (same as Drik).
    // Match against entry.masa.purnimanta — computed from Purnima boundaries.
    const matches = table.entries.filter(e =>
      e.number === tithiNum &&
      e.masa.purnimanta === def.masa &&
      !e.masa.isAdhika
    );

    for (const match of matches) {
      const detail = FESTIVAL_DETAILS[def.slug];
      const entry: FestivalEntry = {
        name: detail?.name || def.name || { en: def.slug, hi: def.slug, sa: def.slug },
        date: match.sunriseDate,
        tithi: `${match.masa.purnimanta} ${match.paksha} ${match.number <= 15 ? match.number : match.number - 15}`,
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
