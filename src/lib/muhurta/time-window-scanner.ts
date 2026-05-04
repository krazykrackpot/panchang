/**
 * Time Window Scanner — Scans date ranges and scores each window
 */

import {
  dateToJD, approximateSunriseSafe, approximateSunsetSafe,
} from '@/lib/ephem/astronomical';
import {
  scorePanchangFactors, scoreTransitFactors,
  scoreTimingFactors, getPanchangSnapshot,
} from './ai-recommender';
import { getExtendedActivity } from './activity-rules-extended';
import { scoreDashaHarmony } from './dasha-harmony';
import {
  computeInauspiciousForWindow,
  computeInauspiciousPenalty,
} from './inauspicious-periods';
import {
  checkVivahCombustion, scoreLagna, krishnaPakshaAdjustment,
} from './classical-checks';
import type { ScoredTimeWindow, ScoreBreakdown, ExtendedActivityId, ScanOptionsV2, DetailBreakdown, InauspiciousPeriod } from '@/types/muhurta-ai';
import type { LocaleText,} from '@/types/panchang';

interface ScanOptions {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  activity: ExtendedActivityId;
  lat: number;
  lng: number;
  tz: number;
  birthNakshatra?: number; // 1-27, for Tara Bala
  birthRashi?: number;     // 1-12, for Chandra Bala
}

// Tara Bala — count from birth nakshatra to muhurta nakshatra (mod 9)
// Returns tara number 1-9: 3(Vipat),5(Pratyari),7(Vadha) = inauspicious; others = auspicious
function getTaraBala(birthNak: number, muhurtaNak: number): { tara: number; auspicious: boolean; name: string } {
  const count = ((muhurtaNak - birthNak + 27) % 27) + 1;
  const tara = ((count - 1) % 9) + 1;
  const TARA_NAMES = ['Janma','Sampat','Vipat','Kshema','Pratyari','Sadhaka','Vadha','Mitra','Atimitra'];
  const inauspicious = [3, 5, 7];
  return { tara, name: TARA_NAMES[tara - 1], auspicious: !inauspicious.includes(tara) };
}

// Chandra Bala — count muhurta moon sign from birth moon sign
// Good positions: 1, 3, 6, 7, 10, 11
function getChandraBala(birthRashi: number, muhurtaMoonSign: number): boolean {
  const pos = ((muhurtaMoonSign - birthRashi + 12) % 12) + 1;
  return [1, 3, 6, 7, 10, 11].includes(pos);
}

/**
 * Scan a date range and return scored time windows
 */
