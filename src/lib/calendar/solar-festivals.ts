/**
 * Solar Festival Engine  –  computes Sankranti dates (Sun's sidereal sign ingress).
 *
 * A Sankranti occurs when the Sun's sidereal longitude crosses a sign boundary
 * (0deg, 30deg, 60deg, ... 330deg). The Sun moves ~1deg/day, so each Sankranti
 * is a specific date and time.
 *
 * Algorithm: binary search on sidereal Sun longitude for each of the 12 sign
 * boundaries. Uses existing sunLongitude() + toSidereal() from the ephem engine.
 * 40 iterations of bisection on a ~45-day window gives sub-second precision.
 *
 * Key examples:
 *   - Makar Sankranti = Sun enters Capricorn (sidereal 270deg)  –  ~Jan 14-15
 *   - Mesh Sankranti  = Sun enters Aries (sidereal 0deg)  –  ~Apr 13-14
 *   - Karka Sankranti  = Sun enters Cancer (sidereal 90deg)  –  ~Jul 16-17
 */

import { dateToJD, jdToDate, sunLongitude, toSidereal, normalizeDeg } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { SOLAR_FESTIVALS, type FestivalDef } from '@/lib/calendar/festival-defs';
import type { LocaleText } from '@/types/panchang';

// ── Types ───────────────────────────────────────────────────────────────────

export interface SankrantiEntry {
  /** Rashi ID 1-12 (1=Aries/Mesh, 10=Capricorn/Makar, etc.) */
  signId: number;
  /** Multilingual sign name from RASHIS constant */
  signName: LocaleText;
  /** Local date YYYY-MM-DD */
  date: string;
  /** Local time HH:MM */
  time: string;
  /** Julian Day of exact ingress (UT) */
  jd: number;
  /** true for Makar Sankranti (signId=10)  –  Sun begins northward journey */
  isUttarayana?: boolean;
  /** true for Karka Sankranti (signId=4)  –  Sun begins southward journey */
  isDakshinayana?: boolean;
}

