// src/lib/gamification/ist-day.ts
const IST_OFFSET_MIN = 330; // +05:30

/** Convert any Date to a YYYY-MM-DD string interpreted as Asia/Kolkata. */
export function istDate(d: Date): string {
  const utcMs = d.getTime();
  const istMs = utcMs + IST_OFFSET_MIN * 60 * 1000;
  const ist = new Date(istMs);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const day = String(ist.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Days between two YYYY-MM-DD strings (a < b returns positive). */
export function daysBetweenIst(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const aMs = Date.UTC(ay, am - 1, ad);
  const bMs = Date.UTC(by, bm - 1, bd);
  return Math.round((bMs - aMs) / (24 * 60 * 60 * 1000));
}

/** True if the given YYYY-MM-DD is a Monday. */
export function isMondayIst(d: string): boolean {
  const [y, m, dd] = d.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, dd));
  return date.getUTCDay() === 1; // 0=Sun, 1=Mon, …
}

/** Most recent Monday including the day itself. */
export function lastMondayIst(d: string): string {
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

/** Today's IST date as YYYY-MM-DD. */
export function todayIst(): string {
  return istDate(new Date());
}
