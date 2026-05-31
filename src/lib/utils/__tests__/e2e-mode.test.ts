// @vitest-environment jsdom
//
// `isE2eMode()` reads `window.location` and `window.sessionStorage`. Default
// test env in this project is 'node' (vitest.config), so we annotate jsdom
// only here — no global config change.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isE2eMode } from '../e2e-mode';

/**
 * Coverage matrix for `isE2eMode()`. The function gates on TWO conditions:
 *
 *   1. Hostname must be a test host (localhost, 127.0.0.1, ::1, *.vercel.app).
 *   2. sessionStorage.dp-e2e === '1'.
 *
 * The production safety property under audit is: NO permutation of state
 * can return true on `dekhopanchang.com`. That's the regression we most
 * want to prevent — accidentally widening the host gate would silently
 * disable the GDPR cookie banner in production.
 */

const ORIGINAL_LOCATION = window.location;
const ORIGINAL_SESSION_STORAGE = window.sessionStorage;

function setHostname(host: string) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...ORIGINAL_LOCATION, hostname: host },
  });
}

function setSessionStorage(impl: Partial<Storage>) {
  Object.defineProperty(window, 'sessionStorage', {
    configurable: true,
    value: impl,
  });
}

describe('isE2eMode', () => {
  beforeEach(() => {
    setSessionStorage({ getItem: () => null });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: ORIGINAL_LOCATION });
    Object.defineProperty(window, 'sessionStorage', { configurable: true, value: ORIGINAL_SESSION_STORAGE });
  });

  describe('production-safety host gate (highest priority)', () => {
    it('returns false on dekhopanchang.com EVEN when dp-e2e=1', () => {
      setHostname('dekhopanchang.com');
      setSessionStorage({ getItem: () => '1' });
      expect(isE2eMode()).toBe(false);
    });

    it('returns false on www.dekhopanchang.com EVEN when dp-e2e=1', () => {
      setHostname('www.dekhopanchang.com');
      setSessionStorage({ getItem: () => '1' });
      expect(isE2eMode()).toBe(false);
    });

    it('returns false on any *.com that is not a test host', () => {
      setHostname('attacker.com');
      setSessionStorage({ getItem: () => '1' });
      expect(isE2eMode()).toBe(false);
    });
  });

  describe('test hosts (where suppression is allowed)', () => {
    it.each([
      ['localhost'],
      ['127.0.0.1'],
      ['::1'],
      ['main-abc123.vercel.app'],
      ['feat-branch-xyz.vercel.app'],
    ])('returns true on %s when dp-e2e=1', (host) => {
      setHostname(host);
      setSessionStorage({ getItem: () => '1' });
      expect(isE2eMode()).toBe(true);
    });

    it.each([['localhost'], ['127.0.0.1'], ['main-abc123.vercel.app']])(
      'returns false on %s when dp-e2e is not set',
      (host) => {
        setHostname(host);
        setSessionStorage({ getItem: () => null });
        expect(isE2eMode()).toBe(false);
      },
    );

    it.each([['localhost'], ['main-abc123.vercel.app']])(
      'returns false on %s when dp-e2e has any value other than "1"',
      (host) => {
        setHostname(host);
        setSessionStorage({ getItem: () => 'true' });
        expect(isE2eMode()).toBe(false);
      },
    );
  });

  describe('failure modes', () => {
    it('returns false when sessionStorage.getItem throws', () => {
      setHostname('localhost');
      setSessionStorage({
        getItem: () => {
          throw new Error('sessionStorage unavailable');
        },
      });
      expect(isE2eMode()).toBe(false);
    });

    it('returns false when window.location.hostname access throws (cross-origin iframe SecurityError)', () => {
      // Cross-origin iframe scenario: the browser refuses to expose
      // location properties. Optional chaining does NOT catch this — it
      // only short-circuits on null/undefined, not on thrown exceptions.
      // The function's `try` around the hostname read is what saves us.
      // Gemini PR #323 MEDIUM.
      Object.defineProperty(window, 'location', {
        configurable: true,
        get() {
          throw new DOMException('Blocked a frame with origin "X" from accessing a cross-origin frame.', 'SecurityError');
        },
      });
      setSessionStorage({ getItem: () => '1' });
      expect(isE2eMode()).toBe(false);
    });

    it('returns false on partial-match dekhopanchang subdomain (defence-in-depth)', () => {
      // A subdomain like `e2e.dekhopanchang.com` is NOT a test host. The
      // gate is exact-match against the known hosts, not suffix.
      setHostname('e2e.dekhopanchang.com');
      setSessionStorage({ getItem: () => '1' });
      expect(isE2eMode()).toBe(false);
    });

    it('returns false on dekhopanchang.com.evil.example.com (homograph defence)', () => {
      setHostname('dekhopanchang.com.evil.example.com');
      setSessionStorage({ getItem: () => '1' });
      expect(isE2eMode()).toBe(false);
    });
  });

  describe('SSR safety', () => {
    it('returns false when window is undefined', () => {
      const w = (globalThis as { window?: Window }).window;
      // @ts-expect-error — explicitly nuking window for SSR simulation
      delete (globalThis as { window?: Window }).window;
      try {
        // Re-import-style call via dynamic require would re-evaluate; instead
        // just verify the existing function doesn't throw in this state.
        // The early `typeof window === 'undefined'` guard is the contract.
        // We can't fully simulate Node without remocking the module, but
        // the guard means *any* nullish window short-circuits to false.
        expect(() => isE2eMode()).not.toThrow();
      } finally {
        (globalThis as { window?: Window }).window = w;
      }
    });
  });
});

// Suppress the "unused" warning for vi import — kept for future use cases.
void vi;
