'use client';

/**
 * YogaAchievementOverlay — Full-screen overlay showing the rarest yoga badge.
 *
 * Appears after kundali generation when rare yogas are detected.
 * Shows the first (rarest) badge with shimmer animation.
 * Auto-dismisses after 5 seconds if no interaction.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { YogaBadge } from '@/lib/shareable/yoga-badges';
import YogaBadgeCard from './YogaBadgeCard';

interface YogaAchievementOverlayProps {
  badges: YogaBadge[];
  personName: string;
  onDismiss: () => void;
  locale: string;
}

export default function YogaAchievementOverlay({
  badges,
  personName,
  onDismiss,
  locale,
}: YogaAchievementOverlayProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);

  const isHi = locale === 'hi';
  const primaryBadge = badges[0];
  const additionalCount = badges.length - 1;

  const handleDismiss = useCallback(() => {
    setVisible(false);
    // Wait for exit animation before calling onDismiss
    setTimeout(onDismiss, 300);
  }, [onDismiss]);

  useEffect(() => {
    // Trigger enter animation on next frame
    requestAnimationFrame(() => setVisible(true));

    // Auto-dismiss after 5 seconds if user hasn't interacted
    timerRef.current = setTimeout(() => {
      if (!interactedRef.current) {
        handleDismiss();
      }
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [handleDismiss]);

  const handleInteraction = useCallback(() => {
    interactedRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  if (!primaryBadge) return null;

  return (
    <>
      {/* Inline keyframes for shimmer animation */}
      <style>{`
        @keyframes yoga-badge-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes yoga-badge-scale-in {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes yoga-badge-backdrop-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.80)',
          animation: visible
            ? 'yoga-badge-backdrop-in 0.3s ease-out forwards'
            : 'yoga-badge-backdrop-in 0.3s ease-out reverse forwards',
        }}
        onClick={handleDismiss}
        onKeyDown={(e) => { if (e.key === 'Escape') handleDismiss(); }}
        role="dialog"
        aria-modal="true"
        aria-label={isHi ? 'योग उपलब्धि' : 'Yoga Achievement'}
      >
        {/* Card container — stop click propagation */}
        <div
          className="relative max-w-md w-full"
          style={{
            animation: visible
              ? 'yoga-badge-scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
              : 'yoga-badge-scale-in 0.3s ease-in reverse forwards',
          }}
          onClick={(e) => { e.stopPropagation(); handleInteraction(); }}
          onKeyDown={() => {}} // no-op, interaction handled on parent
        >
          {/* Shimmer border wrapper */}
          <div
            className="rounded-3xl p-[2px]"
            style={{
              background: 'linear-gradient(90deg, #8a6d2b, #f0d48a, #d4a853, #8a6d2b, #f0d48a)',
              backgroundSize: '200% 100%',
              animation: 'yoga-badge-shimmer 2s linear infinite',
            }}
          >
            <YogaBadgeCard
              badge={primaryBadge}
              personName={personName}
              format="square"
              locale={locale}
            />
          </div>

          {/* Additional badges count */}
          {additionalCount > 0 && (
            <div className="text-center mt-4 text-text-secondary text-sm">
              {isHi
                ? `और ${additionalCount} उपलब्धि${additionalCount > 1 ? 'याँ' : ''}`
                : `and ${additionalCount} more achievement${additionalCount > 1 ? 's' : ''}`}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={handleDismiss}
              className="px-6 py-2.5 rounded-full text-sm font-medium text-text-primary border border-gold-primary/20 hover:border-gold-primary/40 transition-colors"
            >
              {isHi ? 'चार्ट पर जाएँ →' : 'Continue to Chart →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
