/**
 * POST /api/brihaspati/order
 *
 * Create a Razorpay order (INR) or Stripe Checkout session (USD) for
 * the user's selected pricing tier, and pre-create the question row in
 * brihaspati_questions with status='pending'.
 *
 * Body: { question: string, locale: string, tier: 'single'|'pack_5'|'monthly'|'annual', currency: 'INR'|'USD' }
 * Returns: { questionId, provider, orderId?, sessionUrl?, amount, currency }
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { classify } from '@/lib/brihaspati/classifier';
import { createOrder as createRazorpayOrder, displayPaise } from '@/lib/brihaspati/payment/razorpay';
import { createCheckoutSession, displayCents } from '@/lib/brihaspati/payment/stripe';
import { detectSubject, type SavedChartRef } from '@/lib/brihaspati/router/subject-detector';
import { detectRelativeMention, type Relative } from '@/lib/brihaspati/router/relative-detector';
import {
  BRIHASPATI_PRICING_TIERS,
  BRIHASPATI_LAUNCH_LOCALES,
  BRIHASPATI_FALLBACK_LOCALES,
  type BrihaspatiPricingTier,
} from '@/lib/brihaspati/types';

const ALL_LOCALES = new Set<string>([...BRIHASPATI_LAUNCH_LOCALES, ...BRIHASPATI_FALLBACK_LOCALES]);
const PRICING_TIERS = new Set<string>(BRIHASPATI_PRICING_TIERS);

// Open-redirect guard: the Stripe checkout returnUrlBase must come from a
// server-controlled value, NOT from request headers. A spoofed Host or
// x-forwarded-proto would otherwise let an attacker route Stripe's
// success/cancel redirect to attacker.com (phishing post-payment).
// Strip a trailing slash so concatenated paths don't end up with `//`.
function originOf(_req: NextRequest): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim().replace(/\/$/, '');
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Not configured' }, { status: 503 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7).trim());
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: { question?: unknown; locale?: unknown; tier?: unknown; currency?: unknown; subjectChartId?: unknown; useParentBhavaProxy?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const question = typeof body.question === 'string' ? body.question.trim() : '';
    const locale = typeof body.locale === 'string' ? body.locale : 'en';
    const tier = body.tier as string;
    const currency = body.currency as string;
    // Explicit picker override from the panel; null/undefined = auto-detect from question.
    const subjectChartIdInput = typeof body.subjectChartId === 'string' && body.subjectChartId.length > 0
      ? body.subjectChartId
      : null;
    // Client confirmation that they want to proceed with the parent's
    // chart as a Bhava-proxy when no relative chart is on file. See the
    // NO_RELATIVE_CHART branch below — the client first hits the order
    // endpoint, gets a 422 with the relative + Bhava info, shows a
    // modal, and resubmits with useParentBhavaProxy=true if the user
    // picks "read from my chart's Nth house" instead of adding the
    // relative's chart.
    const useParentBhavaProxy = body.useParentBhavaProxy === true;

    if (!question || question.length < 3 || question.length > 500) {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }
    if (!ALL_LOCALES.has(locale)) {
      return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
    }
    if (!PRICING_TIERS.has(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }
    if (currency !== 'INR' && currency !== 'USD') {
      return NextResponse.json({ error: 'Invalid currency' }, { status: 400 });
    }

    // Rate-limit: 10/hr free, 60/hr subscriber (subscriber check via app code in main route).
    // FAIL CLOSED on query failure: a Supabase outage previously meant the
    // route silently allowed unlimited orders (rateErr path fell through
    // to the order creation, which spends real Anthropic + Stripe credits).
    // Audit H5.
    const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
    const { count, error: rateErr } = await supabase
      .from('brihaspati_questions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gt('created_at', oneHourAgo);
    if (rateErr) {
      console.error('[brihaspati/order] rate-limit check failed:', rateErr.message);
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }
    if ((count ?? 0) >= 60) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { category } = classify(question, locale);

    // Resolve the subject chart (self or family member). Explicit picker
    // value wins; otherwise auto-detect from the question text using
    // saved-chart labels. Validate every chartId against the user's own
    // saved_charts to prevent IDOR / cross-tenant access.
    let subjectChartId: string | null = null;
    // Set when the user opts to proceed with the parent-Bhava proxy — the
    // prompt builder reads this from context_json and frames the answer
    // through the asker's own Nth house. See relative-detector.ts.
    let parentBhavaProxy: { bhava: number; relative: Relative; label: { en: string; hi: string } } | null = null;
    {
      const { data: charts, error: chartsErr } = await supabase
        .from('saved_charts')
        .select('id, label, is_primary, relationship')
        .eq('user_id', user.id);
      if (chartsErr) {
        // FAIL CLOSED — this is a paid flow. Continuing with an empty
        // refs[] would route the order to the wrong subject (or the
        // "no chart on file" path) and the user pays for a reading
        // computed against the wrong birth data. Audit Round 2.
        console.error('[brihaspati/order] saved charts load failed:', chartsErr.message);
        return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
      }
      const refs: SavedChartRef[] = (charts ?? []).map((c) => ({
        id: c.id as string,
        label: c.label as string,
        is_primary: c.is_primary as boolean,
      }));
      // Index by relationship for the relative-mention guard. saved_charts
      // .relationship is free-text per user but the chart editor stores
      // canonical lowercase values aligned with our Relative union.
      type FamilyChart = { id: string; relationship: string | null; is_primary: boolean };
      const familyCharts: FamilyChart[] = (charts ?? []).map((c) => ({
        id: c.id as string,
        relationship: ((c.relationship as string | null) ?? '').toLowerCase().trim() || null,
        is_primary: c.is_primary as boolean,
      }));

      if (subjectChartIdInput) {
        // Explicit override — must belong to this user.
        const found = refs.find((r) => r.id === subjectChartIdInput);
        if (!found) {
          return NextResponse.json({ error: 'Invalid subjectChartId' }, { status: 400 });
        }
        // Treat the primary chart as "self" (null) so we still go through
        // the kundali_snapshots path for the asker themselves. This keeps
        // the existing snapshot pipeline as the source of truth for the
        // asker and only uses the saved-chart path for family members.
        subjectChartId = found.is_primary ? null : found.id;
      } else {
        const detect = detectSubject(question, refs);
        if (detect.chartId) {
          const matched = refs.find((r) => r.id === detect.chartId);
          subjectChartId = matched && matched.is_primary ? null : detect.chartId;
        }
      }

      // ── Relative-mention guard ──
      // If no chart resolved (subjectChartId is null) AND the question
      // mentions a relative (daughter / wife / mother / etc.), check
      // whether the user has a saved chart tagged with that relationship.
      // If yes → use it silently. If no → require the user to either add
      // the relative's chart, or explicitly opt into a parent-Bhava proxy
      // reading. Without this guard we'd silently answer about the wrong
      // chart (Lesson A — never silently swallow a routing failure).
      if (!subjectChartId && !subjectChartIdInput) {
        const rel = detectRelativeMention(question);
        if (rel) {
          // Map our internal Relative enum to plausible canonical strings
          // the chart-editor might have stored. We accept any of these.
          const acceptableRelationshipTags: Record<Relative, string[]> = {
            daughter: ['daughter', 'child'],
            son: ['son', 'child'],
            child: ['child', 'son', 'daughter'],
            spouse: ['spouse', 'wife', 'husband', 'partner'],
            mother: ['mother', 'parent'],
            father: ['father', 'parent'],
            sibling: ['sibling', 'brother', 'sister'],
            parent: ['parent', 'mother', 'father'],
          };
          const wanted = acceptableRelationshipTags[rel.relative];
          const familyMatch = familyCharts.find(
            (c) => !c.is_primary && c.relationship && wanted.includes(c.relationship),
          );
          if (familyMatch) {
            subjectChartId = familyMatch.id;
          } else if (useParentBhavaProxy) {
            // User explicitly opted into reading from their own chart.
            parentBhavaProxy = {
              bhava: rel.bhava,
              relative: rel.relative,
              label: rel.bhavaLabel,
            };
          } else {
            // Block until the user confirms an alternative. The client
            // panel surfaces this 422 as a modal: "we don't have your
            // daughter's chart — add her birth details, or read from
            // your 5th house instead?".
            return NextResponse.json({
              error: 'NO_RELATIVE_CHART',
              relative: rel.relative,
              term: rel.term,
              bhava: rel.bhava,
              bhavaLabel: rel.bhavaLabel,
            }, { status: 422 });
          }
        }
      }
    }

    // Pre-create the question row with status='pending' so the order can
    // reference it. payment_verified=false until the order completes.
    // context_json carries the parent-Bhava-proxy directive forward to
    // the narration phase when the user opted to read from their own
    // chart's house instead of a missing relative's chart.
    const { data: row, error: insertErr } = await supabase
      .from('brihaspati_questions')
      .insert({
        user_id: user.id,
        question,
        locale,
        query_category: category,
        pricing_tier: tier,
        provider: currency === 'INR' ? 'razorpay' : 'stripe',
        status: 'pending',
        payment_verified: false,
        subject_saved_chart_id: subjectChartId,
        context_json: parentBhavaProxy ? { parentBhavaProxy } : null,
      })
      .select('id')
      .single();
    if (insertErr || !row) {
      console.error('[brihaspati/order] insert question failed:', insertErr?.message);
      return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
    }
    const questionId = String(row.id);

    const pricingTier = tier as BrihaspatiPricingTier;
    try {
      // Decision (2026-05-22): route BOTH currencies through Stripe.
      // Razorpay requires an Indian business entity which we don't have
      // yet; option A in REVIEW_TRACKER (Stripe with INR) ships now.
      // The Razorpay code path (`src/lib/brihaspati/payment/razorpay.ts`)
      // stays in the repo, dormant, ready for the future C cut-over when
      // an Indian entity is set up.
      //
      // Feature-flag escape hatch: if BRIHASPATI_RAZORPAY_ENABLED=true
      // we use the legacy Razorpay path. Off by default.
      const razorpayEnabled = process.env.BRIHASPATI_RAZORPAY_ENABLED?.trim() === 'true';
      if (currency === 'INR' && razorpayEnabled) {
        const order = await createRazorpayOrder({ userId: user.id, questionId, tier: pricingTier });
        await supabase
          .from('brihaspati_questions')
          .update({ payment_ref: order.id })
          .eq('id', questionId);
        return NextResponse.json({
          questionId,
          provider: 'razorpay',
          orderId: order.id,
          shortUrl: order.shortUrl,
          amount: order.amountPaise ?? displayPaise(pricingTier),
          currency: 'INR',
          keyId: process.env.RAZORPAY_KEY_ID?.trim() ?? '',
        });
      }

      const session = await createCheckoutSession({
        userId: user.id,
        questionId,
        tier: pricingTier,
        currency: currency as 'USD' | 'INR',
        userEmail: user.email,
        returnUrlBase: originOf(req),
      });
      await supabase
        .from('brihaspati_questions')
        .update({ payment_ref: session.sessionId })
        .eq('id', questionId);
      return NextResponse.json({
        questionId,
        provider: 'stripe',
        sessionId: session.sessionId,
        sessionUrl: session.url,
        amount: currency === 'INR' ? displayPaise(pricingTier) : displayCents(pricingTier),
        currency,
      });
    } catch (err) {
      console.error('[brihaspati/order] order create failed:', err);
      // Roll back the pending row so the user can retry without it lingering.
      await supabase.from('brihaspati_questions').delete().eq('id', questionId);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 502 });
    }
  } catch (err) {
    console.error('[brihaspati/order] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
