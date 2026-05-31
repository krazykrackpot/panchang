/**
 * Timezone utilities  –  resolve UTC offset for any date + IANA timezone.
 *
 * The key problem: a single numeric offset (e.g., tz=2 for CEST) is wrong
 * for dates in a different DST period (e.g., CET=UTC+1 in winter).
 * This module resolves the correct offset per-date.
 *
 * HISTORICAL TIMEZONE HANDLING:
 * The IANA timezone database (used by Intl.DateTimeFormat) simplifies
 * historical timezone data, especially for India before independence (1947).
 * For accurate kundali computation of pre-1970 births, we apply manual
 * corrections based on documented historical records:
 *
 * India:
 *   - Before 1906: Cities used Local Mean Time (LMT)  –  Bombay=UTC+4:51:16,
 *     Calcutta=UTC+5:53:28, Madras=UTC+5:20:56. IST (UTC+5:30) didn't exist.
 *   - 1906-01-01 to 1941-09-30: IST (UTC+5:30) standardized across British India.
 *   - 1941-10-01 to 1945-10-14: "War Time" / "Advance Time" (UTC+6:30) in
 *     effect for all of India during WWII. Documented in Indian Standard Time
 *     history (Gazette of India, 1941).
 *   - 1945-10-15 onward: IST (UTC+5:30) restored permanently.
 *
 * US:
 *   - Before 1918: No federal DST law. States used railroad time zones.
 *     Intl.DateTimeFormat handles this reasonably for standard time.
 *   - 1942-1945: "War Time" year-round DST (extra +1 hour). IANA handles this.
 *
 * Sources: Indian Standard Time (Wikipedia), Gazette of India 1941,
 * National Institute of Standards and Technology (NIST).
 */

// ── Historical timezone corrections ──────────────────────────────────────
// These override Intl.DateTimeFormat for periods it doesn't model accurately.

interface HistoricalTzRule {
  /** Date range: applies when date is >= start AND < end (YYYY-MM-DD) */
  start: string;
  end: string;
  /** UTC offset in decimal hours */
  offset: number;
  /** Optional: only applies to specific cities (lowercase). '*' = all cities in the timezone. */
  cities?: string[];
}

// India historical timezone rules (Asia/Kolkata)
const INDIA_HISTORICAL: HistoricalTzRule[] = [
  // Pre-1906: Local Mean Time varied by city
  // Bombay (Mumbai): UTC+4:51:16 = 4.8544
  // Calcutta (Kolkata): UTC+5:53:28 = 5.8911
  // Madras (Chennai): UTC+5:20:56 = 5.3489
  // Delhi: UTC+5:10:20 = 5.1722 (approximate, based on 77.21°E longitude)
  // For cities without a specific entry, we use Calcutta time (India's standard
  // before IST, as Calcutta was the capital of British India until 1911).
  { start: '1800-01-01', end: '1906-01-01', offset: 5.5, cities: ['*'] }, // Default: IST (approximate)
  // Specific city overrides for pre-1906 (uncomment if needed):
  // { start: '1800-01-01', end: '1906-01-01', offset: 4.8544, cities: ['bombay', 'mumbai'] },
  // { start: '1800-01-01', end: '1906-01-01', offset: 5.8911, cities: ['calcutta', 'kolkata'] },
  // { start: '1800-01-01', end: '1906-01-01', offset: 5.3489, cities: ['madras', 'chennai'] },

  // WWII "Advance Time"  –  entire India shifted to UTC+6:30
  // Gazette of India notification, September 1941.
  { start: '1941-10-01', end: '1945-10-15', offset: 6.5, cities: ['*'] },
];

/**
 * Check if a historical timezone correction applies.
 * Returns the corrected offset, or null if no correction needed.
 */
function getHistoricalOffset(year: number, month: number, day: number, timezone: string): number | null {
  // Only apply to Indian timezones
  if (timezone !== 'Asia/Kolkata' && timezone !== 'Asia/Calcutta') return null;

  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  for (const rule of INDIA_HISTORICAL) {
    if (dateStr >= rule.start && dateStr < rule.end) {
      return rule.offset;
    }
  }
  return null;
}

