/**
 * /kp/prashna — KP horary astrology page (number + text modes).
 *
 * Server-side wrapper. Marked force-dynamic per Lesson ZD because every
 * cast moment differs and the result depends on submission time — caching
 * would serve stale verdicts.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §3
 */

import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import PrashnaClient from './Client';

export const dynamic = 'force-dynamic';

// Final-fallback location only used when no Vercel geo header is present
// (local dev, runtimes that strip the headers). The user's stated home
// locale is Switzerland — fall back there instead of hardcoding Varanasi
// per CLAUDE.md "no hardcoded India defaults".
const FALLBACK = { name: 'Zurich, Switzerland', lat: 47.37, lng: 8.55 };

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const h = await headers();
  const cityHeader = h.get('x-vercel-ip-city');
  const latHeader = h.get('x-vercel-ip-latitude');
  const lngHeader = h.get('x-vercel-ip-longitude');

  const lat = latHeader ? parseFloat(latHeader) : FALLBACK.lat;
  const lng = lngHeader ? parseFloat(lngHeader) : FALLBACK.lng;
  const name = cityHeader ? decodeURIComponent(cityHeader) : FALLBACK.name;

  // Timezone is resolved client-side once the visitor confirms or picks a
  // location via LocationSearch; until then we use a +00:00 placeholder
  // since prashna casts already convert submission moments to UTC.
  return (
    <PrashnaClient
      locale={locale}
      initialLocation={{ name, lat, lng, timezone: '+00:00' }}
    />
  );
}
