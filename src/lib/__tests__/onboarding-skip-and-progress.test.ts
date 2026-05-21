/**
 * Regression guards for the 2026-05-21 activation fix.
 *
 * Context: 17 of 21 last-week signups ghosted with empty profiles. Root
 * causes:
 *   (1) OnboardingModal "Skip for now" button wrote
 *       onboarding_completed: true, removing every future nudge.
 *   (2) Dashboard ProfileProgressBar was gated on hasBirthData, hiding it
 *       from the exact cohort that had skipped (no birth data at all).
 *
 * These guards lock the fixed behavior in source so a future edit can't
 * silently revert it.
 *
 * NOTE on approach: these are source-text guards, not unit tests of behavior.
 * Pulling the OnboardingModal into JSDOM and stubbing Supabase to assert what
 * the Skip button persists is the "proper" way — but it costs disproportionate
 * setup for a one-line flag check. The guards here use brace-balanced
 * extraction (not magic offsets) and stable comment anchors that we own, so
 * they survive formatter runs. If they ever break for a wrong reason, the
 * right fix is to graduate to a component test, not to delete the guard.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Walk the source forward from `start`, counting curly braces, and return the
 * substring that ends at the matching closing brace + 1. Resilient to
 * formatting changes that would break a fixed-offset slice.
 */
function extractBalancedBlock(source: string, start: number): string {
  let depth = 0;
  let i = start;
  let opened = false;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '{') {
      depth++;
      opened = true;
    } else if (ch === '}') {
      depth--;
      if (opened && depth === 0) return source.slice(start, i + 1);
    }
    i++;
  }
  return source.slice(start);
}

describe('OnboardingModal — Skip button must NOT mark onboarding complete', () => {
  const modalPath = join(process.cwd(), 'src/components/auth/OnboardingModal.tsx');
  const source = readFileSync(modalPath, 'utf-8');

  it('skip-path upsert sets onboarding_completed: false', () => {
    // Anchor on our own stable comment, then extract the immediately following
    // upsert object literal by brace-matching.
    const marker = source.indexOf('Skip path: persist name + level');
    expect(marker, 'Skip-path anchor comment is missing — Skip handler may have been refactored').toBeGreaterThan(-1);

    const upsertStart = source.indexOf('upsert({', marker);
    expect(upsertStart, 'upsert() call not found after Skip anchor').toBeGreaterThan(-1);

    const skipBlock = extractBalancedBlock(source, source.indexOf('{', upsertStart));
    expect(skipBlock).toContain('onboarding_completed: false');
    expect(skipBlock).not.toContain('onboarding_completed: true');
  });

  it('submit path (with birth data) still sets onboarding_completed: true', () => {
    // The submit path persists via a profileData object literal that includes
    // onboarding_completed. Anchor on its pre-existing comment.
    const marker = source.indexOf('Build profile data');
    expect(marker, 'Build-profile-data anchor missing — submit handler refactored?').toBeGreaterThan(-1);

    const objStart = source.indexOf('{', marker);
    const submitBlock = extractBalancedBlock(source, objStart);
    expect(submitBlock).toContain('onboarding_completed: true');
    expect(submitBlock).not.toContain('onboarding_completed: false');
  });

  it('exactly one onboarding_completed: true and one onboarding_completed: false in the file', () => {
    // Defense-in-depth: catches a regression where someone adds a third
    // assignment elsewhere, or flips one without renaming.
    const trueHits = (source.match(/onboarding_completed:\s*true/g) || []).length;
    const falseHits = (source.match(/onboarding_completed:\s*false/g) || []).length;
    expect(trueHits).toBe(1);
    expect(falseHits).toBe(1);
  });
});

describe('Dashboard — ProfileProgressBar render condition', () => {
  const dashPath = join(process.cwd(), 'src/app/[locale]/dashboard/page.tsx');
  const source = readFileSync(dashPath, 'utf-8');

  it('shows progress bar whenever ANY profile field is missing (not gated on hasBirthData alone)', () => {
    // The fixed condition. If anyone narrows this back to require hasBirthData,
    // ghosted users stop seeing the nudge — defeats the whole point of the fix.
    // Tolerate the displayName guard being present (added per code review).
    expect(source).toMatch(/!hasBirthData\s*\|\|\s*!profileHasTime\s*\|\|\s*!profileHasPlace/);
    // Old broken condition must be gone.
    expect(source).not.toMatch(/hasBirthData\s*&&\s*\(\s*!profileHasTime\s*\|\|\s*!profileHasPlace\s*\)\s*\?/);
  });
});
