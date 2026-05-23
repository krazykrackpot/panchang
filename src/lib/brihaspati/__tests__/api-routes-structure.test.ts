/**
 * Structural tests for the Brihaspati API routes.
 *
 * Reads each route file and asserts on the contract: auth check is
 * present, errors are logged with the [brihaspati/<route>] tag, no
 * silent catches, validation gates exist where required by the spec.
 *
 * These tests don't run the route handlers — those are exercised in
 * the Phase 10 end-to-end test plan. Structural assertions catch the
 * easy regressions and let CI fail fast on contract drift.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function read(rel: string): string {
  const p = join(process.cwd(), rel);
  expect(existsSync(p), `expected file at ${rel}`).toBe(true);
  return readFileSync(p, 'utf8');
}

const BALANCE = 'src/app/api/brihaspati/balance/route.ts';
const ORDER = 'src/app/api/brihaspati/order/route.ts';
const MAIN = 'src/app/api/brihaspati/route.ts';
const RATING = 'src/app/api/brihaspati/rating/route.ts';
const WEBHOOK_RZ = 'src/app/api/brihaspati/webhook/razorpay/route.ts';
const WEBHOOK_STRIPE = 'src/app/api/brihaspati/webhook/stripe/route.ts';
const CRON = 'src/app/api/cron/brihaspati-mark-eligible/route.ts';

const USER_FACING_AUTHED_ROUTES = [BALANCE, ORDER, MAIN, RATING];

describe('Brihaspati API routes — auth gate', () => {
  it.each(USER_FACING_AUTHED_ROUTES)('%s requires Bearer token', (rel) => {
    const src = read(rel);
    expect(src).toMatch(/authorization/i);
    expect(src).toMatch(/Bearer/);
    expect(src).toMatch(/supabase\.auth\.getUser/);
    expect(src).toMatch(/Unauthorized/);
  });
});

describe('Brihaspati API routes — error handling', () => {
  it.each([BALANCE, ORDER, MAIN, RATING, WEBHOOK_RZ, WEBHOOK_STRIPE, CRON])(
    '%s logs errors with tagged console.error',
    (rel) => {
      const src = read(rel);
      // Per CLAUDE.md universal rule: every catch must log with a tagged prefix.
      expect(src).toMatch(/console\.error\(['"`]\[brihaspati[^\]]*\][^,]*['"`, ]/);
      // No empty catch blocks.
      expect(src).not.toMatch(/catch\s*\([^)]*\)\s*\{\s*\}/);
    },
  );
});

describe('Brihaspati order route — validation gates', () => {
  it('validates question length', () => {
    const src = read(ORDER);
    expect(src).toMatch(/question.*length/);
  });

  it('validates pricing tier against BRIHASPATI_PRICING_TIERS', () => {
    const src = read(ORDER);
    expect(src).toMatch(/BRIHASPATI_PRICING_TIERS/);
  });

  it('validates locale against the allowed set', () => {
    const src = read(ORDER);
    expect(src).toMatch(/BRIHASPATI_LAUNCH_LOCALES|BRIHASPATI_FALLBACK_LOCALES/);
  });

  it('validates currency is INR or USD only', () => {
    const src = read(ORDER);
    expect(src).toMatch(/currency.*!==.*'INR'.*&&.*currency.*!==.*'USD'|currency !== 'INR'/);
  });

  it('rolls back the pending question row on payment-create failure', () => {
    const src = read(ORDER);
    expect(src).toMatch(/delete\(\)[\s\S]*\.eq\(['"]id['"],\s*questionId\)/);
  });

  it('enforces a rate limit using brihaspati_questions created_at window', () => {
    const src = read(ORDER);
    expect(src).toMatch(/oneHourAgo|created_at/);
    expect(src).toMatch(/Rate limit exceeded|429/);
  });
});

describe('Brihaspati main route — payment + streaming contract', () => {
  it('opens an SSE response (text/event-stream)', () => {
    const src = read(MAIN);
    expect(src).toMatch(/text\/event-stream/);
    expect(src).toMatch(/ReadableStream/);
  });

  it('verifies Razorpay payment signature when provider=razorpay', () => {
    const src = read(MAIN);
    expect(src).toMatch(/verifyPaymentSignature/);
  });

  it('consumes credit when no payment ref + no subscription', () => {
    const src = read(MAIN);
    expect(src).toMatch(/consumeCredit/);
    expect(src).toMatch(/getActiveSubscription/);
  });

  it('refuses to re-answer a completed question (409)', () => {
    const src = read(MAIN);
    expect(src).toMatch(/Already answered|409/);
  });

  it('persists every §11 flywheel column after streaming', () => {
    const src = read(MAIN);
    for (const col of [
      'context_json',
      'engine_version',
      'system_prompt_version',
      'training_opt_out',
      'validation_passed',
      'validation_failures',
    ]) {
      expect(src, `${col} write missing`).toContain(col);
    }
  });

  it('snapshots brihaspati_training_opt_out from user_profiles', () => {
    const src = read(MAIN);
    expect(src).toMatch(/brihaspati_training_opt_out/);
  });

  it('declares maxDuration for the streaming function', () => {
    const src = read(MAIN);
    expect(src).toMatch(/maxDuration\s*=\s*\d+/);
  });
});

describe('Brihaspati rating route', () => {
  it('only accepts -1 | 0 | 1', () => {
    const src = read(RATING);
    expect(src).toMatch(/rating\s*!==\s*-1\s*&&\s*rating\s*!==\s*0\s*&&\s*rating\s*!==\s*1/);
  });

  it('scopes the update to (id, user_id) — no cross-user mutation', () => {
    const src = read(RATING);
    expect(src).toMatch(/\.eq\(['"]id['"],\s*questionId\)/);
    expect(src).toMatch(/\.eq\(['"]user_id['"],\s*user\.id\)/);
  });
});

describe('Brihaspati webhook routes — idempotency + verification', () => {
  it('razorpay webhook verifies signature before processing', () => {
    const src = read(WEBHOOK_RZ);
    expect(src).toMatch(/verifyWebhookSignature/);
    expect(src).toMatch(/Invalid signature/);
  });

  it('razorpay webhook deduplicates via brihaspati_webhook_events insert', () => {
    const src = read(WEBHOOK_RZ);
    expect(src).toMatch(/brihaspati_webhook_events/);
    expect(src).toMatch(/duplicate key|unique constraint/);
  });

  it('stripe webhook ignores events without brihaspati metadata', () => {
    const src = read(WEBHOOK_STRIPE);
    expect(src).toMatch(/brihaspati\s*!==\s*['"]true['"]/);
  });

  it('stripe webhook deduplicates via brihaspati_webhook_events insert', () => {
    const src = read(WEBHOOK_STRIPE);
    expect(src).toMatch(/brihaspati_webhook_events/);
    expect(src).toMatch(/duplicate key|unique constraint/);
  });

  it('both webhooks grant credits for pack_5 and set subscription for monthly/annual', () => {
    for (const rel of [WEBHOOK_RZ, WEBHOOK_STRIPE]) {
      const src = read(rel);
      expect(src).toMatch(/grantCredits/);
      expect(src).toMatch(/setSubscription/);
    }
  });
});

describe('Brihaspati cron — mark-eligible', () => {
  it('authenticates via the shared cron auth helper (CRON_SECRET bearer)', () => {
    const src = read(CRON);
    // Route delegates to verifyCronAuth (src/lib/api/cron-auth.ts) which
    // does the constant-time CRON_SECRET compare. Verify the import +
    // call, plus that cron-auth itself enforces CRON_SECRET.
    expect(src).toMatch(/verifyCronAuth/);
    expect(src).toMatch(/cron-auth/);
    const helperSrc = read('src/lib/api/cron-auth.ts');
    expect(helperSrc).toMatch(/CRON_SECRET/);
    expect(helperSrc).toMatch(/Unauthorized/);
    expect(helperSrc).toMatch(/timingSafeEqual/);
  });

  it('applies every §11 filter on the candidate select', () => {
    const src = read(CRON);
    expect(src).toMatch(/validation_passed[\s\S]*true/);
    expect(src).toMatch(/status[\s\S]*completed/);
    expect(src).toMatch(/training_opt_out[\s\S]*false/);
    expect(src).toMatch(/tier[\s\S]*2/);
    expect(src).toMatch(/output_tokens/);
    expect(src).toMatch(/user_rating/);
    expect(src).toMatch(/sevenDaysAgo|7\s*\*\s*86400/);
  });

  it('only marks training_eligible — never unmarks', () => {
    const src = read(CRON);
    // The update should set training_eligible: true. There should not be
    // any update that sets training_eligible: false.
    expect(src).toMatch(/training_eligible:\s*true/);
    expect(src).not.toMatch(/training_eligible:\s*false/);
  });
});
