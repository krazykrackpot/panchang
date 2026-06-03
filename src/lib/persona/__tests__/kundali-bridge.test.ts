import { describe, it, expect } from 'vitest';
import { personaToKundali } from '../kundali-bridge';
import { dbToPersonaMode } from '../types';

describe('personaToKundali', () => {
  it.each([
    ['beginner', 'simple'],
    ['enthusiast', 'detailed'],
    ['acharya', 'expert'],
  ] as const)('%s persona → %s kundali mode', (persona, expected) => {
    expect(personaToKundali(persona)).toBe(expected);
  });

  it('is a total function — every PersonaMode produces a kundali mode', () => {
    // TypeScript guarantees this at compile time, but a runtime sweep
    // catches refactors that widen the PersonaMode union without
    // updating the mapper.
    const personas: ReadonlyArray<'beginner' | 'enthusiast' | 'acharya'> = [
      'beginner',
      'enthusiast',
      'acharya',
    ];
    for (const p of personas) {
      const m = personaToKundali(p);
      expect(['simple', 'detailed', 'expert']).toContain(m);
    }
  });
});

describe('DB → persona → kundali pipeline (profile sync path)', () => {
  // This is the exact mapping the /kundali profile-sync uses to
  // translate Supabase `user_profiles.experience_level` → kundali
  // view-mode. Pinning it here so a refactor that breaks the pipeline
  // fails CI before users see the wrong default surface.
  it.each([
    ['beginner', 'simple'],
    ['intermediate', 'detailed'],
    ['advanced', 'expert'],
  ] as const)('DB %s → kundali %s', (dbValue, expected) => {
    expect(personaToKundali(dbToPersonaMode(dbValue))).toBe(expected);
  });

  it('null / unknown DB values fall through to enthusiast → detailed', () => {
    // dbToPersonaMode defaults to 'enthusiast' for anything it doesn't
    // recognise. The kundali profile-sync's `if (!data?.experience_level) return`
    // early-returns BEFORE calling the mapper for explicit null, so
    // this test guards the mapper's behaviour standalone — what
    // happens if a row has a bogus value like 'unknown' or 'expert'.
    expect(personaToKundali(dbToPersonaMode(null))).toBe('detailed');
    expect(personaToKundali(dbToPersonaMode(undefined))).toBe('detailed');
    expect(personaToKundali(dbToPersonaMode('unknown'))).toBe('detailed');
  });
});
