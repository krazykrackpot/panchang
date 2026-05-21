/**
 * CRITICAL REGRESSION TEST: Profile POST must NOT send welcome emails on recompute.
 *
 * Root cause (2026-05-20): Dashboard auto-recomputes stale snapshots by calling
 * POST /api/user/profile. That route sent welcome emails on EVERY call. Combined
 * with a React re-render loop, this caused email bombardment that exhausted the
 * Resend daily quota. Cost: real money, real user annoyance, real quota loss.
 *
 * This test ensures the isRecompute flag is respected.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Profile POST route — email guard', () => {
  const routePath = join(process.cwd(), 'src/app/api/user/profile/route.ts');
  const routeSource = readFileSync(routePath, 'utf-8');

  it('checks isRecompute flag before sending welcome email', () => {
    // The route MUST check isRecompute before the sendEmail block
    expect(routeSource).toContain('isRecompute');
    expect(routeSource).toContain('!isRecompute');
  });

  it('does NOT unconditionally send welcome email', () => {
    // There should be NO path where sendEmail is called without an isRecompute guard
    const emailBlock = routeSource.slice(
      routeSource.indexOf('Send welcome email'),
      routeSource.indexOf('Return summary') > 0 ? routeSource.indexOf('Return summary') : routeSource.length
    );
    // The email block must contain the isRecompute check
    expect(emailBlock).toContain('isRecompute');
  });

  it('dashboard makes NO POST to /api/user/profile (stronger invariant)', () => {
    // History: the dashboard previously fired a recompute POST that was meant
    // to be gated by isRecompute: true. That POST was removed entirely when
    // the infinite reload loop was fixed (see comment at dashboard/page.tsx
    // around "Staleness handled by GET /api/user/profile"). Staleness is now
    // handled inside the GET handler, so the dashboard should never POST.
    //
    // This assertion is STRONGER than the previous one: a missing POST cannot
    // accidentally drop the isRecompute flag and trigger emails.
    const dashboardPath = join(process.cwd(), 'src/app/[locale]/dashboard/page.tsx');
    const dashSource = readFileSync(dashboardPath, 'utf-8');

    // Strip line comments and block comments so a documentation reference to
    // method: 'POST' inside a comment doesn't trigger a false positive.
    const stripped = dashSource
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');

    // Look for any fetch to /api/user/profile with method: 'POST'.
    const profileFetches = stripped.match(/fetch\(\s*['"`]\/api\/user\/profile['"`][\s\S]{0,400}?\)/g) || [];
    const postFetches = profileFetches.filter((block) => /method\s*:\s*['"`]POST['"`]/.test(block));

    expect(postFetches).toEqual([]);
  });
});

describe('CSP — AdSense domains', () => {
  const configPath = join(process.cwd(), 'next.config.ts');
  const configSource = readFileSync(configPath, 'utf-8');

  it('allows all adtrafficquality.google subdomains', () => {
    expect(configSource).toContain('adtrafficquality.google');
    // Must use wildcard or include both ep1 and ep2
    const hasWildcard = configSource.includes('*.adtrafficquality.google');
    const hasBoth = configSource.includes('ep1.adtrafficquality.google') &&
                    configSource.includes('ep2.adtrafficquality.google');
    expect(hasWildcard || hasBoth).toBe(true);
  });
});

describe('Service worker — API route caching safety', () => {
  const swPath = join(process.cwd(), 'public/sw.js');
  const swSource = readFileSync(swPath, 'utf-8');

  it('uses NetworkFirst for general /api/ routes (not CacheFirst)', () => {
    // The general API catch-all must use netFirst, not cacheFirst
    expect(swSource).toContain("if (u.pathname.startsWith('/api/')) { e.respondWith(netFirst(");
  });

  it('profile API is not cached by CacheFirst', () => {
    // /api/user/profile must NEVER be CacheFirst — it sends emails as side effect
    expect(swSource).not.toContain("'/api/user/profile'");
    // Only /api/panchang is allowed CacheFirst (date-specific, no side effects)
  });
});
