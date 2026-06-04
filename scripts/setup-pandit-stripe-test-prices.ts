/**
 * Create the four Pandit-tier products + prices in Stripe — TEST mode
 * by default, LIVE with --live. Idempotent via product metadata.
 *
 * Usage:
 *   npx tsx scripts/setup-pandit-stripe-test-prices.ts          # test mode (uses STRIPE_SECRET_KEY)
 *   npx tsx scripts/setup-pandit-stripe-test-prices.ts --live   # live mode (uses STRIPE_SECRET_KEY_LIVE_BACKUP)
 *
 * Pandit CRM P12 (test) / post-merge live deploy.
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const LIVE = process.argv.includes('--live');
const KEY = LIVE
  ? (process.env.STRIPE_SECRET_KEY_LIVE_BACKUP?.replace(/^"|"$/g, '') ?? '').trim()
  : (process.env.STRIPE_SECRET_KEY ?? '').trim();
const REQUIRED_PREFIX = LIVE ? 'sk_live_' : 'sk_test_';
if (!KEY.startsWith(REQUIRED_PREFIX)) {
  console.error(`Refusing to run — key is not ${LIVE ? 'live' : 'test'} mode (got ${KEY.slice(0, 7)})`);
  process.exit(1);
}
console.error(`Mode: ${LIVE ? 'LIVE (real billing)' : 'TEST (no real billing)'}`);

const stripe = new Stripe(KEY, {
  httpClient: Stripe.createFetchHttpClient(),
  maxNetworkRetries: 2,
});

const PRODUCTS = [
  {
    name: 'Pandit Pro',
    tier: 'pandit_pro',
    monthly_cents: 1900,
    annual_cents: 19000, // $190/year = ~17% saving vs monthly
  },
  {
    name: 'Pandit Unlimited',
    tier: 'pandit_unlimited',
    monthly_cents: 4900,
    annual_cents: 49000,
  },
] as const;

async function findOrCreateProduct(p: typeof PRODUCTS[number]): Promise<Stripe.Product> {
  const existing = await stripe.products.list({ active: true, limit: 100 });
  const found = existing.data.find((x) => x.metadata?.pandit_tier === p.tier);
  if (found) return found;
  return stripe.products.create({
    name: p.name,
    metadata: { pandit_tier: p.tier },
  });
}

async function findOrCreatePrice(
  product: Stripe.Product,
  interval: 'month' | 'year',
  amount: number,
): Promise<Stripe.Price> {
  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 20 });
  const found = prices.data.find(
    (x) => x.recurring?.interval === interval && x.unit_amount === amount,
  );
  if (found) return found;
  return stripe.prices.create({
    product: product.id,
    currency: 'usd',
    recurring: { interval },
    unit_amount: amount,
  });
}

async function main() {
  const envLines: string[] = [];
  for (const p of PRODUCTS) {
    const product = await findOrCreateProduct(p);
    const monthly = await findOrCreatePrice(product, 'month', p.monthly_cents);
    const annual = await findOrCreatePrice(product, 'year', p.annual_cents);

    const tierUpper = p.tier.toUpperCase();
    envLines.push(`STRIPE_PRICE_${tierUpper}_MONTHLY=${monthly.id}`);
    envLines.push(`STRIPE_PRICE_${tierUpper}_ANNUAL=${annual.id}`);
    console.log(`✓ ${p.name}: product=${product.id} monthly=${monthly.id} annual=${annual.id}`);
  }
  console.log('\n# Add these lines to .env.local:');
  for (const line of envLines) console.log(line);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
