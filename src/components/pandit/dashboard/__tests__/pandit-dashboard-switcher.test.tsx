// @vitest-environment jsdom
//
// Unit tests for PanditDashboardSwitcher's contract:
//   1. Defaults to the 'client' view on first render (no stored preference).
//   2. Clicking 'Personal' unmounts the client view and mounts the personal view.
//   3. The chosen view is written to localStorage so reloads land on it.
//   4. A pre-set localStorage value is honoured on mount.
//
// We mount only the switcher with two trivial sentinel children — the real
// PanditDashboardHome and SeekerDashboardImpl are tested elsewhere; this
// file pins the toggle BEHAVIOUR independent of the heavy dashboard content.

import { fireEvent, render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import PanditDashboardSwitcher from '../PanditDashboardSwitcher';

const STORAGE_KEY = 'pandit-dashboard-view';

function installLocalStorageShim() {
  const store = new Map<string, string>();
  Object.defineProperty(window, 'localStorage', {
    value: {
      get length() {
        return store.size;
      },
      clear: () => store.clear(),
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, String(v));
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
      key: (i: number) => Array.from(store.keys())[i] ?? null,
    },
    writable: true,
    configurable: true,
  });
}

function renderSwitcher() {
  return render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <PanditDashboardSwitcher
        clientView={<div data-testid="client-content">CRM home</div>}
        personalView={<div data-testid="personal-content">Seeker dashboard</div>}
      />
    </NextIntlClientProvider>,
  );
}

describe('PanditDashboardSwitcher', () => {
  beforeEach(() => {
    installLocalStorageShim();
  });

  it("defaults to 'client' view when no preference is stored", async () => {
    renderSwitcher();

    // The effect that rehydrates from localStorage runs in act();
    // testing-library awaits it via the next microtask flush.
    await act(async () => {});

    expect(screen.getByTestId('client-content')).toBeTruthy();
    expect(screen.queryByTestId('personal-content')).toBeNull();
  });

  it("honours a stored 'personal' preference on mount", async () => {
    window.localStorage.setItem(STORAGE_KEY, 'personal');
    renderSwitcher();
    await act(async () => {});

    expect(screen.getByTestId('personal-content')).toBeTruthy();
    expect(screen.queryByTestId('client-content')).toBeNull();
  });

  it("clicking 'Personal' swaps the rendered view and writes localStorage", async () => {
    renderSwitcher();
    await act(async () => {});

    expect(screen.getByTestId('client-content')).toBeTruthy();

    const personalTab = screen.getByRole('tab', { name: /personal/i });
    fireEvent.click(personalTab);

    expect(screen.getByTestId('personal-content')).toBeTruthy();
    expect(screen.queryByTestId('client-content')).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('personal');
  });

  it("clicking 'Client' from personal view restores client and persists", async () => {
    window.localStorage.setItem(STORAGE_KEY, 'personal');
    renderSwitcher();
    await act(async () => {});

    const clientTab = screen.getByRole('tab', { name: /^client$/i });
    fireEvent.click(clientTab);

    expect(screen.getByTestId('client-content')).toBeTruthy();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('client');
  });

  it('ignores a garbage value in localStorage and falls back to default', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'not-a-real-view');
    renderSwitcher();
    await act(async () => {});

    expect(screen.getByTestId('client-content')).toBeTruthy();
  });

  it("survives a localStorage that throws — falls back to default 'client'", async () => {
    // Simulate Safari private-mode / cookies-blocked: getItem throws.
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => {
          throw new Error('quota exceeded');
        },
        setItem: () => {
          throw new Error('quota exceeded');
        },
      },
      writable: true,
      configurable: true,
    });
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderSwitcher();
    await act(async () => {});

    expect(screen.getByTestId('client-content')).toBeTruthy();
    // A click should also tolerate the write throwing.
    const personalTab = screen.getByRole('tab', { name: /personal/i });
    fireEvent.click(personalTab);
    expect(screen.getByTestId('personal-content')).toBeTruthy();

    errSpy.mockRestore();
  });

  it('exposes proper ARIA roles for the tablist', async () => {
    renderSwitcher();
    await act(async () => {});

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeTruthy();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true'); // client default
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });
});
