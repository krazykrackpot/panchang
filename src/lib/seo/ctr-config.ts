// src/lib/seo/ctr-config.ts
//
// CTR Optimisation — Title & Description formulas
// Spec: docs/superpowers/specs/2026-05-12-ctr-optimisation-design.md
//
// CONFIGURABLE: Edit these functions to change SERP appearance.
// All page types consume these — no formulas are hardcoded in page files.

/** Short date: "May 8" */
export function fmtShort(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** Long date: "May 8, 2027" */
export function fmtLong(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/** Day of week: "Saturday" */
export function fmtDay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
}

/** Hindi short date: "8 मई" */
export function fmtShortHi(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', timeZone: 'UTC' });
}

/** Hindi day of week: "शनिवार" */
export function fmtDayHi(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('hi-IN', { weekday: 'long', timeZone: 'UTC' });
}

// ═══════════════════════════════════════════════
// FESTIVAL TITLES — Canonical (no city)
// ═══════════════════════════════════════════════

/**
 * English title with puja time when available:
 * WITH time:    "Ganesh Chaturthi 2027: Sep 4 | Puja Time 11:04 AM–1:36 PM"
 * WITHOUT time: "Ganesh Chaturthi 2027: Sep 4 (Saturday) – Puja Muhurat"
 * ≤65 chars target. Brand suffix added by root layout template.
 */
export function festivalCanonicalTitle(
  name: string, year: string, dateStr: string, hasMuhurat: boolean,
  pujaTimeStr?: string | null
): string {
  const short = fmtShort(dateStr);
  const day = fmtDay(dateStr);
  if (pujaTimeStr) {
    // Compact format with actual puja time — high CTR for "time" queries
    return `${name} ${year}: ${short} | Puja Time ${pujaTimeStr}`;
  }
  const suffix = hasMuhurat ? 'Puja Muhurat' : 'Date & Muhurat';
  return `${name} ${year} Date: ${short} (${day}) – ${suffix}`;
}

/**
 * Hindi title with puja time when available:
 * WITH time:    "गणेश चतुर्थी 2027: 4 सितम्बर | पूजा समय 11:04 AM–1:36 PM"
 * WITHOUT time: "गणेश चतुर्थी 2027 तिथि: 4 सितम्बर (शनिवार) – पूजा मुहूर्त"
 */
export function festivalCanonicalTitleHi(
  name: string, year: string, dateStr: string, hasMuhurat: boolean,
  pujaTimeStr?: string | null
): string {
  const short = fmtShortHi(dateStr);
  const day = fmtDayHi(dateStr);
  if (pujaTimeStr) {
    return `${name} ${year}: ${short} | पूजा समय ${pujaTimeStr}`;
  }
  const suffix = hasMuhurat ? 'पूजा मुहूर्त' : 'तिथि व मुहूर्त';
  return `${name} ${year} तिथि: ${short} (${day}) – ${suffix}`;
}

/**
 * English description with day of week, puja time, and CTA:
 * "Ganesh Chaturthi 2027 is on Saturday, Sep 4. Puja muhurat: 11:22 AM–1:52 PM. Vidhi, mantras & samagri checklist. Free city-wise timings for 800+ cities."
 */
export function festivalCanonicalDesc(
  name: string, dateStr: string, pujaTime: string | null
): string {
  const long = fmtLong(dateStr);
  const day = fmtDay(dateStr);
  const puja = pujaTime ? ` Puja muhurat: ${pujaTime}.` : '';
  return `${name} is on ${day}, ${long}.${puja} Vidhi, mantras & samagri checklist. Free city-wise timings for 800+ cities.`.slice(0, 160);
}

// ═══════════════════════════════════════════════
// MUHURTA TITLES
// ═══════════════════════════════════════════════

/**
 * English: "Travel Muhurat 2026: Next May 15 (Friday)"
 * Brand suffix added by root layout template.
 *
 * IMPORTANT: `nextDateStr` must be the NEXT FUTURE date, not dates2026[0].
 */
export function muhurtaTitle(name: string, year: number, nextDateStr: string | null): string {
  if (!nextDateStr) return `${name} ${year} – Auspicious Dates`;
  const short = fmtShort(nextDateStr);
  const day = fmtDay(nextDateStr);
  return `${name} ${year}: Next ${short} (${day})`;
}

/**
 * Hindi: "यात्रा मुहूर्त 2026: अगला 15 मई (शुक्रवार)"
 */
export function muhurtaTitleHi(name: string, year: number, nextDateStr: string | null): string {
  if (!nextDateStr) return `${name} ${year} – शुभ तिथियाँ`;
  const short = fmtShortHi(nextDateStr);
  const day = fmtDayHi(nextDateStr);
  return `${name} ${year}: अगला ${short} (${day})`;
}

/**
 * Muhurta description: "Next travel muhurat: May 15, 2026 (Friday, Pushya nakshatra). 48+ auspicious dates for 2026. Free, updated daily."
 */
export function muhurtaDesc(
  nameEn: string, year: number, nextDateStr: string | null,
  nakshatra: string | null, totalDates: number
): string {
  if (!nextDateStr) {
    return `${nameEn} ${year}: ${totalDates}+ auspicious dates with nakshatra, tithi & planetary analysis. Free, no signup.`.slice(0, 155);
  }
  const long = fmtLong(nextDateStr);
  const day = fmtDay(nextDateStr);
  const nak = nakshatra ? `, ${nakshatra} nakshatra` : '';
  return `Next ${nameEn.toLowerCase()}: ${long} (${day}${nak}). ${totalDates}+ auspicious dates for ${year}. Free, updated daily.`.slice(0, 155);
}

// ═══════════════════════════════════════════════
// MUHURTA CITY-MONTH TITLES
// ═══════════════════════════════════════════════

/**
 * "Property Muhurat May 2026 Bangalore – 8 Dates"
 */
export function muhurtaCityTitle(
  name: string, month: string, year: number, city: string, dateCount: number
): string {
  return `${name} ${month} ${year} ${city} – ${dateCount} Dates`;
}

export function muhurtaCityDesc(
  nameEn: string, city: string, month: string, year: number,
  nextDateStr: string | null, dateCount: number
): string {
  if (!nextDateStr) {
    return `${dateCount} auspicious ${nameEn.toLowerCase()} dates in ${city} for ${month} ${year}. Tithi, nakshatra & alignment checked. Free.`.slice(0, 155);
  }
  const short = fmtShort(nextDateStr);
  const day = fmtDay(nextDateStr);
  return `${dateCount} auspicious ${nameEn.toLowerCase()} dates in ${city} for ${month} ${year}. Next: ${short} (${day}). Free.`.slice(0, 155);
}

// ═══════════════════════════════════════════════
// HELPER: Today's panchang for SEO metadata
// ═══════════════════════════════════════════════

import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

// Ujjain — reference city for India-wide SEO metadata
const SEO_REF_LAT = 23.1765;
const SEO_REF_LNG = 75.7885;
const SEO_REF_TZ = 'Asia/Kolkata';

/**
 * Compute today's panchang (Ujjain reference) for SEO metadata injection.
 * Returns null on failure — callers should fall back to static metadata.
 */
export function todayPanchangForSEO(locale: string) {
  try {
    const now = new Date();
    const tzOffset = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), SEO_REF_TZ);
    const istMs = now.getTime() + tzOffset * 3600 * 1000;
    const istDate = new Date(istMs);
    const year = istDate.getUTCFullYear();
    const month = istDate.getUTCMonth() + 1;
    const day = istDate.getUTCDate();

    const p = computePanchang({ year, month, day, lat: SEO_REF_LAT, lng: SEO_REF_LNG, tzOffset, timezone: SEO_REF_TZ });
    const dateStr = istDate.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    const isHi = locale === 'hi' || locale === 'sa';

    return { p, dateStr, isHi, year, month, day };
  } catch (err) {
    console.error('[seo] todayPanchangForSEO failed:', err);
    return null;
  }
}

// ═══════════════════════════════════════════════
// HELPER: Find next future date from a sorted array
// ═══════════════════════════════════════════════

/**
 * Given an array of { date: 'YYYY-MM-DD', ... } sorted chronologically,
 * return the first entry whose date is today or later.
 * Falls back to the last entry if all dates are past (shows the most recent).
 */
export function findNextFutureDate<T extends { date: string }>(dates: T[]): T | null {
  if (!dates || dates.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const future = dates.find(d => d.date >= today);
  return future || dates[dates.length - 1];
}
