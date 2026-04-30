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

/** Load AdSense script on-demand — only when an AdUnit actually renders.
 * This avoids the 356KB+ script cost on pages without ads. */
let adsenseScriptLoaded = false;
function ensureAdsenseScript() {
  if (adsenseScriptLoaded || typeof window === 'undefined') return;
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
  if (!clientId) return;
  if (document.querySelector(`script[src*="adsbygoogle"]`)) { adsenseScriptLoaded = true; return; }
  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  document.body.appendChild(script);
  adsenseScriptLoaded = true;
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
    // Load AdSense script on-demand (not globally in layout)
    ensureAdsenseScript();
    // Wait for script to load, then push
    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
          pushed.current = true;
        }
      } catch { /* AdSense not loaded yet */ }
    }, 1000);
    return () => clearTimeout(timer);
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
