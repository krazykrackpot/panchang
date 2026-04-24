/**
 * Yearly Tithi Table — pre-computed tithi transitions for an entire year.
 *
 * Single source of truth for:
 * - Festival/Ekadashi date determination (lookup by masa + paksha + tithi)
 * - Daily panchang tithi data (lookup by sunrise JD)
 * - Parana calculations (Dwadashi start/end from adjacent entries)
 *
 * Algorithm inspired by PyJHora (Lagrange interpolation approach) but uses
 * coarse scan + binary search for simplicity and accuracy.
 */

import {
  dateToJD, calculateTithi, approximateSunrise, approximateSunset,
  formatTime, normalizeDeg, toSidereal, sunLongitude, moonLongitude,
} from '@/lib/ephem/astronomical';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { getHinduMonth, getNextHinduMonth } from '@/lib/constants/festival-details';
import { TITHIS } from '@/lib/constants/tithis';
import type { LocaleText} from '@/types/panchang';

// ─── Types ───

export interface LunarMonthInfo {
  name: string;       // e.g., 'chaitra', 'vaishakha'
  isAdhika: boolean;
  startDate: string;  // Amavasya start
  endDate: string;    // Amavasya end
}

export interface TithiEntry {
  number: number;          // 1-30
  name: LocaleText;
  paksha: 'shukla' | 'krishna';
  startJd: number;
  endJd: number;
  startLocal: string;      // HH:MM
  endLocal: string;
  startDate: string;       // YYYY-MM-DD
  endDate: string;
  isKshaya: boolean;
  // isVriddhi: tithi spans 2+ sunrises (spans more than one full day).
  // HISTORICAL BUG (now fixed): was absent from both RawEntry and TithiEntry.
  // When sunriseDates.length > 1, the tithi is Vriddhi — festival engines need
  // this flag to identify Vriddhi Ekadashi, Vriddhi Amavasya, etc.
  isVriddhi: boolean;
  sunriseDate: string;     // date where tithi prevails at sunrise
  lunarMonth: LunarMonthInfo;  // Amanta month (boundaries: Amavasya to Amavasya)
  masa: {
    amanta: string;        // Amanta month name (e.g., 'pausha')
    purnimanta: string;    // Purnimant month name (e.g., 'magha' for Krishna in Amanta Pausha)
    isAdhika: boolean;
  };
  durationHours: number;
}

export interface YearlyTithiTable {
  year: number;
  lat: number;
  lon: number;
  timezone: string;
  entries: TithiEntry[];
  lunarMonths: LunarMonthInfo[];
  purnimantMonths: LunarMonthInfo[];
}

// ─── Cache ───

const tableCache = new Map<string, YearlyTithiTable>();
const MAX_CACHE = 5;

function cacheKey(year: number, lat: number, lon: number, timezone: string): string {
  return `${year}:${lat.toFixed(2)}:${lon.toFixed(2)}:${timezone}`;
}

// ─── Helpers ───

function jdToGregorian(jd: number): { year: number; month: number; day: number; hourFrac: number } {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  return { year, month, day, hourFrac: f * 24 };
}

function jdToLocalDateStr(jd: number, timezone: string): string {
  const { year, month, day, hourFrac } = jdToGregorian(jd);
  const tzOffset = getUTCOffsetForDate(year, month, day, timezone);
  const localHour = hourFrac + tzOffset;
  let y = year, m = month, d = day;
  if (localHour >= 24) {
    const next = new Date(y, m - 1, d + 1);
    y = next.getFullYear(); m = next.getMonth() + 1; d = next.getDate();
  } else if (localHour < 0) {
    const prev = new Date(y, m - 1, d - 1);
    y = prev.getFullYear(); m = prev.getMonth() + 1; d = prev.getDate();
  }
  return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
}

