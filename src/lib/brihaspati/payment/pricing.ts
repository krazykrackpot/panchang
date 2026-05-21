/**
 * Pricing catalogue + env-var lookup for Brihaspati tiers.
 *
 * Source of truth for the four pricing tiers (single, pack_5, monthly,
 * annual) and how each maps to a Razorpay amount/plan or a Stripe price.
 *
 * Pure data + helpers; no SDK imports. The actual order/session
 * creation lives in razorpay.ts and stripe.ts.
 */

import type { BrihaspatiPricingTier } from '../types';

export interface RazorpayPricing {
  /** One-off amount in paise; null for subscriptions (plan_id used instead). */
  amountPaise: number | null;
  /** Razorpay plan_id env var key for recurring tiers. */
  planEnv: string | null;
  /** True for single + pack_5 (one-time orders). */
  oneOff: boolean;
}

export interface StripePricing {
  /** Stripe Price ID env var key. */
  priceEnv: string;
  mode: 'payment' | 'subscription';
}

export const RAZORPAY_PRICING: Record<BrihaspatiPricingTier, RazorpayPricing> = {
  single:  { amountPaise: 4900,    planEnv: null,                                       oneOff: true },
  pack_5:  { amountPaise: 19900,   planEnv: null,                                       oneOff: true },
  monthly: { amountPaise: null,    planEnv: 'RAZORPAY_PLAN_BRIHASPATI_MONTHLY',         oneOff: false },
  annual:  { amountPaise: null,    planEnv: 'RAZORPAY_PLAN_BRIHASPATI_ANNUAL',          oneOff: false },
};

export const STRIPE_PRICING: Record<BrihaspatiPricingTier, StripePricing> = {
  single:  { priceEnv: 'STRIPE_PRICE_BRIHASPATI_SINGLE',  mode: 'payment'      },
  pack_5:  { priceEnv: 'STRIPE_PRICE_BRIHASPATI_PACK_5',  mode: 'payment'      },
  monthly: { priceEnv: 'STRIPE_PRICE_BRIHASPATI_MONTHLY', mode: 'subscription' },
  annual:  { priceEnv: 'STRIPE_PRICE_BRIHASPATI_ANNUAL',  mode: 'subscription' },
};

/**
 * USD amounts (cents) used for display + cross-check. The actual
 * checkout reads from the Stripe Price object via the env-configured
 * Price ID — these constants document intent.
 */
export const USD_DISPLAY_CENTS: Record<BrihaspatiPricingTier, number> = {
  single: 99,
  pack_5: 299,
  monthly: 399,
  annual: 2499,
};

export const INR_DISPLAY_PAISE: Record<BrihaspatiPricingTier, number> = {
  single: 4900,
  pack_5: 19900,
  monthly: 29900,
  annual: 199900,
};
