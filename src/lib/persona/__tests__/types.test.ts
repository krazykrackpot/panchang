/**
 * Unit tests for the persona-mode types + DB↔frontend mapping.
 *
 * The DB column values (`beginner | intermediate | advanced`) must map
 * cleanly to the frontend persona names (`beginner | enthusiast |
 * acharya`). Round-trip must be lossless.
 */

import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PERSONA_MODE,
  dbToPersonaMode,
  isValidPersonaMode,
  personaModeToDb,
  type PersonaMode,
} from '../types';

describe('persona/types', () => {
  describe('DEFAULT_PERSONA_MODE', () => {
    it('is enthusiast (middle option, least surprising default)', () => {
      expect(DEFAULT_PERSONA_MODE).toBe('enthusiast');
    });
  });

  describe('dbToPersonaMode', () => {
    it("maps 'beginner' → beginner", () => {
      expect(dbToPersonaMode('beginner')).toBe('beginner');
    });

    it("maps 'intermediate' → enthusiast (activates the previously wasted segment)", () => {
      expect(dbToPersonaMode('intermediate')).toBe('enthusiast');
    });

    it("maps 'advanced' → acharya", () => {
      expect(dbToPersonaMode('advanced')).toBe('acharya');
    });

    it('falls back to default for null', () => {
      expect(dbToPersonaMode(null)).toBe(DEFAULT_PERSONA_MODE);
    });

    it('falls back to default for undefined', () => {
      expect(dbToPersonaMode(undefined)).toBe(DEFAULT_PERSONA_MODE);
    });

    it('falls back to default for an unknown string', () => {
      expect(dbToPersonaMode('expert')).toBe(DEFAULT_PERSONA_MODE);
      expect(dbToPersonaMode('')).toBe(DEFAULT_PERSONA_MODE);
      expect(dbToPersonaMode('BEGINNER')).toBe(DEFAULT_PERSONA_MODE);
    });

    it('accepts frontend names as defence-in-depth (Gemini PR #381 cycle-3 MED)', () => {
      // The DB CHECK constraint should prevent these, but if a future
      // migration relaxes it OR a bug writes a frontend name, we
      // would rather pass it through than silently downgrade.
      expect(dbToPersonaMode('enthusiast')).toBe('enthusiast');
      expect(dbToPersonaMode('acharya')).toBe('acharya');
    });
  });

  describe('personaModeToDb', () => {
    it('maps beginner → beginner', () => {
      expect(personaModeToDb('beginner')).toBe('beginner');
    });

    it('maps enthusiast → intermediate', () => {
      expect(personaModeToDb('enthusiast')).toBe('intermediate');
    });

    it('maps acharya → advanced', () => {
      expect(personaModeToDb('acharya')).toBe('advanced');
    });
  });

  describe('round-trip (frontend → DB → frontend)', () => {
    const modes: PersonaMode[] = ['beginner', 'enthusiast', 'acharya'];
    for (const m of modes) {
      it(`is lossless for ${m}`, () => {
        expect(dbToPersonaMode(personaModeToDb(m))).toBe(m);
      });
    }
  });

  describe('isValidPersonaMode', () => {
    it('accepts the three valid modes', () => {
      expect(isValidPersonaMode('beginner')).toBe(true);
      expect(isValidPersonaMode('enthusiast')).toBe(true);
      expect(isValidPersonaMode('acharya')).toBe(true);
    });

    it('rejects the DB-side names (we want the frontend names here)', () => {
      // `intermediate` and `advanced` are valid DB values but not
      // frontend persona names — `isValidPersonaMode` is the frontend
      // type guard.
      expect(isValidPersonaMode('intermediate')).toBe(false);
      expect(isValidPersonaMode('advanced')).toBe(false);
    });

    it('rejects unrelated values', () => {
      expect(isValidPersonaMode('')).toBe(false);
      expect(isValidPersonaMode(null)).toBe(false);
      expect(isValidPersonaMode(undefined)).toBe(false);
      expect(isValidPersonaMode(42)).toBe(false);
      expect(isValidPersonaMode({})).toBe(false);
    });
  });
});