function jdToLocalTimeStr(jd: number, timezone: string): string {
  const { year, month, day, hourFrac } = jdToGregorian(jd);
  const tzOffset = getUTCOffsetForDate(year, month, day, timezone);
  const localHour = ((hourFrac + tzOffset) % 24 + 24) % 24;
  const h = Math.floor(localHour);
  const min = Math.floor((localHour - h) * 60);
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

/**
 * Find exact JD where tithi transitions from currentTithi to the next.
 * Uses coarse scan (2-hour steps) + binary search (20 iterations, ~5 sec precision).
 */
function findTithiEndJd(startJd: number, currentTithi: number): number {
  const step = 2 / 24; // 2 hours in JD
  const maxJd = startJd + 2.0; // scan up to 2 days forward

  // Coarse scan
  let lo = startJd;
  let hi = maxJd;
  for (let jd = startJd + step; jd <= maxJd; jd += step) {
    const t = calculateTithi(jd).number;
    if (t !== currentTithi) {
      lo = jd - step;
      hi = jd;
      break;
    }
  }

  // Binary search
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (calculateTithi(mid).number === currentTithi) lo = mid; else hi = mid;
  }

  return (lo + hi) / 2;
}

/**
 * Get sunrise JD for a specific Gregorian date at the given location.
 */
function sunriseJdForDate(dateStr: string, lat: number, lon: number): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  const jdApprox = dateToJD(y, m, d, 0);
  const srUT = approximateSunrise(jdApprox, lat, lon);
  return dateToJD(y, m, d, srUT);
}

// ─── Lunar Month Builder (from festivals.ts, refined) ───

function buildLunarMonths(year: number, lat: number, lon: number, timezone: string): LunarMonthInfo[] {
  // Find all Amavasyas (tithi 30) for the year with boundary months
  const amavasyas: { date: string; jd: number }[] = [];

  for (let m = -2; m <= 14; m++) {
    const gm = m <= 0 ? 12 + m : m > 12 ? m - 12 : m;
    const gy = m <= 0 ? year - 1 : m > 12 ? year + 1 : year;

    // Scan from day 1 of the month for tithi 30
    const startDate = new Date(gy, gm - 1, 1);
    let prevTithi = 0;
    for (let offset = 0; offset <= 35; offset++) {
      const dd = new Date(startDate);
      dd.setDate(dd.getDate() + offset);
      const dy = dd.getFullYear();
      const dm = dd.getMonth() + 1;
      const ddy = dd.getDate();
      const jdApprox = dateToJD(dy, dm, ddy, 0);
      const srUT = approximateSunrise(jdApprox, lat, lon);
      const jdSr = dateToJD(dy, dm, ddy, srUT);
      const t = calculateTithi(jdSr).number;
      if (t === 30 && prevTithi !== 30) {
        const dateStr = `${dy}-${dm.toString().padStart(2, '0')}-${ddy.toString().padStart(2, '0')}`;
        if (!amavasyas.find(a => a.date === dateStr)) {
          amavasyas.push({ date: dateStr, jd: jdSr });
        }
      }
      prevTithi = t;
    }
  }
  amavasyas.sort((a, b) => a.jd - b.jd);

  // Build months from consecutive Amavasya pairs
  const months: LunarMonthInfo[] = [];
  for (let i = 0; i < amavasyas.length - 1; i++) {
    // Find exact new moon JD (conjunction) for accurate rashi determination
    let minDiff = 999;
    let nmJd = amavasyas[i].jd;
    for (let h = -24; h <= 24; h++) {
      const jd = amavasyas[i].jd + h / 24;
      const diff = normalizeDeg(moonLongitude(jd) - sunLongitude(jd));
      const adj = diff > 180 ? 360 - diff : diff;
      if (adj < minDiff) { minDiff = adj; nmJd = jd; }
    }

    const sunSid = normalizeDeg(toSidereal(sunLongitude(nmJd), nmJd));
    const sign = Math.floor(sunSid / 30) + 1;

    // Check next new moon for same sign (Adhika)
    let nmJd2 = amavasyas[i + 1].jd;
    let minDiff2 = 999;
    for (let h = -24; h <= 24; h++) {
      const jd = amavasyas[i + 1].jd + h / 24;
      const diff = normalizeDeg(moonLongitude(jd) - sunLongitude(jd));
      const adj = diff > 180 ? 360 - diff : diff;
      if (adj < minDiff2) { minDiff2 = adj; nmJd2 = jd; }
    }
    const sunSid2 = normalizeDeg(toSidereal(sunLongitude(nmJd2), nmJd2));
    const sign2 = Math.floor(sunSid2 / 30) + 1;

    const isAdhika = sign === sign2;
    const monthName = getHinduMonth(sign);

    months.push({
      name: monthName,
      isAdhika,
      startDate: amavasyas[i].date,
      endDate: amavasyas[i + 1].date,
    });
  }

  return months;
}

