/**
 * Inauspicious Period Computation for Muhurta Scanner
 *
 * Computes Yamaganda, Gulika Kaal, Rahu Kaal, Varjyam, and Vishti/Bhadra
 * for a given time window. Returns structured data for UI rendering.
 *
 * Yamaganda order (Sun=5→Thu=1, Fri=7, Sat=6) — Dharma Sindhu / Muhurta Chintamani
 * Gulika order (Sun=7→Sat=1) — descending
 * Rahu Kaal order [8, 2, 7, 5, 6, 4, 3] — standard
 */

import { calculateKarana } from '@/lib/ephem/astronomical';
import { RAHU_ORDER, YAMA_ORDER, GULIKA_ORDER } from '@/lib/constants/inauspicious-orders';
import { DUR_MUHURTAM_A } from '@/lib/constants/dur-muhurtam';
import { VARJYAM_GHATI, VARJYAM_GHATI_2 } from '@/lib/constants/varjyam';
import type { InauspiciousPeriod } from '@/types/muhurta-ai';

interface TimeRange {
  start: number; // hours UT
  end: number;
}

export function computeRahuKaal(sunriseUT: number, sunsetUT: number, weekday: number): TimeRange {
  const duration = (sunsetUT - sunriseUT) / 8;
  const segment = RAHU_ORDER[weekday] - 1;
  return {
    start: sunriseUT + segment * duration,
    end: sunriseUT + (segment + 1) * duration,
  };
}

export function computeYamaganda(sunriseUT: number, sunsetUT: number, weekday: number): TimeRange {
  const duration = (sunsetUT - sunriseUT) / 8;
  const segment = YAMA_ORDER[weekday] - 1;
  return {
    start: sunriseUT + segment * duration,
    end: sunriseUT + (segment + 1) * duration,
  };
}

export function computeGulikaKaal(sunriseUT: number, sunsetUT: number, weekday: number): TimeRange {
  const duration = (sunsetUT - sunriseUT) / 8;
  const segment = GULIKA_ORDER[weekday] - 1;
  return {
    start: sunriseUT + segment * duration,
    end: sunriseUT + (segment + 1) * duration,
  };
}

/**
 * Compute Dur Muhurtam windows for a day.
 * The day is divided into 15 muhurtas from sunrise to sunset.
 * Returns 1-2 TimeRange entries depending on weekday.
 *
 * Source: Kaala Prakashika (matches Prokerala, Drik Panchang).
 * Weekday: 0=Sunday (JD convention).
 */
export function computeDurMuhurtam(sunriseUT: number, sunsetUT: number, weekday: number): TimeRange[] {
  const muhurtaDuration = (sunsetUT - sunriseUT) / 15;
  const indices = DUR_MUHURTAM_A[weekday] || [7];
  return indices.map(idx => ({
    start: sunriseUT + idx * muhurtaDuration,
    end: sunriseUT + (idx + 1) * muhurtaDuration,
  }));
}

/**
 * Check if Moon's current sidereal position falls within Varjyam.
 *
 * Varjyam is defined by ghati offsets within a nakshatra. Since 1 ghati = 1/60th
 * of the nakshatra's extent (13.333°), we convert Moon's degree position within
 * its current nakshatra to a ghati position and check against the table.
 *
 * Accuracy: ±5-10 min (Moon's speed varies ±10% from mean), within the ±12 min
 * accuracy ceiling of the classical integer-ghati tables (Prashna Marga Ch.7).
 *
 * @param moonSid - Moon's sidereal longitude in degrees
 * @returns true if currently in Varjyam window
 */
