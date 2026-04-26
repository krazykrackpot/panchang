/**
 * Smart Muhurta Search Engine — Two-Pass Scanning
 *
 * Pass 1 (Coarse): Scans date range in ~4-hour chunks, ranks days by peak panchang score.
 * Pass 2 (Fine):   Scans Top-5 days in 15-minute slices, computes lagna, hora, personal
 *                  factors, merges consecutive high-scoring slices, returns Top-3 windows.
 *
 * Designed for performance: Pass 1 uses lightweight astronomical math (Sun/Moon longitudes
 * only). Full ascendant computation is reserved for Pass 2.
 */

import {
  dateToJD, sunLongitude, moonLongitude, toSidereal,
  getNakshatraNumber, getRashiNumber, lahiriAyanamsha,
  calculateTithi, calculateYoga, calculateKarana,
  approximateSunriseSafe, approximateSunsetSafe,
  calcAscendant, formatTime,
} from '@/lib/ephem/astronomical';
import { scorePanchangFactors, type PanchangSnapshot } from './ai-recommender';
import { EXTENDED_ACTIVITIES } from './activity-rules-extended';
import { computePersonalScore } from './personal-compatibility';
import { scoreDashaHarmony } from './dasha-harmony';
import { RASHIS } from '@/lib/constants/rashis';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import { GRAHAS } from '@/lib/constants/grahas';
import type { ExtendedActivityId } from '@/types/muhurta-ai';
import type { BirthData } from '@/types/kundali';

// ─── Types ───────────────────────────────────────────────────────

export interface MuhurtaWindow {
  date: string;          // "2026-10-14"
  startTime: string;     // "18:15"
  endTime: string;       // "19:30"
  score: number;         // 0-100
  breakdown: {
    panchang: number;    // 0-25
    lagna: number;       // 0-25
    hora: number;        // 0-25
    personal: number;    // 0-25 (0 if not logged in)
  };
  proof: {
    tithi: { name: string; quality: string };
    nakshatra: { name: string; quality: string };
    yoga: { name: string; quality: string };
    lagna: { sign: string; quality: string };
    hora: { planet: string; match: boolean };
    specialYogas: string[];
    dashaHarmony?: string;
  };
}

export interface SearchParams {
  activity: ExtendedActivityId;
  startDate: string;     // "YYYY-MM-DD"
  endDate: string;       // "YYYY-MM-DD"
  lat: number;
  lng: number;
  tzOffset: number;      // hours from UTC (e.g., 5.5 for IST)
}

export interface UserSnapshot {
  birthData: BirthData;
  dashaLords?: { maha: number; antar: number; pratyantar: number };
}

interface DayScore {
  date: string;
  jdNoon: number;
  peakScore: number;
}

interface SliceScore {
  jd: number;
  localHour: number;      // decimal hours in local time
  score: number;
  breakdown: MuhurtaWindow['breakdown'];
  proof: MuhurtaWindow['proof'];
}

// ─── Constants ───────────────────────────────────────────────────

// Chaldean sequence for hora: Sun(0)→Venus(5)→Mercury(3)→Moon(1)→Saturn(6)→Jupiter(4)→Mars(2)
const CHALDEAN_ORDER = [0, 5, 3, 1, 6, 4, 2];
const HORA_DAY_START = [0, 3, 6, 2, 5, 1, 4]; // Starting index in CHALDEAN_ORDER per weekday

// Activities that prefer stable (sthira/dvisvabhava) lagnas
const STABLE_LAGNA_ACTIVITIES = new Set<ExtendedActivityId>([
  'marriage', 'griha_pravesh', 'construction' as ExtendedActivityId,
  'property', 'business', 'financial_signing',
]);

// Activities that prefer movable (chara) lagnas
const MOVABLE_LAGNA_ACTIVITIES = new Set<ExtendedActivityId>([
  'travel', 'vehicle', 'relocation',
]);

// Sign quality mapping: 1-based sign id → quality
// Cardinal(chara): 1,4,7,10  Fixed(sthira): 2,5,8,11  Mutable(dvisvabhava): 3,6,9,12
function getSignQuality(signId: number): 'chara' | 'sthira' | 'dvisvabhava' {
  const mod = ((signId - 1) % 3);
  if (mod === 0) return 'chara';
  if (mod === 1) return 'sthira';
  return 'dvisvabhava';
}

