/**
 * Create the Pandit-tier products + prices in Stripe.
 *
 * Matrix: 2 tiers (Pro, Unlimited) × 2 billing (monthly, annual) ×
 *         2 currencies (USD, INR) = 8 prices.
 *
 * Idempotent via product metadata (pandit_tier=<tier>); never duplicates.
 * Existing prices at the same {currency, interval, unit_amount} are
 * reused. Prices at wrong amounts are NOT deactivated — Stripe pricing
 * is append-only by design; archive obsolete ones via the dashboard
 * if you change the matrix.
 *
 * Usage:
 *   npx tsx scripts/setup-pandit-stripe-prices.ts          # test mode (STRIPE_SECRET_KEY)
 *   npx tsx scripts/setup-pandit-stripe-prices.ts --live   # live mode (STRIPE_SECRET_KEY_LIVE_BACKUP)
 *
 * Pricing matrix (decided 2026-06-04 with user):
 *   Pro       USD: $9.99/mo,  $99/yr     INR: ₹999/mo,    ₹9,999/yr
 *   Unlimited USD: $29.99/mo, $299/yr    INR: ₹2,999/mo, ₹29,999/yr
 *
 * Unlimited has no feature differentiation from Pro yet — positioned
 * as a "founding pandit / supporter" tier. Future: white-label, API,
 * team seats. Easy to change here + in src/lib/pandit/subscription.ts
 * + the paywall UI.
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const LIVE = process.argv.includes('--live');
const RAW_KEY = LIVE
  ? (process.env.STRIPE_SECRET_KEY_LIVE_BACKUP ?? '')
  : (process.env.STRIPE_SECRET_KEY ?? '');
const KEY = RAW_KEY.replace(/^"|"$/g, '').trim();
const REQUIRED_PREFIX = LIVE ? 'sk_live_' : 'sk_test_';
if (!KEY.startsWith(REQUIRED_PREFIX)) {
  console.error(`Refusing — key is not ${LIVE ? 'live' : 'test'} mode (got ${KEY.slice(0, 7)})`);
  process.exit(1);
}
console.error(`Mode: ${LIVE ? 'LIVE (real billing!)' : 'TEST'}`);

const stripe = new Stripe(KEY, {
  httpClient: Stripe.createFetchHttpClient(),
  maxNetworkRetries: 3,
});

interface PriceRow {
  currency: 'usd' | 'inr';
  interval: 'month' | 'year';
  amount: number; // in smallest unit (cents / paise)
  envSuffix: 'MONTHLY' | 'ANNUAL' | 'MONTHLY_INR' | 'ANNUAL_INR';
}

interface TierSpec {
  name: string;
  tier: 'pandit_pro' | 'pandit_unlimited';
  prices: PriceRow[];
}

const TIERS: TierSpec[] = [
  {
    name: 'Pandit Pro',
    tier: 'pandit_pro',
    prices: [
      { currency: 'usd', interval: 'month', amount: 999, envSuffix: 'MONTHLY' },         // $9.99
      { currency: 'usd', interval: 'year',  amount: 9900, envSuffix: 'ANNUAL' },         // $99
      { currency: 'inr', interval: 'month', amount: 99900, envSuffix: 'MONTHLY_INR' },   // ₹999
      { currency: 'inr', interval: 'year',  amount: 999900, envSuffix: 'ANNUAL_INR' },   // ₹9,999
    ],
  },
  {
    name: 'Pandit Unlimited',
    tier: 'pandit_unlimited',
    prices: [
      { currency: 'usd', interval: 'month', amount: 2999, envSuffix: 'MONTHLY' },         // $29.99
      { currency: 'usd', interval: 'year',  amount: 29900, envSuffix: 'ANNUAL' },         // $299
      { currency: 'inr', interval: 'month', amount: 299900, envSuffix: 'MONTHLY_INR' },   // ₹2,999
      { currency: 'inr', interval: 'year',  amount: 2999900, envSuffix: 'ANNUAL_INR' },   // ₹29,999
    ],
  },
];

async function findOrCreateProduct(spec: TierSpec): Promise<Stripe.Product> {
  // Search active products with matching metadata. Stripe doesn't offer
  // a metadata-filter endpoint; list and scan. We have at most a few
  // products per project so this is fine.
  const list = await stripe.products.list({ active: true, limit: 100 });
  const found = list.data.find((p) => p.metadata?.pandit_tier === spec.tier);
  if (found) return found;
  return stripe.products.create({
    name: spec.name,
    metadata: { pandit_tier: spec.tier },
  });
}

async function findOrCreatePrice(product: Stripe.Product, row: PriceRow): Promise<Stripe.Price> {
  const list = await stripe.prices.list({ product: product.id, active: true, limit: 50 });
  const found = list.data.find(
    (p) => p.currency === row.currency && p.recurring?.interval === row.interval && p.unit_amount === row.amount,
  );
  if (found) return found;
  return stripe.prices.create({
    product: product.id,
    currency: row.currency,
    recurring: { interval: row.interval },
    unit_amount: row.amount,
  });
}

async function main() {
  const envLines: string[] = [];
  for (const spec of TIERS) {
    const product = await findOrCreateProduct(spec);
    console.log(`\n${spec.name} (${product.id}):`);
    for (const row of spec.prices) {
      const price = await findOrCreatePrice(product, row);
      const envName = `STRIPE_PRICE_${spec.tier.toUpperCase()}_${row.envSuffix}`;
      envLines.push(`${envName}=${price.id}`);
      console.log(`  ${row.currency.toUpperCase()} ${row.interval}: ${price.id} (${row.amount}${row.currency === 'inr' ? ' paise' : ' cents'})`);
    }
  }
  console.log('\n# Env vars (sorted):');
  for (const line of envLines.sort()) console.log(line);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
