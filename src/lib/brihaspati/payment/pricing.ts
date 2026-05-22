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
  /** Stripe Price ID env var key for USD billing. */
  priceEnv: string;
  /** Stripe Price ID env var key for INR billing. Resolves the option-A
   *  decision (REVIEW: Razorpay deferred; INR via Stripe at launch). */
  priceEnvInr: string;
  mode: 'payment' | 'subscription';
}

export const RAZORPAY_PRICING: Record<BrihaspatiPricingTier, RazorpayPricing> = {
  // single raised from 4900 → 9900 paise (₹49 → ₹99) because Stripe's
  // settlement-currency minimum (CHF 0.50 ≈ ₹52) rejects anything lower
  // when the merchant settles in CHF. When option C (Razorpay via Indian
  // entity) lands, single can drop back to 4900 because Razorpay
  // settles natively in INR.
  single:  { amountPaise: 9900,    planEnv: null,                                       oneOff: true },
  pack_5:  { amountPaise: 19900,   planEnv: null,                                       oneOff: true },
  monthly: { amountPaise: null,    planEnv: 'RAZORPAY_PLAN_BRIHASPATI_MONTHLY',         oneOff: false },
  annual:  { amountPaise: null,    planEnv: 'RAZORPAY_PLAN_BRIHASPATI_ANNUAL',          oneOff: false },
};

export const STRIPE_PRICING: Record<BrihaspatiPricingTier, StripePricing> = {
  single:  { priceEnv: 'STRIPE_PRICE_BRIHASPATI_SINGLE',  priceEnvInr: 'STRIPE_PRICE_BRIHASPATI_SINGLE_INR',  mode: 'payment'      },
  pack_5:  { priceEnv: 'STRIPE_PRICE_BRIHASPATI_PACK_5',  priceEnvInr: 'STRIPE_PRICE_BRIHASPATI_PACK_5_INR',  mode: 'payment'      },
  monthly: { priceEnv: 'STRIPE_PRICE_BRIHASPATI_MONTHLY', priceEnvInr: 'STRIPE_PRICE_BRIHASPATI_MONTHLY_INR', mode: 'subscription' },
  annual:  { priceEnv: 'STRIPE_PRICE_BRIHASPATI_ANNUAL',  priceEnvInr: 'STRIPE_PRICE_BRIHASPATI_ANNUAL_INR',  mode: 'subscription' },
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
  single: 9900,
  pack_5: 19900,
  monthly: 29900,
  annual: 199900,
};