// Amrita Siddhi Yoga: specific weekday + nakshatra combos (Muhurta Chintamani)
const AMRITA_SIDDHI: Array<[number, number]> = [
  [0, 7],   // Sunday + Pushya
  [1, 11],  // Monday + Hasta (Hasta=13? Using simplified: Mon+Mrigashira)
  [2, 3],   // Tuesday + Ashwini
  [3, 17],  // Wednesday + Anuradha
  [4, 8],   // Thursday + Pushya
  [5, 27],  // Friday + Revati
  [6, 4],   // Saturday + Rohini
];

// Sarvartha Siddhi Yoga: weekday + nakshatra (simplified subset)
const SARVARTHA_SIDDHI: Array<[number, number]> = [
  [0, 8],   // Sunday + Pushya
  [1, 22],  // Monday + Shravana
  [2, 3],   // Tuesday + Ashwini
  [3, 17],  // Wednesday + Anuradha
  [4, 13],  // Thursday + Chitra (Hasta=13)
  [5, 27],  // Friday + Revati
  [6, 22],  // Saturday + Shravana
];

// ─── Helpers ─────────────────────────────────────────────────────

function parseDateStr(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month, day };
}

/** Build a PanchangSnapshot from a JD (lightweight — no full computePanchang). */
function snapAtJD(jd: number): PanchangSnapshot {
  const tithiResult = calculateTithi(jd);
  const moonSid = toSidereal(moonLongitude(jd), jd);
  const nakshatra = getNakshatraNumber(moonSid);
  const yoga = calculateYoga(jd);
  const karana = calculateKarana(jd);
  const moonSign = getRashiNumber(moonSid);
  const weekday = Math.floor(jd + 1.5) % 7; // 0=Sunday
  return { tithi: tithiResult.number, nakshatra, yoga, karana, weekday, moonSign };
}

/** Get hora planet at a given local hour on a given weekday. */
function getHoraPlanet(
  localHour: number,
  weekday: number,
  sunriseLocalH: number,
  sunsetLocalH: number,
): number {
  const isDay = localHour >= sunriseLocalH && localHour < sunsetLocalH;
  const dayDur = sunsetLocalH - sunriseLocalH;
  const nightDur = 24 - dayDur;
  const horaDuration = isDay ? dayDur / 12 : nightDur / 12;
  const base = isDay ? sunriseLocalH : sunsetLocalH;
  const horaIndex = Math.max(0, Math.floor((localHour - base) / horaDuration));
  const totalIdx = isDay ? horaIndex : horaIndex + 12;
  const startIdx = HORA_DAY_START[weekday % 7];
  const seqIdx = (startIdx + totalIdx) % 7;
  return CHALDEAN_ORDER[seqIdx];
}

/** Detect special yogas (Amrita Siddhi, Sarvartha Siddhi). */
function detectSpecialYogas(weekday: number, nakshatra: number): string[] {
  const yogas: string[] = [];
  for (const [wd, nak] of AMRITA_SIDDHI) {
    if (wd === weekday && nak === nakshatra) {
      yogas.push('Amrita Siddhi');
      break;
    }
  }
  for (const [wd, nak] of SARVARTHA_SIDDHI) {
    if (wd === weekday && nak === nakshatra) {
      yogas.push('Sarvartha Siddhi');
      break;
    }
  }
  return yogas;
}

/** Get tithi quality relative to activity rules. */
function getTithiQuality(
  tithiNum: number,
  goodTithis: number[],
  avoidTithis: number[],
): string {
  const pakshaRel = tithiNum > 15 ? tithiNum - 15 : tithiNum;
  const isKrishna = tithiNum > 15;
  if (avoidTithis.includes(pakshaRel)) return 'inauspicious';
  if (goodTithis.includes(pakshaRel) && !isKrishna) return 'excellent';
  if (goodTithis.includes(pakshaRel) && isKrishna) return 'moderate';
  return 'neutral';
}

