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

export default function AdUnit({ slot, placement, format, className = '' }: AdUnitProps) {
  const { tier, isLoading } = useSubscription();
  const pushed = useRef(false);

  const resolvedSlot = slot || (placement ? SLOT_MAP[placement] : undefined) || '';
  const resolvedFormat = format || (placement ? FORMAT_MAP[placement] : 'auto') || 'auto';
  const minHeight = placement ? MIN_HEIGHTS[placement] : '';

  useEffect(() => {
    if (isLoading || tier !== 'free' || pushed.current) return;
    if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) return;
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch { /* AdSense not loaded */ }
  }, [isLoading, tier]);

  if (isLoading || tier !== 'free') return null;
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) return null;

  return (
    <div className={`ad-container text-center my-6 py-3 rounded-lg border border-gold-primary/8 bg-bg-secondary/20 ${minHeight} ${className}`}>
      <div className="text-[9px] text-text-secondary/30 mb-0.5">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={resolvedSlot}
        data-ad-format={resolvedFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