/**
 * Get the UTC offset in hours for a specific date in a specific timezone.
 * Uses Intl.DateTimeFormat which handles DST transitions correctly.
 * Applies historical timezone corrections for pre-1970 India (WWII Advance Time).
 *
 * @param date - The date to check (year, month 1-based, day)
 * @param timezone - IANA timezone string (e.g., 'Europe/Zurich', 'Asia/Kolkata')
 * @returns UTC offset in decimal hours (e.g., 5.5 for IST, 2 for CEST, 1 for CET)
 */
export function getUTCOffsetForDate(year: number, month: number, day: number, timezone: string): number {
  // Check for historical timezone corrections first
  const historicalOffset = getHistoricalOffset(year, month, day, timezone);
  if (historicalOffset !== null) return historicalOffset;
  try {
    // Create a date at noon local time to avoid DST transition edge cases
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

    // Get the timezone offset using Intl.DateTimeFormat
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });

    const parts = formatter.formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName');

    if (tzPart) {
      // Parse "GMT+2", "GMT-5:30", "GMT+5:30", etc.
      const match = tzPart.value.match(/GMT([+-]?)(\d{1,2})(?::(\d{2}))?/);
      if (match) {
        const sign = match[1] === '-' ? -1 : 1;
        const hours = parseInt(match[2], 10);
        const minutes = match[3] ? parseInt(match[3], 10) : 0;
        return sign * (hours + minutes / 60);
      }
    }

    // Fallback: compute from Date object offset
    // Create a date in the target timezone and compare with UTC
    const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const localStr = utcDate.toLocaleString('en-US', { timeZone: timezone });
    const localDate = new Date(localStr);
    const diffMs = localDate.getTime() - utcDate.getTime();
    return diffMs / (1000 * 60 * 60);
  } catch {
    // If timezone string is invalid, try parsing as numeric offset
    const num = parseFloat(timezone);
    if (!isNaN(num)) return num;
    throw new Error(`Invalid timezone: "${timezone}"  –  must be IANA timezone string (e.g. Asia/Kolkata) or numeric offset`);
  }
}

/**
 * Get the browser's IANA timezone string.
 * Returns e.g., 'Europe/Zurich', 'Asia/Kolkata', 'America/New_York'.
 */
export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

/**
 * Pre-zone-standardisation cutoffs by IANA timezone prefix. For dates BEFORE
 * the listed cutoff at that location, the IANA tzdb resolves to the zone's
 * reference-meridian LMT (e.g. Berlin LMT for all of Europe/Berlin pre-1893),
 * which is wrong if the birthplace has a different longitude. For these
 * dates we use longitude-based LMT (lng / 15 hours) when `lng` is provided.
 *
 * Discovered during PR #317 Einstein cross-check (2026-05-31). Spec:
 * docs/superpowers/specs/2026-05-31-pre-1880-lmt-timezone-bug.md.
 *
 * Cutoff dates sourced from Wikipedia "History of standard time" entries and
 * national gazettes; conservative — slight over-application for locations
 * within ~0.5° of the zone reference meridian is harmless (LMT and zone time
 * agree to within ~2 min). Modern post-1960 charts are entirely unaffected.
 *
 * For India we already have a separate `INDIA_HISTORICAL` rule set that
 * applies UTC+5:30 IST as a uniform pre-1906 default (not longitude-based) —
 * keeping that behaviour as-is to avoid breaking the existing India pre-1906
 * test coverage. Longitude-based LMT can be added there as a future
 * refinement if needed.
 */
