import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// BASE_URL is read at MODULE LOAD time. To exercise different env states
// we have to re-import the module after mutating process.env. Vitest's
// `vi.resetModules` does this cleanly; the module cache is per-test.
import { vi } from 'vitest';

describe('@/lib/seo/base-url — canonical site origin', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.NEXT_PUBLIC_SITE_URL;
    vi.resetModules();
  });

  afterEach(() => {
    if (originalEnv === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
    vi.resetModules();
  });

  it('falls back to https://dekhopanchang.com when env is unset', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const { BASE_URL } = await import('../base-url');
    expect(BASE_URL).toBe('https://dekhopanchang.com');
  });

  it('uses the env value when set, with trailing whitespace stripped', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com  ';
    const { BASE_URL } = await import('../base-url');
    expect(BASE_URL).toBe('https://example.com');
  });

  it('strips one OR MORE trailing slashes (the PR #266 → #273 bug fix)', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com//';
    const { BASE_URL } = await import('../base-url');
    expect(BASE_URL).toBe('https://example.com');
  });

  it('falls back when env is whitespace-only (would have been empty pre-refactor)', async () => {
    // Pre-refactor Variant B `(env || fallback).trim()` would have returned
    // an empty string here because `'   '` is truthy. The centralised
    // BASE_URL applies `?.trim()` BEFORE the `||` so we get the fallback.
    process.env.NEXT_PUBLIC_SITE_URL = '   ';
    const { BASE_URL } = await import('../base-url');
    expect(BASE_URL).toBe('https://dekhopanchang.com');
  });

  it('handles the combined messy case (whitespace + double slash)', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = '  https://example.com//  ';
    const { BASE_URL } = await import('../base-url');
    expect(BASE_URL).toBe('https://example.com');
  });
});
