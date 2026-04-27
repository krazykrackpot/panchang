'use client';

/**
 * VratScheduler — client-side notification scheduler
 *
 * Included once in the app layout. On mount (and when preferences change),
 * it fetches the calendar API and schedules browser notifications for
 * followed vrats within the user's reminder window.
 *
 * This is a render-nothing component — it only produces side effects.
 */

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useVratTrackingStore } from '@/stores/vrat-tracking-store';
import { useLocationStore } from '@/stores/location-store';
import { generateVratAlerts } from '@/lib/notifications/vrat-alerts';
import { scheduleAlerts, getNotificationPermission } from '@/lib/notifications/panchang-alerts';

export default function VratScheduler() {
  const locale = useLocale();
  const { followedVrats, reminderHours } = useVratTrackingStore();
  const { lat, lng, timezone } = useLocationStore();
  const scheduledRef = useRef(false);

  useEffect(() => {
    // Only schedule if user follows vrats, has location, and notifications are allowed
    if (followedVrats.length === 0) return;
    if (lat === null || lng === null || !timezone) return;
    if (getNotificationPermission() !== 'granted') return;

    // Debounce: don't re-fetch on every store change within the same render cycle
    if (scheduledRef.current) return;
    scheduledRef.current = true;

    async function scheduleVratNotifications() {
      try {
        const year = new Date().getFullYear();
        const res = await fetch(`/api/calendar?year=${year}&lat=${lat}&lon=${lng}&timezone=${timezone}`);
        if (!res.ok) {
          console.error('[VratScheduler] API error:', res.status);
          return;
        }
        const data = await res.json();
        const alerts = generateVratAlerts(followedVrats, reminderHours, data.festivals || [], locale);
        if (alerts.length > 0) {
          scheduleAlerts(alerts);
        }
      } catch (err) {
        console.error('[VratScheduler] Failed to schedule vrat alerts:', err);
      } finally {
        // Allow re-scheduling if preferences change later
        scheduledRef.current = false;
      }
    }

    scheduleVratNotifications();
  }, [followedVrats, reminderHours, lat, lng, timezone, locale]);

  return null; // Render nothing — side-effect only
}