/** Get nakshatra quality relative to activity rules. */
function getNakshatraQuality(
  nakNum: number,
  goodNakshatras: number[],
  avoidNakshatras: number[],
): string {
  if (avoidNakshatras.includes(nakNum)) return 'inauspicious';
  if (goodNakshatras.includes(nakNum)) return 'excellent';
  return 'neutral';
}

/** Score lagna suitability for activity (0-25). */
function scoreLagna(
  jd: number,
  lat: number,
  lng: number,
  activity: ExtendedActivityId,
): { score: number; sign: string; quality: string } {
  const tropAsc = calcAscendant(jd, lat, lng);
  const sidAsc = ((tropAsc - lahiriAyanamsha(jd)) % 360 + 360) % 360;
  const signId = Math.floor(sidAsc / 30) + 1;
  const rashi = RASHIS[signId - 1];
  const signName = rashi?.name.en ?? `Sign ${signId}`;
  const signQuality = getSignQuality(signId);

  let score = 10; // base score for having a lagna

  // Quality match bonus
  if (STABLE_LAGNA_ACTIVITIES.has(activity)) {
    if (signQuality === 'sthira') score += 15;
    else if (signQuality === 'dvisvabhava') score += 10;
    else score += 3; // chara is less ideal for stable activities
  } else if (MOVABLE_LAGNA_ACTIVITIES.has(activity)) {
    if (signQuality === 'chara') score += 15;
    else if (signQuality === 'dvisvabhava') score += 8;
    else score += 3;
  } else {
    // General activities — any non-malefic sign is fine
    score += 10;
  }

  const qualityLabel = signQuality === 'chara' ? 'Cardinal'
    : signQuality === 'sthira' ? 'Fixed'
    : 'Mutable';
  const qualityStr = `${signName} (${qualityLabel})`;

  return { score: Math.min(25, score), sign: signName, quality: qualityStr };
}

/** Score hora match (0-25). */
function scoreHora(
  horaPlanet: number,
  goodHoras: number[],
): { score: number; planetName: string; match: boolean } {
  const graha = GRAHAS.find(g => g.id === horaPlanet);
  const planetName = graha?.name.en ?? `Planet ${horaPlanet}`;
  const match = goodHoras.includes(horaPlanet);
  // 20 for match, 5 base
  const score = match ? 20 : 5;
  return { score: Math.min(25, score), planetName, match };
}

/** Convert JD-based UT hour to "HH:MM" in local time. */
function jdToLocalTimeStr(jd: number, tzOffset: number): string {
  // Extract fractional day, convert to hours
  const frac = (jd + 0.5) - Math.floor(jd + 0.5);
  const utHour = frac * 24;
  return formatTime(utHour, tzOffset);
}

/** Convert a "YYYY-MM-DD" + local decimal hour to JD. */
function dateAndLocalHourToJD(
  year: number, month: number, day: number,
  localHour: number, tzOffset: number,
): number {
  const utHour = localHour - tzOffset;
  return dateToJD(year, month, day, utHour);
}

// ─── Pass 1: Coarse Scan ─────────────────────────────────────────

export function coarseScan(params: SearchParams): DayScore[] {
  const { activity, startDate, endDate, lat, lng, tzOffset } = params;
  const rules = EXTENDED_ACTIVITIES[activity];
  if (!rules) {
    console.error(`[smart-search] Unknown activity: ${activity}`);
    return [];
  }

  const start = parseDateStr(startDate);
  const end = parseDateStr(endDate);
  const startJD = dateToJD(start.year, start.month, start.day, 12 - tzOffset); // noon local
  const endJD = dateToJD(end.year, end.month, end.day, 12 - tzOffset);

  const dayScores: DayScore[] = [];

  // Iterate each day
  for (let jdNoon = startJD; jdNoon <= endJD; jdNoon += 1) {
    // Compute sunrise/sunset for sampling points
    const sunriseUT = approximateSunriseSafe(jdNoon, lat, lng);
    const sunsetUT = approximateSunsetSafe(jdNoon, lat, lng);
    const sunriseLocal = sunriseUT + tzOffset;
    const sunsetLocal = sunsetUT + tzOffset;

    // Sample at ~4-hour intervals from sunrise through sunset
    const sampleHours = [
      sunriseLocal,
      sunriseLocal + 4,
      sunriseLocal + 8,
      (sunriseLocal + sunsetLocal) / 2, // noon-ish
      sunsetLocal - 4,
      sunsetLocal,
    ];

    let peakScore = 0;

    for (const localH of sampleHours) {
      const jdSample = dateAndLocalHourToJD(
        start.year, start.month, start.day,
        localH, tzOffset,
      );
      // Adjust for actual day offset
      const dayOffset = jdNoon - startJD;
      const jd = jdSample + dayOffset;

      const snap = snapAtJD(jd);
      const { score } = scorePanchangFactors(snap, rules);
      if (score > peakScore) peakScore = score;
    }

    // Build date string from JD
    const dayIdx = Math.round(jdNoon - startJD);
    const d = new Date(Date.UTC(start.year, start.month - 1, start.day + dayIdx));
    const dateStr = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;

    dayScores.push({ date: dateStr, jdNoon, peakScore });
  }

  // Sort descending by peakScore, take top 5
  dayScores.sort((a, b) => b.peakScore - a.peakScore);
  return dayScores.slice(0, 5);
}