export interface ResolvedSolarFestival {
  slug: string;
  name: LocaleText;
  date: string;
  time: string;
  jd: number;
  type: 'major' | 'vrat' | 'regional';
  category: string;
  signId: number;
  signName: LocaleText;
  isUttarayana?: boolean;
  isDakshinayana?: boolean;
  region?: string;
  family?: string;
  /** Day offset from the Sankranti date (0 = same day, 1 = next day, -1 = day before) */
  dayOffset: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Get the sidereal Sun longitude at a given JD, normalised to [0, 360).
 */
function siderealSun(jd: number): number {
  return normalizeDeg(toSidereal(sunLongitude(jd), jd));
}

/**
 * Convert a JD (UT) to local date/time strings for the given timezone.
 */
function jdToLocal(jd: number, timezone: string): { date: string; time: string } {
  const utcDate = jdToDate(jd);
  const y = utcDate.getUTCFullYear();
  const m = utcDate.getUTCMonth() + 1;
  const d = utcDate.getUTCDate();
  const offset = getUTCOffsetForDate(y, m, d, timezone);

  // Apply offset to get local time
  const localMs = utcDate.getTime() + offset * 3600000;
  const local = new Date(localMs);

  const ly = local.getUTCFullYear();
  const lm = local.getUTCMonth() + 1;
  const ld = local.getUTCDate();
  const lh = local.getUTCHours();
  const lmin = local.getUTCMinutes();

  return {
    date: `${ly}-${String(lm).padStart(2, '0')}-${String(ld).padStart(2, '0')}`,
    time: `${String(lh).padStart(2, '0')}:${String(lmin).padStart(2, '0')}`,
  };
}

// ── Approximate JD for Sun entering a given sidereal sign ───────────────────

/**
 * Approximate JD when the Sun enters a sidereal sign in a given year.
 *
 * Sign boundaries in sidereal longitude:
 *   sign 1 (Aries) = 0deg, sign 2 (Taurus) = 30deg, ... sign 12 (Pisces) = 330deg
 *
 * The Sun crosses 0deg sidereal (Mesh Sankranti) around April 14.
 * We estimate by counting ~30.44 days per sign from that anchor.
 */
function approximateJD(signId: number, year: number): number {
  // Mesh Sankranti (sign 1, 0deg sidereal) is approximately April 14.
  // Signs 1-9 (Aries through Sagittarius) fall Apr-Jan in the same year.
  // Signs 10-12 (Capricorn, Aquarius, Pisces) fall Jan-Apr  –  they occur
  // BEFORE Mesh Sankranti in the calendar year, so we anchor them to the
  // PREVIOUS year's Mesh Sankranti.
  const signsAhead = (signId - 1 + 12) % 12; // 0 for Aries, 9 for Capricorn, etc.

  if (signsAhead >= 9) {
    // Signs 10 (Capricorn, signsAhead=9), 11 (Aquarius, 10), 12 (Pisces, 11)
    // These fall in Jan-Mar of the given year.
    // Anchor to PREVIOUS year's Mesh Sankranti.
    const meshJd = dateToJD(year - 1, 4, 14, 12);
    return meshJd + signsAhead * 30.44;
  } else {
    // Signs 1-9 fall Apr-Dec/Jan of the given year
    const meshJd = dateToJD(year, 4, 14, 12);
    return meshJd + signsAhead * 30.44;
  }
}

// ── Core computation ────────────────────────────────────────────────────────

/**
 * Find the exact JD when the sidereal Sun crosses a given degree boundary.
 * Uses binary search with 40 iterations for sub-second precision.
 *
 * The tricky part: the 0deg boundary (Aries ingress) requires special handling
 * because the sidereal longitude wraps from 359.x to 0.x. We detect this by
 * checking if the longitude difference between start and end of the search
 * window spans the wrap point.
 */
function findIngress(targetDeg: number, approxJd: number): number {
  // Search within +/- 22 days of the approximate date
  let lo = approxJd - 22;
  let hi = approxJd + 22;

  // For 40 iterations, the interval shrinks to (44 days) / 2^40 ~ 0.00000004 days ~ 0.003 seconds
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const sidLong = siderealSun(mid);

    // Determine if the Sun has passed the target degree.
    // We need to handle the 360deg/0deg wrap carefully.
    // The Sun moves ~1deg/day eastward, so over our 44-day window it moves ~44deg.
    // For the 0deg boundary: before crossing, longitude is ~350-359; after, ~0-10.
    // We use the "angular distance" approach: if (sidLong - targetDeg) mod 360 < 180,
    // the Sun has already passed the target (it's ahead of the boundary).
    const diff = normalizeDeg(sidLong - targetDeg);

    if (diff < 180) {
      // Sun is past the boundary  –  search earlier
      hi = mid;
    } else {
      // Sun hasn't reached the boundary yet  –  search later
      lo = mid;
    }
  }

  return (lo + hi) / 2;
}

/**
 * Compute all 12 Sankranti dates for a given year.
 *
 * Returns entries sorted by date (chronological order within the year).
 * The first Sankranti of a calendar year is typically Makar (signId=10, ~Jan 14),
 * and the last is Dhanu (signId=9, ~Jan of the next year  –  but we only include
 * entries whose local date falls within the given year).
 *
 * @param year - Gregorian year (e.g. 2026)
 * @param timezone - IANA timezone string (e.g. 'Asia/Kolkata', 'Europe/Zurich')
 * @returns Array of 12 SankrantiEntry objects, sorted by JD
 */
