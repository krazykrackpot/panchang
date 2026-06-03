// @vitest-environment jsdom
//
// Hook + provider tests for `PersonaModeProvider` / `usePersonaMode`.
// Default test env in this project is 'node' (vitest.config); we annotate
// jsdom only here because the provider uses `window.localStorage` and
// hydration effects that need the DOM.

import { act, render, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { PersonaModeProvider, usePersonaMode } from '../context';
import { PERSONA_MODE_COOKIE_NAME } from '../cookie';
import { DEFAULT_PERSONA_MODE } from '../types';

function wrapper(
  initialMode: 'beginner' | 'enthusiast' | 'acharya' | undefined,
) {
  return ({ children }: { children: React.ReactNode }) => (
    <PersonaModeProvider initialMode={initialMode}>
      {children}
    </PersonaModeProvider>
  );
}

/**
 * In-memory localStorage shim. The jsdom build shipped with this
 * project exposes `window.localStorage` as an object literal without
 * the standard Storage methods, so accessing `setItem` / `getItem`
 * throws. We replace it with a Map-backed shim that implements the
 * Storage interface for the duration of these tests.
 */
function installLocalStorageShim() {
  const store = new Map<string, string>();
  const shim: Storage = {
    get length() {
      return store.size;
    },
    clear: () => {
      store.clear();
    },
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
  };
  Object.defineProperty(window, 'localStorage', {
    value: shim,
    writable: true,
    configurable: true,
  });
}

describe('PersonaModeProvider + usePersonaMode', () => {
  beforeAll(() => {
    installLocalStorageShim();
  });

  beforeEach(() => {
    // Each test gets a clean storage slate via the shim's clear().
    window.localStorage.clear();
    document.cookie = `${PERSONA_MODE_COOKIE_NAME}=; Max-Age=0; Path=/`;
  });

  it('returns the SSR-derived initialMode on first render (no flicker)', () => {
    const { result } = renderHook(() => usePersonaMode(), {
      wrapper: wrapper('acharya'),
    });
    expect(result.current.mode).toBe('acharya');
  });

  it('reports isHydrated=true after the effect runs', async () => {
    const { result } = renderHook(() => usePersonaMode(), {
      wrapper: wrapper('beginner'),
    });
    // After render + effect, isHydrated flips to true.
    expect(result.current.isHydrated).toBe(true);
  });

  it('syncs localStorage with the SSR value when storage is empty', () => {
    renderHook(() => usePersonaMode(), { wrapper: wrapper('acharya') });
    expect(window.localStorage.getItem(PERSONA_MODE_COOKIE_NAME)).toBe(
      'acharya',
    );
  });

  it('overwrites localStorage when it disagrees with the SSR value (cookie wins)', () => {
    window.localStorage.setItem(PERSONA_MODE_COOKIE_NAME, 'beginner');
    renderHook(() => usePersonaMode(), { wrapper: wrapper('enthusiast') });
    expect(window.localStorage.getItem(PERSONA_MODE_COOKIE_NAME)).toBe(
      'enthusiast',
    );
  });

  it('restores from localStorage when the cookie is absent (Gemini PR #381 HIGH)', () => {
    // Cookie was cleared (e.g., user wiped cookies) but localStorage
    // still holds the previously-chosen mode. The provider should
    // restore that mode rather than overwriting it with the default.
    window.localStorage.setItem(PERSONA_MODE_COOKIE_NAME, 'acharya');
    const { result } = renderHook(() => usePersonaMode(), {
      wrapper: wrapper(undefined),
    });
    expect(result.current.mode).toBe('acharya');
    // The cookie should also have been re-set so subsequent SSR
    // renders hit the fast path again.
    expect(document.cookie).toContain(
      `${PERSONA_MODE_COOKIE_NAME}=acharya`,
    );
    // localStorage value preserved (not overwritten with default).
    expect(window.localStorage.getItem(PERSONA_MODE_COOKIE_NAME)).toBe(
      'acharya',
    );
  });

  it('falls back to default when both cookie and localStorage are absent', () => {
    const { result } = renderHook(() => usePersonaMode(), {
      wrapper: wrapper(undefined),
    });
    expect(result.current.mode).toBe(DEFAULT_PERSONA_MODE);
  });

  it('ignores an invalid localStorage value when the cookie is absent', () => {
    // Tampered / stale localStorage value should not break the UI.
    window.localStorage.setItem(PERSONA_MODE_COOKIE_NAME, 'expert');
    const { result } = renderHook(() => usePersonaMode(), {
      wrapper: wrapper(undefined),
    });
    expect(result.current.mode).toBe(DEFAULT_PERSONA_MODE);
  });

  it('setMode updates context + cookie + localStorage', () => {
    const { result } = renderHook(() => usePersonaMode(), {
      wrapper: wrapper('beginner'),
    });
    act(() => {
      result.current.setMode('acharya');
    });
    expect(result.current.mode).toBe('acharya');
    expect(window.localStorage.getItem(PERSONA_MODE_COOKIE_NAME)).toBe(
      'acharya',
    );
    expect(document.cookie).toContain(
      `${PERSONA_MODE_COOKIE_NAME}=acharya`,
    );
  });

  it('falls back gracefully when called outside a provider', () => {
    // Calling usePersonaMode without a Provider returns the default
    // mode + a no-op setter. Useful for orphan / fixture rendering.
    const { result } = renderHook(() => usePersonaMode());
    expect(result.current.mode).toBe(DEFAULT_PERSONA_MODE);
    expect(result.current.isHydrated).toBe(false);
    // Setter is a no-op (does not throw).
    expect(() => result.current.setMode('acharya')).not.toThrow();
    expect(result.current.mode).toBe(DEFAULT_PERSONA_MODE);
  });

  it('still renders children when provider mounts (smoke)', () => {
    const { getByText } = render(
      <PersonaModeProvider initialMode="enthusiast">
        <div>child content</div>
      </PersonaModeProvider>,
    );
    expect(getByText('child content')).toBeTruthy();
  });
});
