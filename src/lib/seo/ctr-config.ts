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

/** Short day of week: "Thu" */
export function fmtDayShort(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
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
 * English title — date + day of week always shown, puja time when it fits:
 * WITH time:    "Ganesh Chaturthi 2027: Sep 4 (Thu) | Puja 11:04 AM–1:36 PM"
 * WITHOUT time: "Ganesh Chaturthi 2027: Sep 4 (Saturday) – Puja Muhurat"
 * ≤60 chars target. Brand suffix added by root layout template.
 */
export function festivalCanonicalTitle(
  name: string, year: string, dateStr: string, hasMuhurat: boolean,
  pujaTimeStr?: string | null
): string {
  const short = fmtShort(dateStr);
  const day = fmtDay(dateStr);
  const dayShort = fmtDayShort(dateStr);
  if (pujaTimeStr) {
    // Include short weekday + puja time — high CTR for "time" and "date" queries
    // "Ganesh Chaturthi 2027: Sep 4 (Thu) | Puja 11:04 AM–1:36 PM"
    const withDay = `${name} ${year}: ${short} (${dayShort}) | Puja ${pujaTimeStr}`;
    // If too long (>60), drop the day abbreviation
    if (withDay.length > 60) {
      return `${name} ${year}: ${short} | Puja ${pujaTimeStr}`;
    }
    return withDay;
  }
  const suffix = hasMuhurat ? 'Puja Muhurat' : 'Date & Muhurat';
  return `${name} ${year} Date: ${short} (${day}) – ${suffix}`;
}

/**
 * Hindi title — answers "कब है" by leading with date + weekday:
 * WITH time:    "गणेश चतुर्थी 2027 कब है: 4 सितम्बर, शनिवार | पूजा समय"
 * WITHOUT time: "गणेश चतुर्थी 2027 कब है: 4 सितम्बर, शनिवार – पूजा मुहूर्त"
 * ≤60 chars target (Devanagari chars are wider — aim shorter).
 */
export function festivalCanonicalTitleHi(
  name: string, year: string, dateStr: string, hasMuhurat: boolean,
  pujaTimeStr?: string | null
): string {
  const short = fmtShortHi(dateStr);
  const day = fmtDayHi(dateStr);
  if (pujaTimeStr) {
    // "गणेश चतुर्थी 2027 कब है: 4 सितम्बर, शनिवार | पूजा समय"
    // Drop the actual time from title (it goes in description) to keep title short
    return `${name} ${year} कब है: ${short}, ${day} | पूजा समय`;
  }
  const suffix = hasMuhurat ? 'पूजा मुहूर्त' : 'तिथि व मुहूर्त';
  return `${name} ${year} कब है: ${short}, ${day} – ${suffix}`;
}

/**
 * English description — front-loads date + day + puja time in first 100 chars:
 * "Ganesh Chaturthi 2027 is on Saturday, September 4, 2027. Puja time: 11:22 AM–1:52 PM.
 *  Vidhi, mantras & city-wise timings for 800+ cities."
 * Google shows ~155 chars; most important info must be in first 100.
 */
export function festivalCanonicalDesc(
  name: string, dateStr: string, pujaTime: string | null
): string {
  const long = fmtLong(dateStr);
  const day = fmtDay(dateStr);
  const puja = pujaTime ? ` Puja time: ${pujaTime}.` : '';
  // Front-load: date + day + puja time all within first ~100 chars
  return `${name} is on ${day}, ${long}.${puja} Vidhi, mantras & city-wise timings for 800+ cities.`.slice(0, 160);
}

/**
 * Hindi description — directly answers "कब है" with date, day, puja time:
 * "तिथि: 4 सितम्बर 2027, शनिवार। पूजा मुहूर्त: 11:22 AM–1:52 PM।
 *  गणेश चतुर्थी विधि, मंत्र व 800+ शहरों के समय।"
 * Leads with "तिथि:" for featured snippet eligibility.
 */
export function festivalCanonicalDescHi(
  name: string, year: string, dateStr: string, pujaTime: string | null
): string {
  const short = fmtShortHi(dateStr);
  const day = fmtDayHi(dateStr);
  const puja = pujaTime ? ` पूजा मुहूर्त: ${pujaTime}।` : '';
  // "तिथि:" prefix targets featured snippet for "कब है" queries
  return `तिथि: ${short} ${year}, ${day}।${puja} ${name} विधि, मंत्र व 800+ शहरों के समय।`.slice(0, 160);
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
    // Treat all Devanagari-script locales (hi, mai) the same for date formatting and isHi
    // because they share script and SERP audiences search in Devanagari.
    const isDev = locale === 'hi' || locale === 'mai' || locale === 'sa';
    const dateStr = istDate.toLocaleDateString(isDev ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    const isHi = isDev;

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

/**
 * Hindi description for muhurta pages — matches "अन्नप्राशन मुहूर्त 2026" search pattern.
 */
export function muhurtaDescHi(
  nameHi: string, year: number, nextDateStr: string | null,
  nakshatraHi: string | null, totalDates: number
): string {
  if (!nextDateStr) {
    return `${nameHi} ${year}: ${totalDates}+ शुभ तिथियाँ — नक्षत्र, तिथि व ग्रह विश्लेषण सहित। निःशुल्क, बिना पंजीकरण।`.slice(0, 155);
  }
  const short = fmtShortHi(nextDateStr);
  const day = fmtDayHi(nextDateStr);
  const nak = nakshatraHi ? `, ${nakshatraHi} नक्षत्र` : '';
  return `अगला ${nameHi}: ${short} ${year} (${day}${nak})। ${year} की ${totalDates}+ शुभ तिथियाँ। निःशुल्क, प्रतिदिन अपडेट।`.slice(0, 155);
}

