/* eslint-disable no-console */
/**
 * One-time setup: create the kundali-paywall products + prices on Stripe.
 *
 * Produces 4 prices (2 products × 2 currencies):
 *
 *   Kundali Single    — ₹299 INR (29900 paisa)  / $4.99 USD (499 cents)
 *   Kundali Family Pack — ₹999 INR (99900 paisa) / $14.99 USD (1499 cents)
 *
 * Writes the resulting price IDs to stdout in `.env` format so the
 * operator can paste them into `.env.local` and Vercel project env.
 *
 * Idempotent: if a product with the same `metadata.kundali_sku` exists
 * already, it's reused. If a price with the same `unit_amount + currency
 * + active=true` exists on that product, it's reused. Re-running this
 * script is safe; the same env block prints regardless of how many
 * times you run it.
 *
 * Required env:
 *   STRIPE_SECRET_KEY   from .env.local (already present for /api/checkout)
 *
 * Usage:
 *   npx tsx scripts/stripe-setup-kundali-products.ts          # live mode
 *   npx tsx scripts/stripe-setup-kundali-products.ts --dry    # only logs what would be created
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import Stripe from 'stripe';

// Load .env.local — same pattern as scripts/upload-youtube.ts.
const envPath = resolve('.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY?.trim();
if (!STRIPE_SECRET) {
  console.error('[setup] Missing STRIPE_SECRET_KEY in .env.local');
  process.exit(1);
}
const DRY = process.argv.includes('--dry');

const stripe = new Stripe(STRIPE_SECRET, {
  httpClient: Stripe.createFetchHttpClient(),
  maxNetworkRetries: 3,
});

interface ProductSpec {
  sku: 'single' | 'family';
  name: string;
  description: string;
  prices: Array<{ currency: 'inr' | 'usd'; unitAmount: number; envVar: string }>;
}

const PRODUCTS: ProductSpec[] = [
  {
    sku: 'single',
    name: 'Kundali — Single (Full Tippanni + PDF)',
    description: 'Unlock the full tippanni, divisional charts (D9–D60), and PDF download for one kundali.',
    prices: [
      { currency: 'inr', unitAmount: 29900, envVar: 'STRIPE_PRICE_KUNDALI_SINGLE_INR' },
      { currency: 'usd', unitAmount: 499, envVar: 'STRIPE_PRICE_KUNDALI_SINGLE_USD' },
    ],
  },
  {
    sku: 'family',
    name: 'Kundali — Family Pack (4 Kundalis)',
    description: 'Unlock 4 kundalis — full tippanni, divisional charts, and PDF download for each. For a family of 2 adults + 2 children.',
    prices: [
      { currency: 'inr', unitAmount: 99900, envVar: 'STRIPE_PRICE_KUNDALI_FAMILY_INR' },
      { currency: 'usd', unitAmount: 1499, envVar: 'STRIPE_PRICE_KUNDALI_FAMILY_USD' },
    ],
  },
];

async function findOrCreateProduct(spec: ProductSpec): Promise<Stripe.Product> {
  // Search by metadata.kundali_sku so re-runs don't duplicate.
  const existing = await stripe.products.search({
    query: `metadata['kundali_sku']:'${spec.sku}' AND active:'true'`,
    limit: 5,
  });
  if (existing.data.length > 0) {
    console.log(`[setup] reuse product: ${spec.sku} → ${existing.data[0].id}`);
    return existing.data[0];
  }
  if (DRY) {
    console.log(`[setup] DRY would create product: ${spec.name}`);
    return { id: `prod_DRY_${spec.sku}`, name: spec.name } as Stripe.Product;
  }
  const p = await stripe.products.create({
    name: spec.name,
    description: spec.description,
    metadata: { kundali_sku: spec.sku, kundali_paywall: 'true' },
  });
  console.log(`[setup] created product: ${spec.sku} → ${p.id}`);
  return p;
}

async function findOrCreatePrice(
  product: Stripe.Product,
  currency: 'inr' | 'usd',
  unitAmount: number,
): Promise<Stripe.Price> {
  if (DRY || product.id.startsWith('prod_DRY_')) {
    console.log(`[setup] DRY would create price: ${currency} ${unitAmount}`);
    return { id: `price_DRY_${product.id}_${currency}` } as Stripe.Price;
  }
  const existing = await stripe.prices.list({
    product: product.id,
    active: true,
    currency,
    limit: 100,
  });
  const match = existing.data.find(
    (p) => p.unit_amount === unitAmount && p.type === 'one_time',
  );
  if (match) {
    console.log(`[setup] reuse price: ${product.id} ${currency} ${unitAmount} → ${match.id}`);
    return match;
  }
  const p = await stripe.prices.create({
    product: product.id,
    currency,
    unit_amount: unitAmount,
    // one_time (no `recurring` field) — these are credit purchases, not subscriptions.
  });
  console.log(`[setup] created price: ${product.id} ${currency} ${unitAmount} → ${p.id}`);
  return p;
}

async function main() {
  console.log(`[setup] Stripe mode: ${DRY ? 'DRY-RUN' : 'LIVE'}`);
  const envLines: string[] = [];

  for (const spec of PRODUCTS) {
    const product = await findOrCreateProduct(spec);
    for (const priceSpec of spec.prices) {
      const price = await findOrCreatePrice(product, priceSpec.currency, priceSpec.unitAmount);
      envLines.push(`${priceSpec.envVar}=${price.id}`);
    }
  }

  console.log('\n=== Add these to .env.local and Vercel project env ===');
  for (const line of envLines) console.log(line);
  console.log('\nWebhook signing secret (set up the new endpoint in Stripe dashboard first):');
  console.log('  Endpoint URL: https://dekhopanchang.com/api/kundali/webhook/stripe');
  console.log('  Event: checkout.session.completed');
  console.log('  Env var: STRIPE_WEBHOOK_SECRET_KUNDALI');
}

main().catch((err) => {
  console.error('[setup] FAILED:', err);
  process.exit(1);
});