const ZONE_STANDARDISATION_CUTOFFS: { prefix: string; cutoff: string }[] = [
  // Germany adopted CET 1893-04-01
  { prefix: 'Europe/Berlin',     cutoff: '1893-04-01' },
  // UK adopted GMT statutorily 1880-08-02
  { prefix: 'Europe/London',     cutoff: '1880-08-02' },
  // France: Paris Mean Time used as national reference till 1891-03-15,
  // then CET-equivalent (Paris time still differs from CET); using 1911
  // when France formally aligned with GMT+0 (Greenwich time)
  { prefix: 'Europe/Paris',      cutoff: '1911-03-09' },
  // Spain: nominally GMT from 1900-01-01; before that LMT by city
  { prefix: 'Europe/Madrid',     cutoff: '1900-01-01' },
  // Italy: 1893-11-01 (CET adoption)
  { prefix: 'Europe/Rome',       cutoff: '1893-11-01' },
  // Netherlands: Amsterdam Time (UTC+0:19:32) used as national time
  // 1909-1937; before that LMT. Switched to CET 1940-05-16.
  { prefix: 'Europe/Amsterdam',  cutoff: '1909-05-01' },
  // Belgium: nominally GMT 1892-05-01
  { prefix: 'Europe/Brussels',   cutoff: '1892-05-01' },
  // Austria-Hungary: 1891-10-01 (CET)
  { prefix: 'Europe/Vienna',     cutoff: '1891-10-01' },
  // Switzerland: 1894-06-01 (CET)
  { prefix: 'Europe/Zurich',     cutoff: '1894-06-01' },
  // USA: Standard Time Act of 1883-11-18 (railroad time zones).
  { prefix: 'America/',          cutoff: '1883-11-18' },
  // Canada similarly 1883
  { prefix: 'Canada/',           cutoff: '1883-11-18' },
  // Russia: 1919-07-08 (Moscow time)
  { prefix: 'Europe/Moscow',     cutoff: '1919-07-08' },
  // Australia: Eastern Standard Time 1895-02-01 in most states
  { prefix: 'Australia/',        cutoff: '1895-02-01' },
  // China: 1928-01-01 (Standard Time of the Coast)
  { prefix: 'Asia/Shanghai',     cutoff: '1928-01-01' },
];

/**
 * If the given date is before zone-time standardisation at the IANA zone's
 * location AND a birth longitude is supplied, returns the longitude-based
 * LMT offset (hours). Returns null otherwise — caller should fall back to
 * standard IANA resolution.
 */
function getPreStandardisationLMT(
  year: number, month: number, day: number, timezone: string, lng: number | undefined,
): number | null {
  if (lng === undefined || !isFinite(lng)) return null;
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  for (const rule of ZONE_STANDARDISATION_CUTOFFS) {
    if (timezone.startsWith(rule.prefix) && dateStr < rule.cutoff) {
      // Longitude-based LMT: each 15° = 1 hour from UT
      return lng / 15;
    }
  }
  return null;
}

/**
 * US states/regions that did NOT observe DST during 1945-10-01 to 1967-04-01,
 * the post-WWII period of inconsistent US DST observance (between end of
 * year-round War Time and start of federal Uniform Time Act enforcement).
 *
 * IANA tzdb assigns single zone names (e.g. America/Chicago) to vast regions,
 * but DST observance within those zones varied by state/city. The named zone's
 * historical behaviour reflects the NAMED CITY's practice — which can be wrong
 * for other cities in the same zone.
 *
 * Surfaced 2026-05-31 when Bill Clinton's Hope, AR chart computed with
 * America/Chicago returned -5 (CDT) — but Arkansas didn't observe DST in 1946.
 * Astro-Databank Rodden A canonical: "8:51 AM CST" = -6. Without this
 * override the ascendant shifted 12.7° to the wrong sign.
 *
 * Coordinates are conservative bounding boxes; states with partial DST
 * observance during this period are NOT listed (would require county-level
 * detail that's out of scope). Add new entries as historical cases are found.
 *
 * Sources: US DST history (Wikipedia "Uniform Time Act"), state-level archives.
 */
