/**
 * Vrat Alert Generator (Client-Side)
 *
 * Checks which followed vrats occur within the user's reminder window
 * and generates in-app alerts. Uses the calendar API to fetch upcoming
 * vrat dates and schedules browser notifications.
 *
 * This is a client-side-only module — the server-side cron does NOT
 * know individual user vrat preferences (stored in localStorage).
 */

import type { PanchangAlert } from './panchang-alerts';
import { TRACKABLE_VRATS, getWeeklyVratDay, getNextWeeklyDates } from '@/lib/vrat/trackable-vrats';
import { tl } from '@/lib/utils/trilingual';

interface CalendarEntry {
  name: { en: string; hi?: string; sa?: string };
  date: string;
  slug?: string;
  category?: string;
}

/**
 * Generate vrat alerts for followed vrats that occur within the reminder window.
 *
 * @param followedVrats  Array of vrat slugs the user follows
 * @param reminderHours  Hours before the vrat to trigger the alert
 * @param calendarEntries  Festival/vrat entries from the calendar API for the current year
 * @param locale  Current locale for display names
 */
export function generateVratAlerts(
  followedVrats: string[],
  reminderHours: number,
  calendarEntries: CalendarEntry[],
  locale: string = 'en',
): PanchangAlert[] {
  if (followedVrats.length === 0) return [];

  const alerts: PanchangAlert[] = [];
  const now = new Date();
  const windowMs = reminderHours * 60 * 60 * 1000;

  // Build a set of followed calendar slugs for fast lookup
  const followedSet = new Set(followedVrats);

  // Map vrat slug -> calendarSlug
  const slugToCalendar = new Map<string, string>();
  for (const vrat of TRACKABLE_VRATS) {
    slugToCalendar.set(vrat.slug, vrat.calendarSlug);
  }

  // 1. Check tithi-based vrats from calendar entries
  for (const entry of calendarEntries) {
    // Match by calendarSlug — e.g., 'ekadashi', 'chaturthi', 'purnima', etc.
    const entrySlug = entry.slug || '';

    // Find which followed vrats match this calendar entry
    for (const followedSlug of followedVrats) {
      const calSlug = slugToCalendar.get(followedSlug);
      if (!calSlug || calSlug !== entrySlug) continue;

      // Parse the date — assume midnight local time as the start of the vrat day
      const vratDate = new Date(entry.date + 'T05:00:00'); // approximate sunrise
      const alertTime = new Date(vratDate.getTime() - windowMs);

      // Only generate alert if it's within the next 48 hours and hasn't passed
      const diff = alertTime.getTime() - now.getTime();
      if (diff > -windowMs && diff < 48 * 60 * 60 * 1000) {
        const vratDef = TRACKABLE_VRATS.find((v) => v.slug === followedSlug);
        const displayName = vratDef ? tl(vratDef.name, locale) : tl(entry.name, locale);

        alerts.push({
          id: `vrat-${followedSlug}-${entry.date}`,
          type: 'festival',
          title: locale === 'hi' ? `${displayName} कल` : `${displayName} Tomorrow`,
          body: locale === 'hi'
            ? `${displayName} ${entry.date} को है। व्रत की तैयारी करें।`
            : `${displayName} is on ${entry.date}. Prepare for the observance.`,
          time: alertTime,
        });
      }
    }
  }

  // 2. Check weekly vrats
  for (const followedSlug of followedVrats) {
    const dayOfWeek = getWeeklyVratDay(followedSlug);
    if (dayOfWeek === null) continue;
    if (!followedSet.has(followedSlug)) continue;

    const nextDates = getNextWeeklyDates(dayOfWeek, 2);
    const vratDef = TRACKABLE_VRATS.find((v) => v.slug === followedSlug);
    if (!vratDef) continue;

    for (const dateStr of nextDates) {
      const vratDate = new Date(dateStr + 'T05:00:00');
      const alertTime = new Date(vratDate.getTime() - windowMs);
      const diff = alertTime.getTime() - now.getTime();

      if (diff > -windowMs && diff < 48 * 60 * 60 * 1000) {
        const displayName = tl(vratDef.name, locale);
        alerts.push({
          id: `vrat-${followedSlug}-${dateStr}`,
          type: 'festival',
          title: locale === 'hi' ? `${displayName} कल` : `${displayName} Tomorrow`,
          body: locale === 'hi'
            ? `${displayName} ${dateStr} को है। व्रत की तैयारी करें।`
            : `${displayName} is on ${dateStr}. Prepare for the observance.`,
          time: alertTime,
        });
      }
    }
  }

  // Deduplicate by id
  const seen = new Set<string>();
  return alerts.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
}
