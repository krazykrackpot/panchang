/**
 * Sprint 19 — AI quota TOCTOU close-out + checkout double-click guard.
 *
 * Structural tests that the four caller sites use the atomic claim_usage
 * (or claim_monthly_usage) RPC, that the read-then-increment pattern is
 * gone, and that the checkout double-submit guards are in place.
 *
 * Integration tests would need a postgres harness; the RPC is exercised
 * via existing Supabase migrations on staging.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('Sprint 19 — AI quota atomic claim', () => {
  describe('Migration 038', () => {
    const src = read('supabase/migrations/038_atomic_quota_claim.sql');

    it('extends daily_usage with the 3 AI feature columns', () => {
      expect(src).toMatch(/ai_reading_count INT NOT NULL DEFAULT 0/);
      expect(src).toMatch(/domain_pandit_count INT NOT NULL DEFAULT 0/);
      expect(src).toMatch(/tippanni_llm_count INT NOT NULL DEFAULT 0/);
    });

    it('defines claim_usage with atomic UPDATE ... WHERE ... < limit', () => {
      expect(src).toMatch(/CREATE OR REPLACE FUNCTION public\.claim_usage/);
      expect(src).toMatch(/UPDATE daily_usage[\s\S]{0,200}AND %I < \$2[\s\S]{0,80}RETURNING %I/);
    });

    it('defines claim_monthly_usage with FOR UPDATE row lock', () => {
      expect(src).toMatch(/CREATE OR REPLACE FUNCTION public\.claim_monthly_usage/);
      expect(src).toMatch(/FOR UPDATE/);
    });

    it('whitelists feature column names to prevent SQL injection', () => {
      expect(src).toMatch(/v_allowed_fields[\s\S]{0,200}'ai_reading_count'/);
      expect(src).toMatch(/IF NOT \(p_field = ANY\(v_allowed_fields\)\)/);
    });

    it('p_limit=-1 path increments unconditionally (unlimited tier)', () => {
      expect(src).toMatch(/IF p_limit = -1 THEN/);
    });

    it('service-role-only EXECUTE grant', () => {
      expect(src).toMatch(/REVOKE EXECUTE ON FUNCTION public\.claim_usage[\s\S]{0,80}FROM PUBLIC/);
      expect(src).toMatch(/GRANT EXECUTE ON FUNCTION public\.claim_usage[\s\S]{0,80}TO service_role/);
      expect(src).toMatch(/REVOKE EXECUTE ON FUNCTION public\.claim_monthly_usage[\s\S]{0,80}FROM PUBLIC/);
      expect(src).toMatch(/GRANT EXECUTE ON FUNCTION public\.claim_monthly_usage[\s\S]{0,80}TO service_role/);
    });
  });

  describe('check-access.ts uses claim_usage', () => {
    const src = read('src/lib/subscription/check-access.ts');

    it('daily path calls claim_usage RPC, not read-then-increment_usage', () => {
      expect(src).toMatch(/rpc\('claim_usage'/);
      // The old read-then-RPC pattern is gone for the daily path.
      // (Monthly path still reads-then-RPCs because the sum is computed
      // outside the atomic increment; documented in the route comment.)
      expect(src).not.toMatch(/from\('daily_usage'\)[\s\S]{0,100}select\(feature\)[\s\S]{0,400}rpc\('increment_usage'/);
    });

    it('fail-closed on claim_usage error', () => {
      expect(src).toMatch(/claim_usage \(daily\) failed/);
      expect(src).toMatch(/allowed: false[\s\S]{0,50}remaining: 0/);
    });
  });

  describe('ai-reading route uses claim_usage', () => {
    const src = read('src/app/api/ai-reading/route.ts');

    it('removed the in-memory dailyUsageMap', () => {
      expect(src).not.toContain('dailyUsageMap');
      expect(src).not.toContain('function getDailyUsage');
      expect(src).not.toContain('function incrementDailyUsage');
    });

    it('calls supabase.rpc("claim_usage") before LLM', () => {
      expect(src).toMatch(/rpc\('claim_usage'[\s\S]{0,100}p_field:\s*'ai_reading_count'/);
      const claimIdx = src.indexOf("'claim_usage'");
      const llmIdx = src.indexOf('claude.messages.create');
      expect(claimIdx).toBeGreaterThan(0);
      expect(llmIdx).toBeGreaterThan(claimIdx);
    });

    it('returns 429 when not claimed', () => {
      expect(src).toMatch(/!claimRow\?\.claimed/);
      expect(src).toMatch(/status:\s*429/);
    });
  });

  describe('domain-pandit route uses claim_usage', () => {
    const src = read('src/app/api/domain-pandit/route.ts');

    it('removed the in-memory dailyUsageMap', () => {
      expect(src).not.toContain('dailyUsageMap');
      expect(src).not.toContain('function getDailyUsage');
      expect(src).not.toContain('function incrementDailyUsage');
    });

    it('calls claim_usage with domain_pandit_count', () => {
      expect(src).toMatch(/p_field:\s*'domain_pandit_count'/);
    });

    it('claim precedes LLM call', () => {
      const claimIdx = src.indexOf("'claim_usage'");
      const llmIdx = src.indexOf('claude.messages.create');
      expect(claimIdx).toBeGreaterThan(0);
      expect(llmIdx).toBeGreaterThan(claimIdx);
    });
  });

  describe('tippanni-llm route uses claim_monthly_usage', () => {
    const src = read('src/app/api/tippanni-llm/route.ts');

    it('removed the in-memory monthlyUsageMap', () => {
      expect(src).not.toContain('monthlyUsageMap');
      expect(src).not.toContain('function getMonthlyUsage');
      expect(src).not.toContain('function incrementMonthlyUsage');
    });

    it('calls claim_monthly_usage with tippanni_llm_count', () => {
      expect(src).toMatch(/rpc\('claim_monthly_usage'/);
      expect(src).toMatch(/p_field:\s*'tippanni_llm_count'/);
    });

    it('claim precedes LLM call', () => {
      const claimIdx = src.indexOf("'claim_monthly_usage'");
      // Use the LAST occurrence to skip the import statement at the top
      // and find the actual call site in the request handler.
      const llmIdx = src.lastIndexOf('generateLLMSynthesis');
      expect(claimIdx).toBeGreaterThan(0);
      expect(llmIdx).toBeGreaterThan(claimIdx);
    });
  });
});

describe('Sprint 19 — checkout double-submit guards', () => {
  describe('/api/checkout server-side dedup', () => {
    const src = read('src/app/api/checkout/route.ts');

    it('checks for recent pending_checkouts before creating new Stripe session', () => {
      expect(src).toMatch(/from\('pending_checkouts'\)[\s\S]{0,300}\.gte\('created_at', FIVE_MIN_AGO\)/);
    });

    it('checks for recent pending_razorpay_subscriptions before creating new Razorpay sub', () => {
      expect(src).toMatch(/from\('pending_razorpay_subscriptions'\)[\s\S]{0,300}\.gte\('created_at', FIVE_MIN_AGO\)/);
    });

    it('returns 409 on duplicate within 5 minutes', () => {
      expect(src).toMatch(/already in progress/);
      expect(src).toMatch(/duplicate:\s*true/);
      expect(src).toMatch(/status:\s*409/);
    });
  });

  describe('pricing page client-side guard', () => {
    // The pricing route was split: `page.tsx` is now a server-component
    // shell, and the `submittingTier` double-submit guard lives in
    // `PricingClient.tsx`. Assertions follow the code to its new file.
    const src = read('src/app/[locale]/pricing/PricingClient.tsx');

    it('has submittingTier state', () => {
      expect(src).toMatch(/submittingTier/);
      expect(src).toMatch(/setSubmittingTier/);
    });

    it('handleCheckout short-circuits when already submitting', () => {
      expect(src).toMatch(/if \(submittingTier\) return/);
    });

    it('CTA button is disabled while a tier is submitting', () => {
      expect(src).toMatch(/disabled=\{isCurrentPlan \|\| submittingTier !== null\}/);
    });

    it('clears submittingTier in finally', () => {
      expect(src).toMatch(/finally \{\s*setSubmittingTier\(null\)/);
    });
  });
});
