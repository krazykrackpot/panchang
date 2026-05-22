/**
 * Stripe payment helpers for Brihaspati (USD path).
 *
 * Provides:
 *   - createCheckoutSession(userId, tier, returnUrl) → session.url
 *   - verifyWebhookEvent(rawBody, signature) → Stripe.Event | null
 *
 * Stripe SDK is dynamically imported. Tests inject a fake client via
 * StripeClientFactory.
 */

import { STRIPE_PRICING, USD_DISPLAY_CENTS } from './pricing';
import type { BrihaspatiPricingTier } from '../types';

export interface StripeLike {
  checkout: {
    sessions: {
      create(opts: StripeSessionCreateOpts): Promise<{ id: string; url: string | null }>;
    };
  };
  webhooks: {
    constructEvent(body: string | Buffer, sig: string, secret: string): { id: string; type: string; data: { object: unknown } };
  };
}

interface StripeSessionCreateOpts {
  mode: 'payment' | 'subscription';
  line_items: { price: string; quantity: number }[];
  success_url: string;
  cancel_url: string;
  customer_email?: string;
  customer?: string;
  metadata?: Record<string, string>;
  // The real Stripe SDK supports many more fields; we type only what we use.
}

let defaultClient: StripeLike | null = null;
async function loadDefault(): Promise<StripeLike> {
  if (!defaultClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
    if (!secretKey) throw new Error('[brihaspati] STRIPE_SECRET_KEY not set');
    const { default: Stripe } = await import('stripe');
    defaultClient = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
      maxNetworkRetries: 3,
    }) as unknown as StripeLike;
  }
  return defaultClient;
}

export interface CreateCheckoutInput {
  userId: string;
  questionId: string;
  tier: BrihaspatiPricingTier;
  /** ISO 4217. INR routes via the *_INR Price IDs (option A — Razorpay
   *  deferred until we have an Indian entity). USD via the default ones. */
  currency: 'USD' | 'INR';
  userEmail?: string;
  returnUrlBase: string;
  /** Override client for tests. */
  client?: StripeLike;
}

export interface CreateCheckoutResult {
  sessionId: string;
  url: string;
}

/**
 * Create a Stripe Checkout Session. Returns the redirect URL.
 * Single + pack_5 use mode=payment; monthly + annual use mode=subscription.
 */
export async function createCheckoutSession(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
  const { userId, questionId, tier, currency, userEmail, returnUrlBase } = input;
  const client = input.client ?? (await loadDefault());
  const pricing = STRIPE_PRICING[tier];
  const envKey = currency === 'INR' ? pricing.priceEnvInr : pricing.priceEnv;
  const priceId = process.env[envKey]?.trim();
  if (!priceId) {
    throw new Error(`[brihaspati] ${envKey} not configured`);
  }

  const session = await client.checkout.sessions.create({
    mode: pricing.mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrlBase}/brihaspati/return?session_id={CHECKOUT_SESSION_ID}&status=success&q=${encodeURIComponent(questionId)}`,
    cancel_url: `${returnUrlBase}/brihaspati/return?status=cancelled&q=${encodeURIComponent(questionId)}`,
    ...(userEmail ? { customer_email: userEmail } : {}),
    metadata: {
      user_id: userId,
      question_id: questionId,
      tier,
      brihaspati: 'true',
    },
  });

  if (!session.url) {
    throw new Error('[brihaspati] Stripe session.url missing');
  }
  return { sessionId: session.id, url: session.url };
}

/**
 * Verify + parse a Stripe webhook event. Returns the parsed event or
 * null on signature failure. Caller is responsible for idempotency via
 * brihaspati_webhook_events table.
 */
export async function verifyWebhookEvent(
  rawBody: string,
  signature: string,
  webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET_BRIHASPATI?.trim() ?? '',
  client?: StripeLike,
): Promise<{ id: string; type: string; data: { object: unknown } } | null> {
  if (!webhookSecret) return null;
  const c = client ?? (await loadDefault());
  try {
    return c.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('[brihaspati] stripe webhook verify failed:', err);
    return null;
  }
}

/** Display amount for the panel UI — read from the catalogue, never recomputed. */
export function displayCents(tier: BrihaspatiPricingTier): number {
  return USD_DISPLAY_CENTS[tier];
}

/** For tests only. */
export function __resetDefaultClientForTests() {
  defaultClient = null;
}