const US_NO_DST_REGIONS_1945_1967: {
  name: string;
  latMin: number; latMax: number;
  lngMin: number; lngMax: number;
  zone: string;
  offset: number;
}[] = [
  // Arkansas — did not observe DST 1945-1967. America/Chicago zone.
  { name: 'Arkansas', latMin: 33.0, latMax: 36.5, lngMin: -94.6, lngMax: -89.6,
    zone: 'America/Chicago', offset: -6 },
  // Indiana — most of state did not observe DST in this era. Today it's
  // America/Indiana/Indianapolis but historical records may use America/New_York
  // or America/Chicago — bracket both.
  { name: 'Indiana', latMin: 37.8, latMax: 41.8, lngMin: -88.1, lngMax: -84.8,
    zone: 'America/Indiana/Indianapolis', offset: -5 },
  // Arizona — never observed DST (except briefly 1967 under fed pressure,
  // then opted out 1968). America/Phoenix zone today; historical may use
  // America/Denver.
  { name: 'Arizona', latMin: 31.0, latMax: 37.1, lngMin: -114.9, lngMax: -109.0,
    zone: 'America/Phoenix', offset: -7 },
  // Hawaii — never observed DST in the modern era. Pacific/Honolulu zone.
  { name: 'Hawaii', latMin: 18.5, latMax: 22.5, lngMin: -160.5, lngMax: -154.5,
    zone: 'Pacific/Honolulu', offset: -10 },
];

/**
 * For births in US no-DST states during 1945-1967, IANA tzdb may return the
 * wrong (DST-applied) offset because tzdb encodes the named city's practice,
 * not the whole zone's. If coordinates fall in a documented no-DST region
 * AND the zone matches, return the state's standard offset instead.
 *
 * Returns null when the override doesn't apply — caller falls back to IANA.
 */
function getUSHistoricalNoDSTOffset(
  year: number, month: number, day: number,
  timezone: string, lat: number | undefined, lng: number | undefined,
): number | null {
  if (lat === undefined || lng === undefined || !isFinite(lat) || !isFinite(lng)) return null;
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  // Window: end of US Year-Round War Time (1945-10-01) through Uniform Time
  // Act enforcement (1967-04-30). Outside this window, IANA tzdb is reliable.
  if (dateStr < '1945-10-01' || dateStr > '1967-04-30') return null;
  for (const region of US_NO_DST_REGIONS_1945_1967) {
    if (
      lat >= region.latMin && lat <= region.latMax &&
      lng >= region.lngMin && lng <= region.lngMax &&
      (timezone === region.zone || timezone.startsWith('America/') || timezone.startsWith('Pacific/'))
    ) {
      return region.offset;
    }
  }
  return null;
}

/**
 * Resolve a timezone value that may be a numeric string ("5.5"), IANA string ("Europe/Zurich"),
 * or already a number. Returns a numeric UTC offset in hours for the given date.
 *
 * For pre-zone-standardisation historical dates (e.g. 1879 Germany, 1860 UK),
 * pass the birth longitude in `lng` to get longitude-based LMT instead of
 * IANA's reference-meridian LMT. Without `lng` this function falls back to
 * the (slightly inaccurate) IANA resolution for historical dates — the same
 * behaviour the engine had before the 2026-05-31 fix.
 */
export function resolveTimezone(
  tz: string | number,
  year: number, month: number, day: number,
  lng?: number,
  lat?: number,
): number {
  if (typeof tz === 'number') return tz;
  if (!tz || tz.trim() === '') {
    throw new Error('Timezone is required  –  birth calculations must use the birth location timezone, not the browser timezone');
  }
  // Try as numeric string first
  const num = parseFloat(tz);
  if (!isNaN(num) && tz.match(/^-?\d+\.?\d*$/)) return num;
  // Pre-zone-standardisation longitude-based LMT (only when lng provided)
  const lmt = getPreStandardisationLMT(year, month, day, tz, lng);
  if (lmt !== null) return lmt;
  // US no-DST regions in 1945-1967 (only when coordinates provided)
  const usNoDst = getUSHistoricalNoDSTOffset(year, month, day, tz, lat, lng);
  if (usNoDst !== null) return usNoDst;
  // Try as IANA timezone string (standard path for modern dates)
  return getUTCOffsetForDate(year, month, day, tz);
}

