// src/lib/gamification/ist-day.ts
//
// Round 3 R3-TZ-18 — the original module hardcoded `IST_OFFSET_MIN = 330`
// (+05:30) for ALL users, making streak day-keys roll over at the wrong
// time for Swiss/US users. A user in Switzerland signing in at 18:30
// local was already on the "next IST day" for the purpose of the streak
// grid — visible double-counting at evening sign-in. Direct CLAUDE.md
// policy violation ("never default to IST").
//
// The module now parameterises every API by a tz string. The legacy
// `*Ist` names are kept as @deprecated wrappers that pass 'Asia/Kolkata',
// so old callers still work while new code threads through the user's
// own timezone.

/** Convert any Date to a YYYY-MM-DD string in the given IANA timezone. */
export function dayInTz(d: Date, timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(d);
    const y = parts.find((p) => p.type === 'year')?.value ?? '0000';
    const m = parts.find((p) => p.type === 'month')?.value ?? '01';
    const day = parts.find((p) => p.type === 'day')?.value ?? '01';
    return `${y}-${m}-${day}`;
  } catch {
    // Invalid timezone — graceful UTC fallback (better than throwing in
    // a streak-grid render path).
    return d.toISOString().slice(0, 10);
  }
}

/** Days between two YYYY-MM-DD strings (a < b returns positive). */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const aMs = Date.UTC(ay, am - 1, ad);
  const bMs = Date.UTC(by, bm - 1, bd);
  return Math.round((bMs - aMs) / (24 * 60 * 60 * 1000));
}

/** True if the given YYYY-MM-DD is a Monday. (tz-agnostic — the date
 *  string is already in whatever tz the caller chose.) */
export function isMondayDay(d: string): boolean {
  const [y, m, dd] = d.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, dd));
  return date.getUTCDay() === 1; // 0=Sun, 1=Mon, …
}

/** Most recent Monday including the day itself. */
export function lastMondayDay(d: string): string {
  const [y, m, dd] = d.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, dd));
  const dow = date.getUTCDay(); // 0..6
  const offset = (dow + 6) % 7; // Mon=0, Tue=1, …, Sun=6
  date.setUTCDate(date.getUTCDate() - offset);
  const yy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dDay = String(date.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dDay}`;
}

/** Today's YYYY-MM-DD in the given IANA timezone. */
export function todayInTz(timezone: string): string {
  return dayInTz(new Date(), timezone);
}

// ── Deprecated IST-named wrappers (legacy callers) ──────────────────────────

/** @deprecated Hardcoded IST. Use `dayInTz(d, userTimezone)` with the
 *  user's panchang timezone. R3-TZ-18. */
export function istDate(d: Date): string {
  return dayInTz(d, 'Asia/Kolkata');
}

/** @deprecated Same as `daysBetween` — the IST-naming was misleading
 *  because the function never depended on tz, only on YMD strings. */
export function daysBetweenIst(a: string, b: string): number {
  return daysBetween(a, b);
}

/** @deprecated Same as `isMondayDay`. */
export function isMondayIst(d: string): boolean {
  return isMondayDay(d);
}

/** @deprecated Same as `lastMondayDay`. */
export function lastMondayIst(d: string): string {
  return lastMondayDay(d);
}

/** @deprecated Hardcoded IST. Use `todayInTz(userTimezone)` with the
 *  user's panchang timezone. R3-TZ-18. */
export function todayIst(): string {
  return dayInTz(new Date(), 'Asia/Kolkata');
}
