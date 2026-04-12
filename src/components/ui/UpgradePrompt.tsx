'use client';

import { useEffect } from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { type Feature, FEATURE_INFO, minTierForFeature } from '@/lib/subscription/tiers';
import { useSubscriptionStore } from '@/stores/subscription-store';
import { trackUpgradePromptShown, trackUpgradePromptClicked } from '@/lib/analytics';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface UpgradePromptProps {
  feature: Feature;
  compact?: boolean;
  /** Where this prompt was triggered from (page name, component, etc.) */
  source?: string;
}

const TIER_PRICES: Record<string, string> = {
  pro: 'Rs 149/mo or $5/mo',
  jyotishi: 'Rs 499/mo or $15/mo',
};

export default function UpgradePrompt({ feature, compact = false, source = 'unknown' }: UpgradePromptProps) {
  const locale = useLocale();
  const currentTier = useSubscriptionStore(s => s.tier);
  const requiredTier = minTierForFeature(feature);
  const info = FEATURE_INFO[feature];
  const featureName = isDevanagariLocale(locale) ? info.hi : info.en;
  const tierLabel = requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1);
  const price = TIER_PRICES[requiredTier] ?? '';
  const isDevanagari = isDevanagariLocale(locale);

  // Track when the upgrade prompt is shown
  useEffect(() => {
    trackUpgradePromptShown({ feature, currentTier, requiredTier, source });
  }, [feature, currentTier, requiredTier, source]);

  const handleClick = () => {
    trackUpgradePromptClicked({ feature, currentTier, requiredTier, source });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-gold-primary/30 bg-gold-primary/5 px-4 py-2">
        <Lock className="h-4 w-4 text-gold-primary shrink-0" />
        <span className={`text-sm text-gold-primary/90 ${isDevanagari ? 'font-[var(--font-devanagari-body)]' : ''}`}>
          Upgrade to {tierLabel}
        </span>
        <Link
          href={`/${locale}/pricing`}
          onClick={handleClick}
          className="ml-auto text-xs font-semibold text-gold-primary hover:text-gold-light transition-colors underline underline-offset-2"
        >
          View Plans
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 max-w-sm mx-auto p-6 rounded-2xl text-center"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-primary/10 border border-gold-primary/30">
        <Lock className="h-7 w-7 text-gold-primary" />
      </div>

      <h3
        className={`text-lg font-bold text-text-primary mb-1 ${isDevanagari ? 'font-[var(--font-devanagari-heading)]' : ''}`}
      >
        {featureName}
      </h3>

      <p className="text-sm text-text-secondary mb-1">
        Requires <span className="font-semibold text-gold-primary">{tierLabel}</span> plan
      </p>

      {price && (
        <p className="text-xs text-text-secondary/60 mb-5">
          {price}
        </p>
      )}

      <Link
        href={`/${locale}/pricing`}
        onClick={handleClick}
        className="inline-block w-full rounded-xl py-3 px-6 font-semibold text-sm text-bg-primary transition-all
          bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark
          hover:shadow-[0_0_20px_rgba(212,168,83,0.4)] hover:scale-[1.02] active:scale-[0.98]"
      >
        Upgrade Now
      </Link>
    </motion.div>
  );
}
