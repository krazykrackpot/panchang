/**
 * Sprint 8 — P1 security cluster invariants.
 *
 * Unit-tests the rate-limit IP extraction and structural invariants of
 * the security-cluster changes. Playwright e2e covers the AI-route CSRF
 * gate via actual HTTP requests against localhost.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getClientIP } from '@/lib/api/rate-limit';

describe('P1-3 — getClientIP', () => {
  it('prefers x-real-ip when present', () => {
    const req = new Request('https://example.com', {
      headers: { 'x-real-ip': '203.0.113.5', 'x-forwarded-for': 'attacker, 10.0.0.1' },
    });
    expect(getClientIP(req)).toBe('203.0.113.5');
  });

  it('uses RIGHTMOST x-forwarded-for hop when x-real-ip is absent', () => {
    // The attacker controls the leftmost entry; the Vercel edge appends
    // the trusted hop on the right. Rightmost is what we want.
    const req = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8, 198.51.100.1' },
    });
    expect(getClientIP(req)).toBe('198.51.100.1');
  });

  it('handles single x-forwarded-for value', () => {
    const req = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '198.51.100.1' },
    });
    expect(getClientIP(req)).toBe('198.51.100.1');
  });

  it('returns 127.0.0.1 when no IP headers present (local dev)', () => {
    const req = new Request('https://example.com');
    expect(getClientIP(req)).toBe('127.0.0.1');
  });

  it('trims whitespace + filters empty hops', () => {
    const req = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '  attacker  ,, trusted-edge  ' },
    });
    expect(getClientIP(req)).toBe('trusted-edge');
  });
});

describe('P1-1 — AI routes drop cookie auth fallback (CSRF gate)', () => {
  for (const route of [
    'src/app/api/ai-reading/route.ts',
    'src/app/api/domain-pandit/route.ts',
    'src/app/api/tippanni-llm/route.ts',
    'src/app/api/tippanni/route.ts',
  ]) {
    it(`${route} — no cookie-based auth path`, () => {
      const src = readFileSync(join(process.cwd(), route), 'utf8');
      // The cookie-parsing regex is the marker of the deprecated fallback.
      expect(src).not.toMatch(/sb-\[\^=\]\+-auth-token/);
      // Bearer extraction should still be present.
      expect(src).toMatch(/Bearer/);
    });
  }
});

describe('P1-6 — KP chart fails loud on unknown timezone', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/lib/kp/kp-chart.ts'),
    'utf8',
  );

  it('no silent UTC default — throws on unknown tz', () => {
    expect(src).toMatch(/throw new Error.*Unknown timezone/);
  });

  it('removes the prior `return 0; // Default to UTC` foot-gun', () => {
    expect(src).not.toMatch(/return 0;\s*\/\/\s*Default to UTC/i);
  });
});

describe('P1-2 — track-utm rate-limits by IP, not sessionId', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/track-utm/route.ts'),
    'utf8',
  );

  it('imports getClientIP', () => {
    expect(src).toMatch(/import.*getClientIP.*from.*@\/lib\/api\/rate-limit/);
  });

  it('rate-limit call uses clientIP, not sessionId', () => {
    // The line that calls isRateLimited(...) must pass the IP variable.
    expect(src).toMatch(/isRateLimited\(clientIP\)/);
  });
});

describe('P1-4 — OAuth redirect pinned to NEXT_PUBLIC_SITE_URL', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/stores/auth-store.ts'),
    'utf8',
  );
  // The DRY refactor moved the env-pin into the shared @/lib/seo/base-url
  // module. auth-store now imports BASE_URL from there; base-url.ts is the
  // single source of truth for the env-pin. We assert both halves of the
  // chain so a future regression that bypasses the import OR hardcodes the
  // URL in base-url.ts is caught.
  const baseUrlSrc = readFileSync(
    join(process.cwd(), 'src/lib/seo/base-url.ts'),
    'utf8',
  );

  it('auth-store imports BASE_URL from the canonical env-pinned module', () => {
    expect(src).toMatch(/import\s*\{\s*BASE_URL\s*\}\s*from\s*['"]@\/lib\/seo\/base-url['"]/);
  });

  it('@/lib/seo/base-url is sourced from NEXT_PUBLIC_SITE_URL', () => {
    // The env-pin must live in base-url.ts. Anyone replacing it with a
    // hardcoded URL or window.location.origin will fail this assertion.
    expect(baseUrlSrc).toMatch(/process\.env\.NEXT_PUBLIC_SITE_URL/);
  });

  it('signInWithGoogle uses the env-pinned BASE_URL (not window.location.origin)', () => {
    // signInWithGoogle's redirectTo must reference BASE_URL or baseUrl,
    // not window.location.origin directly.
    const signInBlock = src.slice(src.indexOf('signInWithGoogle:'));
    expect(signInBlock).toMatch(/redirectTo:\s*`\$\{(?:BASE_URL|baseUrl)\}/);
  });

  it('no bare `window.location.origin` used in redirectTo for OAuth/reset', () => {
    // Specifically the redirectTo arg should reference baseUrl, not window.location.origin.
    // This regex is conservative — just checks the literal pattern is absent.
    expect(src).not.toMatch(/redirectTo: window\.location\.origin/);
  });
});

describe('P1-5 — replay-safe trigger functions (migrations 002 + 003)', () => {
  for (const file of ['supabase/migrations/002_user_profiles.sql', 'supabase/migrations/003_subscriptions.sql']) {
    it(`${file} — has SET search_path + EXCEPTION + ON CONFLICT`, () => {
      const src = readFileSync(join(process.cwd(), file), 'utf8');
      expect(src).toMatch(/SET search_path = public/);
      expect(src).toMatch(/EXCEPTION WHEN OTHERS/);
      expect(src).toMatch(/ON CONFLICT/);
    });
  }
});