// ─── Main Builder ───

export function buildYearlyTithiTable(
  year: number,
  lat: number,
  lon: number,
  timezone: string,
): YearlyTithiTable {
  // Check cache
  const key = cacheKey(year, lat, lon, timezone);
  const cached = tableCache.get(key);
  if (cached) return cached;

  // ─── Phase 1: Build raw tithi entries (without lunar month assignment) ───
  const startJd = dateToJD(year - 1, 12, 1, 0);
  const startSrUT = approximateSunrise(startJd, lat, lon);
  let currentJd = dateToJD(year - 1, 12, 1, startSrUT);
  const scanEndJd = dateToJD(year + 1, 2, 1, 12);

  interface RawEntry {
    number: number; startJd: number; endJd: number;
    startDateStr: string; endDateStr: string;
    startTimeStr: string; endTimeStr: string;
    sunriseDate: string; isKshaya: boolean;
    // isVriddhi: tithi spans 2+ sunrises (opposite of Kshaya).
    // Festival engines use this to distinguish which sunrise day to use for
    // dual-tithi observances.  Previously missing — callers had no way to flag
    // Vriddhi tithis.
    isVriddhi: boolean;
    paksha: 'shukla' | 'krishna';
    name: LocaleText;
  }

  const rawEntries: RawEntry[] = [];
  let currentTithi = calculateTithi(currentJd).number;

  while (currentJd < scanEndJd) {
    const tithiEndJd = findTithiEndJd(currentJd, currentTithi);
    const tithiData = TITHIS[currentTithi - 1] || TITHIS[0];
    const startDateStr = jdToLocalDateStr(currentJd, timezone);
    const endDateStr = jdToLocalDateStr(tithiEndJd, timezone);
    const startTimeStr = jdToLocalTimeStr(currentJd, timezone);
    const endTimeStr = jdToLocalTimeStr(tithiEndJd, timezone);

    // Find all sunrise dates where this tithi prevails + kshaya detection
    let sunriseDate = startDateStr;
    let isKshaya = true;
    const sunriseDates: string[] = [];
    const startD = new Date(startDateStr);
    const endD = new Date(endDateStr);
    for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
      const ds = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
      const srJd = sunriseJdForDate(ds, lat, lon);
      if (srJd >= currentJd && srJd < tithiEndJd) {
        sunriseDates.push(ds);
        isKshaya = false;
      }
    }

    // For Dwi-tithi (tithi spans 2+ sunrises):
    // - Ekadashi (11, 26): use LAST sunrise (Smarta Dwi-Ekadashi second-day rule)
    // - All other tithis: use FIRST sunrise (standard Udayatithi rule)
    if (sunriseDates.length > 0) {
      const isEkadashi = currentTithi === 11 || currentTithi === 26;
      sunriseDate = isEkadashi
        ? sunriseDates[sunriseDates.length - 1]  // Ekadashi: second day
        : sunriseDates[0];                        // Others: first day
    }

    rawEntries.push({
      number: currentTithi,
      startJd: currentJd,
      endJd: tithiEndJd,
      startDateStr,
      endDateStr,
      startTimeStr,
      endTimeStr,
      sunriseDate,
      isKshaya,
      // Vriddhi = the tithi spans 2 or more sunrises (the opposite of Kshaya).
      isVriddhi: sunriseDates.length > 1,
      paksha: currentTithi <= 15 ? 'shukla' : 'krishna',
      name: tithiData.name,
    });

    currentJd = tithiEndJd;
    currentTithi = calculateTithi(currentJd + 0.001).number;
  }

  // ─── Phase 2: Build lunar months from Amavasya entries in the raw table ───
  // Amavasya = tithi 30. Each Amavasya marks the END of an Amanta month.
  const amavasyaEntries = rawEntries.filter(e => e.number === 30);
  const lunarMonths: LunarMonthInfo[] = [];

  for (let i = 0; i < amavasyaEntries.length - 1; i++) {
    const am1 = amavasyaEntries[i];
    const am2 = amavasyaEntries[i + 1];

    // Find exact new moon JD for accurate Sun rashi
    const findNewMoon = (baseJd: number): number => {
      let minDiff = 999; let bestJd = baseJd;
      for (let h = -24; h <= 24; h++) {
        const jd = baseJd + h / 24;
        const diff = normalizeDeg(moonLongitude(jd) - sunLongitude(jd));
        const adj = diff > 180 ? 360 - diff : diff;
        if (adj < minDiff) { minDiff = adj; bestJd = jd; }
      }
      return bestJd;
    };

    const nmJd1 = findNewMoon(am1.startJd);
    const nmJd2 = findNewMoon(am2.startJd);

    const sunSid1 = normalizeDeg(toSidereal(sunLongitude(nmJd1), nmJd1));
    const sunSid2 = normalizeDeg(toSidereal(sunLongitude(nmJd2), nmJd2));
    const sign1 = Math.floor(sunSid1 / 30) + 1;
    const sign2 = Math.floor(sunSid2 / 30) + 1;

    const isAdhika = sign1 === sign2;
    // Per classical rule: maasa = rashi(new_moon) + 1
    // But we use getHinduMonth(sign) which already has the correct offset
    // (verified: Krishna Ekadashis match expected pattern)
    const monthName = getHinduMonth(sign1);

    lunarMonths.push({
      name: monthName,
      isAdhika,
      startDate: am1.sunriseDate,
      endDate: am2.sunriseDate,
    });
  }

  // ─── Phase 2b: Build Purnimant months from Purnima entries ───
  // Purnimant months run from Purnima to Purnima.
  // The month is named by the Sankranti (Sun entering new sign) that occurs within it.
  const purnimaEntries = rawEntries.filter(e => e.number === 15); // tithi 15 = Purnima
  const purnimantMonths: LunarMonthInfo[] = [];

  for (let i = 0; i < purnimaEntries.length - 1; i++) {
    const p1 = purnimaEntries[i];
    const p2 = purnimaEntries[i + 1];

    // Find Sun's rashi at the midpoint (approximate Sankranti location)
    const midJd = (p1.endJd + p2.startJd) / 2;
    const sunSidMid = normalizeDeg(toSidereal(sunLongitude(midJd), midJd));
    const signMid = Math.floor(sunSidMid / 30) + 1;

    // Check for Adhika (same sign at both Purnimas)
    const sunSid1 = normalizeDeg(toSidereal(sunLongitude(p1.endJd), p1.endJd));
    const sunSid2 = normalizeDeg(toSidereal(sunLongitude(p2.startJd), p2.startJd));
    const sign1 = Math.floor(sunSid1 / 30) + 1;
    const sign2 = Math.floor(sunSid2 / 30) + 1;
    const isAdhika = sign1 === sign2;

    purnimantMonths.push({
      name: getHinduMonth(signMid),
      isAdhika,
      startDate: p1.sunriseDate,
      endDate: p2.sunriseDate,
    });
  }

  // ─── Phase 3: Assign BOTH month systems to entries ───
  const entries: TithiEntry[] = [];
  for (const raw of rawEntries) {
    if (!raw.startDateStr.startsWith(`${year}`) && !raw.endDateStr.startsWith(`${year}`) && !raw.sunriseDate.startsWith(`${year}`)) {
      continue;
    }

    // Find Amanta month
    let lunarMonth: LunarMonthInfo = { name: 'chaitra', isAdhika: false, startDate: '', endDate: '' };
    for (const lm of lunarMonths) {
      if (raw.sunriseDate > lm.startDate && raw.sunriseDate <= lm.endDate) {
        lunarMonth = lm;
        break;
      }
    }

    // Find Purnimant month
    let purnimantMonth: LunarMonthInfo = { name: 'chaitra', isAdhika: false, startDate: '', endDate: '' };
    for (const pm of purnimantMonths) {
      if (raw.sunriseDate > pm.startDate && raw.sunriseDate <= pm.endDate) {
        purnimantMonth = pm;
        break;
      }
    }

    const amantaName = lunarMonth.name;
    const purnimantaName = purnimantMonth.name;

    entries.push({
      number: raw.number,
      name: raw.name,
      paksha: raw.paksha,
      startJd: raw.startJd,
      endJd: raw.endJd,
      startLocal: raw.startTimeStr,
      endLocal: raw.endTimeStr,
      startDate: raw.startDateStr,
      endDate: raw.endDateStr,
      isKshaya: raw.isKshaya,
      isVriddhi: raw.isVriddhi,
      sunriseDate: raw.sunriseDate,
      lunarMonth,
      masa: {
        amanta: amantaName,
        purnimanta: purnimantaName,
        isAdhika: lunarMonth.isAdhika || purnimantMonth.isAdhika,
      },
      durationHours: (raw.endJd - raw.startJd) * 24,
    });
  }

  const table: YearlyTithiTable = { year, lat, lon, timezone, entries, lunarMonths, purnimantMonths };

  // Cache
  if (tableCache.size >= MAX_CACHE) {
    const firstKey = tableCache.keys().next().value;
    if (firstKey) tableCache.delete(firstKey);
  }
  tableCache.set(key, table);

  return table;
}

