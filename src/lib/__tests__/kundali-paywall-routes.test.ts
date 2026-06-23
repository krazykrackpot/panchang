/**
 * Structural tests for the kundali-paywall route handlers:
 *
 *   POST /api/kundali/checkout         — creates a Stripe session + binds pending_checkouts
 *   POST /api/kundali/webhook/stripe   — verifies signature, grants credits idempotently
 *   POST /api/kundali/unlock           — atomic credit spend + entitlement insert
 *   GET  /api/kundali/credits          — balance + history + entitled list
 *
 * Each route's safety invariants are asserted via regex grep over the
 * source. This catches accidental loss of a Bearer-auth check, missing
 * server-binding lookup, or a regex-replace that ungates a SECURITY-
 * DEFINER RPC behind a service-role guard.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('/api/kundali/checkout', () => {
  const src = read('src/app/api/kundali/checkout/route.ts');

  it('requires a Bearer token (auth not optional)', () => {
    expect(src).toMatch(/authHeader\?\.startsWith\('Bearer '\)/);
    expect(src).toMatch(/Unauthorized/);
  });

  it('validates the sku via isValidKundaliSku', () => {
    expect(src).toMatch(/isValidKundaliSku\(sku\)/);
  });

  it('validates the currency via isValidCurrency', () => {
    expect(src).toMatch(/isValidCurrency\(currency\)/);
  });

  it('whitelists the locale against visibleLocales', () => {
    expect(src).toMatch(/locales as readonly string\[\]\)\.includes\(rawLocale\)/);
  });

  it('resolves the Stripe price ID server-side (catalogue-driven)', () => {
    expect(src).toMatch(/resolveStripePriceId\(sku, currency\)/);
  });

  it('writes a pending_checkouts row server-bound to user.id', () => {
    expect(src).toMatch(/from\('pending_checkouts'\)[\s\S]{0,300}\.insert\(/);
    expect(src).toMatch(/user_id: user\.id/);
  });

  it('binds tier as kundali_<sku> (lets webhook filter by tier prefix)', () => {
    expect(src).toMatch(/tier: `kundali_\$\{sku\}`/);
  });

  it('rate-limits by IP', () => {
    expect(src).toMatch(/checkRateLimit\(ip/);
  });

  it('short-circuits duplicate-clicks within 60 seconds, scoped to the requested SKU', () => {
    // Narrow scope: same SKU only (not all kundali_*), short window (not 5 min)
    // so a cancelled-then-retry flow isn't blocked.
    expect(src).toMatch(/\.eq\('tier', `kundali_\$\{sku\}`\)/);
    expect(src).toMatch(/\.is\('completed_at', null\)/);
    expect(src).toMatch(/60 \* 1000/);
  });
});

describe('/api/kundali/webhook/stripe', () => {
  const src = read('src/app/api/kundali/webhook/stripe/route.ts');

  it('verifies the Stripe signature with STRIPE_WEBHOOK_SECRET_KUNDALI', () => {
    expect(src).toMatch(/STRIPE_WEBHOOK_SECRET_KUNDALI/);
    expect(src).toMatch(/constructEvent\(rawBody, sig, webhookSecret\)/);
  });

  it('ignores events that are not kundali_paywall metadata', () => {
    expect(src).toMatch(/metadata\?\.kundali_paywall !== 'true'/);
  });

  it('looks up pending_checkouts by session_id (server-bound user_id)', () => {
    expect(src).toMatch(/from\('pending_checkouts'\)[\s\S]{0,200}\.eq\('stripe_session_id', session\.id\)/);
  });

  it('refuses to credit if no binding row exists (SECURITY guard)', () => {
    expect(src).toMatch(/SECURITY: no pending_checkouts row/);
    expect(src).toMatch(/no_binding/);
  });

  it('refuses if metadata.user_id mismatches the bound user_id', () => {
    expect(src).toMatch(/SECURITY: metadata\.user_id mismatch/);
    expect(src).toMatch(/user_mismatch/);
  });

  it('refuses if metadata.sku mismatches the bound tier', () => {
    expect(src).toMatch(/SECURITY: metadata\.sku mismatch/);
    expect(src).toMatch(/sku_mismatch/);
  });

  it('calls grant_chart_credits RPC (atomic + idempotent)', () => {
    expect(src).toMatch(/\.rpc\('grant_chart_credits'/);
  });

  it('passes credits + amount from the trusted catalogue, never from metadata', () => {
    expect(src).toMatch(/KUNDALI_PRODUCTS\[sku\]/);
    expect(src).toMatch(/p_credits_granted: creditsGranted/);
    expect(src).toMatch(/p_amount_paid_minor: amountPaidMinor/);
  });

  it('returns 500 on grant_chart_credits RPC error so Stripe retries', () => {
    expect(src).toMatch(/grantErr[\s\S]{0,200}NextResponse\.json\(\{ error: 'DB error' \}, \{ status: 500 \}\)/);
  });
});

describe('/api/kundali/unlock', () => {
  const src = read('src/app/api/kundali/unlock/route.ts');

  it('requires a Bearer token', () => {
    expect(src).toMatch(/authHeader\?\.startsWith\('Bearer '\)/);
  });

  it('computes the fingerprint server-side via computeKundaliFingerprint', () => {
    expect(src).toMatch(/computeKundaliFingerprint\(\{ date, time, lat, lng \}\)/);
  });

  it('NEVER trusts a client-supplied fingerprint', () => {
    // The route body must not pull "fingerprint" from the request body —
    // only date/time/lat/lng. Otherwise a malicious client could craft
    // any fingerprint to claim an entitlement.
    expect(src).not.toMatch(/body\.fingerprint/);
    expect(src).not.toMatch(/p_fingerprint:.*body\./);
  });

  it('calls spend_chart_credit RPC (atomic + idempotent)', () => {
    expect(src).toMatch(/\.rpc\('spend_chart_credit'/);
  });

  it('caps display_name length to prevent storage abuse', () => {
    expect(src).toMatch(/\.slice\(0, 80\)/);
  });

  it('returns the current creditsRemaining in the response', () => {
    expect(src).toMatch(/creditsRemaining/);
  });

  it('validates lat/lng are finite numbers AND in physical ranges', () => {
    // Gemini #721: lat must be in [-90, 90], lng in [-180, 180].
    // Otherwise a malformed client sends a credit-spending request that
    // unlocks an ungeneratable chart.
    expect(src).toMatch(/Number\.isFinite\(lat\)/);
    expect(src).toMatch(/Number\.isFinite\(lng\)/);
    expect(src).toMatch(/lat < -90 \|\| lat > 90/);
    expect(src).toMatch(/lng < -180 \|\| lng > 180/);
  });

  it('reads creditsRemaining from the RPC return value (no extra SELECT)', () => {
    // Gemini #721: migration 068 makes spend_chart_credit return
    // credits_remaining on all branches. The route must consume that
    // directly rather than firing a separate chart_credits SELECT.
    expect(src).toMatch(/result\.credits_remaining/);
    expect(src).not.toMatch(/from\('chart_credits'\)/);
  });

  it('handles a null/non-object RPC result defensively', () => {
    expect(src).toMatch(/!data \|\| typeof data !== 'object'/);
  });
});

describe('/api/kundali/credits', () => {
  const src = read('src/app/api/kundali/credits/route.ts');

  it('requires a Bearer token', () => {
    expect(src).toMatch(/authHeader\?\.startsWith\('Bearer '\)/);
  });

  it('reads chart_credits/purchases/entitlements scoped to user_id', () => {
    expect(src).toMatch(/from\('chart_credits'\)[\s\S]{0,200}\.eq\('user_id', user\.id\)/);
    expect(src).toMatch(/from\('chart_credit_purchases'\)[\s\S]{0,200}\.eq\('user_id', user\.id\)/);
    expect(src).toMatch(/from\('chart_entitlements'\)[\s\S]{0,200}\.eq\('user_id', user\.id\)/);
  });

  it('validates the ?fingerprint param against the SHA-256 hex shape', () => {
    expect(src).toMatch(/\/\^\[0-9a-f\]\{64\}\$\//);
  });

  it('?fingerprint check queries the DB directly (NOT the truncated entitlements list)', () => {
    // Gemini #721: filtering the limit(50) entitlements list would falsely
    // report "not entitled" for any chart unlocked beyond the most recent 50.
    // The fingerprint check must hit chart_entitlements with .eq()/.maybeSingle().
    expect(src).toMatch(/queryFingerprint[\s\S]{0,400}from\('chart_entitlements'\)[\s\S]{0,200}\.eq\('kundali_fingerprint', queryFingerprint\)/);
    expect(src).toMatch(/queryFingerprint[\s\S]{0,500}\.maybeSingle\(\)/);
  });

  it('logs DB errors with [kundali/credits] prefix (lesson AA)', () => {
    expect(src).toMatch(/\[kundali\/credits\][\s\S]{0,100}failed/);
  });
});
