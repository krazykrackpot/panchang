/**
 * Structural tests for useBirthDataStatus — locks the invariants the
 * shared hook depends on:
 *
 *   - Module-level cache keyed by user.id
 *   - In-flight promise dedup (two near-simultaneous mounts → one query)
 *   - `invalidateBirthDataStatus` exists + clears cache + clears inflight
 *   - The Supabase query has the right shape (user_profiles,
 *     onboarding_completed + date_of_birth, eq id, maybeSingle)
 *   - Error path logs with the [useBirthDataStatus] tag (Lesson A)
 *
 * Matches the structural-test pattern used elsewhere in the project.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const FILE = join(process.cwd(), 'src/hooks/useBirthDataStatus.ts');
const SRC = readFileSync(FILE, 'utf8');

describe('useBirthDataStatus — module-level cache', () => {
  it('declares a Map cache at module scope', () => {
    expect(SRC).toMatch(/const\s+cache\s*=\s*new\s+Map<string,\s*ProfileState>\(\)/);
  });

  it('declares an in-flight Map at module scope for dedup', () => {
    expect(SRC).toMatch(/const\s+inflight\s*=\s*new\s+Map<string,\s*Promise<ProfileState>>\(\)/);
  });

  it('exports invalidateBirthDataStatus for post-save cache busting', () => {
    expect(SRC).toMatch(/export\s+function\s+invalidateBirthDataStatus/);
  });

  it('invalidateBirthDataStatus clears both cache + inflight when called with userId', () => {
    expect(SRC).toMatch(/cache\.delete\(userId\)/);
    expect(SRC).toMatch(/inflight\.delete\(userId\)/);
  });

  it('invalidateBirthDataStatus clears EVERYTHING when called without a userId', () => {
    expect(SRC).toMatch(/cache\.clear\(\)/);
    expect(SRC).toMatch(/inflight\.clear\(\)/);
  });
});

describe('useBirthDataStatus — Supabase query shape', () => {
  it('queries from user_profiles', () => {
    expect(SRC).toMatch(/\.from\(\s*['"]user_profiles['"]\s*\)/);
  });

  it('selects onboarding_completed and date_of_birth (and only those)', () => {
    expect(SRC).toMatch(/\.select\(\s*['"]onboarding_completed,\s*date_of_birth['"]\s*\)/);
  });

  it('filters by id (the user_profiles primary key)', () => {
    expect(SRC).toMatch(/\.eq\(\s*['"]id['"]\s*,\s*userId\s*\)/);
  });

  it('uses maybeSingle (returns null for missing rows, not error)', () => {
    expect(SRC).toMatch(/\.maybeSingle\(\)/);
  });

  it('logs fetch errors with the tagged [useBirthDataStatus] prefix', () => {
    expect(SRC).toMatch(/console\.error\(\s*'\[useBirthDataStatus\] profile fetch failed/);
  });
});

describe('useBirthDataStatus — return shape', () => {
  it('returns an object with loaded, missingBirthData, hasBirthData, onboardingCompleted', () => {
    expect(SRC).toMatch(/export\s+interface\s+BirthDataStatus/);
    expect(SRC).toMatch(/loaded:\s*boolean/);
    expect(SRC).toMatch(/missingBirthData:\s*boolean/);
    expect(SRC).toMatch(/hasBirthData:\s*boolean/);
    expect(SRC).toMatch(/onboardingCompleted:\s*boolean/);
  });

  it('returns loaded:false when the user is not yet known (avoids SSR flash)', () => {
    expect(SRC).toMatch(/loaded:\s*false[\s\S]{0,200}missingBirthData:\s*false/);
  });

  it('computes missingBirthData = onboardingCompleted && !hasBirthData', () => {
    expect(SRC).toMatch(/missingBirthData:\s*onboardingCompleted\s*&&\s*!hasBirthData/);
  });
});
