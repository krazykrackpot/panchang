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

import { describe, it, expect } from 'vitest';
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
});

// ───────────────────────────────────────────────────────────────────────────
// 2 — #27 Lesson P sweep
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5e.2 (#27): key-dates window uses ms arithmetic', () => {
  const src = repoFile('src/lib/kundali/domain-synthesis/key-dates.ts');

  it('windowEnd computed from getTime() + monthsAhead * MS_PER_MONTH', () => {
    expect(src).toMatch(/MS_PER_MONTH\s*=\s*\(365\.25\s*\/\s*12\)\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/);
    expect(src).toMatch(/currentDate\.getTime\(\)\s*\+\s*monthsAhead\s*\*\s*MS_PER_MONTH/);
    expect(src).not.toMatch(/windowEnd\.setMonth\(windowEnd\.getMonth\(\)\s*\+\s*monthsAhead\)/);
  });
});

describe('Audit P5e.3 (#27): timeline window uses ms arithmetic', () => {
  const src = repoFile('src/lib/kundali/domain-synthesis/timeline.ts');

  it('windowEnd computed from getTime() + yearsAhead * MS_PER_YEAR', () => {
    expect(src).toMatch(/MS_PER_YEAR\s*=\s*365\.25\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/);
    expect(src).toMatch(/currentDate\.getTime\(\)\s*\+\s*yearsAhead\s*\*\s*MS_PER_YEAR/);
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
