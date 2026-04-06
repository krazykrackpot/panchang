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
