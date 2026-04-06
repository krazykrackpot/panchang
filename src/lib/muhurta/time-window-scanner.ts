/**
 * Time Window Scanner — Scans date ranges and scores each window
 */

import {
  dateToJD, approximateSunrise, approximateSunset,
} from '@/lib/ephem/astronomical';
import {
  scorePanchangFactors, scoreTransitFactors,
  scoreTimingFactors, getPanchangSnapshot,
} from './ai-recommender';
import { getExtendedActivity } from './activity-rules-extended';
import type { ScoredTimeWindow, ScoreBreakdown, ExtendedActivityId } from '@/types/muhurta-ai';
import type { Trilingual } from '@/types/panchang';

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
    const sunriseUT = approximateSunrise(jdNoon, lat, lng);
    const sunsetUT = approximateSunset(jdNoon, lat, lng);

    // Get panchang snapshot at sunrise
    const jdSunrise = dateToJD(year, month, day, sunriseUT);
    const snap = getPanchangSnapshot(jdSunrise, lat, lng);

    // 3 time windows: morning (6-10), midday (10-14), afternoon (14-18)
    const timeSlots = [
      { startH: 6 + tz, endH: 10 + tz, label: 'Morning' },
      { startH: 10 + tz, endH: 14 + tz, label: 'Midday' },
      { startH: 14 + tz, endH: 18 + tz, label: 'Afternoon' },
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