// ─── Pass 2: Fine Scan ──────────────────────────────────────────

export function fineScan(
  date: string,
  params: SearchParams,
  userSnapshot?: UserSnapshot,
): MuhurtaWindow[] {
  const { activity, lat, lng, tzOffset } = params;
  const rules = EXTENDED_ACTIVITIES[activity];
  if (!rules) {
    console.error(`[smart-search] Unknown activity: ${activity}`);
    return [];
  }

  const { year, month, day } = parseDateStr(date);
  const jdNoon = dateToJD(year, month, day, 12 - tzOffset);
  const sunriseUT = approximateSunriseSafe(jdNoon, lat, lng);
  const sunsetUT = approximateSunsetSafe(jdNoon, lat, lng);
  const sunriseLocal = sunriseUT + tzOffset;
  const sunsetLocal = sunsetUT + tzOffset;

  // Scan from sunrise to sunset in 15-min slices (daytime muhurtas are most relevant)
  const sliceMinutes = 15;
  const sliceHours = sliceMinutes / 60;
  const slices: SliceScore[] = [];

  for (let localH = sunriseLocal; localH < sunsetLocal; localH += sliceHours) {
    const jd = dateAndLocalHourToJD(year, month, day, localH, tzOffset);
    const snap = snapAtJD(jd);
    const weekday = snap.weekday;

    // 1. Panchang score (0-25)
    const panchangResult = scorePanchangFactors(snap, rules);

    // 2. Lagna score (0-25)
    const lagnaResult = scoreLagna(jd, lat, lng, activity);

    // 3. Hora score (0-25)
    const horaPlanet = getHoraPlanet(localH, weekday, sunriseLocal, sunsetLocal);
    const horaResult = scoreHora(horaPlanet, rules.goodHoras);

    // 4. Personal score (0-25)
    let personalScore = 0;
    let dashaHarmonyLabel: string | undefined;
    if (userSnapshot) {
      const personalResult = computePersonalScore(userSnapshot.birthData, jd);
      personalScore = personalResult.score;

      if (userSnapshot.dashaLords) {
        const dashaResult = scoreDashaHarmony(userSnapshot.dashaLords, rules);
        // Scale dasha harmony (0-10) into the personal bucket
        personalScore = Math.min(25, personalScore + dashaResult.score);
        if (dashaResult.favorable) {
          dashaHarmonyLabel = dashaResult.label;
        }
      }
    }

    // Detect special yogas
    const specialYogas = detectSpecialYogas(weekday, snap.nakshatra);

    // Special yoga bonus: add to panchang score (capped at 25)
    const specialBonus = specialYogas.length * 3;
    const adjustedPanchang = Math.min(25, panchangResult.score + specialBonus);

    // Build proof
    const tithiIdx = snap.tithi <= 15 ? snap.tithi - 1 : snap.tithi - 16;
    const tithiData = TITHIS[Math.max(0, Math.min(29, snap.tithi - 1))];
    const nakData = NAKSHATRAS[Math.max(0, snap.nakshatra - 1)];
    const yogaData = YOGAS[Math.max(0, snap.yoga - 1)];

    const proof: MuhurtaWindow['proof'] = {
      tithi: {
        name: tithiData?.name.en ?? `Tithi ${snap.tithi}`,
        quality: getTithiQuality(snap.tithi, rules.goodTithis, rules.avoidTithis),
      },
      nakshatra: {
        name: nakData?.name.en ?? `Nakshatra ${snap.nakshatra}`,
        quality: getNakshatraQuality(snap.nakshatra, rules.goodNakshatras, rules.avoidNakshatras),
      },
      yoga: {
        name: yogaData?.name.en ?? `Yoga ${snap.yoga}`,
        quality: yogaData?.nature === 'inauspicious' ? 'inauspicious'
          : yogaData?.nature === 'auspicious' ? 'auspicious' : 'neutral',
      },
      lagna: {
        sign: lagnaResult.sign,
        quality: lagnaResult.quality,
      },
      hora: {
        planet: horaResult.planetName,
        match: horaResult.match,
      },
      specialYogas,
      ...(dashaHarmonyLabel ? { dashaHarmony: dashaHarmonyLabel } : {}),
    };

    const breakdown: MuhurtaWindow['breakdown'] = {
      panchang: adjustedPanchang,
      lagna: lagnaResult.score,
      hora: horaResult.score,
      personal: personalScore,
    };

    const totalScore = adjustedPanchang + lagnaResult.score + horaResult.score + personalScore;

    slices.push({
      jd,
      localHour: localH,
      score: totalScore,
      breakdown,
      proof,
    });
  }

  // Merge consecutive high-scoring slices into windows
  // Threshold: score > 30 (out of 100) to be considered a viable window
  const MERGE_THRESHOLD = 30;
  const windows: MuhurtaWindow[] = [];
  let windowStart: SliceScore | null = null;
  let windowEnd: SliceScore | null = null;
  let windowBestSlice: SliceScore | null = null;

  for (const slice of slices) {
    if (slice.score >= MERGE_THRESHOLD) {
      if (!windowStart) {
        windowStart = slice;
        windowEnd = slice;
        windowBestSlice = slice;
      } else {
        windowEnd = slice;
        if (slice.score > (windowBestSlice?.score ?? 0)) {
          windowBestSlice = slice;
        }
      }
    } else {
      // End of a window
      if (windowStart && windowEnd && windowBestSlice) {
        windows.push(buildWindow(date, windowStart, windowEnd, windowBestSlice, tzOffset, sliceHours));
      }
      windowStart = null;
      windowEnd = null;
      windowBestSlice = null;
    }
  }
  // Flush last window
  if (windowStart && windowEnd && windowBestSlice) {
    windows.push(buildWindow(date, windowStart, windowEnd, windowBestSlice, tzOffset, sliceHours));
  }

  // Sort by score descending, return top 3
  windows.sort((a, b) => b.score - a.score);
  return windows.slice(0, 3);
}

