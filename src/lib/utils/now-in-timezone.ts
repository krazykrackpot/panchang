/**
 * Timezone-aware "now" utilities for highlighting current time slots.
 *
 * Problem solved: panchang times are computed in the LOCATION's timezone,
 * but `new Date().getHours()` returns browser/server local time. When a
 * user is travelling or on a VPN, the NOW markers are hours off.
 *
 * All three exported functions use Intl.DateTimeFormat to resolve the
 * correct wall-clock time in any IANA timezone — with a graceful fallback
 * to browser local time when the timezone is null, undefined, or invalid.
 *
 * Lesson R (CLAUDE.md): midnight-crossing ranges need wrap-aware comparison.
 *   if (end < start) return now >= start || now < end;
 */

/**
 * Get current minutes-since-midnight in a specific IANA timezone.
 * Uses Intl.DateTimeFormat — works in all modern browsers and Node.js.
 * Falls back to browser local time when timezone is null/undefined/invalid.
 *
 * @example
 *   // User in Zurich (CEST, UTC+2), panchang for Kolkata (IST, UTC+5:30)
 *   nowMinutesInTimezone('Asia/Kolkata')  // → correct IST minutes, not CEST minutes
 */
export function nowMinutesInTimezone(timezone: string | null | undefined): number {
  const now = new Date();

  if (timezone) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }).formatToParts(now);

      const h = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0', 10);
      const m = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0', 10);
      // h % 24 handles midnight=24 in some locales (e.g., hour value "24:00")
      return (h % 24) * 60 + m;
    } catch {
      // Invalid IANA timezone string — fall through to browser local time
      console.error('[now-in-timezone] Invalid timezone, falling back to browser local time:', timezone);
    }
  }

  // Fallback: browser local time
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Parse a "HH:MM" time string into minutes-since-midnight.
 * Returns 0 for malformed input — callers should ensure well-formed strings.
 */
function parseHHMM(time: string): number {
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr ?? '0', 10);
  const m = parseInt(mStr ?? '0', 10);
  if (isNaN(h) || isNaN(m)) return 0;
  return h * 60 + m;
}

/**
 * Check if a time range (HH:MM – HH:MM) is currently active in the given timezone.
 *
 * Handles midnight-crossing ranges per Lesson R (CLAUDE.md):
 *   A slot "23:00"→"01:00" crosses midnight — naive start <= now < end fails.
 *   Correct: if (end < start) return now >= start || now < end;
 *
 * @param startTime - "HH:MM" (24h)
 * @param endTime   - "HH:MM" (24h)
 * @param timezone  - IANA timezone string; falls back to browser local time if null/undefined/invalid
 *
 * @example
 *   isTimeRangeActive('23:00', '01:00', 'Asia/Kolkata')  // true at 00:30 IST (midnight-crossing)
 */
export function isTimeRangeActive(
  startTime: string,
  endTime: string,
  timezone: string | null | undefined,
): boolean {
  const now = nowMinutesInTimezone(timezone);
  const start = parseHHMM(startTime);
  const end = parseHHMM(endTime);

  // Lesson R: handle midnight-crossing ranges
  if (end < start) {
    return now >= start || now < end;
  }
  return now >= start && now < end;
}

/**
 * Get current time formatted as "3:30 PM" in the given timezone.
 * Falls back to browser local time when timezone is null/undefined/invalid.
 */
export function formatCurrentTime12h(timezone: string | null | undefined): string {
  const now = new Date();

  if (timezone) {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(now);
    } catch {
      // Invalid IANA timezone string — fall through to browser local time
      console.error('[now-in-timezone] Invalid timezone for formatCurrentTime12h, falling back:', timezone);
    }
  }

  // Fallback: browser local time
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(now);
}
