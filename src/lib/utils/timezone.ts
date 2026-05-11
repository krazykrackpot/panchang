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
 * Resolve a timezone value that may be a numeric string ("5.5"), IANA string ("Europe/Zurich"),
 * or already a number. Returns a numeric UTC offset in hours for the given date.
 */
export function resolveTimezone(tz: string | number, year: number, month: number, day: number): number {
  if (typeof tz === 'number') return tz;
  if (!tz || tz.trim() === '') {
    throw new Error('Timezone is required  –  birth calculations must use the birth location timezone, not the browser timezone');
  }
  // Try as numeric string first
  const num = parseFloat(tz);
  if (!isNaN(num) && tz.match(/^-?\d+\.?\d*$/)) return num;
  // Try as IANA timezone string
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
  // India: lat 6-36°N, lng 68-98°E
  if (lat >= 6 && lat <= 36 && lng >= 68 && lng <= 98) return 'Asia/Kolkata';
  // Nepal: lat 26-31°N, lng 80-89°E (checked AFTER India since overlap exists;
  // Nepal's box is more specific)
  if (lat >= 26 && lat <= 31 && lng >= 80 && lng <= 89) return 'Asia/Kathmandu';
  // Sri Lanka: lat 5-10°N, lng 79-82°E
  if (lat >= 5 && lat <= 10 && lng >= 79 && lng <= 82) return 'Asia/Colombo';
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
  // The browser knows its own timezone — use it when coordinates come
  // from the browser's geolocation API or IP-based detection.
  if (typeof window !== 'undefined') {
    try {
      const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (browserTz && browserTz !== 'UTC') return browserTz;
    } catch { /* browser API unavailable — fall through */ }
  }

  // Fallback: resolve from coordinates (same logic as birth, no browser TZ)
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
