/**
 * Maasaphal — Monthly Solar Return Charts (Tajika)
 *
 * For each month within the Varshaphal year, finds the moment when the Sun
 * returns to the same sidereal degree it occupied 1/12th further along its
 * annual journey from the solar return. Binary-search for precision, then
 * casts a minimal chart for that moment.
 *
 * Critical:
 *  - All Date construction uses Date.UTC (Lesson L / Lesson V).
 *  - All fractional-time arithmetic uses milliseconds (Lesson P).
 */

import { dateToJD, jdToDate, sunLongitude, toSidereal, normalizeDeg, getPlanetaryPositions, getRashiNumber } from '@/lib/ephem/astronomical';
import { detectTajikaYogas } from './tajika-aspects';
import type { PlanetPosition, KundaliData } from '@/types/kundali';
import type { TajikaYoga } from '@/types/varshaphal';

/** One degree ahead per month: the Sun moves ~30° between monthly returns */
const DEGREES_PER_MONTH = 360 / 12; // 30°

export interface MaasaphalPlanet {
  id: number;
  name: string;
  sign: number;
  degree: number;
  isRetrograde: boolean;
}

export interface MaasaphalChart {
  /** 1-based month index (1 = first month after solar return) */
  month: number;
  returnDate: string; // ISO date (YYYY-MM-DD)
  returnTime: string; // HH:MM UTC
  returnJd: number;
  lagnaSign: number; // 1-12 (estimated from time of day)
  planets: MaasaphalPlanet[];
  tajikYogas: string[]; // English names of Tajika yogas found
  monthSummary: string;
}

// Planet id → name mapping (matches getPlanetaryPositions order)
const PLANET_NAMES: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

/**
 * Compute 12 monthly solar return charts within the Varshaphal year.
 *
 * @param solarReturnJd   Julian Day of the annual solar return
 * @param solarReturnSunDeg  Sidereal longitude of Sun at the annual return (0-360)
 * @param birthLat        Birth latitude (degrees)
 * @param birthLng        Birth longitude (degrees)
 * @param timezone        IANA timezone string (used only for display)
 */
export function computeMaasaphal(
  solarReturnJd: number,
  solarReturnSunDeg: number,
  birthLat: number,
  birthLng: number,
  timezone: string,
): MaasaphalChart[] {
  // Silence unused-variable warning — timezone kept for future localised display
  void timezone;

  const charts: MaasaphalChart[] = [];

  for (let month = 1; month <= 12; month++) {
    // Target sidereal longitude for this month: solar-return degree + (month * 30°)
    const targetDeg = normalizeDeg(solarReturnSunDeg + month * DEGREES_PER_MONTH);

    // Approximate seed: solar return + ~30.44 days per month
    const approxJd = solarReturnJd + month * 30.4375; // 365.25/12

    // Binary-search for the precise JD (window ±2 days around approximate)
    const returnJd = binarySearchMaasaphal(approxJd - 2, approxJd + 2, targetDeg);

    // Convert JD to UTC Date
    const returnDate = jdToDate(returnJd);

    // Planetary positions at that moment
    const rawPositions = getPlanetaryPositions(returnJd);

    // Build simplified planet list
    const planets: MaasaphalPlanet[] = rawPositions.map(p => ({
      id: p.id,
      name: PLANET_NAMES[p.id] ?? `P${p.id}`,
      sign: getRashiNumber(p.longitude) + 1, // 1-based
      degree: p.longitude % 30,
      isRetrograde: p.speed < 0,
    }));

    // Estimate lagna from solar return Sun sign (simplified: use Sun's sign as lagna seed)
    // In a full implementation this would compute the actual ascendant from lat/lng + JD.
    // Using birth lat/lng for a rough lagna estimate via Sun sign at the time:
    const sunSign = planets.find(p => p.id === 0)?.sign ?? 1;
    const lagnaSign = estimateLagna(returnJd, birthLat, birthLng, sunSign);

    // Build minimal KundaliData-compatible planet array for yoga detection
    const pseudoPositions: PlanetPosition[] = buildPseudoPositions(planets, lagnaSign);

    // Detect Tajika yogas
    let tajikYogas: string[] = [];
    try {
      const yogas: TajikaYoga[] = detectTajikaYogas(pseudoPositions, lagnaSign);
      tajikYogas = yogas.map(y => y.name.en);
    } catch (err) {
      console.error('[maasaphal] Tajika yoga detection failed:', err);
      tajikYogas = [];
    }

    const isoDate = formatIsoDate(returnDate);
    const isoTime = formatTime(returnDate);

    charts.push({
      month,
      returnDate: isoDate,
      returnTime: isoTime,
      returnJd,
      lagnaSign,
      planets,
      tajikYogas,
      monthSummary: buildMonthSummary(month, lagnaSign, tajikYogas),
    });
  }

  return charts;
}