// ── Longitude-based IANA fallback map ───────────────────────────────────
// Used as the absolute last resort when both API and tz-lookup fail.
const OFFSET_TO_IANA: Record<string, string> = {
  '-12': 'Etc/GMT+12', '-11': 'Pacific/Midway', '-10': 'Pacific/Honolulu',
  '-9': 'America/Anchorage', '-8': 'America/Los_Angeles', '-7': 'America/Denver',
  '-6': 'America/Chicago', '-5': 'America/New_York', '-4': 'America/Halifax',
  '-3': 'America/Sao_Paulo', '-2': 'Atlantic/South_Georgia', '-1': 'Atlantic/Azores',
  '0': 'UTC', '1': 'Europe/Paris', '2': 'Europe/Helsinki',
  '3': 'Europe/Moscow', '4': 'Asia/Dubai', '5': 'Asia/Kolkata',
  '6': 'Asia/Dhaka', '7': 'Asia/Bangkok', '8': 'Asia/Shanghai',
  '9': 'Asia/Tokyo', '10': 'Australia/Sydney', '11': 'Pacific/Noumea',
  '12': 'Pacific/Auckland',
};

/**
 * Resolve timezone for a BIRTH LOCATION from its coordinates.
 *
 * ██████████████████████████████████████████████████████████████████████
 * ██  NEVER EVER USE THE BROWSER TIMEZONE HERE.                      ██
 * ██  This function resolves TZ for where someone WAS BORN,          ██
 * ██  not where the user IS NOW.                                      ██
 * ██  A user in Switzerland generating a kundali for someone born     ██
 * ██  in Hyderabad MUST get Asia/Kolkata, not Europe/Zurich.          ██
 * ██                                                                  ██
 * ██  If you are fixing a bug and think adding browser TZ here will   ██
 * ██  help — STOP. You want resolveCurrentLocationTimezone() instead. ██
 * ██  This function has caused production bugs TWICE by returning     ██
 * ██  the browser's timezone. Do not make it three times.             ██
 * ██████████████████████████████████████████████████████████████████████
 *
 * Resolution order:
 * 1. timeapi.io external API (3s timeout)
 * 2. tz-lookup offline geographic boundary resolution
 * 3. India special case: lat 6-36°N, lng 68-98°E → Asia/Kolkata
 * 4. Nepal: lat 26-31°N, lng 80-89°E → Asia/Kathmandu
 * 5. Sri Lanka: lat 5-10°N, lng 79-82°E → Asia/Colombo
 * 6. Japan: lat 24-46°N, lng 123-146°E → Asia/Tokyo
 * 7. Europe: lng -10 to 40, lat 35-72 → CET/EET/MSK based on longitude bands
 * 8. Longitude-based fallback: Math.round(lng/15) → IANA map
 *
 * MUST NOT contain any reference to Intl.DateTimeFormat, window,
 * navigator, or browser APIs.
 */
