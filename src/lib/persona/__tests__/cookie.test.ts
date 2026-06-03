/**
 * Unit tests for the cookie / localStorage helpers.
 *
 * Focused on the parse + cookie-header build paths. The browser-only
 * helpers (`setPersonaModeCookieClient`, `readPersonaModeCookieClient`)
 * are exercised in jsdom in the context tests.
 */

import { describe, expect, it } from 'vitest';
import { DEFAULT_PERSONA_MODE } from '../types';
import {
  buildPersonaModeCookieHeader,
  parsePersonaMode,
  PERSONA_MODE_COOKIE_NAME,
} from '../cookie';

describe('persona/cookie', () => {
  describe('PERSONA_MODE_COOKIE_NAME', () => {
    it('is the documented `dp-persona-mode` key', () => {
      // Hardcoded check — if this name changes, the spec needs to be
      // updated too (browser cookies + telemetry both reference it).
      expect(PERSONA_MODE_COOKIE_NAME).toBe('dp-persona-mode');
    });
  });

  describe('parsePersonaMode', () => {
    it('passes through valid values', () => {
      expect(parsePersonaMode('beginner')).toBe('beginner');
      expect(parsePersonaMode('enthusiast')).toBe('enthusiast');
      expect(parsePersonaMode('acharya')).toBe('acharya');
    });

    it('returns the default for null / undefined / empty', () => {
      expect(parsePersonaMode(null)).toBe(DEFAULT_PERSONA_MODE);
      expect(parsePersonaMode(undefined)).toBe(DEFAULT_PERSONA_MODE);
      expect(parsePersonaMode('')).toBe(DEFAULT_PERSONA_MODE);
    });

    it('returns the default for tampered or stale values', () => {
      // Legacy values that may exist in cookies from before v1 — must
      // be ignored rather than break the UI.
      expect(parsePersonaMode('expert')).toBe(DEFAULT_PERSONA_MODE);
      expect(parsePersonaMode('simple')).toBe(DEFAULT_PERSONA_MODE);
      expect(parsePersonaMode('intermediate')).toBe(DEFAULT_PERSONA_MODE);
      expect(parsePersonaMode('ACHARYA')).toBe(DEFAULT_PERSONA_MODE);
    });
  });

  describe('buildPersonaModeCookieHeader', () => {
    it('produces the expected attribute string', () => {
      const out = buildPersonaModeCookieHeader('enthusiast');
      expect(out).toContain('dp-persona-mode=enthusiast');
      expect(out).toContain('Path=/');
      expect(out).toContain('Max-Age=');
      expect(out).toContain('SameSite=Lax');
    });

    it('omits Secure by default (dev / http)', () => {
      const out = buildPersonaModeCookieHeader('beginner');
      expect(out).not.toContain('Secure');
    });

    it('includes Secure when requested (prod / https)', () => {
      const out = buildPersonaModeCookieHeader('acharya', { secure: true });
      expect(out).toContain('Secure');
    });

    it('sets a 1-year Max-Age', () => {
      const out = buildPersonaModeCookieHeader('beginner');
      // 1 year = 60 * 60 * 24 * 365 = 31_536_000
      expect(out).toContain('Max-Age=31536000');
    });

    it('emits the literal mode value (no encoding required for ASCII)', () => {
      expect(buildPersonaModeCookieHeader('beginner')).toContain(
        '=beginner;',
      );
      expect(buildPersonaModeCookieHeader('enthusiast')).toContain(
        '=enthusiast;',
      );
      expect(buildPersonaModeCookieHeader('acharya')).toContain(
        '=acharya;',
      );
    });
  });
});
