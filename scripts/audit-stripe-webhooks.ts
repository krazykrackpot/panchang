#!/usr/bin/env npx tsx
/**
 * scripts/audit-stripe-webhooks.ts
 *
 * Lists every live Stripe webhook endpoint with health signals.
 * Run weekly (or after any payments-stack change) to catch the kind of
 * silent drift that caused the May 22 2026 incident:
 *
 *   • Webhook URL accidentally set to `www.dekhopanchang.com` →
 *     Vercel 308-redirected → Stripe drops POST body → silent fail.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/audit-stripe-webhooks.ts
 *
 * Reads STRIPE_SECRET_KEY from .env.local automatically if present.
 *
 * Exits non-zero if any check fails — wire into CI / cron for ongoing assurance.
 */

import Stripe from 'stripe';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';

loadEnv({ path: resolve(process.cwd(), '.env.local') });

const STRIPE_KEY = (process.env.STRIPE_SECRET_KEY || '').trim();
if (!STRIPE_KEY) {
  console.error('STRIPE_SECRET_KEY missing — set in .env.local or env');
  process.exit(2);
}
// Accept both root keys (sk_*) and restricted keys (rk_*). This script
// only LISTS webhook endpoints — a restricted key with `webhook_endpoints:read`
// is the least-privilege choice, especially for CI/cron use.
if (!/^(sk|rk)_(live|test)_/.test(STRIPE_KEY)) {
  console.error('STRIPE_SECRET_KEY must be a Stripe API key: sk_live_/sk_test_/rk_live_/rk_test_');
  process.exit(2);
}

const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion });

interface Finding {
  endpointId: string;
  severity: 'error' | 'warn';
  message: string;
}

function fmtAge(unixSeconds: number): string {
  const days = Math.floor((Date.now() / 1000 - unixSeconds) / 86400);
  return `${days}d ago`;
}

async function main() {
  console.log('Stripe webhook endpoint audit\n');

  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
  const findings: Finding[] = [];
  const eventOwners = new Map<string, string[]>();

  for (const ep of endpoints.data) {
    console.log(`─── ${ep.id} ────────────────────────────────`);
    console.log(`  url        : ${ep.url}`);
    console.log(`  status     : ${ep.status}`);
    console.log(`  livemode   : ${ep.livemode}`);
    console.log(`  created    : ${new Date(ep.created * 1000).toISOString()} (${fmtAge(ep.created)})`);
    console.log(`  description: ${ep.description ?? '(none)'}`);
    console.log(`  events     : ${ep.enabled_events.length} subscribed`);
    for (const ev of ep.enabled_events) {
      const list = eventOwners.get(ev) ?? [];
      list.push(ep.id);
      eventOwners.set(ev, list);
    }

    // Check 1 — URL must not contain `www.`. Vercel's www→apex 308 drops
    // POST bodies, breaking every delivery silently.
    if (/\bwww\./i.test(ep.url)) {
      findings.push({
        endpointId: ep.id,
        severity: 'error',
        message: `URL contains "www." — Vercel will 308-redirect, Stripe will drop the POST body. Change to apex.`,
      });
    }

    // Check 2 — URL must be HTTPS.
    if (!ep.url.startsWith('https://')) {
      findings.push({
        endpointId: ep.id,
        severity: 'error',
        message: `URL is not https://`,
      });
    }

    // Check 3 — endpoint must be enabled (disabled endpoints silently drop).
    if (ep.status !== 'enabled') {
      findings.push({
        endpointId: ep.id,
        severity: 'warn',
        message: `status is "${ep.status}" — events will not be delivered`,
      });
    }

    console.log('');
  }

  // Check 4 — flag events subscribed by more than one endpoint. Not always a
  // bug (Brihaspati and main both legitimately need checkout.session.completed
  // today), but worth surfacing so duplicates are intentional, not accidental.
  for (const [event, owners] of eventOwners) {
    if (owners.length > 1) {
      findings.push({
        endpointId: owners.join(','),
        severity: 'warn',
        message: `event "${event}" is subscribed by ${owners.length} endpoints — handlers must filter to avoid double-processing`,
      });
    }
  }

  // ─── Report ────────────────────────────────
  console.log('═══ Findings ═══');
  if (findings.length === 0) {
    console.log('  ✓ No issues detected.');
    process.exit(0);
  }

  let hasError = false;
  for (const f of findings) {
    const tag = f.severity === 'error' ? 'ERROR' : 'WARN ';
    console.log(`  [${tag}] ${f.endpointId} — ${f.message}`);
    if (f.severity === 'error') hasError = true;
  }
  console.log('');

  if (hasError) {
    console.error('Audit failed — at least one error-severity finding.');
    process.exit(1);
  }
  console.log('Audit passed (warnings only).');
  process.exit(0);
}

main().catch((err) => {
  console.error('audit failed:', err);
  process.exit(2);
});