export async function resolveBirthTimezone(lat: number, lng: number): Promise<string> {
  // Method 1: External API  –  resolves timezone for arbitrary coordinates.
  try {
    const res = await fetch(
      `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lng}`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.timeZone) return data.timeZone;
    }
  } catch { /* API failed  –  fall through to offline methods */ }

  // Method 2: tz-lookup — offline coordinate-to-IANA timezone resolution.
  // Uses pre-computed geographic boundaries (no bounding box hacks).
  // Correctly handles India/Nepal/Bangladesh/Pakistan borders, US timezone
  // boundaries, and every other edge case worldwide.
  try {
    const tzLookup = require('tz-lookup');
    const tz = tzLookup(lat, lng);
    if (tz) return tz;
  } catch {
    // tz-lookup not available — fall through to geographic special cases
    console.error('[timezone] tz-lookup failed for', lat, lng);
  }

  // Method 3: Geographic special cases (bounding-box approximations)
  // Nepal MUST be checked BEFORE India — Nepal's box (lat 26-31, lng 80-89)
  // is entirely inside India's box (lat 6-36, lng 68-98). Without this order,
  // Kathmandu would incorrectly return Asia/Kolkata.
  if (lat >= 26 && lat <= 31 && lng >= 80 && lng <= 89) return 'Asia/Kathmandu';
  // Sri Lanka: lat 5-10°N, lng 79-82°E (outside India's lat range at the low end,
  // but checked before India for clarity and to avoid any future box changes)
  if (lat >= 5 && lat <= 10 && lng >= 79 && lng <= 82) return 'Asia/Colombo';
  // India: lat 6-36°N, lng 68-98°E
  if (lat >= 6 && lat <= 36 && lng >= 68 && lng <= 98) return 'Asia/Kolkata';
  // Japan: lat 24-46°N, lng 123-146°E
  if (lat >= 24 && lat <= 46 && lng >= 123 && lng <= 146) return 'Asia/Tokyo';
  // Europe: lng -10 to 40, lat 35-72
  if (lat >= 35 && lat <= 72 && lng >= -10 && lng <= 40) {
    if (lng < 5) return 'Europe/London';        // Western Europe / UK / Portugal
    if (lng < 16) return 'Europe/Paris';         // CET: France, Benelux, Germany west
    if (lng < 30) return 'Europe/Helsinki';      // EET: Eastern Europe, Scandinavia east
    return 'Europe/Moscow';                       // MSK: lng 30-40
  }

  // Method 4: Absolute last resort — crude longitude estimate
  const offsetHours = Math.round(lng / 15);
  return OFFSET_TO_IANA[String(offsetHours)] || 'UTC';
}

/**
 * Resolve timezone for the USER'S CURRENT LOCATION.
 * Used by panchang, location search, muhurta — situations where the
 * coordinates come from browser geolocation or IP detection, so the
 * browser's own timezone IS correct.
 *
 * For birth charts, use resolveBirthTimezone() instead.
 */
export async function resolveCurrentLocationTimezone(lat: number, lng: number): Promise<string> {
  // ALWAYS resolve from coordinates — NEVER use browser timezone.
  // The browser TZ is where the USER is (VPN, travel). The panchang
  // location TZ is where the PANCHANG should be computed.
  // Bug found 2026-05-12: Mumbai panchang showed Europe/Zurich times
  // because this function returned the browser TZ on a Swiss VPN.
  return resolveBirthTimezone(lat, lng);
}

/**
 * Validate an IANA timezone string.
 */
export function isValidTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse "HH:MM" (or "H:MM") local wall-clock time on a YYYY-MM-DD date in a
 * given IANA timezone → epoch milliseconds (UTC).
 *
 * Returns null for invalid / missing times.
 *
 * N3 audit fix: this function existed as a private copy in BOTH
 *   src/lib/vrat/next-reminder.ts
 *   src/app/api/cron/vrat-reminder/route.ts
 * Lesson Q says duplicates WILL drift. Canonical location: here.
 * Import from both callers instead of re-defining locally.
 *
 * Algorithm: two-step Intl offset correction.
 *   1. Build a naive Date.UTC treating the wall-clock as if it were UTC.
 *   2. Ask Intl what that UTC instant looks like in the target timezone.
 *   3. The difference is the timezone offset — subtract to get real UTC.
 */
export function localTimeToUtcMs(
  dateStr: string,
  hhmm: string | undefined,
  tz: string,
): number | null {
  if (!hhmm || !/^\d{1,2}:\d{2}$/.test(hhmm)) return null;
  const [hh, mm] = hhmm.split(':').map(Number);
  const [y, m, d] = dateStr.split('-').map(Number);
  const naive = Date.UTC(y, m - 1, d, hh, mm);
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const parts = fmt.formatToParts(new Date(naive));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? '0');
  const tzWallMs = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  const offsetMs = tzWallMs - naive;
  return naive - offsetMs;
}
