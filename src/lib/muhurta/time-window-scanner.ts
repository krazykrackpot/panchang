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
}

/**
 * Scan a date range and return scored time windows
 */
export function scanDateRange(options: ScanOptions): ScoredTimeWindow[] {
  const { startDate, endDate, activity, lat, lng, tz } = options;
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

        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        windows.push({
          date: dateStr,
          startTime: formatHour(slot.startH),
          endTime: formatHour(slot.endH),
          totalScore,
          breakdown,
          keyFactors: allFactors.slice(0, 5), // Top 5 factors
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
