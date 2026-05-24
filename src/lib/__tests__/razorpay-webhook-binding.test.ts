/**
 * Sprint 18 — Razorpay webhook parity with the Stripe binding pattern.
 *
 * Structural tests assert the security invariants on the three Razorpay
 * webhook surfaces:
 *   1. /api/webhooks/razorpay (main subscriptions)
 *   2. /api/brihaspati/webhook/razorpay (Brihaspati one-offs + subs)
 *   3. /api/brihaspati/webhook/stripe (Brihaspati Stripe — same audit
 *      family, hardened in the same PR)
 *
 * Integration tests against the real Razorpay API are out of scope; the
 * regex/string assertions encode the contract so the next refactor can't
 * silently regress them.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('Main Razorpay webhook (Sprint 18 hardening)', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/webhooks/razorpay/route.ts'),
    'utf8',
  );

  it('has event-id idempotency via processed_webhook_events', () => {
    // Provider+event_id dedup mirroring the Stripe handler.
    expect(src).toContain("from('processed_webhook_events')");
    expect(src).toMatch(/provider:\s*['"]razorpay['"]/);
    expect(src).toContain("provider_event_id: eventId");
  });

  it('reads the x-razorpay-event-id header (not the entity id)', () => {
    expect(src).toContain("'x-razorpay-event-id'");
  });

  it('uses PG unique-violation code (23505) to detect dedup, not regex on .message', () => {
    expect(src).toContain('23505');
    expect(src).not.toMatch(/test\(idemErr\.message\)/);
    expect(src).not.toMatch(/\.message\)[\s\S]{0,80}duplicate key/);
  });

  it('looks up pending_razorpay_subscriptions before crediting', () => {
    expect(src).toContain("from('pending_razorpay_subscriptions')");
    expect(src).toContain(".eq('razorpay_subscription_id', entity.id)");
  });

  it('rejects when no pending row exists (security log + skip credit)', () => {
    expect(src).toMatch(/SECURITY.*no pending_razorpay_subscriptions row/);
  });

  it('rejects on notes.user_id mismatch (server-bound vs metadata)', () => {
    expect(src).toMatch(/SECURITY.*notes\.user_id mismatch/);
  });

  it('uses server-bound user_id for subscriptions upsert', () => {
    expect(src).toMatch(/userId\s*=\s*pending\.user_id/);
    expect(src).toMatch(/effectiveTier\s*=\s*pending\.tier/);
  });

  it('lookup precedes write — defence against accidental refactor', () => {
    const upsertIdx = src.indexOf("from('subscriptions').upsert");
    const lookupIdx = src.indexOf("from('pending_razorpay_subscriptions')");
    expect(lookupIdx).toBeGreaterThan(0);
    expect(upsertIdx).toBeGreaterThan(lookupIdx);
  });

  it('returns 500 on subscription upsert error (so Razorpay retries)', () => {
    // Previously these were fire-and-forget. Round 2 SF-1 closes the
    // silent-fail-then-ACK bug.
    expect(src).toMatch(/subscription upsert failed/);
    expect(src).toMatch(/Database error/);
    expect(src).toMatch(/status:\s*500/);
  });

  it('marks event completed only after work succeeds', () => {
    const markIdx = src.indexOf('markEventCompleted');
    expect(markIdx).toBeGreaterThan(0);
    // The function definition + call appears at least twice (the
    // success path at the bottom and the ignored-paths above).
    expect(src.match(/markEventCompleted/g)?.length).toBeGreaterThanOrEqual(3);
  });
});

describe('/api/checkout INR branch writes pending_razorpay_subscriptions', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/checkout/route.ts'),
    'utf8',
  );

  it('inserts pending_razorpay_subscriptions after razorpay.subscriptions.create', () => {
    expect(src).toContain("from('pending_razorpay_subscriptions')");
    expect(src).toMatch(/razorpay_subscription_id:\s*subscription\.id/);
    expect(src).toMatch(/user_id:\s*user\.id/);
  });

  it('fails the checkout (5xx) if the binding insert fails', () => {
    // Mirrors the Stripe path — refuse to ship an un-bound URL.
    expect(src).toMatch(/Checkout binding failed/);
  });

  it('Razorpay binding insert precedes returning the short_url', () => {
    const insertIdx = src.indexOf("from('pending_razorpay_subscriptions')");
    const returnIdx = src.indexOf('subscription.short_url');
    expect(insertIdx).toBeGreaterThan(0);
    expect(returnIdx).toBeGreaterThan(insertIdx);
  });
});

describe('Brihaspati Stripe webhook (Round 2 SEC-1 + SF-4)', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/brihaspati/webhook/stripe/route.ts'),
    'utf8',
  );

  it('uses PG unique-violation code (23505), not regex on message', () => {
    expect(src).toContain('23505');
    expect(src).not.toMatch(/\.message\)[\s\S]{0,80}duplicate key/);
  });

  it('looks up brihaspati_questions by metadata.question_id', () => {
    expect(src).toContain("from('brihaspati_questions')");
    expect(src).toContain(".eq('id', metaQuestionId)");
  });

  it('rejects when question_id metadata is missing', () => {
    expect(src).toMatch(/metadata missing required fields/);
  });

  it('rejects when question row not found', () => {
    expect(src).toMatch(/SECURITY: question not found/);
  });

  it('rejects on metadata.user_id mismatch with question.user_id', () => {
    expect(src).toMatch(/SECURITY: metadata\.user_id mismatch/);
  });

  it('cross-checks session id against payment_ref (defence in depth)', () => {
    expect(src).toMatch(/SECURITY: session id mismatch/);
  });

  it('uses server-bound user_id from question row, not metadata', () => {
    expect(src).toMatch(/userId\s*=\s*question\.user_id/);
  });

  it('returns 500 on payment_verified flip DB error', () => {
    expect(src).toMatch(/payment_verified flip failed/);
    expect(src).toMatch(/Database error/);
  });

  it('belt-and-braces .eq user_id on question update', () => {
    expect(src).toMatch(/\.update\(\{\s*payment_verified:\s*true[\s\S]{0,200}\.eq\('user_id'/);
  });
});

describe('Brihaspati Razorpay webhook (Round 2 SEC-2 + SF-8)', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/brihaspati/webhook/razorpay/route.ts'),
    'utf8',
  );

  it('uses PG unique-violation code (23505), not regex on message', () => {
    expect(src).toContain('23505');
    expect(src).not.toMatch(/\.message\)[\s\S]{0,80}duplicate key/);
  });

  it('looks up brihaspati_questions before crediting payment.captured', () => {
    expect(src).toContain("from('brihaspati_questions')");
    expect(src).toContain(".eq('id', metaQuestionId)");
  });

  it('rejects when question row missing on payment.captured', () => {
    expect(src).toMatch(/SECURITY: question not found/);
  });

  it('rejects on notes.user_id mismatch with question.user_id', () => {
    expect(src).toMatch(/SECURITY: notes\.user_id mismatch/);
  });

  it('returns 500 on payment_verified flip DB error', () => {
    expect(src).toMatch(/payment_verified flip failed/);
    expect(src).toMatch(/Database error/);
  });

  it('verifies question row for subscription events when question_id present', () => {
    // Subscription events also pass through verification when metaQuestionId
    // is provided in notes. Fallback to trusting notes.user_id only when no
    // question_id is available (legacy/test paths).
    expect(src).toMatch(/SECURITY: notes\.user_id mismatch on subscription/);
  });

  it('uses server-bound user_id from question row when available', () => {
    expect(src).toMatch(/userId\s*=\s*question\.user_id/);
  });
});

describe('Migration 037 — pending_razorpay_subscriptions schema', () => {
  const src = readFileSync(
    join(process.cwd(), 'supabase/migrations/037_razorpay_parity.sql'),
    'utf8',
  );

  it('creates pending_razorpay_subscriptions with PK on razorpay_subscription_id', () => {
    expect(src).toMatch(/CREATE TABLE IF NOT EXISTS public\.pending_razorpay_subscriptions/);
    expect(src).toMatch(/razorpay_subscription_id text PRIMARY KEY/);
  });

  it('has FK to auth.users with ON DELETE CASCADE', () => {
    expect(src).toMatch(/user_id uuid NOT NULL REFERENCES auth\.users\(id\) ON DELETE CASCADE/);
  });

  it('enforces service-role-only access via RLS', () => {
    expect(src).toMatch(/ENABLE ROW LEVEL SECURITY/);
    expect(src).toMatch(/auth\.role\(\)\s*=\s*'service_role'/);
  });
});