// ─── Lookup Helpers ───

/**
 * Find the TithiEntry that prevails at a given sunrise JD.
 */
export function lookupTithiAtSunrise(table: YearlyTithiTable, sunriseJd: number): TithiEntry | undefined {
  return table.entries.find(e => e.startJd <= sunriseJd && sunriseJd < e.endJd);
}

/**
 * Find all TithiEntries matching a specific tithi number within a specific lunar month.
 */
export function lookupTithiByMonthAndNumber(
  table: YearlyTithiTable,
  monthName: string,
  tithiNumber: number,
  isAdhika?: boolean,
): TithiEntry[] {
  return table.entries.filter(e =>
    e.number === tithiNumber &&
    e.lunarMonth.name === monthName &&
    (isAdhika === undefined || e.lunarMonth.isAdhika === isAdhika)
  );
}

/**
 * Find all TithiEntries matching a specific tithi number (all months).
 */
export function lookupAllTithiByNumber(table: YearlyTithiTable, tithiNumber: number): TithiEntry[] {
  return table.entries.filter(e => e.number === tithiNumber);
}

/**
 * Get the next tithi entry after a given one.
 */
export function getNextTithiEntry(table: YearlyTithiTable, entry: TithiEntry): TithiEntry | undefined {
  const idx = table.entries.indexOf(entry);
  return idx >= 0 && idx < table.entries.length - 1 ? table.entries[idx + 1] : undefined;
}

/**
 * Clear the cache (for testing).
 */
export function clearTithiTableCache(): void {
  tableCache.clear();
}
