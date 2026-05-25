/**
 * Sprint 7 / P0-5 — Stripe webhook metadata-trust binding.
 *
 * Unit tests assert the structural invariants of the binding check.
 * Integration of the full webhook flow against a real Stripe testmode
 * is out of scope — that requires e2e harness against test mode keys.
 *
 * The contracts under test (encoded in src/app/api/webhooks/stripe/route.ts
 * checkout.session.completed handler):
 *
 *   1. A session whose stripe_session_id has no pending_checkouts row
 *      MUST NOT credit a subscription (could be attacker-spoofed session
 *      or pre-Sprint-7 legacy session).
 *
 *   2. A session whose pending row has a different user_id than
 *      session.metadata.user_id MUST NOT credit (mismatch = attack signal).
 *
 *   3. A session whose pending row was already completed_at MUST NOT
 *      double-credit (defence-in-depth against missed event.id dedup).
 *
 *   4. On valid match, the subscription is credited to the SERVER-BOUND
 *      user_id (from pending_checkouts), NOT the metadata.user_id —
 *      defence-in-depth against future widening of the comparison.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('Stripe webhook P0-5 binding (route.ts shape)', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/webhooks/stripe/route.ts'),
    'utf8',
  );

  it('looks up pending_checkouts by stripe_session_id', () => {
    expect(src).toContain("from('pending_checkouts')");
    expect(src).toContain(".eq('stripe_session_id', session.id)");
  });

  it('rejects when no pending row exists (security log + skip credit)', () => {
    // The handler emits a SECURITY log and breaks out of the case without
    // crediting. The string is part of the contract — searchable in prod logs.
    expect(src).toMatch(/SECURITY.*no pending_checkouts row/);
  });

  it('rejects on user_id mismatch (metadata vs server-bound)', () => {
    expect(src).toMatch(/SECURITY.*metadata\.user_id mismatch/);
  });

  it('uses server-bound user_id for the subscription upsert', () => {
    // Defence-in-depth: even after the mismatch check, the credit goes
    // to pending.user_id, not session.metadata.user_id.
    expect(src).toMatch(/userId\s*=\s*pending\.user_id/);
    expect(src).toMatch(/effectiveTier\s*=\s*pending\.tier/);
  });

  it('stamps completed_at after successful credit (replay defence)', () => {
    expect(src).toMatch(/completed_at:\s*new Date\(\)\.toISOString\(\)/);
  });

  it('does NOT pre-credit then check (must look up FIRST)', () => {
    // Regression guard: the previous version unconditionally upserted
    // subscriptions if metadata.user_id was truthy. After the fix, the
    // upsert must come AFTER the pending lookup + verification.
    const upsertIdx = src.indexOf("from('subscriptions').upsert");
    const lookupIdx = src.indexOf("from('pending_checkouts')");
    expect(lookupIdx).toBeGreaterThan(0);
    expect(upsertIdx).toBeGreaterThan(lookupIdx);
  });

  it('short-circuits on Brihaspati one-time payments before the subscription-shape check', () => {
    // Brihaspati uses the same checkout.session.completed event type but
    // mode='payment' (no subscription). Both endpoints subscribe to this
    // event, so the main handler also sees Brihaspati orders. Filtering
    // here keeps logs clean and prevents the noisy "missing subscription/
    // customer" warning on every Brihaspati order. Added after the
    // 2026-05-25 webhook URL incident.
    expect(src).toMatch(/metadata\?\.brihaspati\s*===\s*['"]true['"]/);
    expect(src).toMatch(/session\.mode\s*===\s*['"]payment['"]/);

    // Order matters: the short-circuit must come BEFORE the
    // pending_checkouts lookup so we don't run a DB query per Brihaspati
    // order (Brihaspati has no pending_checkouts row).
    const shortCircuitIdx = src.indexOf("metadata?.brihaspati === 'true'");
    const pendingLookupIdx = src.indexOf("from('pending_checkouts')");
    expect(shortCircuitIdx).toBeGreaterThan(0);
    expect(shortCircuitIdx).toBeLessThan(pendingLookupIdx);
  });
});

describe('Stripe webhook P0-5 binding (/api/checkout writes pending row)', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/checkout/route.ts'),
    'utf8',
  );

  it('inserts pending_checkouts after stripe.checkout.sessions.create', () => {
    expect(src).toContain("from('pending_checkouts')");
    expect(src).toContain('.insert({');
    expect(src).toMatch(/stripe_session_id:\s*session\.id/);
    expect(src).toMatch(/user_id:\s*user\.id/);
  });

  it('fails the checkout (5xx) if the binding insert fails', () => {
    // If the insert fails silently the webhook can't verify later — must
    // refuse the session rather than ship an un-bound URL.
    expect(src).toMatch(/Checkout binding failed/);
  });
});
