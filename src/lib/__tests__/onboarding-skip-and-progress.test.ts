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
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('OnboardingModal — Skip button must NOT mark onboarding complete', () => {
  const modalPath = join(process.cwd(), 'src/components/auth/OnboardingModal.tsx');
  const source = readFileSync(modalPath, 'utf-8');

  it('skip-path upsert sets onboarding_completed: false', () => {
    // Find the skip-button onClick handler. It's an inline async arrow that
    // contains a supabase.from('user_profiles').upsert(...).
    // We slice from "Skip" comment to the next closing })
    const skipMarker = source.indexOf('Skip path');
    expect(skipMarker).toBeGreaterThan(-1);

    const skipBlock = source.slice(skipMarker, skipMarker + 600);
    expect(skipBlock).toContain('onboarding_completed: false');
    expect(skipBlock).not.toContain('onboarding_completed: true');
  });

  it('submit path (with birth data) still sets onboarding_completed: true', () => {
    // The full submit path is the one that runs when birthDate && birthLocation
    // are provided. We make sure we didn't accidentally over-flip it.
    const buildProfileMarker = source.indexOf('Build profile data');
    expect(buildProfileMarker).toBeGreaterThan(-1);

    const submitBlock = source.slice(buildProfileMarker, buildProfileMarker + 400);
    expect(submitBlock).toContain('onboarding_completed: true');
  });
});

describe('Dashboard — ProfileProgressBar render condition', () => {
  const dashPath = join(process.cwd(), 'src/app/[locale]/dashboard/page.tsx');
  const source = readFileSync(dashPath, 'utf-8');

  it('shows progress bar whenever ANY birth field is missing (not gated on hasBirthData)', () => {
    // The fixed condition. If anyone narrows this back to require hasBirthData,
    // ghosted users stop seeing the nudge — defeats the whole point of the fix.
    expect(source).toContain('!hasBirthData || !profileHasTime || !profileHasPlace');
    // Old broken condition must be gone.
    expect(source).not.toContain('hasBirthData && (!profileHasTime || !profileHasPlace) ?');
  });
});
