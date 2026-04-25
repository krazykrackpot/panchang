/**
 * Patyayini Dasha — Degree-traversed proportional annual periods
 *
 * Each planet's period is proportional to the degrees it has traversed in its
 * current sign at the time of the solar return. Planets that have covered more
 * of their sign receive longer sub-periods.
 *
 * Classical basis: Tajika Nilakanthi Ch. on annual sub-periods.
 * Formula: days_for_planet = (degrees_traversed_by_planet / total_degrees) × 365.25
 * Ordering: descending by degrees traversed.
 *
 * Date arithmetic: all date computation uses milliseconds (Lesson P).
 */

import type { LocaleText } from '@/types/panchang';

const PLANET_NAMES: Record<number, LocaleText> = {
  0: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', bn: 'সূর্য' },
  1: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', bn: 'চন্দ্র' },
  2: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः', ta: 'செவ்வாய்', bn: 'মঙ্গল' },
  3: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', ta: 'புதன்', bn: 'বুধ' },
  4: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः', ta: 'குரு', bn: 'বৃহস্পতি' },
  5: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', ta: 'சுக்கிரன்', bn: 'শுக்கிரன்' },
  6: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', ta: 'சனி', bn: 'শনি' },
  7: { en: 'Rahu', hi: 'राहु', sa: 'राहुः', ta: 'ராகு', bn: 'রাহু' },
  8: { en: 'Ketu', hi: 'केतु', sa: 'केतुः', ta: 'கேது', bn: 'কேது' },
};

export interface PatyayiniDashaPeriod {
  planetId: number;
  planet: string;
  planetName: LocaleText;
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
  days: number;
  degreesTraversed: number;
}

/**
 * Compute Patyayini Dasha periods.
 *
 * @param solarReturnDate  ISO date-string or Date of the annual solar return
 * @param planets          Array of planet positions from generateKundali / getPlanetaryPositions.
 *                         Each entry must have { id: number; longitude: number } where
 *                         longitude is the sidereal degree (0-360).
 */
export function computePatyayiniDasha(
  solarReturnDate: string | Date,
  planets: Array<{ id: number; longitude: number }>,
): PatyayiniDashaPeriod[] {
  const YEAR_DAYS = 365.25;
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  // Degrees traversed in current sign = longitude % 30
  // Use only the 9 standard planets (id 0-8); Rahu/Ketu typically have 0-based longitude
  const entries = planets
    .filter(p => p.id >= 0 && p.id <= 8 && PLANET_NAMES[p.id])
    .map(p => ({
      id: p.id,
      degreesTraversed: p.longitude % 30,
    }));

  // Guard: if all zeros, distribute equally
  const totalDegrees = entries.reduce((sum, e) => sum + e.degreesTraversed, 0);
  const safeTotalDegrees = totalDegrees < 0.001 ? entries.length * 15 : totalDegrees;

  // Sort descending by degrees traversed
  const sorted = [...entries].sort((a, b) => b.degreesTraversed - a.degreesTraversed);

  const srTime = typeof solarReturnDate === 'string'
    ? new Date(solarReturnDate).getTime()
    : solarReturnDate.getTime();

  const periods: PatyayiniDashaPeriod[] = [];
  let cursor = srTime;

  for (const { id, degreesTraversed } of sorted) {
    const safeDeg = totalDegrees < 0.001 ? 15 : degreesTraversed;
    const days = (safeDeg / safeTotalDegrees) * YEAR_DAYS;
    const endTime = cursor + days * MS_PER_DAY;

    periods.push({
      planetId: id,
      planet: PLANET_NAMES[id].en,
      planetName: PLANET_NAMES[id],
      startDate: msToIsoDate(cursor),
      endDate: msToIsoDate(endTime),
      days: Math.round(days),
      degreesTraversed: parseFloat(degreesTraversed.toFixed(2)),
    });

    cursor = endTime;
  }

  return periods;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function msToIsoDate(ms: number): string {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
