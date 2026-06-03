'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageEngagement } from '@/lib/analytics';

/**
 * One engagement signal per route view: max scroll depth + dwell time,
 * both bucketed for low-cardinality storage. Fires on `pagehide` (full
 * navigation away) AND on the effect-cleanup path (SPA navigation —
 * `pagehide` doesn't fire then). Only one signal per route view
 * regardless.
 *
 * Why bucketed: per-page-view rows accumulate in `utm_visits`; raw
 * pixel scroll + ms dwell would explode cardinality without helping
 * any analysis. Buckets (0/25/50/75/100% × 5 dwell windows) give 25
 * possible combinations per route — enough resolution to compare
 * recovery cohorts without bloating the table.
 *
 * The underlying `trackPageEngagement` → `trackUtmEvent` only fires
 * when there's a referrer or UTM cookie present. Direct visits
 * (typed URL, bookmark) don't contribute to GSC-recovery analysis,
 * so we don't store engagement for them. Side benefit: cuts row count
 * dramatically.
 */

const SCROLL_THROTTLE_MS = 250;

export type ScrollBucket = 0 | 25 | 50 | 75 | 100;
export type DwellBucket = '0-5s' | '5-30s' | '30s-2m' | '2-5m' | '5m+';

export function bucketScroll(pct: number): ScrollBucket {
  if (pct >= 100) return 100;
  if (pct >= 75) return 75;
  if (pct >= 50) return 50;
  if (pct >= 25) return 25;
  return 0;
}

export function bucketDwell(ms: number): DwellBucket {
  const s = ms / 1000;
  if (s < 5) return '0-5s';
  if (s < 30) return '5-30s';
  if (s < 120) return '30s-2m';
  if (s < 300) return '2-5m';
  return '5m+';
}

function readScrollPercent(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 0;
  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop || 0;
  const viewport = window.innerHeight || 0;
  const totalHeight = doc.scrollHeight || 0;
  if (totalHeight <= 0) return 100;
  const reached = scrollTop + viewport;
  return Math.max(0, Math.min(100, (reached / totalHeight) * 100));
}

export default function PageEngagement() {
  const pathname = usePathname();
  const maxScrollRef = useRef(0);
  const mountedAtRef = useRef(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    maxScrollRef.current = readScrollPercent();
    mountedAtRef.current = Date.now();
    firedRef.current = false;

    let throttleId: number | null = null;
    const onScroll = () => {
      if (throttleId !== null) return;
      throttleId = window.setTimeout(() => {
        throttleId = null;
        const pct = readScrollPercent();
        if (pct > maxScrollRef.current) maxScrollRef.current = pct;
      }, SCROLL_THROTTLE_MS);
    };

    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      const dwellMs = Date.now() - mountedAtRef.current;
      const finalPct = Math.max(maxScrollRef.current, readScrollPercent());
      trackPageEngagement({
        route: pathname || '/',
        scrollMaxBucket: bucketScroll(finalPct),
        dwellBucket: bucketDwell(dwellMs),
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') fire();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', fire);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', fire);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (throttleId !== null) clearTimeout(throttleId);
      // SPA route changes don't fire `pagehide`; cleanup fires the
      // signal for the route we're leaving. The pathname-keyed effect
      // re-runs with a fresh ref on the new route.
      if (!firedRef.current) fire();
    };
  }, [pathname]);

  return null;
}
