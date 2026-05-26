/**
 * Static-shape regression tests for the duplicate-detection wiring
 * across /api/brihaspati/order, /api/brihaspati/check-similarity, and
 * BrihaspatiProvider. The actual similarity math is covered by
 * similarity.test.ts; this file just guards the contract between
 * server and client so future refactors can't silently break the
 * 2026-05-25 fix.
 *
 * Patterned after stripe-webhook-binding.test.ts.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');

describe('/api/brihaspati/order — duplicate-detection enforcement', () => {
  const src = read('src/app/api/brihaspati/order/route.ts');

  it('imports findNearDuplicates + lookback constant from similarity module', () => {
    expect(src).toMatch(/findNearDuplicates/);
    expect(src).toMatch(/DUPLICATE_LOOKBACK_MINUTES/);
    expect(src).toMatch(/from\s+['"]@\/lib\/brihaspati\/similarity['"]/);
  });

  it('accepts a confirmDuplicate flag from the client', () => {
    expect(src).toMatch(/confirmDuplicate\?:\s*unknown/);
    expect(src).toMatch(/body\.confirmDuplicate\s*===\s*true/);
  });

  it('queries the user\'s own recent questions only (RLS + scoping)', () => {
    expect(src).toMatch(/from\(['"]brihaspati_questions['"]\)/);
    expect(src).toMatch(/\.eq\(['"]user_id['"],\s*user\.id\)/);
    expect(src).toMatch(/\.neq\(['"]status['"],\s*['"]abandoned['"]\)/);
  });

  it('returns 409 with DUPLICATE_DETECTED + duplicates array', () => {
    expect(src).toMatch(/status:\s*409/);
    expect(src).toMatch(/DUPLICATE_DETECTED/);
    expect(src).toMatch(/duplicates:\s*dups/);
  });

  it('FAILS CLOSED on lookback query error (never silently lets a charge through)', () => {
    // Audit Round 2 lesson: a Supabase outage previously let
    // unlimited orders pass. Same principle: dup-check failure means
    // refuse, don\'t fall through to charging.
    expect(src).toMatch(/dup lookback failed/);
    expect(src).toMatch(/Service temporarily unavailable/);
  });

  it('only runs the dup check when confirmDuplicate is false', () => {
    // Otherwise users would be stuck in a loop after explicitly
    // confirming on the modal.
    expect(src).toMatch(/if\s*\(\s*!confirmDuplicate\s*\)/);
  });
});

describe('/api/brihaspati/check-similarity — pre-flight endpoint', () => {
  const src = read('src/app/api/brihaspati/check-similarity/route.ts');

  it('is a POST handler', () => {
    expect(src).toMatch(/export async function POST/);
  });

  it('requires Bearer auth + checks user', () => {
    expect(src).toMatch(/Bearer/);
    expect(src).toMatch(/supabase\.auth\.getUser/);
    expect(src).toMatch(/status:\s*401/);
  });

  it('IP-rate-limits to prevent question-text brute-forcing', () => {
    expect(src).toMatch(/checkRateLimit/);
    expect(src).toMatch(/getClientIP/);
    expect(src).toMatch(/status:\s*429/);
  });

  it('validates question length (matches the order route)', () => {
    expect(src).toMatch(/length\s*<\s*3/);
    expect(src).toMatch(/length\s*>\s*500/);
  });

  it('uses the shared similarity engine (no duplicated logic)', () => {
    expect(src).toMatch(/findNearDuplicates/);
    expect(src).toMatch(/from\s+['"]@\/lib\/brihaspati\/similarity['"]/);
  });

  it('does NOT insert any rows (read-only pre-flight)', () => {
    expect(src).not.toMatch(/\.insert\(/);
  });
});

describe('BrihaspatiProvider — duplicate-confirmation state', () => {
  const src = read('src/components/brihaspati/BrihaspatiProvider.tsx');

  it('exposes a confirming_duplicate panel state', () => {
    expect(src).toMatch(/kind:\s*['"]confirming_duplicate['"]/);
  });

  it('selectTier accepts opts.confirmDuplicate and forwards it to the order route', () => {
    expect(src).toMatch(/confirmDuplicate\?:\s*boolean/);
    expect(src).toMatch(/confirmDuplicate:\s*opts\.confirmDuplicate\s*===\s*true/);
  });

  it('handles 409 DUPLICATE_DETECTED by entering confirming_duplicate state', () => {
    expect(src).toMatch(/status\s*===\s*409/);
    expect(src).toMatch(/DUPLICATE_DETECTED/);
  });
});