export function computeSankrantis(year: number, timezone: string): SankrantiEntry[] {
  const entries: SankrantiEntry[] = [];

  for (let signId = 1; signId <= 12; signId++) {
    const targetDeg = (signId - 1) * 30; // 0deg for Aries, 30deg for Taurus, etc.
    const approxJd = approximateJD(signId, year);
    const exactJd = findIngress(targetDeg, approxJd);

    const { date, time } = jdToLocal(exactJd, timezone);

    // Only include if the local date falls within the requested year
    const localYear = parseInt(date.substring(0, 4), 10);
    if (localYear !== year) continue;

    const rashi = RASHIS.find(r => r.id === signId);

    entries.push({
      signId,
      signName: rashi?.name ?? { en: `Sign ${signId}` },
      date,
      time,
      jd: exactJd,
      ...(signId === 10 ? { isUttarayana: true } : {}),
      ...(signId === 4 ? { isDakshinayana: true } : {}),
    });
  }

  // Sort chronologically by JD
  entries.sort((a, b) => a.jd - b.jd);

  return entries;
}

// ── Solar Festival Resolution ───────────────────────────────────────────────

/**
 * Day-offset rules for specific solar festival slugs.
 * Most solar festivals fall on the Sankranti day itself (offset 0).
 * Some regional variants are celebrated the day before or after.
 */
const DAY_OFFSETS: Record<string, number> = {
  // Lohri is celebrated the evening before Makar Sankranti
  'lohri': -1,
  // Bhogi is the Tamil "discard the old" day on the eve of Pongal — same
  // offset as Lohri (both anchored to Capricorn ingress -1).
  'bhogi': -1,
  // Mattu Pongal is the day after Pongal (which is on Makar Sankranti day)
  'mattu-pongal': 1,
  // Kaanum Pongal is two days after Pongal
  'kaanum-pongal': 2,
};

/**
 * Resolve solar festival definitions to actual dates for a given year.
 *
 * Reads SOLAR_FESTIVALS from festival-defs.ts, matches each entry's solarMonth
 * to the corresponding Sankranti date, and returns resolved festivals with
 * actual dates.
 *
 * @param year - Gregorian year
 * @param timezone - IANA timezone string
 * @returns Array of resolved solar festivals with computed dates
 */
export function resolveSolarFestivals(year: number, timezone: string): ResolvedSolarFestival[] {
  const sankrantis = computeSankrantis(year, timezone);

  // Index by signId for O(1) lookup
  const sankrantiMap = new Map<number, SankrantiEntry>();
  for (const s of sankrantis) {
    sankrantiMap.set(s.signId, s);
  }

  const resolved: ResolvedSolarFestival[] = [];

  for (const def of SOLAR_FESTIVALS) {
    if (!def.solarMonth) continue;

    const sankranti = sankrantiMap.get(def.solarMonth);
    if (!sankranti) {
      // Sankranti for this sign didn't fall within the year  –  skip
      console.error(`[solar-festivals] No Sankranti found for signId=${def.solarMonth} in ${year}`);
      continue;
    }

    const dayOffset = DAY_OFFSETS[def.slug] ?? 0;

    let date = sankranti.date;
    let jd = sankranti.jd;

    if (dayOffset !== 0) {
      // Shift the JD and recompute the local date
      jd = sankranti.jd + dayOffset;
      const shifted = jdToLocal(jd, timezone);
      date = shifted.date;
    }

    resolved.push({
      slug: def.slug,
      name: def.name ?? { en: def.slug },
      date,
      time: sankranti.time, // Always show the actual Sankranti moment
      jd,
      type: def.type,
      category: def.category,
      signId: sankranti.signId,
      signName: sankranti.signName,
      ...(sankranti.isUttarayana ? { isUttarayana: true } : {}),
      ...(sankranti.isDakshinayana ? { isDakshinayana: true } : {}),
      ...(def.region ? { region: def.region } : {}),
      ...(def.family ? { family: def.family } : {}),
      dayOffset,
    });
  }

  // Sort by date
  resolved.sort((a, b) => a.jd - b.jd);

  return resolved;
}
