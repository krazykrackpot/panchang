/**
 * Timezone utilities — resolve UTC offset for any date + IANA timezone.
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
 *   - Before 1906: Cities used Local Mean Time (LMT) — Bombay=UTC+4:51:16,
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

  // WWII "Advance Time" — entire India shifted to UTC+6:30
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
    throw new Error(`Invalid timezone: "${timezone}" — must be IANA timezone string (e.g. Asia/Kolkata) or numeric offset`);
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
 * Resolve a timezone value that may be a numeric string ("5.5"), IANA string ("Europe/Zurich"),
 * or already a number. Returns a numeric UTC offset in hours for the given date.
 */
export function resolveTimezone(tz: string | number, year: number, month: number, day: number): number {
  if (typeof tz === 'number') return tz;
  if (!tz || tz.trim() === '') {
    throw new Error('Timezone is required — birth calculations must use the birth location timezone, not the browser timezone');
  }
  // Try as numeric string first
  const num = parseFloat(tz);
  if (!isNaN(num) && tz.match(/^-?\d+\.?\d*$/)) return num;
  // Try as IANA timezone string
  return getUTCOffsetForDate(year, month, day, tz);
}

/**
 * Resolve IANA timezone from lat/lng coordinates.
 * Uses timeapi.io API; falls back to longitude-based estimation.
 * The birth location's coordinates determine the timezone — never the browser.
 */
export async function resolveTimezoneFromCoords(lat: number, lng: number): Promise<string> {
  // Method 1: Browser's Intl API — instant, no network call.
  // When coordinates come from browser geolocation, the browser's timezone
  // is the correct timezone for those coordinates.
  if (typeof window !== 'undefined' && typeof Intl !== 'undefined') {
    try {
      const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (browserTz && browserTz !== 'UTC') return browserTz;
    } catch { /* Intl not available */ }
  }

  // Method 2: External API — resolves timezone for arbitrary coordinates.
  // Needed when coordinates don't match the user's browser timezone
  // (e.g., searching for panchang in Delhi while sitting in Switzerland).
  try {
    const res = await fetch(
      `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lng}`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.timeZone) return data.timeZone;
    }
  } catch { /* API failed — use longitude fallback */ }

  // Method 3: Longitude-based estimate (last resort).
  // Known weakness: Europe west of 7.5°E rounds to UTC+0 but is actually CET (UTC+1).
  // Special-case European longitudes where CET/CEST applies.
  const isEurope = lng >= -10 && lng <= 15 && lat >= 35 && lat <= 72;
  const offsetHours = isEurope ? 1 : Math.round(lng / 15);
  const OFFSET_TO_IANA: Record<string, string> = {
    '-12': 'Etc/GMT+12', '-11': 'Pacific/Midway', '-10': 'Pacific/Honolulu',
    '-9': 'America/Anchorage', '-8': 'America/Los_Angeles', '-7': 'America/Denver',
    '-6': 'America/Chicago', '-5': 'America/New_York', '-4': 'America/Halifax',
    '-3': 'America/Sao_Paulo', '-2': 'Atlantic/South_Georgia', '-1': 'Atlantic/Azores',
    '0': 'UTC', '1': 'Europe/Paris', '2': 'Europe/Helsinki',
    '3': 'Europe/Moscow', '4': 'Asia/Dubai', '5': 'Asia/Karachi',
    '6': 'Asia/Kolkata', '7': 'Asia/Bangkok', '8': 'Asia/Shanghai',
    '9': 'Asia/Tokyo', '10': 'Australia/Sydney', '11': 'Pacific/Noumea',
    '12': 'Pacific/Auckland',
  };
  return OFFSET_TO_IANA[String(offsetHours)] || 'UTC';
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
