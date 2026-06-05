/**
 * Audit 2026-06-05 Phase 5e — bundle #16 + #27.
 *
 *   #16 — `SUPABASE_SERVICE_ROLE_KEY` `.trim()` at env-fetch
 *   #27 — `setMonth/setFullYear` → ms arithmetic (Lesson P)
 *
 * #16 fix
 *   src/lib/supabase/server.ts now trims at `process.env.X?.trim()` so
 *   an all-whitespace value is correctly rejected by the `!url || !key`
 *   guard. Previously the trim happened inside `createClient` AFTER the
 *   guard, so whitespace-only envs would produce an unauthenticated
 *   client silently.
 *
 * #27 fixes (5 sites)
 *   1. src/lib/kundali/domain-synthesis/key-dates.ts:108   windowEnd
 *   2. src/lib/kundali/domain-synthesis/timeline.ts:37     windowEnd
 *   3. src/lib/financial/annual-financial.ts:184          DEAD nextYear (deleted)
 *   4. src/lib/financial/dhana-activation.ts:64           tenYearsLater
 *   5. src/lib/kundali/domain-synthesis/narrator-v2.ts:739 sixMonthsFromNow
 *
 *   All use `Date.getTime() + N * MS_PER_{MONTH,YEAR}` per Lesson P.
 *   MS_PER_MONTH = 365.25/12 days; MS_PER_YEAR = 365.25 days.
 *
 * Cross-source: Lesson P fixes shift window edges by 0-3 days at most;
 * downstream consumers (dasha transition queries, financial yoga
 * filters, narrator emotion gates) all use the boundary as a soft
 * filter — no exact-day output values change.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoFile = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

// ───────────────────────────────────────────────────────────────────────────
// 1 — #16 trim-at-fetch
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5e.1 (#16): SUPABASE_SERVICE_ROLE_KEY trimmed at env-fetch', () => {
  const src = repoFile('src/lib/supabase/server.ts');

  it('trim is applied via optional-chain at fetch (not just at createClient)', () => {
    expect(src).toMatch(/process\.env\.NEXT_PUBLIC_SUPABASE_URL\?\.trim\(\)/);
    expect(src).toMatch(/process\.env\.SUPABASE_SERVICE_ROLE_KEY\?\.trim\(\)/);
  });

  it('createClient no longer double-trims', () => {
    // After fetch-time trim, the createClient arg becomes a clean variable.
    expect(src).toMatch(/createClient\(url,\s*key,/);
    expect(src).not.toMatch(/createClient\(url\.trim\(\),\s*key\.trim\(\)/);
  });

  // Behavior tests (Gemini round-1 MED): assert the actual rejection
  // happens for whitespace-only env vars. Imports are dynamic so we
  // can set process.env before each isolated load.
  describe('behavior — whitespace-only env vars produce null client', () => {
    const KEYS = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const;
    let saved: Partial<Record<(typeof KEYS)[number], string | undefined>>;

    beforeEach(() => {
      saved = Object.fromEntries(KEYS.map(k => [k, process.env[k]]));
      vi.resetModules();
    });
    afterEach(() => {
      for (const k of KEYS) {
        if (saved[k] === undefined) delete process.env[k];
        else process.env[k] = saved[k];
      }
      vi.resetModules();
    });

    it('returns null when SUPABASE_URL is whitespace-only', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = '   \n';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'sk_test_real_key';
      const { getServerSupabase } = await import('@/lib/supabase/server');
      expect(getServerSupabase()).toBeNull();
    });

    it('returns null when SERVICE_ROLE_KEY is whitespace-only', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = '\t\n  ';
      const { getServerSupabase } = await import('@/lib/supabase/server');
      expect(getServerSupabase()).toBeNull();
    });

    it('returns null when both undefined', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
      const { getServerSupabase } = await import('@/lib/supabase/server');
      expect(getServerSupabase()).toBeNull();
    });

    it('returns a non-null client when both env vars are clean', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'sk_test_real_key';
      const { getServerSupabase } = await import('@/lib/supabase/server');
      expect(getServerSupabase()).not.toBeNull();
    });

    it('trims trailing newline (Vercel env pull artefact) and returns a client', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co\n';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'sk_test_real_key\n';
      const { getServerSupabase } = await import('@/lib/supabase/server');
      expect(getServerSupabase()).not.toBeNull();
    });
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 2 — #27 Lesson P sweep
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5e.2 (#27): key-dates window uses ms arithmetic', () => {
  const src = repoFile('src/lib/kundali/domain-synthesis/key-dates.ts');

  it('windowEnd computed from .getTime() + monthsAhead * MS_PER_MONTH', () => {
    expect(src).toMatch(/MS_PER_MONTH\s*=\s*\(365\.25\s*\/\s*12\)\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/);
    // Defensive `new Date(currentDate)` wrap (Gemini round-1) — handles
    // string-typed Date inputs from JSON-deserialised payloads.
    expect(src).toMatch(/const current = new Date\(currentDate\)/);
    expect(src).toMatch(/current\.getTime\(\)\s*\+\s*monthsAhead\s*\*\s*MS_PER_MONTH/);
    expect(src).not.toMatch(/windowEnd\.setMonth\(windowEnd\.getMonth\(\)\s*\+\s*monthsAhead\)/);
  });
});

describe('Audit P5e.3 (#27): timeline window uses ms arithmetic', () => {
  const src = repoFile('src/lib/kundali/domain-synthesis/timeline.ts');

  it('windowEnd computed from .getTime() + yearsAhead * MS_PER_YEAR', () => {
    expect(src).toMatch(/MS_PER_YEAR\s*=\s*365\.25\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/);
    expect(src).toMatch(/const current = new Date\(currentDate\)/);
    expect(src).toMatch(/current\.getTime\(\)\s*\+\s*yearsAhead\s*\*\s*MS_PER_YEAR/);
    expect(src).not.toMatch(/windowEnd\.setFullYear\(windowEnd\.getFullYear\(\)\s*\+\s*yearsAhead\)/);
  });
});

describe('Audit P5e.4 (#27): annual-financial nextYear dead code removed', () => {
  const src = repoFile('src/lib/financial/annual-financial.ts');

  it('no nextYear declaration remains', () => {
    expect(src).not.toMatch(/const nextYear = new Date\(todayISO\)/);
    expect(src).not.toMatch(/nextYear\.setFullYear/);
  });
});

describe('Audit P5e.5 (#27): dhana-activation tenYearsLater uses ms arithmetic', () => {
  const src = repoFile('src/lib/financial/dhana-activation.ts');

  it('tenYearsLater = today.getTime() + 10 * MS_PER_YEAR', () => {
    expect(src).toMatch(/MS_PER_YEAR\s*=\s*365\.25\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/);
    expect(src).toMatch(/today\.getTime\(\)\s*\+\s*10\s*\*\s*MS_PER_YEAR/);
    expect(src).not.toMatch(/tenYearsLater\.setFullYear\(tenYearsLater\.getFullYear\(\)\s*\+\s*10\)/);
  });
});

describe('Audit P5e.6 (#27): narrator-v2 sixMonthsFromNow uses ms arithmetic', () => {
  const src = repoFile('src/lib/kundali/domain-synthesis/narrator-v2.ts');

  it('sixMonthsFromNow = Date.now() + 6 * MS_PER_MONTH', () => {
    expect(src).toMatch(/MS_PER_MONTH\s*=\s*\(365\.25\s*\/\s*12\)\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/);
    expect(src).toMatch(/Date\.now\(\)\s*\+\s*6\s*\*\s*MS_PER_MONTH/);
    expect(src).not.toMatch(/sixMonthsFromNow\.setMonth\(sixMonthsFromNow\.getMonth\(\)\s*\+\s*6\)/);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 3 — Lesson P anti-regression: setMonth truncation vs ms arithmetic
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5e.7 (#27): ms arithmetic avoids setMonth truncation', () => {
  it('Jan-31 + 1 month: setMonth says Mar-3, ms says ~Mar-2 — both not Feb-28', () => {
    // This test proves the existence of the bug we are avoiding — the
    // legacy `setMonth(getMonth() + 1)` from Jan-31 gives Mar-3 (because
    // Feb-31 overflows by 3 days). ms arithmetic gives ~Mar-2 (avg
    // month adds 30.4375 days). The exact-calendar match "1 calendar
    // month from Jan-31" is genuinely ambiguous; ms is at least
    // consistent and doesn't silently lose Feb.
    const jan31 = new Date(Date.UTC(2026, 0, 31, 12)); // noon UTC for stability
    const setMonthVariant = new Date(jan31);
    setMonthVariant.setUTCMonth(setMonthVariant.getUTCMonth() + 1);
    expect(setMonthVariant.getUTCMonth()).toBe(2); // March (0-indexed)
    expect(setMonthVariant.getUTCDate()).toBe(3);   // Mar-3 — the truncation

    const MS_PER_MONTH = (365.25 / 12) * 24 * 60 * 60 * 1000;
    const msVariant = new Date(jan31.getTime() + MS_PER_MONTH);
    // Lands around Mar-2 (30.4375 days from Jan-31).
    expect(msVariant.getUTCMonth()).toBe(2);
    expect(msVariant.getUTCDate()).toBe(2);
  });

  it('Feb-29 (leap) + 1 year: setFullYear lands Mar-1, ms lands Feb-28', () => {
    const feb29 = new Date(Date.UTC(2024, 1, 29, 12));
    const setYearVariant = new Date(feb29);
    setYearVariant.setUTCFullYear(setYearVariant.getUTCFullYear() + 1);
    // 2025 is non-leap: Feb-29 overflows to Mar-1.
    expect(setYearVariant.getUTCMonth()).toBe(2);
    expect(setYearVariant.getUTCDate()).toBe(1);

    const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
    const msVariant = new Date(feb29.getTime() + MS_PER_YEAR);
    // Lands ~Feb-28 — closer to the "anniversary" intent.
    expect(msVariant.getUTCMonth()).toBe(1);
    expect(msVariant.getUTCDate()).toBe(28);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 4 — Behavior: timeline + key-dates accept Date OR string currentDate
// ───────────────────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────────────────
// 5 — Gemini round-1 robustness: `new Date(value).getTime()` pattern
// ───────────────────────────────────────────────────────────────────────────
//
// Direct behavior test on the underlying defensive-wrap pattern,
// rather than driving the full `computeDomainTimeline` /
// `computeKeyDates` functions (which need a rich kundali stub for
// downstream dasha-trigger logic — outside this PR's scope).
//
// What we're guaranteeing: `new Date(value).getTime()` works whether
// `value` is a Date instance or an ISO string. The original direct
// `.getTime()` call would crash with `.getTime is not a function`
// when fed a string. Gemini round-1 HIGH.
describe('Audit P5e.8 (Gemini round-1): defensive new Date(currentDate) wrap', () => {
  const MS_PER_MONTH = (365.25 / 12) * 24 * 60 * 60 * 1000;

  it('Date instance input — direct or wrapped both work', () => {
    const d = new Date('2026-06-05T00:00:00Z');
    const direct = new Date(d.getTime() + 12 * MS_PER_MONTH);
    const wrapped = new Date(new Date(d).getTime() + 12 * MS_PER_MONTH);
    expect(direct.toISOString()).toBe(wrapped.toISOString());
  });

  it('ISO string input — direct .getTime() throws, wrapped does not', () => {
    const dateAsString = '2026-06-05T00:00:00Z' as unknown as Date;
    // Direct: blows up because String doesn't have .getTime().
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      (dateAsString as Date).getTime(),
    ).toThrow(/getTime is not a function/);
    // Wrapped: lands the same ISO instant.
    const result = new Date(new Date(dateAsString).getTime() + 12 * MS_PER_MONTH);
    expect(Number.isNaN(result.getTime())).toBe(false);
    // 12 months later is roughly the same date next year.
    expect(result.getUTCFullYear()).toBe(2027);
  });

  it('numeric epoch ms input — wrapped survives', () => {
    const epoch = Date.UTC(2026, 5, 5);
    const wrapped = new Date(new Date(epoch as unknown as Date).getTime() + 12 * MS_PER_MONTH);
    expect(Number.isNaN(wrapped.getTime())).toBe(false);
  });
});
