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
 * Has a wall-clock moment ("HH:MM" on YYYY-MM-DD) already passed in the
 * given IANA timezone? Compares the full date first, then time-of-day —
 * so a moment dated yesterday is always "passed" no matter what time-of-
 * day the user is at.
 *
 * Used by panchang surfaces (TodayPanchangWidget on the landing page,
 * PanchangClient on /panchang) to decide which transition card to
 * highlight. Both surfaces must share one helper — duplicated copies
 * drifted once already (PanchangClient missed the "endDate is past"
 * branch, so the previous nakshatra stayed highlighted ~14h after it
 * actually ended).
 *
 * `date` is optional — when omitted, the comparison assumes today in
 * the given timezone (matching the legacy TodayPanchangWidget call
 * sites that pass only a time-of-day).
 */
export function hasMomentPassed(
  time: string,
  date: string | undefined,
  timezone: string | null | undefined,
): boolean {
  const now = new Date();
  let y: number;
  let mo: number;
  let d: number;
  let nowMinutes: number;

  try {
    // `timezone || undefined` lets Intl treat null/empty as the browser's
    // local timezone; invalid strings throw at construction and fall
    // through to the catch.
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone || undefined,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(now);
    y = parseInt(parts.find((p) => p.type === 'year')?.value ?? '0', 10);
    mo = parseInt(parts.find((p) => p.type === 'month')?.value ?? '0', 10);
    d = parseInt(parts.find((p) => p.type === 'day')?.value ?? '0', 10);
    const h = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10) % 24;
    const m = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10);
    nowMinutes = h * 60 + m;
  } catch {
    console.error('[now-in-timezone] Invalid timezone for hasMomentPassed, falling back to local:', timezone);
    y = now.getFullYear();
    mo = now.getMonth() + 1;
    d = now.getDate();
    nowMinutes = now.getHours() * 60 + now.getMinutes();
  }

  if (date) {
    const [ty, tmo, td] = date.split('-').map(Number);
    if (y !== ty) return y > ty;
    if (mo !== tmo) return mo > tmo;
    if (d !== td) return d > td;
  }

  return nowMinutes >= parseHHMM(time);
}

/**
 * Resolve "today" as YYYY-MM-DD in the given IANA timezone — for callers
 * that need to detect whether a user-selected date string matches the
 * panchang location's current day. Falls back to the browser-local date
 * when timezone is null/undefined/invalid.
 */
export function todayInTimezone(timezone: string | null | undefined): string {
  const now = new Date();
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone || undefined,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);
    const y = parts.find((p) => p.type === 'year')?.value ?? '0000';
    const mo = parts.find((p) => p.type === 'month')?.value ?? '01';
    const d = parts.find((p) => p.type === 'day')?.value ?? '01';
    return `${y}-${mo}-${d}`;
  } catch {
    console.error('[now-in-timezone] Invalid timezone for todayInTimezone, falling back to local:', timezone);
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  }
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
