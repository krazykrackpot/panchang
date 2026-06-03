/**
 * Persona mode types + DB↔frontend mapping helpers.
 *
 * The DB column `user_profiles.experience_level` was added in migration
 * 021 with values 'beginner' | 'intermediate' | 'advanced'. We keep that
 * naming on the DB side for backward compatibility (existing rows must
 * not be migrated). On the frontend we use persona-friendly names that
 * match the strategy doc + UI copy.
 *
 * See docs/superpowers/specs/2026-06-03-persona-mode-setting-v1-design.md
 * and docs/PERSONAS_AND_JOURNEYS.md for context.
 */

/** Frontend / UI mode names. */
export type PersonaMode = 'beginner' | 'enthusiast' | 'acharya';

/** Database column values (`user_profiles.experience_level`). */
export type DbExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Default for visitors with no cookie / localStorage / profile value.
 * Enthusiast is the middle option — least surprising for the bulk of
 * organic discovery traffic per the personas doc.
 */
export const DEFAULT_PERSONA_MODE: PersonaMode = 'enthusiast';

/**
 * Map a DB `experience_level` value to the frontend persona mode.
 *
 * The canonical inputs are `beginner | intermediate | advanced`
 * (enforced by the column CHECK constraint in migration 021). We also
 * accept the frontend names (`enthusiast | acharya`) as a defensive
 * fallback — if a future migration relaxes the CHECK constraint, or
 * a bug ever writes a frontend name to the column, the user should
 * not be silently downgraded to the default. Gemini PR #381 cycle-3
 * MED.
 */
export function dbToPersonaMode(
  dbValue: string | null | undefined,
): PersonaMode {
  switch (dbValue) {
    case 'beginner':
      return 'beginner';
    case 'intermediate':
    case 'enthusiast':
      return 'enthusiast';
    case 'advanced':
    case 'acharya':
      return 'acharya';
    default:
      // Unknown / null / undefined → safest middle default.
      return DEFAULT_PERSONA_MODE;
  }
}

/** Inverse mapping — frontend → DB. Always returns a valid `DbExperienceLevel`. */
export function personaModeToDb(mode: PersonaMode): DbExperienceLevel {
  switch (mode) {
    case 'beginner':
      return 'beginner';
    case 'enthusiast':
      return 'intermediate';
    case 'acharya':
      return 'advanced';
  }
}

/** Type guard for arbitrary input. */
export function isValidPersonaMode(value: unknown): value is PersonaMode {
  return (
    value === 'beginner' || value === 'enthusiast' || value === 'acharya'
  );
}