export function scanDateRange(options: ScanOptions): ScoredTimeWindow[] {
  const { startDate, endDate, activity, lat, lng, tz, birthNakshatra, birthRashi } = options;
  const rules = getExtendedActivity(activity);
  if (!rules) return [];

  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ey, em, ed] = endDate.split('-').map(Number);

  const startD = new Date(sy, sm - 1, sd);
  const endD = new Date(ey, em - 1, ed);
  const windows: ScoredTimeWindow[] = [];

  // Iterate each day
  const current = new Date(startD);
  while (current <= endD) {
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    const day = current.getDate();

    const jdNoon = dateToJD(year, month, day, 12 - tz);
    const sunriseUT = approximateSunriseSafe(jdNoon, lat, lng);
    const sunsetUT = approximateSunsetSafe(jdNoon, lat, lng);

    // Get panchang snapshot at sunrise
    const jdSunrise = dateToJD(year, month, day, sunriseUT);
    const snap = getPanchangSnapshot(jdSunrise, lat, lng);

    // 3 time windows: divide daylight into 3 equal parts (sunrise to sunset)
    // Cross-day UT normalization (see V2 scanner comment)
    let sunriseLocal = sunriseUT + tz;
    const sunsetLocal = sunsetUT + tz;
    if (sunriseLocal > 24) sunriseLocal -= 24;
    const dayLen = sunsetLocal - sunriseLocal;
    const third = dayLen / 3;
    const timeSlots = [
      { startH: sunriseLocal, endH: sunriseLocal + third, label: 'Morning' },
      { startH: sunriseLocal + third, endH: sunriseLocal + 2 * third, label: 'Midday' },
      { startH: sunriseLocal + 2 * third, endH: sunsetLocal, label: 'Afternoon' },
    ];

    for (const slot of timeSlots) {
      const midH = (slot.startH + slot.endH) / 2;

      // Score each factor
      const panchang = scorePanchangFactors(snap, rules);
      const transit = scoreTransitFactors(jdNoon, rules);
      const timing = scoreTimingFactors(
        jdNoon, midH, snap.weekday, sunriseUT, sunsetUT, tz, rules,
      );

      const breakdown: ScoreBreakdown = {
        panchangScore: panchang.score,
        transitScore: transit.score,
        timingScore: timing.score,
        personalScore: 0, // Without birth data
      };

      const totalScore = breakdown.panchangScore + breakdown.transitScore
        + breakdown.timingScore + breakdown.personalScore;

      // Only include windows scoring >= 40
      if (totalScore >= 40) {
        const allFactors = [...panchang.factors, ...transit.factors, ...timing.factors];

        // Panchanga Shuddhi — count favorable panchanga elements (0-5)
        let shuddhi = 0;
        if (!rules.avoidTithis.includes(snap.tithi)) shuddhi++; // Tithi clean
        if (rules.goodNakshatras.includes(snap.nakshatra)) shuddhi++; // Nakshatra favorable
        if (snap.yoga >= 1 && snap.yoga <= 15) shuddhi++; // Yoga — first 15 are broadly auspicious
        if (snap.karana >= 1 && snap.karana <= 7) shuddhi++; // Karana — Chara karanas
        if (rules.goodWeekdays.includes(snap.weekday)) shuddhi++; // Vara favorable

        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // Tara Bala and Chandra Bala (personal factors, require birth data)
        const taraBala = birthNakshatra && birthNakshatra > 0
          ? getTaraBala(birthNakshatra, snap.nakshatra)
          : undefined;
        const chandraBala = birthRashi && birthRashi > 0
          ? getChandraBala(birthRashi, snap.moonSign)
          : undefined;

        windows.push({
          date: dateStr,
          startTime: formatHour(slot.startH),
          endTime: formatHour(slot.endH),
          totalScore,
          breakdown,
          keyFactors: allFactors.slice(0, 5), // Top 5 factors
          panchangaShuddhi: shuddhi,
          taraBala,
          chandraBala,
        });
      }
    }

    current.setDate(current.getDate() + 1);
  }

  // Sort by score descending, return top 20
  windows.sort((a, b) => b.totalScore - a.totalScore);
  return windows.slice(0, 20);
}

