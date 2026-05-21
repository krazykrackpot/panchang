/**
 * Razorpay payment helpers for Brihaspati.
 *
 * Provides:
 *   - createOrder(userId, tier) → order_id for one-offs (single, pack_5)
 *     or subscription_id for monthly / annual
 *   - verifyPaymentSignature(orderId, paymentId, signature) → boolean
 *   - verifyWebhookSignature(rawBody, signature) → boolean
 *
 * Razorpay SDK is dynamically imported so server-only code never gets
 * bundled into client builds. Tests inject a fake SDK via the
 * `RazorpayClientFactory` so we don't hit the network.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { RAZORPAY_PRICING, INR_DISPLAY_PAISE } from './pricing';
import type { BrihaspatiPricingTier } from '../types';

export interface RazorpayLike {
  orders: {
    create(opts: {
      amount: number;
      currency: 'INR';
      receipt?: string;
      notes?: Record<string, string>;
    }): Promise<{ id: string; amount: number; currency: string; receipt?: string }>;
  };
  subscriptions: {
    create(opts: {
      plan_id: string;
      total_count: number;
      notes?: Record<string, string>;
    }): Promise<{ id: string; short_url?: string }>;
  };
}

export type RazorpayClientFactory = () => RazorpayLike;

let defaultFactory: RazorpayClientFactory | null = null;
async function loadDefault(): Promise<RazorpayLike> {
  if (!defaultFactory) {
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keyId || !keySecret) {
      throw new Error('[brihaspati] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set');
    }
    const Razorpay = (await import('razorpay')).default;
    defaultFactory = () => new Razorpay({ key_id: keyId, key_secret: keySecret }) as unknown as RazorpayLike;
  }
  return defaultFactory();
}

export interface CreateOrderResult {
  kind: 'order' | 'subscription';
  /** Order ID or subscription ID. */
  id: string;
  /** Razorpay subscription short_url (for redirect) when kind=subscription. */
  shortUrl?: string;
  /** Amount in paise (for one-offs). */
  amountPaise?: number;
}

export interface CreateOrderInput {
  userId: string;
  questionId: string;
  tier: BrihaspatiPricingTier;
  /** Override client for tests. */
  client?: RazorpayLike;
}

/**
 * Create a Razorpay order (one-off) or subscription (recurring) per
 * the user's selected tier. Caller persists the returned id onto the
 * brihaspati_questions row before redirecting the user to checkout.
 */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const { userId, questionId, tier } = input;
  const client = input.client ?? (await loadDefault());
  const pricing = RAZORPAY_PRICING[tier];

  if (pricing.oneOff) {
    const order = await client.orders.create({
      amount: pricing.amountPaise!,
      currency: 'INR',
      receipt: `bri_${questionId.slice(0, 24)}`,
      notes: { user_id: userId, question_id: questionId, tier },
    });
    return { kind: 'order', id: order.id, amountPaise: order.amount };
  }

  const planId = process.env[pricing.planEnv!]?.trim();
  if (!planId) {
    throw new Error(`[brihaspati] ${pricing.planEnv} not configured`);
  }
  const sub = await client.subscriptions.create({
    plan_id: planId,
    total_count: tier === 'annual' ? 1 : 12,
    notes: { user_id: userId, question_id: questionId, tier },
  });
  return { kind: 'subscription', id: sub.id, shortUrl: sub.short_url };
}

/**
 * Verify the HMAC signature returned by the Razorpay checkout widget
 * after a successful one-off payment. Per Razorpay docs:
 *   expected_signature = HMAC_SHA256(order_id + '|' + payment_id, secret)
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string = process.env.RAZORPAY_KEY_SECRET?.trim() ?? '',
): boolean {
  if (!secret) return false;
  if (!orderId || !paymentId || !signature) return false;
  const expected = createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return safeEqual(expected, signature);
}

/**
 * Verify a Razorpay webhook payload signature. The webhook signature
 * is HMAC-SHA256 of the RAW request body using the dedicated webhook
 * secret (NOT the key_secret).
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string = process.env.RAZORPAY_WEBHOOK_SECRET_BRIHASPATI?.trim() ?? '',
): boolean {
  if (!webhookSecret) return false;
  if (!signature) return false;
  const expected = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  return safeEqual(expected, signature);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

/** Display amount for the panel UI — read from the catalogue, never recomputed. */
export function displayPaise(tier: BrihaspatiPricingTier): number {
  return INR_DISPLAY_PAISE[tier];
}

/** For tests only. */
export function __resetDefaultFactoryForTests() {
  defaultFactory = null;
}
