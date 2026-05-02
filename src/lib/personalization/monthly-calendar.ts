/**
 * Monthly Personal Calendar — orchestrates per-day quality scoring.
 *
 * Combines:
 *   - Tara Bala + Chandra Bala (personal, from birth nakshatra/rashi)
 *   - Universal panchang quality (tithi, yoga, karana auspiciousness)
 *   - Key dates overlay (dasha transitions, slow planet ingresses)
 *
 * Produces a 28-31 day array with quality labels and scores.
 */

import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';
import { computePersonalizedDay } from './personal-panchang';
import type { UserSnapshot, PersonalizedDay } from './types';
import { generateDailyVibe, type DailyVibeData } from '@/lib/shareable/daily-vibe';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { VARA_QUALITY } from '@/lib/constants/grahas';
import type { PanchangData } from '@/types/panchang';

export interface MonthDayResult {
  /** Date string YYYY-MM-DD */
  date: string;
  /** Day of month 1-31 */
  day: number;
  /** Day of week 0=Sun, 6=Sat */
  weekday: number;
  /** Personal day quality */
  quality: 'excellent' | 'good' | 'neutral' | 'caution' | 'challenging';
  /** Combined score 0-100 (higher = better) */
  score: number;
  /** Tara Bala result */
  taraBala: { number: number; name: string; favorable: boolean };
  /** Chandra Bala result */
  chandraBala: { house: number; favorable: boolean };
  /** Universal panchang energy score 0-100 */
  panchangEnergy: number;
  /** Tithi name at sunrise */
  tithi: string;
  /** Nakshatra name at sunrise */
  nakshatra: string;
  /** Vara quality */
  varaQuality: string;
  /** Vara best for */
  varaBestFor: string;
  /** Key highlights for the day */
  highlights: string[];
  /** Is today */
  isToday: boolean;
}

export interface MonthCalendarResult {
  year: number;
  month: number; // 1-12
  days: MonthDayResult[];
  /** Best 3 days of the month */
  bestDays: MonthDayResult[];
  /** Worst 3 days of the month */
  worstDays: MonthDayResult[];
  /** Month summary stats */
  stats: {
    excellent: number;
    good: number;
    neutral: number;
    caution: number;
    challenging: number;
  };
}

/**
 * Generate a personalized monthly calendar.
 *
 * @param snapshot User's birth chart snapshot (from saved kundali)
 * @param lat Location latitude
 * @param lng Location longitude
 * @param timezone IANA timezone string
 * @param year Target year
 * @param month Target month (1-12)
 * @param locale For text output
 */
export function generateMonthlyCalendar(
  snapshot: UserSnapshot,
  lat: number,
  lng: number,
  timezone: string,
  year: number,
  month: number,
  locale: string,
): MonthCalendarResult {
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const days: MonthDayResult[] = [];
  const stats = { excellent: 0, good: 0, neutral: 0, caution: 0, challenging: 0 };

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(year, month - 1, d);
    const weekday = dateObj.getDay(); // 0=Sun

    // Compute panchang for this day
    const tzOffset = getUTCOffsetForDate(year, month, d, timezone);
    let panchang: PanchangData;
    try {
      panchang = computePanchang({
        year, month, day: d, lat, lng, tzOffset, timezone, locationName: '',
      });
    } catch {
      // Skip days where panchang fails (shouldn't happen)
      continue;
    }

    // Personal day quality (Tara Bala + Chandra Bala)
    const todayNakshatra = panchang.nakshatra?.id || 1;
    const todayMoonSign = typeof panchang.moonSign === 'object' ? panchang.moonSign?.rashi || 1 : (panchang.moonSign || 1);

    let personal: PersonalizedDay | null = null;
    try {
      personal = computePersonalizedDay(snapshot, todayNakshatra, todayMoonSign);
    } catch {
      // Fallback if personalization fails
    }

    // Universal panchang energy
    let vibe: DailyVibeData | null = null;
    try {
      vibe = generateDailyVibe(panchang, locale);
    } catch {
      // Non-critical
    }

    // Vara quality score (Muhurta Chintamani classification)
    const varaQ = VARA_QUALITY[weekday];
    const varaScore = varaQ?.score ?? 50;

    // Combine scores: 50% personal + 30% universal panchang + 20% vara
    const personalScore = personal ? qualityToScore(personal.dayQuality) : 50;
    const universalScore = vibe?.energyScore ?? 50;
    const combinedScore = Math.round(personalScore * 0.5 + universalScore * 0.3 + varaScore * 0.2);

    // Derive quality label from combined score
    const quality = scoreToQuality(combinedScore);

    // Build highlights
    const highlights: string[] = [];
    if (personal?.taraBala.isFavorable) highlights.push(`Tara: ${personal.taraBala.taraName.en}`);
    if (personal?.chandraBala.isFavorable) highlights.push('Chandra Bala: Favorable');
    if (vibe?.bestFor && vibe.bestFor.length > 0) highlights.push(`Best for: ${vibe.bestFor[0]}`);
    if (panchang.specialYogas?.some(sy => sy.isActive)) {
      const activeYoga = panchang.specialYogas.find(sy => sy.isActive);
      if (activeYoga) highlights.push(activeYoga.name.en);
    }

    const dayResult: MonthDayResult = {
      date: dateStr,
      day: d,
      weekday,
      quality,
      score: combinedScore,
      taraBala: personal
        ? { number: personal.taraBala.taraNumber, name: personal.taraBala.taraName.en, favorable: personal.taraBala.isFavorable }
        : { number: 0, name: '', favorable: false },
      chandraBala: personal
        ? { house: personal.chandraBala.houseFromMoon, favorable: personal.chandraBala.isFavorable }
        : { house: 0, favorable: false },
      panchangEnergy: universalScore,
      varaQuality: varaQ?.quality.en || 'Mixed',
      varaBestFor: varaQ?.bestFor.en || '',
      tithi: panchang.tithi?.name?.en || '',
      nakshatra: panchang.nakshatra?.name?.en || '',
      highlights,
      isToday: dateStr === todayStr,
    };

    days.push(dayResult);
    stats[quality]++;
  }

  // Sort to find best/worst
  const sorted = [...days].sort((a, b) => b.score - a.score);

  return {
    year,
    month,
    days,
    bestDays: sorted.slice(0, 3),
    worstDays: sorted.slice(-3).reverse(),
    stats,
  };
}

function qualityToScore(q: string): number {
  switch (q) {
    case 'excellent': return 90;
    case 'good': return 70;
    case 'neutral': return 50;
    case 'caution': return 30;
    case 'challenging': return 15;
    default: return 50;
  }
}

function scoreToQuality(score: number): MonthDayResult['quality'] {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'neutral';
  if (score >= 25) return 'caution';
  return 'challenging';
}
