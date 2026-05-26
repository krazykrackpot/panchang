/**
 * Server-side validation for BirthData received over the wire.
 *
 * Used by:
 *   - POST /api/kundali              (route handler — returns 400)
 *   - computeKundaliInsights         (Server Action — throws)
 *
 * Server Actions and JSON API routes both expose `generateKundali` to
 * arbitrary clients, so neither can trust the shape of its input. This
 * helper is the single source of truth for what counts as a valid
 * BirthData; the two callers wrap the result in their own error
 * channels (Response vs throw).
 *
 * Validation rules — kept in lockstep with /api/kundali historically;
 * extracted here because Gemini's PR #202 HIGH review caught that the
 * new Server Action was passing input straight through to the
 * astronomical engine without any guard.
 */

import type { BirthData } from '@/types/kundali';

export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string };

const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** Validate a BirthData object received from an untrusted client. */
export function validateBirthData(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'birthData must be an object' };
  }
  const bd = input as Partial<BirthData>;

  if (typeof bd.date !== 'string' || !DATE_RE.test(bd.date)) {
    return { ok: false, error: 'Invalid date format. Use YYYY-MM-DD.' };
  }
  if (typeof bd.time !== 'string' || !TIME_RE.test(bd.time)) {
    return { ok: false, error: 'Invalid time format. Use HH:MM.' };
  }
  // Days-in-month gate (e.g. Feb 30 is invalid even though the regex
  // accepts it). Date.UTC(year, month, 0) returns the last day of the
  // PREVIOUS month — so passing the user's month gives us the day-count
  // for their month.
  const [year, month, day] = bd.date.split('-').map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day > daysInMonth) {
    return { ok: false, error: `Invalid date: ${year}-${String(month).padStart(2, '0')} has only ${daysInMonth} days` };
  }

  if (typeof bd.lat !== 'number' || !Number.isFinite(bd.lat) || bd.lat < -90 || bd.lat > 90) {
    return { ok: false, error: 'Invalid coordinates: lat must be a finite number in [-90, 90]' };
  }
  if (typeof bd.lng !== 'number' || !Number.isFinite(bd.lng) || bd.lng < -180 || bd.lng > 180) {
    return { ok: false, error: 'Invalid coordinates: lng must be a finite number in [-180, 180]' };
  }

  if (typeof bd.timezone !== 'string' || bd.timezone.length === 0 || bd.timezone.length > 64) {
    return { ok: false, error: 'Invalid timezone' };
  }

  return { ok: true };
}

const SUPPORTED_LOCALES = new Set(['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'gu', 'mai', 'mr']);

/** Validate the locale string used for tippanni text resolution. */
export function validateLocale(input: unknown): ValidationResult {
  if (typeof input !== 'string' || !SUPPORTED_LOCALES.has(input)) {
    return { ok: false, error: 'Invalid or unsupported locale' };
  }
  return { ok: true };
}
