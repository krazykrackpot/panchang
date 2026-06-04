/**
 * /api/pandit/billing-portal
 *
 * POST — generate a Stripe billing-portal session URL for the
 *        authenticated Pandit so they can update card, cancel, or
 *        download invoices without leaving the dashboard. Returns
 *        404 if the Pandit has no Stripe customer on file (free
 *        tier — no portal to send them to).
 *
 * Auth: Bearer JWT of an account_type='pandit' user.
 *
 * Pandit CRM P10.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';
import { BASE_URL } from '@/lib/seo/base-url';
import { getPanditSubscription } from '@/lib/pandit/subscription';

interface PortalBody {
  /** Locale to return to (round-tripped through Stripe). */
  locale?: string;
}

const VALID_LOCALES = new Set([
  'en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr',
]);
function safeLocale(v: unknown): string {
  return typeof v === 'string' && VALID_LOCALES.has(v) ? v : 'en';
}

export async function POST(req: Request) {
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase, userId } = auth;

  const secretKey = (process.env.STRIPE_SECRET_KEY ?? '').trim();
  if (!secretKey) {
    console.error('[pandit/billing-portal] STRIPE_SECRET_KEY missing');
    return NextResponse.json({ error: 'payment_not_configured' }, { status: 503 });
  }

  // Optional locale body — silently defaults if missing/invalid.
  let body: PortalBody = {};
  try {
    const raw = await req.json();
    if (raw && typeof raw === 'object') body = raw as PortalBody;
  } catch {
    // Empty body is OK.
  }
  const locale = safeLocale(body.locale);

  try {
    const sub = await getPanditSubscription(supabase, userId);
    if (!sub.provider_customer_id || sub.provider !== 'stripe') {
      return NextResponse.json(
        { error: 'no_billing_account', message: 'Subscribe to a Pandit plan first to access billing.' },
        { status: 404 },
      );
    }

    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
      maxNetworkRetries: 3,
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.provider_customer_id,
      return_url: `${BASE_URL}/${locale}/dashboard/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[pandit/billing-portal] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
