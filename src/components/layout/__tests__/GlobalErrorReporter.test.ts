/**
 * Pure-logic tests for GlobalErrorReporter — focused on the hydration
 * signature matcher, which is the only piece of new behaviour that
 * isn't a trivial wrapper around `addEventListener`. The DOM-side
 * wiring is covered indirectly by the runtime crawler
 * (e2e/isr-hydration-crawl.spec.ts).
 */

import { describe, it, expect } from 'vitest';
import { isHydrationMismatchMessage, extractHydrationMessage } from '../GlobalErrorReporter';

describe('isHydrationMismatchMessage', () => {
  it('matches React dev-mode hydration error strings', () => {
    expect(
      isHydrationMismatchMessage(['Hydration failed because the initial UI does not match.']),
    ).toBe(true);
    expect(
      isHydrationMismatchMessage(['There was an error while hydrating but React was able to recover.']),
    ).toBe(true);
    expect(
      isHydrationMismatchMessage(["Warning: Text content did not match. Server: \"Foo\" Client: \"Bar\""]),
    ).toBe(true);
  });

  it('matches React minified production error codes', () => {
    expect(isHydrationMismatchMessage(['Minified React error #418; visit https://...'])).toBe(true);
    expect(isHydrationMismatchMessage(['Minified React error #423; visit https://...'])).toBe(true);
    expect(isHydrationMismatchMessage(['Minified React error #425; visit https://...'])).toBe(true);
  });

  it('does not flag generic console.error calls', () => {
    expect(isHydrationMismatchMessage(['something broke'])).toBe(false);
    expect(isHydrationMismatchMessage(['Warning: useEffect cleanup'])).toBe(false);
    expect(isHydrationMismatchMessage([])).toBe(false);
    expect(isHydrationMismatchMessage([new Error('boom')])).toBe(false);
  });

  it('matches when signature is in a later arg (printf-style format strings)', () => {
    expect(
      isHydrationMismatchMessage(['%s: %s', 'Warning', 'Hydration failed because of mismatch']),
    ).toBe(true);
  });
});

describe('extractHydrationMessage', () => {
  it('returns the signature-bearing arg verbatim, not the format string', () => {
    expect(
      extractHydrationMessage(['%s: %s', 'Warning', 'Hydration failed because of mismatch']),
    ).toBe('Hydration failed because of mismatch');
  });

  it('returns the matching arg even when it is args[0]', () => {
    expect(
      extractHydrationMessage(['Hydration failed because the initial UI does not match.']),
    ).toBe('Hydration failed because the initial UI does not match.');
  });

  it('returns null when no arg carries a signature', () => {
    expect(extractHydrationMessage(['something broke'])).toBe(null);
    expect(extractHydrationMessage([])).toBe(null);
  });

  it('returns the first match if multiple args carry signatures', () => {
    const first = 'Hydration failed first';
    const second = 'Text content did not match second';
    expect(extractHydrationMessage([first, second])).toBe(first);
  });
});
