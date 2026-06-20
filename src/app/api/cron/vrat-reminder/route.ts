// Vrat reminder cron — DISABLED 2026-06-20.
//
// Email reminders (day-before + parana) have been moved to the ICS
// calendar feed at /api/calendar/feed/[token]. Users subscribe once and
// their calendar app fires native device notifications at the right time.
// This eliminates the per-run Vercel function cost (288 invocations/day
// at every-5-min cadence, 48/day at every-30-min cadence, now 0) with
// no UX loss — the ICS feed emits:
//   - An all-day VEVENT with a day-before VALARM for each fast day, and
//   - A timed VEVENT with a VALARM for each parana window.
//
// The route is kept as a no-op so any old Vercel Cron dashboard entries
// that still reference this URL return 200 instead of 404. The cron
// entry has been removed from vercel.json.
import { type NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';

export const maxDuration = 10;

export async function GET(req: NextRequest) {
  const authError = verifyCronAuth(req);
  if (authError) return authError;
  return NextResponse.json({ success: true, sent: 0, mode: 'disabled' });
}
