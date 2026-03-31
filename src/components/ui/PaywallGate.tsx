'use client';

import { type ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { type Feature } from '@/lib/subscription/tiers';
import UpgradePrompt from './UpgradePrompt';

interface PaywallGateProps {
  feature: Feature;
  children: ReactNode;
  fallback?: ReactNode;
  blurContent?: ReactNode;
}

export default function PaywallGate({ feature, children, fallback, blurContent }: PaywallGateProps) {
  const { canAccess, isLoading } = useSubscription();

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-bg-secondary/30 rounded-xl" />;
  }

  if (canAccess(feature)) {
    return <>{children}</>;
  }

  if (blurContent) {
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none opacity-60">
          {blurContent}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/40 backdrop-blur-[2px] rounded-xl">
          <UpgradePrompt feature={feature} />
        </div>
      </div>
    );
  }

  return <>{fallback || <UpgradePrompt feature={feature} />}</>;
}
