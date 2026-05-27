'use client';

import { useEffect, useState } from 'react';
import { todayInTimezone } from '@/lib/utils/now-in-timezone';
import { useLocationStore } from '@/stores/location-store';

/**
 * Renders a small "📅 Today" badge on the Gauri dated page WHEN the
 * date in the URL matches the user's local today.
 *
 * Why this is a client component: the parent dated page is ISR-cached
 * with `revalidate = 86400`, so any "today" comparison computed during
 * SSR gets baked into the HTML and goes stale for visitors on later
 * days. Resolving "today" in `useEffect` after mount sidesteps both the
 * cache-staleness problem and the UTC-vs-local-timezone mismatch.
 *
 * Falls back to the SSR city's timezone (passed by the parent) when
 * the user hasn't set a location yet. Renders nothing during SSR /
 * first paint to avoid a flash.
 */
export function TodayBadge({
  dateStr,
  fallbackTimezone,
  label,
}: {
  dateStr: string;
  fallbackTimezone: string;
  label: string;
}) {
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const tz = useLocationStore.getState().timezone ?? fallbackTimezone;
    setIsToday(todayInTimezone(tz) === dateStr);
  }, [dateStr, fallbackTimezone]);

  if (!isToday) return null;
  return <p className="text-emerald-400 text-sm font-medium mt-2">{label}</p>;
}
