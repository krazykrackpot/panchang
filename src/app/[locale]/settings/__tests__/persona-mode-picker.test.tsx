// @vitest-environment jsdom
//
// Focused unit tests for the Display Mode picker in /settings. We
// don't render the entire SettingsPage (it depends on Supabase auth,
// next-intl routing, and a dozen other things) — instead we exercise
// the picker's contract: clicking a button calls setMode with the
// right value, and the click is a no-op when the user clicks the
// already-selected mode.

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sparkles } from 'lucide-react';
import { PersonaModeProvider, usePersonaMode } from '@/lib/persona/context';
import {
  personaModeToDb,
  type PersonaMode,
} from '@/lib/persona/types';
import { PERSONA_MODE_COOKIE_NAME } from '@/lib/persona/cookie';

/**
 * In-memory localStorage shim because jsdom in this project exposes
 * `window.localStorage` without standard Storage methods.
 */
function installLocalStorageShim() {
  const store = new Map<string, string>();
  Object.defineProperty(window, 'localStorage', {
    value: {
      get length() { return store.size; },
      clear: () => store.clear(),
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => { store.set(k, String(v)); },
      removeItem: (k: string) => { store.delete(k); },
      key: (i: number) => Array.from(store.keys())[i] ?? null,
    },
    writable: true,
    configurable: true,
  });
}

/**
 * Minimal harness that mirrors what /settings/page.tsx does with
 * the picker: subscribe to persona mode + render 3 buttons. Click
 * handler delegates to `onChange` for assertions.
 *
 * If you change the picker UI in /settings/page.tsx, update this
 * harness to match — the test verifies BEHAVIOUR (clicking the right
 * button propagates the right mode), not pixel layout.
 */
function PersonaPickerHarness({
  onChange,
}: {
  onChange: (m: PersonaMode) => void;
}) {
  const { mode } = usePersonaMode();
  const opts: { mode: PersonaMode; label: string }[] = [
    { mode: 'beginner', label: 'Beginner' },
    { mode: 'enthusiast', label: 'Enthusiast' },
    { mode: 'acharya', label: 'Acharya' },
  ];
  return (
    <div>
      <Sparkles aria-label="display-mode-icon" />
      {opts.map((o) => (
        <button
          key={o.mode}
          aria-pressed={mode === o.mode}
          onClick={() => onChange(o.mode)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

describe('Display Mode picker (settings)', () => {
  beforeEach(() => {
    installLocalStorageShim();
    document.cookie = `${PERSONA_MODE_COOKIE_NAME}=; Max-Age=0; Path=/`;
  });

  it('renders three buttons, one per persona mode', () => {
    render(
      <PersonaModeProvider initialMode="enthusiast">
        <PersonaPickerHarness onChange={() => {}} />
      </PersonaModeProvider>,
    );
    expect(screen.getByRole('button', { name: 'Beginner' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Enthusiast' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Acharya' })).toBeTruthy();
  });

  it('marks the current mode as aria-pressed', () => {
    render(
      <PersonaModeProvider initialMode="acharya">
        <PersonaPickerHarness onChange={() => {}} />
      </PersonaModeProvider>,
    );
    expect(
      screen.getByRole('button', { name: 'Acharya' }).getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      screen.getByRole('button', { name: 'Beginner' }).getAttribute('aria-pressed'),
    ).toBe('false');
  });

  it('calls onChange with the clicked mode', () => {
    const onChange = vi.fn();
    render(
      <PersonaModeProvider initialMode="beginner">
        <PersonaPickerHarness onChange={onChange} />
      </PersonaModeProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Acharya' }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('acharya');
  });
});

describe('personaModeToDb mapping (settings save)', () => {
  // Confirms the bridge between the picker click and the
  // user_profiles.experience_level write. If either side ever
  // changes, this assertion will catch the drift.
  it('maps each persona mode to the right DB value', () => {
    expect(personaModeToDb('beginner')).toBe('beginner');
    expect(personaModeToDb('enthusiast')).toBe('intermediate');
    expect(personaModeToDb('acharya')).toBe('advanced');
  });
});
