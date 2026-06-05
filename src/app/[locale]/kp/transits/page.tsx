/**
 * /kp/transits — Live KP ruling planets for a moment + location.
 *
 * Server-side wrapper. force-dynamic per spec §4 + Lesson ZD — clock-reading
 * is the whole point of the page; ISR would serve stale RPs.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §4
 */

import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import TransitsClient from './Client';
import { getRulingPlanetsForMoment } from '@/lib/kp/ruling-now';

export const dynamic = 'force-dynamic';

const FALLBACK_LAT = 47.37;   // Zurich (matches CLAUDE.md: user is in Switzerland)
const FALLBACK_LNG = 8.55;
const FALLBACK_NAME = 'Zurich, Switzerland';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Vercel geo headers — fall back to Zurich if absent (e.g. local dev)
  const h = await headers();
  const cityHeader = h.get('x-vercel-ip-city');
  const latHeader = h.get('x-vercel-ip-latitude');
  const lngHeader = h.get('x-vercel-ip-longitude');

  const lat = latHeader ? parseFloat(latHeader) : FALLBACK_LAT;
  const lng = lngHeader ? parseFloat(lngHeader) : FALLBACK_LNG;
  const cityName = cityHeader
    ? decodeURIComponent(cityHeader)
    : FALLBACK_NAME;

  // SSR snapshot — first paint shows real RPs immediately.
  let initialSnapshot: Awaited<ReturnType<typeof getRulingPlanetsForMoment>> | null = null;
  try {
    initialSnapshot = getRulingPlanetsForMoment({ lat, lng });
  } catch (err) {
    console.error('[kp/transits] initial SSR snapshot failed:', err);
  }

  return (
    <TransitsClient
      locale={locale}
      initialSnapshot={initialSnapshot}
      initialLocation={{ name: cityName, lat, lng, timezone: '+00:00' }}
    />
  );
}
