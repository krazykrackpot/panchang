/**
 * Timezone utilities — resolve UTC offset for any date + IANA timezone.
 *
 * The key problem: a single numeric offset (e.g., tz=2 for CEST) is wrong
 * for dates in a different DST period (e.g., CET=UTC+1 in winter).
 * This module resolves the correct offset per-date.
 */

/**
 * Get the UTC offset in hours for a specific date in a specific timezone.
 * Uses Intl.DateTimeFormat which handles DST transitions correctly.
 *
 * @param date - The date to check (year, month 1-based, day)
 * @param timezone - IANA timezone string (e.g., 'Europe/Zurich', 'Asia/Kolkata')
 * @returns UTC offset in decimal hours (e.g., 5.5 for IST, 2 for CEST, 1 for CET)
 */
export function getUTCOffsetForDate(year: number, month: number, day: number, timezone: string): number {
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
    return 0;
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
  // Try as numeric string first
  const num = parseFloat(tz);
  if (!isNaN(num) && tz.match(/^-?\d+\.?\d*$/)) return num;
  // Try as IANA timezone string
  return getUTCOffsetForDate(year, month, day, tz);
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
