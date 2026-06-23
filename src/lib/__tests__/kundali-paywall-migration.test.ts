/**
 * Structural tests for the kundali-paywall migrations (066 + 067).
 *
 * Same pattern as src/lib/__tests__/quota-atomic-claim.test.ts: the
 * actual RPC behaviour is exercised on staging via real DB calls, but
 * the migration SQL source files are read here so the safety properties
 * (FOR UPDATE locking, ON CONFLICT idempotency, RLS, SECURITY DEFINER
 * + REVOKE) can never silently regress in a future migration edit.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('Migration 066 — kundali paywall tables', () => {
  const src = read('supabase/migrations/066_kundali_paywall.sql');

  describe('chart_credits', () => {
    it('user_id is PRIMARY KEY (one row per user)', () => {
      expect(src).toMatch(/CREATE TABLE IF NOT EXISTS public\.chart_credits[\s\S]{0,200}user_id uuid PRIMARY KEY/);
    });

    it('credits_remaining cannot go negative (CHECK constraint)', () => {
      expect(src).toMatch(/credits_remaining int NOT NULL DEFAULT 0 CHECK \(credits_remaining >= 0\)/);
    });
  });

  describe('chart_entitlements', () => {
    it('UNIQUE (user_id, kundali_fingerprint) enforces idempotent unlock', () => {
      expect(src).toMatch(/UNIQUE \(user_id, kundali_fingerprint\)/);
    });

    it('source column is whitelisted to known values', () => {
      expect(src).toMatch(/source text NOT NULL CHECK \(source IN \('single', 'family', 'admin_grant'\)\)/);
    });

    it('has an index on user_id for the credits-dashboard query', () => {
      expect(src).toMatch(/CREATE INDEX IF NOT EXISTS idx_chart_entitlements_user/);
    });
  });

  describe('chart_credit_purchases', () => {
    it('UNIQUE (provider, provider_session_id) is the webhook-replay guard', () => {
      expect(src).toMatch(/UNIQUE \(provider, provider_session_id\)/);
    });

    it('amount_paid_minor and credits_granted must be positive', () => {
      expect(src).toMatch(/credits_granted int NOT NULL CHECK \(credits_granted > 0\)/);
      expect(src).toMatch(/amount_paid_minor int NOT NULL CHECK \(amount_paid_minor > 0\)/);
    });

    it('sku whitelisted to the spec values', () => {
      expect(src).toMatch(/sku text NOT NULL CHECK \(sku IN \('single', 'family'\)\)/);
    });

    it('provider whitelisted (no future open-ended providers without an explicit migration)', () => {
      expect(src).toMatch(/provider text NOT NULL CHECK \(provider IN \('stripe', 'razorpay'\)\)/);
    });
  });

  describe('RLS', () => {
    for (const tbl of ['chart_credits', 'chart_entitlements', 'chart_credit_purchases']) {
      it(`${tbl} has RLS enabled + own-row read policy`, () => {
        expect(src).toMatch(new RegExp(`ALTER TABLE public\\.${tbl} ENABLE ROW LEVEL SECURITY`));
        expect(src).toMatch(new RegExp(`CREATE POLICY ${tbl}_own_read ON public\\.${tbl}[\\s\\S]{0,150}user_id = auth\\.uid\\(\\)`));
      });
    }

    it('does NOT grant write policies to authenticated — mutations only via service_role', () => {
      expect(src).not.toMatch(/FOR INSERT TO authenticated/);
      expect(src).not.toMatch(/FOR UPDATE TO authenticated/);
      expect(src).not.toMatch(/FOR DELETE TO authenticated/);
    });
  });

  describe('spend_chart_credit RPC', () => {
    it('is SECURITY DEFINER', () => {
      expect(src).toMatch(/CREATE OR REPLACE FUNCTION public\.spend_chart_credit[\s\S]{0,400}SECURITY DEFINER/);
    });

    it('sets search_path = public (defence against search_path attacks)', () => {
      expect(src).toMatch(/CREATE OR REPLACE FUNCTION public\.spend_chart_credit[\s\S]{0,400}SET search_path = public/);
    });

    it('locks chart_credits row FOR UPDATE before checking balance (concurrent-spend race)', () => {
      expect(src).toMatch(/FROM chart_credits[\s\S]{0,80}FOR UPDATE/);
    });

    it('returns already_unlocked without spending when entitlement exists', () => {
      expect(src).toMatch(/IF v_existing_id IS NOT NULL THEN[\s\S]{0,200}'already_unlocked'/);
    });

    it('returns insufficient_credits when balance is 0', () => {
      expect(src).toMatch(/'insufficient_credits'/);
    });

    it('REVOKEs from PUBLIC and grants only to service_role', () => {
      expect(src).toMatch(/REVOKE ALL ON FUNCTION public\.spend_chart_credit FROM PUBLIC/);
      expect(src).toMatch(/GRANT EXECUTE ON FUNCTION public\.spend_chart_credit TO service_role/);
    });
  });
});

describe('Migration 068 — spend_chart_credit returns balance on all branches', () => {
  const src = read('supabase/migrations/068_spend_chart_credit_return_balance.sql');

  it('is SECURITY DEFINER + search_path pinned', () => {
    expect(src).toMatch(/SECURITY DEFINER/);
    expect(src).toMatch(/SET search_path = public/);
  });

  it("'unlocked' branch returns credits_remaining (from UPDATE RETURNING)", () => {
    expect(src).toMatch(/RETURNING credits_remaining INTO v_balance/);
    expect(src).toMatch(/'status', 'unlocked'[\s\S]{0,200}'credits_remaining', v_balance/);
  });

  it("'already_unlocked' branch returns credits_remaining (fresh SELECT)", () => {
    expect(src).toMatch(/'status', 'already_unlocked'[\s\S]{0,300}'credits_remaining', COALESCE\(v_balance, 0\)/);
  });

  it('REVOKEs from PUBLIC and grants only to service_role', () => {
    expect(src).toMatch(/REVOKE ALL ON FUNCTION public\.spend_chart_credit\(uuid, text, text, text\) FROM PUBLIC/);
    expect(src).toMatch(/GRANT EXECUTE ON FUNCTION public\.spend_chart_credit\(uuid, text, text, text\) TO service_role/);
  });
});

describe('Migration 067 — grant_chart_credits RPC', () => {
  const src = read('supabase/migrations/067_grant_chart_credits_rpc.sql');

  it('is SECURITY DEFINER + search_path pinned', () => {
    expect(src).toMatch(/SECURITY DEFINER/);
    expect(src).toMatch(/SET search_path = public/);
  });

  it('uses ON CONFLICT DO NOTHING for webhook-replay idempotency', () => {
    expect(src).toMatch(/ON CONFLICT \(provider, provider_session_id\) DO NOTHING/);
  });

  it('returns status=duplicate on replay (no credits re-granted)', () => {
    expect(src).toMatch(/IF v_purchase_id IS NULL THEN[\s\S]{0,300}'duplicate'/);
  });

  it('UPSERTs chart_credits with additive increment (multiple purchases stack)', () => {
    expect(src).toMatch(
      /INSERT INTO chart_credits[\s\S]{0,500}ON CONFLICT \(user_id\) DO UPDATE[\s\S]{0,300}credits_remaining = chart_credits\.credits_remaining \+ EXCLUDED\.credits_remaining/,
    );
  });

  it('REVOKEs from PUBLIC and grants only to service_role', () => {
    expect(src).toMatch(/REVOKE ALL ON FUNCTION public\.grant_chart_credits FROM PUBLIC/);
    expect(src).toMatch(/GRANT EXECUTE ON FUNCTION public\.grant_chart_credits TO service_role/);
  });
});
