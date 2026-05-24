/**
 * Sprint 9 — P1 idempotency cluster invariants.
 *
 * Structural / unit tests for the 8 fixes. Behavioural e2e for the
 * Brihaspati panel single-flight + family-synthesis in-flight dedup
 * live in e2e/sprint-9-idempotency.spec.ts.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { normalizeBirthTime, normalizeBirthName } from '@/lib/utils/birth-data';

describe('P1-23 — birth-data normalisation', () => {
  describe('normalizeBirthTime', () => {
    it('returns HH:MM unchanged', () => {
      expect(normalizeBirthTime('06:23')).toBe('06:23');
    });
    it('strips seconds from HH:MM:SS', () => {
      expect(normalizeBirthTime('06:23:00')).toBe('06:23');
      expect(normalizeBirthTime('06:23:47')).toBe('06:23');
    });
    it('zero-pads hours', () => {
      expect(normalizeBirthTime('6:23')).toBe('06:23');
    });
    it('trims whitespace', () => {
      expect(normalizeBirthTime('  06:23  ')).toBe('06:23');
    });
    it('returns empty for nullish', () => {
      expect(normalizeBirthTime(null)).toBe('');
      expect(normalizeBirthTime(undefined)).toBe('');
      expect(normalizeBirthTime('')).toBe('');
    });
    it('preserves non-matching shapes verbatim (defensive — caller should validate)', () => {
      expect(normalizeBirthTime('06:23 AM')).toBe('06:23 AM');
    });
  });

  describe('normalizeBirthName', () => {
    it('trim + lowercase', () => {
      expect(normalizeBirthName('  Aditya  ')).toBe('aditya');
      expect(normalizeBirthName('PRASAD')).toBe('prasad');
    });
    it('empty for nullish', () => {
      expect(normalizeBirthName(null)).toBe('');
      expect(normalizeBirthName(undefined)).toBe('');
    });
  });
});

describe('P1-23 — dedup call sites use the normaliser', () => {
  // All three save-chart entry points must normalise birth time before
  // dedup, otherwise "12:00" vs "12:00:00" inputs let both insert.
  // (Gemini review on #142 caught kundali/Client.tsx was missing here.)
  for (const file of [
    'src/stores/charts-store.ts',
    'src/app/[locale]/dashboard/saved-charts/page.tsx',
    'src/app/[locale]/kundali/Client.tsx',
  ]) {
    it(`${file} imports + uses normalizeBirthTime in the dup check`, () => {
      const src = readFileSync(join(process.cwd(), file), 'utf8');
      expect(src).toMatch(/normalizeBirthTime/);
      // Specifically must compare normalized values, not raw .time.
      expect(src).toMatch(/normalizeBirthTime\([^)]*\.?time\)/);
    });
  }
});

describe('P1-18 — onboarding-drip CLAIMS the day before sending', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/cron/onboarding-drip/route.ts'),
    'utf8',
  );

  it('UPDATE drip_day comes BEFORE sendEmail', () => {
    const claimIdx = src.indexOf("update({ onboarding_drip_day:");
    const sendIdx = src.indexOf('await sendEmail');
    expect(claimIdx).toBeGreaterThan(0);
    expect(sendIdx).toBeGreaterThan(claimIdx);
  });

  it('claim is conditional on (drip_day < dripDay OR NULL)', () => {
    // Only the first invocation that observes drip_day < dripDay wins.
    // NULL-handling via .or(... .is.null) catches brand-new users (Gemini
    // review on #142 — pure .lt(...) would silently skip NULL rows
    // because SQL NULL < value evaluates to UNKNOWN, not TRUE).
    expect(src).toMatch(/\.or\(['"`]onboarding_drip_day\.lt\.\$\{dripDay\},onboarding_drip_day\.is\.null['"`]\)/);
  });

  it('rolls back the claim on send failure', () => {
    expect(src).toMatch(/drip_day rollback/);
  });
});

describe('P1-19 — SIGNED_IN listener gates on userChanged', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/stores/auth-store.ts'),
    'utf8',
  );

  it('fetch /api/user/progress/sign-in is inside the userChanged gate', () => {
    // The fetch call line must appear inside the `if (userChanged)` block.
    // Approximation: look for the structural sequence.
    const userChangedIdx = src.indexOf('if (userChanged) {');
    // Find the FIRST occurrence after the SIGNED_IN check
    const signedInIdx = src.indexOf("event === 'SIGNED_IN'");
    expect(signedInIdx).toBeGreaterThan(0);
    // Within the SIGNED_IN block, there should be a userChanged guard before the fetch.
    const afterSignedIn = src.slice(signedInIdx);
    const fetchIdx = afterSignedIn.indexOf("fetch('/api/user/progress/sign-in'");
    const gateIdx = afterSignedIn.indexOf('if (userChanged)');
    expect(fetchIdx).toBeGreaterThan(0);
    expect(gateIdx).toBeGreaterThan(0);
    expect(gateIdx).toBeLessThan(fetchIdx);
    // Top-level userChanged reset still exists
    expect(userChangedIdx).toBeGreaterThan(0);
  });
});

describe('P1-20 — consumeCredit uses atomic RPC', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/lib/brihaspati/credits/credit-manager.ts'),
    'utf8',
  );

  it('calls db.rpc(consume_brihaspati_credit) inside consumeCredit', () => {
    expect(src).toMatch(/db\.rpc\('consume_brihaspati_credit'/);
  });

  it('no longer reads-then-updates brihaspati_credits in consumeCredit path', () => {
    // The "read all rows + find target + update consumed+1" pattern is gone.
    // (grantCredits still inserts; we don't want to ban .from('brihaspati_credits') globally.)
    const consumeFn = src.match(/export async function consumeCredit[\s\S]*?\n\}/)?.[0] ?? '';
    expect(consumeFn).not.toMatch(/from\('brihaspati_credits'\)/);
  });
});

describe('P1-21 — Brihaspati selectTier single-flight ref guard', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/components/brihaspati/BrihaspatiProvider.tsx'),
    'utf8',
  );

  it('declares selectTierInFlightRef via useRef', () => {
    expect(src).toMatch(/selectTierInFlightRef\s*=\s*useRef\(false\)/);
  });

  it('selectTier short-circuits when ref is true', () => {
    expect(src).toMatch(/if \(selectTierInFlightRef\.current\) return/);
  });

  it('finally block releases the ref', () => {
    expect(src).toMatch(/selectTierInFlightRef\.current = false/);
  });
});

describe('P1-22 — Brihaspati order marks abandoned (no DELETE)', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/brihaspati/order/route.ts'),
    'utf8',
  );

  it('updates status=abandoned on Stripe failure (instead of DELETE)', () => {
    expect(src).toMatch(/update\(\{\s*status:\s*['"]abandoned['"]\s*\}\)/);
  });

  it('rate-limit query excludes abandoned rows', () => {
    expect(src).toMatch(/\.neq\(['"]status['"],\s*['"]abandoned['"]\)/);
  });
});

describe('P1-24 — kundali self-chart save uses save_self_chart RPC', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/[locale]/kundali/Client.tsx'),
    'utf8',
  );

  it('calls rpc(save_self_chart) in the isSelf branch', () => {
    expect(src).toMatch(/\.rpc\(['"]save_self_chart['"]/);
  });

  it('removes the multi-step demote→update non-atomic path in the isSelf branch', () => {
    const isSelfBranch = src.match(/if \(isSelf\) \{[\s\S]*?\n\s+\}/)?.[0] ?? '';
    // Should NOT contain the previous read-then-demote-then-update chain.
    expect(isSelfBranch).not.toMatch(/from\(['"]saved_charts['"]\)[\s\S]*\.select\(['"]id['"]\)[\s\S]*\.eq\([^)]*relationship[^)]*self/);
  });
});

describe('P1-25 — family-synthesis has in-flight dedup map', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/family-synthesis/route.ts'),
    'utf8',
  );

  it('declares inflightSynthesis Map keyed on user_id', () => {
    expect(src).toMatch(/inflightSynthesis\s*=\s*new Map/);
  });

  it('returns existing in-flight promise on duplicate request', () => {
    expect(src).toMatch(/if \(existing\)\s*return existing/);
  });

  it('cleans up the map on finally (avoid permanent block on crash)', () => {
    expect(src).toMatch(/inflightSynthesis\.delete\(user\.id\)/);
  });
});

describe('Migration 036 — atomic functions exist', () => {
  const src = readFileSync(
    join(process.cwd(), 'supabase/migrations/036_atomic_credit_and_self_chart.sql'),
    'utf8',
  );

  it('defines consume_brihaspati_credit', () => {
    expect(src).toMatch(/CREATE OR REPLACE FUNCTION public\.consume_brihaspati_credit/);
    expect(src).toMatch(/FOR UPDATE SKIP LOCKED/);
  });

  it('defines save_self_chart', () => {
    expect(src).toMatch(/CREATE OR REPLACE FUNCTION public\.save_self_chart/);
  });

  it('both grant EXECUTE to service_role', () => {
    expect(src).toMatch(/GRANT EXECUTE ON FUNCTION public\.consume_brihaspati_credit.*TO service_role/);
    expect(src).toMatch(/GRANT EXECUTE ON FUNCTION public\.save_self_chart.*TO service_role/);
  });

  it('both functions are SECURITY DEFINER with explicit search_path', () => {
    expect(src).toMatch(/CREATE OR REPLACE FUNCTION public\.consume_brihaspati_credit[\s\S]*?SECURITY DEFINER[\s\S]*?SET search_path = public/);
    expect(src).toMatch(/CREATE OR REPLACE FUNCTION public\.save_self_chart[\s\S]*?SECURITY DEFINER[\s\S]*?SET search_path = public/);
  });
});
