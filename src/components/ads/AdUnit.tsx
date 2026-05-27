'use client';

import { useEffect, useRef } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const SLOT_MAP: Record<string, string | undefined> = {
  leaderboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD,
  rectangle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE,
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER,
};

const MIN_HEIGHTS: Record<string, string> = {
  leaderboard: 'min-h-[90px]',
  rectangle: 'min-h-[250px]',
  footer: 'min-h-[50px] sm:min-h-[90px]',
};

const FORMAT_MAP: Record<string, 'horizontal' | 'rectangle' | 'auto'> = {
  leaderboard: 'horizontal',
  rectangle: 'rectangle',
  footer: 'horizontal',
};

interface AdUnitProps {
  slot?: string;
  placement?: 'leaderboard' | 'rectangle' | 'footer';
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}

/** Load AdSense script on-demand  –  only when an AdUnit actually renders.
 * This avoids the 356KB+ script cost on pages without ads. */
let adsenseScriptLoaded = false;
// Promise that resolves once the AdSense script has fully loaded, so
// component-level pushes can `await` readiness instead of guessing with
// setTimeout. Resolves immediately if the script tag was already present
// when this module first ran (e.g. across HMR boundaries).
let adsenseReady: Promise<void> | null = null;

function ensureAdsenseScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (adsenseReady) return adsenseReady;

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
  if (!clientId) return (adsenseReady = Promise.resolve());

  // Script already in the DOM from a prior mount — assume ready.
  if (document.querySelector('script[src*="adsbygoogle"]')) {
    adsenseScriptLoaded = true;
    return (adsenseReady = Promise.resolve());
  }

  // Append + wait for `load`. Per CLAUDE.md Lesson E: NEVER use
  // `setTimeout` as a substitute for a real readiness event — the
  // earlier 1000ms guess silently failed on slow networks.
  adsenseReady = new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.addEventListener('load', () => { adsenseScriptLoaded = true; resolve(); }, { once: true });
    script.addEventListener('error', (err) => {
      // Surface AdSense load failures rather than swallowing — Lesson A.
      // The promise still resolves so consumers don't hang; the push
      // will then no-op without polluting their flow.
      console.error('[adunit] AdSense script failed to load:', err);
      resolve();
    }, { once: true });
    document.body.appendChild(script);
  });
  return adsenseReady;
}

export default function AdUnit({ slot, placement, format, className = '' }: AdUnitProps) {
  const { tier, isLoading } = useSubscription();
  const pushed = useRef(false);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
  const resolvedSlot = slot || (placement ? SLOT_MAP[placement] : undefined) || '';
  const resolvedFormat = format || (placement ? FORMAT_MAP[placement] : 'auto') || 'auto';
  const minHeight = placement ? MIN_HEIGHTS[placement] : '';

  useEffect(() => {
    if (isLoading || tier !== 'free' || pushed.current) return;
    if (!clientId) return;

    // Track whether the effect was cleaned up (component unmounted) so
    // we don't push to a stale slot after the user navigated away.
    let cancelled = false;
    ensureAdsenseScript().then(() => {
      if (cancelled) return;
      try {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
          pushed.current = true;
        }
      } catch (err) {
        // Real push failure — surface so we can fix, not silently lose
        // impression revenue (Lesson A).
        console.error('[adunit] adsbygoogle.push failed:', err);
      }
    });
    return () => { cancelled = true; };
  }, [isLoading, tier, clientId]);

  if (isLoading || tier !== 'free') return null;
  if (!clientId) return null;

  return (
    <div className={`ad-container text-center my-6 py-3 rounded-lg border border-gold-primary/8 bg-bg-secondary/20 ${minHeight} ${className}`}>
      <div className="text-[9px] text-text-secondary/30 mb-0.5">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={resolvedSlot}
        data-ad-format={resolvedFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
