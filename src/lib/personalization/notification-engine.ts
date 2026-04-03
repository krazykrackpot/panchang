/**
 * Notification Engine
 * Generates personalized in-app notification payloads based on a user's
 * kundali snapshot and upcoming festivals.
 */

import type { UserSnapshot } from './types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NotificationType =
  | 'dasha_transition'
  | 'transit_alert'
  | 'festival_reminder'
  | 'sade_sati'
  | 'weekly_digest';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface DashaEntry {
  planet?: string;
  planetName?: { en: string; hi?: string; sa?: string };
  startDate?: string;
  endDate?: string;
  subPeriods?: DashaEntry[];
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

function daysSince(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((now.getTime() - target.getTime()) / 86_400_000);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function planetDisplayName(entry: DashaEntry): string {
  return entry.planetName?.en || entry.planet || 'Unknown';
}

// ---------------------------------------------------------------------------
// 1. Dasha transition check
// ---------------------------------------------------------------------------

function checkDashaTransition(snapshot: UserSnapshot): NotificationPayload | null {
  if (!snapshot.dashaTimeline || !Array.isArray(snapshot.dashaTimeline) || snapshot.dashaTimeline.length === 0) {
    return null;
  }

  const now = new Date().toISOString();

  // Find current maha dasha
  const mahaDasha = (snapshot.dashaTimeline as DashaEntry[]).find(
    (d) => d.startDate && d.endDate && d.startDate <= now && d.endDate >= now,
  );

  if (!mahaDasha?.subPeriods || !Array.isArray(mahaDasha.subPeriods)) return null;

  // Find current antardasha
  const currentAntar = mahaDasha.subPeriods.find(
    (s) => s.startDate && s.endDate && s.startDate <= now && s.endDate >= now,
  );

  if (!currentAntar?.endDate) return null;

  const daysLeft = daysUntil(currentAntar.endDate);
  if (daysLeft < 0 || daysLeft > 30) return null;

  // Find the next antardasha
  const sortedSubs = [...mahaDasha.subPeriods]
    .filter((s) => s.startDate && s.endDate)
    .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());

  const currentIdx = sortedSubs.findIndex(
    (s) => s.startDate === currentAntar.startDate && s.endDate === currentAntar.endDate,
  );

  const nextAntar = currentIdx >= 0 && currentIdx < sortedSubs.length - 1
    ? sortedSubs[currentIdx + 1]
    : null;

  const currentName = planetDisplayName(currentAntar);
  const nextName = nextAntar ? planetDisplayName(nextAntar) : null;

  const title = `${currentName} Antardasha ending soon`;
  const body = nextName
    ? `Your ${currentName} Antardasha ends on ${formatDate(currentAntar.endDate)}. ${nextName} Antardasha begins — prepare for a shift in energy and focus.`
    : `Your ${currentName} Antardasha ends on ${formatDate(currentAntar.endDate)}. A new maha dasha period may begin soon.`;

  return {
    type: 'dasha_transition',
    title,
    body,
    metadata: {
      currentPlanet: currentAntar.planet,
      nextPlanet: nextAntar?.planet ?? null,
      endDate: currentAntar.endDate,
      daysLeft,
    },
  };
}

// ---------------------------------------------------------------------------
// 2. Transit alerts (Sade Sati active, Jupiter sign change imminent)
// ---------------------------------------------------------------------------

function checkTransitAlerts(snapshot: UserSnapshot): NotificationPayload[] {
  const alerts: NotificationPayload[] = [];

  // Sade Sati active check
  if (snapshot.sadeSati && typeof snapshot.sadeSati === 'object') {
    const ss = snapshot.sadeSati as {
      isActive?: boolean;
      phase?: string;
      startDate?: string;
      endDate?: string;
    };

    if (ss.isActive) {
      const daysActive = ss.startDate ? daysSince(ss.startDate) : null;
      const phase = ss.phase || 'ongoing';

      alerts.push({
        type: 'transit_alert',
        title: 'Sade Sati is active',
        body: `Saturn's Sade Sati (${phase} phase) is currently active for your Moon sign. This is a period of karmic lessons — patience and discipline are your allies.${ss.endDate ? ` Expected to end around ${formatDate(ss.endDate)}.` : ''}`,
        metadata: {
          subType: 'sade_sati_active',
          phase,
          daysActive,
          startDate: ss.startDate ?? null,
          endDate: ss.endDate ?? null,
        },
      });
    }
  }

  return alerts;
}

// ---------------------------------------------------------------------------
// 3. Festival reminders (next 7 days, recommended for user)
// ---------------------------------------------------------------------------

function checkFestivalReminders(festivals: string[]): NotificationPayload[] {
  // festivals parameter contains names of upcoming festivals that are already
  // filtered to the next 7 days AND scored as recommended for this user.
  return festivals.map((name) => ({
    type: 'festival_reminder' as const,
    title: `Upcoming: ${name}`,
    body: `${name} is coming up within the next 7 days. This festival is particularly recommended for your chart — consider special puja or observance.`,
    metadata: { festivalName: name },
  }));
}

// ---------------------------------------------------------------------------
// 4. Sade Sati onset (just started, within 60 days)
// ---------------------------------------------------------------------------

function checkSadeSatiOnset(snapshot: UserSnapshot): NotificationPayload | null {
  if (!snapshot.sadeSati || typeof snapshot.sadeSati !== 'object') return null;

  const ss = snapshot.sadeSati as {
    isActive?: boolean;
    phase?: string;
    startDate?: string;
  };

  if (!ss.isActive || !ss.startDate) return null;

  const since = daysSince(ss.startDate);
  if (since < 0 || since > 60) return null;

  return {
    type: 'sade_sati',
    title: 'Sade Sati has begun',
    body: `Saturn's Sade Sati commenced ${since} day${since !== 1 ? 's' : ''} ago for your Moon sign. This 7.5-year transit brings karmic restructuring. Shiva worship, charity on Saturdays, and patience are your strongest remedies.`,
    metadata: {
      startDate: ss.startDate,
      phase: ss.phase || 'rising',
      daysSinceOnset: since,
    },
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate all applicable notifications for a user based on their snapshot
 * and upcoming relevant festivals.
 *
 * @param snapshot  The user's kundali snapshot data
 * @param festivals Array of festival names that are (a) within 7 days and
 *                  (b) scored as recommended for this user
 * @returns Array of notification payloads to be inserted
 */
export function generateNotifications(
  snapshot: UserSnapshot,
  festivals: string[],
): NotificationPayload[] {
  const notifications: NotificationPayload[] = [];

  // 1. Dasha transition
  const dashaNotif = checkDashaTransition(snapshot);
  if (dashaNotif) notifications.push(dashaNotif);

  // 2. Transit alerts
  const transitAlerts = checkTransitAlerts(snapshot);
  notifications.push(...transitAlerts);

  // 3. Festival reminders
  const festivalReminders = checkFestivalReminders(festivals);
  notifications.push(...festivalReminders);

  // 4. Sade Sati onset
  const sadeSatiNotif = checkSadeSatiOnset(snapshot);
  if (sadeSatiNotif) notifications.push(sadeSatiNotif);

  return notifications;
}