export function isVarjyamActive(moonSid: number): boolean {
  const nakExtent = 360 / 27; // 13.333°
  const degInNak = ((moonSid % nakExtent) + nakExtent) % nakExtent;
  const ghatiPosition = (degInNak / nakExtent) * 60;
  const nakIdx = Math.floor(((moonSid % 360 + 360) % 360) / nakExtent); // 0-26

  if (nakIdx < 0 || nakIdx >= 27) return false;

  // Primary Varjyam window (4 ghatis wide)
  const v1Start = VARJYAM_GHATI[nakIdx];
  if (ghatiPosition >= v1Start && ghatiPosition < v1Start + 4) return true;

  // Secondary Varjyam (dual Thyajyam — only Mula)
  const v2Start = VARJYAM_GHATI_2[nakIdx];
  if (v2Start >= 0 && ghatiPosition >= v2Start && ghatiPosition < v2Start + 4) return true;

  return false;
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function formatHour(h: number, tz: number): string {
  const local = h + tz;
  const hh = Math.floor(((local % 24) + 24) % 24);
  const mm = Math.floor((local - Math.floor(local)) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/**
 * Compute all inauspicious periods and check which are active during a window.
 *
 * @param windowStartUT - window start in hours UT (from midnight)
 * @param windowEndUT - window end in hours UT
 * @param sunriseUT - sunrise in hours UT
 * @param sunsetUT - sunset in hours UT
 * @param weekday - 0=Sunday (matches Math.floor(jd + 1.5) % 7 convention)
 * @param nakshatra - current nakshatra number 1-27 (for Vishti check via karana)
 * @param jd - Julian Day for karana computation
 * @param tz - timezone offset in hours
 */
export function computeInauspiciousForWindow(
  windowStartUT: number,
  windowEndUT: number,
  sunriseUT: number,
  sunsetUT: number,
  weekday: number,
  nakshatra: number,
  jd: number,
  tz: number,
  moonSid?: number,
): InauspiciousPeriod[] {
  const rahuKaal = computeRahuKaal(sunriseUT, sunsetUT, weekday);
  const yamaganda = computeYamaganda(sunriseUT, sunsetUT, weekday);
  const gulikaKaal = computeGulikaKaal(sunriseUT, sunsetUT, weekday);

  // Vishti/Bhadra — check karana at window midpoint
  // calculateKarana returns 1-11; karana 7 = Vishti (Bhadra), the inauspicious moving karana
  const midUT = (windowStartUT + windowEndUT) / 2;
  const midJD = jd + (midUT - 12) / 24;
  const karana = calculateKarana(midJD);
  const isVishti = karana === 7;

  const periods: InauspiciousPeriod[] = [
    {
      name: 'Rahu Kaal',
      startTime: formatHour(rahuKaal.start, tz),
      endTime: formatHour(rahuKaal.end, tz),
      active: rangesOverlap(windowStartUT, windowEndUT, rahuKaal.start, rahuKaal.end),
    },
    {
      name: 'Yamaganda',
      startTime: formatHour(yamaganda.start, tz),
      endTime: formatHour(yamaganda.end, tz),
      active: rangesOverlap(windowStartUT, windowEndUT, yamaganda.start, yamaganda.end),
    },
    {
      name: 'Gulika Kaal',
      startTime: formatHour(gulikaKaal.start, tz),
      endTime: formatHour(gulikaKaal.end, tz),
      active: rangesOverlap(windowStartUT, windowEndUT, gulikaKaal.start, gulikaKaal.end),
    },
  ];

  if (isVishti) {
    periods.push({
      name: 'Vishti (Bhadra)',
      startTime: formatHour(windowStartUT, tz),
      endTime: formatHour(windowEndUT, tz),
      active: true,
    });
  }

  // Dur Muhurtam — inauspicious muhurta windows (1-2 per day)
  const durWindows = computeDurMuhurtam(sunriseUT, sunsetUT, weekday);
  for (const dw of durWindows) {
    if (rangesOverlap(windowStartUT, windowEndUT, dw.start, dw.end)) {
      periods.push({
        name: 'Dur Muhurtam',
        startTime: formatHour(dw.start, tz),
        endTime: formatHour(dw.end, tz),
        active: true,
      });
      break; // One penalty even if window overlaps two Dur Muhurtam slots
    }
  }

  // Varjyam — "time of poison" from nakshatra-based ghati offsets
  if (moonSid !== undefined && isVarjyamActive(moonSid)) {
    periods.push({
      name: 'Varjyam',
      startTime: formatHour(windowStartUT, tz),
      endTime: formatHour(windowEndUT, tz),
      active: true,
    });
  }

  return periods;
}

/**
 * Compute inauspicious penalty score (0-10, higher = less penalty).
 * Each active inauspicious period deducts points.
 *
 * Deductions: Rahu Kaal = 4, Yamaganda = 3, Gulika Kaal = 2, Vishti (Bhadra) = 4
 * Clamped to [0, 10].
 */
export function computeInauspiciousPenalty(periods: InauspiciousPeriod[]): number {
  let penalty = 0;
  for (const p of periods) {
    if (!p.active) continue;
    switch (p.name) {
      case 'Rahu Kaal': penalty += 4; break;
      case 'Yamaganda': penalty += 3; break;
      case 'Gulika Kaal': penalty += 2; break;
      case 'Vishti (Bhadra)': penalty += 1; break; // Reduced: main penalty (-5) is in scorePanchangFactors
      case 'Dur Muhurtam': penalty += 3; break;
      case 'Varjyam': penalty += 3; break;
    }
  }
  return Math.max(0, 10 - penalty);
}
