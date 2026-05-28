/**
 * Structural tests for BirthDetailsBanner — locks the invariants the
 * self-review caught on PR #277 from quietly regressing:
 *
 *   1. localStorage.getItem is guarded with try/catch (Safari private
 *      mode + some browser configs throw on any localStorage access;
 *      without the guard the banner would crash the page region)
 *   2. Future-timestamped (clock-skewed) dismissals are treated as "no
 *      dismissal recorded" rather than locking the banner closed until
 *      the clock catches up
 *   3. The 6-hour cool-down constant is in milliseconds (not seconds /
 *      hours by accident)
 *   4. The CTA dispatches the canonical ONBOARDING_OPEN_EVENT
 *   5. The render gate skips when user is null, profile is still
 *      loading, no nudge needed, or cool-down is active
 *
 * Matches the structural-test pattern used by
 * src/components/brihaspati/brihaspati-components.test.ts.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const FILE = join(process.cwd(), 'src/components/auth/BirthDetailsBanner.tsx');
const SRC = readFileSync(FILE, 'utf8');

describe('BirthDetailsBanner — localStorage safety', () => {
  it('wraps localStorage.getItem in a try/catch', () => {
    // The localStorage read must live inside a try block. Walk the
    // source: find the read, then assert the closest preceding `try {`
    // appears before it and a `} catch` appears after — handles nested
    // braces inside the try body (which `[^}]*` cannot).
    const idx = SRC.indexOf('localStorage.getItem(LS_DISMISSED_AT_KEY)');
    expect(idx, 'localStorage.getItem(LS_DISMISSED_AT_KEY) call missing').toBeGreaterThan(0);
    const before = SRC.slice(0, idx);
    const after = SRC.slice(idx);
    expect(before.lastIndexOf('try {'), 'no `try {` before the read').toBeGreaterThan(-1);
    expect(after.indexOf('} catch'), 'no `} catch` after the read').toBeGreaterThan(-1);
  });

  it('logs the localStorage read failure (no silent swallow)', () => {
    // Per Lesson A — failure paths must log with a tagged
    // console.error so production debugging is possible.
    expect(SRC).toMatch(/console\.error\(\s*'\[BirthDetailsBanner\] localStorage read failed/);
  });

  it('treats future timestamps as "no dismissal recorded"', () => {
    // Without the `<= Date.now()` guard a clock-skewed write would
    // permanently lock the banner closed until the local clock
    // caught up. The implementation gates via Number.isFinite + <=.
    expect(SRC).toMatch(/Number\.isFinite\([^)]*\)\s*&&\s*[^>]*<=\s*Date\.now\(\)/);
  });
});

describe('BirthDetailsBanner — cool-down', () => {
  it('cool-down constant is 6 hours expressed in milliseconds', () => {
    // The constant must be 6 * 60 * 60 * 1000 — not, e.g., 6 (which
    // would be 6ms) or 6 * 60 * 60 (which would be 6 hours in seconds).
    expect(SRC).toMatch(/const\s+COOLDOWN_MS\s*=\s*6\s*\*\s*60\s*\*\s*60\s*\*\s*1000/);
  });

  it('cool-down logic compares (now - dismissedAt) against COOLDOWN_MS', () => {
    expect(SRC).toMatch(/Date\.now\(\)\s*-\s*dismissedAt[^<]*<\s*COOLDOWN_MS/);
  });
});

describe('BirthDetailsBanner — event-bus contract', () => {
  it('imports ONBOARDING_OPEN_EVENT from the shared events module', () => {
    expect(SRC).toMatch(/from\s+['"]\.\/onboarding-events['"]/);
    expect(SRC).toMatch(/ONBOARDING_OPEN_EVENT/);
  });

  it('CTA dispatches a window CustomEvent with ONBOARDING_OPEN_EVENT', () => {
    expect(SRC).toMatch(/window\.dispatchEvent\(\s*new\s+CustomEvent\(\s*ONBOARDING_OPEN_EVENT/);
  });

  it('CustomEvent detail tags the source as "birth-details-banner" (telemetry)', () => {
    expect(SRC).toMatch(/source:\s*['"]birth-details-banner['"]/);
  });
});

describe('BirthDetailsBanner — render gating', () => {
  it('renders nothing when user is not logged in', () => {
    expect(SRC).toMatch(/if\s*\(!user\)\s*return\s+null/);
  });

  it('renders nothing while the profile fetch is still loading', () => {
    // The `loaded` flag prevents the SSR/CSR flash before we know
    // whether the user has birth data or not.
    expect(SRC).toMatch(/if\s*\(!loaded\)\s*return\s+null/);
  });

  it('renders nothing when the shared hook says the user does not need the prompt', () => {
    // useBirthDataStatus.missingBirthData is true only when
    // onboarding_completed && !date_of_birth.
    expect(SRC).toMatch(/if\s*\(!missingBirthData\)\s*return\s+null/);
  });

  it('renders nothing while the dismissal cool-down is active', () => {
    expect(SRC).toMatch(/if\s*\(isCooledDown\)\s*return\s+null/);
  });
});

describe('BirthDetailsBanner — uses shared hook (not its own Supabase query)', () => {
  it('imports useBirthDataStatus from the shared hook', () => {
    expect(SRC).toMatch(/import\s*{\s*useBirthDataStatus\s*}\s*from\s+['"]@\/hooks\/useBirthDataStatus['"]/);
  });

  it('does NOT call getSupabase directly — the hook owns the fetch', () => {
    // After the refactor in fix/birth-data-status-hook, the banner
    // no longer hits the database itself; SadhakaBanner and
    // BirthDetailsBanner share a single user_profiles query via the
    // module-cached useBirthDataStatus hook.
    expect(SRC).not.toMatch(/getSupabase\(\)/);
  });

  it('does NOT query user_profiles inline — that moved to the hook', () => {
    expect(SRC).not.toMatch(/\.from\(\s*['"]user_profiles['"]\s*\)/);
  });
});

describe('BirthDetailsBanner — copy + accessibility', () => {
  it('headline + subtitle are i18n\'d for en and hi', () => {
    expect(SRC).toMatch(/Add your birth details to unlock your kundali/);
    expect(SRC).toMatch(/अपने जन्म विवरण जोड़ें/);
  });

  it('CTA has explicit en + hi labels', () => {
    expect(SRC).toMatch(/Add now/);
    expect(SRC).toMatch(/अभी जोड़ें/);
  });

  it('outer banner has role + aria-label for screen readers', () => {
    expect(SRC).toMatch(/role=\s*['"]region['"]/);
    expect(SRC).toMatch(/aria-label/);
  });
});
