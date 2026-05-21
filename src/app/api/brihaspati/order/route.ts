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
import {
  BRIHASPATI_PRICING_TIERS,
  BRIHASPATI_LAUNCH_LOCALES,
  BRIHASPATI_FALLBACK_LOCALES,
  type BrihaspatiPricingTier,
} from '@/lib/brihaspati/types';

const ALL_LOCALES = new Set<string>([...BRIHASPATI_LAUNCH_LOCALES, ...BRIHASPATI_FALLBACK_LOCALES]);
const PRICING_TIERS = new Set<string>(BRIHASPATI_PRICING_TIERS);

function originOf(req: NextRequest): string {
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  const host = req.headers.get('host') || 'dekhopanchang.com';
  return `${proto}://${host}`;
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
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7));
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: { question?: unknown; locale?: unknown; tier?: unknown; currency?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const question = typeof body.question === 'string' ? body.question.trim() : '';
    const locale = typeof body.locale === 'string' ? body.locale : 'en';
    const tier = body.tier as string;
    const currency = body.currency as string;

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

    // Rate-limit: 10/hr free, 60/hr subscriber (subscriber check via app code in main route)
    const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
    const { count, error: rateErr } = await supabase
      .from('brihaspati_questions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gt('created_at', oneHourAgo);
    if (rateErr) {
      console.error('[brihaspati/order] rate-limit check failed:', rateErr.message);
    } else if ((count ?? 0) >= 60) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { category } = classify(question, locale);

    // Pre-create the question row with status='pending' so the order can
    // reference it. payment_verified=false until the order completes.
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
      if (currency === 'INR') {
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
        amount: displayCents(pricingTier),
        currency: 'USD',
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