function formatHour(h: number): string {
  const hh = Math.floor(h) % 24;
  const mm = Math.floor((h - Math.floor(h)) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

// ─── V2 Scanner ──────────────────────────────────────────────────────────────

const TITHI_NAMES = [
  '', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya',
];

const NAKSHATRA_NAMES = [
  '', 'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
  'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const YOGA_NAMES = [
  '', 'Vishkambha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarman', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti',
];

const KARANA_NAMES = [
  '', 'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija',
  'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna',
];

export interface ScanV2Window {
  date: string;
  timeSlot: number;
  startTime: string;
  endTime: string;
  score: number;        // 0-100 normalized
  rawScore: number;
  breakdown: DetailBreakdown;
  inauspiciousPeriods: InauspiciousPeriod[];
  panchangContext: {
    tithiName: string;
    nakshatraName: string;
    yogaName: string;
    karanaName: string;
    paksha: 'shukla' | 'krishna';
  };
  taraBala?: { tara: number; name: string; auspicious: boolean };
  chandraBala?: boolean;
}

/**
 * Scan a date range with configurable window size and return ALL windows.
 * V2 — supports inauspicious periods, dasha harmony, and DetailBreakdown.
 */
export function scanDateRangeV2(options: ScanOptionsV2): ScanV2Window[] {
  const {
    startDate, endDate, activity, lat, lng, tz,
    windowMinutes, preSunriseHours, postSunsetHours,
    birthNakshatra, birthRashi, dashaLords,
  } = options;

  const rules = getExtendedActivity(activity);
  if (!rules) return [];

  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ey, em, ed] = endDate.split('-').map(Number);

  const startD = new Date(Date.UTC(sy, sm - 1, sd));
  const endD = new Date(Date.UTC(ey, em - 1, ed));
  const windows: ScanV2Window[] = [];

  const hasPersonal = !!(birthNakshatra && birthNakshatra > 0) || !!(birthRashi && birthRashi > 0);
  const hasDasha = !!dashaLords;

  // Max raw score for normalization — includes lagna component
  const maxRaw = 75 // panchang(25) + transit(25) + timing(25)
    + 8               // lagna (Muhurta Chintamani: most powerful single factor)
    + (hasPersonal ? 20 : 0)  // taraBala(10) + chandraBala(10)
    + (hasDasha ? 10 : 0)     // dashaHarmony
    + 10;                      // inauspicious (10 = no penalty)

  // Samskaras that require Venus/Jupiter non-combustion (MC + Dharmasindhu)
  const COMBUSTION_ACTIVITIES = new Set<string>([
    'marriage', 'engagement', 'griha_pravesh', 'upanayana', 'namakarana', 'mundan',
  ]);

  const current = new Date(startD);
  while (current <= endD) {
    const year = current.getUTCFullYear();
    const month = current.getUTCMonth() + 1;
    const day = current.getUTCDate();

    const jdNoon = dateToJD(year, month, day, 12 - tz);
    const sunriseUT = approximateSunriseSafe(jdNoon, lat, lng);
    const sunsetUT = approximateSunsetSafe(jdNoon, lat, lng);

    // ── Per-day hard veto: Venus/Jupiter combustion ──────────────
    // Muhurta Chintamani + Dharmasindhu: Samskaras forbidden when
    // Shukra (Venus) or Guru (Jupiter) is combust.
    // Checked once per day (combustion doesn't change within hours).
    if (COMBUSTION_ACTIVITIES.has(activity)) {
      const combust = checkVivahCombustion(jdNoon);
      if (combust.vetoed) {
        current.setUTCDate(current.getUTCDate() + 1);
        continue; // Skip entire day
      }
    }

    // Local time range: pre-sunrise to post-sunset
    // Cross-day UT normalization: for eastern timezones (IST=+5.5, JST=+9),
    // sunrise UT can be ~23:58 (previous UT day). Adding tz gives >24.
    // Normalize to same-day local time by subtracting 24 when needed.
    let sunriseLocal = sunriseUT + tz;
    const sunsetLocal = sunsetUT + tz;
    if (sunriseLocal > 24) sunriseLocal -= 24;
    const rangeStartLocal = sunriseLocal - preSunriseHours;
    const rangeEndLocal = sunsetLocal + postSunsetHours;

    // Generate windows of windowMinutes duration
    const stepHours = windowMinutes / 60;
    let slotIndex = 0;

    for (let startH = rangeStartLocal; startH + stepHours <= rangeEndLocal + 0.001; startH += stepHours) {
      const endH = startH + stepHours;
      const midH = (startH + endH) / 2;

      // Compute JD at window midpoint (convert local hour back to UT)
      const midUT = midH - tz;
      const jdMid = jdNoon + (midUT - (12 - tz)) / 24;

      // Panchang snapshot at midpoint
      const snap = getPanchangSnapshot(jdMid, lat, lng);

      // ── Hard Vetoes ──────────────────────────────────────────
      // Nakshatra hard veto: Muhurta Chintamani + Jyotirnibandha.
      // Strong textual consensus — no compensation possible.
      let hardVetoed = false;
      if (rules.hardAvoidNakshatras?.includes(snap.nakshatra)) hardVetoed = true;

      if (hardVetoed) {
        slotIndex++;
        continue;
      }

      // ── Lagna Scoring ─────────────────────────────────────────
      // MC: "A properly chosen lagna removes all defects."
      // Lagna changes every ~2 hours, so scored per window.
      const lagna = scoreLagna(jdMid, lat, lng, activity);

      // ── Krishna Paksha conditional logic ──────────────────────
      // Not a hard veto. Penalty depends on nakshatra + lagna quality.
      const windowPaksha: 'shukla' | 'krishna' = snap.tithi <= 15 ? 'shukla' : 'krishna';
      const nakshatraIsGood = rules.goodNakshatras.includes(snap.nakshatra);
      const krishnaAdj = krishnaPakshaAdjustment(
        windowPaksha === 'krishna', nakshatraIsGood, lagna.score,
      );

      // Score panchang factors (0-25, with subScores)
      const panchang = scorePanchangFactors(snap, rules);
      // Score transit factors (0-25)
      const transit = scoreTransitFactors(jdNoon, rules);
      // Score timing factors (0-25)
      const timing = scoreTimingFactors(
        jdNoon, midH, snap.weekday, sunriseUT, sunsetUT, tz, rules,
      );

      // Inauspicious period detection
      const windowStartUT = startH - tz;
      const windowEndUT = endH - tz;
      const inauspiciousPeriods = computeInauspiciousForWindow(
        windowStartUT, windowEndUT,
        sunriseUT, sunsetUT,
        snap.weekday, snap.nakshatra,
        jdMid, tz,
      );
      const inauspiciousScore = computeInauspiciousPenalty(inauspiciousPeriods);

      // Tara Bala (0 or 10)
      let taraScore = 0;
      let taraBalaResult: { tara: number; name: string; auspicious: boolean } | undefined;
      if (birthNakshatra && birthNakshatra > 0) {
        taraBalaResult = getTaraBala(birthNakshatra, snap.nakshatra);
        taraScore = taraBalaResult.auspicious ? 10 : 0;
      }

      // Chandra Bala (0 or 10)
      let chandraScore = 0;
      let chandraBalaResult: boolean | undefined;
      if (birthRashi && birthRashi > 0) {
        chandraBalaResult = getChandraBala(birthRashi, snap.moonSign);
        chandraScore = chandraBalaResult ? 10 : 0;
      }

      // Dasha harmony (0-10)
      let dashaScore = 0;
      if (dashaLords) {
        const dashaResult = scoreDashaHarmony(dashaLords, rules);
        dashaScore = dashaResult.score;
      }

      // Raw score — includes lagna (MC's most powerful factor) and Krishna adj
      const rawScore = panchang.score + transit.score + timing.score
        + Math.max(0, lagna.score)  // Lagna: 0-8 (negative lagnas clamp to 0)
        + krishnaAdj               // Krishna Paksha conditional: 0 to -6
        + (hasPersonal ? taraScore + chandraScore : 0)
        + (hasDasha ? dashaScore : 0)
        + inauspiciousScore;

      // Normalize to 0-100
      const score = Math.round(Math.max(0, Math.min(100, (rawScore / maxRaw) * 100)));

      // Build DetailBreakdown — map sub-scores to display ranges
      const sub = panchang.subScores;
      const breakdown: DetailBreakdown = {
        // tithi sub-score range: -5..8 → normalized 0..20
        tithi: Math.max(0, Math.round(((sub.tithi + 5) / 13) * 20)),
        // nakshatra sub-score range: -5..8 → normalized 0..20
        nakshatra: Math.max(0, Math.round(((sub.nakshatra + 5) / 13) * 20)),
        // yoga sub-score range: -3..4 → normalized 0..20
        yoga: Math.max(0, Math.round(((sub.yoga + 3) / 7) * 20)),
        // karana sub-score range: -5..2 → normalized 0..10
        karana: Math.max(0, Math.round(((sub.karana + 5) / 7) * 10)),
        // lagna score: -3..8 → clamped 0..8
        lagna: Math.max(0, lagna.score),
        taraBala: taraScore,
        chandraBala: chandraScore,
        dashaHarmony: dashaScore,
        inauspicious: inauspiciousScore,
      };

      // Panchang context — English names for now (client resolves locale)
      const pakshaRelTithi = snap.tithi > 15 ? snap.tithi - 15 : snap.tithi;
      const paksha: 'shukla' | 'krishna' = snap.tithi <= 15 ? 'shukla' : 'krishna';

      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      windows.push({
        date: dateStr,
        timeSlot: slotIndex,
        startTime: formatHour(startH),
        endTime: formatHour(endH),
        score,
        rawScore,
        breakdown,
        inauspiciousPeriods,
        panchangContext: {
          tithiName: TITHI_NAMES[pakshaRelTithi] || `Tithi ${snap.tithi}`,
          nakshatraName: NAKSHATRA_NAMES[snap.nakshatra] || `Nakshatra ${snap.nakshatra}`,
          yogaName: YOGA_NAMES[snap.yoga] || `Yoga ${snap.yoga}`,
          karanaName: KARANA_NAMES[snap.karana] || `Karana ${snap.karana}`,
          paksha,
        },
        taraBala: taraBalaResult,
        chandraBala: chandraBalaResult,
      });

      slotIndex++;
    }

    current.setUTCDate(current.getUTCDate() + 1);
  }

  return windows;
}
