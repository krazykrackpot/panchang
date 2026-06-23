/**
 * Catalogue of kundali-paywall products. Single source of truth for
 * SKUs, prices, credits granted, and Stripe price-ID env-var mapping.
 *
 * Pricing is FIXED here (not in Stripe) so the server can defend against
 * client-supplied SKU spoofing — `/api/kundali/checkout` accepts only
 * the SKU string, then resolves the Stripe price ID + the credits to
 * grant from this map. The webhook also reads from here when granting
 * credits, so a Stripe-dashboard price change can never affect how many
 * credits we grant.
 *
 * Per the 2026-06-22 spec:
 *   single → 1 credit, ₹299 / $4.99
 *   family → 4 credits, ₹999 / $14.99
 */

export type KundaliSku = 'single' | 'family';
export type KundaliCurrency = 'INR' | 'USD';

interface KundaliProduct {
  sku: KundaliSku;
  creditsGranted: number;
  /** Price in minor units (paisa for INR, cents for USD). Used for audit logging. */
  priceMinor: Record<KundaliCurrency, number>;
  /** Env-var name holding the Stripe price ID. */
  stripePriceEnv: Record<KundaliCurrency, string>;
  /** Human-readable label per locale (English here; UI may translate). */
  label: string;
  description: string;
}

export const KUNDALI_PRODUCTS: Record<KundaliSku, KundaliProduct> = {
  single: {
    sku: 'single',
    creditsGranted: 1,
    priceMinor: { INR: 29900, USD: 499 }, // ₹299 / $4.99
    stripePriceEnv: {
      INR: 'STRIPE_PRICE_KUNDALI_SINGLE_INR',
      USD: 'STRIPE_PRICE_KUNDALI_SINGLE_USD',
    },
    label: 'Single Kundali',
    description: 'Unlock the full tippanni, divisional charts, and PDF for one chart.',
  },
  family: {
    sku: 'family',
    creditsGranted: 4,
    priceMinor: { INR: 99900, USD: 1499 }, // ₹999 / $14.99
    stripePriceEnv: {
      INR: 'STRIPE_PRICE_KUNDALI_FAMILY_INR',
      USD: 'STRIPE_PRICE_KUNDALI_FAMILY_USD',
    },
    label: 'Family Pack (4 Kundalis)',
    description: 'Unlock 4 charts — perfect for a family of 2 adults + 2 children.',
  },
};

export function isValidKundaliSku(s: string): s is KundaliSku {
  return s === 'single' || s === 'family';
}

export function isValidCurrency(c: string): c is KundaliCurrency {
  return c === 'INR' || c === 'USD';
}

/**
 * Resolve a Stripe price ID for the (sku, currency) tuple from env. Throws
 * if the env var is missing — the checkout route should 503 in that case
 * with a clear message so the operator knows to run the setup script.
 */
export function resolveStripePriceId(sku: KundaliSku, currency: KundaliCurrency): string {
  const envName = KUNDALI_PRODUCTS[sku].stripePriceEnv[currency];
  const priceId = process.env[envName]?.trim();
  if (!priceId) {
    throw new Error(
      `Missing env var ${envName}. Run scripts/stripe-setup-kundali-products.ts to create the Stripe products and prices.`,
    );
  }
  return priceId;
}