function buildWindow(
  date: string,
  start: SliceScore,
  end: SliceScore,
  best: SliceScore,
  tzOffset: number,
  sliceHours: number,
): MuhurtaWindow {
  const startH = start.localHour;
  const endH = end.localHour + sliceHours; // end of last slice

  return {
    date,
    startTime: decimalHoursToTimeStr(startH),
    endTime: decimalHoursToTimeStr(endH),
    score: best.score,
    breakdown: best.breakdown,
    proof: best.proof,
  };
}

function decimalHoursToTimeStr(h: number): string {
  const wrapped = ((h % 24) + 24) % 24;
  const hours = Math.floor(wrapped);
  const minutes = Math.floor((wrapped - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// ─── Main Entry Point ────────────────────────────────────────────

export function smartMuhurtaSearch(
  params: SearchParams,
  userSnapshot?: UserSnapshot,
): MuhurtaWindow[] {
  // Pass 1: coarse scan for top days
  const topDays = coarseScan(params);

  if (topDays.length === 0) return [];

  // Pass 2: fine scan each top day
  const allWindows: MuhurtaWindow[] = [];

  for (const dayScore of topDays) {
    const windows = fineScan(dayScore.date, params, userSnapshot);
    allWindows.push(...windows);
  }

  // Sort all windows by score descending, return top 3
  allWindows.sort((a, b) => b.score - a.score);
  return allWindows.slice(0, 3);
}