// ─── Binary search ─────────────────────────────────────────────────────────────

function binarySearchMaasaphal(jdLow: number, jdHigh: number, targetSidLong: number): number {
  for (let i = 0; i < 60; i++) {
    const mid = (jdLow + jdHigh) / 2;
    const sunSid = toSidereal(sunLongitude(mid), mid);
    const diff = angleDiff(sunSid, targetSidLong);

    if (Math.abs(diff) < 0.001) return mid; // sub-minute precision

    if (diff > 0) {
      jdHigh = mid;
    } else {
      jdLow = mid;
    }
  }
  return (jdLow + jdHigh) / 2;
}

/** Signed angular difference in [-180, 180] */
function angleDiff(a: number, b: number): number {
  let d = normalizeDeg(a - b);
  if (d > 180) d -= 360;
  return d;
}

// ─── Lagna estimation ──────────────────────────────────────────────────────────

/**
 * Rough lagna estimation: rotate a sign each ~2 hours from sunrise.
 * The ascendant sign changes ~every 2 hours, completing 12 signs per day.
 * This is not sub-degree accurate but gives a usable sign for monthly cards.
 */
function estimateLagna(jd: number, lat: number, _lng: number, sunSign: number): number {
  // JD fraction gives UT hour
  const utHour = ((jd + 0.5) % 1) * 24;

  // Latitude-adjusted sunrise estimate: ~6h at equator, shifts by lat
  const sunriseHour = 6 - lat * 0.05;

  // Each sign rises for ~2h; Sun's sign is the approximate lagna at solar noon
  // Shift by hours elapsed since sunrise
  const hoursSinceSunrise = ((utHour - sunriseHour) + 24) % 24;
  const signOffset = Math.floor(hoursSinceSunrise / 2);
  return ((sunSign - 1 + signOffset) % 12) + 1; // 1-12
}

// ─── PseudoPositions for yoga detection ───────────────────────────────────────

function buildPseudoPositions(planets: MaasaphalPlanet[], lagnaSign: number): PlanetPosition[] {
  return planets.map(p => {
    // house = (sign - lagnaSign + 12) % 12 + 1
    const house = ((p.sign - lagnaSign + 12) % 12) + 1;
    return {
      planet: { id: p.id, name: { en: p.name, hi: p.name, sa: p.name }, symbol: '', color: '' } as PlanetPosition['planet'],
      longitude: (p.sign - 1) * 30 + p.degree,
      latitude: 0,
      speed: p.isRetrograde ? -1 : 1,
      sign: p.sign,
      house,
      degree: p.degree,
      isRetrograde: p.isRetrograde,
      isExalted: false,
      isDebilitated: false,
      isOwnSign: false,
      isMoolatrikona: false,
      nakshatra: 1,
      nakshatraPada: 1,
      nakshatraName: { en: '', hi: '', sa: '' },
    } as unknown as PlanetPosition;
  });
}

// ─── Month summary ─────────────────────────────────────────────────────────────

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const RASHI_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

function buildMonthSummary(month: number, lagnaSign: number, yogas: string[]): string {
  const rashi = RASHI_NAMES[lagnaSign - 1] ?? 'Unknown';
  const yogaCount = yogas.length;
  const yogaText = yogaCount > 0 ? `${yogaCount} Tajika yoga${yogaCount > 1 ? 's' : ''} active: ${yogas.slice(0, 3).join(', ')}${yogaCount > 3 ? '…' : ''}.` : 'No major Tajika yogas.';
  return `Month ${month} (${MONTH_NAMES[(month - 1) % 12]}): Lagna in ${rashi}. ${yogaText}`;
}

// ─── Date helpers (Date.UTC — no local timezone bias) ─────────────────────────

function formatIsoDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatTime(d: Date): string {
  const h = String(d.getUTCHours()).padStart(2, '0');
  const min = String(d.getUTCMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}
