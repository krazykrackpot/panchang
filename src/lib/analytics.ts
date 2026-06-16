'use client';

import { track } from '@vercel/analytics';
import { getUtmParams, getReferrerContext } from './utm';
import { getSupabase } from './supabase/client';

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

/**
 * Track a UTM-attributed event. Sends to both Vercel Analytics
 * (with UTM as custom props) and our Supabase utm_visits table.
 * No-ops silently if no UTM data exists (organic visit).
 */
export async function trackUtmEvent(
  event: string,
  metadata?: Record<string, unknown>,
  options?: { landingPage?: string }
): Promise<void> {
  const utm = getUtmParams();
  const ref = getReferrerContext();

  // Attach UTM to Vercel Analytics too
  if (utm) {
    track(event, {
      ...metadata,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    });
  }

  // Send to our Supabase table (UTM visits or notable referrers)
  const ctx = utm || ref;
  if (!ctx) return;

  // `options.landingPage` lets the caller pin the path that was current
  // when the event was *generated*, instead of letting us read
  // `window.location.pathname` at *send time*. This matters for
  // page_engagement on SPA navigation: the beacon fires from the OLD
  // route's effect-cleanup, but by the time `fetch()` runs the URL has
  // already moved to the NEW route. Without an override, the
  // server-side dedup key `${sessionId}|${event}|${landingPage}` would
  // collide between back-to-back routes and drop legitimate events.
  // PR #393 follow-up.
  const landingPage = options?.landingPage
    ?? (typeof window !== 'undefined' ? window.location.pathname : undefined);

  // Fetch the supabase access token if the user is signed in so the server
  // can stamp utm_visits.user_id. The route accepts anonymous events too;
  // the header is optional. getSession() reads from local storage and is
  // synchronous-cheap — no network call. If unavailable (cold boot, SSR-
  // adjacent, store not yet hydrated) we just omit the header.
  let accessToken: string | undefined;
  try {
    const sb = getSupabase();
    if (sb) {
      const { data } = await sb.auth.getSession();
      accessToken = data.session?.access_token;
    }
  } catch {
    // Don't let analytics block on auth — fall through anonymously.
  }

  // Fire and forget
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  fetch('/api/track-utm', {
    method: 'POST',
    headers,
    keepalive: true, // Ensure request completes even on page unload/navigation
    body: JSON.stringify({
      event,
      sessionId: ctx.sessionId,
      utmSource: utm?.utm_source,
      utmMedium: utm?.utm_medium,
      utmCampaign: utm?.utm_campaign,
      utmContent: utm?.utm_content,
      utmTerm: utm?.utm_term,
      landingPage,
      referrer: 'referrer' in ctx ? ctx.referrer : undefined,
      metadata,
    }),
  }).catch((err) => {
    console.error('[analytics] UTM track failed:', err);
  });
}

// ── Brihaspati AI Astrologer events (spec §Telemetry) ────────────────────────

export function trackBrihaspatiBannerShown(params: { page: string; locale: string }) {
  track('brihaspati_banner_shown', params);
}

export function trackBrihaspatiBannerDismissed() {
  track('brihaspati_banner_dismissed', {});
}

export function trackBrihaspatiPanelOpened(params: { entry: 'button' | 'banner' | 'kundali_tab' | 'oauth_return' | 'chart_add_return' }) {
  track('brihaspati_panel_opened', params);
}

export function trackBrihaspatiPromptSelected(params: { category: string; promptIndex: number }) {
  track('brihaspati_prompt_selected', params);
}

export function trackBrihaspatiQuestionTyped(params: { lengthBucket: 'small' | 'medium' | 'large'; locale: string }) {
  track('brihaspati_question_typed', params);
}

export function trackBrihaspatiPaymentStarted(params: { tier: string; currency: 'INR' | 'USD' }) {
  track('brihaspati_payment_started', params);
}

export function trackBrihaspatiPaymentCompleted(params: { tier: string; currency: 'INR' | 'USD'; amount: number }) {
  track('brihaspati_payment_completed', params);
}

export function trackBrihaspatiPaymentFailed(params: { tier: string; errorCode: string }) {
  track('brihaspati_payment_failed', params);
}

export function trackBrihaspatiAnswerStreamed(params: {
  category: string;
  model: string;
  validationPassed: boolean | null;
  outputTokens: number;
  latencyMs: number;
}) {
  // Vercel Analytics accepts string|number|boolean|null in custom event props;
  // booleans stay as bool for cleaner filtering.
  track('brihaspati_answer_streamed', {
    category: params.category,
    model: params.model,
    validation_passed: params.validationPassed,
    output_tokens: params.outputTokens,
    latency_ms: params.latencyMs,
  });
}

export function trackBrihaspatiAnswerRated(params: { rating: -1 | 1; category: string; model: string; hasReason: boolean }) {
  track('brihaspati_answer_rated', params);
}

export function trackBrihaspatiUpsellShown(params: { fromTier: string; toTier: string }) {
  track('brihaspati_upsell_shown', params);
}

export function trackBrihaspatiUpsellTaken(params: { fromTier: string; toTier: string }) {
  track('brihaspati_upsell_taken', params);
}

export function trackBrihaspatiAnswerShared(params: { channel: 'whatsapp' | 'email' }) {
  track('brihaspati_answer_shared', params);
}

export function trackBrihaspatiTrainingOptOutToggled(params: { to: boolean }) {
  track('brihaspati_training_opt_out_toggled', params);
}

export function trackPageEngagement(params: {
  route: string;
  scrollMaxBucket: 0 | 25 | 50 | 75 | 100;
  dwellBucket: '0-5s' | '5-30s' | '30s-2m' | '2-5m' | '5m+';
}) {
  // Pin `landingPage` to the closure-captured route so the
  // server-side dedup key uses the route the engagement is ABOUT,
  // not whatever `window.location.pathname` happens to be when the
  // beacon flushes (which during SPA navigation is already the next
  // route). See `trackUtmEvent`'s `options.landingPage` comment.
  trackUtmEvent('page_engagement', params, { landingPage: params.route });
}
