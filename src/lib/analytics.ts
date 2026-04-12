'use client';

import { track } from '@vercel/analytics';

export function trackKundaliGenerated(params: { location: string; hasBirthTime: boolean }) {
  track('kundali_generated', params);
}

export function trackChartExported(params: { format: 'pdf'; tabCount: number }) {
  track('chart_exported', params);
}

export function trackSubscriptionStarted(params: { tier: 'pro' | 'jyotishi'; period: 'monthly' | 'annual'; currency: 'usd' | 'inr' }) {
  track('subscription_started', params);
}

export function trackTabViewed(params: { tab: string; chartId?: string }) {
  track('tab_viewed', params);
}

// ── Conversion funnel events ─────────────────────────────────────────────────

export function trackUpgradePromptShown(params: { feature: string; currentTier: string; requiredTier: string; source: string }) {
  track('upgrade_prompt_shown', params);
}

export function trackUpgradePromptClicked(params: { feature: string; currentTier: string; requiredTier: string; source: string }) {
  track('upgrade_prompt_clicked', params);
}

export function trackCheckoutStarted(params: { tier: 'pro' | 'jyotishi'; billing: 'monthly' | 'annual'; currency: 'usd' | 'inr' }) {
  track('checkout_started', params);
}

export function trackCheckoutCompleted(params: { tier: string; provider: string }) {
  track('checkout_completed', params);
}

export function trackUsageLimitHit(params: { feature: string; tier: string; limit: number }) {
  track('usage_limit_hit', params);
}
