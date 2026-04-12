'use client';

import { useEffect } from 'react';
import { AlertTriangle, Sparkles, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { trackUpgradePromptShown, trackUpgradePromptClicked, trackUsageLimitHit } from '@/lib/analytics';
import { useSubscriptionStore } from '@/stores/subscription-store';

interface UsageLimitBannerProps {
  /** The error type: 'upgrade_required' (feature-gated) or 'usage_limit_reached' (usage-gated) */
  type: 'upgrade_required' | 'usage_limit_reached';
  /** Feature name for display */
  featureName: string;
  /** Machine feature ID for tracking */
  feature: string;
  /** Required tier label */
  requiredTier?: string;
  /** Usage limit that was hit */
  limit?: number;
  /** Custom message from API */
  message?: string;
  /** Source page/component for tracking */
  source: string;
}

const LABELS = {
  en: {
    featureGated: 'Premium Feature',
    usageLimit: 'Usage Limit Reached',
    featureDesc: (name: string, tier: string) =>
      `${name} requires a ${tier} subscription to access.`,
    usageDesc: (name: string, limit: number) =>
      `You have used all ${limit} of your ${name} allowance for this period.`,
    upgradeFor: 'Unlock unlimited access',
    viewPlans: 'View Plans & Upgrade',
  },
  hi: {
    featureGated: 'प्रीमियम सुविधा',
    usageLimit: 'उपयोग सीमा पूर्ण',
    featureDesc: (name: string, tier: string) =>
      `${name} तक पहुँचने के लिए ${tier} सदस्यता आवश्यक है।`,
    usageDesc: (name: string, limit: number) =>
      `आपने इस अवधि के लिए अपनी ${limit} ${name} सीमा का उपयोग कर लिया है।`,
    upgradeFor: 'असीमित पहुँच अनलॉक करें',
    viewPlans: 'योजनाएँ देखें और अपग्रेड करें',
  },
};

export default function UsageLimitBanner({
  type,
  featureName,
  feature,
  requiredTier = 'Pro',
  limit = 0,
  message,
  source,
}: UsageLimitBannerProps) {
  const locale = useLocale() as 'en' | 'hi';
  const currentTier = useSubscriptionStore(s => s.tier);
  const t = LABELS[locale] || LABELS.en;
  const isDevanagari = locale === 'hi';
  const isFeatureGate = type === 'upgrade_required';

  useEffect(() => {
    if (isFeatureGate) {
      trackUpgradePromptShown({ feature, currentTier, requiredTier, source });
    } else {
      trackUsageLimitHit({ feature, tier: currentTier, limit });
    }
  }, [feature, currentTier, requiredTier, source, isFeatureGate, limit]);

  const handleClick = () => {
    trackUpgradePromptClicked({ feature, currentTier, requiredTier, source });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 sm:p-8 text-center max-w-lg mx-auto"
    >
      {/* Icon */}
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-primary/10 border border-gold-primary/25">
        {isFeatureGate ? (
          <Lock className="h-8 w-8 text-gold-primary" />
        ) : (
          <AlertTriangle className="h-8 w-8 text-amber-400" />
        )}
      </div>

      {/* Title */}
      <h3
        className={`text-xl font-bold mb-2 ${isFeatureGate ? 'text-gold-light' : 'text-amber-300'} ${isDevanagari ? 'font-[var(--font-devanagari-heading)]' : ''}`}
      >
        {isFeatureGate ? t.featureGated : t.usageLimit}
      </h3>

      {/* Description */}
      <p
        className={`text-sm text-text-secondary mb-2 leading-relaxed ${isDevanagari ? 'font-[var(--font-devanagari-body)]' : ''}`}
      >
        {message || (isFeatureGate
          ? t.featureDesc(featureName, requiredTier)
          : t.usageDesc(featureName, limit))}
      </p>

      {/* Upgrade pitch */}
      <p className="text-xs text-text-secondary/60 mb-6 flex items-center justify-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-gold-primary" />
        {t.upgradeFor}
      </p>

      {/* CTA */}
      <Link
        href={`/${locale}/pricing`}
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2 w-full max-w-xs rounded-xl py-3 px-6 font-semibold text-sm text-bg-primary transition-all
          bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark
          hover:shadow-[0_0_24px_rgba(212,168,83,0.35)] hover:scale-[1.02] active:scale-[0.98]"
      >
        <Sparkles className="h-4 w-4" />
        {t.viewPlans}
      </Link>
    </motion.div>
  );
}
