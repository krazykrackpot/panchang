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

// ── Feature usage events ────────────────────────────────────────────────────

export function trackMatchingComputed(params: { system: string; score: number; verdict: string }) {
  track('matching_computed', params);
}

export function trackHoroscopeViewed(params: { rashi: string; period: 'daily' | 'weekly' | 'monthly'; personalized: boolean }) {
  track('horoscope_viewed', params);
}

export function trackKPChartGenerated(params: { source: 'kundali_tab' | 'kp_page' }) {
  track('kp_chart_generated', params);
}

export function trackCalendarViewed(params: { view: 'western' | 'lunar' | 'grid'; month: number; year: number }) {
  track('calendar_viewed', params);
}

export function trackToolUsed(params: { tool: string }) {
  track('tool_used', params);
}

export function trackLearnModuleViewed(params: { module: string }) {
  track('learn_module_viewed', params);
}

export function trackChartSaved(params: { relationship: string }) {
  track('chart_saved', params);
}

export function trackRectificationRun(params: { eventCount: number; strength: string }) {
  track('rectification_run', params);
}

export function trackShareClicked(params: { platform: string; page: string }) {
  track('share_clicked', params);
}
